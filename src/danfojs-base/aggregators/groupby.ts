import { Console } from "console";
import DataFrame from "../core/frame"
import { ArrayType1D, ArrayType2D } from "../shared/types"
import { variance, std, median, mode, mean } from 'mathjs';
import Utils from "../shared/utils";
import  concat from "../transformers/concat"


/**
 * The class performs all groupby operation on a dataframe
 * involving all aggregate funciton
 * @param {colDict} colDict Object of unique keys in the group by column
 * @param {keyCol} keyCol Array contains the column names
 * @param {data} Array the dataframe data
 * @param {columnName} Array of all column name in the dataframe.
 * @param {colDtype} Array columns dtype
 */
export default class Groupby {
  colDict?: { [key: string ]: {} }
  keyCol: ArrayType1D
  data?: ArrayType2D | null
  columnName: ArrayType1D
  colDtype: ArrayType1D
  colIndex: ArrayType1D
  groupDict?: any
  groupColNames?: Array<string>
  
  constructor(keyCol: ArrayType1D, data: ArrayType2D | null, columnName: ArrayType1D, colDtype:ArrayType1D, colIndex: ArrayType1D) {

    this.keyCol = keyCol;
    this.data = data;
    this.columnName = columnName;
    //this.dataTensors = {}; //store the tensor version of the groupby data
    this.colDtype = colDtype;
    this.colIndex = colIndex

  }

  group2(): Groupby{
    this.groupDict = this.data?.reduce((prev, current)=>{
      function dfs(arr: ArrayType1D, value: ArrayType1D, obj: any) {
        let firstIndex = arr[0]
        let remainingndex = arr.slice(1)
  
        if(!remainingndex.length) {
          value.forEach((el, i) => {
            el = String(el)
            if (i == firstIndex) {
              if (el in Object.keys(obj)) {
                obj[el].push(value)
              } else {
                obj[el] = [value]
              }
            }
          });
        } else {
          value.forEach((el, i) => {
            if (i == firstIndex) {
              el = String(el)
              if (el as string in obj) {
                obj[el]  = dfs(remainingndex, value, obj[el])
              }
              else {
                obj[el] = dfs(remainingndex,  value, {})
              }
            }
          })
        }
        return obj
      }
      
      prev = dfs(this.colIndex, current, prev)
      return prev

    }, {})

    delete this.data
    return this
  }

  group():  Groupby{
    const self = this
    const group = this.data?.reduce((prev: any, current)=>{
      let indexes= []
      for(let i in self.colIndex) {
        let index = self.colIndex[i] as number
        indexes.push(current[index])
      }
      let index = indexes.join('-') 
      
      if(prev[index]) {
        let data = prev[index]
        for (let i in self.columnName) {
          let colName = self.columnName[i] as string
          data[colName].push(current[i])
        }
      } else {
        prev[index] = {}
        for (let i in self.columnName) {
          let colName = self.columnName[i] as string
          prev[index][colName] = [current[i]]
        }
      }
      return prev

    }, {})
    this.colDict = group
    return this
  }

  col(colNames: ArrayType1D | undefined): Groupby {
    
    if (typeof colNames === "undefined") {
      colNames = this.columnName.filter((_, index)=>{
        return !this.colIndex.includes(index)
      })
    }
    let self = this
    colNames.forEach((val) => {
      if (!self.columnName.includes(val)) 
        throw new Error(`Column ${val} does not exist in groups`)
    })
    let colDict: { [key: string ]: {} } = {...this.colDict}
    for(let [key, values] of Object.entries(colDict)) {
      let c: { [key: string ]: [] } = {}
      let keyVal: any = {...values}
      for(let colKey in colNames) {
        let colName = colNames[colKey] as string
        c[colName] = keyVal[colName] 
      }
      colDict[key] = c
    }
    const gp = new Groupby(
      this.keyCol,
      null,
      this.columnName,
      this.colDtype,
      this.colIndex
    )
    gp.colDict = colDict
    gp.groupColNames = colNames as Array<string>

    return gp
  }

  arithemetic(operation: {[key: string] : string} | string): { [key: string ]: {} } {

    const opsName = [ "mean", "sum", "count", "mode", "std", "var", "cumsum", "cumprod",
    "cummax", "cummin", "median" , "min"];
    if (typeof operation === "string" ) {
      if (!opsName.includes(operation)) {
        throw new Error(`group operation: ${operation} is not valid`)
      }
    } else {
      Object.keys(operation).forEach((key)=>{
        let ops = operation[key]
        if (!opsName.includes(ops)) {
          throw new Error(`group operation: ${ops} for column ${key} is not valid`)
        }
      })
    }
    let colDict: { [key: string ]: {} } = {...this.colDict}
    for(const [key, values] of Object.entries(colDict)) {
      let colVal: { [key: string ]: Array<number> } = {}
      let keyVal: any = {...values}
      let groupColNames: Array<string> = this.groupColNames as Array<string>
      for(let colKey=0; colKey < groupColNames.length; colKey++) {
        let colName = groupColNames[colKey]
        let colIndex = this.columnName.indexOf(colName)
        let colDtype = this.colDtype[colIndex]
        if (colDtype === "string") throw new Error(`Can't perform math operation on column ${colName}`)

        if (typeof operation === "string") {
          colVal[colName] = this.groupMathLog(keyVal[colName], operation)
        }
        else {
          colVal[colName] = this.groupMathLog(keyVal[colName], operation[colName])
        }
      }
      colDict[key] = colVal
    }
    return colDict
  }

  groupMathLog(colVal: Array<number>, ops: string): Array<number>{
    let data = []
    switch(ops) {
      case "max":
        let max = colVal.reduce((prev, curr)=> {
          if (prev > curr) {
            return prev
          }
          return curr
        })
        data.push(max)
        break;
      case "min":
        let min = colVal.reduce((prev, curr)=> {
          if (prev < curr) {
            return prev
          }
          return curr
        })
        data.push(min)
        break;
      case "sum":
        let sum = colVal.reduce((prev, curr)=> {
          return prev + curr
        })
        data.push(sum)
        break;
      case "count":
        data.push(colVal.length)
        break;
      case "mean":
        let sumMean = colVal.reduce((prev, curr)=> {
          return prev + curr
        })
        data.push(sumMean / colVal.length)
        break;
      case "std":
        data.push(std(colVal))
        break;
      case "var":
        data.push(variance(colVal))
        break;
      case "median":
        data.push(median(colVal))
        break;
      case "mode":
        data.push(mode(colVal))
        break;
      case "cumsum":
        colVal.reduce((prev, curr) => {
          let sum = prev + curr
          data.push(sum)
          return sum
        }, 0)
        break;
      case "cummin":
        data = [colVal[0]]
        colVal.slice(1,).reduce((prev, curr)=>{
          if (prev < curr) {
            data.push(prev)
            return prev
          }
          data.push(curr)
          return curr
        }, data[0])
        break;
      case "cummax":
        data = [colVal[0]]
        colVal.slice(1,).reduce((prev, curr)=> {
          if (prev > curr) {
            data.push(prev)
            return prev
          }
          data.push(curr)
          return curr
        }, data[0])
        break;
      case "cumprod":
        colVal.reduce((prev, curr) => {
          let sum = prev * curr
          data.push(sum)
          return sum
        }, 1)
        break;
    }
    return data
  }
}
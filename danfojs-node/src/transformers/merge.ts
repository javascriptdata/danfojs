/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/

import DataFrame from "../core/frame"
import { ArrayType1D, ArrayType2D } from "shared/types"
import Utils from "../shared/utils";
const utils = new Utils();

type mergeParam = {
  left: DataFrame,
  right: DataFrame,
  on: Array<string>,
  how: "outer" | "inner" | "left" | "right"
}

type keyComb = {
  [key: string] : {
    filters: ArrayType2D,
    combValues: ArrayType1D
  }
}

class Merge {
  left: DataFrame
  right: DataFrame
  on: Array<string>
  how: "outer" | "inner" | "left" | "right"
  leftColIndex: ArrayType1D = []
  rightColIndex: ArrayType1D = []
  leftCol?: ArrayType1D
  rightCol?: ArrayType1D
  columns?: ArrayType1D

  constructor({left, right, on, how}: mergeParam) {
    this.left = left
    this.right = right
    this.on = on
    this.how = how

    for(let i =0; i < this.on.length; i++) {
      let key = this.on[i]
      if (this.left.columns.includes(key) && this.right.columns.includes(key)) {
        let leftIndex = this.left.columns.indexOf(key)
        let rightIndex = this.right.columns.indexOf(key)
        this.leftColIndex.push(leftIndex)
        this.rightColIndex.push(rightIndex)
      }
    }
  }

  private generateKeyCombination(values: ArrayType2D, colIndex: ArrayType1D): keyComb {
    let colKeyComb: keyComb = {}

    for (let i=0; i < values.length; i++) {
      let rowValues = values[i]
      let rowKeyCombValues = [];
      for (let j =0; j < colIndex.length; j++) {
        let index = colIndex[j] as number
        rowKeyCombValues.push(rowValues[index])
      }
      let rowKeyComb = rowKeyCombValues.join('_')
      let otherValues = rowValues.filter((val, index) => {
        return !colIndex.includes(index)
      })
      if (utils.keyInObject(colKeyComb, rowKeyComb)) {
        colKeyComb[rowKeyComb].filters.push(otherValues)
      } else {
        colKeyComb[rowKeyComb] = {
          filters: [otherValues],
          combValues: rowKeyCombValues
        }
      }
    }
    return colKeyComb
  }

  private createColumns() {
    const self = this
    this.leftCol = self.left.columns.filter((_, index)=>{
      return !self.leftColIndex.includes(index)
    })
    this.rightCol = self.right.columns.filter((_, index) => {
      return !self.rightColIndex.includes(index)
    })
    this.columns = [...this.on]
    const duplicateColumn: {
      [key: string] : number
    } = {}
    const tempColumn = [...this.leftCol]
    tempColumn.push(...this.rightCol)
    for (let i=0; i< tempColumn.length; i++) {
      const col = tempColumn[i] as string
      if (utils.keyInObject(duplicateColumn, col)) {
        let columnName = `${col}_${duplicateColumn[col]}`
        this.columns.push(columnName)
        duplicateColumn[col] +=1
      } else {
        this.columns.push(col)
        duplicateColumn[col] = 1
      }
    } 
  }

  private basic(keys: ArrayType1D, leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const data = []
    for (let i=0; i < keys.length; i++) {
      const key = keys[i] as string
      
      if (utils.keyInObject(leftKeyDict, key)) {
        const leftRows = leftKeyDict[key].filters
        const leftCombValues = leftKeyDict[key].combValues

        for (let lIndex=0; lIndex < leftRows.length; lIndex++) {
          const leftRow = leftRows[lIndex]
          if (utils.keyInObject(rightKeyDict, key)) {
            const rightRows = rightKeyDict[key].filters
            for (let rIndex=0; rIndex < rightRows.length; rIndex++) {
              const rightRow = rightRows[rIndex]
              const combineData = leftCombValues.slice(0)
              combineData.push(...leftRow)
              combineData.push(...rightRow)
              data.push(combineData)
            }
          } else {
            const nanArray = Array(this.rightCol?.length).fill(NaN)
            const combineData = leftCombValues.slice(0)
            combineData.push(...leftRow)
            combineData.push(...nanArray)
            data.push(combineData)
          }
        }
      } else {
        const rightRows = rightKeyDict[key].filters
        const rightCombValues = rightKeyDict[key].combValues

        for (let i =0; i < rightRows.length; i++) {
          const rightRow = rightRows[i]
          const nanArray = Array(this.leftCol?.length).fill(NaN)
          const combineData = rightCombValues.slice(0)
          combineData.push(...nanArray)
          combineData.push(...rightRow)
          data.push(combineData)

        }
      }
    }
    return data
  }

  private outer(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const keys = Object.keys(leftKeyDict)
    keys.push(...Object.keys(rightKeyDict))

    const UniqueKeys = Array.from(new Set(keys))
    const data = this.basic(UniqueKeys, leftKeyDict, rightKeyDict)
    return data
  }

  private inner(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const leftKey = Object.keys(leftKeyDict)
    const rightKey = Object.keys(rightKeyDict)
    const keys = leftKey.filter((val) => rightKey.includes(val))
    const data = this.basic(keys, leftKeyDict, rightKeyDict)
    return data
  }

  private leftMerge(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const keys = Object.keys(leftKeyDict)
    const data = this.basic(keys, leftKeyDict, rightKeyDict)
    return data
  }

  private rightMerge(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const keys = Object.keys(rightKeyDict)
    const data = this.basic(keys, leftKeyDict, rightKeyDict)
    return data
  }

  operation(): DataFrame {
    let leftValues = this.left.values as ArrayType2D
    let rightValues = this.right.values as ArrayType2D
    let leftKeyDict = this.generateKeyCombination(leftValues, this.leftColIndex)
    let rightKeyDict = this.generateKeyCombination(rightValues, this.rightColIndex)

    this.createColumns()
    
    let data: ArrayType2D= []
    switch (this.how) {
      case "outer":
        data = this.outer(leftKeyDict, rightKeyDict)
        break;
      case "inner":
        data = this.inner(leftKeyDict, rightKeyDict)
        break;
      case "left":
        data = this.leftMerge(leftKeyDict, rightKeyDict)
        break;
      case "right":
        data = this.rightMerge(leftKeyDict, rightKeyDict)
        break;
    }
    const columns = this.columns as Array<string>
    return new DataFrame(data, {columns: [...columns]})

  }

}

export default function merge(params: mergeParam): DataFrame {
  const mergeClass = new Merge(params)
  return mergeClass.operation()
}
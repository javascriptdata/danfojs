/**
*  @license
* Copyright 2022 JsData. All rights reserved.
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
import { ArrayType1D, ArrayType2D } from "../shared/types"
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

    //Obtain the column index of the column will
    //want to merge on for both left and right dataframe
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

  /**
   * Generate key combination base on the columns we want to merge on
   * e.g  df = {
   *  key1: ["KO", "K0", "K3", "K4"],
   *  Key2: ["K1", "K1", "K3", "K5"],
   *  A: [1,2,3,4]
   *  B: [3,4,5,6]
   * }
   * keycomb = generateKeyCombination(df.values, [0,1]) 
   * This should output
   * {
   *  'k0_k1': {
   *      filters: [[1,3], [2,4]], # the value of other columns in thesame row with the combination keys
   *      combValues: ["KO", "k1"] # the combination key from column Key1 (index 2) and key2 (index 1)
   *  },
   *  'K3_K3 : {
   *      filters: [[3,5]],
   *      combValues: ['K3', 'k3']
   *  },
   *  'k4_k5' : {
   *      filters: [[4,6]]
   *      combValues: ['K4', 'K5']
   *  }
   * }
   * This key combination will be generated for both left and right dataframe
   * @param values 
   * @param colIndex 
   */
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

  /**
   * Generate columns for the newly generated merged DataFrame
   * e.g df = {
   *  key1: ["KO", "K0", "K3", "K4"],
   *  Key2: ["K1", "K1", "K3", "K5"],
   *  A: [1,2,3,4]
   *  B: [3,4,5,6]
   * }
   * df2 = {
   *  key1: ["KO", "K0", "K3", "K4"],
   *  Key2: ["K1", "K1", "K3", "K5"],
   *  A: [1,2,3,4]
   *  c: [3,4,5,6]
   * }
   * And both dataframe are to be merged on `key1` and `key2`
   * the newly generated column will be of the form
   * columns = ['key1', 'Key2', 'A', 'A_1', 'B', 'C']
   * Notice 'A_1' , this because both DataFrame as column A and 1 is the 
   * number of duplicate of that column
   */
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

  /**
   * The basic methos perform the underneath operation of generating
   * the merge dataframe; using the combination keys generated from
   * bothe left and right DataFrame
   * e.g df = {
   *  key1: ["KO", "K0", "K3", "K4"],
   *  Key2: ["K1", "K1", "K3", "K5"],
   *  A: [1,2,3,4]
   *  B: [3,4,5,6]
   * }
   * df2 = {
   *  key1: ["KO", "K0", "K3", "K4"],
   *  Key2: ["K1", "K2", "K4", "K5"],
   *  A: [3,6,8,9]
   *  c: [2,4,6,8]
   * }
   * Running generatekeyCombination on both left and right data frame
   * we should have
   * leftKeyDict = {
   *  'k0_k1': {
   *      filters: [[1,3], [2,4]], 
   *      combValues: ["KO", "k1"] 
   *  },
   *  'K3_K3' : {
   *      filters: [[3,5]],
   *      combValues: ['K3', 'k3']
   *  },
   *  'k4_k5' : {
   *      filters: [[4,6]]
   *      combValues: ['K4', 'K5']
   *  }
   * }
   * rightKeyDict = {
   *  'k0_k1': {
   *      filters: [[3,2]], 
   *      combValues: ["KO", "k1"] 
   *  },
   *  'K0_K2': {
   *      filters: [[6,4]],
   *      combValues: ['K0', 'K2']
   *  },
   *  'K3_K4' : {
   *      filters: [[8,9]],
   *      combValues: ['K3', 'k4']
   *  },
   *  'k4_k5' : {
   *      filters: [[9,8]]
   *      combValues: ['K4', 'K5']
   *  }
   * }
   * The `keys` is generated base on the type of merge operation we want to 
   * perform. If we assume we are performing `outer` merge (which is a set of the 
   * key combination from both leftKeyDict and rightKeyDict) then Keys should be
   * this 
   * keys = ['K0_K1', 'K3_K3', 'k4_k5', 'K0_K2', 'k3_k4']
   * The Keys, leftKeyDict and rightKeyDict are used to generated DataFrame data,
   * by looping through the Keys and checking if leftKeyDict and rightKeyDict as the
   * key if one of them does not the column in that row will be NaN
   * e.g Data for each row base on keys
   * COLUMNS = ['key1', 'Key2', 'A', 'B', 'A_1', 'C']
   * 'K0_K1':  ['K0',   'K1',   1,    3 ,   3,   2 ]
   * 'K0_K1':  ['K0',   'K1',   2,    4,   NaN, NaN]
   * 'K3_K3':  ['k3',   'K3',   3,    5,  NaN,  NaN]
   * 'K4_K5':  ['K4',   'K5',   4,    6,  9,    8]
   * 'k0_K2':  ['k0',   'K2'    NaN,  NaN, 6,   4]
   * 'k3_k4':  ['K3',   'K4',   NaN,  NaN, 8, 6]
   * 
   * @param keys 
   * @param leftKeyDict 
   * @param rightKeyDict 
   */
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

  /**
   * Generate outer key from leftKeyDict and rightKeyDict
   * The Key pass into basic method is the union of
   * leftKeyDict and rightKeyDict
   * @param leftKeyDict 
   * @param rightKeyDict 
   */
  private outer(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const keys = Object.keys(leftKeyDict)
    keys.push(...Object.keys(rightKeyDict))

    const UniqueKeys = Array.from(new Set(keys))
    const data = this.basic(UniqueKeys, leftKeyDict, rightKeyDict)
    return data
  }

  /**
   * Generate Key for basic method,
   * the key geneerated is the intersection of
   * leftKeyDict and rightKeyDict
   * @param leftKeyDict 
   * @param rightKeyDict 
   */
  private inner(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const leftKey = Object.keys(leftKeyDict)
    const rightKey = Object.keys(rightKeyDict)
    const keys = leftKey.filter((val) => rightKey.includes(val))
    const data = this.basic(keys, leftKeyDict, rightKeyDict)
    return data
  }


  /**
   * The key is the leftKeyDict
   * @param leftKeyDict 
   * @param rightKeyDict 
   */
  private leftMerge(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const keys = Object.keys(leftKeyDict)
    const data = this.basic(keys, leftKeyDict, rightKeyDict)
    return data
  }

  /**
   * The key is the rightKeyDict
   * @param leftKeyDict 
   * @param rightKeyDict 
   */
  private rightMerge(leftKeyDict: keyComb, rightKeyDict: keyComb): ArrayType2D {
    const keys = Object.keys(rightKeyDict)
    const data = this.basic(keys, leftKeyDict, rightKeyDict)
    return data
  }
  
  /**
   * Perform the merge operation
   * 1) Obtain both left and right dataframe values
   * 2) Generate the leftkeyDict and rightKeyDict
   * 3) Generate new merge columns
   * 4) check how merge is to be done and apply the 
   * right methods
   */
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

/**
 * Perform merge operation between two DataFrame
 * @param params : {
 * left: DataFrame
 * right: DataFrame
 * on: Array<string>
 * how: "outer" | "inner" | "left" | "right"
 * }
 */
export default function merge(params: mergeParam): DataFrame {
  const mergeClass = new Merge(params)
  return mergeClass.operation()
}
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

import Series from "../core/series"
import DataFrame from "../core/frame"
import { ArrayType1D, ArrayType2D } from "../shared/types"

/**
 * 
 * @param dfList Array<DataFrame | Series>
 * @param axis number
 * @returns DataFrame
 */
function processColumn(dfList: Array<DataFrame | Series>, axis: number ): DataFrame {
  let allDf: any = {}
  let dublicateColumns: any = {}
  let maxLen = 0
  for(let i=0; i < dfList.length; i++) {
    let df = dfList[i]
    let columnData: ArrayType2D;
    if ( df instanceof DataFrame) {
      columnData = df.getColumnData as ArrayType2D
    } else {
      columnData = [df.values] as ArrayType2D
    }
    let columns = df.columns
    for(let j=0; j < columns.length; j++) {
      let column = columns[j]
      let colData: ArrayType1D = columnData[j]
      if (colData.length > maxLen) {
        maxLen = colData.length
      }
      if (!(column in allDf)) {
        allDf[column] = colData
        dublicateColumns[column] = 0
      } else {
        dublicateColumns[column] +=1
        column += dublicateColumns[column]
        allDf[column] = colData
      }
    }
  }
  Object.keys(allDf).forEach(value => {
    let colLength = allDf[value].length
    if  (colLength < maxLen) {
      let residualLen = maxLen - colLength
      let nanList = new Array(residualLen).fill(NaN)
      allDf[value].push(...nanList)
    }
  })

  return new DataFrame(allDf)
}

/**
 * Concat data along rows
 * @param dfList Array<DataFrame | Series>
 * @param axis  Array<DataFrame | Series>
 * @returns DataFrame
 */
function processRow(dfList: Array<DataFrame | Series>, axis: number ): DataFrame | Series {
    let allDf: any = {}
    let maxLen = 0
    for (let i=0; i < dfList.length; i++) {
      let df = dfList[i]
      let columns = df.columns
      let columnData: ArrayType2D;
      if ( df instanceof DataFrame) {
        columnData = df.getColumnData as ArrayType2D
      } else {
        columnData = [df.values] as ArrayType2D
      }
      

      if (i ===0) {
        for(let j=0; j < columns.length; j++) {
          let column = columns[j]
          let colData = columnData[j]
          allDf[column] = colData
        }
      } else {
        let nonColumn = Object.keys(allDf).filter( (key:any) =>{
            return !columns.includes(key)
        })

        for(let j=0; j < columns.length; j++) {
          let column = columns[j]
          let colData = columnData[j]
          if (Object.keys(allDf).includes(column)) {
            allDf[column].push(...colData)
          }
           else {
            let residualArray = new Array(maxLen).fill(NaN)
            residualArray.push(...colData)
            allDf[column] = residualArray
          }
        }
        if (nonColumn.length > 0) {
          let currentDfLen = columnData[0].length
          for( let j=0; j < nonColumn.length; j++) {
            let column = nonColumn[j]
            let residualArray = new Array(currentDfLen).fill(NaN)
            allDf[column].push(...residualArray)
          }
        }
      }
      maxLen += columnData[0].length
    }
    
    if (Object.keys(allDf).length === 1) {
      return new Series(Object.values(allDf)[0])
    }
    return new DataFrame(allDf)
}

/**
* Concatenate pandas objects along a particular axis.
* @param object
* dfList: Array of DataFrame or Series
* axis: axis of concatenation 1 or 0
* @returns {DataFrame}
* @example
* concat({dfList: [df1, df2, df3], axis: 1})
*/
function concat({dfList, axis}: {
  dfList : Array<DataFrame | Series>,
  axis: 1 | 0
}): DataFrame | Series {
  if (axis === 1) {
    return processColumn(dfList, axis)
  }
  return processRow(dfList, 0)
}

export default concat
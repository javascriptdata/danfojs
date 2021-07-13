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

import Series from "./";
import Utils from "../shared/utils"

const utils = new Utils();

/**
   * Slice a Series by specified row index
   * @param Object 
*/
export function _iloc({ ndFrame, rows }: {
    ndFrame: Series
    rows: Array<string | number>
}): Series {
    let _rowIndexes: Array<number>
    const _data = ndFrame.values;
    const _seriesIndex = ndFrame.index;

    if (!(Array.isArray(rows))) {
        throw new Error(`rows parameter must be an Array. For example: rows: [1,2] or rows: ["0:10"]`);
    }

    if (rows.length == 1 && typeof rows[0] == "string") {
        const rowSplit = rows[0].split(":")

        if (rowSplit.length != 2) {
            throw new Error(`Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
        }
        if (isNaN(parseInt(rowSplit[0])) && rowSplit[0] != "") {
            throw new Error(`Invalid row split parameter. Split parameter must be a number`);
        }

        if (isNaN(parseInt(rowSplit[1])) && rowSplit[1] != "") {
            throw new Error(`Invalid row split parameter. Split parameter must be a number`);
        }

        const start = rowSplit[0] == "" ? 0 : parseInt(rowSplit[0])
        const end = rowSplit[1] == "" ? ndFrame.shape[0] : parseInt(rowSplit[1])

        if (start < 0) {
            throw new Error(`row slice [start] index cannot be less than 0`);
        }

        if (end > ndFrame.shape[0]) {
            throw new Error(`row slice [end] index cannot be less than ${ndFrame.shape[0]}`);
        }
        _rowIndexes = utils.range(start, end - 1)
    } else {

        for (let i = 0; i < rows.length; i++) {
            const element = rows[i];
            if (element > ndFrame.shape[0]) {
                throw new Error(`Invalid row parameter: row index ${element} cannot be bigger than Series length ${ndFrame.shape[0]}`);
            }

            if (typeof element != "number") {
                throw new Error(`Invalid row parameter: row index ${element} must be a number`);
            }

        }

        _rowIndexes = rows as number[]
    }

    const newData = []
    const newIndex = []

    for (let i = 0; i < _rowIndexes.length; i++) {
        const rowIndx = _rowIndexes[i]
        newData.push(_data[rowIndx])
        newIndex.push(_seriesIndex[rowIndx])
    }

    const sf = new Series({
        data: newData,
        index: newIndex,
        columnNames: ndFrame.columnNames,
        dtypes: ndFrame.dtypes,
        config: ndFrame.config
    })


    return sf
}
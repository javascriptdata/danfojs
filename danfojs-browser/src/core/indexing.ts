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

import Series from "./series";
import Utils from "../shared/utils"
import DataFrame from "./frame";
import { ArrayType2D, NDframeInterface } from "@base/shared/types";

const utils = new Utils();

/**
* Slice a Series/DataFrame by specified string location based labels
* @param Object 
*/
export function _iloc({ ndFrame, rows, columns }: {
    ndFrame: NDframeInterface
    rows?: Array<string | number | boolean> | Series
    columns?: Array<string | number>
}): Series | DataFrame {

    let _rowIndexes: Array<number>
    let _columnIndexes: Array<number>

    const _data = ndFrame.values;
    const _index = ndFrame.index;

    if (rows instanceof Series) {
        rows = rows.values as Array<string | number>
    }

    if (rows !== undefined && !Array.isArray(rows)) {
        throw new Error(`rows parameter must be an Array. For example: rows: [1,2] or rows: ["0:10"]`)
    }

    if (columns !== undefined && !Array.isArray(columns)) {
        throw new Error(`columns parameter must be an Array. For example: columns: [1,2] or columns: ["0:10"]`)
    }

    if (!rows) {
        _rowIndexes = utils.range(0, ndFrame.shape[0] - 1)

    } else if (rows.length == 1 && typeof rows[0] == "string") {
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
            throw new Error(`row slice [end] index cannot be bigger than ${ndFrame.shape[0]}`);
        }
        _rowIndexes = utils.range(start, end - 1)
    } else {
        const _formatedRows = []
        for (let i = 0; i < rows.length; i++) {
            let _indexToUse = rows[i];
            if (_indexToUse > ndFrame.shape[0]) {
                throw new Error(`Invalid row parameter: Specified index ${_indexToUse} cannot be bigger than index length ${ndFrame.shape[0]}`);
            }

            if (typeof _indexToUse !== "number" && typeof _indexToUse !== "boolean") {
                throw new Error(`Invalid row parameter: row index ${_indexToUse} must be a number or boolean`);
            }

            if (typeof _indexToUse === "boolean" && _indexToUse === true) {
                _formatedRows.push(_index[i])
            }

            if (typeof _indexToUse === "number") {
                _formatedRows.push(_indexToUse)
            }
        }

        _rowIndexes = _formatedRows as number[]
    }

    if (!columns) {
        _columnIndexes = utils.range(0, ndFrame.shape[1] - 1)

    } else if (columns.length == 1 && typeof columns[0] == "string") {
        const columnSplit = columns[0].split(":")

        if (columnSplit.length != 2) {
            throw new Error(`Invalid column split parameter: If using column split string, it must be of the form; columns: ["start:end"]`);
        }
        if (isNaN(parseInt(columnSplit[0])) && columnSplit[0] != "") {
            throw new Error(`Invalid column split parameter. Split parameter must be a number`);
        }

        if (isNaN(parseInt(columnSplit[1])) && columnSplit[1] != "") {
            throw new Error(`Invalid column split parameter. Split parameter must be a number`);
        }

        const start = columnSplit[0] == "" ? 0 : parseInt(columnSplit[0])
        const end = columnSplit[1] == "" ? ndFrame.shape[1] : parseInt(columnSplit[1])

        if (start < 0) {
            throw new Error(`column slice [start] index cannot be less than 0`);
        }

        if (end > ndFrame.shape[1]) {
            throw new Error(`column slice [end] index cannot be bigger than ${ndFrame.shape[1]}`);
        }
        _columnIndexes = utils.range(start, end - 1)
    } else {

        for (let i = 0; i < columns.length; i++) {
            const _indexToUse = columns[i];
            if (_indexToUse > ndFrame.shape[1]) {
                throw new Error(`Invalid column parameter: Specified index ${_indexToUse} cannot be bigger than index length ${ndFrame.shape[1]}`);
            }

            if (typeof _indexToUse != "number") {
                throw new Error(`Invalid column parameter: column index ${_indexToUse} must be a number`);
            }

        }

        _columnIndexes = columns as number[]
    }

    if (ndFrame instanceof Series) {
        const newData = []
        const newIndex = []

        for (let i = 0; i < _rowIndexes.length; i++) {
            const rowIndx = _rowIndexes[i]
            newData.push(_data[rowIndx])
            newIndex.push(_index[rowIndx])
        }
        const sf = new Series(
            newData,
            {
                index: newIndex,
                columnNames: ndFrame.columnNames,
                dtypes: ndFrame.dtypes,
                config: ndFrame.config
            })

        return sf
    } else {
        const newData = []
        const newIndex = []
        const newColumnNames: string[] = []
        const newDtypes = []

        for (let i = 0; i < _rowIndexes.length; i++) {
            const rowIndx = _rowIndexes[i]
            const rowData: any = _data[rowIndx]
            const newRowDataWithRequiredCols = []

            for (let j = 0; j < _columnIndexes.length; j++) {
                const colIndx = _columnIndexes[j]
                newRowDataWithRequiredCols.push(rowData[colIndx])
            }
            newData.push(newRowDataWithRequiredCols)
            newIndex.push(_index[rowIndx])
        }

        for (let i = 0; i < _columnIndexes.length; i++) {
            const colIndx = _columnIndexes[i]
            newColumnNames.push(ndFrame.columnNames[colIndx])
            newDtypes.push(ndFrame.dtypes[colIndx])

        }

        const df = new DataFrame(
            newData,
            {
                index: newIndex,
                columnNames: newColumnNames,
                dtypes: newDtypes,
                config: ndFrame.config
            })

        return df

    }

}

/**
* Slice a Series/DataFrame by specified string location based labels
* @param Object 
*/
export function _loc({ ndFrame, rows, columns }: {
    ndFrame: NDframeInterface
    rows?: Array<string | number | boolean> | Series
    columns?: Array<string>
}): Series | DataFrame | void {

    let _rowIndexes: Array<number>
    let _columnIndexes: Array<number>

    const _data = ndFrame.values;
    const _index = ndFrame.index;

    if (rows instanceof Series) {
        rows = rows.values as Array<string>
    }

    if (rows !== undefined && !Array.isArray(rows)) {
        throw new Error(`rows parameter must be an Array. For example: rows: [1,2] or rows: ["0:10"]`)
    }

    if (columns !== undefined && !Array.isArray(columns)) {
        throw new Error(`columns parameter must be an Array. For example: columns: ["a","b"] or columns: ["a:c"]`)
    }

    if (!rows) {
        _rowIndexes = _index.map(indexValue => _index.indexOf(indexValue)) // Return all row index

    } else if (rows.length == 1 && typeof rows[0] == "string") {

        if (rows[0].indexOf(":") === -1) { // Input type ==> ["1"] or [`"1"`]
            let temp;
            if (rows[0].startsWith(`"`) || rows[0].startsWith(`'`) || rows[0].startsWith("`")) {
                temp = _index.indexOf(rows[0].replace(/['"`]/g, ''))
            } else {
                temp = _index.indexOf(Number(rows[0]))
            }

            if (temp === -1) {
                throw new Error(`IndexError: Specified index (${rows[0]}) not found`);
            }

            _rowIndexes = [temp]

        } else {
            // Input type ==> ["1:2"] or [`"1":"4"`]
            const rowSplit = rows[0].split(":")

            if (rowSplit.length != 2) {
                throw new Error(`Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
            }

            let start: number
            let end: number

            if (rowSplit[0] === "") {
                start = _index.indexOf(_index[0])
            } else {
                if (rowSplit[0].startsWith(`"`) || rowSplit[0].startsWith(`'`) || rowSplit[0].startsWith("`")) {
                    start = _index.indexOf(rowSplit[0].replace(/['"`]/g, ''))
                } else {
                    start = _index.indexOf(Number(rowSplit[0]))
                }

            }

            if (rowSplit[1] === "") {
                end = _index.indexOf(_index[_index.length - 1]) + 1
            } else {
                if (rowSplit[0].startsWith(`"`) || rowSplit[0].startsWith(`'`) || rowSplit[0].startsWith("`")) {
                    end = _index.indexOf(rowSplit[1].replace(/['"`]/g, ''))
                } else {
                    end = _index.indexOf(Number(rowSplit[1]))
                }

            }

            if (start === -1) {
                throw new Error(`IndexError: Specified start index not found`);
            }

            if (end === -1) {
                throw new Error(`IndexError: Specified end index not found`);
            }

            _rowIndexes = _index.slice(start, end).map(indexValue => _index.indexOf(indexValue))
        }

    } else {
        // Input type ==> ["1", "2"] or [1, 5] or [true, false]
        const rowsIndexToUse = []
        for (let i = 0; i < rows.length; i++) {
            const isBoolean = typeof rows[i] === "boolean"
            if (isBoolean && rows[i]) {
                rowsIndexToUse.push(_index.indexOf(_index[i]))
            }

            if (!isBoolean) {
                const rowIndex = _index.indexOf(rows[i] as number | string)
                if (rowIndex === -1) {
                    throw new Error(`IndexError: Specified index (${rows[i]}) not found`);
                }
                rowsIndexToUse.push(rowIndex)
            }
        }

        _rowIndexes = rowsIndexToUse
    }

    const _columnNames = ndFrame.columnNames

    if (!columns) {
        _columnIndexes = _columnNames.map(columnName => _columnNames.indexOf(columnName))// Return all column index

    } else if (columns.length == 1) {
        if (typeof columns[0] !== "string") {
            throw new Error(`ColumnIndexError: columns parameter must be an array of a string name. For example: columns: ["b"]`)
        }

        if (columns[0].indexOf(":") == -1) { // Input type ==> ["A"] 
            _columnIndexes = [_columnNames.indexOf(columns[0])]

        } else { // Input type ==> ["a:b"] or [`"col1":"col5"`]
            const columnSplit = columns[0].split(":")

            if (columnSplit.length != 2) {
                throw new Error(`ColumnIndexError: Invalid row split parameter. If using row split string, it must be of the form; rows: ["start:end"]`);
            }

            const start = columnSplit[0] == "" ? _columnNames.indexOf(_columnNames[0]) : _columnNames.indexOf(columnSplit[0])
            const end = columnSplit[1] == "" ? _columnNames.indexOf(_columnNames[_columnNames.length - 1]) : _columnNames.indexOf(columnSplit[1])

            if (start === -1) {
                throw new Error(`ColumnIndexError: Specified start index not found`);
            }

            if (end === -1) {
                throw new Error(`ColumnIndexError: Specified end index not found`);
            }
            _columnIndexes = _columnNames.slice(start, end + 1).map(columnName => _columnNames.indexOf(columnName))
            _columnIndexes.pop() //Remove the last element

        }
    } else {// Input type ==> ["A", "B"] or ["col1", "col2"]
        for (let i = 0; i < columns.length; i++) {
            if (_columnNames.indexOf(columns[i]) === -1) {
                throw new Error(`ColumnIndexError: Specified column (${columns[i]}) not found`);
            }
        }
        _columnIndexes = columns.map(columnName => _columnNames.indexOf(columnName))
    }

    if (ndFrame instanceof Series) {
        const newData = []
        const newIndex = []

        for (let i = 0; i < _rowIndexes.length; i++) {
            const rowIndx = _rowIndexes[i]
            newData.push(_data[rowIndx])
            newIndex.push(_index[rowIndx])
        }
        const sf = new Series(
            newData,
            {
                index: newIndex,
                columnNames: ndFrame.columnNames,
                dtypes: ndFrame.dtypes,
                config: ndFrame.config
            })

        return sf
    } else {
        const newData = []
        const newIndex = []
        const newColumnNames: string[] = []
        const newDtypes = []

        for (let i = 0; i < _rowIndexes.length; i++) {
            const rowIndx: number = _rowIndexes[i]
            const rowData: any = _data[rowIndx]
            const newRowDataWithRequiredCols = []

            for (let j = 0; j < _columnIndexes.length; j++) {
                const colIndx = _columnIndexes[j]
                newRowDataWithRequiredCols.push(rowData[colIndx])
            }
            newData.push(newRowDataWithRequiredCols)
            newIndex.push(_index[rowIndx])
        }

        for (let i = 0; i < _columnIndexes.length; i++) {
            const colIndx = _columnIndexes[i]
            newColumnNames.push(ndFrame.columnNames[colIndx])
            newDtypes.push(ndFrame.dtypes[colIndx])

        }

        const df = new DataFrame(
            newData,
            {
                index: newIndex,
                columnNames: newColumnNames,
                dtypes: newDtypes,
                config: ndFrame.config
            })
        return df

    }

}
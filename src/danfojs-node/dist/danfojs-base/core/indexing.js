"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._loc = exports._iloc = void 0;
var series_1 = __importDefault(require("./series"));
var utils_1 = __importDefault(require("../shared/utils"));
var frame_1 = __importDefault(require("./frame"));
var utils = new utils_1.default();
/**
* Internal function to slice a Series/DataFrame by index based labels
* @param Object
*/
function _iloc(_a) {
    var ndFrame = _a.ndFrame, rows = _a.rows, columns = _a.columns;
    var _rowIndexes;
    var _columnIndexes;
    var _data = ndFrame.values;
    var _index = ndFrame.index;
    if (rows instanceof series_1.default) {
        rows = rows.values;
    }
    if (rows !== undefined && !Array.isArray(rows)) {
        throw new Error("rows parameter must be an Array. For example: rows: [1,2] or rows: [\"0:10\"]");
    }
    if (columns !== undefined && !Array.isArray(columns)) {
        throw new Error("columns parameter must be an Array. For example: columns: [1,2] or columns: [\"0:10\"]");
    }
    if (!rows) {
        _rowIndexes = utils.range(0, ndFrame.shape[0] - 1);
    }
    else if (rows.length == 1 && typeof rows[0] == "string") {
        var rowSplit = rows[0].split(":");
        if (rowSplit.length != 2) {
            throw new Error("Invalid row split parameter: If using row split string, it must be of the form; rows: [\"start:end\"]");
        }
        if (isNaN(parseInt(rowSplit[0])) && rowSplit[0] != "") {
            throw new Error("Invalid row split parameter. Split parameter must be a number");
        }
        if (isNaN(parseInt(rowSplit[1])) && rowSplit[1] != "") {
            throw new Error("Invalid row split parameter. Split parameter must be a number");
        }
        var start = rowSplit[0] == "" ? 0 : parseInt(rowSplit[0]);
        var end = rowSplit[1] == "" ? ndFrame.shape[0] : parseInt(rowSplit[1]);
        if (start < 0) {
            throw new Error("row slice [start] index cannot be less than 0");
        }
        if (end > ndFrame.shape[0]) {
            throw new Error("row slice [end] index cannot be bigger than " + ndFrame.shape[0]);
        }
        _rowIndexes = utils.range(start, end - 1);
    }
    else {
        var _formatedRows = [];
        for (var i = 0; i < rows.length; i++) {
            var _indexToUse = rows[i];
            if (_indexToUse > ndFrame.shape[0]) {
                throw new Error("Invalid row parameter: Specified index " + _indexToUse + " cannot be bigger than index length " + ndFrame.shape[0]);
            }
            if (typeof _indexToUse !== "number" && typeof _indexToUse !== "boolean") {
                throw new Error("Invalid row parameter: row index " + _indexToUse + " must be a number or boolean");
            }
            if (typeof _indexToUse === "boolean" && _indexToUse === true) {
                _formatedRows.push(_index[i]);
            }
            if (typeof _indexToUse === "number") {
                _formatedRows.push(_indexToUse);
            }
        }
        _rowIndexes = _formatedRows;
    }
    if (!columns) {
        _columnIndexes = utils.range(0, ndFrame.shape[1] - 1);
    }
    else if (columns.length == 1 && typeof columns[0] == "string") {
        var columnSplit = columns[0].split(":");
        if (columnSplit.length != 2) {
            throw new Error("Invalid column split parameter: If using column split string, it must be of the form; columns: [\"start:end\"]");
        }
        if (isNaN(parseInt(columnSplit[0])) && columnSplit[0] != "") {
            throw new Error("Invalid column split parameter. Split parameter must be a number");
        }
        if (isNaN(parseInt(columnSplit[1])) && columnSplit[1] != "") {
            throw new Error("Invalid column split parameter. Split parameter must be a number");
        }
        var start = columnSplit[0] == "" ? 0 : parseInt(columnSplit[0]);
        var end = columnSplit[1] == "" ? ndFrame.shape[1] : parseInt(columnSplit[1]);
        if (start < 0) {
            throw new Error("column slice [start] index cannot be less than 0");
        }
        if (end > ndFrame.shape[1]) {
            throw new Error("column slice [end] index cannot be bigger than " + ndFrame.shape[1]);
        }
        _columnIndexes = utils.range(start, end - 1);
    }
    else {
        for (var i = 0; i < columns.length; i++) {
            var _indexToUse = columns[i];
            if (_indexToUse > ndFrame.shape[1]) {
                throw new Error("Invalid column parameter: Specified index " + _indexToUse + " cannot be bigger than index length " + ndFrame.shape[1]);
            }
            if (typeof _indexToUse != "number") {
                throw new Error("Invalid column parameter: column index " + _indexToUse + " must be a number");
            }
        }
        _columnIndexes = columns;
    }
    if (ndFrame instanceof series_1.default) {
        var newData = [];
        var newIndex = [];
        for (var i = 0; i < _rowIndexes.length; i++) {
            var rowIndx = _rowIndexes[i];
            newData.push(_data[rowIndx]);
            newIndex.push(_index[rowIndx]);
        }
        var sf = new series_1.default(newData, {
            index: newIndex,
            columns: ndFrame.columns,
            dtypes: ndFrame.dtypes,
            config: ndFrame.config
        });
        return sf;
    }
    else {
        var newData = [];
        var newIndex = [];
        var newColumnNames = [];
        var newDtypes = [];
        for (var i = 0; i < _rowIndexes.length; i++) {
            var rowIndx = _rowIndexes[i];
            var rowData = _data[rowIndx];
            var newRowDataWithRequiredCols = [];
            for (var j = 0; j < _columnIndexes.length; j++) {
                var colIndx = _columnIndexes[j];
                newRowDataWithRequiredCols.push(rowData[colIndx]);
            }
            newData.push(newRowDataWithRequiredCols);
            newIndex.push(_index[rowIndx]);
        }
        for (var i = 0; i < _columnIndexes.length; i++) {
            var colIndx = _columnIndexes[i];
            newColumnNames.push(ndFrame.columns[colIndx]);
            newDtypes.push(ndFrame.dtypes[colIndx]);
        }
        var df = new frame_1.default(newData, {
            index: newIndex,
            columns: newColumnNames,
            dtypes: newDtypes,
            config: ndFrame.config
        });
        return df;
    }
}
exports._iloc = _iloc;
/**
* Internal function to slice a Series/DataFrame by specified string location based labels
* @param Object
*/
function _loc(_a) {
    var ndFrame = _a.ndFrame, rows = _a.rows, columns = _a.columns;
    var _rowIndexes;
    var _columnIndexes;
    var _data = ndFrame.values;
    var _index = ndFrame.index;
    if (rows instanceof series_1.default) {
        rows = rows.values;
    }
    if (rows !== undefined && !Array.isArray(rows)) {
        throw new Error("rows parameter must be an Array. For example: rows: [1,2] or rows: [\"0:10\"]");
    }
    if (columns !== undefined && !Array.isArray(columns)) {
        throw new Error("columns parameter must be an Array. For example: columns: [\"a\",\"b\"] or columns: [\"a:c\"]");
    }
    if (!rows) {
        _rowIndexes = _index.map(function (indexValue) { return _index.indexOf(indexValue); }); // Return all row index
    }
    else if (rows.length == 1 && typeof rows[0] == "string") {
        if (rows[0].indexOf(":") === -1) { // Input type ==> ["1"] or [`"1"`]
            var temp = void 0;
            if (rows[0].startsWith("\"") || rows[0].startsWith("'") || rows[0].startsWith("`")) {
                temp = _index.indexOf(rows[0].replace(/['"`]/g, ''));
            }
            else {
                temp = _index.indexOf(Number(rows[0]));
            }
            if (temp === -1) {
                throw new Error("IndexError: Specified index (" + rows[0] + ") not found");
            }
            _rowIndexes = [temp];
        }
        else {
            // Input type ==> ["1:2"] or [`"1":"4"`]
            var rowSplit = rows[0].split(":");
            if (rowSplit.length != 2) {
                throw new Error("Invalid row split parameter: If using row split string, it must be of the form; rows: [\"start:end\"]");
            }
            var start = void 0;
            var end = void 0;
            if (rowSplit[0] === "") {
                start = _index.indexOf(_index[0]);
            }
            else {
                if (rowSplit[0].startsWith("\"") || rowSplit[0].startsWith("'") || rowSplit[0].startsWith("`")) {
                    start = _index.indexOf(rowSplit[0].replace(/['"`]/g, ''));
                }
                else {
                    start = _index.indexOf(Number(rowSplit[0]));
                }
            }
            if (rowSplit[1] === "") {
                end = _index.indexOf(_index[_index.length - 1]) + 1;
            }
            else {
                if (rowSplit[0].startsWith("\"") || rowSplit[0].startsWith("'") || rowSplit[0].startsWith("`")) {
                    end = _index.indexOf(rowSplit[1].replace(/['"`]/g, ''));
                }
                else {
                    end = _index.indexOf(Number(rowSplit[1]));
                }
            }
            if (start === -1) {
                throw new Error("IndexError: Specified start index not found");
            }
            if (end === -1) {
                throw new Error("IndexError: Specified end index not found");
            }
            _rowIndexes = _index.slice(start, end).map(function (indexValue) { return _index.indexOf(indexValue); });
        }
    }
    else {
        // Input type ==> ["1", "2"] or [1, 5] or [true, false]
        var rowsIndexToUse = [];
        for (var i = 0; i < rows.length; i++) {
            var isBoolean = typeof rows[i] === "boolean";
            if (isBoolean && rows[i]) {
                rowsIndexToUse.push(_index.indexOf(_index[i]));
            }
            if (!isBoolean) {
                var rowIndex = _index.indexOf(rows[i]);
                if (rowIndex === -1) {
                    throw new Error("IndexError: Specified index (" + rows[i] + ") not found");
                }
                rowsIndexToUse.push(rowIndex);
            }
        }
        _rowIndexes = rowsIndexToUse;
    }
    var _columnNames = ndFrame.columns;
    if (!columns) {
        _columnIndexes = _columnNames.map(function (columnName) { return _columnNames.indexOf(columnName); }); // Return all column index
    }
    else if (columns.length == 1) {
        if (typeof columns[0] !== "string") {
            throw new Error("ColumnIndexError: columns parameter must be an array of a string name. For example: columns: [\"b\"]");
        }
        if (columns[0].indexOf(":") == -1) { // Input type ==> ["A"] 
            _columnIndexes = [_columnNames.indexOf(columns[0])];
        }
        else { // Input type ==> ["a:b"] or [`"col1":"col5"`]
            var columnSplit = columns[0].split(":");
            if (columnSplit.length != 2) {
                throw new Error("ColumnIndexError: Invalid row split parameter. If using row split string, it must be of the form; rows: [\"start:end\"]");
            }
            var start = columnSplit[0] == "" ? _columnNames.indexOf(_columnNames[0]) : _columnNames.indexOf(columnSplit[0]);
            var end = columnSplit[1] == "" ? _columnNames.indexOf(_columnNames[_columnNames.length - 1]) : _columnNames.indexOf(columnSplit[1]);
            if (start === -1) {
                throw new Error("ColumnIndexError: Specified start index not found");
            }
            if (end === -1) {
                throw new Error("ColumnIndexError: Specified end index not found");
            }
            _columnIndexes = _columnNames.slice(start, end + 1).map(function (columnName) { return _columnNames.indexOf(columnName); });
            _columnIndexes.pop(); //Remove the last element
        }
    }
    else { // Input type ==> ["A", "B"] or ["col1", "col2"]
        for (var i = 0; i < columns.length; i++) {
            if (_columnNames.indexOf(columns[i]) === -1) {
                throw new Error("ColumnIndexError: Specified column (" + columns[i] + ") not found");
            }
        }
        _columnIndexes = columns.map(function (columnName) { return _columnNames.indexOf(columnName); });
    }
    if (ndFrame instanceof series_1.default) {
        var newData = [];
        var newIndex = [];
        for (var i = 0; i < _rowIndexes.length; i++) {
            var rowIndx = _rowIndexes[i];
            newData.push(_data[rowIndx]);
            newIndex.push(_index[rowIndx]);
        }
        var sf = new series_1.default(newData, {
            index: newIndex,
            columns: ndFrame.columns,
            dtypes: ndFrame.dtypes,
            config: ndFrame.config
        });
        return sf;
    }
    else {
        var newData = [];
        var newIndex = [];
        var newColumnNames = [];
        var newDtypes = [];
        for (var i = 0; i < _rowIndexes.length; i++) {
            var rowIndx = _rowIndexes[i];
            var rowData = _data[rowIndx];
            var newRowDataWithRequiredCols = [];
            for (var j = 0; j < _columnIndexes.length; j++) {
                var colIndx = _columnIndexes[j];
                newRowDataWithRequiredCols.push(rowData[colIndx]);
            }
            newData.push(newRowDataWithRequiredCols);
            newIndex.push(_index[rowIndx]);
        }
        for (var i = 0; i < _columnIndexes.length; i++) {
            var colIndx = _columnIndexes[i];
            newColumnNames.push(ndFrame.columns[colIndx]);
            newDtypes.push(ndFrame.dtypes[colIndx]);
        }
        var df = new frame_1.default(newData, {
            index: newIndex,
            columns: newColumnNames,
            dtypes: newDtypes,
            config: ndFrame.config
        });
        return df;
    }
}
exports._loc = _loc;

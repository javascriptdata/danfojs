"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var frame_1 = __importDefault(require("../core/frame"));
var mathjs_1 = require("mathjs");
var concat_1 = __importDefault(require("../transformers/concat"));
var series_1 = __importDefault(require("../core/series"));
/**
 * The class performs all groupby operation on a dataframe
 * involving all aggregate funciton
 * @param {colDict} colDict Object of unique keys in the group by column
 * @param {keyCol} keyCol Array contains the column names
 * @param {data} Array the dataframe data
 * @param {columnName} Array of all column name in the dataframe.
 * @param {colDtype} Array columns dtype
 */
var Groupby = /** @class */ (function () {
    function Groupby(keyCol, data, columnName, colDtype, colIndex) {
        this.colDict = {};
        this.keyToValue = {};
        this.keyCol = keyCol;
        this.data = data;
        this.columnName = columnName;
        //this.dataTensors = {}; //store the tensor version of the groupby data
        this.colDtype = colDtype;
        this.colIndex = colIndex;
    }
    /**
     * Generate group object data needed for group operations
     * let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
     * let cols = [ "A", "B", "C" ];
     * let df = new dfd.DataFrame(data, { columns: cols });
     * let groupDf = df.groupby([ "A" ]);
     * The following internal object is generated and save to this.colDict
     * {
     *  '1': { A: [ 1 ], B: [ 2 ], C: [ 3 ] },
     *  '4': { A: [ 4 ], B: [ 5 ], C: [ 6 ] },
     *  '20': { A: [ 20 ], B: [ 30 ], C: [ 40 ] },
     *  '39': { A: [ 39 ], B: [ 89 ], C: [ 78 ] }
     * }
     * Since for groupby using more than one columns is index via '-'
     * e.g for df.groupby(['A','B'])
     * the result will look like this
     * {
     *  '1-2': {A: [ 1 ], B: [ 2 ], C: [ 3 ]},
     *  '4-5': {A: [ 4 ], B: [ 5 ], C: [ 6 ]}
     * }
     * but in doing analysis on a specific column like this
     * df.groupby(['A','B']).col(['C'])
     * will have the following set of internal result
     * {
     *  '1-2': { C: [ 3 ]},
     *  '4-5': {C: [ 6 ]}
     * }
     * In building our multindex type of DataFrame for this data,
     * we've somehow loose track of value for column A and B.
     * This could actually be generated by using split('-') on the object keys
     * e.g '1-2'.split('-') will give us the value for A and B.
     * But we might have weird case scenerio where A and B value has '-`
     * e.g
     * {
     *  '1--2-': { C: [ 3 ]},
     *  '4--5-': {C: [ 6 ]}
     * }
     * using `.split('-') might not work well
     * Hence we create a key-value `keyToValue` object to store index and their
     * associated value
     * NOTE: In the previous implementation we made use of Graph representation
     * for the group by data and Depth First search (DFS). But we decided to use key-value
     * object in javascript as an hashmap to reduce search time compared to using Grpah and DFS
     */
    Groupby.prototype.group = function () {
        var _a;
        var self = this;
        var keyToValue = {};
        var group = (_a = this.data) === null || _a === void 0 ? void 0 : _a.reduce(function (prev, current) {
            var indexes = [];
            for (var i in self.colIndex) {
                var index_1 = self.colIndex[i];
                indexes.push(current[index_1]);
            }
            var index = indexes.join('-');
            if (!keyToValue[index]) {
                keyToValue[index] = indexes;
            }
            if (prev[index]) {
                var data = prev[index];
                for (var i in self.columnName) {
                    var colName = self.columnName[i];
                    data[colName].push(current[i]);
                }
            }
            else {
                prev[index] = {};
                for (var i in self.columnName) {
                    var colName = self.columnName[i];
                    prev[index][colName] = [current[i]];
                }
            }
            return prev;
        }, {});
        this.colDict = group;
        this.keyToValue = keyToValue;
        return this;
    };
    /**
     * Generate new internal groupby data
     * group = df.groupby(['A', 'B']).col('C')
     * This filter the colDict property as generated by `.group()`
     * it filter each group to contain only column `C` in their internal object
     * e.g
     * {
     *  '1-2': {A: [ 1 ], B: [ 2 ], C: [ 3 ]},
     *  '4-5': {A: [ 4 ], B: [ 5 ], C: [ 6 ]}
     * }
     * to
     * {
     *  '1-2': { C: [ 3 ]},
     *  '4-5': {C: [ 6 ]}
     * }
     * @param colNames column names
     * @return Groupby
     */
    Groupby.prototype.col = function (colNames) {
        var _this = this;
        if (typeof colNames === "undefined") {
            colNames = this.columnName.filter(function (_, index) {
                return !_this.colIndex.includes(index);
            });
        }
        var self = this;
        colNames.forEach(function (val) {
            if (!self.columnName.includes(val))
                throw new Error("Column " + val + " does not exist in groups");
        });
        var colDict = __assign({}, this.colDict);
        for (var _i = 0, _a = Object.entries(colDict); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], values = _b[1];
            var c = {};
            var keyVal = __assign({}, values);
            for (var colKey in colNames) {
                var colName = colNames[colKey];
                c[colName] = keyVal[colName];
            }
            colDict[key] = c;
        }
        var gp = new Groupby(this.keyCol, null, this.columnName, this.colDtype, this.colIndex);
        gp.colDict = colDict;
        gp.groupColNames = colNames;
        gp.keyToValue = this.keyToValue;
        return gp;
    };
    /**
     * Perform all groupby arithmetic operations
     * In the previous implementation all groups data are
     * stord as DataFrame, which involve lot of memory usage
     * Hence each groups are just pure javascrit object
     * and all arithmetic operation is done directly on javascript
     * arrays.
     * e.g
     * using this internal data
     * {
     *  '1-2': {A: [ 1,3 ], B: [ 2,5 ], C: [ 3, 5 ]},
     *  '4-5': {A: [ 4,1 ], B: [ 5,0 ], C: [ 6, 12 ]}
     * }
     * 1) using groupby(['A', 'B']).arithmetic("mean")
     * result: * {
     *  '1-2': {A_mean: [ 2 ], B_mean: [ 3.5 ], C_mean: [ 4 ]},
     *  '4-5': {A_mean: [ 2.5 ], B: [ 2.5 ], C_mean: [ 9 ]}
     * }
     * 2) .arithmetic({
     *    A: 'mean',
     *    B: 'sum',
     *    C: 'min'
     * })
     * result:
     * {
     *  '1-2': {A_mean: [ 2 ], B_sum: [ 7 ], C_min: [ 3 ]},
     *  '4-5': {A_mean: [ 2.5 ], B_sum: [ 5 ], C_min: [ 6 ]}
     * }
     * 3) .arithmetic({
     *    A: 'mean',
     *    B: 'sum',
     *    C: ['min', 'max']
     * })
     * result:
     * {
     *  '1-2': {A_mean: [ 2 ], B_sum: [ 7 ], C_min: [ 3 ], C_max: [5]},
     *  '4-5': {A_mean: [ 2.5 ], B_sum: [ 5 ], C_min: [ 6 ], C_max: [12]}
     * }
     * @param operation
     */
    Groupby.prototype.arithemetic = function (operation) {
        var opsName = ["mean", "sum", "count", "mode", "std", "var", "cumsum", "cumprod",
            "cummax", "cummin", "median", "min", "max", "first", "last"];
        if (typeof operation === "string") {
            if (!opsName.includes(operation)) {
                throw new Error("group operation: " + operation + " is not valid");
            }
        }
        else {
            Object.keys(operation).forEach(function (key) {
                var ops = operation[key];
                if (Array.isArray(ops)) {
                    for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
                        var op = ops_1[_i];
                        if (!opsName.includes(op)) {
                            throw new Error("group operation: " + op + " for column " + key + " is not valid");
                        }
                    }
                }
                else {
                    if (!opsName.includes(ops)) {
                        throw new Error("group operation: " + ops + " for column " + key + " is not valid");
                    }
                }
            });
        }
        var colDict = __assign({}, this.colDict);
        for (var _i = 0, _a = Object.entries(colDict); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], values = _b[1];
            var colVal = {};
            var keyVal = __assign({}, values);
            var groupColNames = this.groupColNames;
            for (var colKey = 0; colKey < groupColNames.length; colKey++) {
                var colName = groupColNames[colKey];
                var colIndex = this.columnName.indexOf(colName);
                var colDtype = this.colDtype[colIndex];
                var operationVal = (typeof operation === "string") ? operation : operation[colName];
                if (colDtype === "string" && operationVal !== "count")
                    throw new Error("Can't perform math operation on column " + colName);
                if (typeof operation === "string") {
                    var colName2 = colName + "_" + operation;
                    colVal[colName2] = this.groupMathLog(keyVal[colName], operation);
                }
                else {
                    if (Array.isArray(operation[colName])) {
                        for (var _c = 0, _d = operation[colName]; _c < _d.length; _c++) {
                            var ops = _d[_c];
                            var colName2 = colName + "_" + ops;
                            colVal[colName2] = this.groupMathLog(keyVal[colName], ops);
                        }
                    }
                    else {
                        var ops = operation[colName];
                        var colName2 = colName + "_" + ops;
                        colVal[colName2] = this.groupMathLog(keyVal[colName], ops);
                    }
                }
            }
            colDict[key] = colVal;
        }
        return colDict;
    };
    /**
     * Peform all arithmetic logic
     * @param colVal
     * @param ops
     */
    Groupby.prototype.groupMathLog = function (colVal, ops) {
        var data = [];
        switch (ops) {
            case "first":
                data.push(colVal[0]);
                break;
            case "last":
                data.push(colVal[colVal.length - 1]);
                break;
            case "max":
                var max = colVal.reduce(function (prev, curr) {
                    if (prev > curr) {
                        return prev;
                    }
                    return curr;
                });
                data.push(max);
                break;
            case "min":
                var min = colVal.reduce(function (prev, curr) {
                    if (prev < curr) {
                        return prev;
                    }
                    return curr;
                });
                data.push(min);
                break;
            case "sum":
                var sum = colVal.reduce(function (prev, curr) {
                    return prev + curr;
                });
                data.push(sum);
                break;
            case "count":
                data.push(colVal.length);
                break;
            case "mean":
                var sumMean = colVal.reduce(function (prev, curr) {
                    return prev + curr;
                });
                data.push(sumMean / colVal.length);
                break;
            case "std":
                data.push((0, mathjs_1.std)(colVal));
                break;
            case "var":
                data.push((0, mathjs_1.variance)(colVal));
                break;
            case "median":
                data.push((0, mathjs_1.median)(colVal));
                break;
            case "mode":
                data.push((0, mathjs_1.mode)(colVal));
                break;
            case "cumsum":
                colVal.reduce(function (prev, curr) {
                    var sum = prev + curr;
                    data.push(sum);
                    return sum;
                }, 0);
                break;
            case "cummin":
                data = [colVal[0]];
                colVal.slice(1).reduce(function (prev, curr) {
                    if (prev < curr) {
                        data.push(prev);
                        return prev;
                    }
                    data.push(curr);
                    return curr;
                }, data[0]);
                break;
            case "cummax":
                data = [colVal[0]];
                colVal.slice(1).reduce(function (prev, curr) {
                    if (prev > curr) {
                        data.push(prev);
                        return prev;
                    }
                    data.push(curr);
                    return curr;
                }, data[0]);
                break;
            case "cumprod":
                colVal.reduce(function (prev, curr) {
                    var sum = prev * curr;
                    data.push(sum);
                    return sum;
                }, 1);
                break;
        }
        return data;
    };
    /**
     * Takes in internal groupby internal data and convert
     * them to a single data frame.
     * @param colDict
     */
    Groupby.prototype.toDataFrame = function (colDict) {
        var data = {};
        for (var _i = 0, _a = this.colKeyDict(colDict); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = colDict[key];
            var keyDict = {};
            var oneValue = Object.values(value)[0];
            var valueLen = oneValue.length;
            for (var key1 in this.keyCol) {
                var keyName = this.keyCol[key1];
                var keyValue = this.keyToValue[key][key1];
                keyDict[keyName] = Array(valueLen).fill(keyValue);
            }
            var combine = __assign(__assign({}, keyDict), value);
            if (Object.keys(data).length < 1) {
                data = combine;
            }
            else {
                for (var _b = 0, _c = Object.keys(data); _b < _c.length; _b++) {
                    var dataKey = _c[_b];
                    var dataValue = combine[dataKey];
                    data[dataKey] = __spreadArray(__spreadArray([], data[dataKey], true), dataValue, true);
                }
            }
        }
        return new frame_1.default(data);
    };
    Groupby.prototype.operations = function (ops) {
        if (!this.groupColNames) {
            var colGroup = this.col(undefined);
            var colDict_1 = colGroup.arithemetic(ops);
            var df_1 = colGroup.toDataFrame(colDict_1);
            return df_1;
        }
        var colDict = this.arithemetic(ops);
        var df = this.toDataFrame(colDict);
        return df;
    };
    /**
     * Obtain the count for each group
     * @returns DataFrame
     *
     */
    Groupby.prototype.count = function () {
        return this.operations("count");
    };
    /**
     * Obtain the sum of columns for each group
     * @returns DataFrame
     *
     */
    Groupby.prototype.sum = function () {
        return this.operations("sum");
    };
    /**
     * Obtain the standard deviation of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.std = function () {
        return this.operations("std");
    };
    /**
     * Obtain the variance of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.var = function () {
        return this.operations("var");
    };
    /**
     * Obtain the mean of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.mean = function () {
        return this.operations("mean");
    };
    /**
     * Obtain the cumsum of columns for each group
     * @returns DataFrame
     *
     */
    Groupby.prototype.cumSum = function () {
        return this.operations("cumsum");
    };
    /**
     * Obtain the cummax of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.cumMax = function () {
        return this.operations("cummax");
    };
    /**
     * Obtain the cumprod of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.cumProd = function () {
        return this.operations("cumprod");
    };
    /**
     * Obtain the cummin of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.cumMin = function () {
        return this.operations("cummin");
    };
    /**
     * Obtain the max value of columns for each group
     * @returns DataFrame
     *
     */
    Groupby.prototype.max = function () {
        return this.operations("max");
    };
    /**
     * Obtain the min of columns for each group
     * @returns DataFrame
     */
    Groupby.prototype.min = function () {
        return this.operations("min");
    };
    /**
     * Obtain a specific group
     * @param keys Array<string | number>
     * @returns DataFrame
     */
    Groupby.prototype.getGroup = function (keys) {
        var dictKey = keys.join("-");
        var colDict = {};
        colDict[dictKey] = __assign({}, this.colDict[dictKey]);
        return this.toDataFrame(colDict);
    };
    /**
     * Perform aggregation on all groups
     * @param ops
     * @returns DataFrame
     */
    Groupby.prototype.agg = function (ops) {
        var columns = Object.keys(ops);
        var col_gp = this.col(columns);
        var data = col_gp.arithemetic(ops);
        var df = col_gp.toDataFrame(data);
        return df;
    };
    /**
     * Apply custom aggregator function
     * to each group
     * @param callable
     * @returns DataFrame
     * @example
     * let grp = df.groupby(['A'])
     * grp.apply((x) => x.count())
     */
    Groupby.prototype.apply = function (callable) {
        var colDict = {};
        for (var _i = 0, _a = this.colKeyDict(this.colDict); _i < _a.length; _i++) {
            var key = _a[_i];
            var valDataframe = new frame_1.default(this.colDict[key]);
            colDict[key] = callable(valDataframe);
        }
        return this.concatGroups(colDict);
    };
    Groupby.prototype.concatGroups = function (colDict) {
        var data = [];
        for (var _i = 0, _a = Object.entries(colDict); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], values = _b[1];
            var copyDf = void 0;
            if (values instanceof frame_1.default) {
                copyDf = values.copy();
            }
            else {
                var columns = values.index;
                columns = columns.length > 1 ? columns : ['applyOps'];
                copyDf = new frame_1.default([values.values], { columns: columns });
            }
            var len = copyDf.shape[0];
            var key1 = void 0;
            for (key1 in this.keyCol) {
                var keyName = this.keyCol[key1];
                var keyValue = this.keyToValue[key][key1];
                var dfValue = Array(len).fill(keyValue);
                var atIndex = parseInt(key1);
                if (this.groupColNames) {
                    copyDf.addColumn(keyName, dfValue, { inplace: true, atIndex: atIndex });
                }
                else {
                    copyDf.addColumn(keyName + "_Group", dfValue, { inplace: true, atIndex: atIndex });
                }
            }
            data.push(copyDf);
        }
        return (0, concat_1.default)({ dfList: data, axis: 0 });
    };
    Object.defineProperty(Groupby.prototype, "ngroups", {
        /**
         * obtain the total number of groups
         * @returns number
         */
        get: function () {
            var keys = Object.keys(this.colDict);
            return keys.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Groupby.prototype, "groups", {
        /**
         * obtaind the internal group data
         * @returns  {[keys: string]: {}}
         */
        get: function () {
            return this.colDict;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Obtain the first row of each group
     * @returns DataFrame
     */
    Groupby.prototype.first = function () {
        return this.apply(function (x) {
            return x.head(1);
        });
    };
    /**
     * Obtain the last row of each group
     * @returns DataFrame
     */
    Groupby.prototype.last = function () {
        return this.apply(function (x) {
            return x.tail(1);
        });
    };
    /**
     * Obtains the dataframe se of each groups
     * @returns DataFrame
     */
    Groupby.prototype.size = function () {
        return this.apply(function (x) {
            return new series_1.default([x.shape[0]]);
        });
    };
    Groupby.prototype.colKeyDict = function (colDict) {
        var keyDict = {};
        for (var _i = 0, _a = Object.keys(colDict); _i < _a.length; _i++) {
            var key = _a[_i];
            var firstKey = key.split("-")[0];
            if (firstKey in keyDict) {
                keyDict[firstKey].push(key);
            }
            else {
                keyDict[firstKey] = [key];
            }
        }
        var keys = [];
        for (var _b = 0, _c = Object.keys(keyDict); _b < _c.length; _b++) {
            var key = _c[_b];
            keys.push.apply(keys, keyDict[key]);
        }
        return keys;
    };
    return Groupby;
}());
exports.default = Groupby;

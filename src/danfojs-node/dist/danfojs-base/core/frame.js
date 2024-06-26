"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var dummy_encoder_1 = __importDefault(require("../transformers/encoders/dummy.encoder"));
var mathjs_1 = require("mathjs");
var tensorflowlib_1 = __importDefault(require("../shared/tensorflowlib"));
var defaults_1 = require("../shared/defaults");
var groupby_1 = __importDefault(require("../aggregators/groupby"));
var errors_1 = __importDefault(require("../shared/errors"));
var indexing_1 = require("./indexing");
var utils_1 = __importDefault(require("../shared/utils"));
var generic_1 = __importDefault(require("./generic"));
var table_1 = require("table");
var series_1 = __importDefault(require("./series"));
var plotting_1 = require("../../danfojs-base/plotting");
var utils = new utils_1.default();
/**
 * Two-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.
 */
var DataFrame = /** @class */ (function (_super) {
    __extends(DataFrame, _super);
    function DataFrame(data, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var index = options.index, columns = options.columns, dtypes = options.dtypes, config = options.config;
        _this = _super.call(this, { data: data, index: index, columns: columns, dtypes: dtypes, config: config, isSeries: false }) || this;
        _this.$setInternalColumnDataProperty();
        return _this;
    }
    /**
     * Maps all column names to their corresponding data, and return them as Series objects.
     * This makes column subsetting works. E.g this can work ==> `df["col1"]`
     * @param column Optional, a single column name to map
     */
    DataFrame.prototype.$setInternalColumnDataProperty = function (column) {
        var self = this;
        if (column && typeof column === "string") {
            Object.defineProperty(self, column, {
                get: function () {
                    return self.$getColumnData(column);
                },
                set: function (arr) {
                    self.$setColumnData(column, arr);
                }
            });
        }
        else {
            var columns = this.columns;
            var _loop_1 = function (i) {
                var column_1 = columns[i];
                Object.defineProperty(this_1, column_1, {
                    get: function () {
                        return self.$getColumnData(column_1);
                    },
                    set: function (arr) {
                        self.$setColumnData(column_1, arr);
                    }
                });
            };
            var this_1 = this;
            for (var i = 0; i < columns.length; i++) {
                _loop_1(i);
            }
        }
    };
    /**
     * Returns the column data from the DataFrame by column name.
     * @param column column name to get the column data
     * @param returnSeries Whether to return the data in series format or not. Defaults to true
     */
    DataFrame.prototype.$getColumnData = function (column, returnSeries) {
        if (returnSeries === void 0) { returnSeries = true; }
        var columnIndex = this.columns.indexOf(column);
        if (columnIndex == -1) {
            errors_1.default.throwColumnNotFoundError(this);
        }
        var dtypes = [this.$dtypes[columnIndex]];
        var index = __spreadArray([], this.$index, true);
        var columns = [column];
        var config = __assign({}, this.$config);
        if (this.$config.isLowMemoryMode) {
            var data = [];
            for (var i = 0; i < this.values.length; i++) {
                var row = this.values[i];
                data.push(row[columnIndex]);
            }
            if (returnSeries) {
                return new series_1.default(data, {
                    dtypes: dtypes,
                    index: index,
                    columns: columns,
                    config: config
                });
            }
            else {
                return data;
            }
        }
        else {
            var data = this.$dataIncolumnFormat[columnIndex];
            if (returnSeries) {
                return new series_1.default(data, {
                    dtypes: dtypes,
                    index: index,
                    columns: columns,
                    config: config
                });
            }
            else {
                return data;
            }
        }
    };
    /**
     * Updates the internal column data via column name.
     * @param column The name of the column to update.
     * @param arr The new column data
     */
    DataFrame.prototype.$setColumnData = function (column, arr) {
        var columnIndex = this.$columns.indexOf(column);
        if (columnIndex == -1) {
            throw new Error("ParamError: column " + column + " not found in " + this.$columns + ". If you need to add a new column, use the df.addColumn method. ");
        }
        var colunmValuesToAdd;
        if (arr instanceof series_1.default) {
            colunmValuesToAdd = arr.values;
        }
        else if (Array.isArray(arr)) {
            colunmValuesToAdd = arr;
        }
        else {
            throw new Error("ParamError: specified value not supported. It must either be an Array or a Series of the same length");
        }
        if (colunmValuesToAdd.length !== this.shape[0]) {
            errors_1.default.throwColumnLengthError(this, colunmValuesToAdd.length);
        }
        if (this.$config.isLowMemoryMode) {
            //Update row ($data) array
            for (var i = 0; i < this.$data.length; i++) {
                this.$data[i][columnIndex] = colunmValuesToAdd[i];
            }
            //Update the dtypes
            this.$dtypes[columnIndex] = utils.inferDtype(colunmValuesToAdd)[0];
        }
        else {
            //Update row ($data) array
            for (var i = 0; i < this.values.length; i++) {
                this.$data[i][columnIndex] = colunmValuesToAdd[i];
            }
            //Update column ($dataIncolumnFormat) array since it's available in object
            this.$dataIncolumnFormat[columnIndex] = arr;
            //Update the dtypes
            this.$dtypes[columnIndex] = utils.inferDtype(colunmValuesToAdd)[0];
        }
    };
    /**
     * Return data with missing values removed from a specified axis
     * @param axis 0 or 1. If 0, column-wise, if 1, row-wise
    */
    DataFrame.prototype.$getDataByAxisWithMissingValuesRemoved = function (axis) {
        var oldValues = this.$getDataArraysByAxis(axis);
        var cleanValues = [];
        for (var i = 0; i < oldValues.length; i++) {
            var values = oldValues[i];
            cleanValues.push(utils.removeMissingValuesFromArray(values));
        }
        return cleanValues;
    };
    /**
     * Return data aligned to the specified axis. Transposes the array if needed.
     * @param axis 0 or 1. If 0, column-wise, if 1, row-wise
    */
    DataFrame.prototype.$getDataArraysByAxis = function (axis) {
        if (axis === 1) {
            return this.values;
        }
        else {
            var dfValues = void 0;
            if (this.config.isLowMemoryMode) {
                dfValues = utils.transposeArray(this.values);
            }
            else {
                dfValues = this.$dataIncolumnFormat;
            }
            return dfValues;
        }
    };
    /*
    * checks if DataFrame is compactible for arithmetic operation
    * compatible Dataframe must have only numerical dtypes
    **/
    DataFrame.prototype.$frameIsNotCompactibleForArithmeticOperation = function () {
        var dtypes = this.dtypes;
        var str = function (element) { return element == "string"; };
        return dtypes.some(str);
    };
    /**
     * Return Tensors in the right axis for math operations.
     * @param other DataFrame or Series or number or array
     * @param axis 0 or 1. If 0, column-wise, if 1, row-wise
     * */
    DataFrame.prototype.$getTensorsForArithmeticOperationByAxis = function (other, axis) {
        if (typeof other === "number") {
            return [this.tensor, tensorflowlib_1.default.scalar(other)];
        }
        else if (other instanceof DataFrame) {
            return [this.tensor, other.tensor];
        }
        else if (other instanceof series_1.default) {
            if (axis === 0) {
                return [this.tensor, tensorflowlib_1.default.tensor2d(other.values, [other.shape[0], 1])];
            }
            else {
                return [this.tensor, tensorflowlib_1.default.tensor2d(other.values, [other.shape[0], 1]).transpose()];
            }
        }
        else if (Array.isArray(other)) {
            if (axis === 0) {
                return [this.tensor, tensorflowlib_1.default.tensor2d(other, [other.length, 1])];
            }
            else {
                return [this.tensor, tensorflowlib_1.default.tensor2d(other, [other.length, 1]).transpose()];
            }
        }
        else {
            throw new Error("ParamError: Invalid type for other parameter. other must be one of Series, DataFrame or number.");
        }
    };
    /**
     * Returns the dtype for a given column name
     * @param column
     */
    DataFrame.prototype.$getColumnDtype = function (column) {
        var columnIndex = this.columns.indexOf(column);
        if (columnIndex === -1) {
            throw Error("ColumnNameError: Column \"" + column + "\" does not exist");
        }
        return this.dtypes[columnIndex];
    };
    DataFrame.prototype.$logicalOps = function (tensors, operation) {
        var newValues = [];
        switch (operation) {
            case 'gt':
                newValues = tensors[0].greater(tensors[1]).arraySync();
                break;
            case 'lt':
                newValues = tensors[0].less(tensors[1]).arraySync();
                break;
            case 'ge':
                newValues = tensors[0].greaterEqual(tensors[1]).arraySync();
                break;
            case 'le':
                newValues = tensors[0].lessEqual(tensors[1]).arraySync();
                break;
            case 'eq':
                newValues = tensors[0].equal(tensors[1]).arraySync();
                break;
            case 'ne':
                newValues = tensors[0].notEqual(tensors[1]).arraySync();
                break;
        }
        var newData = utils.mapIntegersToBooleans(newValues, 2);
        return new DataFrame(newData, {
            index: __spreadArray([], this.index, true),
            columns: __spreadArray([], this.columns, true),
            dtypes: __spreadArray([], this.dtypes, true),
            config: __assign({}, this.config)
        });
    };
    DataFrame.prototype.$MathOps = function (tensors, operation, inplace) {
        var tensorResult;
        switch (operation) {
            case 'add':
                tensorResult = tensors[0].add(tensors[1]);
                break;
            case 'sub':
                tensorResult = tensors[0].sub(tensors[1]);
                break;
            case 'pow':
                tensorResult = tensors[0].pow(tensors[1]);
                break;
            case 'div':
                tensorResult = tensors[0].div(tensors[1]);
                break;
            case 'divNoNan':
                tensorResult = tensors[0].divNoNan(tensors[1]);
                break;
            case 'mul':
                tensorResult = tensors[0].mul(tensors[1]);
                break;
            case 'mod':
                tensorResult = tensors[0].mod(tensors[1]);
                break;
        }
        if (inplace) {
            var newData = tensorResult === null || tensorResult === void 0 ? void 0 : tensorResult.arraySync();
            this.$setValues(newData);
        }
        else {
            return new DataFrame(tensorResult, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    /**
    * Purely integer-location based indexing for selection by position.
    * ``.iloc`` is primarily integer position based (from ``0`` to
    * ``length-1`` of the axis), but may also be used with a boolean array.
    *
    * @param rows Array of row indexes
    * @param columns Array of column indexes
    *
    * Allowed inputs are in rows and columns params are:
    *
    * - An array of single integer, e.g. ``[5]``.
    * - A list or array of integers, e.g. ``[4, 3, 0]``.
    * - A slice array string with ints, e.g. ``["1:7"]``.
    * - A boolean array.
    * - A ``callable`` function with one argument (the calling Series or
    * DataFrame) and that returns valid output for indexing (one of the above).
    * This is useful in method chains, when you don't have a reference to the
    * calling object, but would like to base your selection on some value.
    *
    * ``.iloc`` will raise ``IndexError`` if a requested indexer is
    * out-of-bounds.
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
    * const df2 = df.iloc({ rows: [1], columns: ["A"] })
    * ```
    */
    DataFrame.prototype.iloc = function (_a) {
        var rows = _a.rows, columns = _a.columns;
        return (0, indexing_1._iloc)({ ndFrame: this, rows: rows, columns: columns });
    };
    /**
     * Access a group of rows and columns by label(s) or a boolean array.
     * ``loc`` is primarily label based, but may also be used with a boolean array.
     *
     * @param rows Array of row indexes
     * @param columns Array of column indexes
     *
     * Allowed inputs are:
     *
     * - A single label, e.g. ``["5"]`` or ``['a']``, (note that ``5`` is interpreted as a
     *   *label* of the index, and **never** as an integer position along the index).
     *
     * - A list or array of labels, e.g. ``['a', 'b', 'c']``.
     *
     * - A slice object with labels, e.g. ``["a:f"]``. Note that start and the stop are included
     *
     * - A boolean array of the same length as the axis being sliced,
     * e.g. ``[True, False, True]``.
     *
     * - A ``callable`` function with one argument (the calling Series or
     * DataFrame) and that returns valid output for indexing (one of the above)
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
    * const df2 = df.loc({ rows: [1], columns: ["A"] })
    * ```
    */
    DataFrame.prototype.loc = function (_a) {
        var rows = _a.rows, columns = _a.columns;
        return (0, indexing_1._loc)({ ndFrame: this, rows: rows, columns: columns });
    };
    /**
     * Prints DataFrame to console as a formatted grid of row and columns.
    */
    DataFrame.prototype.toString = function () {
        var maxRow = this.config.getMaxRow;
        var maxColToDisplayInConsole = this.config.getTableMaxColInConsole;
        // let data;
        var dataArr = [];
        var colLen = this.columns.length;
        var header = [];
        if (colLen > maxColToDisplayInConsole) {
            //truncate displayed columns to fit in the console
            var firstFourcolNames = this.columns.slice(0, 4);
            var lastThreecolNames = this.columns.slice(colLen - 3);
            //join columns with truncate ellipse in the middle
            header = __spreadArray(__spreadArray(__spreadArray([""], firstFourcolNames, true), ["..."], false), lastThreecolNames, true);
            var subIdx = void 0;
            var firstHalfValues = void 0;
            var lastHalfValueS = void 0;
            if (this.values.length > maxRow) {
                //slice Object to show [max_rows]
                var dfSubset1 = this.iloc({
                    rows: ["0:" + maxRow],
                    columns: ["0:4"]
                });
                var dfSubset2 = this.iloc({
                    rows: ["0:" + maxRow],
                    columns: [colLen - 3 + ":"]
                });
                subIdx = this.index.slice(0, maxRow);
                firstHalfValues = dfSubset1.values;
                lastHalfValueS = dfSubset2.values;
            }
            else {
                var dfSubset1 = this.iloc({ columns: ["0:4"] });
                var dfSubset2 = this.iloc({ columns: [colLen - 3 + ":"] });
                subIdx = this.index.slice(0, maxRow);
                firstHalfValues = dfSubset1.values;
                lastHalfValueS = dfSubset2.values;
            }
            // merge subset 
            for (var i = 0; i < subIdx.length; i++) {
                var idx = subIdx[i];
                var row = __spreadArray(__spreadArray(__spreadArray([idx], firstHalfValues[i], true), ["..."], false), lastHalfValueS[i], true);
                dataArr.push(row);
            }
        }
        else {
            //display all columns
            header = __spreadArray([""], this.columns, true);
            var subIdx = void 0;
            var values = void 0;
            if (this.values.length > maxRow) {
                //slice Object to show a max of [max_rows]
                var data = this.iloc({ rows: ["0:" + maxRow] });
                subIdx = data.index;
                values = data.values;
            }
            else {
                values = this.values;
                subIdx = this.index;
            }
            // merge subset 
            for (var i = 0; i < subIdx.length; i++) {
                var idx = subIdx[i];
                var row = __spreadArray([idx], values[i], true);
                dataArr.push(row);
            }
        }
        var columnsConfig = {};
        columnsConfig[0] = { width: 10 }; //set column width for index column
        for (var index = 1; index < header.length; index++) {
            columnsConfig[index] = { width: 17, truncate: 16 };
        }
        var tableData = __spreadArray([header], dataArr, true); //Adds the column names to values before printing
        return (0, table_1.table)(tableData, __assign({ columns: columnsConfig }, this.config.getTableDisplayConfig));
    };
    /**
      * Returns the first n values in a DataFrame
      * @param rows The number of rows to return
      * @example
      * ```
      * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
      * const df2 = df.head(1)
      * ```
    */
    DataFrame.prototype.head = function (rows) {
        if (rows === void 0) { rows = 5; }
        if (rows <= 0) {
            throw new Error("ParamError: Number of rows cannot be less than 1");
        }
        if (this.shape[0] <= rows) {
            return this.copy();
        }
        if (this.shape[0] - rows < 0) {
            throw new Error("ParamError: Number of rows cannot be greater than available rows in data");
        }
        return this.iloc({ rows: ["0:" + rows] });
    };
    /**
      * Returns the last n values in a DataFrame
      * @param rows The number of rows to return
      * @example
      * ```
      * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
      * const df2 = df.tail(1)
      * ```
    */
    DataFrame.prototype.tail = function (rows) {
        if (rows === void 0) { rows = 5; }
        if (rows <= 0) {
            throw new Error("ParamError: Number of rows cannot be less than 1");
        }
        if (this.shape[0] <= rows) {
            return this.copy();
        }
        if (this.shape[0] - rows < 0) {
            throw new Error("ParamError: Number of rows cannot be greater than available rows in data");
        }
        rows = this.shape[0] - rows;
        return this.iloc({ rows: [rows + ":"] });
    };
    /**
     * Gets n number of random rows in a dataframe. Sample is reproducible if seed is provided.
     * @param num The number of rows to return. Default to 5.
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = await df.sample(1)
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = await df.sample(1, { seed: 1 })
     * ```
    */
    DataFrame.prototype.sample = function (num, options) {
        if (num === void 0) { num = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var seed, shuffledIndex, df;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        seed = __assign({ seed: 1 }, options).seed;
                        if (num > this.shape[0]) {
                            throw new Error("ParamError: Sample size cannot be bigger than number of rows");
                        }
                        if (num <= 0) {
                            throw new Error("ParamError: Sample size cannot be less than 1");
                        }
                        return [4 /*yield*/, tensorflowlib_1.default.data.array(this.index).shuffle(num, "" + seed).take(num).toArray()];
                    case 1:
                        shuffledIndex = _a.sent();
                        df = this.iloc({ rows: shuffledIndex });
                        return [2 /*return*/, df];
                }
            });
        });
    };
    DataFrame.prototype.add = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: add operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "add", inplace);
    };
    DataFrame.prototype.sub = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: sub operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "sub", inplace);
    };
    DataFrame.prototype.mul = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: mul operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "mul", inplace);
    };
    DataFrame.prototype.div = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: div operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "div", inplace);
    };
    DataFrame.prototype.divNoNan = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: div operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "divNoNan", inplace);
    };
    DataFrame.prototype.pow = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: pow operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "pow", inplace);
    };
    DataFrame.prototype.mod = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: mod operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$MathOps(tensors, "mod", inplace);
    };
    /**
     * Return mean of DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the mean column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.mean().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.mean({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.mean = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: mean operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) { return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length; });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return median of DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the median column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 4], [3, 4, 5], [6, 7, 8]], { columns: ['A', 'B', 'C'] });
     * df.median().print()
     * ```
    */
    DataFrame.prototype.median = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: median operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) { return (0, mathjs_1.median)(arr); });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return mode of DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the mode column-wise, if 1, row-wise. Defaults to 1
     * @param options.keep If there are more than one modes, returns the mode at position [keep]. Defaults to 0
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 4], [3, 4, 5], [6, 7, 8]], { columns: ['A', 'B', 'C'] });
     * df.mode().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 4], [3, 4, 5], [6, 7, 8]], { columns: ['A', 'B', 'C'] });
     * df.mode({ keep: 1 }).print()
     * ```
    */
    DataFrame.prototype.mode = function (options) {
        var _a = __assign({ axis: 1, keep: 0 }, options), axis = _a.axis, keep = _a.keep;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: mode operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) {
            var tempMode = (0, mathjs_1.mode)(arr);
            if (tempMode.length === 1) {
                return tempMode[0];
            }
            else {
                return tempMode[keep];
            }
        });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return minimum of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the minimum value column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.min().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.min({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.min = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: min operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) {
            var smallestValue = arr[0];
            for (var i = 0; i < arr.length; i++) {
                smallestValue = smallestValue < arr[i] ? smallestValue : arr[i];
            }
            return smallestValue;
        });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return maximum of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the maximum column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.max().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.max({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.max = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: max operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) {
            var biggestValue = arr[0];
            for (var i = 0; i < arr.length; i++) {
                biggestValue = biggestValue > arr[i] ? biggestValue : arr[i];
            }
            return biggestValue;
        });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return standard deviation of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the standard deviation column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.std().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.std({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.std = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: std operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) { return (0, mathjs_1.std)(arr); });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return variance of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the variance column-wise, if 1, add row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.var().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.var({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.var = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: var operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) { return (0, mathjs_1.variance)(arr); });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Get Less than of dataframe and other, element-wise (binary operator lt).
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.lt(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.lt([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.lt(sf, { axis: 1 }).print()
     * ```
    */
    DataFrame.prototype.lt = function (other, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: lt operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$logicalOps(tensors, "lt");
    };
    /**
     * Returns "greater than" of dataframe and other.
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.gt(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.gt([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.gt(sf, { axis: 1 }).print()
     * ```
    */
    DataFrame.prototype.gt = function (other, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: gt operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$logicalOps(tensors, "gt");
    };
    /**
     * Returns "equals to" of dataframe and other.
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.eq(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.eq([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.eq(sf, { axis: 1 }).print()
     * ```
    */
    DataFrame.prototype.eq = function (other, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: eq operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$logicalOps(tensors, "eq");
    };
    /**
     * Returns "not equal to" of dataframe and other.
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ne(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ne([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.ne(sf, { axis: 1 }).print()
     * ```
    */
    DataFrame.prototype.ne = function (other, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: ne operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$logicalOps(tensors, "ne");
    };
    /**
    * Returns "less than or equal to" of dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.le(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.le([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.le(sf, { axis: 1 }).print()
     * ```
    */
    DataFrame.prototype.le = function (other, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: le operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$logicalOps(tensors, "le");
    };
    /**
    * Returns "greater than or equal to" between dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ge(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ge([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.ge(sf, { axis: 1 }).print()
     * ```
    */
    DataFrame.prototype.ge = function (other, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: ge operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
        return this.$logicalOps(tensors, "ge");
    };
    /**
     * Return number of non-null elements in a Series
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.count().print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.count({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.count = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var resultArr = newData.map(function (arr) { return arr.length; });
        if (axis === 0) {
            return new series_1.default(resultArr, { index: this.columns });
        }
        else {
            return new series_1.default(resultArr, { index: this.index });
        }
    };
    /**
     * Return the sum of values across an axis.
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.sum().print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.sum({ axis: 0 }).print()
     * ```
    */
    DataFrame.prototype.sum = function (options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var result = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var sumArr = result.map(function (innerArr) {
            return innerArr.reduce(function (a, b) { return Number(a) + Number(b); }, 0);
        });
        if (axis === 0) {
            return new series_1.default(sumArr, {
                index: __spreadArray([], this.columns, true)
            });
        }
        else {
            return new series_1.default(sumArr, {
                index: __spreadArray([], this.index, true)
            });
        }
    };
    DataFrame.prototype.pctChange = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: pctChange operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        if (other === 0) {
            return this;
        }
        if (typeof other === "number") {
            var origDF = this.copy();
            if (axis === 0) {
                origDF = origDF.T;
            }
            var originalTensor = origDF.tensor.clone();
            var unit = new Array(originalTensor.shape[originalTensor.rank - 1]).fill(NaN);
            var pctArray = originalTensor.arraySync();
            if (other > 0) {
                for (var i = 0; i < other; i++) {
                    pctArray.unshift(unit);
                    pctArray.pop();
                }
            }
            else if (other < 0) {
                for (var i = 0; i > other; i--) {
                    pctArray.push(unit);
                    pctArray.shift();
                }
            }
            var pctTensor = tensorflowlib_1.default.tensor2d(pctArray, originalTensor.shape);
            var pctDF = this.$MathOps([originalTensor, pctTensor], "divNoNan", inplace).sub(1);
            if (axis === 0) {
                return pctDF.T;
            }
            return pctDF;
        }
        if (other instanceof DataFrame || other instanceof series_1.default) {
            var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
            var pctDF = this.$MathOps(tensors, "divNoNan", inplace).sub(1);
            return pctDF;
        }
    };
    DataFrame.prototype.diff = function (other, options) {
        var _a = __assign({ inplace: false, axis: 1 }, options), inplace = _a.inplace, axis = _a.axis;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: diff operation is not supported for string dtypes");
        }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        if (other === 0) {
            return this;
        }
        if (typeof other === "number") {
            var origDF = this.copy();
            if (axis === 0) {
                origDF = origDF.T;
            }
            var originalTensor = origDF.tensor.clone();
            var unit = new Array(originalTensor.shape[originalTensor.rank - 1]).fill(NaN);
            var diffArray = originalTensor.arraySync();
            if (other > 0) {
                for (var i = 0; i < other; i++) {
                    diffArray.unshift(unit);
                    diffArray.pop();
                }
            }
            else if (other < 0) {
                for (var i = 0; i > other; i--) {
                    diffArray.push(unit);
                    diffArray.shift();
                }
            }
            var diffTensor = tensorflowlib_1.default.tensor2d(diffArray, originalTensor.shape);
            var diffDF = this.$MathOps([originalTensor, diffTensor], "sub", inplace);
            if (axis === 0) {
                return diffDF.T;
            }
            return diffDF;
        }
        if (other instanceof DataFrame || other instanceof series_1.default) {
            var tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
            return this.$MathOps(tensors, "sub", inplace);
        }
    };
    DataFrame.prototype.abs = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newData = this.values.map(function (arr) { return arr.map(function (val) { return Math.abs(val); }); });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    DataFrame.prototype.round = function (dp, options) {
        if (dp === void 0) { dp = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: round operation is not supported for string dtypes");
        }
        if (typeof dp !== "number") {
            throw Error("ParamError: dp must be a number");
        }
        var newData = utils.round(this.values, dp, false);
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                config: __assign({}, this.config)
            });
        }
    };
    DataFrame.prototype.cumProd = function (options) {
        var _a = __assign({ axis: 1, inplace: false }, options), axis = _a.axis, inplace = _a.inplace;
        return this.cumOps("prod", axis, inplace);
    };
    DataFrame.prototype.cumSum = function (options) {
        var _a = __assign({ axis: 1, inplace: false }, options), axis = _a.axis, inplace = _a.inplace;
        return this.cumOps("sum", axis, inplace);
    };
    DataFrame.prototype.cumMin = function (options) {
        var _a = __assign({ axis: 1, inplace: false }, options), axis = _a.axis, inplace = _a.inplace;
        return this.cumOps("min", axis, inplace);
    };
    DataFrame.prototype.cumMax = function (options) {
        var _a = __assign({ axis: 1, inplace: false }, options), axis = _a.axis, inplace = _a.inplace;
        return this.cumOps("max", axis, inplace);
    };
    DataFrame.prototype.cumOps = function (ops, axis, inplace) {
        if (this.dtypes.includes("string"))
            errors_1.default.throwStringDtypeOperationError(ops);
        var result = this.$getDataByAxisWithMissingValuesRemoved(axis);
        var newData = result.map(function (sData) {
            var tempval = sData[0];
            var data = [tempval];
            for (var i = 1; i < sData.length; i++) {
                var currVal = sData[i];
                switch (ops) {
                    case "max":
                        if (currVal > tempval) {
                            data.push(currVal);
                            tempval = currVal;
                        }
                        else {
                            data.push(tempval);
                        }
                        break;
                    case "min":
                        if (currVal < tempval) {
                            data.push(currVal);
                            tempval = currVal;
                        }
                        else {
                            data.push(tempval);
                        }
                        break;
                    case "sum":
                        tempval = tempval + currVal;
                        data.push(tempval);
                        break;
                    case "prod":
                        tempval = tempval * currVal;
                        data.push(tempval);
                        break;
                }
            }
            return data;
        });
        if (axis === 0) {
            newData = utils.transposeArray(newData);
        }
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    /**
     * Generate descriptive statistics for all numeric columns.
     * Descriptive statistics include those that summarize the central tendency,
     * dispersion and shape of a dataset’s distribution, excluding NaN values.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.describe().print()
     * ```
     */
    DataFrame.prototype.describe = function () {
        var _this = this;
        var numericColumnNames = this.columns.filter(function (name) { return _this.$getColumnDtype(name) !== "string"; });
        var index = ["count", "mean", "std", "min", "median", "max", "variance"];
        var statsObject = {};
        for (var i = 0; i < numericColumnNames.length; i++) {
            var colName = numericColumnNames[i];
            var $count = this.$getColumnData(colName).count();
            var $mean = (0, mathjs_1.mean)(this.$getColumnData(colName, false));
            var $std = (0, mathjs_1.std)(this.$getColumnData(colName, false));
            var $min = this.$getColumnData(colName).min();
            var $median = (0, mathjs_1.median)(this.$getColumnData(colName, false));
            var $max = this.$getColumnData(colName).max();
            var $variance = (0, mathjs_1.variance)(this.$getColumnData(colName, false));
            var stats = [$count, $mean, $std, $min, $median, $max, $variance];
            statsObject[colName] = stats;
        }
        var df = new DataFrame(statsObject, { index: index });
        return df;
    };
    DataFrame.prototype.dropNa = function (options) {
        var _a = __assign({ axis: 1, inplace: false }, options), axis = _a.axis, inplace = _a.inplace;
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: Axis must be 0 or 1");
        }
        var newIndex = [];
        if (axis == 1) {
            var newData = [];
            var dfValues = this.values;
            for (var i = 0; i < dfValues.length; i++) {
                var values = dfValues[i];
                //@ts-ignore
                if (!values.includes(NaN) && !values.includes(undefined) && !values.includes(null)) {
                    newData.push(values);
                    newIndex.push(this.index[i]);
                }
            }
            if (inplace) {
                this.$setValues(newData, false);
                this.$setIndex(newIndex);
            }
            else {
                return new DataFrame(newData, {
                    index: newIndex,
                    columns: __spreadArray([], this.columns, true),
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
            }
        }
        else {
            var newColumnNames = [];
            var newDtypes = [];
            var dfValues = [];
            if (this.config.isLowMemoryMode) {
                dfValues = utils.transposeArray(this.values);
            }
            else {
                dfValues = this.$dataIncolumnFormat;
            }
            var tempColArr = [];
            for (var i = 0; i < dfValues.length; i++) {
                var values = dfValues[i];
                if (!values.includes(NaN)) {
                    tempColArr.push(values);
                    newColumnNames.push(this.columns[i]);
                    newDtypes.push(this.dtypes[i]);
                }
            }
            var newData = utils.transposeArray(tempColArr);
            if (inplace) {
                this.$setValues(newData, false, false);
                this.$setColumnNames(newColumnNames);
                this.$setDtypes(newDtypes);
            }
            else {
                return new DataFrame(newData, {
                    index: __spreadArray([], this.index, true),
                    columns: newColumnNames,
                    dtypes: newDtypes,
                    config: __assign({}, this.config)
                });
            }
        }
    };
    DataFrame.prototype.addColumn = function (column, values, options) {
        var _a = __assign({ inplace: false, atIndex: this.columns.length }, options), inplace = _a.inplace, atIndex = _a.atIndex;
        if (typeof atIndex === "string") {
            if (!(this.columns.includes(atIndex))) {
                throw new Error(atIndex + " not a column");
            }
            atIndex = this.columns.indexOf(atIndex);
        }
        if (!column) {
            throw new Error("ParamError: column must be specified");
        }
        if (!values) {
            throw new Error("ParamError: values must be specified");
        }
        var columnIndex = this.$columns.indexOf(column);
        if (columnIndex === -1) {
            var colunmValuesToAdd = void 0;
            if (values instanceof series_1.default) {
                colunmValuesToAdd = values.values;
            }
            else if (Array.isArray(values)) {
                colunmValuesToAdd = values;
            }
            else {
                throw new Error("ParamError: specified value not supported. It must either be an Array or a Series of the same length");
            }
            if (colunmValuesToAdd.length !== this.shape[0]) {
                errors_1.default.throwColumnLengthError(this, colunmValuesToAdd.length);
            }
            var newData = [];
            var oldValues = this.$data;
            for (var i = 0; i < oldValues.length; i++) {
                var innerArr = __spreadArray([], oldValues[i], true);
                innerArr.splice(atIndex, 0, colunmValuesToAdd[i]);
                newData.push(innerArr);
            }
            if (inplace) {
                this.$setValues(newData, true, false);
                var columns = __spreadArray([], this.columns, true);
                columns.splice(atIndex, 0, column);
                this.$setColumnNames(columns);
                this.$setInternalColumnDataProperty(column);
            }
            else {
                var columns = __spreadArray([], this.columns, true);
                columns.splice(atIndex, 0, column);
                var df = new DataFrame(newData, {
                    index: __spreadArray([], this.index, true),
                    columns: columns,
                    dtypes: __spreadArray(__spreadArray([], this.dtypes, true), [utils.inferDtype(colunmValuesToAdd)[0]], false),
                    config: __assign({}, this.$config)
                });
                return df;
            }
        }
        else {
            this.$setColumnData(column, values);
        }
    };
    /**
     * Makes a deep copy of a DataFrame.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.copy()
     * df2.print()
     * ```
     */
    DataFrame.prototype.copy = function () {
        var df = new DataFrame(__spreadArray([], this.$data, true), {
            columns: __spreadArray([], this.columns, true),
            index: __spreadArray([], this.index, true),
            dtypes: __spreadArray([], this.dtypes, true),
            config: __assign({}, this.$config)
        });
        return df;
    };
    /**
     * Return a boolean, same-sized object indicating where elements are empty (NaN, undefined, null).
     * NaN, undefined and null values gets mapped to true, and everything else gets mapped to false.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.isNa().print()
     * ```
    */
    DataFrame.prototype.isNa = function () {
        var newData = [];
        for (var i = 0; i < this.values.length; i++) {
            var valueArr = this.values[i];
            var tempData = valueArr.map(function (value) {
                if (utils.isEmpty(value)) {
                    return true;
                }
                else {
                    return false;
                }
            });
            newData.push(tempData);
        }
        var df = new DataFrame(newData, {
            index: __spreadArray([], this.index, true),
            columns: __spreadArray([], this.columns, true),
            config: __assign({}, this.config)
        });
        return df;
    };
    DataFrame.prototype.fillNa = function (values, options) {
        var _this = this;
        var _a = __assign({ inplace: false }, options), columns = _a.columns, inplace = _a.inplace;
        if (!values && typeof values !== "boolean" && typeof values !== "number" && typeof values !== "string") {
            throw Error('ParamError: value must be specified');
        }
        if (Array.isArray(values)) {
            if (!Array.isArray(columns)) {
                throw Error('ParamError: value is an array, hence columns must also be an array of same length');
            }
            if (values.length !== columns.length) {
                throw Error('ParamError: specified column and values must have the same length');
            }
            columns.forEach(function (col) {
                if (!_this.columns.includes(col)) {
                    throw Error("ValueError: Specified column \"" + col + "\" must be one of " + _this.columns);
                }
            });
        }
        var newData = [];
        var oldValues = __spreadArray([], this.values, true);
        if (!columns) {
            var _loop_2 = function (i) {
                var valueArr = __spreadArray([], oldValues[i], true);
                var tempArr = valueArr.map(function (innerVal) {
                    if (utils.isEmpty(innerVal)) {
                        var replaceWith = Array.isArray(values) ? values[i] : values;
                        return replaceWith;
                    }
                    else {
                        return innerVal;
                    }
                });
                newData.push(tempArr);
            };
            //Fill all columns
            for (var i = 0; i < oldValues.length; i++) {
                _loop_2(i);
            }
        }
        else {
            //Fill specific columns
            var tempData = __spreadArray([], this.values, true);
            for (var i = 0; i < tempData.length; i++) {
                var valueArr = tempData[i];
                for (var i_1 = 0; i_1 < columns.length; i_1++) { //B
                    var columnIndex = this.columns.indexOf(columns[i_1]);
                    var replaceWith = Array.isArray(values) ? values[i_1] : values;
                    valueArr[columnIndex] = utils.isEmpty(valueArr[columnIndex]) ? replaceWith : valueArr[columnIndex];
                }
                newData.push(valueArr);
            }
        }
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            var df = new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
            return df;
        }
    };
    DataFrame.prototype.drop = function (options) {
        var _a = __assign({ inplace: false }, options), columns = _a.columns, index = _a.index, inplace = _a.inplace;
        if (!columns && !index) {
            throw Error('ParamError: Must specify one of columns or index');
        }
        if (columns && index) {
            throw Error('ParamError: Can only specify one of columns or index');
        }
        if (columns) {
            var columnIndices = [];
            if (typeof columns === "string") {
                columnIndices.push(this.columns.indexOf(columns));
            }
            else if (Array.isArray(columns)) {
                for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                    var column = columns_1[_i];
                    if (this.columns.indexOf(column) === -1) {
                        throw Error("ParamError: specified column \"" + column + "\" not found in columns");
                    }
                    columnIndices.push(this.columns.indexOf(column));
                }
            }
            else {
                throw Error('ParamError: columns must be an array of column names or a string of column name');
            }
            var newRowData = [];
            var newColumnNames = [];
            var newDtypes = [];
            for (var i = 0; i < this.values.length; i++) {
                var tempInnerArr = [];
                var innerArr = this.values[i];
                for (var j = 0; j < innerArr.length; j++) {
                    if (!(columnIndices.includes(j))) {
                        tempInnerArr.push(innerArr[j]);
                    }
                }
                newRowData.push(tempInnerArr);
            }
            for (var i = 0; i < this.columns.length; i++) {
                var element = this.columns[i];
                if (!(columns.includes(element))) {
                    newColumnNames.push(element);
                    newDtypes.push(this.dtypes[i]);
                }
            }
            if (inplace) {
                this.$setValues(newRowData, true, false);
                this.$setColumnNames(newColumnNames);
            }
            else {
                var df = new DataFrame(newRowData, {
                    index: __spreadArray([], this.index, true),
                    columns: newColumnNames,
                    dtypes: newDtypes,
                    config: __assign({}, this.config)
                });
                return df;
            }
        }
        if (index) {
            var rowIndices = [];
            if (typeof index === "string" || typeof index === "number" || typeof index === "boolean") {
                rowIndices.push(this.index.indexOf(index));
            }
            else if (Array.isArray(index)) {
                for (var _b = 0, index_1 = index; _b < index_1.length; _b++) {
                    var indx = index_1[_b];
                    if (this.index.indexOf(indx) === -1) {
                        throw Error("ParamError: specified index \"" + indx + "\" not found in indices");
                    }
                    rowIndices.push(this.index.indexOf(indx));
                }
            }
            else {
                throw Error('ParamError: index must be an array of indices or a scalar index');
            }
            var newRowData = [];
            var newIndex = [];
            for (var i = 0; i < this.values.length; i++) {
                var innerArr = this.values[i];
                if (!(rowIndices.includes(i))) {
                    newRowData.push(innerArr);
                }
            }
            for (var i = 0; i < this.index.length; i++) {
                var indx = this.index[i];
                if (!(index.includes(indx))) {
                    newIndex.push(indx);
                }
            }
            if (inplace) {
                this.$setValues(newRowData, false);
                this.$setIndex(newIndex);
            }
            else {
                var df = new DataFrame(newRowData, {
                    index: newIndex,
                    columns: __spreadArray([], this.columns, true),
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
                return df;
            }
        }
    };
    DataFrame.prototype.sortValues = function (column, options) {
        var _a = __assign({ ascending: true, inplace: false }, options), ascending = _a.ascending, inplace = _a.inplace;
        if (!column) {
            throw Error("ParamError: must specify a column to sort by");
        }
        if (this.columns.indexOf(column) === -1) {
            throw Error("ParamError: specified column \"" + column + "\" not found in columns");
        }
        var columnValues = this.$getColumnData(column, false);
        var index = __spreadArray([], this.index, true);
        var objToSort = columnValues.map(function (value, i) {
            return { index: index[i], value: value };
        });
        var sortedObjectArr = utils.sortObj(objToSort, ascending);
        var sortedIndex = sortedObjectArr.map(function (obj) { return obj.index; });
        var newDf = (0, indexing_1._loc)({ ndFrame: this, rows: sortedIndex });
        if (inplace) {
            this.$setValues(newDf.values);
            this.$setIndex(newDf.index);
        }
        else {
            return newDf;
        }
    };
    DataFrame.prototype.setIndex = function (options) {
        var _a = __assign({ drop: false, inplace: false }, options), index = _a.index, column = _a.column, drop = _a.drop, inplace = _a.inplace;
        if (!index && !column) {
            throw new Error("ParamError: must specify either index or column");
        }
        var newIndex = [];
        if (index) {
            if (!Array.isArray(index)) {
                throw Error("ParamError: index must be an array");
            }
            if (index.length !== this.values.length) {
                throw Error("ParamError: index must be the same length as the number of rows");
            }
            newIndex = index;
        }
        if (column) {
            if (this.columns.indexOf(column) === -1) {
                throw Error("ParamError: column not found in column names");
            }
            newIndex = this.$getColumnData(column, false);
        }
        if (drop) {
            var dfDropped = this.drop({ columns: [column] });
            var newData = dfDropped === null || dfDropped === void 0 ? void 0 : dfDropped.values;
            var newColumns = dfDropped === null || dfDropped === void 0 ? void 0 : dfDropped.columns;
            var newDtypes = dfDropped === null || dfDropped === void 0 ? void 0 : dfDropped.dtypes;
            if (inplace) {
                this.$setValues(newData, true, false);
                this.$setIndex(newIndex);
                this.$setColumnNames(newColumns);
            }
            else {
                var df = new DataFrame(newData, {
                    index: newIndex,
                    columns: newColumns,
                    dtypes: newDtypes,
                    config: __assign({}, this.config)
                });
                return df;
            }
        }
        else {
            if (inplace) {
                this.$setIndex(newIndex);
            }
            else {
                var df = new DataFrame(this.values, {
                    index: newIndex,
                    columns: __spreadArray([], this.columns, true),
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
                return df;
            }
        }
    };
    DataFrame.prototype.resetIndex = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (inplace) {
            this.$resetIndex();
        }
        else {
            var df = new DataFrame(this.values, {
                index: this.index.map(function (_, i) { return i; }),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
            return df;
        }
    };
    /**
     * Apply a function along an axis of the DataFrame. To apply a function element-wise, use `applyMap`.
     * Objects passed to the function are Series values whose
     * index is either the DataFrame’s index (axis=0) or the DataFrame’s columns (axis=1)
     * @param callable Function to apply to each column or row.
     * @param options.axis 0 or 1. If 0, apply "callable" column-wise, else apply row-wise
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.apply(Math.sqrt, { axis: 0 })
     * df2.print()
     * ```
    */
    DataFrame.prototype.apply = function (callable, options) {
        var axis = __assign({ axis: 1 }, options).axis;
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: axis must be 0 or 1");
        }
        //Add index cho map function and keep NaN value
        // const valuesForFunc = this.$getDataByAxisWithMissingValuesRemoved(axis)
        var valuesForFunc = this.$getDataArraysByAxis(axis);
        var result = valuesForFunc.map(function (row, index) {
            return callable(row, index);
        });
        if (axis === 0) {
            if (utils.is1DArray(result)) {
                return new series_1.default(result, {
                    index: __spreadArray([], this.columns, true)
                });
            }
            else {
                return new DataFrame(result, {
                    index: __spreadArray([], this.columns, true),
                    columns: __spreadArray([], this.columns, true),
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
            }
        }
        else {
            if (utils.is1DArray(result)) {
                return new series_1.default(result, {
                    index: __spreadArray([], this.index, true)
                });
            }
            else {
                return new DataFrame(result, {
                    index: __spreadArray([], this.index, true),
                    columns: __spreadArray([], this.columns, true),
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
            }
        }
    };
    DataFrame.prototype.applyMap = function (callable, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newData = this.values.map(function (row) {
            var tempData = row.map(function (val) {
                return callable(val);
            });
            return tempData;
        });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    /**
     * Returns the specified column data as a Series object.
     * @param column The name of the column to return
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = df.column('A')
     * sf.print()
     * ```
     *
    */
    DataFrame.prototype.column = function (column) {
        return this.$getColumnData(column);
    };
    /**
     * Return a subset of the DataFrame based on the column dtypes.
     * @param include An array of dtypes or strings to be included.
     * @example
     * ```
     * const df = new DataFrame([[1, 2.1, "Dog"], [3, 4.3, "Cat"]], { columns: ['A', 'B', 'C']})
     * const df2 = df.selectDtypes(['float32'])
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2.1, "Dog"], [3, 4.3, "Cat"]], { columns: ['A', 'B', 'C']})
     * const df2 = df.selectDtypes(['float32', 'int32'])
     * df2.print()
     * ```
     *
    */
    DataFrame.prototype.selectDtypes = function (include) {
        var supportedDtypes = ["float32", "int32", "string", "boolean", 'undefined'];
        if (Array.isArray(include) === false) {
            throw Error("ParamError: include must be an array");
        }
        include.forEach(function (dtype) {
            if (supportedDtypes.indexOf(dtype) === -1) {
                throw Error("ParamError: include must be an array of valid dtypes");
            }
        });
        var newColumnNames = [];
        for (var i = 0; i < this.dtypes.length; i++) {
            if (include.includes(this.dtypes[i])) {
                newColumnNames.push(this.columns[i]);
            }
        }
        return this.loc({ columns: newColumnNames });
    };
    DataFrame.prototype.transpose = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newData = utils.transposeArray(this.values);
        var newColNames = __spreadArray([], this.index.map(function (i) { return i.toString(); }), true);
        if (inplace) {
            this.$setValues(newData, false, false);
            this.$setIndex(__spreadArray([], this.columns, true));
            this.$setColumnNames(newColNames);
        }
        else {
            return new DataFrame(newData, {
                index: __spreadArray([], this.columns, true),
                columns: newColNames,
                config: __assign({}, this.config)
            });
        }
    };
    Object.defineProperty(DataFrame.prototype, "T", {
        /**
         * Returns the Transpose of the DataFrame. Similar to `transpose`.
         * @example
         * ```
         * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
         * const df2 = df.T()
         * df2.print()
         * ```
        **/
        get: function () {
            var newData = utils.transposeArray(this.values);
            return new DataFrame(newData, {
                index: __spreadArray([], this.columns, true),
                columns: __spreadArray([], this.index.map(function (i) { return i.toString(); }), true),
                config: __assign({}, this.config)
            });
        },
        enumerable: false,
        configurable: true
    });
    DataFrame.prototype.replace = function (oldValue, newValue, options) {
        var _this = this;
        var _a = __assign({ inplace: false }, options), columns = _a.columns, inplace = _a.inplace;
        if (!oldValue && typeof oldValue !== 'boolean') {
            throw Error("Params Error: Must specify param 'oldValue' to replace");
        }
        if (!newValue && typeof newValue !== 'boolean') {
            throw Error("Params Error: Must specify param 'newValue' to replace with");
        }
        var newData = [];
        if (columns) {
            if (!Array.isArray(columns)) {
                throw Error("Params Error: column must be an array of column(s)");
            }
            var columnIndex_1 = [];
            columns.forEach(function (column) {
                var _indx = _this.columns.indexOf(column);
                if (_indx === -1) {
                    throw Error("Params Error: column not found in columns");
                }
                columnIndex_1.push(_indx);
            });
            newData = this.values.map(function (_a) {
                var row = _a.slice(0);
                for (var _i = 0, columnIndex_2 = columnIndex_1; _i < columnIndex_2.length; _i++) {
                    var colIndx = columnIndex_2[_i];
                    if (row[colIndx] === oldValue) {
                        row[colIndx] = newValue;
                    }
                }
                return row;
            });
        }
        else {
            newData = this.values.map(function (_a) {
                var row = _a.slice(0);
                return row.map((function (cell) {
                    if (cell === oldValue) {
                        return newValue;
                    }
                    else {
                        return cell;
                    }
                }));
            });
        }
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    DataFrame.prototype.asType = function (column, dtype, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var columnIndex = this.columns.indexOf(column);
        if (columnIndex === -1) {
            throw Error("Params Error: column not found in columns");
        }
        if (!(defaults_1.DATA_TYPES.includes(dtype))) {
            throw Error("dtype " + dtype + " not supported. dtype must be one of " + defaults_1.DATA_TYPES);
        }
        var data = this.values;
        var newData = data.map(function (row) {
            if (dtype === "float32") {
                row[columnIndex] = Number(row[columnIndex]);
                return row;
            }
            else if (dtype === "int32") {
                row[columnIndex] = parseInt(row[columnIndex]);
                return row;
            }
            else if (dtype === "string") {
                row[columnIndex] = row[columnIndex].toString();
                return row;
            }
            else if (dtype === "boolean") {
                row[columnIndex] = Boolean(row[columnIndex]);
                return row;
            }
        });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            var newDtypes = __spreadArray([], this.dtypes, true);
            newDtypes[columnIndex] = dtype;
            return new DataFrame(newData, {
                index: __spreadArray([], this.index, true),
                columns: __spreadArray([], this.columns, true),
                dtypes: newDtypes,
                config: __assign({}, this.config)
            });
        }
    };
    /**
     * Return the number of unique elements in a column, across the specified axis.
     * To get the values use `.unique()` instead.
     * @param axis The axis to count unique elements across. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * df.nunique().print()
     * ```
     *
    */
    DataFrame.prototype.nUnique = function (axis) {
        if (axis === void 0) { axis = 1; }
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: axis must be 0 or 1");
        }
        var data = this.$getDataArraysByAxis(axis);
        var newData = data.map(function (row) { return new Set(row).size; });
        if (axis === 0) {
            return new series_1.default(newData, {
                index: __spreadArray([], this.columns, true),
                dtypes: ["int32"]
            });
        }
        else {
            return new series_1.default(newData, {
                index: __spreadArray([], this.index, true),
                dtypes: ["int32"]
            });
        }
    };
    DataFrame.prototype.rename = function (mapper, options) {
        var _a = __assign({ axis: 1, inplace: false }, options), axis = _a.axis, inplace = _a.inplace;
        if ([0, 1].indexOf(axis) === -1) {
            throw Error("ParamError: axis must be 0 or 1");
        }
        if (axis === 1) {
            var colsAdded_2 = [];
            var newColumns = this.columns.map(function (col) {
                if (mapper[col] !== undefined) {
                    var newCol = "" + mapper[col];
                    colsAdded_2.push(newCol);
                    return newCol;
                }
                else {
                    return col;
                }
            });
            if (inplace) {
                this.$setColumnNames(newColumns);
                for (var _i = 0, colsAdded_1 = colsAdded_2; _i < colsAdded_1.length; _i++) {
                    var col = colsAdded_1[_i];
                    this.$setInternalColumnDataProperty(col);
                }
            }
            else {
                return new DataFrame(__spreadArray([], this.values, true), {
                    index: __spreadArray([], this.index, true),
                    columns: newColumns,
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
            }
        }
        else {
            var newIndex = this.index.map(function (col) {
                if (mapper[col] !== undefined) {
                    return mapper[col];
                }
                else {
                    return col;
                }
            });
            if (inplace) {
                this.$setIndex(newIndex);
            }
            else {
                return new DataFrame(__spreadArray([], this.values, true), {
                    index: newIndex,
                    columns: __spreadArray([], this.columns, true),
                    dtypes: __spreadArray([], this.dtypes, true),
                    config: __assign({}, this.config)
                });
            }
        }
    };
    DataFrame.prototype.sortIndex = function (options) {
        var _this = this;
        var _a = __assign({ ascending: true, inplace: false }, options), ascending = _a.ascending, inplace = _a.inplace;
        var indexPosition = utils.range(0, this.index.length - 1);
        var index = __spreadArray([], this.index, true);
        var objToSort = index.map(function (idx, i) {
            return { index: indexPosition[i], value: idx };
        });
        var sortedObjectArr = utils.sortObj(objToSort, ascending);
        var sortedIndex = sortedObjectArr.map(function (obj) { return obj.index; });
        var newData = sortedIndex.map(function (i) { return _this.values[i]; });
        sortedIndex = sortedIndex.map(function (i) { return index[i]; });
        if (inplace) {
            this.$setValues(newData);
            this.$setIndex(sortedIndex);
        }
        else {
            return new DataFrame(newData, {
                index: sortedIndex,
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    DataFrame.prototype.append = function (newValues, index, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!newValues) {
            throw Error("ParamError: newValues must be a Series, DataFrame or Array");
        }
        if (!index) {
            throw Error("ParamError: index must be specified");
        }
        var rowsToAdd = [];
        if (newValues instanceof series_1.default) {
            if (newValues.values.length !== this.shape[1]) {
                throw Error("ValueError: length of newValues must be the same as the number of columns.");
            }
            rowsToAdd = [newValues.values];
        }
        else if (newValues instanceof DataFrame) {
            if (newValues.shape[1] !== this.shape[1]) {
                throw Error("ValueError: length of newValues must be the same as the number of columns.");
            }
            rowsToAdd = newValues.values;
        }
        else if (Array.isArray(newValues)) {
            if (utils.is1DArray(newValues)) {
                rowsToAdd = [newValues];
            }
            else {
                rowsToAdd = newValues;
            }
            if (rowsToAdd[0].length !== this.shape[1]) {
                throw Error("ValueError: length of newValues must be the same as the number of columns.");
            }
        }
        else {
            throw Error("ValueError: newValues must be a Series, DataFrame or Array");
        }
        var indexInArrFormat = [];
        if (!Array.isArray(index)) {
            indexInArrFormat = [index];
        }
        else {
            indexInArrFormat = index;
        }
        if (rowsToAdd.length !== indexInArrFormat.length) {
            throw Error("ParamError: index must contain the same number of values as newValues");
        }
        var newData = __spreadArray([], this.values, true);
        var newIndex = __spreadArray([], this.index, true);
        rowsToAdd.forEach(function (row, i) {
            newData.push(row);
            newIndex.push(indexInArrFormat[i]);
        });
        if (inplace) {
            this.$setValues(newData);
            this.$setIndex(newIndex);
        }
        else {
            return new DataFrame(newData, {
                index: newIndex,
                columns: __spreadArray([], this.columns, true),
                dtypes: __spreadArray([], this.dtypes, true),
                config: __assign({}, this.config)
            });
        }
    };
    DataFrame.prototype.query = function (condition, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!condition) {
            throw new Error("ParamError: condition must be specified");
        }
        var result = (0, indexing_1._iloc)({
            ndFrame: this,
            rows: condition,
        });
        if (inplace) {
            this.$setValues(result.values, false, false);
            this.$setIndex(result.index);
        }
        else {
            return result;
        }
    };
    Object.defineProperty(DataFrame.prototype, "ctypes", {
        /**
         * Returns the data types for each column as a Series.
         * @example
         * ```
         * const df = new DataFrame([[1, 2.1, "Dog"], [3, 4.3, "Cat"]], { columns: ['A', 'B', 'C'] })
         * df.ctypes().print()
         * ```
         */
        get: function () {
            return new series_1.default(this.dtypes, { index: this.columns });
        },
        enumerable: false,
        configurable: true
    });
    DataFrame.prototype.getDummies = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var encodedDF = (0, dummy_encoder_1.default)(this, options);
        if (inplace) {
            this.$setValues(encodedDF.values, false, false);
            this.$setColumnNames(encodedDF.columns);
        }
        else {
            return encodedDF;
        }
    };
    /**
     * Groupby
     * @params col a list of column
     * @returns Groupby
     * @example
     * let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
     * let cols = [ "A", "B", "C" ];
     * let df = new dfd.DataFrame(data, { columns: cols });
     * let groupDf = df.groupby([ "A" ]);
     */
    DataFrame.prototype.groupby = function (col) {
        var columns = this.columns;
        var colIndex = col.map(function (val) { return columns.indexOf(val); });
        var colDtype = this.dtypes;
        return new groupby_1.default(col, this.values, columns, colDtype, colIndex).group();
    };
    /**
     * Access a single value for a row/column pair by integer position.
     * Similar to {@link iloc}, in that both provide integer-based lookups.
     * Use iat if you only need to get or set a single value in a DataFrame.
     * @param row Row index of the value to access.
     * @param column Column index of the value to access.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.iat(0, 0) // 1
     * df.iat(0, 1) // 2
     * df.iat(1, 0) // 3
     * ```
    */
    DataFrame.prototype.iat = function (row, column) {
        if (typeof row === 'string' || typeof column === 'string') {
            throw new Error('ParamError: row and column index must be an integer. Use .at to get a row or column by label.');
        }
        return this.values[row][column];
    };
    /**
     * Access a single value for a row/column label pair.
     * Similar to {@link loc}, in that both provide label-based lookups.
     * Use at if you only need to get or set a single value in a DataFrame.
     * @param row Row index of the value to access.
     * @param column Column label of the value to access.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.at(0,'A') // 1
     * df.at(1, 'A') // 3
     * df.at(1, 'B') // 4
     * ```
    */
    DataFrame.prototype.at = function (row, column) {
        if (typeof column !== 'string') {
            throw new Error('ParamError: column index must be a string. Use .iat to get a row or column by index.');
        }
        return this.values[this.index.indexOf(row)][this.columns.indexOf(column)];
    };
    /**
     * Exposes functions for creating charts from a DataFrame.
     * Charts are created using the Plotly.js library, so all Plotly's configuration parameters are available.
     * @param divId name of the HTML Div to render the chart in.
    */
    DataFrame.prototype.plot = function (divId) {
        //TODO: Add support for check plot library to use. So we can support other plot library like d3, vega, etc
        if (utils.isBrowserEnv()) {
            var plt = new plotting_1.PlotlyLib(this, divId);
            return plt;
        }
        else {
            throw new Error("Not supported in NodeJS");
        }
    };
    return DataFrame;
}(generic_1.default));
exports.default = DataFrame;

"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __importDefault(require("../shared/utils"));
var config_1 = __importDefault(require("../shared/config"));
var errors_1 = __importDefault(require("../shared/errors"));
var defaults_1 = require("../shared/defaults");
var io_1 = require("../io");
var tfjs_1 = require("@tensorflow/tfjs");
var utils = new utils_1.default();
/**
 * N-Dimension data structure. Stores multi-dimensional
 * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame.
 *
 * @param  Object
 *
 *  data:  1D or 2D Array, JSON, Tensor, Block of data.
 *
 *  index: Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 *
 *  columns: Array of column names. If not specified, column names are auto generated.
 *
 *  dtypes: Array of data types for each the column. If not specified, dtypes inferred.
 *
 *  config: General configuration object for NDframe
 *
 * @returns NDframe
 */
var NDframe = /** @class */ (function () {
    function NDframe(_a) {
        var data = _a.data, index = _a.index, columns = _a.columns, dtypes = _a.dtypes, config = _a.config, isSeries = _a.isSeries;
        this.$dataIncolumnFormat = [];
        this.$index = [];
        this.$columns = [];
        this.$dtypes = [];
        this.$isSeries = isSeries;
        if (config) {
            this.$config = new config_1.default(__assign(__assign({}, defaults_1.BASE_CONFIG), config));
        }
        else {
            this.$config = new config_1.default(defaults_1.BASE_CONFIG);
        }
        if (data instanceof tfjs_1.Tensor) {
            data = data.arraySync();
        }
        if (data === undefined || (Array.isArray(data) && data.length === 0)) {
            this.loadArrayIntoNdframe({ data: [], index: [], columns: [], dtypes: [] });
        }
        else if (utils.is1DArray(data)) {
            this.loadArrayIntoNdframe({ data: data, index: index, columns: columns, dtypes: dtypes });
        }
        else {
            if (Array.isArray(data) && utils.isObject(data[0])) {
                this.loadObjectIntoNdframe({ data: data, type: 1, index: index, columns: columns, dtypes: dtypes });
            }
            else if (utils.isObject(data)) {
                this.loadObjectIntoNdframe({ data: data, type: 2, index: index, columns: columns, dtypes: dtypes });
            }
            else if (Array.isArray((data)[0]) ||
                utils.isNumber((data)[0]) ||
                utils.isString((data)[0])) {
                this.loadArrayIntoNdframe({ data: data, index: index, columns: columns, dtypes: dtypes });
            }
            else {
                throw new Error("File format not supported!");
            }
        }
    }
    /**
     * Internal function to load array of data into NDFrame
     * @param data The array of data to load into NDFrame
     * @param index Array of numeric or string names for subsetting array.
     * @param columns Array of column names.
     * @param dtypes Array of data types for each the column.
    */
    NDframe.prototype.loadArrayIntoNdframe = function (_a) {
        var data = _a.data, index = _a.index, columns = _a.columns, dtypes = _a.dtypes;
        // this.$data = utils.replaceUndefinedWithNaN(data, this.$isSeries);
        this.$data = data;
        if (!this.$config.isLowMemoryMode) {
            //In NOT low memory mode, we transpose the array and save in column format.
            //This makes column data retrieval run in constant time
            this.$dataIncolumnFormat = utils.transposeArray(data);
        }
        this.$setIndex(index);
        this.$setDtypes(dtypes);
        this.$setColumnNames(columns);
    };
    /**
     * Internal function to format and load a Javascript object or object of arrays into NDFrame.
     * @param data Object or object of arrays.
     * @param type The type of the object. There are two recognized types:
     *
     * - type 1 object are in JSON format `[{a: 1, b: 2}, {a: 30, b: 20}]`.
     *
     * - type 2 object are of the form `{a: [1,2,3,4], b: [30,20, 30, 20}]}`
     * @param index Array of numeric or string names for subsetting array.
     * @param columns Array of column names.
     * @param dtypes Array of data types for each the column.
    */
    NDframe.prototype.loadObjectIntoNdframe = function (_a) {
        var data = _a.data, type = _a.type, index = _a.index, columns = _a.columns, dtypes = _a.dtypes;
        if (type === 1 && Array.isArray(data)) {
            var _data = (data).map(function (item) {
                return Object.values(item);
            });
            var _columnNames = void 0;
            if (columns) {
                _columnNames = columns;
            }
            else {
                _columnNames = Object.keys((data)[0]);
            }
            this.loadArrayIntoNdframe({ data: _data, index: index, columns: _columnNames, dtypes: dtypes });
        }
        else {
            var _b = utils.getRowAndColValues(data), _data = _b[0], _colNames = _b[1];
            var _columnNames = void 0;
            if (columns) {
                _columnNames = columns;
            }
            else {
                _columnNames = _colNames;
            }
            this.loadArrayIntoNdframe({ data: _data, index: index, columns: _columnNames, dtypes: dtypes });
        }
    };
    Object.defineProperty(NDframe.prototype, "tensor", {
        /**
         * Converts and returns the data in the NDframe as a Tensorflow.js Tensor.
        */
        get: function () {
            if (this.$isSeries) {
                return (0, tfjs_1.tensor1d)(this.$data);
            }
            else {
                return (0, tfjs_1.tensor2d)(this.$data);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NDframe.prototype, "dtypes", {
        /**
         * Returns the dtypes of the columns
        */
        get: function () {
            return this.$dtypes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Internal function to set the Dtypes of the NDFrame from an array. This function
     * performs the necessary checks.
    */
    NDframe.prototype.$setDtypes = function (dtypes) {
        if (this.$isSeries) {
            if (dtypes) {
                if (this.$data.length != 0 && dtypes.length != 1) {
                    errors_1.default.throwDtypesLengthError(this, dtypes);
                }
                if (!(defaults_1.DATA_TYPES.includes("" + dtypes[0]))) {
                    errors_1.default.throwDtypeNotSupportedError(dtypes[0]);
                }
                this.$dtypes = dtypes;
            }
            else {
                this.$dtypes = utils.inferDtype(this.$data);
            }
        }
        else {
            if (dtypes) {
                if (this.$data.length != 0 && dtypes.length != this.shape[1]) {
                    errors_1.default.throwDtypesLengthError(this, dtypes);
                }
                if (this.$data.length == 0 && dtypes.length == 0) {
                    this.$dtypes = dtypes;
                }
                else {
                    dtypes.forEach(function (dtype) {
                        if (!(defaults_1.DATA_TYPES.includes(dtype))) {
                            errors_1.default.throwDtypeNotSupportedError(dtype);
                        }
                    });
                    this.$dtypes = dtypes;
                }
            }
            else {
                this.$dtypes = utils.inferDtype(this.$data);
            }
        }
    };
    Object.defineProperty(NDframe.prototype, "ndim", {
        /**
         * Returns the dimension of the data. Series have a dimension of 1,
         * while DataFrames have a dimension of 2.
        */
        get: function () {
            if (this.$isSeries) {
                return 1;
            }
            else {
                return 2;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NDframe.prototype, "axis", {
        /**
         * Returns the axis labels of the NDFrame.
        */
        get: function () {
            return {
                index: this.$index,
                columns: this.$columns
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NDframe.prototype, "config", {
        /**
         * Returns the configuration object of the NDFrame.
        */
        get: function () {
            return this.$config;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Internal function to set the configuration of the ndframe
    */
    NDframe.prototype.$setConfig = function (config) {
        this.$config = config;
    };
    Object.defineProperty(NDframe.prototype, "index", {
        /**
         * Returns the indices of the NDFrame
        */
        get: function () {
            return this.$index;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Internal function to set the index of the NDFrame with the specified
     * array of indices. Performs all necessary checks to ensure that the
     * index is valid.
    */
    NDframe.prototype.$setIndex = function (index) {
        if (index) {
            if (this.$data.length != 0 && index.length != this.shape[0]) {
                errors_1.default.throwIndexLengthError(this, index);
            }
            if (Array.from(new Set(index)).length !== this.shape[0]) {
                errors_1.default.throwIndexDuplicateError();
            }
            this.$index = index;
        }
        else {
            this.$index = utils.range(0, this.shape[0] - 1); //generate index
        }
    };
    /**
     * Internal function to reset the index of the NDFrame using a range of indices.
    */
    NDframe.prototype.$resetIndex = function () {
        this.$index = utils.range(0, this.shape[0] - 1);
    };
    Object.defineProperty(NDframe.prototype, "columns", {
        /**
         * Returns the column names of the NDFrame
        */
        get: function () {
            return this.$columns;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Internal function to set the column names for the NDFrame. This function
     * performs a check to ensure that the column names are unique, and same length as the
     * number of columns in the data.
    */
    NDframe.prototype.$setColumnNames = function (columns) {
        if (this.$isSeries) {
            if (columns) {
                if (this.$data.length != 0 && columns.length != 1 && typeof columns != 'string') {
                    errors_1.default.throwColumnNamesLengthError(this, columns);
                }
                this.$columns = columns;
            }
            else {
                this.$columns = ["0"];
            }
        }
        else {
            if (columns) {
                if (this.$data.length != 0 && columns.length != this.shape[1]) {
                    errors_1.default.throwColumnNamesLengthError(this, columns);
                }
                if (Array.from(new Set(columns)).length !== this.shape[1]) {
                    errors_1.default.throwColumnDuplicateError();
                }
                this.$columns = columns;
            }
            else {
                this.$columns = (utils.range(0, this.shape[1] - 1)).map(function (val) { return "" + val; }); //generate columns
            }
        }
    };
    Object.defineProperty(NDframe.prototype, "shape", {
        /**
         * Returns the shape of the NDFrame. Shape is determined by [row lenght, column length]
        */
        get: function () {
            if (this.$data.length === 0)
                return [0, 0];
            if (this.$isSeries) {
                return [this.$data.length, 1];
            }
            else {
                var rowLen = (this.$data).length;
                var colLen = this.$data[0].length;
                return [rowLen, colLen];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NDframe.prototype, "values", {
        /**
         * Returns the underlying data in Array format.
        */
        get: function () {
            return this.$data;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates the internal $data property to the specified value
     * @param values An array of values to set
     * @param checkLength Whether to check the length of the new values and the existing row length
     * @param checkColumnLength Whether to check the length of the new values and the existing column length
     * */
    NDframe.prototype.$setValues = function (values, checkLength, checkColumnLength) {
        var _this = this;
        if (checkLength === void 0) { checkLength = true; }
        if (checkColumnLength === void 0) { checkColumnLength = true; }
        if (this.$isSeries) {
            if (checkLength && values.length != this.shape[0]) {
                errors_1.default.throwRowLengthError(this, values.length);
            }
            this.$data = values;
            this.$dtypes = utils.inferDtype(values); //Dtype may change depeneding on the value set
            if (!this.$config.isLowMemoryMode) {
                this.$dataIncolumnFormat = values;
            }
        }
        else {
            if (checkLength && values.length != this.shape[0]) {
                errors_1.default.throwRowLengthError(this, values.length);
            }
            if (checkColumnLength) {
                values.forEach(function (value) {
                    if (value.length != _this.shape[1]) {
                        errors_1.default.throwColumnLengthError(_this, values.length);
                    }
                });
            }
            this.$data = values;
            this.$dtypes = utils.inferDtype(values);
            if (!this.$config.isLowMemoryMode) {
                this.$dataIncolumnFormat = utils.transposeArray(values);
            }
        }
    };
    Object.defineProperty(NDframe.prototype, "getColumnData", {
        /**
         * Returns the underlying data in Array column format.
         * Similar to this.values, but in column format.
        */
        get: function () {
            if (this.config.isLowMemoryMode) {
                return utils.transposeArray(this.values);
            }
            else {
                return this.$dataIncolumnFormat;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NDframe.prototype, "size", {
        /**
         * Returns the size of the NDFrame object
         *
        */
        get: function () {
            return this.shape[0] * this.shape[1];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Converts a DataFrame or Series to CSV.
     * @param options Configuration object. Supports the following options:
     * - `fileName`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string.
     * - `header`: Boolean indicating whether to include a header row in the CSV file.
     * - `sep`: Character to be used as a separator in the CSV file.
     * - `download`: Boolean indicating whether to automatically save the CSV file.
     */
    NDframe.prototype.toCSV = function (options) {
        return (0, io_1.toCSV)(this, options);
    };
    /**
     * Converts a DataFrame or Series to JSON.
     * @param options Configuration object. Supported options:
     * - `download`: Boolean indicating whether to automatically save the CSV file.
     * - `fileName`: The file path to write the JSON to. If not specified, the JSON object is returned.
     * - `format`: The format of the JSON. Defaults to `'column'`. E.g for using `column` format:
     * ```
     * [{ "a": 1, "b": 2, "c": 3, "d": 4 },
     *  { "a": 5, "b": 6, "c": 7, "d": 8 }]
     * ```
     * and `row` format:
     * ```
     * { "a": [1, 5, 9],
     *  "b": [2, 6, 10]
     * }
     * ```
     */
    NDframe.prototype.toJSON = function (options) {
        return (0, io_1.toJSON)(this, options);
    };
    /**
     * Converts a DataFrame or Series to Excel Sheet.
     * @param options Configuration object. Supported options:
     * - `sheetName`: The sheet name to be written to. Defaults to `'Sheet1'`.
     * - `filePath`: The filePath to be written to. Defaults to `'./output.xlsx'`.
     */
    NDframe.prototype.toExcel = function (options) {
        return (0, io_1.toExcel)(this, options);
    };
    /**
     * Pretty prints a DataFrame or Series to the console
     */
    NDframe.prototype.print = function () {
        console.log(this + "");
    };
    return NDframe;
}());
exports.default = NDframe;

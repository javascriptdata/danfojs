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
var defaults_1 = require("./defaults");
var config_1 = __importDefault(require("./config"));
var __1 = require("../");
var __2 = require("../");
var errors_1 = __importDefault(require("../shared/errors"));
var config = new config_1.default(defaults_1.BASE_CONFIG);
/**
 * General Utility class
 */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * Removes an element from a 1D array
     *
     * ```js
     *
     * ```
     * @param arr The array to filter.
     * @param index The index to filter by.
     */
    Utils.prototype.removeElementFromArray = function (arr, index) {
        var newArr = arr.filter(function (_, i) { return i != index; });
        return newArr;
    };
    /**
     * Check if value is a string.
     * @param value The value to check.
     * @returns
     */
    Utils.prototype.isString = function (value) {
        return typeof value === "string";
    };
    /**
     * Checks if value is a number.
     * @param value The value to check.
     * @returns
     */
    Utils.prototype.isNumber = function (value) {
        return typeof value === "number" && isFinite(value);
    };
    /**
     * Checks if value is an object.
     * @param value The value to check.
     * @returns
     */
    Utils.prototype.isObject = function (value) {
        return value && typeof value === "object" && value.constructor && value.constructor.name === "Object";
    };
    /**
     * Checks if a value is null
     * @param value The value to check.
     * @returns
     */
    Utils.prototype.isNull = function (value) {
        return value === null;
    };
    /**
     * Checks if a value is undefined
     * @param value The value to check.
     * @returns
     */
    Utils.prototype.isUndefined = function (value) {
        return typeof value === "undefined";
    };
    /**
     * Checks if a value is empty. Empty means it's either null, undefined or NaN
     * @param value The value to check.
     * @returns
     */
    Utils.prototype.isEmpty = function (value) {
        return value === undefined || value === null || (isNaN(value) && typeof value !== "string");
    };
    /**
     * Checks if a value is a date object
     * @param value A date object
     * @returns boolean
     */
    Utils.prototype.isDate = function (value) {
        return value instanceof Date;
    };
    /**
     * Generates an array of integers between specified range
     * @param start The starting number.
     * @param end The ending number.
     */
    Utils.prototype.range = function (start, end) {
        if (end < start) {
            throw new Error("ParamError: end must be greater than start");
        }
        if (start === end) {
            return [start];
        }
        var arr = [];
        for (var i = start; i <= end; i++) {
            arr.push(i);
        }
        return arr;
    };
    /**
     * Checks if object has the specified key
     * @param obj The object to check.
     * @param key The key to find.
     */
    Utils.prototype.keyInObject = function (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };
    /**
     * Transposes an array of array
     * @param obj The object to check.
     * @param key The key to find.
     */
    Utils.prototype.transposeArray = function (arr) {
        if (arr.length === 0)
            return arr;
        var rowLen = arr.length;
        if (Array.isArray(arr[0])) {
            var colLen = arr[0].length;
            var newArr = [];
            for (var i = 0; i <= colLen - 1; i++) {
                var temp = [];
                for (var j = 0; j < rowLen; j++) {
                    var _elem = arr[j][i];
                    temp.push(_elem);
                }
                newArr.push(temp);
            }
            return newArr;
        }
        else {
            return arr;
        }
    };
    /**
     * Retrieve row array and column names from an object of the form {a: [1,2,3,4], b: [30,20, 30, 20]}
     * @param obj The object to retrieve rows and column names from.
     */
    Utils.prototype.getRowAndColValues = function (obj) {
        var colNames = Object.keys(obj);
        var colData = Object.values(obj);
        var firstColLen = colData[0].length;
        colData.forEach(function (cdata) {
            if (cdata.length != firstColLen) {
                throw Error("Length Error: Length of columns must be the same!");
            }
        });
        var rowsArr = this.transposeArray(colData);
        return [rowsArr, colNames];
    };
    /**
     * Converts a 2D array of array to 1D array for Series Class
     * @param arr The array to convert.
     */
    Utils.prototype.convert2DArrayToSeriesArray = function (arr) {
        var _this = this;
        var newArr = arr.map(function (val) {
            if (_this.isObject(val)) {
                return JSON.stringify(val);
            }
            else {
                return "" + val;
            }
        });
        return newArr;
    };
    /**
     * Replaces all missing values with NaN. Missing values are undefined, Null and Infinity
     * @param arr The array
     * @param isSeries Whether the arr is a series or not
     */
    Utils.prototype.replaceUndefinedWithNaN = function (arr, isSeries) {
        if (arr.length === 0)
            return arr;
        if (isSeries && Array.isArray(arr)) {
            var newArr = arr.map(function (ele) {
                if (typeof ele === "undefined") {
                    return NaN;
                }
                if (typeof ele === "number" && (isNaN(ele) || ele == Infinity)) {
                    return NaN;
                }
                if (ele == null) {
                    return NaN;
                }
                return ele;
            });
            return newArr;
        }
        else {
            var newArr = [];
            if (Array.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    var innerArr = arr[i];
                    var temp = innerArr.map(function (ele) {
                        if (typeof ele === "undefined") {
                            return NaN;
                        }
                        if (typeof ele === "number" && (isNaN(ele) || ele == Infinity)) {
                            return NaN;
                        }
                        if (ele == null) {
                            return NaN;
                        }
                        return ele;
                    });
                    newArr.push(temp);
                }
            }
            return newArr;
        }
    };
    /**
     * Infer data type from an array or array of arrays
     * @param arr An array or array of arrays
    */
    Utils.prototype.inferDtype = function (arr) {
        var self = this;
        if (this.is1DArray(arr)) {
            return [this.$typeChecker(arr)];
        }
        else {
            var arrSlice = this.transposeArray(arr.slice(0, config.getDtypeTestLim));
            var dtypes = arrSlice.map(function (innerArr) {
                return self.$typeChecker(innerArr);
            });
            return dtypes;
        }
    };
    /**
     * Private type checker used by inferDtype function
     * @param arr The array
     */
    Utils.prototype.$typeChecker = function (arr) {
        var dtypes;
        var lim;
        var intTracker = [];
        var floatTracker = [];
        var stringTracker = [];
        var boolTracker = [];
        var dateTracker = [];
        if (arr.length < config.getDtypeTestLim) {
            lim = arr.length;
        }
        else {
            lim = config.getDtypeTestLim;
        }
        var arrSlice = arr.slice(0, lim);
        for (var i = 0; i < lim; i++) {
            var ele = arrSlice[i];
            if (typeof ele == "boolean") {
                floatTracker.push(false);
                intTracker.push(false);
                stringTracker.push(false);
                boolTracker.push(true);
                dateTracker.push(false);
            }
            else if (this.isEmpty(ele)) {
                floatTracker.push(true);
                intTracker.push(false);
                stringTracker.push(false);
                boolTracker.push(false);
                dateTracker.push(false);
            }
            else if (this.isDate(ele)) {
                floatTracker.push(false);
                intTracker.push(false);
                stringTracker.push(false);
                boolTracker.push(false);
                dateTracker.push(true);
            }
            else if (!isNaN(Number(ele))) {
                if (ele.toString().includes(".")) {
                    floatTracker.push(true);
                    intTracker.push(false);
                    stringTracker.push(false);
                    boolTracker.push(false);
                    dateTracker.push(false);
                }
                else {
                    floatTracker.push(false);
                    intTracker.push(true);
                    stringTracker.push(false);
                    boolTracker.push(false);
                    dateTracker.push(false);
                }
            }
            else {
                floatTracker.push(false);
                intTracker.push(false);
                stringTracker.push(true);
                boolTracker.push(false);
                dateTracker.push(false);
            }
        }
        var even = function (ele) { return ele == true; };
        if (stringTracker.some(even)) {
            dtypes = "string";
        }
        else if (floatTracker.some(even)) {
            dtypes = "float32";
        }
        else if (intTracker.some(even)) {
            dtypes = "int32";
        }
        else if (boolTracker.some(even)) {
            dtypes = "boolean";
        }
        else if (dateTracker.some(even)) {
            dtypes = "datetime";
        }
        else {
            dtypes = "undefined";
        }
        return dtypes;
    };
    /**
     * Returns the unique values in an 1D array
     * @param arr The array
    */
    Utils.prototype.unique = function (arr) {
        var uniqueArr = new Set(arr);
        return Array.from(uniqueArr);
    };
    /**
     * Checks if array is 1D
     * @param arr The array
    */
    Utils.prototype.is1DArray = function (arr) {
        if (typeof arr[0] == "number" ||
            typeof arr[0] == "string" ||
            typeof arr[0] == "boolean" ||
            arr[0] === null) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Converts an array to an object using array index as object keys
     * @param arr The array
    */
    Utils.prototype.convertArrayToObject = function (arr) {
        var arrObj = {};
        for (var i = 0; i < arr.length; i++) {
            arrObj[i] = arr[i];
        }
        return arrObj;
    };
    /**
     * Count the NaN and non-NaN values present in an array
     * @param  arr Array object
     * @param val whether to return the value count instead of the null count
     * @param isSeries Whether the array is of type series or not
     */
    Utils.prototype.countNaNs = function (arr, returnVal, isSeries) {
        if (returnVal === void 0) { returnVal = true; }
        if (isSeries) {
            var nullCount = 0;
            var valCount = 0;
            for (var i = 0; i < arr.length; i++) {
                var ele = arr[i];
                if (Number.isNaN(ele)) {
                    nullCount = nullCount + 1;
                }
                else {
                    valCount = valCount + 1;
                }
            }
            if (returnVal) {
                return valCount;
            }
            else {
                return nullCount;
            }
        }
        else {
            var resultArr = [];
            for (var i = 0; i < arr.length; i++) {
                var innerArr = arr[i];
                var nullCount = 0;
                var valCount = 0;
                for (var i_1 = 0; i_1 < innerArr.length; i_1++) {
                    var ele = innerArr[i_1];
                    if (Number.isNaN(ele)) {
                        nullCount = nullCount + 1;
                    }
                    else {
                        valCount = valCount + 1;
                    }
                }
                if (returnVal) {
                    resultArr.push(valCount);
                }
                else {
                    resultArr.push(nullCount);
                }
            }
            return resultArr;
        }
    };
    /**
     * Round elements of an array or array of arrays to specified dp
     * @param arr The Array to round
     * @param dp The number of dp to round to
     * @param isSeries Whether the array is of type Series or not
     */
    Utils.prototype.round = function (arr, dp, isSeries) {
        if (dp === void 0) { dp = 1; }
        if (dp < 0) {
            dp = 1;
        }
        if (isSeries) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                var ele = arr[i];
                if (typeof ele == "number" && !isNaN(ele) && ele !== undefined && ele !== null) {
                    newArr.push(Number((ele).toFixed(dp)));
                }
                else {
                    newArr.push(ele);
                }
            }
            return newArr;
        }
        else {
            var resultArr = [];
            for (var i = 0; i < arr.length; i++) {
                var innerVal = arr[i];
                var newArr = [];
                if (Array.isArray(innerVal)) {
                    for (var i_2 = 0; i_2 < innerVal.length; i_2++) {
                        var ele = innerVal[i_2];
                        if (typeof ele == "number" && !isNaN(ele) && ele !== undefined && ele !== null) {
                            newArr.push(Number((ele).toFixed(dp)));
                        }
                        else {
                            newArr.push(ele);
                        }
                    }
                    resultArr.push(newArr);
                }
                else {
                    if (typeof innerVal == "number" && !isNaN(innerVal) && innerVal !== undefined && innerVal !== null) {
                        newArr.push(Number((innerVal).toFixed(dp)));
                    }
                    else {
                        newArr.push(innerVal);
                    }
                }
            }
            return resultArr;
        }
    };
    /**
     * Checks if a func is a function
     * @param func
     */
    Utils.prototype.isFunction = function (func) {
        return typeof func == "function";
    };
    /**
     * Generates n random numbers between start and end.
     * @param start
     * @param end
     * @param size
     */
    Utils.prototype.randNumberGenerator = function (start, end, size) {
        var genNum = [];
        function randi(a, b) {
            return Math.floor(Math.random() * (b - a) + a);
        }
        function recursive(val, arr) {
            if (!arr.includes(val)) {
                return val;
            }
            val = randi(start, end);
            recursive(val, arr);
        }
        for (var i = 0; i < size; i++) {
            var genVal = randi(start, end);
            var recursiveVal = recursive(genVal, genNum);
            genNum.push(recursiveVal);
        }
        return genNum;
    };
    /**
     * Throws error when a required parameter is missing.
     * @param paramsObject The parameters passed to the function
     * @param paramsNeeded The required parameters in the function
     */
    Utils.prototype.throwErrorOnWrongParams = function (paramsObject, paramsNeeded) {
        var keys = Object.keys(paramsObject);
        var bool = [];
        for (var i = 0; i < keys.length; i++) {
            if (paramsNeeded.includes(keys[i])) {
                bool.push(true);
            }
            else {
                bool.push(false);
            }
        }
        var truthy = function (element) { return element == false; };
        if (bool.some(truthy)) {
            throw Error("Params Error: Required parameter not found. Your params must include the following [" + paramsNeeded + "]");
        }
    };
    /**
     * Maps integer values (0, 1) to boolean (false, true)
     * @param arr The array of integers
     * @param dim The dimension of the array
     */
    Utils.prototype.mapIntegersToBooleans = function (arr, dim) {
        if (dim == 2) {
            var newArr_1 = [];
            arr.map(function (innerArr) {
                var temp = [];
                innerArr.map(function (val) { return temp.push(val == 1); });
                newArr_1.push(temp);
            });
            return newArr_1;
        }
        else {
            var newArr_2 = [];
            arr.map(function (val) { return newArr_2.push(val == 1); });
            return newArr_2;
        }
    };
    /**
     * Maps boolean values (false, true) to integer equivalent (0, 1)
     * @param arr The array of booleans
     * @param dim The dimension of the array
     */
    Utils.prototype.mapBooleansToIntegers = function (arr, dim) {
        if (dim == 2) {
            var newArr_3 = [];
            arr.map(function (innerArr) {
                var temp = [];
                innerArr.map(function (val) { return temp.push(val ? 1 : 0); });
                newArr_3.push(temp);
            });
            return newArr_3;
        }
        else {
            var newArr_4 = [];
            arr.map(function (val) { return newArr_4.push(val ? 1 : 0); });
            return newArr_4;
        }
    };
    /**
     * Generates an array of dim (row x column) with inner values set to zero
     * @param row
     * @param column
     */
    Utils.prototype.zeros = function (row, column) {
        var zeroData = [];
        for (var i = 0; i < row; i++) {
            var colData = Array(column);
            for (var j = 0; j < column; j++) {
                colData[j] = 0;
            }
            zeroData.push(colData);
        }
        return zeroData;
    };
    /**
     * Shuffles and returns a random slice of an array
     * @param num
     * @param array
     */
    Utils.prototype.shuffle = function (array, num) {
        var i = array.length;
        var j = 0;
        var temp;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array.slice(0, num);
    };
    /**
     * Sorts an array in specified order
     * @param arr
     * @param ascending
     * @returns
     */
    Utils.prototype.sort = function (arr, ascending) {
        if (ascending === void 0) { ascending = true; }
        var sorted = __spreadArray([], arr, true);
        return sorted.sort(function (a, b) {
            if (ascending) {
                if (typeof a === "string" && typeof b === "string") {
                    return a.charCodeAt(0) - b.charCodeAt(0);
                }
                else {
                    return a - b;
                }
            }
            else {
                if (typeof a === "string" && typeof b === "string") {
                    return b.charCodeAt(0) - a.charCodeAt(0);
                }
                else {
                    return b - a;
                }
            }
        });
    };
    /**
     * Checks if current environment is Browser
     */
    Utils.prototype.isBrowserEnv = function () {
        var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
        return isBrowser();
    };
    /**
     * Checks if current environment is Node
     */
    Utils.prototype.isNodeEnv = function () {
        var isNode = new Function("try {return this===global;}catch(e){return false;}");
        return isNode();
    };
    /**
     * Remove NaN values from 1D array
     * @param arr
     */
    Utils.prototype.removeMissingValuesFromArray = function (arr) {
        var _this = this;
        var values = arr.filter(function (val) {
            return !(_this.isEmpty(val));
        });
        return values;
    };
    /**
     * Replace NaN with null before tensor operations
     * @param arr
     */
    Utils.prototype.replaceNanWithNull = function (arr) {
        var values = arr.map(function (val) {
            if (isNaN(val)) {
                return null;
            }
            else {
                return val;
            }
        });
        return values;
    };
    /**
     * Get duplicate values in a array
     * @param arr
     */
    Utils.prototype.getDuplicate = function (arr) {
        var tempObj = {};
        var resultObj = {};
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i];
            if (this.keyInObject(tempObj, val)) {
                tempObj[val]["count"] += 1;
                tempObj[val]["index"].push(i);
            }
            else {
                tempObj[val] = {};
                tempObj[val]["count"] = 1;
                tempObj[val]["index"] = [i];
            }
        }
        for (var key in tempObj) {
            if (tempObj[key]["count"] >= 2) {
                resultObj[key] = {};
                resultObj[key]["count"] = tempObj[key]["count"];
                resultObj[key]["index"] = tempObj[key]["index"];
            }
        }
        return resultObj;
    };
    /**
     * Returns the index of a sorted array
     * @param arr1 The first array
     * @param arr2 The second array
     * @param dtype The data type of the arrays
     *
     * @returns sorted index
     */
    Utils.prototype.sortArrayByIndex = function (arr1, arr2, dtype) {
        var sortedIdx = arr1.map(function (item, index) {
            return [arr2[index], item];
        });
        if (dtype == "string") {
            sortedIdx.sort();
        }
        else {
            sortedIdx.sort(function (_a, _b) {
                var arg1 = _a[0];
                var arg2 = _b[0];
                return arg2 - arg1;
            });
        }
        return sortedIdx.map(function (_a) {
            var item = _a[1];
            return item;
        });
    };
    /**
     * Returns a new series with properties of the old series
     *
     * @param series The series to copy
    */
    Utils.prototype.createNdframeFromNewDataWithOldProps = function (_a) {
        var ndFrame = _a.ndFrame, newData = _a.newData, isSeries = _a.isSeries;
        if (isSeries) {
            return new __1.Series(newData, {
                index: __spreadArray([], ndFrame.index, true),
                columns: __spreadArray([], ndFrame.columns, true),
                dtypes: __spreadArray([], ndFrame.dtypes, true),
                config: __assign({}, ndFrame.config)
            });
        }
        else {
            return new __2.DataFrame(newData, {
                index: __spreadArray([], ndFrame.index, true),
                columns: __spreadArray([], ndFrame.columns, true),
                dtypes: __spreadArray([], ndFrame.dtypes, true),
                config: __assign({}, ndFrame.config)
            });
        }
    };
    /**
    * Checks if two series are compatible for a mathematical operation
    * @param object
    *
    *   firstSeries ==>  First Series object
    *
    *   secondSeries ==> Second Series object to comapre with
    *
    *   operation ==> The mathematical operation
    */
    Utils.prototype.checkSeriesOpCompactibility = function (_a) {
        var firstSeries = _a.firstSeries, secondSeries = _a.secondSeries, operation = _a.operation;
        if (firstSeries.shape[0] != secondSeries.shape[0]) {
            errors_1.default.throwSeriesMathOpLengthError(firstSeries, secondSeries);
        }
        if (firstSeries.dtypes[0] == 'string' || secondSeries.dtypes[0] == 'string') {
            errors_1.default.throwStringDtypeOperationError(operation);
        }
    };
    /**
    * Custom sort for an array of index and values
    * @param arr The array of objects to sort
    * @param ascending Whether to sort in ascending order or not
    */
    Utils.prototype.sortObj = function (arr, ascending) {
        var sortedValues = arr.sort(function (obj1, obj2) {
            var a = obj2.value;
            var b = obj1.value;
            if (!ascending) {
                if (typeof a === "string" && typeof b === "string") {
                    a = a.toUpperCase();
                    b = b.toUpperCase();
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    return Number(a) - Number(b);
                }
            }
            else {
                if (typeof a === "string" && typeof b === "string") {
                    a = a.toUpperCase();
                    b = b.toUpperCase();
                    if (a > b) {
                        return -1;
                    }
                    if (a < b) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    return Number(b) - Number(a);
                    ;
                }
            }
        });
        return sortedValues;
    };
    return Utils;
}());
exports.default = Utils;

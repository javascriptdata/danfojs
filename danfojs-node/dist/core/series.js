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
var mathjs_1 = require("mathjs");
var math_ops_1 = require("./math.ops");
var defaults_1 = require("../shared/defaults");
var errors_1 = __importDefault(require("../shared/errors"));
var indexing_1 = require("./indexing");
var utils_1 = __importDefault(require("../shared/utils"));
var generic_1 = __importDefault(require("./generic"));
var table_1 = require("table");
var strings_1 = __importDefault(require("./strings"));
var datetime_1 = __importDefault(require("./datetime"));
var dummy_encoder_1 = __importDefault(require("../transformers/encoders/dummy.encoder"));
var tfjs_node_1 = require("@tensorflow/tfjs-node");
var utils = new utils_1.default();
/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.
 */
var Series = /** @class */ (function (_super) {
    __extends(Series, _super);
    function Series(data, options) {
        if (data === void 0) { data = []; }
        if (options === void 0) { options = {}; }
        var _this = this;
        var index = options.index, columns = options.columns, dtypes = options.dtypes, config = options.config;
        if (Array.isArray(data[0]) || utils.isObject(data[0])) {
            data = utils.convert2DArrayToSeriesArray(data);
            _this = _super.call(this, {
                data: data,
                index: index,
                columns: columns,
                dtypes: dtypes,
                config: config,
                isSeries: true
            }) || this;
        }
        else {
            _this = _super.call(this, {
                data: data,
                index: index,
                columns: columns,
                dtypes: dtypes,
                config: config,
                isSeries: true
            }) || this;
        }
        return _this;
    }
    /**
    * Purely integer-location based indexing for selection by position.
    * ``.iloc`` is primarily integer position based (from ``0`` to
    * ``length-1`` of the axis), but may also be used with a boolean array.
    *
    * @param rows Array of row indexes
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
    */
    Series.prototype.iloc = function (rows) {
        return (0, indexing_1._iloc)({ ndFrame: this, rows: rows });
    };
    /**
     * Access a group of rows by label(s) or a boolean array.
     * ``loc`` is primarily label based, but may also be used with a boolean array.
     *
     * @param rows Array of row indexes
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
    */
    Series.prototype.loc = function (rows) {
        return (0, indexing_1._loc)({ ndFrame: this, rows: rows });
    };
    /**
      * Returns the first n values in a Series
      * @param rows The number of rows to return
    */
    Series.prototype.head = function (rows) {
        if (rows === void 0) { rows = 5; }
        return this.iloc(["0:" + rows]);
    };
    /**
      * Returns the last n values in a Series
      * @param rows The number of rows to return
    */
    Series.prototype.tail = function (rows) {
        if (rows === void 0) { rows = 5; }
        var startIdx = this.shape[0] - rows;
        return this.iloc([startIdx + ":"]);
    };
    /**
     * Returns specified number of random rows in a Series
     * @param num The number of rows to return
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
    */
    Series.prototype.sample = function (num, options) {
        if (num === void 0) { num = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var seed, shuffledIndex, sf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        seed = __assign({ seed: 1 }, options).seed;
                        if (num > this.shape[0]) {
                            throw new Error("Sample size n cannot be bigger than size of dataset");
                        }
                        if (num < -1 || num == 0) {
                            throw new Error("Sample size cannot be less than -1 or be equal to 0");
                        }
                        num = num === -1 ? this.shape[0] : num;
                        return [4 /*yield*/, tfjs_node_1.data.array(this.index).shuffle(num, "" + seed).take(num).toArray()];
                    case 1:
                        shuffledIndex = _a.sent();
                        sf = this.iloc(shuffledIndex);
                        return [2 /*return*/, sf];
                }
            });
        });
    };
    /**
      * Return Addition of series and other, element-wise (binary operator add).
      * Equivalent to series + other
      * @param other Series, Array of same length or scalar number to add
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    Series.prototype.add = function (other, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("add");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "add" });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData: newData, isSeries: true });
        }
    };
    /**
      * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
      * Equivalent to series - other
      * @param other Number to subtract
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    Series.prototype.sub = function (other, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("sub");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "sub" });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData: newData, isSeries: true });
        }
    };
    /**
      * Return Multiplication of series and other, element-wise (binary operator mul).
      * Equivalent to series * other
      * @param other Number to multiply with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.mul = function (other, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("mul");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "mul" });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData: newData, isSeries: true });
        }
    };
    /**
      * Return division of series and other, element-wise (binary operator div).
      * Equivalent to series / other
      * @param other Series or number to divide with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    Series.prototype.div = function (other, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("div");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "div" });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData: newData, isSeries: true });
        }
    };
    /**
      * Return Exponential power of series and other, element-wise (binary operator pow).
      * Equivalent to series ** other
      * @param other Number to multiply with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    Series.prototype.pow = function (other, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("pow");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "pow" });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData: newData, isSeries: true });
        }
    };
    /**
      * Return Modulo of series and other, element-wise (binary operator mod).
      * Equivalent to series % other
      * @param other Number to modulo with
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.mod = function (other, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("mod");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "mod" });
        if (inplace) {
            this.$setValues(newData);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData: newData, isSeries: true });
        }
    };
    /**
     * Checks if the array value passed has a compatible dtype, removes NaN values, and if
     * boolean values are present, converts them to integer values.
     * */
    Series.prototype.$checkAndCleanValues = function (values, operation) {
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError(operation);
        values = utils.removeMissingValuesFromArray(values);
        if (this.dtypes[0] == "boolean") {
            values = utils.mapBooleansToIntegers(values, 1);
        }
        return values;
    };
    /**
     * Returns the mean of elements in Series
    */
    Series.prototype.mean = function () {
        var values = this.$checkAndCleanValues(this.values, "mean");
        return (values.reduce(function (a, b) { return a + b; }) / values.length);
    };
    /**
      * Returns the median of elements in Series
    */
    Series.prototype.median = function () {
        var values = this.$checkAndCleanValues(this.values, "median");
        return (0, mathjs_1.median)(values);
    };
    /**
      * Returns the modal value of elements in Series
    */
    Series.prototype.mode = function () {
        var values = this.$checkAndCleanValues(this.values, "mode");
        return (0, mathjs_1.mode)(values);
    };
    /**
      * Returns the minimum value in a Series
    */
    Series.prototype.min = function () {
        var values = this.$checkAndCleanValues(this.values, "min");
        var smallestValue = values[0];
        for (var i = 0; i < values.length; i++) {
            smallestValue = smallestValue < values[i] ? smallestValue : values[i];
        }
        return smallestValue;
    };
    /**
      * Returns the maximum value in a Series
      * @returns {Number}
    */
    Series.prototype.max = function () {
        var values = this.$checkAndCleanValues(this.values, "max");
        var biggestValue = values[0];
        for (var i = 0; i < values.length; i++) {
            biggestValue = biggestValue > values[i] ? biggestValue : values[i];
        }
        return biggestValue;
    };
    /**
      * Return the sum of the values in a series.
    */
    Series.prototype.sum = function () {
        var values = this.$checkAndCleanValues(this.values, "sum");
        return values.reduce(function (sum, value) { return sum + value; }, 0);
    };
    /**
       * Return number of non-null elements in a Series
    */
    Series.prototype.count = function () {
        var values = utils.removeMissingValuesFromArray(this.values);
        return values.length;
    };
    /**
      * Return maximum of series and other.
      * @param other Series or number to check against
    */
    Series.prototype.maximum = function (other) {
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("maximum");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "maximum" });
        return new Series(newData, {
            columns: this.columns,
            index: this.index
        });
    };
    /**
      * Return minimum of series and other.
      * @param other Series, Numbers to check against
    */
    Series.prototype.minimum = function (other) {
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("maximum");
        var newData = (0, math_ops_1._genericMathOp)({ ndFrame: this, other: other, operation: "minimum" });
        return new Series(newData, {
            columns: this.columns,
            index: this.index
        });
    };
    /**
     * Round each value in a Series to the specified number of decimals.
     * @param dp Number of Decimal places to round to
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.round = function (dp, options) {
        if (dp === void 0) { dp = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newValues = utils.round(this.values, dp, true);
        if (inplace) {
            this.$setValues(newValues);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({
                ndFrame: this,
                newData: newValues,
                isSeries: true
            });
        }
    };
    /**
      * Return sample standard deviation of elements in Series
    */
    Series.prototype.std = function () {
        var values = this.$checkAndCleanValues(this.values, "max");
        return (0, mathjs_1.std)(values);
    };
    /**
      *  Return unbiased variance of elements in a Series.
    */
    Series.prototype.var = function () {
        var values = this.$checkAndCleanValues(this.values, "max");
        return (0, mathjs_1.variance)(values);
    };
    /**
     * Return a boolean same-sized object indicating where elements are NaN.
     * NaN and undefined values gets mapped to true, and everything else gets mapped to false.
    */
    Series.prototype.isNa = function () {
        var newData = this.values.map(function (value) {
            if (isNaN(value) && typeof value != "string") {
                return true;
            }
            else {
                return false;
            }
        });
        var sf = new Series(newData, {
            index: this.index,
            dtypes: ["boolean"],
            config: this.config
        });
        return sf;
    };
    /**
     * Replace all NaN with a specified value
     * @param value The value to replace NaN with
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.fillNa = function (value, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!value && typeof value !== 'boolean') {
            throw Error('Value Error: Must specify value to replace with');
        }
        var newValues = [];
        this.values.forEach(function (val) {
            if (isNaN(val) && typeof val != "string") {
                newValues.push(value);
            }
            else {
                newValues.push(val);
            }
        });
        if (inplace) {
            this.$setValues(newValues);
        }
        else {
            return utils.createNdframeFromNewDataWithOldProps({
                ndFrame: this,
                newData: newValues,
                isSeries: true
            });
        }
    };
    /**
      * Sort a Series in ascending or descending order by some criterion.
      * @param options Method options
      * @param ascending Whether to return sorted values in ascending order or not. Defaults to true
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.sortValues = function (ascending, options) {
        if (ascending === void 0) { ascending = true; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var sortedValues = [];
        var rangeIdx = utils.range(0, this.index.length - 1);
        var sortedIdx = utils.sortArrayByIndex(rangeIdx, this.values, this.dtypes[0]);
        for (var _i = 0, sortedIdx_1 = sortedIdx; _i < sortedIdx_1.length; _i++) {
            var indx = sortedIdx_1[_i];
            sortedValues.push(this.values[indx]);
        }
        if (ascending) {
            sortedValues = sortedValues.reverse();
            sortedIdx = sortedIdx.reverse();
        }
        if (inplace) {
            this.$setValues(sortedValues);
            this.$setIndex(sortedIdx);
        }
        else {
            var sf = new Series(sortedValues, {
                index: sortedIdx,
                dtypes: this.dtypes,
                config: this.config
            });
            return sf;
        }
    };
    /**
      * Makes a deep copy of a Series
    */
    Series.prototype.copy = function () {
        var sf = new Series(__spreadArray([], this.values, true), {
            columns: __spreadArray([], this.columns, true),
            index: __spreadArray([], this.index, true),
            dtypes: __spreadArray([], this.dtypes, true),
            config: __assign({}, this.config)
        });
        return sf;
    };
    /**
      * Generate descriptive statistics.
      * Descriptive statistics include those that summarize the central tendency,
      * dispersion and shape of a dataset’s distribution, excluding NaN values.
    */
    Series.prototype.describe = function () {
        if (this.dtypes[0] == "string") {
            throw new Error("DType Error: Cannot generate descriptive statistics for Series with string dtype");
        }
        else {
            var index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'];
            var count = this.count();
            var mean = this.mean();
            var std_1 = this.std();
            var min = this.min();
            var median_1 = this.median();
            var max = this.max();
            var variance_1 = this.var();
            var data = [count, mean, std_1, min, median_1, max, variance_1];
            var sf = new Series(data, { index: index });
            return sf;
        }
    };
    /**
      * Returns Series with the index reset.
      * This is useful when index is meaningless and needs to be reset to the default before another operation.
      */
    Series.prototype.resetIndex = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (inplace) {
            this.$resetIndex();
        }
        else {
            var sf = this.copy();
            sf.$resetIndex();
            return sf;
        }
    };
    /**
      * Set the Series index (row labels) using an array of the same length.
      * @param index Array of new index values,
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.setIndex = function (index, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!index) {
            throw Error('Param Error: Must specify index array');
        }
        if (inplace) {
            this.$setIndex(index);
        }
        else {
            var sf = this.copy();
            sf.$setIndex(index);
            return sf;
        }
    };
    /**
       * map all the element in a column to a variable or function
       * @param callable callable can either be a funtion or an object
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.map = function (callable, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var isCallable = utils.isFunction(callable);
        var data = this.values.map(function (val) {
            if (isCallable) {
                return callable(val);
            }
            else if (utils.isObject(callable)) {
                if (val in callable) {
                    return callable[val];
                }
                else {
                    return NaN;
                }
            }
            else {
                throw new Error("Param Error: callable must either be a function or an object");
            }
        });
        if (inplace) {
            this.$setValues(data);
        }
        else {
            var sf = this.copy();
            sf.$setValues(data);
            return sf;
        }
    };
    /**
       * Applies a function to each element of a Series
       * @param callable Function to apply to each element of the series
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.apply = function (callable, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var isCallable = utils.isFunction(callable);
        if (!isCallable) {
            throw new Error("Param Error: callable must be a function");
        }
        var data = this.values.map(function (val) {
            return callable(val);
        });
        if (inplace) {
            this.$setValues(data);
        }
        else {
            var sf = this.copy();
            sf.$setValues(data);
            return sf;
        }
    };
    /**
     * Returns a Series with only the unique value(s) in the original Series
    */
    Series.prototype.unique = function () {
        var newValues = new Set(this.values);
        var series = new Series(Array.from(newValues));
        return series;
    };
    /**
       * Return the number of unique elements in a Series
    */
    Series.prototype.nUnique = function () {
        return (new Set(this.values)).size;
    };
    /**
     * Returns unique values and their counts in a Series
    */
    Series.prototype.valueCounts = function () {
        var sData = this.values;
        var dataDict = {};
        for (var i = 0; i < sData.length; i++) {
            var val = sData[i];
            if ("" + val in dataDict) {
                dataDict["" + val] = dataDict["" + val] + 1;
            }
            else {
                dataDict["" + val] = 1;
            }
        }
        var index = Object.keys(dataDict).map(function (x) {
            return parseInt(x) ? parseInt(x) : x;
        });
        var data = Object.values(dataDict);
        var series = new Series(data, { index: index });
        return series;
    };
    /**
      * Returns the absolute values in Series
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.abs = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError("abs");
        var newValues;
        newValues = this.values.map(function (val) { return Math.abs(val); });
        if (inplace) {
            this.$setValues(newValues);
        }
        else {
            var sf = this.copy();
            sf.$setValues(newValues);
            return sf;
        }
    };
    /**
      * Returns the cumulative sum over a Series
    */
    Series.prototype.cumSum = function (options) {
        var ops = __assign({ inplace: false }, options);
        return this.cumOps("sum", ops);
    };
    /**
       * Returns cumulative minimum over a Series
    */
    Series.prototype.cumMin = function (options) {
        var ops = __assign({ inplace: false }, options);
        return this.cumOps("min", ops);
    };
    /**
       * Returns cumulative maximum over a Series
    */
    Series.prototype.cumMax = function (options) {
        var ops = __assign({ inplace: false }, options);
        return this.cumOps("max", ops);
    };
    /**
       * Returns cumulative product over a Series
    */
    Series.prototype.cumProd = function (options) {
        var ops = __assign({ inplace: false }, options);
        return this.cumOps("prod", ops);
    };
    /**
     * perform cumulative operation on series data
    */
    Series.prototype.cumOps = function (ops, options) {
        if (this.dtypes[0] == "string")
            errors_1.default.throwStringDtypeOperationError(ops);
        var inplace = options.inplace;
        var sData = this.values;
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
        if (inplace) {
            this.$setValues(data);
        }
        else {
            var sf = this.copy();
            sf.$setValues(data);
            return sf;
        }
    };
    /**
       * Returns less than of series and other. Supports element wise operations
       * @param other Series or number to compare against
    */
    Series.prototype.lt = function (other) {
        return this.boolOps(other, "lt");
    };
    /**
       * Returns Greater than of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    Series.prototype.gt = function (other) {
        return this.boolOps(other, "gt");
    };
    /**
       * Returns Less than or Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    Series.prototype.le = function (other) {
        return this.boolOps(other, "le");
    };
    /**
       * Returns Greater than or Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    Series.prototype.ge = function (other) {
        return this.boolOps(other, "ge");
    };
    /**
        * Returns Not Equal to of series and other. Supports element wise operations
        * @param {other} Series, Scalar
        * @return {Series}
        */
    Series.prototype.ne = function (other) {
        return this.boolOps(other, "ne");
    };
    /**
       * Returns Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    Series.prototype.eq = function (other) {
        return this.boolOps(other, "eq");
    };
    /**
     * Perform boolean operations on bool values
     * @param other Other Series or number to compare with
     * @param bOps Name of operation to perform [ne, ge, le, gt, lt, eq]
     */
    Series.prototype.boolOps = function (other, bOps) {
        var data = [];
        var lSeries = this.values;
        var rSeries;
        if (typeof other == "number") {
            rSeries = Array(this.values.length).fill(other); //create array of repeated value for broadcasting
        }
        else if (typeof other == "string" && ["eq", "ne"].includes(bOps)) {
            rSeries = Array(this.values.length).fill(other);
        }
        else if (other instanceof Series) {
            rSeries = other.values;
        }
        else if (Array.isArray(other)) {
            rSeries = other;
        }
        else {
            throw new Error("ParamError: value for other not supported. It must be either a scalar, Array or Series");
        }
        if (!(lSeries.length === rSeries.length)) {
            throw new Error("LengthError: Lenght of other must be equal to length of Series");
        }
        for (var i = 0; i < lSeries.length; i++) {
            var lVal = lSeries[i];
            var rVal = rSeries[i];
            var bool = null;
            switch (bOps) {
                case "lt":
                    bool = lVal < rVal ? true : false;
                    data.push(bool);
                    break;
                case "gt":
                    bool = lVal > rVal ? true : false;
                    data.push(bool);
                    break;
                case "le":
                    bool = lVal <= rVal ? true : false;
                    data.push(bool);
                    break;
                case "ge":
                    bool = lVal >= rVal ? true : false;
                    data.push(bool);
                    break;
                case "ne":
                    bool = lVal !== rVal ? true : false;
                    data.push(bool);
                    break;
                case "eq":
                    bool = lVal === rVal ? true : false;
                    data.push(bool);
                    break;
            }
        }
        return new Series(data);
    };
    /**
      * Replace all occurence of a value with a new value
      * @param oldValue The value you want to replace
      * @param newValue The new value you want to replace the old value with
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.replace = function (oldValue, newValue, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!oldValue && typeof oldValue !== 'boolean') {
            throw Error("Params Error: Must specify param 'oldValue' to replace");
        }
        if (!newValue && typeof newValue !== 'boolean') {
            throw Error("Params Error: Must specify param 'newValue' to replace with");
        }
        var newArr = __spreadArray([], this.values, true).map(function (val) {
            if (val === oldValue) {
                return newValue;
            }
            else {
                return val;
            }
        });
        if (inplace) {
            this.$setValues(newArr);
        }
        else {
            var sf = this.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    /**
     * Drops all missing values (NaN) from a Series.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.dropNa = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var oldValues = this.values;
        var oldIndex = this.index;
        var newValues = [];
        var newIndex = [];
        var isNaVals = this.isNa().values;
        isNaVals.forEach(function (val, i) {
            if (!val) {
                newValues.push(oldValues[i]);
                newIndex.push(oldIndex[i]);
            }
        });
        if (inplace) {
            this.$setValues(newValues, false);
            this.$setIndex(newIndex);
        }
        else {
            var sf = this.copy();
            sf.$setValues(newValues, false);
            sf.$setIndex(newIndex);
            return sf;
        }
    };
    /**
     * Return the integer indices that would sort the Series.
     * @param ascending boolean true: will sort the Series in ascending order, false: will sort in descending order
     */
    Series.prototype.argSort = function (ascending) {
        if (ascending === void 0) { ascending = true; }
        var sortedIndex = this.sortValues(ascending);
        var sf = new Series(sortedIndex === null || sortedIndex === void 0 ? void 0 : sortedIndex.index);
        return sf;
    };
    /**
       * Return int position of the largest value in the Series.
    */
    Series.prototype.argMax = function () {
        return this.tensor.argMax().arraySync();
    };
    /**
       * Return int position of the smallest value in the Series.
    */
    Series.prototype.argMin = function () {
        return this.tensor.argMin().arraySync();
    };
    /**
     * Remove duplicate values from a Series
     * @param keep "first" | "last", which dupliate value to keep. Defaults to "first".
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    Series.prototype.dropDuplicates = function (options) {
        var _a = __assign({ keep: "first", inplace: false }, options), keep = _a.keep, inplace = _a.inplace;
        if (!(["first", "last"].includes(keep))) {
            throw Error("Params Error: Keep must be one of 'first' or 'last'");
        }
        var dataArr;
        var newArr = [];
        var oldIndex;
        var newIndex = [];
        if (keep === "last") {
            dataArr = this.values.reverse();
            oldIndex = this.index.reverse();
        }
        else {
            dataArr = this.values;
            oldIndex = this.index;
        }
        dataArr.forEach(function (val, i) {
            if (!newArr.includes(val)) {
                newIndex.push(oldIndex[i]);
                newArr.push(val);
            }
        });
        if (keep === "last") {
            //re-reversed the array and index to its true order
            newArr = newArr.reverse();
            newIndex = newIndex.reverse();
        }
        if (inplace) {
            this.$setValues(newArr, false);
            this.$setIndex(newIndex);
        }
        else {
            var sf = this.copy();
            sf.$setValues(newArr, false);
            sf.$setIndex(newIndex);
            return sf;
        }
    };
    /**
     * Cast Series to specified data type
     * @param dtype Data type to cast to. One of [float32, int32, string, boolean, undefined]
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
    Series.prototype.asType = function (dtype, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!dtype) {
            throw Error("Param Error: Please specify dtype to cast to");
        }
        if (!(defaults_1.DATA_TYPES.includes(dtype))) {
            throw Error("dtype " + dtype + " not supported. dtype must be one of " + defaults_1.DATA_TYPES);
        }
        var oldValues = __spreadArray([], this.values, true);
        var newValues = [];
        switch (dtype) {
            case "float32":
                oldValues.forEach(function (val) {
                    newValues.push(Number(val));
                });
                break;
            case "int32":
                oldValues.forEach(function (val) {
                    newValues.push(parseInt(val));
                });
                break;
            case "string":
                oldValues.forEach(function (val) {
                    newValues.push(String(val));
                });
                break;
            case "boolean":
                oldValues.forEach(function (val) {
                    newValues.push(Boolean(val));
                });
                break;
            case "undefined":
                oldValues.forEach(function (_) {
                    newValues.push(NaN);
                });
                break;
            default:
                break;
        }
        if (inplace) {
            this.$setValues(newValues, false);
            this.$setDtypes([dtype]);
        }
        else {
            var sf = this.copy();
            sf.$setValues(newValues, false);
            sf.$setDtypes([dtype]);
            return sf;
        }
    };
    /**
     * Add a new value or values to the end of a Series
     * @param newValues Single value | Array | Series to append to the Series
     * @param index The new index value(s) to append to the Series. Must contain the same number of values as `newValues`
     * as they map `1 - 1`.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
    Series.prototype.append = function (newValue, index, options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        if (!newValue && typeof newValue !== "boolean") {
            throw Error("Param Error: newValues cannot be null or undefined");
        }
        if (!index) {
            throw Error("Param Error: index cannot be null or undefined");
        }
        var newData = __spreadArray([], this.values, true);
        var newIndx = __spreadArray([], this.index, true);
        if (Array.isArray(newValue) && Array.isArray(index)) {
            if (newValue.length !== index.length) {
                throw Error("Param Error: Length of new values and index must be the same");
            }
            newValue.forEach(function (el, i) {
                newData.push(el);
                newIndx.push(index[i]);
            });
        }
        else if (newValue instanceof Series) {
            var _value = newValue.values;
            if (!Array.isArray(index)) {
                throw Error("Param Error: index must be an array");
            }
            if (index.length !== _value.length) {
                throw Error("Param Error: Length of new values and index must be the same");
            }
            _value.forEach(function (el, i) {
                newData.push(el);
                newIndx.push(index[i]);
            });
        }
        else {
            newData.push(newValue);
            newIndx.push(index);
        }
        if (inplace) {
            this.$setValues(newData, false);
            this.$setIndex(newIndx);
        }
        else {
            var sf = new Series(newData, {
                index: newIndx,
                columns: this.columns,
                dtypes: this.dtypes,
                config: this.config
            });
            return sf;
        }
    };
    Object.defineProperty(Series.prototype, "dtype", {
        /**
         * Returns dtype of Series
        */
        get: function () {
            return this.dtypes[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "str", {
        /**
         * Exposes numerous string methods to manipulate Series of type string
        */
        get: function () {
            if (this.dtypes[0] == "string") {
                return new strings_1.default(this);
            }
            else {
                throw new Error("Cannot call accessor str on non-string type");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "dt", {
        /**
          * Returns time class that exposes different date time method
        */
        get: function () {
            if (this.dtypes[0] == "string") {
                return new datetime_1.default(this);
            }
            else {
                throw new Error("Cannot call accessor dt on non-string type");
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Prints Series to console as a grid of row and columns.
    */
    Series.prototype.toString = function () {
        var maxRow = this.$config.getMaxRow;
        var indx;
        var values = [];
        if (this.shape[0] > maxRow) {
            //slice rows to show [max_rows] rows
            var sfSlice = this.iloc(["0:" + maxRow]);
            indx = sfSlice.index;
            values = sfSlice.values;
        }
        else {
            indx = this.index;
            values = this.values;
        }
        var tabledata = values.map(function (x, i) { return [indx[i], x]; });
        return (0, table_1.table)(tabledata);
    };
    /**
     * Returns the logical AND between Series and other. Supports element wise operations and broadcasting.
     * @param other Series, Scalar, Array of Scalars
    */
    Series.prototype.and = function (other) {
        if (other === undefined) {
            throw new Error("Param Error: other cannot be undefined");
        }
        if (other instanceof Series) {
            if (this.dtypes[0] !== other.dtypes[0]) {
                throw new Error("Param Error: Series must be of same dtype");
            }
            if (this.shape[0] !== other.shape[0]) {
                throw new Error("Param Error: Series must be of same shape");
            }
            var newValues_1 = [];
            this.values.forEach(function (val, i) {
                newValues_1.push(Boolean(val) && Boolean(other.values[i]));
            });
            return new Series(newValues_1, {
                config: __assign({}, this.config)
            });
        }
        else if (Array.isArray(other)) {
            var newValues_2 = [];
            this.values.forEach(function (val, i) {
                newValues_2.push(Boolean(val) && Boolean(other[i]));
            });
            return new Series(newValues_2, {
                config: __assign({}, this.config)
            });
        }
        else {
            var newValues_3 = [];
            this.values.forEach(function (val) {
                newValues_3.push(Boolean(val) && Boolean(other));
            });
            return new Series(newValues_3, {
                config: __assign({}, this.config)
            });
        }
    };
    /**
     * Returns the logical OR between Series and other. Supports element wise operations and broadcasting.
     * @param other Series, Scalar, Array of Scalars
    */
    Series.prototype.or = function (other) {
        if (other === undefined) {
            throw new Error("Param Error: other cannot be undefined");
        }
        if (other instanceof Series) {
            if (this.dtypes[0] !== other.dtypes[0]) {
                throw new Error("Param Error: Series must be of same dtype");
            }
            if (this.shape[0] !== other.shape[0]) {
                throw new Error("Param Error: Series must be of same shape");
            }
            var newValues_4 = [];
            this.values.forEach(function (val, i) {
                newValues_4.push(Boolean(val) || Boolean(other.values[i]));
            });
            return new Series(newValues_4, {
                config: __assign({}, this.config)
            });
        }
        else if (typeof other === "boolean") {
            var newValues_5 = [];
            this.values.forEach(function (val) {
                newValues_5.push(Boolean(val) || Boolean(other));
            });
            return new Series(newValues_5, {
                config: __assign({}, this.config)
            });
        }
        else if (Array.isArray(other)) {
            var newValues_6 = [];
            this.values.forEach(function (val, i) {
                newValues_6.push(Boolean(val) || Boolean(other[i]));
            });
            return new Series(newValues_6, {
                config: __assign({}, this.config)
            });
        }
        else {
            throw new Error("Param Error: other must be a Series, Scalar, or Array of Scalars");
        }
    };
    /**
     * One-hot encode values in the Series.
     * @param options Options for the operation. The following options are available:
     * - `prefix`: Prefix to add to the new column. Defaults to unique labels.
     * - `prefixSeparator`: Separator to use for the prefix. Defaults to '_'.
     * @returns A DataFrame with the one-hot encoded columns.
     * @example
     * sf.getDummies()
     * sf.getDummies({prefix: 'cat' })
     * sf.getDummies({ prefix: 'cat', prefixSeparator: '-' })
     */
    Series.prototype.getDummies = function (options) {
        return (0, dummy_encoder_1.default)(this, options);
    };
    return Series;
}(generic_1.default));
exports.default = Series;

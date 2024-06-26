"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("./defaults");
/**
 * Package wide error throwing class
 */
var ErrorThrower = /** @class */ (function () {
    function ErrorThrower() {
        this.throwColumnNamesLengthError = function (ndframe, columns) {
            var msg = "ParamError: Column names length mismatch. You provided a column of length " + columns.length + " but Ndframe columns has length of " + ndframe.shape[1];
            throw new Error(msg);
        };
        this.throwIndexLengthError = function (ndframe, index) {
            var msg = "IndexError: You provided an index of length " + index.length + " but Ndframe rows has length of " + ndframe.shape[0];
            throw new Error(msg);
        };
        this.throwIndexDuplicateError = function () {
            var msg = "IndexError: Row index must contain unique values";
            throw new Error(msg);
        };
        this.throwColumnDuplicateError = function () {
            var msg = "ColumnIndexError: Column index must contain unique values";
            throw new Error(msg);
        };
        this.throwDtypesLengthError = function (ndframe, dtypes) {
            var msg = "DtypeError: You provided a dtype array of length " + dtypes.length + " but Ndframe columns has length of " + ndframe.shape[1];
            throw new Error(msg);
        };
        this.throwDtypeNotSupportedError = function (dtype) {
            var msg = "DtypeError: Dtype \"" + dtype + "\" not supported. dtype must be one of \"" + defaults_1.DATA_TYPES + "\"";
            throw new Error(msg);
        };
        this.throwDtypeWithoutColumnError = function () {
            var msg = "DtypeError: columns parameter must be provided when dtypes parameter is provided";
            throw new Error(msg);
        };
        this.throwColumnLengthError = function (ndframe, arrLen) {
            var msg = "ParamError: Column data length mismatch. You provided data with length " + arrLen + " but Ndframe has column of length " + ndframe.shape[0];
            throw new Error(msg);
        };
        this.throwRowLengthError = function (ndframe, arrLen) {
            var msg = "ParamError: Row data length mismatch. You provided data with length " + arrLen + " but Ndframe has row of length " + ndframe.shape[0];
            throw new Error(msg);
        };
        this.throwColumnNotFoundError = function (ndframe) {
            var msg = "ParamError: Column not found!. Column name must be one of " + ndframe.columns;
            throw new Error(msg);
        };
        this.throwNotImplementedError = function () {
            var msg = "Method not implemented";
            throw new Error(msg);
        };
        this.throwIlocRowIndexError = function () {
            var msg = "ParamError: rows parameter must be a Array. For example: rows: [1,2] or rows: [\"0:10\"]";
            throw new Error(msg);
        };
        this.throwIlocColumnsIndexError = function () {
            var msg = "ParamError: columns parameter must be a Array. For example: columns: [1,2] or columns: [\"0:10\"]";
            throw new Error(msg);
        };
        this.throwStringDtypeOperationError = function (operation) {
            var msg = "DtypeError: String data type does not support " + operation + " operation";
            throw new Error(msg);
        };
        this.throwSeriesMathOpLengthError = function (ndframe, other) {
            var msg = "ParamError: Row length mismatch. Length of other (" + other.shape[0] + "), must be the same as Ndframe (" + ndframe.shape[0] + ")";
            throw new Error(msg);
        };
    }
    return ErrorThrower;
}());
exports.default = new ErrorThrower();

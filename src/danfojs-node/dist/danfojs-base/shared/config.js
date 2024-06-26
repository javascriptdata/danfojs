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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Package wide configuration class
 */
var Configs = /** @class */ (function () {
    function Configs(options) {
        var _a = __assign({ tableDisplayConfig: {}, tableMaxRow: 10, tableMaxColInConsole: 10, dtypeTestLim: 500, lowMemoryMode: false }, options), tableDisplayConfig = _a.tableDisplayConfig, tableMaxRow = _a.tableMaxRow, tableMaxColInConsole = _a.tableMaxColInConsole, dtypeTestLim = _a.dtypeTestLim, lowMemoryMode = _a.lowMemoryMode;
        this.tableDisplayConfig = tableDisplayConfig;
        this.tableMaxRow = tableMaxRow; // The maximum number of rows to display in console
        this.tableMaxColInConsole = tableMaxColInConsole; // The maximum number of columns to display in console
        this.dtypeTestLim = dtypeTestLim; // The number of rows to use when inferring data type
        this.lowMemoryMode = lowMemoryMode; // Whether to use minimal memory or not.
    }
    Configs.prototype.setTableDisplayConfig = function (config) {
        this.tableDisplayConfig = config;
    };
    Object.defineProperty(Configs.prototype, "getTableDisplayConfig", {
        get: function () {
            return this.tableDisplayConfig;
        },
        enumerable: false,
        configurable: true
    });
    Configs.prototype.setTableMaxColInConsole = function (val) {
        this.tableMaxColInConsole = val;
    };
    Object.defineProperty(Configs.prototype, "getTableMaxColInConsole", {
        get: function () {
            return this.tableMaxColInConsole;
        },
        enumerable: false,
        configurable: true
    });
    Configs.prototype.setMaxRow = function (val) {
        this.tableMaxRow = val;
    };
    Object.defineProperty(Configs.prototype, "getMaxRow", {
        get: function () {
            return this.tableMaxRow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configs.prototype, "getDtypeTestLim", {
        get: function () {
            return this.dtypeTestLim;
        },
        enumerable: false,
        configurable: true
    });
    Configs.prototype.setDtypeTestLim = function (val) {
        this.dtypeTestLim = val;
    };
    Object.defineProperty(Configs.prototype, "isLowMemoryMode", {
        get: function () {
            return this.lowMemoryMode;
        },
        enumerable: false,
        configurable: true
    });
    Configs.prototype.setIsLowMemoryMode = function (val) {
        this.lowMemoryMode = val;
    };
    return Configs;
}());
exports.default = Configs;

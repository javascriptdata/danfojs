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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __importDefault(require("../shared/utils"));
var utils = new utils_1.default();
/**
 * Exposes numerous String methods. All methods are applied Element-wise
 */
var Str = /** @class */ (function () {
    function Str(series) {
        this.series = series;
        this.values = series.values;
    }
    Str.prototype.toLowerCase = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).toLowerCase());
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.toUpperCase = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).toUpperCase());
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.capitalize = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                var firstChar = ("" + val).slice(0, 1);
                var leftChar = ("" + val).slice(1);
                var newStr = "" + firstChar.toUpperCase() + leftChar.toLowerCase();
                newArr.push(newStr);
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.charAt = function (index, options) {
        if (index === void 0) { index = 0; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).charAt(index));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.concat = function (other, position, options) {
        if (position === void 0) { position = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        if (Array.isArray(other)) {
            for (var i = 0; i < other.length; i++) {
                var leftStr = "" + this.values[i];
                var rightStr = "" + other[i];
                if (position == 1) {
                    newArr.push(leftStr.concat(rightStr));
                }
                else {
                    newArr.push(rightStr.concat(leftStr));
                }
            }
        }
        else {
            this.values.map(function (val) {
                if (position == 1) {
                    if (utils.isEmpty(val)) {
                        newArr.push(NaN);
                    }
                    else {
                        newArr.push(("" + val).concat("" + other));
                    }
                }
                else {
                    if (utils.isEmpty(val)) {
                        newArr.push(NaN);
                    }
                    else {
                        newArr.push(other.concat("" + val));
                    }
                }
            });
        }
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.startsWith = function (str, options) {
        if (str === void 0) { str = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.forEach(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).startsWith(str));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.endsWith = function (str, options) {
        if (str === void 0) { str = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).endsWith(str));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.includes = function (str, options) {
        if (str === void 0) { str = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).includes(str));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.indexOf = function (str, options) {
        if (str === void 0) { str = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).indexOf(str));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.lastIndexOf = function (str, options) {
        if (str === void 0) { str = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).lastIndexOf(str));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.replace = function (searchValue, replaceValue, options) {
        if (searchValue === void 0) { searchValue = ""; }
        if (replaceValue === void 0) { replaceValue = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).replace(searchValue, replaceValue));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.repeat = function (num, options) {
        if (num === void 0) { num = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).repeat(num));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.search = function (str, options) {
        if (str === void 0) { str = ""; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).search(str));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.slice = function (startIndex, endIndex, options) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).slice(startIndex, endIndex));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.split = function (splitVal, options) {
        if (splitVal === void 0) { splitVal = " "; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push("" + String(val).split(splitVal));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.substr = function (startIndex, num, options) {
        if (startIndex === void 0) { startIndex = 0; }
        if (num === void 0) { num = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push("" + String(val).substr(startIndex, num));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.substring = function (startIndex, endIndex, options) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = 1; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push("" + String(val).substring(startIndex, endIndex));
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.trim = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).trim());
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.join = function (valToJoin, joinChar, options) {
        if (valToJoin === void 0) { valToJoin = ""; }
        if (joinChar === void 0) { joinChar = " "; }
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                var leftChar = val;
                var rightChar = valToJoin;
                var new_char = "" + leftChar + joinChar + rightChar;
                newArr.push(new_char);
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    Str.prototype.len = function (options) {
        var inplace = __assign({ inplace: false }, options).inplace;
        var newArr = [];
        this.values.map(function (val) {
            if (utils.isEmpty(val)) {
                newArr.push(NaN);
            }
            else {
                newArr.push(("" + val).length);
            }
        });
        if (inplace) {
            this.series.$setValues(newArr);
            this.series.print();
        }
        else {
            var sf = this.series.copy();
            sf.$setValues(newArr);
            return sf;
        }
    };
    return Str;
}());
exports.default = Str;

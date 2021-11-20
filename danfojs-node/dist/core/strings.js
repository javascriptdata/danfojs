"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Exposes numerous String methods. All methods are applied Element-wise
 */
var Str = /** @class */ (function () {
    function Str(series) {
        this.series = series;
        this.values = series.values;
    }
    /**
     * Converts all characters to lowercase.
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["GooD", "Bad", "CrAzy"])
     * const newSf = sf.str.toLowerCase()
     * console.log(newSf.values)
     * // ["good", "bad", "crazy"]
     * ```
    */
    Str.prototype.toLowerCase = function (options) {
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Converts all characters to uppercase.
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["GooD", "Bad", "CrAzy"])
     * const newSf = sf.str.toUpperCase()
     * console.log(newSf.values)
     * // ["GOOD", "BAD", "CRAZY"]
     * ```
    */
    Str.prototype.toUpperCase = function (options) {
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Capitalize first string
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.capitalize()
     * console.log(newSf.values)
     * // ["Good", "Bad", "Crazy"]
     * ```
    */
    Str.prototype.capitalize = function (options) {
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Returns the character at the specified index (position)
     * @param index position of character
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.charAt(1)
     * console.log(newSf.values)
     * // ["o", "a", "r"]
     * ```
    */
    Str.prototype.charAt = function (index, options) {
        if (index === void 0) { index = 0; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Joins specified `other` with values in the Series.
     * @param other string|values to concatenate with.
     * @param position where to concat the string from. O concats from the start, 1 concats from the end. Defaults to 1.
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.concat("_new")
     * console.log(newSf.values)
     * // ["Good_new", "bad_new", "crazy_new"
     * ```
    */
    Str.prototype.concat = function (other, position, options) {
        if (position === void 0) { position = 1; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
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
                    if (isNaN(val) && typeof val != "string") {
                        newArr.push(NaN);
                    }
                    else {
                        newArr.push(("" + val).concat("" + other));
                    }
                }
                else {
                    if (isNaN(val) && typeof val != "string") {
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
    /**
     * Checks whether a string begins with specified characters
     * @param str String or Character to check against
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.startsWith("G")
     * console.log(newSf.values)
     * // [true, false, false]
     * ```
    */
    Str.prototype.startsWith = function (str, options) {
        if (str === void 0) { str = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.forEach(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Checks whether a string ends with specified characters
     * @param str String or Character to check against
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.endsWith("d")
     * console.log(newSf.values)
     * // [true, true, false]
     * ```
    */
    Str.prototype.endsWith = function (str, options) {
        if (str === void 0) { str = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Checks whether a string contains the specified string/characters
     * @param str String or Character to check against
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.includes("d")
     * console.log(newSf.values)
     * // [true, true, false]
     * ```
    */
    Str.prototype.includes = function (str, options) {
        if (str === void 0) { str = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Returns the position of the first occurrence of a specified value in a string.
     * @param str String or Character to check against
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "bad", "crazy"])
     * const newSf = sf.str.indexOf("d")
     * console.log(newSf.values)
     * // [3, 2, -1]
     * ```
    */
    Str.prototype.indexOf = function (str, options) {
        if (str === void 0) { str = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Returns the position of the last found occurrence of a specified value in a string
     * @param str String or Character to check against
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "crazy"])
     * const newSf = sf.str.lastIndexOf("d")
     * console.log(newSf.values)
     * // [3, 2, -1]
     * ```
    */
    Str.prototype.lastIndexOf = function (str, options) {
        if (str === void 0) { str = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Searches a string for a specified value, or a regular expression, and returns a new string where the specified values are replaced
     * @param searchValue String | Character value to replace
     * @param replaceValue String | Character string to replace with
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "crazy"])
     * const newSf = sf.str.replace("d", 7)
     * console.log(newSf.values)
     * // ["Goo7", "o77", "crazy"]
     * ```
    */
    Str.prototype.replace = function (searchValue, replaceValue, options) {
        if (searchValue === void 0) { searchValue = ""; }
        if (replaceValue === void 0) { replaceValue = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Returns a new string with a specified number of copies of an existing string
     * @param num Number of times to repeat
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "crazy"])
     * const newSf = sf.str.replace(2)
     * console.log(newSf.values)
     * // ["GoodGood", "oddodd", "crazycrazy"]
     * ```
    */
    Str.prototype.repeat = function (num, options) {
        if (num === void 0) { num = 1; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Searches a string for a specified value, or regular expression, and returns the position of the match
     * @param str String or Character to check against
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "crazy"])
     * const newSf = sf.str.search("d")
     * console.log(newSf.values)
     * ```
    */
    Str.prototype.search = function (str, options) {
        if (str === void 0) { str = ""; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Extracts a part of a string and returns a new string
     * @param startIndex index position of start character
     * @param endIndex index position of last character
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "crazy"])
     * const newSf = sf.str.slice(0,1)
     * console.log(newSf.values)
     * // ["G", "o", "c"]
     * ```
    */
    Str.prototype.slice = function (startIndex, endIndex, options) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = 1; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Splits a string into an values of substrings
     * @param splitVal string or character to split at
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "grade"])
     * const newSf = sf.str.split(d)
     * console.log(newSf.values)
     * ```
    */
    Str.prototype.split = function (splitVal, options) {
        if (splitVal === void 0) { splitVal = " "; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Extracts the characters from a string, beginning at a specified start position, and through the specified number of character
     * @param startIndex index position of start character
     * @param num number of characters to return
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "grade"])
     * const newSf = sf.str.substr(d)
     * ```
    */
    Str.prototype.substr = function (startIndex, num, options) {
        if (startIndex === void 0) { startIndex = 0; }
        if (num === void 0) { num = 1; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
    * Extracts the characters from a string, between two specified indices
    * @param startIndex index position of start character
    * @param endIndex index position of last character
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "grade"])
     * const newSf = sf.str.substring(d)
     * ```
    */
    Str.prototype.substring = function (startIndex, endIndex, options) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = 1; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
      * Removes whitespace from both ends of a string
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series([" Good", "odd ", " grade "])
     * const newSf = sf.str.trim(d)
     * ["Good", "odd", "grade"]
     * ```
    */
    Str.prototype.trim = function (options) {
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
      * Joins strings to specified value
      * @param valToJoin string value to join to the values
      * @param joinChar Character to Join with
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "grade"])
     * const newSf = sf.str.join("new", "_")
     * // ["Good_new", "odd_new", "grade_new"]
     * ```
    */
    Str.prototype.join = function (valToJoin, joinChar, options) {
        if (valToJoin === void 0) { valToJoin = ""; }
        if (joinChar === void 0) { joinChar = " "; }
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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
    /**
     * Counts the number of characters in string
     * @param options The following optional parameters are supported:
     * - `inplace` Boolean, indicating whether to perform the operation inplace or not. Defaults to `false`
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const sf = new Series(["Good", "odd", "grade"])
     * const newSf = sf.str.len(d)
     * // [4,3,5]
     * ```
    */
    Str.prototype.len = function (options) {
        if (options === void 0) { options = { inplace: false }; }
        var _a = options.inplace, inplace = _a === void 0 ? false : _a;
        var newArr = [];
        this.values.map(function (val) {
            if (isNaN(val) && typeof val != "string") {
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

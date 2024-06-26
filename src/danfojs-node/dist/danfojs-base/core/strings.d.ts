import Series from "./series";
/**
 * Exposes numerous String methods. All methods are applied Element-wise
 */
export default class Str {
    private series;
    private values;
    constructor(series: Series);
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
    toLowerCase(options?: {
        inplace?: boolean;
    }): Series;
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
    toUpperCase(options?: {
        inplace?: boolean;
    }): Series;
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
    capitalize(options?: {
        inplace?: boolean;
    }): Series;
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
    charAt(index: number, options?: {
        inplace?: boolean;
    }): Series;
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
    concat(other: Array<string> | string, position: number, options?: {
        inplace?: boolean;
    }): Series;
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
    startsWith(str: string, options?: {
        inplace?: boolean;
    }): Series;
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
    endsWith(str: string, options?: {
        inplace?: boolean;
    }): Series;
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
    includes(str: string, options?: {
        inplace?: boolean;
    }): Series;
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
    indexOf(str: string, options?: {
        inplace?: boolean;
    }): Series;
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
    lastIndexOf(str: string, options?: {
        inplace?: boolean;
    }): Series;
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
    replace(searchValue: string, replaceValue: string, options?: {
        inplace?: boolean;
    }): Series;
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
    repeat(num: number, options?: {
        inplace?: boolean;
    }): Series;
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
    search(str: string, options?: {
        inplace?: boolean;
    }): Series;
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
    slice(startIndex: number, endIndex: number, options?: {
        inplace?: boolean;
    }): Series;
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
    split(splitVal: string, options?: {
        inplace?: boolean;
    }): Series;
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
    substr(startIndex: number, num: number, options?: {
        inplace?: boolean;
    }): Series;
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
    substring(startIndex: number, endIndex: number, options?: {
        inplace?: boolean;
    }): Series;
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
    trim(options?: {
        inplace?: boolean;
    }): Series;
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
    join(valToJoin: string, joinChar: string, options?: {
        inplace?: boolean;
    }): Series;
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
    len(options?: {
        inplace?: boolean;
    }): Series;
}

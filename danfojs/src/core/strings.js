//handled string columns in Series and DataFrame




/**
 * String methods applied on Series and DataFrames
 */
export class Str {
    constructor(array) {
        if (!Array.isArray(array)) {
            throw Error("Type Error: String class accepts only arrays")
        }
        this.array = array
    }

    /**
     *  Converts all characters to lowercase.
     * @return {array}
     */
    toLowerCase() {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.toLowerCase())
        })
        return new_arr
    }

    /**
     * Converts all characters to uppercase.
     * @return {array}
     */
    toUpperCase() {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.toUpperCase())
        })
        return new_arr
    }

    /**
     * Capitalize first string
     * @return {array}
     */
    capitalize() {
        let new_arr = []
        this.array.map(val => {
            let f_char = val.slice(0, 1)
            let l_char = val.slice(1)
            let new_str = `${f_char.toUpperCase()}${l_char.toLowerCase()}`
            new_arr.push(new_str)
        })
        return new_arr

    }

    /**
     * Returns the character at the specified index (position)
     * @params {index} index position of character
     * @return {array}
     */
    charAt(index = 0) {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.charAt(index))
        })
        return new_arr
    }

    /**
     * Joins two or more strings/arrays. 0 joins from the start
     * @params {other} string|array to concatenate with.
     * @params {position} where to concat the string from. O concats from the start, 1 concats from the end
     * @params {isArray} whether operation is performed on Array or not
     * @return {array}
     */
    concat(other = "", position = 1, isArray = false) {
        if (isArray) {
            let final_arr = []
            for (let i = 0; i < other.length; i++) {
                let l_str = this.array[i]
                let r_str = other[i]
                if (position == 1) {
                    final_arr.push(l_str.concat(r_str))
                } else {
                    final_arr.push(r_str.concat(l_str))
                }

            }
            return final_arr

        } else {

            let new_arr = []

            this.array.map(val => {
                if (position == 1) {
                    new_arr.push(val.concat(other))

                } else {
                    new_arr.push(other.concat(val))
                }
            })
            return new_arr
        }

    }


    /**
    * Checks whether a string begins with specified characters
    * @params {String | Character} String or Character to check against
    * @return {array}
    */
    startsWith(str = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.startsWith(str))
        })
        return new_arr
    }

    /**
   * Checks whether a string ends with specified characters
   * @params {String | Character} String or Character to check against
   * @return {array}
   */
    endsWith(str = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.endsWith(str))
        })
        return new_arr
    }

    /**
     * Checks whether a string contains the specified string/characters
     * @params {String | Character} String or Character to check against
     * @return {array}
     */
    includes(str = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.includes(str))
        })
        return new_arr
    }

    /**
    * Returns the position of the first found occurrence of a specified value in a string
    * @params {String | Character} String or Character to check against
    * @return {array}
    */
    indexOf(str = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.indexOf(str))
        })
        return new_arr
    }

    /**
   * Returns the position of the last found occurrence of a specified value in a string
   * @params {str: String | Character} String or Character to check against
   * @return {array}
   */
    lastIndexOf(str = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.lastIndexOf(str))
        })
        return new_arr
    }


    /**
    * Searches a string for a specified value, or a regular expression, and returns a new string where the specified values are replaced
    * @params {searchValue: String | Character} string value to replace
    * @params {replaceValue: String | Character} string to replace with
    * @return {array}
    */
    replace(searchValue = "", replaceValue = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.replace(searchValue, replaceValue))
        })
        return new_arr
    }

    /**
     * Returns a new string with a specified number of copies of an existing string
     * @params {num: Integer} Number of times to repeat
     * @return {array}
     */
    repeat(num = 1) {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.repeat(num))
        })
        return new_arr
    }


    /**
     * Searches a string for a specified value, or regular expression, and returns the position of the match
     * @params {str: String | Character} String or Character to check against
     * @return {array}
     */
    search(str = "") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.search(str))
        })
        return new_arr
    }

    /**
   * Extracts a part of a string and returns a new string
   * @params {startIndex: Int} index position of start character
   * @params {endIndex: Int} index position of last character
   * @return {array}
   */
    slice(startIndex = 0, endIndex = 1) {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.slice(startIndex, endIndex))
        })
        return new_arr
    }

    /**
     * Splits a string into an array of substrings
     * @params {val: string} string or character to split at
     * @params {endIndex: Int} index position of last character
     * @return {array}
     */
    split(splitVal = " ") {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.split(splitVal))
        })
        return new_arr
    }

    /**
   * Extracts the characters from a string, beginning at a specified start position, and through the specified number of character
   * @params {startIndex: Int} index position of start character
   * @params {num: Int} number of characters to return
   * @return {array}
   */
    substr(startIndex = 0, num = 1) {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.substr(startIndex, num))
        })
        return new_arr
    }

    /**
  * Extracts the characters from a string, between two specified indices
  * @params {startIndex: Int} index position of start character
  * @params {endIndex: Int} index position of last character
  * @return {array}
  */
    substring(startIndex = 0, endIndex = 1) {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.substring(startIndex, endIndex))
        })
        return new_arr
    }

    /**
    * Removes whitespace from both ends of a string
    * @return {array}
    */
    trim() {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.trim())
        })
        return new_arr
    }

    /**
    * Joins strings to specified value
    * @params {valToJoin} string value to join to the array
    * @params {joinChar} Character to Join with
    * @return {array}
    */
    join(valToJoin = "", joinChar = " ") {
        let new_arr = []
        this.array.map(val => {
            let l_char = val
            let r_char = valToJoin
            let new_char = `${l_char}${joinChar}${r_char}`
            new_arr.push(new_char)
        })
        return new_arr
    }

    /**
    * Counts the number of characters in string
    * @return {array}
    */
    len() {
        let new_arr = []
        this.array.map(val => {
            new_arr.push(val.length)
        })
        return new_arr
    }


}

import * as tf from '@tensorflow/tfjs-node'
import { Utils } from "./utils"
import NDframe from "./generic"
const utils = new Utils
// const config = new Configs()



/**
 * One-dimensional ndarray with axis labels (including time series).
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values– they need not be the same length. 
 * @param {data} data Array, JSON of 1D values
 * @param {kwargs} Object {columns: column names, dtypes : data type of values}
 * 
 * @returns Series data structure
 */
export class Series extends NDframe {
    constructor(data, kwargs) {
        super(data, kwargs)
    }


    /**
        * Returns a Series in Tensorflow's tensor format
        * @returns {1D tensor}
        */
    tensor() {
        return tf.tensor(this.values).asType(this.dtypes[0])
    }

    /**
    * Prints the first n values in a Series
    * @param {rows}  Number of rows to return
    * @returns {Series}
    */
    head(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            //Creates a new Series with first [rows]
            let config = { columns: this.column_names }
            let data = this.values.slice(0, rows)
            return new Series(data, config)
        }

    }


    /**
    * Prints the last n values in a Series
    * @param {rows} NUmber of rows to return
    * @returns {Series}
    */
    tail(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            //Creates a new Series with last [rows]
            let config = { columns: this.column_names }
            let data = this.values.slice(this.values.length - rows)
            return new Series(data, config)
        }

    }

    /**
    * Gets [num] number of random rows in a Series
    * @param {rows}  
    * @returns {Series}
    */
    sample(num = 1) {
        if (num > this.values.length || num < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            //Creates a new dataframe with last [rows]
            let config = { columns: this.column_names }
            let sampled_arr = utils.__sample_from_iter(this.values, num)
            return new Series(sampled_arr, config)

        }
    }

    /**
    * Return Addition of series and other, element-wise (binary operator add).
    * Equivalent to series + other
    * @param {other} Series or Number to add  
    * @returns {Series}
    */
    add(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let sum = this.tensor().add(other).arraySync()
            return new Series(sum, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let sum = this.tensor().add(other.tensor()).arraySync()
                return new Series(sum, { columns: this.column_names })
            }
        }
    }

    /**
    * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
    * Equivalent to series - other
    * @param {other} Series, Number to subtract
    * @returns {Series}
    */
    sub(other) {
        if (utils.__is_number(other)) {
            let sub = this.tensor().sub(other).arraySync()
            return new Series(sub, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let sub = this.tensor().sub(other.tensor()).arraySync()
                return new Series(sub, { columns: this.column_names })
            }
        }
    }



    /**
    * Return Multiplication of series and other, element-wise (binary operator mul).
    * Equivalent to series * other
    *  @param {other} Series, Number to multiply with.
    * @returns {Series}
    */
    mul(other) {
        if (utils.__is_number(other)) {
            let mul = this.tensor().mul(other).arraySync()
            return new Series(mul, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let mul = this.tensor().mul(other.tensor()).arraySync()
                return new Series(mul, { columns: this.column_names })
            }
        }
    }



    /**
    * Return division of series and other, element-wise (binary operator div).
    * Equivalent to series / other
    *  @param {other} Series, Number to divide with.
    * @returns {Series}
    */
    div(other, round = true) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let div_result = this.tensor().div(other)
            return new Series(div_result.arraySync(), { columns: this.column_names, dtypes: div_result.dtype })
        } else {
            if (this.__check_series_op_compactibility) {
                let dtype;
                //Check if caller needs a float division
                if (round) {
                    dtype = "float32"
                } else {
                    dtype = "int32"
                }
                let tensor1 = this.tensor().asType(dtype)
                let tensor2 = other.tensor().asType(dtype)
                let result = tensor1.div(tensor2)
                dtype = result.dtype //dtype is subject to change after division
                return new Series(result.arraySync(), { columns: this.column_names, dtypes: dtype })
            }
        }
    }

    /**
    * Return Exponential power of series and other, element-wise (binary operator pow).
    * Equivalent to series ** other
    *  @param {other} Series, Number to multiply with.
    */
    pow(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let pow_result = this.tensor().pow(other).arraySync()
            return new Series(pow_result, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let pow_result = this.tensor().pow(other.tensor()).arraySync()
                return new Series(pow_result, { columns: this.column_names })
            }
        }
    }

    /**
    * Return Modulo of series and other, element-wise (binary operator mod).
    * Equivalent to series % other
    *  @param {other} Series, Number
    * @returns {Series} 
    */
    mod(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let mod_result = this.tensor().mod(other).arraySync()
            return new Series(mod_result, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let mod_result = this.tensor().mod(other.tensor()).arraySync()
                return new Series(mod_result, { columns: this.column_names })
            }
        }
    }


    /**
    * Returns the mean of elements in Series
    * @returns {Series} 
    */
    mean() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support mean operation")
        }
        let mean = this.tensor().mean().arraySync()
        return mean
    }



    /**
    * Returns the median of elements in Series
    * @returns {Series} 
    */
    median() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support median operation")
        }
        let values = this.values
        let median = utils.__median(values)
        return median
    }



    /**
    * Returns the modal value of elements in Series
    * @returns {Number} 
    */
    mode() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support mode operation")
        }
        let values = this.values
        let mode = utils.__mode(values)
        return mode
    }


    /**
    * Returns the minimum value in a Series
    * @returns {Number} 
    */
    min() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support min operation")
        }
        let values = this.values
        let min = tf.min(values).arraySync()
        return min

    }

    /**
    * Returns the maximum value in a Series
    * @returns {Number} 
    */
    max() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support max operation")
        }
        let values = this.values
        let max = tf.max(values).arraySync()
        return max

    }


    /**
    * Return the sum of the values in a series.
    * This is equivalent to the method numpy.sum.
    *  @returns {Number}, sum of values in Series
    */
    sum() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support sum operation")
        }
        let temp_sum = tf.tensor(this.values).asType(this.dtypes[0]).sum().arraySync()
        return temp_sum
    }


    /**
     * Return number of non-null elements in a Series
     *  @returns {Number}, Count of non-null values
     */
    count() {
        if (!this.series) {
            throw Error("property error: Object must be a series")
        }
        return utils.__count_nan(this.values)
    }


    /**
    * Return maximum of series and other, element-wise (binary operator div).
    *  @param {other} Series, Numbers to check maximum against
    * @returns {Series}
    */
    maximum(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let max_result = this.tensor().maximum(other)
            return new Series(max_result.arraySync(), { columns: this.column_names, dtypes: max_result.dtype })
        } else {
            if (this.__check_series_op_compactibility) {
                let tensor1 = this.tensor()
                let tensor2 = other.tensor()
                let result = tensor1.maximum(tensor2)
                return new Series(result.arraySync(), { columns: this.column_names })
            }
        }
    }

    /**
    * Return maximum of series and other, element-wise (binary operator div).
    *  @param {other} Series, Numbers to check maximum against
    * @returns {Series}
    */
    minimum(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let max_result = this.tensor().minimum(other)
            return new Series(max_result.arraySync(), { columns: this.column_names, dtypes: max_result.dtype })
        } else {
            if (this.__check_series_op_compactibility) {
                let tensor1 = this.tensor()
                let tensor2 = other.tensor()
                let result = tensor1.minimum(tensor2).arraySync()
                return new Series(result, { columns: this.column_names })
            }
        }
    }

    /**
    * Return maximum of series and other, element-wise (binary operator div).
    *  @param {dp} Number, Numbers of Decimal places to round to
    * @returns {Series}
    */
    round(dp) {
        if (utils.__is_undefined(dp)) {
            //use tensorflow round function to roound to the nearest whole number
            let result = tf.round(this.tensor())
            return new Series(result.arraySync(), { columns: this.column_names })

        } else {
            let result = utils.__round(this.values, dp)
            return new Series(result, { columns: this.column_names })

        }

    }


    /**
    * Sort a Series in ascending or descending order by some criterion.
    *  @param {dp} Number, Numbers of Decimal places to round to
    * @returns {Series}
    */
    sort_values(ascending = true, inplace = false) {
        console.log(this.axes['index']);
        let result = this.values.sort(function (a, b) { return a - b })
        if (ascending) {
            if (inplace) {
                return new Series(result, { columns: this.column_names })
            } else {
                this.values = result
            }
        } else {
            result = result.reverse()
            if (inplace) {
                return new Series(result, { columns: this.column_names })
            } else {
                this.values = result
            }

        }
    }



    //check two series is compatible for an mathematical operation
    __check_series_op_compactibility(other) {
        if (utils.__is_undefined(other.series)) {
            throw Error("param [other] must be a Series or a single value that can be broadcasted")
        }
        if (other.values.length != this.values.length) {
            throw Error("Shape Error: Series shape do not match")
        }
        if (this.dtypes[0] != 'float' || this.dtypes[0] != 'int') {
            throw Error(`dtype Error: Cannot perform operation on type ${this.dtypes[0]} with type ${other.dtypes[0]}`)
        }
        if (other.dtypes[0] != 'float' || other.dtypes[0] != 'int') {
            throw Error(`dtype Error: Cannot perform operation on type ${other.dtypes[0]} with type ${this.dtypes[0]}`)
        }

        return true
    }


    /**
    * Overrides default string representation of NDFrame
    */
    // toString() {
    //     let data = this.values
    //     let table_truncate = 10
    //     let table_config = {}
        
    //     data.unshift(this.columns) //Adds the column names to values before printing
    //     return table(data, { columns: table_config })
    // }

}


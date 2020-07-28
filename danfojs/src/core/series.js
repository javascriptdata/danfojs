import * as tf from '@tensorflow/tfjs-node'
import { Utils } from "./utils"
import NDframe from "./generic"
import { table } from 'table'
import { Configs } from '../config/config'


const utils = new Utils
const config = new Configs()  //package wide configuration object

import { std, variance } from 'mathjs'



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
        if (Array.isArray(data[0]) || utils.__is_object(data[0])){
            data = utils.__convert_2D_to_1D(data)
            super(data, kwargs)
        }else{
            super(data, kwargs)
        }
    }


    /**
        * Returns a Series in Tensorflow's tensor format
        * @returns {1D tensor}
        */
    get tensor() {
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
            let idx = this.index.slice(this.values.length - rows)
            let sf = new Series(data, config)
            sf.__set_index(idx)
            return sf
        }

    }

    /**
    * Gets [num] number of random rows in a Series
    * @param {rows}  
    * @returns {Series}
    */
    sample(num = 5) {
        if (num > this.values.length || num < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            let values = this.values
            let idx = this.index
            let new_values = []
            let new_idx = []
 
            let counts = [...Array(idx.length).keys()]   //set index
            //get random sampled numbers
            let rand_nums = utils.__randgen(num, 0, counts.length)
            rand_nums.map(i =>{
                new_values.push(values[i])
                new_idx.push(idx[i])
            })
            let config = {columns: this.column_names, index: new_idx}
            let sf = new Series(new_values, config)
            return sf

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
            let sum = this.tensor.add(other).arraySync()
            return new Series(sum, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let sum = this.tensor.add(other.tensor).arraySync()
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
            let sub = this.tensor.sub(other).arraySync()
            return new Series(sub, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let sub = this.tensor.sub(other.tensor).arraySync()
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
            let mul = this.tensor.mul(other).arraySync()
            return new Series(mul, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let mul = this.tensor.mul(other.tensor).arraySync()
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
            let div_result = this.tensor.div(other)
            return new Series(div_result.arraySync(), { columns: this.column_names, dtypes: [div_result.dtype] })
        } else {
            if (this.__check_series_op_compactibility) {
                let dtype;
                //Check if caller needs a float division
                if (round) {
                    dtype = "float32"
                } else {
                    dtype = "int32"
                }
                let tensor1 = this.tensor.asType(dtype)
                let tensor2 = other.tensor.asType(dtype)
                let result = tensor1.div(tensor2)
                dtype = result.dtype //dtype is subject to change after division
                console.log(dtype);
                return new Series(result.arraySync(), { columns: this.column_names, dtypes: [dtype] })
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
            let pow_result = this.tensor.pow(other).arraySync()
            return new Series(pow_result, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let pow_result = this.tensor.pow(other.tensor).arraySync()
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
            let mod_result = this.tensor.mod(other).arraySync()
            return new Series(mod_result, { columns: this.column_names })
        } else {
            if (this.__check_series_op_compactibility) {
                let mod_result = this.tensor.mod(other.tensor).arraySync()
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
        let mean = this.tensor.mean().arraySync()
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
        let median = utils.__median(values, true)
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
        return utils.__count_nan(this.values, true, true)
    }


    /**
    * Return maximum of series and other, element-wise (binary operator div).
    *  @param {other} Series, Numbers to check maximum against
    * @returns {Series}
    */
    maximum(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let max_result = this.tensor.maximum(other)
            return new Series(max_result.arraySync(), { columns: this.column_names, dtypes: max_result.dtype })
        } else {
            if (this.__check_series_op_compactibility) {
                let tensor1 = this.tensor
                let tensor2 = other.tensor
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
            let max_result = this.tensor.minimum(other)
            return new Series(max_result.arraySync(), { columns: this.column_names, dtypes: max_result.dtype })
        } else {
            if (this.__check_series_op_compactibility) {
                let tensor1 = this.tensor
                let tensor2 = other.tensor
                let result = tensor1.minimum(tensor2).arraySync()
                return new Series(result, { columns: this.column_names })
            }
        }
    }


    /**
    * Round each value in a Series to the given number of decimals.
    *  @param {dp} Number, Numbers of Decimal places to round to
    * @returns {Series}
    */
    round(dp) {
        if (utils.__is_undefined(dp)) {
            //use tensorflow round function to roound to the nearest whole number
            let result = tf.round(this.tensor)
            return new Series(result.arraySync(), { columns: this.column_names })

        } else {
            let result = utils.__round(this.values, dp, true)
            return new Series(result, { columns: this.column_names })

        }

    }

    /**
    * Return sample standard deviation over requested axis.
    * @returns {Number}
    */
    std() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support std operation")
        }
        let values = this.values
        let std_val = std(values) //using math.js
        return std_val

    }

    /**
    *  Return unbiased variance of Series.
    * @returns {Number}
    */
    var() {
        if (this.dtypes[0] == "string") {
            throw Error("dtype error: String data type does not support var operation")
        }
        let values = this.values
        let var_val = variance(values) //using math.js
        return var_val

    }


    /**
    * Sort a Series in ascending or descending order by some criterion.
    *  @param {kwargs} Object, {ascending (Bool): Whether to return sorted values in ascending order or not,
    *                           inplace (Bool): Whether to perform sorting on the original Series or not}
    * @returns {Series}
    */
    sort_values(kwargs = {}) {

        if (this.dtypes[0] == 'string') {
            throw Error("Dtype Error: cannot sort Series of type string")
        }
        let options = {}
        if (utils.__key_in_object(kwargs, 'ascending')) {
            options['ascending'] = kwargs["ascending"]
        } else {
            options['ascending'] = true
        }

        if (utils.__key_in_object(kwargs, 'inplace')) {
            options['inplace'] = kwargs["inplace"]
        } else {
            options['inplace'] = false
        }


        let sorted_arr = []
        let sorted_idx = []
        let arr_tensor = tf.clone(this.tensor)
        let arr_obj = [...this.values]

        for (let i = 0; i < this.shape[0]; i++) {
            let min_idx = arr_tensor.argMin().arraySync()
            sorted_arr.push(this.values[min_idx])
            sorted_idx.push(this.index[min_idx])
            arr_obj[min_idx] = NaN  //replace with NaN string
            arr_tensor = tf.tensor(arr_obj)
        }

        if (!options['ascending']) {
            sorted_arr = sorted_arr.reverse()
            sorted_idx = sorted_idx.reverse()
        }

        if (options['inplace']) {
            this.data = sorted_arr
            this.__set_index(sorted_idx)
            return null
        } else {
            let sf = new Series(sorted_arr, { columns: this.column_names })
            sf.__set_index(sorted_idx)
            return sf
        }
    }


    /**
    * Make a new copy of Series 
    * @returns {Series}
    */
    copy() {
        let sf = new Series([...this.values], { columns: [...this.column_names] })
        sf.__set_index([...this.index])
        sf.astype([...this.dtypes], false)
        return sf
    }


    /**
    * Generate descriptive statistics.
    * Descriptive statistics include those that summarize the central tendency, 
    * dispersion and shape of a dataset’s distribution, excluding NaN values.
    * @returns {Series}
    */
    describe() {
        if (this.dtypes[0] == "string") {
            return null
        } else {

            let index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance']
            let count = this.count()
            let mean = this.mean()
            let std = this.std()
            let min = this.min()
            let median = this.median()
            let max = this.max()
            let variance = this.var()

            let vals = [count, mean, std, min, median, max, variance]
            let sf = new Series(vals, {columns: this.columns})
            sf.__set_index(index)
            return sf

        }


    }


    /**
    * Generate a new DataFrame or Series with the index reset.
    * This is useful when the index needs to be treated as a column, 
    * or when the index is meaningless and needs to be reset to the default before another operation.
    * @param {kwargs} {inplace: Modify the Series in place (do not create a new object,
    *                  drop: Just reset the index, without inserting it as a column in the new DataFrame.}
    */
    reset_index(kwargs = {}) {
        let options = {}
        if (utils.__key_in_object(kwargs, 'inplace')) {
            options['inplace'] = kwargs['inplace']
        } else {
            options['inplace'] = false
        }

        if (options['inplace']) {
            this.__reset_index()
        } else {
            let sf = this.copy()
            sf.__reset_index()
            return sf
        }
    }

    /**
    * Generate a new Series with the specified index.
    * Set the Series index (row labels) using an array of the same length.
    * @param {kwargs} {index: Array of new index values}
    */
    set_index(kwargs = {}) {
        let options = {}
        if (utils.__key_in_object(kwargs, 'index')) {
            options['index'] = kwargs['index']
        } else {
            throw Error("Index ValueError: You must specify an array of index")
        }

        if (utils.__key_in_object(kwargs, 'inplace')) {
            options['inplace'] = kwargs['inplace']
        } else {
            options['inplace'] = false
        }

        if (options['index'].length != this.index.length) {
            throw Error(`Index LengthError: Lenght of new Index array ${options['index'].length} must match lenght of existing index ${this.index.length}`)
        }

        if (options['inplace']) {
            this.index_arr = options['index']
        } else {
            let sf = this.copy()
            sf.__set_index(options['index'])
            return sf
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
     * map all the element in a column to a variable
     * @param{callable} callable can either be a funtion or an object
     * @return return an array
     */
    map(callable) {

        let is_callable = utils.__is_function(callable);

        let data = this.data.map((val) => {

            if (is_callable) {
                return callable(val)
            }
            else {

                if (utils.__is_object(callable)) {

                    if (utils.__key_in_object(callable, val)) {
                        return callable[val];
                    } else {
                        return "NaN"
                    }
                } else {
                    throw new Error("callable must either be a function or an object")
                }
            }
        });
        return data
    }

    /**
     * The apply function is similar to the map function
     * just that it only takes in a function
     * @param {callable} callable [FUNCTION]
     * @return Array
     */
    apply(callable) {
        let is_callable = utils.__is_function(callable);

        if (!is_callable) {
            throw new Error("the arguement most be a function")
        }

        let data = this.data.map((val) => {

            return callable(val)
        });
        return data
    }


    /**
    * Prints the data in a Series as a grid of row and columns
    */
    toString() {
        let table_width = 20
        let table_truncate = 20
        let max_row = config.get_max_row

        // let data;
        let data_arr = []
        let table_config = {}

        let header = [""].concat(this.columns)
        let idx, data;

        if (this.values.length > max_row) {
            //slice Object to show a max of [max_rows]
            data = this.values.slice(0, max_row)
            idx = this.index.slice(0, max_row)
        } else {
            data = this.values
            idx = this.index
        }

        idx.map((val, i) => {
            let row = [val].concat(data[i])
            data_arr.push(row)
        })

        //set column width of all columns
        table_config[0] = 10
        table_config[1] = { width: table_width, truncate: table_truncate }

        data_arr.unshift(header) //Adds the column names to values before printing
        return table(data_arr, { columns: table_config })
    }


}


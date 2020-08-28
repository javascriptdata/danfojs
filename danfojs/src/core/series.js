import * as tf from '@tensorflow/tfjs-node'
import { std, variance } from 'mathjs'
// import * as tf from '@tensorflow/tfjs'
import { Utils } from "./utils"
import { Str } from "./strings"
import NDframe from "./generic"
import { table } from 'table'
import { Configs } from '../config/config'
import { TimeSeries } from './timeseries';
import { Plot } from '../plotting/plot'
import { indexLoc } from '../core/indexing'


const utils = new Utils()
const config = new Configs()  //package wide configuration object





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
        if (Array.isArray(data[0]) || utils.__is_object(data[0])) {
            data = utils.__convert_2D_to_1D(data)
            super(data, kwargs)
        } else {
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

            // let counts = [...Array(idx.length).keys()]   //set index
            //get random sampled numbers
            // let index_arr = utils.__range(0,counts.length)
            let rand_nums = utils.__shuffle(num, idx)
            // console.log(rand_nums)
            rand_nums.map(i => {
                new_values.push(values[i])
                new_idx.push(idx[i])
            })
            let config = { columns: this.column_names, index: new_idx }
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
        let values = []
        //remove all NaNS
        this.values.map(val => {
            if (!isNaN(val) && typeof val != "string") {
                values.push(val)
            }
        })
        let mean = tf.tensor(values).mean().arraySync()
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
        if (this.dtypes[0] == "boolean") {
            let temp_sum = tf.tensor(this.values).sum().arraySync()
            return Number(temp_sum)
        }
        let temp_sum = tf.tensor(this.values).asType(this.dtypes[0]).sum().arraySync()
        return Number(temp_sum.toFixed(5))
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

        let values = []
        this.values.forEach(val => {
            if (!(isNaN(val) && typeof val != 'string')) {
                values.push(val)
            }
        })
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
        let values = []
        this.values.forEach(val => {
            if (!(isNaN(val) && typeof val != 'string')) {
                values.push(val)
            }
        })
        let var_val = variance(values) //using math.js
        return var_val

    }

    /**
     * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values,
     *  gets mapped to True values. Everything else gets mapped to False values. 
     * @return {Series}
     */
    isna() {
        let new_arr = []
        this.values.map(val => {
            // eslint-disable-next-line use-isnan
            if (val == NaN) {
                new_arr.push(true)
            } else if (isNaN(val) && typeof val != "string") {
                new_arr.push(true)
            } else {
                new_arr.push(false)
            }
        })
        let sf = new Series(new_arr, { index: this.index, columns: this.column_names, dtypes: ["boolean"] })
        return sf
    }

    /**
     * Replace NaN or undefined with a specified value"
     * @param {kwargs}, {"value": the new value to replace the old value with, inplace: Perform operation inplace or not} 
     * @return {Series}
     */
    fillna(kwargs = {}) {
        let params_needed = ["value", "inplace"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
        }

        kwargs['inplace'] = kwargs['inplace'] || false

        if (!utils.__key_in_object(kwargs, "value")) {
            throw Error('Value Error: Must specify value to replace with')
        }

        let values = this.values
        let new_values = []

        values.map(val => {
            if (isNaN(val) && typeof val != "string") {
                new_values.push(kwargs['value'])
            } else {
                new_values.push(val)
            }
        })
        if (kwargs['inplace']) {
            this.data = new_values
        } else {
            let sf = new Series(new_values, { columns: this.column_names, index: this.index, dtypes: this.dtypes })
            return sf
        }
    }




    /**
    * Sort a Series in ascending or descending order by some criterion.
    *  @param {kwargs} Object, {ascending (Bool): Whether to return sorted values in ascending order or not,
    *                           inplace (Bool): Whether to perform sorting on the original Series or not}
    * @returns {Series}
    */
    sort_values(kwargs = {}) {
        // console.log(this);

        if (this.dtypes[0] == 'string') {
            throw Error("Dtype Error: cannot sort Series of type string")
        }

        let params_needed = ["inplace", "ascending", "by"] //"by" param is used in DataFrame call to sort_values
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
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
        let arr_obj = [...this.values]

        const dsu = (arr1, arr2) => arr1
            .map((item, index) => [arr2[index], item]) // add the args to sort by
            .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
            .map(([, item]) => item); // extract the sorted items

        let range_idx = utils.__range(0, this.index.length - 1)
        let sorted_idx = dsu(range_idx, arr_obj);

        sorted_idx.forEach(idx => {
            sorted_arr.push(this.values[idx])
        })
        if (options['ascending']) {
            sorted_arr = sorted_arr.reverse()
            sorted_idx = sorted_idx.reverse()
        }

        if (options['inplace']) {
            this.data = sorted_arr
            this.__set_index(sorted_idx)
        } else {
            let sf = new Series(sorted_arr, { columns: this.column_names, index: sorted_idx })
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
        // sf.astype([...this.dtypes], false)
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
            let sf = new Series(vals, { columns: this.columns })
            sf.__set_index(index)
            return sf

        }


    }


    /**
    * Generate a new Series with the index reset.
    * This is useful when the index needs to be treated as a column, 
    * or when the index is meaningless and needs to be reset to the default before another operation.
    * @param {kwargs} {inplace: Modify the Series in place (do not create a new object}
    */
    reset_index(kwargs = {}) {
        let params_needed = ["inplace"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
        }

        kwargs['inplace'] = kwargs['inplace'] || false
        if (kwargs['inplace']) {
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
    * @param {kwargs} {index: Array of new index values, inplace: If operation should happen inplace}
    */
    set_index(kwargs = {}) {

        let params_needed = ["index", "inplace"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
        }

        kwargs['inplace'] = kwargs['inplace'] || false

        if (!utils.__key_in_object(kwargs, 'index')) {
            throw Error("Index ValueError: You must specify an array of index")
        }

        if (kwargs['index'].length != this.index.length) {
            throw Error(`Index LengthError: Lenght of new Index array ${kwargs['index'].length} must match lenght of existing index ${this.index.length}`)
        }

        if (kwargs['inplace']) {
            this.index_arr = kwargs['index']
        } else {
            let sf = this.copy()
            sf.__set_index(kwargs['index'])
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
     * @return {Array}
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
        let sf = new Series(data, { columns: this.column_names, index: this.index })
        return sf
    }

    /**
     * The apply function is similar to the map function
     * just that it only takes in a function
     * @param {callable} callable [FUNCTION]
     * @return {Array}
     */
    apply(callable) {
        let is_callable = utils.__is_function(callable);

        if (!is_callable) {
            throw new Error("the arguement most be a function")
        }

        let data = this.data.map((val) => {

            return callable(val)
        });
        return new Series(data, { columns: this.column_names, index: this.index })
    }

    /**
     * Returns the unique value in a series
     * @return {Series}
     */
    unique() {

        let data_set = new Set(this.values)
        let data = Array.from(data_set);
        let series = new Series(data)

        return series

    }

    /**
     * Return the number of unique value in a series
     * @return {int}
     */
    nunique() {

        let unique = this.unique().values

        return unique.length;
    }

    /**
     * Returns the unique values and their counts in a Series
     * @return {Series}
     */
    value_counts() {

        let s_data = this.values

        let data_dict = {}

        for (let i = 0; i < s_data.length; i++) {

            let val = s_data[i]
            if (val in data_dict) {
                data_dict[val] += 1
            } else {
                data_dict[val] = 1
            }
        }

        let index = Object.keys(data_dict).map(x => {
            return parseInt(x) ? parseInt(x) : x
        })
        let data = index.map(x => { return data_dict[x] })

        let series = new Series(data, { index: index })
        // series.index_arr = index;

        return series

    }

    /**
     * Returns the absolute values in Series
     * @return {series}
     */
    abs() {
        let s_data = this.values

        let tensor_data = tf.tensor1d(s_data)
        let abs_data = tensor_data.abs().arraySync()

        return new Series(utils.__round(abs_data, 2, true))
    }


    /** 
     * Returns the cumulative sum over a Series
    * @return {Series}
    */
    cumsum() {
        let data = this.__cum_ops("sum");
        return data
    }

    /**
     * Returns cumulative minimum over a Series
     * @returns series
     */
    cummin() {
        let data = this.__cum_ops("min");
        return data
    }

    /**
     * Returns cumulative maximum over a Series
     * @returns series
     */
    cummax() {
        let data = this.__cum_ops("max");
        return data
    }

    /**
     * Returns cumulative product over a Series
     * @returns series
     */
    cumprod() {
        let data = this.__cum_ops("prod");
        return data
    }




    /**
     * Returns Less than of series and other. Supports element wise operations
     * @param {other} Series, Scalar 
     * @return {Series}
     */
    lt(other) {
        return this.__bool_ops(other, "lt");
    }

    /**
     * Returns Greater than of series and other. Supports element wise operations
     * @param {other} Series, Scalar 
     * @return {Series}
     */
    gt(other) {
        return this.__bool_ops(other, "gt");
    }

    /**
     * Returns Less than or Equal to of series and other. Supports element wise operations
     * @param {other} Series, Scalar 
     * @return {Series}
     */
    le(other) {
        return this.__bool_ops(other, "le");
    }

    /**
     * Returns Greater than or Equal to of series and other. Supports element wise operations
     * @param {other} Series, Scalar 
     * @return {Series}
     */
    ge(other) {
        return this.__bool_ops(other, "ge");
    }

    /**
      * Returns Not Equal to of series and other. Supports element wise operations
      * @param {other} Series, Scalar 
      * @return {Series}
      */
    ne(other) {
        return this.__bool_ops(other, "ne");
    }



    /**
     * Returns Equal to of series and other. Supports element wise operations
     * @param {other} Series, Scalar 
     * @return {Series}
     */
    eq(other) {
        return this.__bool_ops(other, "eq");
    }

    /**
   * Replace all occurence of a value with a new specified value"
   * @param {kwargs}, {"replace": the value you want to replace, "with": the new value you want to replace the olde value with, inplace: Perform operation inplace or not} 
   * @return {Series}
   */
    replace(kwargs = {}) {
        let params_needed = ["replace", "with", "inplace"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
        }

        kwargs['inplace'] = kwargs['inplace'] || false

        if (utils.__key_in_object(kwargs, "replace") && utils.__key_in_object(kwargs, "with")) {
            let replaced_arr = []
            let old_arr = this.values

            old_arr.map(val => {
                if (val == kwargs['replace']) {
                    replaced_arr.push(kwargs['with'])
                } else {
                    replaced_arr.push(val)
                }
            })

            if (kwargs['inplace']) {
                this.data = replaced_arr
            } else {
                let sf = new Series(replaced_arr, { index: this.index, columns: this.columns, dtypes: this.dtypes })
                return sf
            }

        } else {
            throw Error("Params Error: Must specify both 'replace' and 'with' parameters.")
        }

    }


    /**
     * Return a new Series with missing values removed.
     * @param {kwargs} {inplace: Perform operation inplace or not} 
     * @return {Series}
     */
    dropna(kwargs = {}) {
        let params_needed = ["inplace"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
        }
        kwargs['inplace'] = kwargs['inplace'] || false

        let old_values = this.values
        let old_index = this.index
        let new_values = []
        let new_index = []
        let isna_vals = this.isna().values

        isna_vals.map((val, i) => {
            if (!val) {
                new_values.push(old_values[i])
                new_index.push(old_index[i])
            }
        })
        if (kwargs['inplace']) {
            this.index_arr = new_index
            this.data = new_values
        } else {
            let sf = new Series(new_values, { columns: this.column_names, index: new_index, dtypes: this.dtypes })
            return sf
        }

    }

    /**
   * Return the integer indices that would sort the Series values.
   * @param {ascending} boolean true: will sort the Series in ascending order, false: will sort in descending order
   * @return {Series}
   */
    argsort(ascending = true) {
        let sorted_index = this.sort_values({ ascending: ascending }).index
        let sf = new Series(sorted_index)
        return sf
    }

    /**
     * Return int position of the largest value in the Series.
     * @return {Number}
     */
    argmax() {
        // let sorted_index = this.sort_values({ ascending: true }).index
        // let last_idx = sorted_index[sorted_index.length - 1]
        // return last_idx
        return this.values.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }


    /**
     * Return int position of the smallest value in the Series.
     * @param {ascending} boolean true: will sort the Series in ascending order, false: will sort in descending order
     * @return {Series}
     */
    argmin() {
        let sorted_index = this.sort_values({ ascending: true }).index
        let first_idx = sorted_index[0]
        return first_idx
    }


    /**
     * Returns dtype of Series
     * @return {string}
     */
    get dtype() {
        return this.dtypes[0]
    }

    /**
     * Return Series with duplicate values removed
     * @param {kwargs} {inplace: Perform operation inplace or not} 
     * @return {Series}
     */
    drop_duplicates(kwargs = {}) {
        let params_needed = ["inplace", "keep"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: Specified parameter is not supported. Your params must be any of the following [${params_needed}]`)
        }
        kwargs['inplace'] = kwargs['inplace'] || false
        kwargs['keep'] = kwargs['keep'] || "first"


        let data_arr, old_index;
        if (kwargs['keep'] == "last") {
            data_arr = this.values.reverse()
            old_index = this.index.reverse()
        } else {
            data_arr = this.values
            old_index = this.index
        }


        let seen = []
        let new_index = []
        let new_arr = []
        data_arr.map((val, i) => {
            if (!seen.includes(val)) {
                new_index.push(old_index[i])
                new_arr.push(val)
                seen.push(val)
            }
        })

        if (kwargs['keep'] == "last") {
            //re-reversed the array and index
            new_arr = new_arr.reverse()
            new_index = new_index.reverse()
        }

        if (kwargs['inplace'] == true) {
            this.data = new_arr
            this.index_arr = new_index
        } else {
            let sf = new Series(new_arr, { index: new_index, columns: this.column_names, dtypes: this.dtypes })
            return sf
        }

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

    /**
     * Perform boolean operations on bool values
     */
    __bool_ops(other, b_ops) {
        let r_series;
        let l_series = this.values

        ///operation can be performed on a Series or a single scalar using broadcasting
        if (typeof other == "number") {
            //create array of other for broadcasting
            r_series = []
            for (let i = 0; i < this.values.length; i++) {
                r_series.push(other)
            }
        } else {
            if (!(other instanceof Series)) {
                throw new Error("must be an instance of series")
            }
            l_series = this.values
            r_series = other.values
        }

        if (!(l_series.length === r_series.length)) {
            throw new Error("Both series must be of the same length")
        }

        let data = []

        for (let i = 0; i < l_series.length; i++) {

            let l_val = l_series[i]
            let r_val = r_series[i]
            let bool = null
            switch (b_ops) {

                case "lt":
                    bool = l_val < r_val ? true : false
                    data.push(bool);
                    break;
                case "gt":
                    bool = l_val > r_val ? true : false
                    data.push(bool);
                    break;
                case "le":
                    bool = l_val <= r_val ? true : false
                    data.push(bool);
                    break;
                case "ge":
                    bool = l_val >= r_val ? true : false
                    data.push(bool);
                    break;
                case "ne":
                    bool = l_val != r_val ? true : false
                    data.push(bool);
                    break;
                case "eq":
                    bool = l_val === r_val ? true : false
                    data.push(bool);
                    break;
            }
        }
        return new Series(data)

    }

    /**
     * perform cumulative operation on series data
     * @returns array
     */
    __cum_ops(ops) {

        let s_data = this.values
        let temp_val = s_data[0]
        let data = [temp_val]

        for (let i = 1; i < s_data.length; i++) {

            let curr_val = s_data[i]
            switch (ops) {
                case "max":
                    if (curr_val > temp_val) {
                        data.push(curr_val)
                        temp_val = curr_val
                    } else {
                        data.push(temp_val)
                    }
                    break;
                case "min":
                    if (curr_val < temp_val) {
                        data.push(curr_val)
                        temp_val = curr_val
                    } else {
                        data.push(temp_val)
                    }
                    break;
                case "sum":
                    temp_val = temp_val + curr_val
                    data.push(temp_val);
                    break;
                case "prod":
                    temp_val = temp_val * curr_val
                    data.push(temp_val)
                    break;

            }
        }
        return new Series(data)
    }


    /**
     * Sets the data types of a Series 
     * @param {dtype} String [float32, int32, string] data type to cast to.
     *@returns {Series}
     */
    astype(dtype) {

        if (dtype == undefined) {
            throw Error("Value Error: Please specify dtype to cast to")
        }

        const __supported_dtypes = ['float32', "int32", 'string', 'boolean']

        if (!__supported_dtypes.includes(dtype)) {
            throw Error(`dtype ${dtype} not supported`)
        }

        let col_values = this.values
        let new_values = []

        switch (dtype) {
            case "float32":
                col_values.map(val => {
                    new_values.push(Number(val))
                })
                break;
            case "int32":
                col_values.map(val => {
                    new_values.push(Number(Number(val).toFixed()))
                })
                break;
            case "string":
                col_values.map(val => {
                    new_values.push(String(val))
                })
                break;
            default:
                break;
        }


        let sf = new Series(new_values, { dtypes: dtype, index: this.index })
        return sf

    }


    /**
     * Returns String Object of series. Has numerous methods to manipulate string Series
     */
    get str() {
        let values = this.values
        if (this.dtypes[0] != "string") {
            let new_vals = []
            //convert each value in array to string
            values.map(val => {
                new_vals.push(`${val}`)
            })
            let sf = new Series(new_vals, { columns: this.column_names, index: this.index })
            return new Str(sf)
        }
        return new Str(this)

    }

    /**
    * Returns Danfo Time Object that exposes different time properties
    */
    get dt() {
        let timeseries = new TimeSeries({ data: this }); // parsed to date-time
        timeseries.preprocessed()
        return timeseries

    }

    /**
     * Displays the data in a console friendly manner
     */
    print() {
        console.log(this + "");
    }


    /**
      * Make plots of Series or DataFrame.
      * Uses the Plotly as backend, so supports Plotly's configuration parameters
      * @param {string} div Name of the div to show the plot
      * @returns {Class} Plot class that expoese different plot type
      */
    plot(div) {
        const plt = new Plot(this, div)
        return plt
    }

    /**
     * Slice series accross the index
     * @param {*} row --> Array
     * @returns Series
     */
    iloc(row) {

        let kwargs = {}

        kwargs["rows"] = row
        kwargs["type"] = "iloc"

        let [new_data, columns, rows] = indexLoc(this, kwargs);

        let sf = new Series(new_data, { columns: columns });
        sf.__set_index(rows)

        return sf
    }
}


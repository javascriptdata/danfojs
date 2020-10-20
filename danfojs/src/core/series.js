/**
* Copyright 2020, JsData
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 *
*/


// import * as tf from '@tensorflow/tfjs-node' //Use this import when building optimized version for danfojs-node
import * as tf from '@tensorflow/tfjs' //Use this import when building optimized version for danfojs browser sideimport { std, variance } from 'mathjs'
import { variance, std } from 'mathjs'
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
 * @returns Series
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
    * @returns {1D Tensor}
    */
    get tensor() {
        return tf.tensor(this.values).asType(this.dtypes[0])
    }



    /**
    * Returns the first n values in a Series
    * @param {rows}  Number of rows to return
    * @returns {Series}
    */
    head(rows = 5) {
        if (rows > this.shape[0] || rows < 1) {
            //return all values
            return new Series(this.values, { columns: this.column_names })
        } else {
            let data = this.values.slice(0, rows)
            return new Series(data, { columns: this.column_names })
        }

    }


    /**
    * Returns the last n values in a Series
    * @param {rows} number of rows to return
    * @returns {Series}
    */
    tail(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            return new Series(this.values, { columns: this.column_names })
        } else {
            let data = this.values.slice(this.shape[0] - rows)
            let idx = this.index.slice(this.shape[0] - rows)
            let sf = new Series(data, { columns: this.column_names, index: idx })
            return sf
        }

    }

    /**
    * Returns n number of random rows in a Series
    * @param {rows} number of rows to return
    * @returns {Series}
    */
    sample(num = 5) {
        if (num > this.values.length || num < 1) {
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            let values = this.values
            let idx = this.index
            let new_values = []
            let new_idx = []
            let rand_nums = utils.__shuffle(num, idx)

            rand_nums.forEach(i => {
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
            let sum = this.row_data_tensor.add(other).arraySync()
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
                //dtype may change after division because of how TFJS works internally, so save dtypes first
                let tensor1 = this.tensor.asType(dtype)
                let tensor2 = other.tensor.asType(dtype)
                let result = tensor1.div(tensor2)
                return new Series(result.arraySync(), { columns: this.column_names, dtypes: [result.dtype] })
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
        utils._throw_str_dtype_error(this, 'mean')
        let values = utils._remove_nans(this.values)
        let mean = tf.tensor(values).mean().arraySync()
        return mean
    }



    /**
    * Returns the median of elements in Series
    * @returns {Series} 
    */
    median() {
        utils._throw_str_dtype_error(this, 'median')
        let values = this.values
        let median = utils.__median(values, true)
        return median
    }



    /**
    * Returns the modal value of elements in Series
    * @returns {Number} 
    */
    mode() {
        utils._throw_str_dtype_error(this, 'mode')
        let values = this.values
        let mode = utils.__mode(values)
        return mode
    }


    /**
    * Returns the minimum value in a Series
    * @returns {Number} 
    */
    min() {
        utils._throw_str_dtype_error(this, 'min')
        let min = this.row_data_tensor.min().arraySync()
        return min

    }

    /**
    * Returns the maximum value in a Series
    * @returns {Number} 
    */
    max() {
        utils._throw_str_dtype_error(this, 'max')
        let max = this.row_data_tensor.max().arraySync()
        return max

    }


    /**
    * Return the sum of the values in a series.
    * This is equivalent to the method tf.sum
    *  @returns {Number}, sum of values in Series
    */
    sum() {
        utils._throw_str_dtype_error(this, 'sum')
        if (this.dtypes[0] == "boolean") {
            let temp_sum = this.row_data_tensor.sum().arraySync()
            return Number(temp_sum)
        }
        let temp_sum = this.row_data_tensor.sum().arraySync()
        return Number(temp_sum.toFixed(5))
    }


    /**
     * Return number of non-null elements in a Series
     *  @returns {Number}, Count of non-null values
     */
    count() {
        return utils.__count_nan(this.values, true, true)
    }


    /**
    * Return maximum of series and other, element-wise (binary operator div).
    *  @param {other} Series, Numbers to check maximum against
    * @returns {Series}
    */
    maximum(other) {
        if (utils.__is_number(other)) {
            let max_result = this.row_data_tensor.maximum(other)
            return new Series(max_result.arraySync(), {
                columns: this.column_names,
                dtypes: max_result.dtype,
                index: this.index
            })
        } else {
            if (this.__check_series_op_compactibility) {
                let tensor1 = this.row_data_tensor
                let tensor2 = other.tensor
                let result = tensor1.maximum(tensor2).arraySync()
                return new Series(result, { columns: this.column_names, index: this.index })
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
            let max_result = this.row_data_tensor.minimum(other)
            return new Series(max_result.arraySync(), {
                columns: this.column_names,
                dtypes: max_result.dtype,
                index: this.index
            })
        } else {
            if (this.__check_series_op_compactibility) {
                let tensor1 = this.tensor
                let tensor2 = other.tensor
                let result = tensor1.minimum(tensor2).arraySync()
                return new Series(result, { columns: this.column_names, index: this.index })
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
            let result = tf.round(this.row_data_tensor).arraySync()
            return new Series(result, { columns: this.column_names, index: this.index })

        } else {
            let result = utils.__round(this.values, dp, true)
            return new Series(result, { columns: this.column_names, index: this.index })

        }

    }

    /**
    * Return sample standard deviation over requested axis.
    * @returns {Number}
    */
    std() {
        utils._throw_str_dtype_error(this, 'std')
        let values = utils._remove_nans(this.values)
        // TODO: Use Tensorflow ops for faster computation
        let std_val = std(values) //using math.js
        return std_val

    }

    /**
    *  Return unbiased variance of Series.
    * @returns {Number}
    */
    var() {
        utils._throw_str_dtype_error(this, 'std')
        let values = utils._remove_nans(this.values)
        // TODO: Use Tensorflow ops for faster computation
        let var_val = variance(values) //using math.js
        return var_val

    }

    /**
     * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values,
     *  gets mapped to True values. Everything else gets mapped to False values. 
     * @return {Series}
     */
    isna() {
        let new_arr = this.__isna()
        let sf = new Series(new_arr, {
            index: this.index,
            columns: this.column_names,
            dtypes: ["boolean"]
        })
        return sf
    }

    /**
     * Replace NaN or undefined with a specified value"
     * @param {kwargs}, {"value": the new value to replace the old value with, inplace: Perform operation inplace or not} 
     * @return {Series}
     */
    fillna(kwargs = {}) {
        let params_needed = ["value", "inplace"]
        utils._throw_wrong_params_error(kwargs, params_needed)

        kwargs['inplace'] = kwargs['inplace'] || false

        if (!("value" in kwargs)) {
            throw Error('Value Error: Must specify value to replace with')
        }

        let new_values = []
        this.values.forEach(val => {
            if (isNaN(val) && typeof val != "string") {
                new_values.push(kwargs['value'])
            } else {
                new_values.push(val)
            }
        })

        if (kwargs['inplace']) {
            this.data = new_values
        } else {
            let sf = new Series(new_values, {
                columns: this.column_names,
                index: this.index,
                dtypes: this.dtypes
            })
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
        let params_needed = ["inplace", "ascending"]
        utils._throw_wrong_params_error(kwargs, params_needed)

        if (!('ascending' in kwargs)) {
            kwargs['ascending'] = true
        }

        if (!('inplace' in kwargs)) {
            kwargs['inplace'] = false
        }

        let sorted_values = []
        let arr_obj = [...this.values]
        let range_idx = utils.__range(0, this.index.length - 1)
        let sorted_idx = utils._sort_arr_with_index(range_idx, arr_obj, this.dtypes[0])

        sorted_idx.forEach(idx => {
            sorted_values.push(this.values[idx])
        })

        if (kwargs['ascending']) {
            sorted_values = sorted_values.reverse()
            sorted_idx = sorted_idx.reverse()
        }

        if (kwargs['inplace']) {
            this.data = sorted_values
            this.__set_index(sorted_idx)
        } else {
            let sf = new Series(sorted_values, { columns: this.column_names, index: sorted_idx })
            return sf
        }
    }


    /**
    * Makes a deep copy of a Series 
    * @returns {Series}
    */
    copy() {

        let sf = new Series([...this.values], {
            columns: [...this.column_names],
            index: [...this.index],
            dtypes: [...this.dtypes[0]]
        })
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
            let sf = new Series(vals, { columns: this.columns, index: index })
            return sf

        }


    }


    /**
    * Returns Series with the index reset.
    * This is useful when index is meaningless and needs to be reset to the default before another operation.
    * @param {kwargs} {inplace: Modify the Series in place (do not create a new object}
    */
    reset_index(kwargs = {}) {
        let params_needed = ["inplace"]
        utils._throw_wrong_params_error(kwargs, params_needed)

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
    * Returns Series with the specified index.
    * Set the Series index (row labels) using an array of the same length.
    * @param {kwargs} {index: Array of new index values,
    *                  inplace: If operation should happen inplace
    *                   }
    */
    set_index(kwargs = {}) {

        let params_needed = ["index", "inplace"]
        utils._throw_wrong_params_error(kwargs, params_needed)


        kwargs['inplace'] = kwargs['inplace'] || false

        if (!('index' in kwargs)) {
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


    /**
     * Checks if two series are compatible for a mathematical operation
     * @param {Series} other Series to compare against
     * @returns{boolean}
     */
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
     * map all the element in a column to a variable or function
     * @param{callable} callable can either be a funtion or an object
     * @return {Array}
     */
    map(callable) {
        let is_callable = utils.__is_function(callable);

        let data = this.data.map((val) => {
            if (is_callable) {
                return callable(val)
            } else {
                if (utils.__is_object(callable)) {

                    if (val in callable) {
                        return callable[val];
                    } else {
                        return NaN
                    }
                } else {
                    throw new Error("callable must either be a function or an object")
                }
            }
        })
        let sf = new Series(data, {
            columns: this.column_names,
            index: this.index
        })
        return sf
    }

    /**
     * Applies a function to each element of a Series
     * @param {Function} Function to apply to each element of the series
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
     * Returns the unique value(s) in a Series
     * @return {Series}
     */
    unique() {

        let data_set = new Set(this.values)
        let series = new Series(Array.from(data_set))

        return series

    }

    /**
     * Return the number of unique value in a series
     * @return {int}
     */
    nunique() {
        return this.unique().values.length
    }

    /**
     * Returns unique values and their counts in a Series
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
        let data = Object.values(data_dict)

        let series = new Series(data, { index: index })
        return series

    }

    /**
     * Returns the absolute values in Series
     * @return {series}
     */
    abs() {
        let abs_data = this.row_data_tensor.abs().arraySync()
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
    * Replace all occurence of a value with a new value"
    * @param {kwargs}, {"replace": the value you want to replace,
    *                   "with": the new value you want to replace the olde value with,
    *                   inplace: Perform operation inplace or not} 
    * @return {Series}
    */
    replace(kwargs = {}) {
        let params_needed = ["replace", "with", "inplace"]
        utils._throw_wrong_params_error(kwargs, params_needed)

        kwargs['inplace'] = kwargs['inplace'] || false

        if (!("replace" in kwargs)) {
            throw Error("Params Error: Must specify param 'replace'")
        }

        if (!("with" in kwargs)) {
            throw Error("Params Error: Must specify param 'with'")
        }

        let replaced_arr = []
        let old_arr = this.values

        old_arr.forEach(val => {
            if (val == kwargs['replace']) {
                replaced_arr.push(kwargs['with'])
            } else {
                replaced_arr.push(val)
            }
        })

        if (kwargs['inplace']) {
            this.data = replaced_arr
        } else {
            let sf = new Series(replaced_arr, {
                index: this.index,
                columns: this.columns,
                dtypes: this.dtypes
            })
            return sf
        }

    }


    /**
     * Return a new Series with missing values (NaN) removed.
     * @param {kwargs} {inplace: Perform operation inplace or not} 
     * @return {Series}
     */
    dropna(kwargs = {}) {
        let params_needed = ["inplace"]
        utils._throw_wrong_params_error(kwargs, params_needed)

        kwargs['inplace'] = kwargs['inplace'] || false

        let old_values = this.values
        let old_index = this.index
        let new_values = []
        let new_index = []
        let isna_vals = this.isna().values

        isna_vals.forEach((val, i) => {
            if (!val) {
                new_values.push(old_values[i])
                new_index.push(old_index[i])
            }
        })
        if (kwargs['inplace']) {
            this.index_arr = new_index
            this.data = new_values
        } else {
            let sf = new Series(new_values, {
                columns: this.column_names,
                index: new_index,
                dtypes: this.dtypes
            })
            return sf
        }

    }

    /**
   * Return the integer indices that would sort the Series.
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
        return this.row_data_tensor.argMax().arraySync()
    }


    /**
     * Return int position of the smallest value in the Series.
     * @param {ascending} boolean true: will sort the Series in ascending order, false: will sort in descending order
     * @return {Series}
     */
    argmin() {
        return this.row_data_tensor.argMin().arraySync()

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
     * @param {kwargs} {inplace: Perform operation inplace or not,
     *                  keep: first | last which dupliate value to keep} 
     * @return {Series}
     */
    drop_duplicates(kwargs = {}) {
        let params_needed = ["inplace", "keep"]
        utils._throw_wrong_params_error(kwargs, params_needed)

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

        let new_index = []
        let new_arr = []

        data_arr.forEach((val, i) => {
            if (!new_arr.includes(val)) {
                new_index.push(old_index[i])
                new_arr.push(val)
            }
        })

        if (kwargs['keep'] == "last") {
            //re-reversed the array and index to its true ordering
            new_arr = new_arr.reverse()
            new_index = new_index.reverse()
        }

        if (kwargs['inplace']) {
            this.data = new_arr
            this.index_arr = new_index
        } else {
            let sf = new Series(new_arr, {
                index: new_index,
                columns: this.column_names,
                dtypes: this.dtypes
            })
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

        idx.forEach((val, i) => {
            let row = [val].concat(data[i])
            data_arr.push(row)
        })

        //set column width of all columns
        table_config[0] = 10
        table_config[1] = { width: table_width, truncate: table_truncate }

        let table_data = [header].concat(data_arr) //Add the column names to values before printing
        return table(table_data, { columns: table_config })
    }

    /**
     * Perform boolean operations on bool values
     * @param {*} other Other series to compare with
     * @param {string} b_ops name of operation to perform [ne, ge, le, gt, lt, eq]
     */
    __bool_ops(other, b_ops) {
        let r_series;
        let l_series = this.values

        if (typeof other == "number") {
            r_series = [...l_series].fill(other)  //create array of repeated value for broadcasting
        } else {
            if (!(other instanceof Series)) {
                throw new Error("Value Error: 'other' must be an instance of Series")
            }
            r_series = other.values
        }

        if (!(l_series.length === r_series.length)) {
            throw new Error("Length Error: Both series must be of the same length")
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
     * Cast Series to specified data type 
     * @param {string} dtype data type to cast to [float32, int32, string, boolean] 
     *@returns {Series}
     */
    astype(dtype) {
        const __supported_dtypes = ['float32', "int32", 'string', 'boolean']

        if (!dtype) {
            throw Error("Value Error: Please specify dtype to cast to")
        }

        if (!__supported_dtypes.includes(dtype)) {
            throw Error(`dtype ${dtype} not supported. dtype must be one of ${__supported_dtypes}`)
        }

        let col_values = this.values
        let new_values = []

        switch (dtype) {
            case "float32":
                col_values.forEach(val => {
                    new_values.push(Number(val))
                })
                break;
            case "int32":
                col_values.forEach(val => {
                    new_values.push(Number(Number(val).toFixed()))
                })
                break;
            case "string":
                col_values.forEach(val => {
                    new_values.push(String(val))
                })
                break;
            case "boolean":
                col_values.forEach(val => {
                    new_values.push(Boolean(val))
                })
                break;
            default:
                break;
        }

        let sf = new Series(new_values, { dtypes: dtype, index: this.index })
        return sf

    }


    /**
     * Exposes numerous string methods to manipulate Series
     */
    get str() {
        let values = this.values
        if (this.dtypes[0] != "string") {
            let new_vals = []
            //convert each value in array to string
            values.forEach(val => {
                new_vals.push(String(val))
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
      * Uses the Plotly as backend, so therefore supports Plotly's configuration parameters
      * @param {string} div Name of the div to show the plot
      * @returns {Class} Plot class that expoese different plot type
      */
    plot(div) {
        const plt = new Plot(this, div)
        return plt
    }

    /**
     * Slice series by index
     * @param {Array} row list of index to slice by
     * @returns Series
     */
    iloc(row) {
        let kwargs = {}
        kwargs["rows"] = row
        kwargs["type"] = "iloc"

        let [new_data, columns, rows] = indexLoc(this, kwargs);
        let sf = new Series(new_data, { columns: columns, index: rows });

        return sf
    }

    /**
     * Adds new values to the end of a Series
     * @param {Object} val Single value | Array | Series to append to the object
     * @param {Boolean} inplace Whether to perform operation inplace or not
     */
    append(val, inplace = false) {
        if (inplace) {
            let self = this
            if (Array.isArray(val)) {
                val.forEach((el, i) => {
                    self.data.push(el)
                    self.index_arr.push(i)
                })
            } else if (val instanceof Series) {
                let value = val.values
                let old_index = val.index
                value.forEach((el, i) => {
                    self.data.push(el)
                    self.index_arr.push(old_index[i])
                })
            } else {
                self.data.push(val)
                self.index_arr.push(0)
            }
        } else {
            let sf = this.copy()
            if (Array.isArray(val)) {
                val.forEach((el, i) => {
                    sf.data.push(el)
                    sf.index_arr.push(i)
                })
            } else if (val instanceof Series) {
                let value = val.values
                let old_index = val.index
                value.forEach((el, i) => {
                    sf.data.push(el)
                    sf.index_arr.push(old_index[i])
                })
            } else {
                sf.data.push(val)
                sf.index_arr.push(0)
            }
            return sf
        }

    }

}


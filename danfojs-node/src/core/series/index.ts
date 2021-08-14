/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/
import * as tf from '@tensorflow/tfjs-node';
import NDframe from "../../core/generic";
import { table } from "table";
import { variance, std, median, mode, mean, min, max, sum, round } from 'mathjs';
import { _iloc } from "../iloc";
import { _genericMathOp } from "../generic.math.ops";
import Utils from "../../shared/utils"
import ErrorThrower from "../../shared/errors"
import { ArrayType1D, ArrayType2D, BaseDataOptionType, NdframeInputDataType, SeriesInterface } from "../../shared/types";
import { performance } from 'perf_hooks';

const utils = new Utils();

/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param  Object   
 * 
 *  data:  1D Array, JSON, Tensor, Block of data.
 * 
 *  index: Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * 
 *  columnNames: Array of column names. If not specified, column names are auto generated.
 * 
 *  dtypes: Array of data types for each the column. If not specified, dtypes inferred.
 * 
 *  config: General configuration object for NDframe      
 *
 */
/* @ts-ignore */ //COMMENT OUR WHEN METHODS HAVE BEEN IMPLEMENTED
export default class Series extends NDframe implements SeriesInterface {

    constructor(data: any = [], options: BaseDataOptionType = {}) {
        let { index, columnNames, dtypes, config } = options;
        if (Array.isArray(data[0]) || utils.isObject(data[0])) {
            data = utils.convert2DArrayToSeriesArray(data);
            super({
                data,
                index,
                columnNames,
                dtypes,
                config,
                isSeries: true
            });
        } else {
            super({
                data,
                index,
                columnNames,
                dtypes,
                config,
                isSeries: true
            });
        }
    }

    /**
     * Purely integer-location based indexing for selection by position.
     * 
     * @param rows An array of input. iloc is integer position based (from 0 to length-1 of the axis).
     * 
     * Allowed inputs are:
     * 
     *    An integer, e.g. 5.
     * 
     *    A list or array of integers, e.g. [4, 3, 0]
     * 
     *    A slice object with ints, e.g. 1:7.
     * 
    */
    iloc(rows: Array<string | number>) {
        return _iloc({ ndFrame: this, rows })
    }

    /**
      * Returns the first n values in a Series
      * @param rows The number of rows to return
    */
    head(rows: number = 5): Series {
        return this.iloc([`0:${rows}`])
    }

    /**
      * Returns the last n values in a Series
      * @param rows The number of rows to return
    */
    tail(rows: number = 5): Series {
        const startIdx = this.shape[0] - rows
        return this.iloc([`${startIdx}:`])
    }

    /**
     * Returns specified number of random rows in a Series
     * @param num The number of rows to return
     * @param options (Optional) Object with the following options:
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
    */
    async sample(num = 5, options: { seed: number } = { seed: 1 }): Promise<Series> {
        let { seed } = options;

        if (num > this.shape[0]) {
            throw new Error("Sample size n cannot be bigger than size of dataset");
        }
        if (num < -1 || num == 0) {
            throw new Error("Sample size cannot be less than -1 or be equal to 0");
        }
        num = num === -1 ? this.shape[0] : num;

        const shuffledIndex = await tf.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
        const sf = this.iloc(shuffledIndex);
        return sf;
    }

    /**
      * Return Addition of series and other, element-wise (binary operator add).
      * Equivalent to series + other
      * @param other Series or Number to add
      */
    add(other: Series | number, options: { inplace: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("add")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "add" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
        }
    }

    /**
      * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
      * Equivalent to series - other
      * @param other Number to subtract
      */
    sub(other: Series | number, options: { inplace?: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("sub")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "sub" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
        }

    }

    /**
      * Return Multiplication of series and other, element-wise (binary operator mul).
      * Equivalent to series * other
      * @param other Number to multiply with.
    */
    mul(other: Series | number, options: { inplace?: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("mul")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "mul" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
        }
    }

    /**
      * Return division of series and other, element-wise (binary operator div).
      * Equivalent to series / other
      * @param other Series or number to divide with.
      */
    div(other: Series | number, options: { inplace?: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("div")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "div" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
        }
    }

    /**
      * Return Exponential power of series and other, element-wise (binary operator pow).
      * Equivalent to series ** other
      *  @param other Number to multiply with.
      */
    pow(other: Series | number, options: { inplace?: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("pow")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "pow" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
        }
    }

    /**
      * Return Modulo of series and other, element-wise (binary operator mod).
      * Equivalent to series % other
      *  @param other Number to modulo with
    */
    mod(other: Series | number, options: { inplace?: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("mod")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "mod" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
        }
    }

    /**
     * Checks if the array value passed has a compatible dtype, removes NaN values, and if 
     * boolean values are present, converts them to integer values.
     * */
    private _checkAndCleanValues(values: ArrayType1D, operation: string): number[] {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError(operation)
        values = utils.removeNansFromArray(values);

        if (this.dtypes[0] == "boolean") {
            values = (utils.mapBooleansToIntegers(values as boolean[], 1) as ArrayType1D);
        }
        return values as number[]
    }

    /**
     * Returns the mean of elements in Series
    */
    mean(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "mean")
        if (this.config.toUseTfjsMathFunctions) return tf.tensor(values).mean().arraySync() as number
        return (values.reduce((a, b) => a + b) / values.length) as number
    }


    /**
      * Returns the median of elements in Series
    */
    median(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "median")
        return median(values);
    }

    /**
      * Returns the modal value of elements in Series
    */
    mode(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "mode")
        return mode(values);
    }

    /**
      * Returns the minimum value in a Series
    */
    min(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "min")
        let smallestValue = values[0]
        for (let i = 0; i < values.length; i++) {
            smallestValue = smallestValue < values[i] ? smallestValue : values[i]
        }
        return smallestValue
    }

    /**
      * Returns the maximum value in a Series
      * @returns {Number}
    */
    max(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "max")
        let biggestValue = values[0]
        for (let i = 0; i < values.length; i++) {
            biggestValue = biggestValue > values[i] ? biggestValue : values[i]
        }
        return biggestValue
    }

    /**
      * Return the sum of the values in a series.
    */
    sum(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "sum")
        if (this.config.toUseTfjsMathFunctions) return tf.tensor(values).sum().arraySync() as number
        return values.reduce((sum, value) => sum + value, 0)
    }

    /**
       * Return number of non-null elements in a Series
    */
    count(): number {
        const values = utils.removeNansFromArray(this.values as ArrayType1D)
        return values.length
    }

    /**
      * Return maximum of series and other.
      * @param other Series or number to check against
    */
    maximum(other: Series | number): Series {
        if (typeof other === "number") {
            const maxResult = this.tensor.maximum(other as number);
            return new Series(maxResult.arraySync(), {
                columnNames: this.columnNames,
                dtypes: [maxResult.dtype],
                index: this.index
            });
        } else {
            utils.checkSeriesOpCompactibility({ firstSeries: this, secondSeries: other, operation: "maximum" })
            const tensor1 = this.tensor.asType(this.dtypes[0] as any);
            const tensor2 = other.tensor;
            const result = tensor1.maximum(tensor2).arraySync();
            return new Series(result,
                {
                    columnNames: this.columnNames,
                    index: this.index
                });

        }
    }

    /**
      * Return minimum of series and other.
      * @param other Series, Numbers to check against
    */
    minimum(other: Series | number): Series {
        if (typeof other === "number") {
            const maxResult = this.tensor.minimum(other as number);
            return new Series(maxResult.arraySync(), {
                columnNames: this.columnNames,
                dtypes: [maxResult.dtype],
                index: this.index
            });
        } else {
            utils.checkSeriesOpCompactibility({ firstSeries: this, secondSeries: other, operation: "maximum" })

            const tensor1 = this.tensor.asType(this.dtypes[0] as any);
            const tensor2 = other.tensor;
            const result = tensor1.minimum(tensor2).arraySync();
            return new Series(result,
                {
                    columnNames: this.columnNames,
                    index: this.index
                });
        }
    }

    /**
     * Round each value in a Series to the specified number of decimals.
     * @params args Object with the method arguments
     * @params args.dp Number of Decimal places to round to
     * @params args.inplace Boolean indicating whether to perform the operation inplace or not
    */
    round(dp = 1, options: { inplace: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        const values = utils.removeNansFromArray(this.values as ArrayType1D)
        const newValues = utils.round(values as number[], dp, true);

        if (inplace) {
            this.$setValues(newValues)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({
                ndFrame: this,
                newData: newValues,
                isSeries: true
            })
        }

    }

    /**
      * Return sample standard deviation of elements in Series
    */
    std(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "max")
        return std(values);
    }

    /**
      *  Return unbiased variance of elements in a Series.
    */
    var(): number {
        const values = this._checkAndCleanValues(this.values as ArrayType1D, "max")
        return variance(values);
    }

    /**
     * Return a boolean same-sized object indicating where elements are NaN.
     * NaN and undefined values gets mapped to true, and everything else gets mapped to false.
    */
    isNa(): Series {
        const newData = this.values.map((value) => {
            if (isNaN(value as unknown as number) && typeof value != "string") {
                return true;
            } else {
                return false;
            }
        })
        const sf = new Series(newData,
            {
                index: this.index,
                dtypes: ["boolean"],
                config: this.config
            });
        return sf;
    }

    /**
     * Replace all NaN with a specified value"
     * @params args Object with the method arguments
     * @params args.value The value to replace NaN with
     * @params args.inplace Boolean indicating whether to perform the operation inplace or not
    */
    fillNa(value: number | string | boolean, options: { inplace: boolean } = { inplace: false }): Series | void {
        const { inplace } = options

        if (!value) {
            throw Error('Value Error: Must specify value to replace with');
        }

        const newValues: ArrayType1D = [];
        (this.values as ArrayType1D).forEach((val) => {
            if (isNaN(val as unknown as number) && typeof val != "string") {
                newValues.push(value);
            } else {
                newValues.push(val);
            }
        });

        if (inplace) {
            this.$setValues(newValues)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({
                ndFrame: this,
                newData: newValues,
                isSeries: true
            })
        }
    }


    // /**
    //   * Sort a Series in ascending or descending order by some criterion.
    //   *  @param {kwargs} Object, {ascending (Bool): Whether to return sorted values in ascending order or not,
    //   *                           inplace (Bool): Whether to perform sorting on the original Series or not}
    //   * @returns {Series}
    //   */
    // sort_values(kwargs = {}) {
    //     let paramsNeeded = ["inplace", "ascending"];
    //     utils._throw_wrong_params_error(kwargs, paramsNeeded);

    //     if (!('ascending' in kwargs)) {
    //         kwargs['ascending'] = true;
    //     }

    //     if (!('inplace' in kwargs)) {
    //         kwargs['inplace'] = false;
    //     }

    //     let sorted_values = [];
    //     let arr_obj = [...this.values];
    //     let range_idx = utils.__range(0, this.index.length - 1);
    //     let sorted_idx = utils._sort_arr_with_index(range_idx, arr_obj, this.dtypes[0]);

    //     sorted_idx.forEach((idx) => {
    //         sorted_values.push(this.values[idx]);
    //     });

    //     if (kwargs['ascending']) {
    //         sorted_values = sorted_values.reverse();
    //         sorted_idx = sorted_idx.reverse();
    //     }

    //     if (kwargs['inplace']) {
    //         this.data = sorted_values;
    //         this.__set_index(sorted_idx);
    //     } else {
    //         let sf = new Series(sorted_values, { columns: this.column_names, index: sorted_idx });
    //         return sf;
    //     }
    // }


    /**
      * Makes a deep copy of a Series
    */
    copy(): Series {

        const sf = new Series([...this.values], {
            columnNames: [...this.columnNames],
            index: [...this.index],
            dtypes: [...this.dtypes],
            config: { ...this.config }
        });
        return sf;
    }


    // /**
    //   * Generate descriptive statistics.
    //   * Descriptive statistics include those that summarize the central tendency,
    //   * dispersion and shape of a dataset’s distribution, excluding NaN values.
    //   * @returns {Series}
    //   */
    // describe() {
    //     if (this.dtypes[0] == "string") {
    //         return null;
    //     } else {

    //         let index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'];
    //         let count = this.count();
    //         let mean = this.mean();
    //         let std = this.std();
    //         let min = this.min();
    //         let median = this.median();
    //         let max = this.max();
    //         let variance = this.var();

    //         let vals = [count, mean, std, min, median, max, variance];
    //         let sf = new Series(vals, { columns: this.columns, index: index });
    //         return sf;

    //     }


    // }


    // /**
    //   * Returns Series with the index reset.
    //   * This is useful when index is meaningless and needs to be reset to the default before another operation.
    //   * @param {kwargs} {inplace: Modify the Series in place (do not create a new object}
    //   */
    // reset_index(kwargs = {}) {
    //     let paramsNeeded = ["inplace"];
    //     utils._throw_wrong_params_error(kwargs, paramsNeeded);

    //     kwargs['inplace'] = kwargs['inplace'] || false;

    //     if (kwargs['inplace']) {
    //         this.__reset_index();
    //     } else {
    //         let sf = this.copy();
    //         sf.__reset_index();
    //         return sf;
    //     }
    // }

    // /**
    //   * Returns Series with the specified index.
    //   * Set the Series index (row labels) using an array of the same length.
    //   * @param {kwargs} {index: Array of new index values,
    //   *                  inplace: If operation should happen inplace
    //   *                   }
    //   */
    // set_index(kwargs = {}) {

    //     let paramsNeeded = ["index", "inplace"];
    //     utils._throw_wrong_params_error(kwargs, paramsNeeded);


    //     kwargs['inplace'] = kwargs['inplace'] || false;

    //     if (!('index' in kwargs)) {
    //         throw Error("Index ValueError: You must specify an array of index");
    //     }

    //     if (kwargs['index'].length != this.index.length) {
    //         throw Error(`Index LengthError: Lenght of new Index array ${kwargs['index'].length} must match lenght of existing index ${this.index.length}`);
    //     }

    //     if (kwargs['inplace']) {
    //         this.index_arr = kwargs['index'];
    //     } else {
    //         let sf = this.copy();
    //         sf.__set_index(kwargs['index']);
    //         return sf;
    //     }
    // }


    // /**
    //    * map all the element in a column to a variable or function
    //    * @param{callable} callable can either be a funtion or an object
    //    * @return {Array}
    //    */
    // map(callable) {
    //     let is_callable = utils.__is_function(callable);

    //     let data = this.data.map((val) => {
    //         if (is_callable) {
    //             return callable(val);
    //         } else {
    //             if (utils.__is_object(callable)) {

    //                 if (val in callable) {
    //                     return callable[val];
    //                 } else {
    //                     return NaN;
    //                 }
    //             } else {
    //                 throw new Error("callable must either be a function or an object");
    //             }
    //         }
    //     });
    //     let sf = new Series(data, {
    //         columns: this.column_names,
    //         index: this.index
    //     });
    //     return sf;
    // }

    // /**
    //    * Applies a function to each element of a Series
    //    * @param {Function} Function to apply to each element of the series
    //    * @return {Array}
    //    */
    // apply(callable) {
    //     let is_callable = utils.__is_function(callable);

    //     if (!is_callable) {
    //         throw new Error("the arguement most be a function");
    //     }

    //     let data = this.data.map((val) => {
    //         return callable(val);
    //     });
    //     return new Series(data, { columns: this.column_names, index: this.index });
    // }

    // /**
    //    * Returns the unique value(s) in a Series
    //    * @return {Series}
    //    */
    // unique() {

    //     let data_set = new Set(this.values);
    //     let series = new Series(Array.from(data_set));

    //     return series;

    // }

    // /**
    //    * Return the number of unique value in a series
    //    * @return {int}
    //    */
    // nunique() {
    //     return this.unique().values.length;
    // }

    // /**
    //    * Returns unique values and their counts in a Series
    //    * @return {Series}
    //    */
    // value_counts() {

    //     let s_data = this.values;
    //     let data_dict = {};

    //     for (let i = 0; i < s_data.length; i++) {
    //         let val = s_data[i];

    //         if (val in data_dict) {
    //             data_dict[val] += 1;
    //         } else {
    //             data_dict[val] = 1;
    //         }
    //     }

    //     let index = Object.keys(data_dict).map((x) => {
    //         return parseInt(x) ? parseInt(x) : x;
    //     });
    //     let data = Object.values(data_dict);

    //     let series = new Series(data, { index: index });
    //     return series;

    // }

    // /**
    //    * Returns the absolute values in Series
    //    * @return {series}
    //    */
    // abs() {
    //     let abs_data = this.row_data_tensor.abs().arraySync();
    //     return new Series(utils.__round(abs_data, 2, true));
    // }


    // /**
    //    * Returns the cumulative sum over a Series
    //   * @return {Series}
    //   */
    // cumsum() {
    //     let data = this.__cum_ops("sum");
    //     return data;
    // }

    // /**
    //    * Returns cumulative minimum over a Series
    //    * @returns series
    //    */
    // cummin() {
    //     let data = this.__cum_ops("min");
    //     return data;
    // }

    // /**
    //    * Returns cumulative maximum over a Series
    //    * @returns series
    //    */
    // cummax() {
    //     let data = this.__cum_ops("max");
    //     return data;
    // }

    // /**
    //    * Returns cumulative product over a Series
    //    * @returns series
    //    */
    // cumprod() {
    //     let data = this.__cum_ops("prod");
    //     return data;
    // }


    // /**
    //    * Returns Less than of series and other. Supports element wise operations
    //    * @param {other} Series, Scalar
    //    * @return {Series}
    //    */
    // lt(other) {
    //     return this.__bool_ops(other, "lt");
    // }

    // /**
    //    * Returns Greater than of series and other. Supports element wise operations
    //    * @param {other} Series, Scalar
    //    * @return {Series}
    //    */
    // gt(other) {
    //     return this.__bool_ops(other, "gt");
    // }

    // /**
    //    * Returns Less than or Equal to of series and other. Supports element wise operations
    //    * @param {other} Series, Scalar
    //    * @return {Series}
    //    */
    // le(other) {
    //     return this.__bool_ops(other, "le");
    // }

    // /**
    //    * Returns Greater than or Equal to of series and other. Supports element wise operations
    //    * @param {other} Series, Scalar
    //    * @return {Series}
    //    */
    // ge(other) {
    //     return this.__bool_ops(other, "ge");
    // }

    // /**
    //     * Returns Not Equal to of series and other. Supports element wise operations
    //     * @param {other} Series, Scalar
    //     * @return {Series}
    //     */
    // ne(other) {
    //     return this.__bool_ops(other, "ne");
    // }


    // /**
    //    * Returns Equal to of series and other. Supports element wise operations
    //    * @param {other} Series, Scalar
    //    * @return {Series}
    //    */
    // eq(other) {
    //     return this.__bool_ops(other, "eq");
    // }

    // /**
    //   * Replace all occurence of a value with a new value"
    //   * @param {kwargs}, {"replace": the value you want to replace,
    //   *                   "with": the new value you want to replace the olde value with,
    //   *                   inplace: Perform operation inplace or not}
    //   * @return {Series}
    //   */
    // replace(kwargs = {}) {
    //     let paramsNeeded = ["replace", "with", "inplace"];
    //     utils._throw_wrong_params_error(kwargs, paramsNeeded);

    //     kwargs['inplace'] = kwargs['inplace'] || false;

    //     if (!("replace" in kwargs)) {
    //         throw Error("Params Error: Must specify param 'replace'");
    //     }

    //     if (!("with" in kwargs)) {
    //         throw Error("Params Error: Must specify param 'with'");
    //     }

    //     let replaced_arr = [];
    //     let old_arr = this.values;

    //     old_arr.forEach((val) => {
    //         if (val == kwargs['replace']) {
    //             replaced_arr.push(kwargs['with']);
    //         } else {
    //             replaced_arr.push(val);
    //         }
    //     });

    //     if (kwargs['inplace']) {
    //         this.data = replaced_arr;
    //     } else {
    //         let sf = new Series(replaced_arr, {
    //             index: this.index,
    //             columns: this.columns,
    //             dtypes: this.dtypes
    //         });
    //         return sf;
    //     }

    // }


    // /**
    //    * Return a new Series with missing values (NaN) removed.
    //    * @param {kwargs} {inplace: Perform operation inplace or not}
    //    * @return {Series}
    //    */
    // dropna(kwargs = {}) {
    //     let paramsNeeded = ["inplace"];
    //     utils._throw_wrong_params_error(kwargs, paramsNeeded);

    //     kwargs['inplace'] = kwargs['inplace'] || false;

    //     let old_values = this.values;
    //     let old_index = this.index;
    //     let newValues = [];
    //     let new_index = [];
    //     let isna_vals = this.isna().values;

    //     isna_vals.forEach((val, i) => {
    //         if (!val) {
    //             newValues.push(old_values[i]);
    //             new_index.push(old_index[i]);
    //         }
    //     });
    //     if (kwargs['inplace']) {
    //         this.index_arr = new_index;
    //         this.data = newValues;
    //     } else {
    //         let sf = new Series(newValues, {
    //             columns: this.column_names,
    //             index: new_index,
    //             dtypes: this.dtypes
    //         });
    //         return sf;
    //     }

    // }

    // /**
    //  * Return the integer indices that would sort the Series.
    //  * @param {ascending} boolean true: will sort the Series in ascending order, false: will sort in descending order
    //  * @return {Series}
    //  */
    // argsort(ascending = true) {
    //     let sorted_index = this.sort_values({ ascending: ascending }).index;
    //     let sf = new Series(sorted_index);
    //     return sf;
    // }

    // /**
    //    * Return int position of the largest value in the Series.
    //    * @return {Number}
    //    */
    // argmax() {
    //     return this.row_data_tensor.argMax().arraySync();
    // }


    // /**
    //    * Return int position of the smallest value in the Series.
    //    * @param {ascending} boolean true: will sort the Series in ascending order, false: will sort in descending order
    //    * @return {Series}
    //    */
    // argmin() {
    //     return this.row_data_tensor.argMin().arraySync();

    // }

    /**
     * Prints NDframe to console as a grid of row and columns.
    */
    toString(): string {
        const maxRow = this.$config.getMaxRow;
        let indx: (string | number)[]
        let values = []

        if (this.shape[0] > maxRow) {
            //slice rows to show [max_rows] rows
            const sfSlice = this.iloc([`0:${maxRow}`]);

            indx = sfSlice.index
            values = sfSlice.values;

        } else {
            indx = this.index
            values = this.values;
        }

        const tabledata = values.map((x, i) => [indx[i], x])
        return table(tabledata as any);
    }


}
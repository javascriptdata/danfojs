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
import NDframe from "./generic";
import { table } from "table";
import { variance, std, median, mode, max } from 'mathjs';
import { _iloc, _loc } from "./indexing";
import { _genericMathOp } from "./generic.math.ops";
import Utils from "../shared/utils"
import ErrorThrower from "../shared/errors"
import { ArrayType1D, BaseDataOptionType, SeriesInterface } from "../shared/types";
import { DATA_TYPES } from '../shared/defaults'
import Str from './strings';
import Dt from './datetime';

const utils = new Utils();

/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columnNames Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.  
 */
export default class Series extends NDframe implements SeriesInterface {

    constructor(data: any = [], options: BaseDataOptionType = {}) {
        const { index, columnNames, dtypes, config } = options;
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
    * ``.iloc`` is primarily integer position based (from ``0`` to
    * ``length-1`` of the axis), but may also be used with a boolean array.
    * 
    * @param rows Array of row indexes
    *  
    * Allowed inputs are in rows and columns params are:
    * 
    * - An array of single integer, e.g. ``[5]``.
    * - A list or array of integers, e.g. ``[4, 3, 0]``.
    * - A slice array string with ints, e.g. ``["1:7"]``.
    * - A boolean array.
    * - A ``callable`` function with one argument (the calling Series or
    * DataFrame) and that returns valid output for indexing (one of the above).
    * This is useful in method chains, when you don't have a reference to the
    * calling object, but would like to base your selection on some value.
    * 
    * ``.iloc`` will raise ``IndexError`` if a requested indexer is
    * out-of-bounds.
    */
    iloc(rows: Array<string | number | boolean>) {
        return _iloc({ ndFrame: this, rows }) as Series
    }

    /**
     * Access a group of rows by label(s) or a boolean array.
     * ``loc`` is primarily label based, but may also be used with a boolean array.
     * 
     * @param rows Array of row indexes
     * 
     * Allowed inputs are:
     * 
     * - A single label, e.g. ``["5"]`` or ``['a']``, (note that ``5`` is interpreted as a 
     *   *label* of the index, and **never** as an integer position along the index).
     * 
     * - A list or array of labels, e.g. ``['a', 'b', 'c']``.
     * 
     * - A slice object with labels, e.g. ``["a:f"]``. Note that start and the stop are included
     * 
     * - A boolean array of the same length as the axis being sliced,
     * e.g. ``[True, False, True]``.
     * 
     * - A ``callable`` function with one argument (the calling Series or
     * DataFrame) and that returns valid output for indexing (one of the above)
    */
    loc(rows: Array<string | number | boolean>) {
        return _loc({ ndFrame: this, rows }) as Series
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
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
    */
    async sample(num = 5, options?: { seed?: number }): Promise<Series> {
        const { seed } = { seed: 1, ...options }

        if (num > this.shape[0]) {
            throw new Error("Sample size n cannot be bigger than size of dataset");
        }
        if (num < -1 || num == 0) {
            throw new Error("Sample size cannot be less than -1 or be equal to 0");
        }
        num = num === -1 ? this.shape[0] : num;

        const shuffledIndex = await this.$tf.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
        const sf = this.iloc(shuffledIndex);
        return sf;
    }

    /**
      * Return Addition of series and other, element-wise (binary operator add).
      * Equivalent to series + other
      * @param other Series, Array of same length or scalar number to add
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    add(other: Series | Array<number> | number, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("add")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "add" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true }) as Series
        }
    }

    /**
      * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
      * Equivalent to series - other
      * @param other Number to subtract
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    sub(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("sub")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "sub" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true }) as Series
        }

    }

    /**
      * Return Multiplication of series and other, element-wise (binary operator mul).
      * Equivalent to series * other
      * @param other Number to multiply with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    mul(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("mul")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "mul" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true }) as Series
        }
    }

    /**
      * Return division of series and other, element-wise (binary operator div).
      * Equivalent to series / other
      * @param other Series or number to divide with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    div(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("div")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "div" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true }) as Series
        }
    }

    /**
      * Return Exponential power of series and other, element-wise (binary operator pow).
      * Equivalent to series ** other
      * @param other Number to multiply with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
    pow(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("pow")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "pow" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true }) as Series
        }
    }

    /**
      * Return Modulo of series and other, element-wise (binary operator mod).
      * Equivalent to series % other
      * @param other Number to modulo with
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    mod(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("mod")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "mod" })

        if (inplace) {
            this.$setValues(newData as ArrayType1D)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true }) as Series
        }
    }

    /**
     * Checks if the array value passed has a compatible dtype, removes NaN values, and if 
     * boolean values are present, converts them to integer values.
     * */
    private $checkAndCleanValues(values: ArrayType1D, operation: string): number[] {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError(operation)
        values = utils.removeMissingValuesFromArray(values);

        if (this.dtypes[0] == "boolean") {
            values = (utils.mapBooleansToIntegers(values as boolean[], 1) as ArrayType1D);
        }
        return values as number[]
    }

    /**
     * Returns the mean of elements in Series
    */
    mean(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "mean")
        return (values.reduce((a, b) => a + b) / values.length) as number
    }


    /**
      * Returns the median of elements in Series
    */
    median(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "median")
        return median(values);
    }

    /**
      * Returns the modal value of elements in Series
    */
    mode(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "mode")
        return mode(values);
    }

    /**
      * Returns the minimum value in a Series
    */
    min(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "min")
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
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "max")
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
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "sum")
        return values.reduce((sum, value) => sum + value, 0)
    }

    /**
       * Return number of non-null elements in a Series
    */
    count(): number {
        const values = utils.removeMissingValuesFromArray(this.values as ArrayType1D)
        return values.length
    }

    /**
      * Return maximum of series and other.
      * @param other Series or number to check against
    */
    maximum(other: Series | number | Array<number>): Series {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("maximum")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "maximum" })
        return new Series(newData, {
            columnNames: this.columnNames,
            index: this.index
        });
    }

    /**
      * Return minimum of series and other.
      * @param other Series, Numbers to check against
    */
    minimum(other: Series | number | Array<number>): Series {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("maximum")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "minimum" })
        return new Series(newData, {
            columnNames: this.columnNames,
            index: this.index
        });
    }

    /**
     * Round each value in a Series to the specified number of decimals.
     * @param dp Number of Decimal places to round to
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    round(dp = 1, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        const newValues = utils.round(this.values as number[], dp, true);

        if (inplace) {
            this.$setValues(newValues)
        } else {
            return utils.createNdframeFromNewDataWithOldProps({
                ndFrame: this,
                newData: newValues,
                isSeries: true
            }) as Series
        }

    }

    /**
      * Return sample standard deviation of elements in Series
    */
    std(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "max")
        return std(values);
    }

    /**
      *  Return unbiased variance of elements in a Series.
    */
    var(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "max")
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
     * Replace all NaN with a specified value
     * @param value The value to replace NaN with
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    fillNa(value: number | string | boolean, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!value && typeof value !== 'boolean') {
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
            }) as Series
        }
    }


    /**
      * Sort a Series in ascending or descending order by some criterion.
      * @param options Method options
      * @param ascending Whether to return sorted values in ascending order or not. Defaults to true
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    sortValues(ascending = true, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        let sortedValues = [];
        const rangeIdx = utils.range(0, this.index.length - 1);
        let sortedIdx = utils.sortArrayByIndex(rangeIdx, this.values, this.dtypes[0]);

        for (let indx of sortedIdx) {
            sortedValues.push(this.values[indx])
        }

        if (ascending) {
            sortedValues = sortedValues.reverse();
            sortedIdx = sortedIdx.reverse();
        }

        if (inplace) {
            this.$setValues(sortedValues as ArrayType1D)
            this.$setIndex(sortedIdx);
        } else {
            const sf = new Series(sortedValues, {
                index: sortedIdx,
                dtypes: this.dtypes,
                config: this.config
            });
            return sf;

        }
    }


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


    /**
      * Generate descriptive statistics.
      * Descriptive statistics include those that summarize the central tendency,
      * dispersion and shape of a dataset’s distribution, excluding NaN values.
    */
    describe(): Series {
        if (this.dtypes[0] == "string") {
            throw new Error("DType Error: Cannot generate descriptive statistics for Series with string dtype")
        } else {

            const index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'];
            const count = this.count();
            const mean = this.mean();
            const std = this.std();
            const min = this.min();
            const median = this.median();
            const max = this.max();
            const variance = this.var();

            const data = [count, mean, std, min, median, max, variance];
            const sf = new Series(data, { index: index });
            return sf;

        }
    }


    /**
      * Returns Series with the index reset.
      * This is useful when index is meaningless and needs to be reset to the default before another operation.
      */
    resetIndex(options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (inplace) {
            this.$resetIndex();
        } else {
            const sf = this.copy();
            sf.$resetIndex();
            return sf;
        }
    }

    /**
      * Set the Series index (row labels) using an array of the same length.
      * @param index Array of new index values,
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    setIndex(index: Array<number | string | (number | string)>, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!index) {
            throw Error('Param Error: Must specify index array');
        }

        if (inplace) {
            this.$setIndex(index)
        } else {
            const sf = this.copy();
            sf.$setIndex(index)
            return sf;
        }
    }


    /**
       * map all the element in a column to a variable or function
       * @param callable callable can either be a funtion or an object
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    map(callable: any, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        const isCallable = utils.isFunction(callable);

        const data = this.values.map((val: any) => {
            if (isCallable) {
                return callable(val);
            } else if (utils.isObject(callable)) {
                if (val in callable) {
                    return callable[val];
                } else {
                    return NaN;
                }
            } else {
                throw new Error("Param Error: callable must either be a function or an object");
            }
        });

        if (inplace) {
            this.$setValues(data)
        } else {
            const sf = this.copy();
            sf.$setValues(data)
            return sf;
        }
    }

    /**
       * Applies a function to each element of a Series
       * @param callable Function to apply to each element of the series
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    apply(callable: any, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        const isCallable = utils.isFunction(callable);
        if (!isCallable) {
            throw new Error("Param Error: callable must be a function");
        }

        const data = this.values.map((val) => {
            return callable(val);
        });

        if (inplace) {
            this.$setValues(data)
        } else {
            const sf = this.copy();
            sf.$setValues(data)
            return sf;
        }
    }

    /**
     * Returns a Series with only the unique value(s) in the original Series
    */
    unique(): Series {
        const newValues = new Set(this.values as ArrayType1D);
        let series = new Series(Array.from(newValues));
        return series;
    }

    /**
       * Return the number of unique elements in a Series
    */
    nUnique(): number {
        return this.unique().values.length;
    }

    /**
     * Returns unique values and their counts in a Series
    */
    valueCounts(): Series {
        const sData = this.values;
        const dataDict: any = {};
        for (let i = 0; i < sData.length; i++) {
            const val = sData[i];
            if (`${val}` in dataDict) {
                dataDict[`${val}`] = dataDict[`${val}`] + 1;
            } else {
                dataDict[`${val}`] = 1;
            }
        }

        const index = Object.keys(dataDict).map((x) => {
            return parseInt(x) ? parseInt(x) : x;
        });
        const data = Object.values(dataDict);

        const series = new Series(data, { index: index });
        return series;

    }

    /**
      * Returns the absolute values in Series
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    abs(options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("abs")
        let newValues;


        newValues = this.values.map(val => Math.abs(val as number));

        if (inplace) {
            this.$setValues(newValues as ArrayType1D)
        } else {
            const sf = this.copy();
            sf.$setValues(newValues as ArrayType1D)
            return sf;
        }
    }

    /**
      * Returns the cumulative sum over a Series
    */
    cumSum(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("sum", ops);
    }

    /**
       * Returns cumulative minimum over a Series
    */
    cumMin(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("min", ops);
    }


    /**
       * Returns cumulative maximum over a Series
    */
    cumMax(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("max", ops);
    }

    /**
       * Returns cumulative product over a Series
    */
    cumProd(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("prod", ops);
    }

    /**
     * perform cumulative operation on series data
    */
    private cumOps(ops: string, options: { inplace: boolean }): Series | void {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError(ops)
        const { inplace } = options;

        const sData = this.values;
        let tempval = sData[0];
        const data = [tempval];

        for (let i = 1; i < sData.length; i++) {
            let currVal = sData[i];
            switch (ops) {
                case "max":
                    if (currVal > tempval) {
                        data.push(currVal);
                        tempval = currVal;
                    } else {
                        data.push(tempval);
                    }
                    break;
                case "min":
                    if (currVal < tempval) {
                        data.push(currVal);
                        tempval = currVal;
                    } else {
                        data.push(tempval);
                    }
                    break;
                case "sum":
                    tempval = (tempval as number) + (currVal as number)
                    data.push(tempval);
                    break;
                case "prod":
                    tempval = (tempval as number) * (currVal as number)
                    data.push(tempval);
                    break;

            }
        }

        if (inplace) {
            this.$setValues(data as ArrayType1D)
        } else {
            const sf = this.copy();
            sf.$setValues(data as ArrayType1D)
            return sf;
        }
    }


    /**
       * Returns less than of series and other. Supports element wise operations
       * @param other Series or number to compare against
    */
    lt(other: Series | number): Series {
        return this.boolOps(other, "lt");
    }

    /**
       * Returns Greater than of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    gt(other: Series | number | Array<number>): Series {
        return this.boolOps(other, "gt");
    }

    /**
       * Returns Less than or Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    le(other: Series | number | Array<number>): Series {
        return this.boolOps(other, "le");
    }

    /**
       * Returns Greater than or Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    ge(other: Series | number | Array<number>): Series {
        return this.boolOps(other, "ge");
    }

    /**
        * Returns Not Equal to of series and other. Supports element wise operations
        * @param {other} Series, Scalar
        * @return {Series}
        */
    ne(other: Series | number | Array<number>): Series {
        return this.boolOps(other, "ne");
    }

    /**
       * Returns Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
    eq(other: Series | number | Array<number>): Series {
        return this.boolOps(other, "eq");
    }

    /**
     * Perform boolean operations on bool values
     * @param other Other Series or number to compare with
     * @param bOps Name of operation to perform [ne, ge, le, gt, lt, eq]
     */
    private boolOps(other: Series | number | Array<number>, bOps: string) {
        const data = [];
        const lSeries = this.values;
        let rSeries;

        if (typeof other == "number") {
            rSeries = Array(this.values.length).fill(other); //create array of repeated value for broadcasting
        } else if (other instanceof Series) {
            rSeries = other.values;
        } else if (Array.isArray(other)) {
            rSeries = other;
        } else {
            throw new Error("ParamError: value for other not supported. It must be either a scalar, Array or Series");
        }

        if (!(lSeries.length === rSeries.length)) {
            throw new Error("LengthError: Lenght of other must be equal to length of Series");
        }


        for (let i = 0; i < lSeries.length; i++) {
            let lVal = lSeries[i];
            let rVal = rSeries[i];
            let bool = null;
            switch (bOps) {
                case "lt":
                    bool = lVal < rVal ? true : false;
                    data.push(bool);
                    break;
                case "gt":
                    bool = lVal > rVal ? true : false;
                    data.push(bool);
                    break;
                case "le":
                    bool = lVal <= rVal ? true : false;
                    data.push(bool);
                    break;
                case "ge":
                    bool = lVal >= rVal ? true : false;
                    data.push(bool);
                    break;
                case "ne":
                    bool = lVal != rVal ? true : false;
                    data.push(bool);
                    break;
                case "eq":
                    bool = lVal === rVal ? true : false;
                    data.push(bool);
                    break;
            }
        }
        return new Series(data);

    }

    /**
      * Replace all occurence of a value with a new value
      * @param oldValue The value you want to replace
      * @param newValue The new value you want to replace the old value with
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    replace(
        oldValue: string | number | boolean,
        newValue: string | number | boolean,
        options?: { inplace?: boolean }
    ): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!oldValue && typeof oldValue !== 'boolean') {
            throw Error(`Params Error: Must specify param 'oldValue' to replace`);
        }

        if (!newValue && typeof oldValue !== 'boolean') {
            throw Error(`Params Error: Must specify param 'newValue' to replace with`);
        }

        const newArr: any = [];
        const oldArr = [...this.values]

        oldArr.forEach((val) => {
            if (val === oldValue) {
                newArr.push(newValue);
            } else {
                newArr.push(val);
            }
        });

        if (inplace) {
            this.$setValues(newArr)
        } else {
            const sf = this.copy();
            sf.$setValues(newArr)
            return sf;
        }

    }

    /**
     * Drops all missing values (NaN) from a Series.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    dropNa(options?: { inplace?: boolean }) {
        const { inplace } = { inplace: false, ...options }

        const oldValues = this.values;
        const oldIndex = this.index;
        const newValues: ArrayType1D = [];
        const newIndex: Array<string | number> = [];
        const isNaVals = this.isNa().values;

        isNaVals.forEach((val, i) => {
            if (!val) {
                newValues.push((oldValues as ArrayType1D)[i]);
                newIndex.push(oldIndex[i])
            }
        });

        if (inplace) {
            this.$setValues(newValues, false)
            this.$setIndex(newIndex)
        } else {
            const sf = this.copy();
            sf.$setValues(newValues, false)
            sf.$setIndex(newIndex)
            return sf;
        }

    }

    /**
     * Return the integer indices that would sort the Series.
     * @param ascending boolean true: will sort the Series in ascending order, false: will sort in descending order
     */
    argSort(ascending = true): Series {
        const sortedIndex = this.sortValues(ascending);
        const sf = new Series(sortedIndex?.index);
        return sf;
    }

    /**
       * Return int position of the largest value in the Series.
    */
    argMax(): number {
        return this.tensor.argMax().arraySync() as number
    }


    /**
       * Return int position of the smallest value in the Series.
    */
    argMin(): number {
        return this.tensor.argMin().arraySync() as number
    }

    /**
     * Remove duplicate values from a Series
     * @param keep "first" | "last", which dupliate value to keep
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    dropDuplicates(keep: "first" | "last" = "first", options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!(["first", "last"].includes(keep))) {
            throw Error(`Params Error: Keep must be one of 'first' or 'last'`);
        }

        let dataArr: ArrayType1D
        let newArr: ArrayType1D = [];
        let oldIndex: Array<string | number>
        let newIndex: Array<string | number> = [];

        if (keep === "last") {
            dataArr = (this.values as ArrayType1D).reverse();
            oldIndex = this.index.reverse();
        } else {
            dataArr = (this.values as ArrayType1D)
            oldIndex = this.index;
        }

        dataArr.forEach((val, i) => {
            if (!newArr.includes(val)) {
                newIndex.push(oldIndex[i]);
                newArr.push(val);
            }
        });

        if (keep === "last") {
            //re-reversed the array and index to its true order
            newArr = newArr.reverse();
            newIndex = newIndex.reverse();
        }

        if (inplace) {
            this.$setValues(newArr, false)
            this.$setIndex(newIndex)
        } else {
            const sf = this.copy();
            sf.$setValues(newArr, false)
            sf.$setIndex(newIndex)
            return sf;
        }

    }

    /**
     * Cast Series to specified data type
     * @param dtype Data type to cast to. One of [float32, int32, string, boolean, undefined]
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
    asType(dtype: "float32" | "int32" | "string" | "boolean" | "undefined", options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!dtype) {
            throw Error("Param Error: Please specify dtype to cast to");
        }

        if (!(DATA_TYPES.includes(dtype))) {
            throw Error(`dtype ${dtype} not supported. dtype must be one of ${DATA_TYPES}`);
        }

        const oldValues = this.values;
        const newValues: ArrayType1D = [];

        switch (dtype) {
            case "float32":
                oldValues.forEach((val) => {
                    newValues.push(Number(val));
                });
                break;
            case "int32":
                oldValues.forEach((val) => {
                    newValues.push(Number(Number(val).toFixed()));
                });
                break;
            case "string":
                oldValues.forEach((val) => {
                    newValues.push(String(val));
                });
                break;
            case "boolean":
                oldValues.forEach((val) => {
                    newValues.push(Boolean(val));
                });
                break;
            case "undefined":
                oldValues.forEach((_) => {
                    newValues.push(NaN);
                });
                break;
            default:
                break;
        }

        if (inplace) {
            this.$setValues(newValues, false)
            this.$setDtypes([dtype])
        } else {
            const sf = this.copy();
            sf.$setValues(newValues, false)
            sf.$setDtypes([dtype])
            return sf;
        }

    }

    /**
     * Add a new value or values to the end of a Series
     * @param newValues Single value | Array | Series to append to the Series 
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
    append(
        newValue: Series | Array<number | string | boolean> | number | string | boolean,
        index: Array<number | string> | number | string,
        options?: { inplace?: boolean }
    ): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!newValue && typeof newValue !== "boolean") {
            throw Error("Param Error: newValues cannot be null or undefined");
        }

        if (!index) {
            throw Error("Param Error: index cannot be null or undefined");
        }

        const newData = [...this.values]
        const newIndx = [...this.index]

        if (Array.isArray(newValue) && Array.isArray(index)) {

            if (newValue.length !== index.length) {
                throw Error("Param Error: Length of new values and index must be the same");
            }

            newValue.forEach((el, i) => {
                newData.push(el);
                newIndx.push(index[i]);
            });

        } else if (newValue instanceof Series) {
            const _value = newValue.values;

            if (!Array.isArray(index)) {
                throw Error("Param Error: index must be an array");
            }

            if (index.length !== _value.length) {
                throw Error("Param Error: Length of new values and index must be the same");
            }

            _value.forEach((el, i) => {
                newData.push(el);
                newIndx.push(index[i]);
            });
        } else {
            newData.push(newValue);
            newIndx.push(index as string | number);
        }

        if (inplace) {
            this.$setValues(newData as ArrayType1D, false)
            this.$setIndex(newIndx)
        } else {
            const sf = new Series(
                newData,
                {
                    index: newIndx,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

            return sf
        }
    }

    /**
     * Returns dtype of Series
    */
    get dtype(): string {
        return this.dtypes[0];
    }

    /**
     * Exposes numerous string methods to manipulate Series of type string
    */
    get str() {
        if (this.dtypes[0] == "string") {
            return new Str(this);
        } else {
            throw new Error("Cannot call accessor str on non-string type");
        }
    }

    /**
      * Returns time class that exposes different date time method
    */
    get dt() {
        if (this.dtypes[0] == "string") {
            return new Dt(this);
        } else {
            throw new Error("Cannot call accessor dt on non-string type");
        }
    }

    /**
     * Prints Series to console as a grid of row and columns.
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
/**
*  @license
* Copyright 2022 JsData. All rights reserved.
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
import dummyEncode from "../transformers/encoders/dummy.encoder";
import { variance, std, median, mode } from 'mathjs';
import tensorflow from '../shared/tensorflowlib'
import { DATA_TYPES } from '../shared/defaults'
import { _genericMathOp } from "./math.ops";
import ErrorThrower from "../shared/errors"
import { _iloc, _loc } from "./indexing";
import { PlotlyLib } from "../plotting";
import Utils from "../shared/utils"
import NDframe from "./generic";
import { table } from "table";
import Str from './strings';
import Dt from './datetime';
import DataFrame from "./frame";
import {
    ArrayType1D,
    BaseDataOptionType,
    SeriesInterface,
    CsvOutputOptionsBrowser,
    ExcelOutputOptionsBrowser,
    JsonOutputOptionsBrowser,
    CsvOutputOptionsNode,
    ExcelOutputOptionsNode,
    JsonOutputOptionsNode,
    mapParam
} from "../shared/types";

const utils = new Utils();


/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values – they need not be the same length.
 * @param data 1D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string index for subseting array. If not specified, indices are auto generated.
 * @param options.columns Column name. This is like the name of the Series. If not specified, column name is set to 0.
 * @param options.dtypes Data types of the Series data. If not specified, dtypes is inferred.
 * @param options.config General configuration object for extending or setting Series behavior.      
 */
export default class Series extends NDframe implements SeriesInterface {

    constructor(data: any = [], options: BaseDataOptionType = {}) {
        const { index, columns, dtypes, config } = options;
        if (Array.isArray(data[0]) || utils.isObject(data[0])) {
            data = utils.convert2DArrayToSeriesArray(data);
            super({
                data,
                index,
                columns,
                dtypes,
                config,
                isSeries: true
            });
        } else {
            super({
                data,
                index,
                columns,
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
    * 
    * @example
    * ```
    * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
    * const sf2 = sf.iloc([0, 2, 4]);
    * sf2.print();
    * ```
    */
    iloc(rows: Array<string | number | boolean>): Series {
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
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
     * const sf2 = sf.loc(['a', 'c', 'e']);
     * sf2.print();
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
     * const sf2 = sf.loc(sf.gt(2));
     * sf2.print();
     * ```
    */
    loc(rows: Array<string | number | boolean>): Series {
        return _loc({ ndFrame: this, rows }) as Series
    }

    /**
      * Returns the first n values in a Series
      * @param rows The number of rows to return
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.head(3);
      * sf2.print();
      * ```
    */
    head(rows: number = 5): Series {
        if (rows <= 0) {
            throw new Error("ParamError: Number of rows cannot be less than 1")
        }
        if (this.shape[0] <= rows) {
            return this.copy()
        }
        if (this.shape[0] - rows < 0) {
            throw new Error("ParamError: Number of rows cannot be greater than available rows in data")
        }
        return this.iloc([`0:${rows}`])
    }

    /**
      * Returns the last n values in a Series
      * @param rows The number of rows to return
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.tail(3);
      * sf2.print();
      * ```
    */
    tail(rows: number = 5): Series {
        if (rows <= 0) {
            throw new Error("ParamError: Number of rows cannot be less than 1")
        }
        if (this.shape[0] <= rows) {
            return this.copy()
        }
        if (this.shape[0] - rows < 0) {
            throw new Error("ParamError: Number of rows cannot be greater than available rows in data")
        }
        
        const startIdx = this.shape[0] - rows
        return this.iloc([`${startIdx}:`])
    }

    /**
     * Returns specified number of random rows in a Series
     * @param num The number of rows to return
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * const df2 = await df.sample(2)
     * df2.print()
     * ```
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * const df2 = await df.sample(1, { seed: 1 })
     * df2.print()
     * ```   
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

        const shuffledIndex = await tensorflow.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
        const sf = this.iloc(shuffledIndex);
        return sf;
    }

    /**
      * Return Addition of series and other, element-wise (binary operator add).
      * Equivalent to series + other
      * @param other Series, Array of same length or scalar number to add
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.add(2);
      * console.log(sf2.values);
      * //output [3, 4, 5, 6, 7, 8]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.add([2, 3, 4, 5, 6, 7]);
      * console.log(sf2.values);
      * //output [3, 5, 7, 9, 11, 13]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * sf.add(2, { inplace: true });
      * console.log(sf.values);
      * //output [3, 4, 5, 6, 7, 8]
      * ```
      */
    add(other: Series | Array<number> | number, options?: { inplace?: boolean }): Series
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.sub(2);
      * console.log(sf2.values);
      * //output [-1, 0, 1, 2, 3, 4]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.sub([2, 3, 4, 5, 6, 7]);
      * console.log(sf2.values);
      * //output [-1, -1, -1, -1, -1, -1]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * sf.sub(2, { inplace: true });
      * console.log(sf.values);
      * //output [-1, 0, 1, 2, 3, 4]
      * ```
      */
    sub(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.mul(2);
      * console.log(sf2.values);
      * //output [2, 4, 6, 8, 10, 12]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.mul([2, 3, 4, 5, 6, 7]);
      * console.log(sf2.values);
      * //output [2, 6, 12, 20, 30, 42]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * sf.mul(2, { inplace: true });
      * console.log(sf.values);
      * //output [2, 4, 6, 8, 10, 12]
      * ```
    */
    mul(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.div(2);
      * console.log(sf2.values);
      * //output [0.5, 1, 1.5, 2, 2.5, 3]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.div([2, 3, 4, 5, 6, 7]);
      * console.log(sf2.values);
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * sf.div(2, { inplace: true });
      * console.log(sf.values);
      * //output [0.5, 1, 1.5, 2, 2.5, 3]
      * ```  
    */
    div(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series
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
      * @param other Number to raise to power.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.pow(2);
      * console.log(sf2.values);
      * //output [1, 4, 9, 16, 25, 36]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.pow(new Series([2, 3, 4, 5, 6, 7]));
      * console.log(sf2.values);
      * //output [ 1, 8, 81, 1024, 15625, 279936 ]
      * ```
      * 
    */
    pow(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.mod(2);
      * console.log(sf2.values);
      * //output [1, 0, 1, 0, 1, 0]
      * ```
    */
    mod(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series
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
    */
    private $checkAndCleanValues(values: ArrayType1D, operation: string): number[] {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError(operation)
        values = utils.removeMissingValuesFromArray(values);

        if (this.dtypes[0] == "boolean") {
            values = (utils.mapBooleansToIntegers(values as boolean[], 1) as ArrayType1D);
        }
        return values as number[]
    }

    /**
     * Returns the mean of elements in Series.
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6]);
     * console.log(sf.mean());
     * //output 3.5
     * ```
    */
    mean(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "mean")
        return (values.reduce((a, b) => a + b) / values.length) as number
    }


    /**
      * Returns the median of elements in Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.median());
      * //output 3.5
      * ```
    */
    median(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "median")
        return median(values);
    }

    /**
      * Returns the modal value of elements in Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 4, 5, 6]);
      * console.log(sf.mode());
      * //output [ 4 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 4, 5, 5, 6]);
      * console.log(sf.mode());
      * //output [ 4, 5 ]
      * ```
      * 
    */
    mode() {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "mode")
        return mode(values);
    }

    /**
      * Returns the minimum value in a Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.min());
      * //output 1
      * ```
      * 
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.max());
      * //output 6
      * ```
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.sum());
      * //output 21
      * ```
    */
    sum(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "sum")
        return values.reduce((sum, value) => sum + value, 0)
    }

    /**
       * Return number of non-null elements in a Series
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * console.log(sf.count());
       * //output 6
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6, NaN]);
       * console.log(sf.count());
       * //output 6
       * ```
    */
    count(): number {
        const values = utils.removeMissingValuesFromArray(this.values as ArrayType1D)
        return values.length
    }

    /**
      * Return maximum of series and other.
      * @param other Series, number or Array of numbers to check against
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.maximum(3);
      * console.log(sf2.values);
      * //output [ 3, 3, 3, 4, 5, 6 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = new Series([4, 1, 3, 40, 5, 3]);
      * const sf3 = sf.maximum(sf2);
      * console.log(sf3.values);
      * //output [ 4, 2, 3, 40, 5, 6 ]
      * ```
    */
    maximum(other: Series | number | Array<number>): Series {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("maximum")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "maximum" })
        return new Series(newData, {
            columns: this.columns,
            index: this.index
        });
    }

    /**
      * Return minimum of series and other.
      * @param other Series, number of Array of numbers to check against
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.minimum(3);
      * console.log(sf2.values);
      * //output [ 1, 2, 3, 3, 3, 3 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = new Series([4, 1, 3, 40, 5, 3]);
      * const sf3 = sf.minimum(sf2);
      * console.log(sf3.values);
      * //output [ 1, 1, 3, 4, 5, 3 ]
      * ```
      * 
    */
    minimum(other: Series | number | Array<number>): Series {
        if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("maximum")

        const newData = _genericMathOp({ ndFrame: this, other, operation: "minimum" })
        return new Series(newData, {
            columns: this.columns,
            index: this.index
        });
    }

    /**
     * Round each value in a Series to the specified number of decimals.
     * @param dp Number of Decimal places to round to
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * 
     * @example
     * ```
     * const sf = new Series([1.23, 2.4, 3.123, 4.1234, 5.12345]);
     * const sf2 = sf.round(2);
     * console.log(sf2.values);
     * //output [ 1.23, 2.4, 3.12, 4.12, 5.12 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1.23, 2.4, 3.123, 4.1234, 5.12345]);
     * sf.round(2, { inplace: true });
     * console.log(sf.values);
     * //output [ 1.23, 2.4, 3.12, 4.12, 5.12 ]
     * ```
    */
    round(dp?: number, options?: { inplace?: boolean }): Series
    round(dp = 1, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }
        if (dp === undefined) dp = 1;
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.std());
      * //output 1.8708286933869707
      * ```
    */
    std(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "max")
        return std(values);
    }

    /**
      *  Return unbiased variance of elements in a Series.
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.var());
      * //output 3.5
      * ```
    */
    var(): number {
        const values = this.$checkAndCleanValues(this.values as ArrayType1D, "max")
        return variance(values);
    }

    /**
     * Return a boolean same-sized object indicating where elements are NaN.
     * NaN and undefined values gets mapped to true, and everything else gets mapped to false.
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, NaN, 6]);
     * console.log(sf.isNaN());
     * //output [ false, false, false, false, true, false ]
     * ```
     * 
    */
    isNa(): Series {
        const newData = this.values.map((value) => {

            if (utils.isEmpty(value)) {
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
     * Replace all missing values with a specified value
     * @param value The value to replace NaN with
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, NaN, 6]);
     * const sf2 = sf.fillNa(-99);
     * console.log(sf2.values);
     * //output [ 1, 2, 3, 4, -99, 6 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, NaN, 6]);
     * sf.fillNa(-99, { inplace: true });
     * console.log(sf.values);
     * //output [ 1, 2, 3, 4, -99, 6 ]
     * ```
    */
    fillNa(value: number | string | boolean, options?: { inplace?: boolean }): Series
    fillNa(value: number | string | boolean, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!value && typeof value !== "boolean" && typeof value !== "number") {
            throw Error('ParamError: value must be specified');
        }

        const newValues: ArrayType1D = [];
        (this.values as ArrayType1D).forEach((val) => {
            if (utils.isEmpty(val)) {
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
      * @example
      * ```
      * const sf = new Series([2, 1, 3, 4, 6, 5]);
      * const sf2 = sf.sortValues();
      * console.log(sf2.values);
      * //output [ 1, 2, 3, 4, 5, 6 ]
      * ```
    */
    sortValues(options?: { ascending?: boolean, inplace?: boolean }): Series
    sortValues(options?: { ascending?: boolean, inplace?: boolean }): Series | void {
        const { ascending, inplace, } = { ascending: true, inplace: false, ...options }

        let sortedValues = [];
        let sortedIndex = []
        const rangeIdx = utils.range(0, this.index.length - 1);
        let sortedIdx = utils.sortArrayByIndex(rangeIdx, this.values, this.dtypes[0]);

        for (let indx of sortedIdx) {
            sortedValues.push(this.values[indx])
            sortedIndex.push(this.index[indx])
        }

        if (ascending) {
            sortedValues = sortedValues.reverse();
            sortedIndex = sortedIndex.reverse();
        }

        if (inplace) {
            this.$setValues(sortedValues as ArrayType1D)
            this.$setIndex(sortedIndex);
        } else {
            const sf = new Series(sortedValues, {
                index: sortedIndex,
                dtypes: this.dtypes,
                config: this.config
            });
            return sf;

        }
    }


    /**
      * Makes a deep copy of a Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.copy();
      * ```
      * 
    */
    copy(): Series {
        const sf = new Series([...this.values], {
            columns: [...this.columns],
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.describe();
      * sf2.print();
      * ```
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
      * Resets the index of the Series to default values.
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.resetIndex();
      * console.log(sf2.index);
      * //output [ 0, 1, 2, 3, 4, 5 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * sf.resetIndex({ inplace: true });
      * console.log(sf.index);
      * //output [ 0, 1, 2, 3, 4, 5 ]
      * ```
      */
    resetIndex(options?: { inplace?: boolean }): Series
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
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
      * const sf2 = sf.setIndex(['g', 'h', 'i', 'j', 'k', 'l']);
      * console.log(sf2.index);
      * //output [ 'g', 'h', 'i', 'j', 'k', 'l' ]
      * ```
    */
    setIndex(index: Array<number | string | (number | string)>, options?: { inplace?: boolean }): Series
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
       * map all the element in a Series to a function or object.
       * @param callable callable can either be a funtion or an object. If function, then each value and the corresponding index is passed.
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.map((x) => x * 2);
       * console.log(sf2.values);
       * //output [ 2, 4, 6, 8, 10, 12 ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.map({
       *   1: -99,
       *   3: -99
       * });
       * console.log(sf2.values);
       * //output [ -99, 2, -99, 4, -99, 6 ]
       * ```
    */
    map(callable: mapParam, options?: { inplace?: boolean }): Series
    map(callable: mapParam, options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        const isCallable = utils.isFunction(callable);

        const data = (this.values as ArrayType1D).map((val: any, i: number) => {
            if (isCallable) {
                return (callable as Function)(val, i);
            } else if (utils.isObject(callable)) {
                if (val in callable) {
                    //@ts-ignore
                    return callable[val];
                } else {
                    return val
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
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.apply((x) => x * 2);
       * console.log(sf2.values);
       * //output [ 2, 4, 6, 8, 10, 12 ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * sf.apply((x) => x * 2, { inplace: true });
       * console.log(sf.values);
       * //output [ 2, 4, 6, 8, 10, 12 ]
       * ```
       * 
     */
    apply(callable: (value: any) => any, options?: { inplace?: boolean }): Series
    apply(callable: (value: any) => any, options?: { inplace?: boolean }): Series | void {
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
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
     * const sf2 = sf.unique();
     * console.log(sf2.values);
     * //output [ 1, 2, 3, 4, 5, 6 ]
     * ```
    */
    unique(): Series {
        const newValues = new Set(this.values as ArrayType1D);
        let series = new Series(Array.from(newValues));
        return series;
    }

    /**
     * Return the number of unique elements in a Series
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
     * console.log(sf.nUnique());
     * //output 6
     * ```
     * 
    */
    nUnique(): number {
        return (new Set(this.values as ArrayType1D)).size;
    }

    /**
     * Returns unique values and their counts in a Series
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
     * const sf2 = sf.valueCounts();
     * sf2.print();
     * ```
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
      * Returns the absolute of values in Series
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      * @example
      * ```
      * const sf = new Series([1, -2, 3, -4, 5, -6]);
      * const sf2 = sf.abs();
      * console.log(sf2.values);
      * //output [ 1, 2, 3, 4, 5, 6 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, -2, 3, -4, 5, -6]);
      * sf.abs({ inplace: true });
      * console.log(sf.values);
      * //output [ 1, 2, 3, 4, 5, 6 ]
      * ```
    */
    abs(options?: { inplace?: boolean }): Series
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
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.cumsum();
      * console.log(sf2.values);
      * //output [ 1, 3, 6, 10, 15, 21 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * sf.cumSum({ inplace: true });
      * console.log(sf.values);
      * //output [ 1, 3, 6, 10, 15, 21 ]
      * ```
    */
    cumSum(options?: { inplace?: boolean }): Series
    cumSum(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("sum", ops);
    }

    /**
     * Returns cumulative minimum over a Series
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6]);
     * const sf2 = sf.cumMin();
     * console.log(sf2.values);
     * //output [ 1, 1, 1, 1, 1, 1 ]
     * ```
     * 
    */
    cumMin(options?: { inplace?: boolean }): Series
    cumMin(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("min", ops);
    }


    /**
       * Returns cumulative maximum over a Series
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.cumMax();
       * console.log(sf2.values);
       * //output [ 1, 2, 3, 4, 5, 6 ]
       * ```
    */
    cumMax(options?: { inplace?: boolean }): Series
    cumMax(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("max", ops);
    }

    /**
       * Returns cumulative product over a Series
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.cumProd();
       * console.log(sf2.values);
       * //output [ 1, 2, 6, 24, 120, 720 ]
       * ```
    */
    cumProd(options?: { inplace?: boolean }): Series
    cumProd(options?: { inplace?: boolean }): Series | void {
        const ops = { inplace: false, ...options }
        return this.cumOps("prod", ops);
    }

    /**
     * Internal helper function to calculate cumulative operations on series data
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
            return new Series(data, {
                index: this.index,
                config: { ...this.config }
            });
        }
    }


    /**
       * Returns less than of series and other. Supports element wise operations
       * @param other Series, number, or Array of numbers to compare against
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.lt(3);
       * console.log(sf2.values);
       * //output [ true, true, false, false, false, false ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.lt([3, 4, 5, 6, 7, 8]);
       * console.log(sf2.values);
       * //output [ true, true, false, false, false, false ]
       * ```
    */
    lt(other: Series | number | Array<number> | boolean[]): Series {
        return this.boolOps(other, "lt");
    }

    /**
       * Returns Greater than of series and other. Supports element wise operations
       * @param other Series, number or Array of numbers to compare against
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.gt(3);
       * console.log(sf2.values);
       * //output [ false, false, true, true, true, true ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.gt([3, 4, 5, 6, 7, 8]);
       * console.log(sf2.values);
       * //output [ false, false, true, true, true, true ]
       * ```
    */
    gt(other: Series | number | Array<number> | boolean[]): Series {
        return this.boolOps(other, "gt");
    }

    /**
       * Returns Less than or Equal to of series and other. Supports element wise operations
       * @param other Series, number or Array of numbers to compare against
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.le(3);
       * console.log(sf2.values);
       * //output [ true, true, true, true, false, false ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.le([3, 4, 5, 6, 7, 8]);
       * console.log(sf2.values);
       * //output [ true, true, true, true, false, false ]
       * ```
       * 
    */
    le(other: Series | number | Array<number> | boolean[]): Series {
        return this.boolOps(other, "le");
    }

    /**
       * Returns Greater than or Equal to of series and other. Supports element wise operations
       * @param other Series, number or Array of numbers to compare against
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.ge(3);
       * console.log(sf2.values);
       * //output [ false, false, true, true, true, true ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.ge([3, 4, 5, 6, 7, 8]);
       * console.log(sf2.values);
       * //output [ false, false, true, true, true, true ]
       * ```
       */
    ge(other: Series | number | Array<number> | boolean[]): Series {
        return this.boolOps(other, "ge");
    }

    /**
        * Returns Not Equal to of series and other. Supports element wise operations
        * @param other Series, number or Array of numbers to compare against
        * @example
        * ```
        * const sf = new Series([1, 2, 3, 4, 5, 6]);
        * const sf2 = sf.ne(3);
        * console.log(sf2.values);
        * //output [ true, true, false, true, true, true ]
        * ```
        * 
        * @example
        * ```
        * const sf = new Series([1, 2, 3, 4, 5, 6]);
        * const sf2 = sf.ne([3, 2, 5, 6, 7, 8]);
        * console.log(sf2.values);
        * //output [ true, false, true, true, true, true ]
        * ```
        * 
    */
    ne(other: Series | number | Array<number> | boolean[]): Series {
        return this.boolOps(other, "ne");
    }

    /**
       * Returns Equal to of series and other. Supports element wise operations
       * @param other Series, number or Array of numbers to compare against
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.eq(3);
       * console.log(sf2.values);
       * //output [ false, false, true, false, false, false ]
       * ```
       * 
       * @example
       * ```
       * const sf = new Series([1, 2, 3, 4, 5, 6]);
       * const sf2 = sf.eq(new Series([3, 2, 5, 6, 7, 8]));
       * console.log(sf2.values);
       * //output [ false, true, false, false, false, false ]
       * ```
       */
    eq(other: Series | number | Array<number> | boolean[]): Series {
        return this.boolOps(other, "eq");
    }

    /**
     * Internal function to perform boolean operations
     * @param other Other Series or number to compare with
     * @param bOps Name of operation to perform [ne, ge, le, gt, lt, eq]
     */
    private boolOps(other: Series | number | Array<number> | boolean[], bOps: string) {
        const data = [];
        const lSeries = this.values;
        let rSeries;

        if (typeof other == "number") {
            rSeries = Array(this.values.length).fill(other); //create array of repeated value for broadcasting
        } else if (typeof other == "string" && ["eq", "ne"].includes(bOps)) {
            rSeries = Array(this.values.length).fill(other);
        } else if (other instanceof Series) {
            rSeries = other.values;
        } else if (Array.isArray(other)) {
            rSeries = other;
        } else {
            throw new Error("ParamError: value for other not supported. It must be either a scalar, Array or Series");
        }

        if (!(lSeries.length === rSeries.length)) {
            throw new Error("LengthError: length of other must be equal to length of Series");
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
                    bool = lVal !== rVal ? true : false;
                    data.push(bool);
                    break;
                case "eq":
                    bool = lVal === rVal ? true : false;
                    data.push(bool);
                    break;
            }
        }
        return new Series(data, {
            index: this.index,
            config: { ...this.config }
        });
    }

    /**
      * Replace all occurence of a value with a new value
      * @param oldValue The value you want to replace
      * @param newValue The new value you want to replace the old value with
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.replace(3, 10);
      * console.log(sf2.values);
      * //output [ 1, 2, 10, 4, 5, 6 ]
      * ```
      * 
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * sf.replace(3, 10, { inplace: true });
      * console.log(sf.values);
      * //output [ 1, 2, 10, 4, 5, 6 ]
      * ```
    */
    replace(
        oldValue: string | number | boolean,
        newValue: string | number | boolean,
        options?: { inplace?: boolean }
    ): Series
    replace(
        oldValue: string | number | boolean,
        newValue: string | number | boolean,
        options?: { inplace?: boolean }
    ): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!oldValue && typeof oldValue !== 'boolean') {
            throw Error(`Params Error: Must specify param 'oldValue' to replace`);
        }

        if (!newValue && typeof newValue !== 'boolean') {
            throw Error(`Params Error: Must specify param 'newValue' to replace with`);
        }

        const newArr = [...this.values].map((val) => {
            if (val === oldValue) {
                return newValue
            } else {
                return val
            }
        });

        if (inplace) {
            this.$setValues(newArr as ArrayType1D)
        } else {
            const sf = this.copy();
            sf.$setValues(newArr as ArrayType1D)
            return sf;
        }

    }

    /**
     * Drops all missing values (NaN, null, undefined) from a Series.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, NaN, 4, 5, NaN]);
     * const sf2 = sf.dropNa();
     * console.log(sf2.values);
     * //output [ 1, 2, 4, 5 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, NaN, 4, 5, null]);
     * sf.dropNa({ inplace: true });
     * console.log(sf.values);
     * //output [ 1, 2, 4, 5 ]
     * ```
    */
    dropNa(options?: { inplace?: boolean }): Series
    dropNa(options?: { inplace?: boolean }): Series | void {
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
     * Returns the integer indices that would sort the Series.
     * @param ascending Boolean indicating whether to sort in ascending order or not. Defaults to true
     * @example
     * ```
     * const sf = new Series([3, 1, 2]);
     * const sf2 = sf.argSort();
     * console.log(sf2.values);
     * //output [ 1, 2, 0 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([3, 1, 2]);
     * const sf2 = sf.argSort({ascending: false});
     * console.log(sf2.values);
     * //output [ 0, 2, 1 ]
     * 
     */
    argSort(options?: { ascending: boolean }): Series {
        const { ascending } = { ascending: true, ...options }
        const sortedIndex = this.sortValues({ ascending });
        const sf = new Series(sortedIndex.index);
        return sf;
    }

    /**
       * Returns integer position of the largest value in the Series.
       * @example
       * ```
       * const sf = new Series([3, 1, 2]);
       * const sf2 = sf.argMax();
       * console.log(sf2);
       * //output 0
       * ```
       * 
    */
    argMax(): number {
        return this.tensor.argMax().arraySync() as number
    }


    /**
       * Returns integer position of the smallest value in the Series.
       * @example
       * ```
       * const sf = new Series([3, 1, 2]);
       * const sf2 = sf.argMin();
       * console.log(sf2);
       * //output 1
       * ```
       * 
    */
    argMin(): number {
        return this.tensor.argMin().arraySync() as number
    }

    /**
     * Remove duplicate values from a Series
     * @param keep "first" | "last", which dupliate value to keep. Defaults to "first".
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * const sf2 = sf.dropDuplicates();
     * console.log(sf2.values);
     * //output [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * sf.dropDuplicates({ keep: "last", inplace: true });
     * console.log(sf.values);
     * //output [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
     * ```
     * 
    */
    dropDuplicates(options?: { keep?: "first" | "last", inplace?: boolean }): Series
    dropDuplicates(options?: { keep?: "first" | "last", inplace?: boolean }): Series | void {
        const { keep, inplace } = { keep: "first", inplace: false, ...options }

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
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * const sf2 = sf.asType("float32");
     * console.log(sf2.dtype);
     * //output "float32"
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * sf.asType("float32", {inplace: true});
     * console.log(sf.dtype);
     * //output "float32"
     * ```
     */
    asType(dtype: "float32" | "int32" | "string" | "boolean" | "undefined", options?: { inplace?: boolean }): Series
    asType(dtype: "float32" | "int32" | "string" | "boolean" | "undefined", options?: { inplace?: boolean }): Series | void {
        const { inplace } = { inplace: false, ...options }

        if (!dtype) {
            throw Error("Param Error: Please specify dtype to cast to");
        }

        if (!(DATA_TYPES.includes(dtype))) {
            throw Error(`dtype ${dtype} not supported. dtype must be one of ${DATA_TYPES}`);
        }

        const oldValues = [...this.values];
        const newValues: ArrayType1D = [];

        switch (dtype) {
            case "float32":
                oldValues.forEach((val) => {
                    newValues.push(Number(val));
                });
                break;
            case "int32":
                oldValues.forEach((val) => {
                    newValues.push(parseInt(val as any));
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
     * Appends a new value or values to the end of the Series
     * @param newValue Single value | Array | Series to append to the Series 
     * @param index The new index value(s) to append to the Series. Must contain the same number of values as `newValues`
     * as they map `1 - 1`. 
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * sf.append(11);
     * console.log(sf.values);
     * //output [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * sf.append([11, 12, 13]);
     * console.log(sf.values);
     * //output [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * sf.append(new Series([11, 12, 13]), { inplace: true});
     * console.log(sf.values);
     * //output [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
     * ```
     */
    append(
        newValue: string | number | boolean | Series | ArrayType1D,
        index: Array<number | string> | number | string,
        options?: { inplace?: boolean }
    ): Series
    append(
        newValue: string | number | boolean | Series | ArrayType1D,
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
                    columns: this.columns,
                    dtypes: this.dtypes,
                    config: this.config
                })

            return sf
        }
    }

    /**
     * Returns dtype of Series
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * console.log(sf.dtype);
     * //output "int32"
     * ```
    */
    get dtype(): string {
        return this.dtypes[0];
    }

    /**
     * Exposes numerous string methods to manipulate Series of string dtype
     * @example
     * ```
     * const sf = new Series(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
     * const sfs = sf.str.join("HelloWorld", "");
     * console.log(sfs.values);
     * //output ["aHelloWorld", "bHelloWorld", "cHelloWorld", "dHelloWorld", "eHelloWorld", "fHelloWorld", "gHelloWorld", "hHelloWorld", "iHelloWorld", "jHelloWorld"]
     * ```
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
      * @example
      * ```
      * const sf = new Series([
      *  "2020-01-01",
      *  "2020-01-02",
      *  "2020-01-03",
      *  "2020-01-04",
      *  "2020-01-05",
      * ]);
      * const sfd = sf.dt.dayOfWeekName();
      * console.log(sfd.values);
      * //output [ 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
      * ```
    */
    get dt() {
        if (this.dtypes[0] == "string") {
            return new Dt(this)
        } else {
            throw new Error("Cannot call accessor dt on non-string type");
        }
    }

    /**
     * Overrides default toString implementation. This essentially makes `print()` works. 
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

    /**
     * Returns the logical AND between Series and other. Supports element wise operations and broadcasting. 
     * @param other Series, Scalar, Array of Scalars
     * @example
     * ```
     * const sf = new Series([true, true, false, false, true]);
     * const sf2 = new Series([true, false, true, false, true]);
     * const sf3 = sf.and(sf2);
     * console.log(sf3.values);
     * //output [ true, false, false, false, false ]
     * ```
    */
    and(other: any): Series {

        if (other === undefined) {
            throw new Error("Param Error: other cannot be undefined");
        }
        const newValues: ArrayType1D = [];

        if (other instanceof Series) {
            if (this.dtypes[0] !== other.dtypes[0]) {
                throw new Error("Param Error: Series must be of same dtype");
            }

            if (this.shape[0] !== other.shape[0]) {
                throw new Error("Param Error: Series must be of same shape");
            }

            this.values.forEach((val, i) => {
                newValues.push(Boolean(val) && Boolean(other.values[i]));
            });

        } else if (typeof other === "boolean") {

            this.values.forEach((val) => {
                newValues.push(Boolean(val) && Boolean(other));
            });

        } else if (Array.isArray(other)) {

            this.values.forEach((val, i) => {
                newValues.push(Boolean(val) && Boolean(other[i]));
            });

        } else {
            throw new Error("Param Error: other must be a Series, Scalar, or Array of Scalars");
        }
        return new Series(newValues, {
            index: this.index,
            config: { ...this.config }
        });
    }

    /**
     * Returns the logical OR between Series and other. Supports element wise operations and broadcasting. 
     * @param other Series, Scalar, Array of Scalars
     * @example
     * ```
     * const sf = new Series([true, true, false, false, true]);
     * const sf2 = new Series([true, false, true, false, true]);
     * const sf3 = sf.or(sf2);
     * console.log(sf3.values);
     * //output [ true, true, true, false, true ]
     * ```
     * 
    */
    or(other: any): Series {

        if (other === undefined) {
            throw new Error("Param Error: other cannot be undefined");
        }
        const newValues: ArrayType1D = [];

        if (other instanceof Series) {
            if (this.dtypes[0] !== other.dtypes[0]) {
                throw new Error("Param Error: Series must be of same dtype");
            }

            if (this.shape[0] !== other.shape[0]) {
                throw new Error("Param Error: Series must be of same shape");
            }

            this.values.forEach((val, i) => {
                newValues.push(Boolean(val) || Boolean(other.values[i]));
            });

        } else if (typeof other === "boolean") {

            this.values.forEach((val) => {
                newValues.push(Boolean(val) || Boolean(other));
            });

        } else if (Array.isArray(other)) {

            this.values.forEach((val, i) => {
                newValues.push(Boolean(val) || Boolean(other[i]));
            });

        } else {
            throw new Error("Param Error: other must be a Series, Scalar, or Array of Scalars");
        }

        return new Series(newValues, {
            index: this.index,
            config: { ...this.config }
        });
    }

    /**
     * One-hot encode values in the Series.
     * @param options Options for the operation. The following options are available:
     * - `prefix`: Prefix to add to the new column. Defaults to unique labels.
     * - `prefixSeparator`: Separator to use for the prefix. Defaults to '_'.
     * @example
     * ```
     * const sf = new Series(["a", "b", "c", "a"]);
     * const sf2 = sf.getDummies({ prefix: "category" });
     * console.log(sf2.values);
     * //output [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ], [ 1, 0, 0 ] ]
     * ```
     * 
     * @example
     * ```
     * const sf = new Series(["a", "b", "c", "a"]);
     * const sf2 = sf.getDummies({ prefix: "category", prefixSeparator: "-" });
     * console.log(sf2.values);
     * //output [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ], [ 1, 0, 0 ] ]
     * ```
     */
    getDummies(options?: {
        columns?: string | Array<string>,
        prefix?: string | Array<string>,
        prefixSeparator?: string,
    }): DataFrame {
        return dummyEncode(this, options)
    }


    /**
     * Exposes functions for creating charts from a Series. 
     * Charts are created using the Plotly.js library, so all Plotly's configuration parameters are available.
     * @param divId name of the HTML Div to render the chart in.
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5]);
     * sf.plot("myDiv").line() //renders the chart in the div with id "myDiv"
     * ```
    */
    plot(divId: string) {
        //TODO: Add support for check plot library to use
        // So we can support other plot library like d3, vega, etc
        if (utils.isBrowserEnv()) {
            const plt = new PlotlyLib(this, divId);
            return plt;
        } else {
            throw new Error("Not supported in NodeJS");
        }
    }

    /**
     * Access a single value for a row index.
     * Similar to iloc, in that both provide index-based lookups. 
     * Use iat if you only need to get or set a single value in a Series.
     * @param row Row index of the value to access.
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5])
     * sf.iat(0) //returns 1
     * sf.iat(1) //returns 2
     * sf.iat(2) //returns 3
     * ```
    */
    iat(row: number): number | string | boolean | undefined {
        if (typeof row === 'string') {
            throw new Error('ParamError: row index must be an integer. Use .at to get a row by label.')
        }
        return (this.values as ArrayType1D)[row];
    }

    /**
     * Access a single value for a row label.
     * Similar to loc, in that both provide label-based lookups.
     * Use at if you only need to get or set a single value in a Series.
     * @param row Row label of the value to access.
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['A', 'B', 'C', 'D', 'E', 'F'] })
     * sf.at('A') //returns 1
     * sf.at('B') //returns 2
     * sf.at('C') //returns 3
     * ```
    */
    at(row: string): number | string | boolean | undefined {
        if (typeof row !== 'string') {
            throw new Error('ParamError: row index must be a string. Use .iat to get a row by index.')
        }
        return (this.values as ArrayType1D)[this.index.indexOf(row)];
    }
}
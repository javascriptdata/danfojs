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
import { ArrayType1D, BaseDataOptionType, SeriesInterface } from "../shared/types";
import NDframe from "./generic";
import Str from './strings';
import Dt from './datetime';
import { DataFrame } from "./frame";
/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.
 */
export default class Series extends NDframe implements SeriesInterface {
   constructor(data?: any, options?: BaseDataOptionType);
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
   iloc(rows: Array<string | number | boolean>): Series;
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
   loc(rows: Array<string | number | boolean>): Series;
   /**
     * Returns the first n values in a Series
     * @param rows The number of rows to return
   */
   head(rows?: number): Series;
   /**
     * Returns the last n values in a Series
     * @param rows The number of rows to return
   */
   tail(rows?: number): Series;
   /**
    * Returns specified number of random rows in a Series
    * @param num The number of rows to return
    * @param options.seed An integer specifying the random seed that will be used to create the distribution.
   */
   sample(num?: number, options?: {
      seed?: number;
   }): Promise<Series>;
   /**
     * Return Addition of series and other, element-wise (binary operator add).
     * Equivalent to series + other
     * @param other Series, Array of same length or scalar number to add
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
   add(other: Series | Array<number> | number, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
     * Equivalent to series - other
     * @param other Number to subtract
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
   sub(other: Series | number | Array<number>, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Return Multiplication of series and other, element-wise (binary operator mul).
     * Equivalent to series * other
     * @param other Number to multiply with.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   mul(other: Series | number | Array<number>, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Return division of series and other, element-wise (binary operator div).
     * Equivalent to series / other
     * @param other Series or number to divide with.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
   div(other: Series | number | Array<number>, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Return Exponential power of series and other, element-wise (binary operator pow).
     * Equivalent to series ** other
     * @param other Number to multiply with.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
   pow(other: Series | number | Array<number>, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Return Modulo of series and other, element-wise (binary operator mod).
     * Equivalent to series % other
     * @param other Number to modulo with
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   mod(other: Series | number | Array<number>, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
    * Checks if the array value passed has a compatible dtype, removes NaN values, and if
    * boolean values are present, converts them to integer values.
    * */
   private $checkAndCleanValues;
   /**
    * Returns the mean of elements in Series
   */
   mean(): number;
   /**
     * Returns the median of elements in Series
   */
   median(): number;
   /**
     * Returns the modal value of elements in Series
   */
   mode(): any;
   /**
     * Returns the minimum value in a Series
   */
   min(): number;
   /**
     * Returns the maximum value in a Series
     * @returns {Number}
   */
   max(): number;
   /**
     * Return the sum of the values in a series.
   */
   sum(): number;
   /**
      * Return number of non-null elements in a Series
   */
   count(): number;
   /**
     * Return maximum of series and other.
     * @param other Series or number to check against
   */
   maximum(other: Series | number | Array<number>): Series;
   /**
     * Return minimum of series and other.
     * @param other Series, Numbers to check against
   */
   minimum(other: Series | number | Array<number>): Series;
   /**
    * Round each value in a Series to the specified number of decimals.
    * @param dp Number of Decimal places to round to
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   round(dp?: number, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Return sample standard deviation of elements in Series
   */
   std(): number;
   /**
     *  Return unbiased variance of elements in a Series.
   */
   var(): number;
   /**
    * Return a boolean same-sized object indicating where elements are NaN.
    * NaN and undefined values gets mapped to true, and everything else gets mapped to false.
   */
   isna(): Series;
   /**
    * Replace all NaN with a specified value
    * @param value The value to replace NaN with
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   fillna(options?: {
      value: number | string | boolean,
      inplace?: boolean;
   }): Series | void;
   /**
     * Sort a Series in ascending or descending order by some criterion.
     * @param options Method options
     * @param ascending Whether to return sorted values in ascending order or not. Defaults to true
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   sort_values(options?: {
      ascending?: boolean,
      inplace?: boolean;
   }): Series | void;
   /**
     * Makes a deep copy of a Series
   */
   copy(): Series;
   /**
     * Generate descriptive statistics.
     * Descriptive statistics include those that summarize the central tendency,
     * dispersion and shape of a dataset’s distribution, excluding NaN values.
   */
   describe(): Series;
   /**
     * Returns Series with the index reset.
     * This is useful when index is meaningless and needs to be reset to the default before another operation.
     */
   reset_index(options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Set the Series index (row labels) using an array of the same length.
     * @param index Array of new index values,
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   set_index(options?: {
      index: Array<number | string | (number | string)>,
      inplace?: boolean;
   }): Series | void;
   /**
      * map all the element in a column to a variable or function
      * @param callable callable can either be a funtion or an object
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   map(callable: any, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
      * Applies a function to each element of a Series
      * @param callable Function to apply to each element of the series
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   apply(callable: any, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
    * Returns a Series with only the unique value(s) in the original Series
   */
   unique(): Series;
   /**
      * Return the number of unique elements in a Series
   */
   nunique(): number;
   /**
    * Returns unique values and their counts in a Series
   */
   value_counts(): Series;
   /**
     * Returns the absolute values in Series
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   abs(options?: {
      inplace?: boolean;
   }): Series | void;
   /**
     * Returns the cumulative sum over a Series
   */
   cumsum(options?: {
      inplace?: boolean;
   }): Series | void;
   /**
      * Returns cumulative minimum over a Series
   */
   cummin(options?: {
      inplace?: boolean;
   }): Series | void;
   /**
      * Returns cumulative maximum over a Series
   */
   cummax(options?: {
      inplace?: boolean;
   }): Series | void;
   /**
      * Returns cumulative product over a Series
   */
   cumprod(options?: {
      inplace?: boolean;
   }): Series | void;
   /**
    * perform cumulative operation on series data
   */
   private cumOps;
   /**
      * Returns less than of series and other. Supports element wise operations
      * @param other Series or number to compare against
   */
   lt(other: Series | number): Series;
   /**
      * Returns Greater than of series and other. Supports element wise operations
      * @param {other} Series, Scalar
      * @return {Series}
      */
   gt(other: Series | number | Array<number>): Series;
   /**
      * Returns Less than or Equal to of series and other. Supports element wise operations
      * @param {other} Series, Scalar
      * @return {Series}
      */
   le(other: Series | number | Array<number>): Series;
   /**
      * Returns Greater than or Equal to of series and other. Supports element wise operations
      * @param {other} Series, Scalar
      * @return {Series}
      */
   ge(other: Series | number | Array<number>): Series;
   /**
       * Returns Not Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
   ne(other: Series | number | Array<number>): Series;
   /**
      * Returns Equal to of series and other. Supports element wise operations
      * @param {other} Series, Scalar
      * @return {Series}
      */
   eq(other: Series | number | Array<number>): Series;
   /**
    * Perform boolean operations on bool values
    * @param other Other Series or number to compare with
    * @param bOps Name of operation to perform [ne, ge, le, gt, lt, eq]
    */
   private boolOps;
   /**
     * Replace all occurence of a value with a new value
     * @param oldValue The value you want to replace
     * @param newValue The new value you want to replace the old value with
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   replace(options?: {
      oldValue: string | number | boolean,
      newValue: string | number | boolean,
      inplace?: boolean;
   }): Series | void;
   /**
    * Drops all missing values (NaN) from a Series.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   dropna(options?: {
      inplace?: boolean;
   }): Series | undefined;
   /**
    * Return the integer indices that would sort the Series.
    * @param ascending boolean true: will sort the Series in ascending order, false: will sort in descending order
    */
   argsort(ascending?: boolean): Series;
   /**
      * Return int position of the largest value in the Series.
   */
   argmax(): number;
   /**
      * Return int position of the smallest value in the Series.
   */
   argmin(): number;
   /**
    * Remove duplicate values from a Series
    * @param keep "first" | "last", which dupliate value to keep. Defaults to "first".
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   drop_duplicates(options?: {
      keep?: "first" | "last";
      inplace?: boolean;
   }): Series | void;
   /**
    * Cast Series to specified data type
    * @param dtype Data type to cast to. One of [float32, int32, string, boolean, undefined]
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
   astype(dtype: "float32" | "int32" | "string" | "boolean" | "undefined", options?: {
      inplace?: boolean;
   }): Series | void;
   /**
    * Add a new value or values to the end of a Series
    * @param newValues Single value | Array | Series to append to the Series
    * @param index The new index value(s) to append to the Series. Must contain the same number of values as `newValues`
    * as they map `1 - 1`.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
   append(newValue: string | number | boolean | Series | ArrayType1D, index: Array<number | string> | number | string, options?: {
      inplace?: boolean;
   }): Series | void;
   /**
    * Returns dtype of Series
   */
   get dtype(): string;
   /**
    * Exposes numerous string methods to manipulate Series of type string
   */
   get str(): Str;
   /**
     * Returns time class that exposes different date time method
   */
   get dt(): Dt;
   /**
    * Prints Series to console as a grid of row and columns.
   */
   toString(): string;
   /**
    * Returns the logical AND between Series and other. Supports element wise operations and broadcasting.
    * @param other Series, Scalar, Array of Scalars
   */
   and(other: any): Series;
   /**
    * Returns the logical OR between Series and other. Supports element wise operations and broadcasting.
    * @param other Series, Scalar, Array of Scalars
   */
   or(other: any): Series;
   /**
    * One-hot encode values in the Series.
    * @param options Options for the operation. The following options are available:
    * - `prefix`: Prefix to add to the new column. Defaults to unique labels.
    * - `prefixSeparator`: Separator to use for the prefix. Defaults to '_'.
    * @returns A DataFrame with the one-hot encoded columns.
    * @example
    * sf.get_dummies()
    * sf.get_dummies({prefix: 'cat' })
    * sf.get_dummies({ prefix: 'cat', prefixSeparator: '-' })
    */
    get_dummies(options?: {
      columns?: string | Array<string>;
      prefix?: string | Array<string>;
      prefixSeparator?: string;
   }): DataFrame;
}

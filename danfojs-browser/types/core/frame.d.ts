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
import { ArrayType1D, ArrayType2D, DataFrameInterface, BaseDataOptionType } from "../shared/types";
import NDframe from "./generic";
import Series from './series';
import { GroupBy } from "./groupby";


/**
 * A 2D frame object that stores data in structured tabular format
 * @param {data} data, JSON, Array, 2D Tensor
 * @param {kwargs} Object {columns: Array of column names, defaults to ordered numbers when not specified
 *                        dtypes: strings of data types, automatically inferred when not specified
 *                        index: row index for subseting array, defaults to ordered numbers when not specified}
 *
 * @returns DataFrame
 */
export class DataFrame extends NDframe implements DataFrameInterface {
   [key: string]: any;
   constructor(data: any, options?: BaseDataOptionType);

   /**
   * Drop columns or rows with missing values. Missing values are NaN, undefined or null.
   * @param options.columns Array of column names to drop
   * @param options.index Array of index to drop
   * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   drop(options?: {
      columns?: string | Array<string>;
      index?: Array<string | number>;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Access a group of rows and columns by label(s) or a boolean array.
    * ``loc`` is primarily label based, but may also be used with a boolean array.
    *
    * @param rows Array of row indexes
    * @param columns Array of column indexes
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
   loc({ rows, columns }: {
      rows?: Array<string | number | boolean> | Series;
      columns?: Array<string>;
   }): DataFrame;
   /**
   * Purely integer-location based indexing for selection by position.
   * ``.iloc`` is primarily integer position based (from ``0`` to
   * ``length-1`` of the axis), but may also be used with a boolean array.
   *
   * @param rows Array of row indexes
   * @param columns Array of column indexes
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
   iloc({ rows, columns }: {
      rows?: Array<string | number | boolean> | Series;
      columns?: Array<string | number>;
   }): DataFrame;
   /**
     * Prints the first n values in a dataframe
     * @param {rows}  rows --> int
     * @returns DataFrame
     */
   head(rows?: number): DataFrame;
   /**
     * Prints the last n values in a dataframe
     * @param {rows}  rows --> int
     * @returns DataFrame
     */
   tail(rows?: number): DataFrame;
   /**
    * Gets n number of random rows in a dataframe. Sample is reproducible if seed is provided.
    * @param num The number of rows to return. Default to 5.
    * @param options.seed An integer specifying the random seed that will be used to create the distribution.
   */
   sample(num?: number, options?: {
      seed?: number;
   }): Promise<DataFrame>;

   /**
     * Return Addition of DataFrame and other, element-wise (binary operator add).
     * @param other DataFrame, Series, Array or Scalar number to add
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
   add(other: DataFrame | Series | number[] | number, options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return substraction between DataFrame and other.
    * @param other DataFrame, Series, Array or Scalar number to substract from DataFrame
    * @param options.axis 0 or 1. If 0, compute the subtraction column-wise, if 1, row-wise
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   sub(other: DataFrame | Series | number[] | number, options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return multiplciation between DataFrame and other.
    * @param other DataFrame, Series, Array or Scalar number to multiply with.
    * @param options.axis 0 or 1. If 0, compute the multiplication column-wise, if 1, row-wise
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   mul(other: DataFrame | Series | number[] | number, options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return division of DataFrame with other.
    * @param other DataFrame, Series, Array or Scalar number to divide with.
    * @param options.axis 0 or 1. If 0, compute the division column-wise, if 1, row-wise
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   div(other: DataFrame | Series | number[] | number, options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return DataFrame raised to the power of other.
    * @param other DataFrame, Series, Array or Scalar number to to raise to.
    * @param options.axis 0 or 1. If 0, compute the power column-wise, if 1, row-wise
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   pow(other: DataFrame | Series | number[] | number, options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return modulus between DataFrame and other.
    * @param other DataFrame, Series, Array or Scalar number to modulus with.
    * @param options.axis 0 or 1. If 0, compute the mod column-wise, if 1, row-wise
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   mod(other: DataFrame | Series | number[] | number, options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return mean of DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the mean column-wise, if 1, row-wise. Defaults to 1
   */
   mean(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return median of DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the median column-wise, if 1, row-wise. Defaults to 1
   */
   median(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return mode of DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the mode column-wise, if 1, row-wise. Defaults to 1
    * @param options.keep If there are more than one modes, returns the mode at position [keep]. Defaults to 0
   */
   mode(options?: {
      axis?: 0 | 1;
      keep?: number;
   }): Series;
   /**
    * Return minimum of values in a DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the minimum value column-wise, if 1, row-wise. Defaults to 1
   */
   min(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return maximum of values in a DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the maximum column-wise, if 1, row-wise. Defaults to 1
   */
   max(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return standard deviation of values in a DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the standard deviation column-wise, if 1, row-wise. Defaults to 1
   */
   std(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return variance of values in a DataFrame across specified axis.
    * @param options.axis 0 or 1. If 0, compute the variance column-wise, if 1, add row-wise. Defaults to 1
   */
   var(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Get Less than of dataframe and other, element-wise (binary operator lt).
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
   */
   lt(other: DataFrame | Series | number | Array<number>, options?: {
      axis?: 0 | 1;
   }): DataFrame;
   /**
    * Returns "greater than" of dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
   */
   gt(other: DataFrame | Series | number | Array<number>, options?: {
      axis?: 0 | 1;
   }): DataFrame;
   /**
    * Returns "equals to" of dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
   */
   eq(other: DataFrame | Series | number | Array<number>, options?: {
      axis?: 0 | 1;
   }): DataFrame;
   /**
    * Returns "not equal to" of dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
   */
   ne(other: DataFrame | Series | number | Array<number>, options?: {
      axis?: 0 | 1;
   }): DataFrame;
   /**
   * Returns "less than or equal to" of dataframe and other.
   * @param other DataFrame, Series, Array or Scalar number to compare with
   * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
   */
   le(other: DataFrame | Series | number | Array<number>, options?: {
      axis?: 0 | 1;
   }): DataFrame;
   /**
   * Returns "greater than or equal to" between dataframe and other.
   * @param other DataFrame, Series, Array or Scalar number to compare with
   * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
   */
   ge(other: DataFrame | Series | number | Array<number>, options?: {
      axis?: 0 | 1;
   }): DataFrame;
   /**
    * Return number of non-null elements in a Series
    * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
   */
   count(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return the sum of values across an axis.
    * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
   */
   sum(options?: {
      axis?: 0 | 1;
   }): Series;
   /**
    * Return the absolute value of elements in a DataFrame.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   abs(options?: {
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Rounds all element in the DataFrame to specified number of decimal places.
    * @param dp Number of decimal places to round to. Defaults to 1
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   round(dp?: number, options?: {
      inplace: boolean;
   }): DataFrame | void;
   /**
    * Returns cumulative product accross specified axis.
    * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   cumprod(options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Returns cumulative sum accross specified axis.
    * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   cumsum(options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Returns cumulative minimum accross specified axis.
    * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   cummin(options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Returns cumulative maximum accross specified axis.
    * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   cummax(options?: {
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;

   /**
     * Generate descriptive statistics for all numeric columns
     * Descriptive statistics include those that summarize the central tendency,
     * dispersion and shape of a dataset’s distribution, excluding NaN values.
     * @returns {Series}
     */
   describe(): DataFrame;
   /**
    * Drops all rows or columns with missing values (NaN)
    * @param axis 0 or 1. If 0, drop columns with NaNs, if 1, drop rows with NaNs
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   dropna(axis?: 0 | 1, options?: {
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Adds a new column to the DataFrame. If column exists, then the column values is replaced.
    * @param column The name of the column to add or replace.
    * @param values An array of values to be inserted into the DataFrame. Must be the same length as the columns
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   addColumn(options: {
      column: string,
      values: Series | ArrayType1D,
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Makes a new copy of a DataFrame
    */
   copy(): DataFrame;
   /**
    * Return a boolean same-sized object indicating where elements are empty (NaN, undefined, null).
    * NaN, undefined and null values gets mapped to true, and everything else gets mapped to false.
   */
   isna(): DataFrame;
   /**
   * Replace all empty elements with a specified value. Replace params expect columns array to map to values array.
   * @param columns The list of column names to be replaced
   * @param options.values The list of values to use for replacement.
   * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   fillna(values: number | string | boolean | ArrayType1D, options?: {
      columns?: Array<string>;
      inplace?: boolean;
   }): DataFrame | void;

   /**
   * Sorts a Dataframe by a specified column values
   * @param options.column Column name to sort by
   * @param options.ascending Whether to sort values in ascending order or not. Defaults to true
   * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   sort_values(options?: {
      by: string,
      ascending?: boolean;
      inplace?: boolean;
   }): DataFrame | void;
   /**
      * Sets the index of the DataFrame to the specified index.
      * @param options.index An array of index values to set
      * @param options.column A column name to set the index to
      * @param options.drop Whether to drop the column whose index was set. Defaults to false
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   set_index(options: {
      index?: Array<number | string | (number | string)>;
      column?: string;
      drop?: boolean;
      inplace?: boolean;
   }): DataFrame | void;
   /**
      * Resets the index of the DataFrame to the default index.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   reset_index(options?: {
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Apply a function along an axis of the DataFrame. To apply a function element-wise, use `applyMap`.
    * Objects passed to the function are Series values whose
    * index is either the DataFrame’s index (axis=0) or the DataFrame’s columns (axis=1)
    * @param callable Function to apply to each column or row
    * @param options.axis 0 or 1. If 0, compute the power column-wise, if 1, row-wise
   */
   apply(callable: any, options?: {
      axis?: 0 | 1;
   }): DataFrame | Series;
   /**
    * Apply a function to a Dataframe values element-wise.
    * @param callable Function to apply to each column or row
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   apply_map(callable: any, options?: {
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Returns the specified column data as a Series object.
    * @param column The name of the column to return
   */
   column(column: string): Series;
   /**
    * Return a subset of the DataFrame’s columns based on the column dtypes.
    * @param include An array of dtypes or strings to be included.
   */
   select_dtypes(include: Array<string>): DataFrame;
   /**
    * Returns the transposes the DataFrame.
    **/
   transpose(options?: {
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Returns the Transpose of the DataFrame. Similar to `transpose`, but does not change the original DataFrame.
   **/
   get T(): DataFrame;
   /**
     * Replace all occurence of a value with a new value
     * @param oldValue The value you want to replace
     * @param newValue The new value you want to replace the old value with
     * @param options.columns An array of column names you want to replace. If not provided replace accross all columns.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   */
   replace(oldValue: number | string | boolean, newValue: number | string | boolean, options?: {
      columns?: Array<string>;
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Cast the values of a column to specified data type
    * @param column The name of the column to cast
    * @param dtype Data type to cast to. One of [float32, int32, string, boolean]
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
   astype(options?: {
      column: string,
      dtype: "float32" | "int32" | "string" | "boolean",
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Return the number of unique elements in a across the specified axis.
    * To get the values use `.unique()` instead.
    * @param axis The axis to count unique elements across. Defaults to 1
   */
   nunique(axis?: 0 | 1): Series;
   /**
    * Renames a column or index.
    * @param mapper An object that maps each column or index in the DataFrame to a new value
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    * @param options.axis The axis to perform the operation on. Defaults to 1
    */
   rename(options?: {
      mapper: any,
      axis?: 0 | 1;
      inplace?: boolean;
   }): DataFrame | void;
   /**
   * Sorts the Dataframe by the index.
   * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   * @param options.ascending Whether to sort values in ascending order or not. Defaults to true
   */
   sort_index(options?: {
      inplace?: boolean;
      ascending?: boolean;
   }): DataFrame | void;
   /**
    * Add new rows to the end of the DataFrame.
    * @param newValues Array, Series or DataFrame to append to the DataFrame
    * @param index The new index value(s) to append to the Series. Must contain the same number of values as `newValues`
    * as they map `1 - 1`.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
   append(newValues: ArrayType1D | ArrayType2D | Series | DataFrame, index: Array<number | string> | number | string, options?: {
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Queries the DataFrame for rows that meet the boolean criteria.
    * @param condition An array of boolean mask, one for each row in the DataFrame. Rows where the value are true will be returned.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
   **/
   query(options: {
      column?: string,
      is?: string,
      to?: any,
      condition?: Series | Array<boolean>,
      inplace?: boolean;
   }): DataFrame | void;
   /**
    * Returns the data types for each column as a Series.
    */
   get ctypes(): Series;
   /**
    * One-hot encode specified columns in the DataFrame. If columns are not specified, all columns of dtype string will be encoded.
    * @param options Options for the operation. The following options are available:
    * - `columns`: A single column name or an array of column names to encode. Defaults to all columns of dtype string.
    * - `prefix`: Prefix to add to the column names. Defaults to unique labels.
    * - `prefixSeparator`: Separator to use for the prefix. Defaults to '_'.
    * - `inplace`: Boolean indicating whether to perform the operation inplace or not. Defaults to false
    * @returns A DataFrame with the one-hot encoded columns.
    * @example
    * df.getDummies({ columns: ['a', 'b'] })
    * df.getDummies({ columns: ['a', 'b'], prefix: 'cat' })
    * df.getDummies({ columns: ['a', 'b'], prefix: 'cat', prefixSeparator: '-' })
    * df.getDummies({ columns: ['a', 'b'], prefix: 'cat', prefixSeparator: '-', inplace: true })
    * df.getDummies({ columns: ['a', 'b'], prefix: ['col1', 'col2'], prefixSeparator: '-', inplace: true })
    */
   get_dummies(options?: {
      columns?: string | Array<string>;
      prefix?: string | Array<string>;
      prefixSeparator?: string | Array<string>;
      inplace?: boolean;
   }): DataFrame | void;

   groupby(column: string): GroupBy;
}
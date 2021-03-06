/**
 * A 2D frame object that stores data in structured tabular format
 * @param {data} data, JSON, Array, 2D Tensor
 * @param {kwargs} Object {columns: Array of column names, defaults to ordered numbers when not specified
 *                        dtypes: strings of data types, automatically inferred when not specified
 *                        index: row index for subseting array, defaults to ordered numbers when not specified}
 *
 * @returns DataFrame
 */
export class DataFrame extends Ndframe {
   constructor(data?: any, kwargs?: any);
   _set_column_property(): void;
   /**
      * Drop a list of rows or columns base on the specified axis
      * @param {Object} kwargs Configuration object
      *             {columns: [Array(Columns| Index)] array of column names to drop
      *              axis: row=0, columns=1
      *             inplace: specify whether to drop the row/column with/without creating a new DataFrame}
      * @returns null | DataFrame
      *
      */
   drop(kwargs?: any): DataFrame;
   /**
      * Purely label based indexing. Can accept string label names for both rows and columns
      * @param {kwargs} kwargs object {rows: Array of index, columns: Array of column name(s)}
      * @return DataFrame data stucture
      */
   loc(kwargs?: any): DataFrame;
   /**
      * Access a dataframe element using row and column index
      * @param {*} kwargs object {rows: Array of index, columns: Array of column index}
      * @return DataFrame data stucture
      */
   iloc(kwargs?: any): DataFrame;
   /**
     * Prints the first n values in a dataframe
     * @param {rows}  rows --> int
     * @returns DataFrame
     */
   head(rows?: any): DataFrame;
   /**
     * Prints the last n values in a dataframe
     * @param {rows}  rows --> int
     * @returns DataFrame
     */
   tail(rows?: any): DataFrame;
   /**
     * Gets [num] number of random rows in a dataframe
     * @param {rows}  rows --> int
     * @returns DataFrame
     */
   sample(num?: number): DataFrame;
   /**
        * Return Addition of DataFrame and other, element-wise (binary operator add).
        * @param {other} DataFrame, Series, Array or Number to add
        * @returns {DataFrame}
        */
   add(other?: any, axis?: any): DataFrame;
   /**
       * Return subtraction of DataFrame and other, element-wise (binary operator add).
       * @param {other} DataFrame, Series, Array or Number to add
       * @returns {DataFrame}
       */
   sub(other?: any, axis?: any): DataFrame;
   /**
        * Return subtraction of DataFrame and other, element-wise (binary operator add).
        * @param {other} DataFrame, Series, Array or Number to add
        * @returns {DataFrame}
        */
   mul(other?: any, axis?: any): DataFrame;
   /**
        * Return division of DataFrame and other, element-wise (binary operator add).
        * @param {other} DataFrame, Series, Array or Number to add
        * @returns {DataFrame}
        */
   div(other?: any, axis?: any): DataFrame;
   /**
       * Return division of DataFrame and other, element-wise (binary operator add).
       * @param {other} DataFrame, Series, Array or Number to add
       * @returns {DataFrame}
       */
   pow(other?: any, axis?: any): DataFrame;
   /**
        * Return division of DataFrame and other, element-wise (binary operator add).
        * @param {other} DataFrame, Series, Array or Number to add
        * @returns {DataFrame}
        */
   mod(other?: any, axis?: any): DataFrame;
   /**
        * Return mean of DataFrame across specified axis.
        * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
        * @returns {Series}
        */
   mean(axis?: number): Series;
   /**
        * Return median of DataFrame across specified axis.
        * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
        * @returns {Series}
        */
   median(axis?: number): Series;
   /**
      * Return minimum element in a DataFrame across specified axis.
      * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
      * @returns {Series}
      */
   min(axis?: number): Series;
   /**
      * Return maximum element of DataFrame across specified axis.
      * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
      * @returns {Series}
      */
   max(axis?: number): Series;
   /**
        * Return standard deviation of DataFrame across specified axis.
        * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
        * @returns {Series}
        */
   std(axis?: number): Series;
   /**
       * Return variance of DataFrame across specified axis.
       * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
       * @returns {Series}
       */
   var(axis?: number): Series;
   /**
      * Return number of non-null elements in a Series
      *  @returns {Series}, Count of non-null values
      */
   count(axis?: number): Series;
   /**
      * Rounds values in  DataFrame to specified number of dp
      *  @returns {DataFrame}, New DataFrame with rounded values
      */
   round(dp?: number): DataFrame;
   /**
      * Perform Cummulative operations
      * @param {axis} axis [int] {0 or 1}
      * @param {ops} ops {String} name of operation
      * @return {DataFrame}
      */
   __cum_ops(axis?: any, ops?: any): DataFrame;
   /**
      * calculate the cummulative sum along axis
      * @param {kwargs} {axis: [int]}
      * @returns {DataFrame}
      */
   cumsum(kwargs?: {}): DataFrame;
   /**
      * calculate the cummulative min
      * @param {kwargs} {axis: [int]}
      * @returns {DataFrame}
      */
   cummin(kwargs?: {}): DataFrame;
   /**
      * calculate the cummulative max
      * @param {kwargs} {axis: [int]}
      * @returns {DataFrame}
      */
   cummax(kwargs?: {}): DataFrame;
   /**
      * calculate the cummulative prod
      * @param {kwargs} {axis: [int]}
      * @returns {DataFrame}
      */
   cumprod(kwargs?: {}): DataFrame;
   /**
     * Makes a new copy of a DataFrame
     * @returns {DataFrame}
     */
   copy(): DataFrame;
   /**
    * Generate a new index for the DataFrame.
    * This is useful when the index is meaningless and needs to be reset to the default before another operation.
    * @param {inplace} boolean: Modify the original object or return a new one. Default to false
    */
   reset_index(inplace?: boolean): DataFrame;
   /**
     * Set the DataFrame index (row labels) using an array of the same length.
     * @param {kwargs} {index: Array of new index values}
     */
   set_index(kwargs?: {}): DataFrame;
   /**
     * Generate descriptive statistics for all numeric columns
     * Descriptive statistics include those that summarize the central tendency,
     * dispersion and shape of a dataset’s distribution, excluding NaN values.
     * @returns {Series}
     */
   describe(): Series;
   /**
      * Return a subset of the DataFrame’s columns based on the column dtypes.
      * @param {include} scalar or array-like. A selection of dtypes or strings to be included. At least one of these parameters must be supplied.
      * @returns {DataFrame, Series} The subset of the frame including the dtypes.
      */
   select_dtypes(include?: any): DataFrame;
   /**
     * Sort a Dataframe in ascending or descending order by a specified column name.
     *  @param {kwargs} Object, {by: Column name to sort by
     *                           ascending (Bool): Whether to return sorted values in ascending order or not,
     *                           inplace (Bool): Whether to perform sorting on the original Series or not}
     * @returns {Series}
     */
   /**
     * Return the sum of the values in a DataFrame across a specified axis.
     * @params {kwargs} {axis: 0 for row and 1 for column}
     * @returns {Series}, Sum of values accross axis
     */
   sum(kwargs?: {
      axis: number;
   }): Series;
   /**
     * Returns the absolute values in DataFrame
     * @return {DataFrame}
     */
   abs(): DataFrame;
   __get_tensor_and_idx(df?: any, axis?: any): any[];
   /**
      * Filter DataFrame element base on the element in a column
      * @param {kwargs} kwargs {column : coumn name[string], is: String, to: string| int}
      * @returns {DataFrame}
      */
   query(kwargs?: any): DataFrame;
   /**
      * Add a column with values to the dataframe
      * @param {kwargs} Object {column :[string] , value:[Array]}
      *
      */
   addColumn(kwargs?: any): void;
   /**
      *
      * @param {col}  col is a list of column with maximum length of two
      */
   groupby(col?: any): GroupBy;
   /**
      * Return a sequence of axis dimension along row and columns
      * @params col_name: the name of a column in the database.
      * @returns tensor of shape 1
      */
   column(col_name?: any): Series;
   /**
     * Replace NaN or undefined with a specified value"
     * @param {kwargs}, {column(s): Array of column name(s) to fill. If undefined fill all columns;
     *                   value(s): Array | Scalar of value(s) to fill with. If single value is specified, we use it to fill all
     * @return {DataFrame}
     */
   fillna(kwargs?: {}): DataFrame;
   /**
      * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values,
      *  gets mapped to True values. Everything else gets mapped to False values.
      * @return {DataFrame}
      */
   isna(): DataFrame;
   /**
      * Obtain index containing nan values
      * @return Array list (int)
      */
   nanIndex(): number[];
   /**
      * Drop all rows containing NaN
      * @param {kwargs} kwargs [Object] {axis: [int]{o or 1}, inplace:[boolean]}
      */
   dropna(kwargs?: any): DataFrame;
   /**
      * Apply a function to each element or along a specified axis of the DataFrame. Supports JavaScipt functions
      * when axis is not specified, and accepts Tensorflow functions when axis is specified.
      * @param {kwargs} kargs is defined as {axis: undefined, 0 or 1, callable: [FUNCTION]}
      * @return Array
      */
   apply(kwargs?: any): Series | DataFrame;
   /**
      * Returns Less than of DataFrame and other. Supports element wise operations
      * @param {other} DataFrame, Series, Scalar
      * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
      * @return {DataFrame}
      */
   lt(other?: any, axis?: any): DataFrame;
   /**
     * Returns Greater than of DataFrame and other. Supports element wise operations
     * @param {other} DataFrame, Series, Scalar
     * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
     * @return {DataFrame}
     */
   gt(other?: any, axis?: any): DataFrame;
   /**
     * Returns Less than or Equal to of DataFrame and other. Supports element wise operations
     * @param {other} DataFrame, Series, Scalar
     * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
     * @return {DataFrame}
     */
   le(other?: any, axis?: any): DataFrame;
   /**
     * Returns Greater than or Equal to of DataFrame and other. Supports element wise operations
     * @param {other} DataFrame, Series, Scalar
     * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
     * @return {DataFrame}
     */
   ge(other?: any, axis?: any): DataFrame;
   /**
     * Returns Not Equal to of DataFrame and other. Supports element wise operations
     * @param {other} DataFrame, Series, Scalar
     * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
     * @return {DataFrame}
     */
   ne(other?: any, axis?: any): DataFrame;
   /**
     * Returns Greater than or Equal to of DataFrame and other. Supports element wise operations
     * @param {other} DataFrame, Series, Scalar
     * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
     * @return {DataFrame}
     */
   eq(other?: any, axis?: any): DataFrame;
   /**
     * Replace all occurence of a value with a new specified value"
     * @param {kwargs}, {"replace": the value you want to replace,
     *                   "with": the new value you want to replace the olde value with
     *                   "in": Array of column names to replace value in, If not specified, replace all columns}
     * @return {Series}
     */
   replace(kwargs?: {}): Series;
   __logical_ops(val?: any, logical_type?: any, axis?: any): DataFrame;
   __get_df_from_tensor(val?: any, col_names?: any): DataFrame;
   __frame_is_compactible_for_operation(): boolean;
   __get_ops_tensors(tensors?: any, axis?: any): any[];
   /**
      * Transpose index and columns.
     * Reflect the DataFrame over its main diagonal by writing rows as columns and vice-versa.
     * The property T is an accessor to the method transpose().
      */
   transpose(): DataFrame;
   /**
      * The property T is an accessor to the method transpose().
      */
   get T(): DataFrame;
   /**
         * Returns the data types in the DataFrame
         * @return {Array} list of data types for each column
         */
   get ctypes(): any[];
   /**
      * Make plots of Series or DataFrame.
      * Uses the Plotly as backend, so supports Plotly's configuration parameters
      * @param {string} div Name of the div to show the plot
      * @returns {Class} Plot class that expoese different plot type
      */
   plot(div: string): any;
   /**
      * Returns the Tensorflow tensor backing the DataFrame Object
      * @returns {2D tensor}
      */
   get tensor(): 2;
   /**
      * Sets the data types of an DataFrame
      * @param {Object} kwargs {column: Name of the column to cast, dtype: [float32, int32, string] data type to cast to}
      * @returns {DataFrame}
      */
   astype(kwargs?: any): DataFrame;
   /**
     * Return the unique values along an axis
     * @param {axis} Int, 0 for row, and 1 for column. Default to 1
     * @return {Object}
     */
   unique(axis?: number): any;
   /**
      * Return the number of unique value along an axis
      * @param {axis} Int, 0 for row, and 1 for column. Default to 1
      * @return {Series}
      */
   nunique(axis?: number): Series;
   /**
      * Change axes labels. Object values must be unique (1-to-1).
      * Labels not contained in a dict / Series will be left as-is. Extra labels listed don’t throw an error.
      * @param {Object} kwargs {mapper: Dict-like or functions transformations to apply to that axis’ values,
      *                          axis: Int, 0 for row, and 1 for column. Default to 1,
      *                         inplace: Whether to return a new DataFrame. If True then value of copy is ignored.
      * @returns {DataFrame}
      */
   rename(kwargs?: any): DataFrame;
   /**
      * Sort DataFrame by index
      * @param {*} kwargs {inplace: Boolean, ascending: Bool}
      * @returns DataFrame
      */
   sort_index(kwargs?: any): DataFrame;
   /**
     * Sort a Dataframe in ascending or descending order by a specified column name.
     *  @param {kwargs} Object, {by: Column name to sort by
     *                           ascending (Bool): Whether to return sorted values in ascending order or not,
     *                           inplace (Bool): Whether to perform sorting on the original Series or not}
     * @returns {Series}
     */
   sort_values(kwargs?: {}): Series;
   __set_col_property(self?: any, col_vals?: any, col_names?: any, old_col_names?: any): void;
   __update_frame_in_place(row_data?: any, column_names?: any, col_obj?: any, index?: any, dtypes?: any): void;
   __sort_by(col_value?: any, df_index?: any, asc?: any): any[][];
   /**
      * Append rows to a DataFrame
      * @param {val} val Array | Series to append to the object
      * @return DataFrame
      */
   append(val?: any): DataFrame;
}
import Ndframe from "./generic";
import { Series } from "./series";
import { GroupBy } from "./groupby";

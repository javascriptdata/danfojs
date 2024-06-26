import Groupby from '../aggregators/groupby';
import NDframe from "./generic";
import Series from './series';
import { ArrayType1D, ArrayType2D, DataFrameInterface, BaseDataOptionType, IPlotlyLib } from "../shared/types";
/**
 * Two-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.
 */
export default class DataFrame extends NDframe implements DataFrameInterface {
    [key: string]: any;
    constructor(data: any, options?: BaseDataOptionType);
    /**
     * Maps all column names to their corresponding data, and return them as Series objects.
     * This makes column subsetting works. E.g this can work ==> `df["col1"]`
     * @param column Optional, a single column name to map
     */
    private $setInternalColumnDataProperty;
    /**
     * Returns the column data from the DataFrame by column name.
     * @param column column name to get the column data
     * @param returnSeries Whether to return the data in series format or not. Defaults to true
     */
    private $getColumnData;
    /**
     * Updates the internal column data via column name.
     * @param column The name of the column to update.
     * @param arr The new column data
     */
    private $setColumnData;
    /**
     * Return data with missing values removed from a specified axis
     * @param axis 0 or 1. If 0, column-wise, if 1, row-wise
    */
    private $getDataByAxisWithMissingValuesRemoved;
    /**
     * Return data aligned to the specified axis. Transposes the array if needed.
     * @param axis 0 or 1. If 0, column-wise, if 1, row-wise
    */
    private $getDataArraysByAxis;
    private $frameIsNotCompactibleForArithmeticOperation;
    /**
     * Return Tensors in the right axis for math operations.
     * @param other DataFrame or Series or number or array
     * @param axis 0 or 1. If 0, column-wise, if 1, row-wise
     * */
    private $getTensorsForArithmeticOperationByAxis;
    /**
     * Returns the dtype for a given column name
     * @param column
     */
    private $getColumnDtype;
    private $logicalOps;
    private $MathOps;
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
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
    * const df2 = df.iloc({ rows: [1], columns: ["A"] })
    * ```
    */
    iloc({ rows, columns }: {
        rows?: Array<string | number | boolean> | Series;
        columns?: Array<string | number>;
    }): DataFrame;
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
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
    * const df2 = df.loc({ rows: [1], columns: ["A"] })
    * ```
    */
    loc({ rows, columns }: {
        rows?: Array<string | number | boolean> | Series;
        columns?: Array<string>;
    }): DataFrame;
    /**
     * Prints DataFrame to console as a formatted grid of row and columns.
    */
    toString(): string;
    /**
      * Returns the first n values in a DataFrame
      * @param rows The number of rows to return
      * @example
      * ```
      * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
      * const df2 = df.head(1)
      * ```
    */
    head(rows?: number): DataFrame;
    /**
      * Returns the last n values in a DataFrame
      * @param rows The number of rows to return
      * @example
      * ```
      * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
      * const df2 = df.tail(1)
      * ```
    */
    tail(rows?: number): any;
    /**
     * Gets n number of random rows in a dataframe. Sample is reproducible if seed is provided.
     * @param num The number of rows to return. Default to 5.
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = await df.sample(1)
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = await df.sample(1, { seed: 1 })
     * ```
    */
    sample(num?: number, options?: {
        seed?: number;
    }): Promise<DataFrame>;
    /**
     * Return Addition of DataFrame and other, element-wise (binary operator add).
     * @param other DataFrame, Series, Array or Scalar number to add
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.add(1)
     * df2.print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.add([1, 2], { axis: 0, inplace: true})
     * df.print()
     * ```
    */
    add(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return substraction between DataFrame and other.
     * @param other DataFrame, Series, Array or Scalar number to substract from DataFrame
     * @param options.axis 0 or 1. If 0, compute the subtraction column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.sub(1)
     * df2.print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.sub([1, 2], { axis: 0, inplace: true})
     * df.print()
     *  ```
    */
    sub(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return multiplciation between DataFrame and other.
     * @param other DataFrame, Series, Array or Scalar number to multiply with.
     * @param options.axis 0 or 1. If 0, compute the multiplication column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.mul(2)
     * df2.print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.mul([1, 2], { axis: 0, inplace: true})
     * df.print()
     * ```
    */
    mul(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return division of DataFrame with other.
     * @param other DataFrame, Series, Array or Scalar number to divide with.
     * @param options.axis 0 or 1. If 0, compute the division column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.div(2)
     * df2.print()
     * ```
    */
    div(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return division of DataFrame with other, returns 0 if denominator is 0.
     * @param other DataFrame, Series, Array or Scalar number to divide with.
     * @param options.axis 0 or 1. If 0, compute the division column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.divNoNan(2)
     * df2.print()
     * ```
    */
    divNoNan(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return DataFrame raised to the power of other.
     * @param other DataFrame, Series, Array or Scalar number to to raise to.
     * @param options.axis 0 or 1. If 0, compute the power column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.pow(2)
     * df2.print()
     * ```
    */
    pow(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return modulus between DataFrame and other.
     * @param other DataFrame, Series, Array or Scalar number to modulus with.
     * @param options.axis 0 or 1. If 0, compute the mod column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * const df2 = df.mod(2)
     * df2.print()
     * ```
    */
    mod(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return mean of DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the mean column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.mean().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B'] })
     * df.mean({ axis: 0 }).print()
     * ```
    */
    mean(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return median of DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the median column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 4], [3, 4, 5], [6, 7, 8]], { columns: ['A', 'B', 'C'] });
     * df.median().print()
     * ```
    */
    median(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return mode of DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the mode column-wise, if 1, row-wise. Defaults to 1
     * @param options.keep If there are more than one modes, returns the mode at position [keep]. Defaults to 0
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 4], [3, 4, 5], [6, 7, 8]], { columns: ['A', 'B', 'C'] });
     * df.mode().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 4], [3, 4, 5], [6, 7, 8]], { columns: ['A', 'B', 'C'] });
     * df.mode({ keep: 1 }).print()
     * ```
    */
    mode(options?: {
        axis?: 0 | 1;
        keep?: number;
    }): Series;
    /**
     * Return minimum of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the minimum value column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.min().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.min({ axis: 0 }).print()
     * ```
    */
    min(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return maximum of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the maximum column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.max().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.max({ axis: 0 }).print()
     * ```
    */
    max(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return standard deviation of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the standard deviation column-wise, if 1, row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.std().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.std({ axis: 0 }).print()
     * ```
    */
    std(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return variance of values in a DataFrame across specified axis.
     * @param options.axis 0 or 1. If 0, compute the variance column-wise, if 1, add row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.var().print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.var({ axis: 0 }).print()
     * ```
    */
    var(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Get Less than of dataframe and other, element-wise (binary operator lt).
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.lt(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.lt([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.lt(sf, { axis: 1 }).print()
     * ```
    */
    lt(other: DataFrame | Series | number | Array<number>, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    /**
     * Returns "greater than" of dataframe and other.
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.gt(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.gt([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.gt(sf, { axis: 1 }).print()
     * ```
    */
    gt(other: DataFrame | Series | number | Array<number>, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    /**
     * Returns "equals to" of dataframe and other.
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.eq(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.eq([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.eq(sf, { axis: 1 }).print()
     * ```
    */
    eq(other: DataFrame | Series | number | Array<number>, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    /**
     * Returns "not equal to" of dataframe and other.
     * @param other DataFrame, Series, Array or Scalar number to compare with
     * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ne(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ne([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.ne(sf, { axis: 1 }).print()
     * ```
    */
    ne(other: DataFrame | Series | number | Array<number>, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    /**
    * Returns "less than or equal to" of dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.le(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.le([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.le(sf, { axis: 1 }).print()
     * ```
    */
    le(other: DataFrame | Series | number | Array<number>, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    /**
    * Returns "greater than or equal to" between dataframe and other.
    * @param other DataFrame, Series, Array or Scalar number to compare with
    * @param options.axis 0 or 1. If 0, add column-wise, if 1, add row-wise
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ge(2).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.ge([2, 3], { axis: 0 }).print()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = new Series([2, 3])
     * df.ge(sf, { axis: 1 }).print()
     * ```
    */
    ge(other: DataFrame | Series | number | Array<number>, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    /**
     * Return number of non-null elements in a Series
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.count().print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.count({ axis: 0 }).print()
     * ```
    */
    count(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return the sum of values across an axis.
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.sum().print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.sum({ axis: 0 }).print()
     * ```
    */
    sum(options?: {
        axis?: 0 | 1;
    }): Series;
    /**
     * Return percentage difference of DataFrame with other.
     * @param other DataFrame, Series, Array or Scalar number (positive numbers are preceding rows, negative are following rows) to compare difference with.
     * @param options.axis 0 or 1. If 0, compute the difference column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 3, 4, 5, 6], [1, 1, 2, 3, 5, 8], [1, 4, 9, 16, 25, 36]], { columns: ['A', 'B', 'C'] })
     *
     * // Percentage difference with previous row
     * const df0 = df.pctChange(1)
     * console.log(df0)
     *
     * // Percentage difference with previous column
     * const df1 = df.pctChange(1, {axis: 0})
     * console.log(df1)
     *
     * // Percentage difference with previous 3rd previous row
     * const df2 = df.pctChange(3)
     * console.log(df2)
     *
     * // Percentage difference with following row
     * const df3 = df.pctChange(-1)
     * console.log(df3)
     *
     * // Percentage difference with another DataFrame
     * const df4 = df.pctChange(df3)
     * console.log(df4)
     * ```
    */
    pctChange(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return difference of DataFrame with other.
     * @param other DataFrame, Series, Array or Scalar number (positive numbers are preceding rows, negative are following rows) to compare difference with.
     * @param options.axis 0 or 1. If 0, compute the difference column-wise, if 1, row-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2, 3, 4, 5, 6], [1, 1, 2, 3, 5, 8], [1, 4, 9, 16, 25, 36]], { columns: ['A', 'B', 'C'] })
     *
     * // Difference with previous row
     * const df0 = df.diff(1)
     * console.log(df0)
     *
     * // Difference with previous column
     * const df1 = df.diff(1, {axis: 0})
     * console.log(df1)
     *
     * // Difference with previous 3rd previous row
     * const df2 = df.diff(3)
     * console.log(df2)
     *
     * // Difference with following row
     * const df3 = df.diff(-1)
     * console.log(df3)
     *
     * // Difference with another DataFrame
     * const df4 = df.diff(df3)
     * console.log(df4)
     * ```
    */
    diff(other: DataFrame | Series | number[] | number, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return the absolute value of elements in a DataFrame.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1.0, 2.1], [3.1, 4]], { columns: ['A', 'B']})
     * df.abs().print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1.0, 2], [3.3, 4]], { columns: ['A', 'B']})
     * df.abs({ inplace: true }).print()
     * ```
    */
    abs(options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Rounds all element in the DataFrame to specified number of decimal places.
     * @param dp Number of decimal places to round to. Defaults to 1
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1.12, 2.34], [3.43, 4.0]], { columns: ['A', 'B']})
     * const df2 = df.round(2)
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1.12, 2.34], [3.43, 4.0]], { columns: ['A', 'B']})
     * df.round(2, { inplace: true }).print()
     * ```
    */
    round(dp: number, options?: {
        inplace: boolean;
    }): DataFrame;
    /**
     * Returns cumulative product accross specified axis.
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumprod()
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumprod({ axis: 0 })
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.cumprod({ axis: 0, inplace: true }).print()
     * ```
    */
    cumProd(options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Returns cumulative sum accross specified axis.
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumSum()
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumSum({ axis: 0 })
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.cumSum({ axis: 0, inplace: true }).print()
     * ```
    */
    cumSum(options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Returns cumulative minimum accross specified axis.
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumMin()
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumMin({ axis: 0 })
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.cumMin({ axis: 0, inplace: true }).print()
     * ```
    */
    cumMin(options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Returns cumulative maximum accross specified axis.
     * @param options.axis 0 or 1. If 0, count column-wise, if 1, add row-wise. Defaults to 1
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
          * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumMax()
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.cumMax({ axis: 0 })
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.cumMax({ axis: 0, inplace: true }).print()
     * ```
    */
    cumMax(options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Internal helper function for cumulative operation on DataFrame
    */
    private cumOps;
    /**
     * Generate descriptive statistics for all numeric columns.
     * Descriptive statistics include those that summarize the central tendency,
     * dispersion and shape of a dataset’s distribution, excluding NaN values.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.describe().print()
     * ```
     */
    describe(): DataFrame;
    /**
     * Drops all rows or columns with missing values (NaN)
     * @param axis 0 or 1. If 0, drop columns with NaNs, if 1, drop rows with NaNs
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [NaN, NaN]], { columns: ['A', 'B']})
     * const df2 = df.dropna()
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [NaN, NaN]], { columns: ['A', 'B']})
     * df.dropna({ axis: 0, inplace: true }).print()
     * ```
    */
    dropNa(options?: {
        axis: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Adds a new column to the DataFrame. If column exists, then the column values is replaced.
     * @param column The name of the column to add or replace.
     * @param values An array of values to be inserted into the DataFrame. Must be the same length as the columns
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @param options.atIndex Column index to insert after. Defaults to the end of the columns.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.addColumn('C', [5, 6])
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.addColumn('C', [5, 6], { inplace: true }).print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.addColumn('C', [5, 6], { inplace: true, atIndex: 0 }).print()
     * ```
    */
    addColumn(column: string, values: Series | ArrayType1D, options?: {
        inplace?: boolean;
        atIndex?: number | string;
    }): DataFrame;
    /**
     * Makes a deep copy of a DataFrame.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.copy()
     * df2.print()
     * ```
     */
    copy(): DataFrame;
    /**
     * Return a boolean, same-sized object indicating where elements are empty (NaN, undefined, null).
     * NaN, undefined and null values gets mapped to true, and everything else gets mapped to false.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.isNa().print()
     * ```
    */
    isNa(): DataFrame;
    /**
    * Replace all empty elements with a specified value. Replace params expect columns array to map to values array.
    * @param values The list of values to use for replacement.
    * @param options.columns  The list of column names to be replaced.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false.
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4], [NaN, NaN]], { columns: ['A', 'B']})
    * const df2 = df.fillNa(-99)
    * df2.print()
    * ```
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4], [NaN, NaN]], { columns: ['A', 'B']})
    * df.fillNa(-99, { inplace: true }).print()
    * ```
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4], [NaN, NaN]], { columns: ['A', 'B']})
    * df.fillNa(-99, { columns: ["A"], inplace: true }).print()
    * ```
    *
    */
    fillNa(values: number | string | boolean | ArrayType1D, options?: {
        columns?: Array<string>;
        inplace?: boolean;
    }): DataFrame;
    /**
    * Drop specified columns or rows.
    * @param options.columns Array of column names to drop.
    * @param options.index Array of index to drop.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false.
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
    * const df2 = df.drop({ columns: ['A'] })
    * df2.print()
    * ```
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
    * df.drop({ index: [0], inplace: true }).print()
    * ```
    */
    drop(options?: {
        columns?: string | Array<string>;
        index?: Array<string | number>;
        inplace?: boolean;
    }): DataFrame;
    /**
    * Sorts a Dataframe by a specified column values
    * @param column Column name to sort by.
    * @param options.ascending Whether to sort values in ascending order or not. Defaults to true.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false.
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
    * const df2 = df.sortBy('A')
    * df2.print()
    * ```
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
    * df.sortBy('A', { ascending: false, inplace: true }).print()
    * ```
    */
    sortValues(column: string, options?: {
        ascending?: boolean;
        inplace?: boolean;
    }): DataFrame;
    /**
       * Sets the index of the DataFrame to the specified value.
       * @param options.index An array of index values to set
       * @param options.column A column name whose values set in place of the index
       * @param options.drop Whether to drop the column whose index was set. Defaults to false
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
       * @example
       * ```
       * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
       * const df2 = df.setIndex({ index: ['a', 'b'] })
       * df2.print()
       * ```
       *
       * @example
       * ```
       * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
       * df.setIndex({ column: "A", inplace: true })
       * df.print()
       * ```
    */
    setIndex(options: {
        index?: Array<number | string | (number | string)>;
        column?: string;
        drop?: boolean;
        inplace?: boolean;
    }): DataFrame;
    /**
       * Resets the index of the DataFrame to default.
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
       * @example
       * ```
       * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
       * df.resetIndex({ inplace: true })
       * df.print()
       * ```
    */
    resetIndex(options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Apply a function along an axis of the DataFrame. To apply a function element-wise, use `applyMap`.
     * Objects passed to the function are Series values whose
     * index is either the DataFrame’s index (axis=0) or the DataFrame’s columns (axis=1)
     * @param callable Function to apply to each column or row.
     * @param options.axis 0 or 1. If 0, apply "callable" column-wise, else apply row-wise
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.apply(Math.sqrt, { axis: 0 })
     * df2.print()
     * ```
    */
    apply(callable: any, options?: {
        axis?: 0 | 1;
    }): DataFrame | Series;
    /**
     * Apply a function to a Dataframe values element-wise.
     * @param callable Function to apply to each column or row
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * function square(x) { return x * x }
     * const df2 = df.applyMap(square)
     * df2.print()
     * ```
    */
    applyMap(callable: any, options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Returns the specified column data as a Series object.
     * @param column The name of the column to return
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const sf = df.column('A')
     * sf.print()
     * ```
     *
    */
    column(column: string): Series;
    /**
     * Return a subset of the DataFrame based on the column dtypes.
     * @param include An array of dtypes or strings to be included.
     * @example
     * ```
     * const df = new DataFrame([[1, 2.1, "Dog"], [3, 4.3, "Cat"]], { columns: ['A', 'B', 'C']})
     * const df2 = df.selectDtypes(['float32'])
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2.1, "Dog"], [3, 4.3, "Cat"]], { columns: ['A', 'B', 'C']})
     * const df2 = df.selectDtypes(['float32', 'int32'])
     * df2.print()
     * ```
     *
    */
    selectDtypes(include: Array<string>): DataFrame;
    /**
     * Returns the transpose of the DataFrame.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.transpose()
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.transpose({ inplace: true })
     * df.print()
     * ```
     **/
    transpose(options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Returns the Transpose of the DataFrame. Similar to `transpose`.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.T()
     * df2.print()
     * ```
    **/
    get T(): DataFrame;
    /**
      * Replace all occurence of a value with a new value.
      * @param oldValue The value you want to replace
      * @param newValue The new value you want to replace the old value with
      * @param options.columns An array of column names you want to replace. If not provided replace accross all columns.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      *
      * @example
      * ```
      * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
      * const df2 = df.replace(2, 5)
      * df.print()
      * ```
      *
      * @example
      * ```
      * const df = new DataFrame([[1, 2], [2, 20]], { columns: ['A', 'B']})
      * const df2 = df.replace(2, 5, { columns: ['A'] })
      * df2.print()
      * ```
    */
    replace(oldValue: number | string | boolean, newValue: number | string | boolean, options?: {
        columns?: Array<string>;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Cast the values of a column to specified data type
     * @param column The name of the column to cast
     * @param dtype Data type to cast to. One of [float32, int32, string, boolean]
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2.2], [3, 4.3]], { columns: ['A', 'B']})
     * const df2 = df.asType('B', 'int32')
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2.2], [3, 4.3]], { columns: ['A', 'B']})
     * df.asType('B', 'int32', { inplace: true })
     * df.print()
     * ```
     */
    asType(column: string, dtype: "float32" | "int32" | "string" | "boolean", options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Return the number of unique elements in a column, across the specified axis.
     * To get the values use `.unique()` instead.
     * @param axis The axis to count unique elements across. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * df.nunique().print()
     * ```
     *
    */
    nUnique(axis?: 0 | 1): Series;
    /**
     * Renames a column or index to specified value.
     * @param mapper An object that maps each column or index in the DataFrame to a new value
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @param options.axis The axis to perform the operation on. Defaults to 1
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const df2 = df.rename({ A: 'a', B: 'b' })
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * df.rename({ A: 'a', B: 'b' }, { inplace: true })
     * df.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * df.rename({ 0: 'a', 1: 'b' }, { axis: 0, inplace: true})
     * df.print()
     * ```
     *
     */
    rename(mapper: {
        [index: string | number]: string | number;
    }, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame;
    /**
    * Sorts the Dataframe by the index.
    * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    * @param options.ascending Whether to sort values in ascending order or not. Defaults to true
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
    * const df2 = df.sortIndex()
    * df2.print()
    * ```
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
    * df.sortIndex({ inplace: true })
    * df.print()
    * ```
    *
    * @example
    * ```
    * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
    * df.sortIndex({ ascending: false, inplace: true })
    * df.print()
    * ```
    */
    sortIndex(options?: {
        inplace?: boolean;
        ascending?: boolean;
    }): DataFrame;
    /**
     * Add new rows at the end of the DataFrame.
     * @param newValues Array, Series or DataFrame to append to the DataFrame
     * @param index The new index value(s) to append to the Series. Must contain the same number of values as `newValues`
     * as they map `1 - 1`.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const values = [7, 8]
     * const index = ['a', 'b']
     * const df2 = df.append(values, index)
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const values = new Series([7, 8, 9, 10])
     * const index = ['a', 'b', 'c', 'd']
     * const df2 = df.append(values, index)
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const values = new DataFrame([[7, 8], [9, 10]], { columns: ['C', 'D'] })
     * const index = ['a', 'b']
     * const df2 = df.append(values, index)
     * df2.print()
     * ```
     */
    append(newValues: ArrayType1D | ArrayType2D | Series | DataFrame, index: Array<number | string> | number | string, options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Queries the DataFrame for rows that meet the boolean criteria. This is just a wrapper for the `iloc` method.
     * @param condition An array of boolean mask, one for each row in the DataFrame. Rows where the value are true will be returned.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const df2 = df.query([true, false, true, true])
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const df2 = df.query(df["A"].gt(2))
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * const df2 = df.query(df["A"].gt(2).and(df["B"].lt(5)))
     * df2.print()
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4], [1, 2], [5, 6]], { columns: ['A', 'B'] })
     * df.query(df["A"].gt(2), { inplace: true })
     * df.print()
     * ```
    **/
    query(condition: Series | Array<boolean>, options?: {
        inplace?: boolean;
    }): DataFrame;
    /**
     * Returns the data types for each column as a Series.
     * @example
     * ```
     * const df = new DataFrame([[1, 2.1, "Dog"], [3, 4.3, "Cat"]], { columns: ['A', 'B', 'C'] })
     * df.ctypes().print()
     * ```
     */
    get ctypes(): Series;
    /**
     * One-hot encode specified columns in the DataFrame. If columns are not specified, all columns of string dtype will be encoded.
     * @param options Options for the operation. The following options are available:
     * - `columns`: A single column name or an array of column names to encode. Defaults to all columns of dtype string.
     * - `prefix`: Prefix to add to the column names. Defaults to unique labels.
     * - `prefixSeparator`: Separator to use for the prefix. Defaults to '_'.
     * - `inplace`: Boolean indicating whether to perform the operation inplace or not. Defaults to false
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.getDummies()
     * ```
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.getDummies({ columns: ['A'] })
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.getDummies({ prefix: 'cat' })
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.getDummies({ prefix: 'cat', prefixSeparator: '_' })
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const df2 = df.getDummies({ inplace: true })
     * ```
     */
    getDummies(options?: {
        columns?: string | Array<string>;
        prefix?: string | Array<string>;
        prefixSeparator?: string | Array<string>;
        inplace?: boolean;
    }): DataFrame;
    /**
     * Groupby
     * @params col a list of column
     * @returns Groupby
     * @example
     * let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
     * let cols = [ "A", "B", "C" ];
     * let df = new dfd.DataFrame(data, { columns: cols });
     * let groupDf = df.groupby([ "A" ]);
     */
    groupby(col: Array<string>): Groupby;
    /**
     * Access a single value for a row/column pair by integer position.
     * Similar to {@link iloc}, in that both provide integer-based lookups.
     * Use iat if you only need to get or set a single value in a DataFrame.
     * @param row Row index of the value to access.
     * @param column Column index of the value to access.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.iat(0, 0) // 1
     * df.iat(0, 1) // 2
     * df.iat(1, 0) // 3
     * ```
    */
    iat(row: number, column: number): string | number | boolean | undefined;
    /**
     * Access a single value for a row/column label pair.
     * Similar to {@link loc}, in that both provide label-based lookups.
     * Use at if you only need to get or set a single value in a DataFrame.
     * @param row Row index of the value to access.
     * @param column Column label of the value to access.
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.at(0,'A') // 1
     * df.at(1, 'A') // 3
     * df.at(1, 'B') // 4
     * ```
    */
    at(row: string | number, column: string): string | number | boolean | undefined;
    /**
     * Exposes functions for creating charts from a DataFrame.
     * Charts are created using the Plotly.js library, so all Plotly's configuration parameters are available.
     * @param divId name of the HTML Div to render the chart in.
    */
    plot(divId: string): IPlotlyLib;
}

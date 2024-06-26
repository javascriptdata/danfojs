import NDframe from "./generic";
import Str from './strings';
import Dt from './datetime';
import DataFrame from "./frame";
import { ArrayType1D, BaseDataOptionType, SeriesInterface, mapParam, IPlotlyLib } from "../shared/types";
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
    *
    * @example
    * ```
    * const sf = new Series([1, 2, 3, 4, 5, 6], { index: ['a', 'b', 'c', 'd', 'e', 'f'] });
    * const sf2 = sf.iloc([0, 2, 4]);
    * sf2.print();
    * ```
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
    loc(rows: Array<string | number | boolean>): Series;
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
    head(rows?: number): Series;
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
    tail(rows?: number): Series;
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
    sample(num?: number, options?: {
        seed?: number;
    }): Promise<Series>;
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
    add(other: Series | Array<number> | number, options?: {
        inplace?: boolean;
    }): Series;
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
    sub(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series;
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
    mul(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series;
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
    div(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series;
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
    pow(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series;
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
    mod(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series;
    /**
     * Checks if the array value passed has a compatible dtype, removes NaN values, and if
     * boolean values are present, converts them to integer values.
    */
    private $checkAndCleanValues;
    /**
     * Returns the mean of elements in Series.
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6]);
     * console.log(sf.mean());
     * //output 3.5
     * ```
    */
    mean(): number;
    /**
      * Returns the median of elements in Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.median());
      * //output 3.5
      * ```
    */
    median(): number;
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
    mode(): any;
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
    min(): number;
    /**
      * Returns the maximum value in a Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.max());
      * //output 6
      * ```
    */
    max(): number;
    /**
      * Return the sum of the values in a series.
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.sum());
      * //output 21
      * ```
    */
    sum(): number;
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
    count(): number;
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
    maximum(other: Series | number | Array<number>): Series;
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
    minimum(other: Series | number | Array<number>): Series;
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
    round(dp?: number, options?: {
        inplace?: boolean;
    }): Series;
    /**
      * Return sample standard deviation of elements in Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.std());
      * //output 1.8708286933869707
      * ```
    */
    std(): number;
    /**
      *  Return unbiased variance of elements in a Series.
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * console.log(sf.var());
      * //output 3.5
      * ```
    */
    var(): number;
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
    isNa(): Series;
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
    fillNa(value: number | string | boolean, options?: {
        inplace?: boolean;
    }): Series;
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
    sortValues(options?: {
        ascending?: boolean;
        inplace?: boolean;
    }): Series;
    /**
      * Makes a deep copy of a Series
      * @example
      * ```
      * const sf = new Series([1, 2, 3, 4, 5, 6]);
      * const sf2 = sf.copy();
      * ```
      *
    */
    copy(): Series;
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
    describe(): Series;
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
    resetIndex(options?: {
        inplace?: boolean;
    }): Series;
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
    setIndex(index: Array<number | string | (number | string)>, options?: {
        inplace?: boolean;
    }): Series;
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
    map(callable: mapParam, options?: {
        inplace?: boolean;
    }): Series;
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
    apply(callable: (value: any) => any, options?: {
        inplace?: boolean;
    }): Series;
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
    unique(): Series;
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
    nUnique(): number;
    /**
     * Returns unique values and their counts in a Series
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
     * const sf2 = sf.valueCounts();
     * sf2.print();
     * ```
    */
    valueCounts(): Series;
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
    abs(options?: {
        inplace?: boolean;
    }): Series;
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
    cumSum(options?: {
        inplace?: boolean;
    }): Series;
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
    cumMin(options?: {
        inplace?: boolean;
    }): Series;
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
    cumMax(options?: {
        inplace?: boolean;
    }): Series;
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
    cumProd(options?: {
        inplace?: boolean;
    }): Series;
    /**
     * Internal helper function to calculate cumulative operations on series data
    */
    private cumOps;
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
    lt(other: Series | number | Array<number> | boolean[]): Series;
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
    gt(other: Series | number | Array<number> | boolean[]): Series;
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
    le(other: Series | number | Array<number> | boolean[]): Series;
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
    ge(other: Series | number | Array<number> | boolean[]): Series;
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
    ne(other: Series | number | Array<number> | boolean[]): Series;
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
    eq(other: Series | number | Array<number> | boolean[]): Series;
    /**
     * Internal function to perform boolean operations
     * @param other Other Series or number to compare with
     * @param bOps Name of operation to perform [ne, ge, le, gt, lt, eq]
     */
    private boolOps;
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
    replace(oldValue: string | number | boolean, newValue: string | number | boolean, options?: {
        inplace?: boolean;
    }): Series;
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
    dropNa(options?: {
        inplace?: boolean;
    }): Series;
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
    argSort(options?: {
        ascending: boolean;
    }): Series;
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
    argMax(): number;
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
    argMin(): number;
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
    dropDuplicates(options?: {
        keep?: "first" | "last";
        inplace?: boolean;
    }): Series;
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
    asType(dtype: "float32" | "int32" | "string" | "boolean" | "undefined", options?: {
        inplace?: boolean;
    }): Series;
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
    append(newValue: string | number | boolean | Series | ArrayType1D, index: Array<number | string> | number | string, options?: {
        inplace?: boolean;
    }): Series;
    /**
     * Returns dtype of Series
     * @example
     * ```
     * const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     * console.log(sf.dtype);
     * //output "int32"
     * ```
    */
    get dtype(): string;
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
    get str(): Str;
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
    get dt(): Dt;
    /**
     * Overrides default toString implementation. This essentially makes `print()` works.
    */
    toString(): string;
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
    and(other: any): Series;
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
    or(other: any): Series;
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
        columns?: string | Array<string>;
        prefix?: string | Array<string>;
        prefixSeparator?: string;
    }): DataFrame;
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
    iat(row: number): number | string | boolean | undefined;
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
    at(row: string): number | string | boolean | undefined;
    /**
     * Exposes functions for creating charts from a DataFrame.
     * Charts are created using the Plotly.js library, so all Plotly's configuration parameters are available.
     * @param divId name of the HTML Div to render the chart in.
    */
    plot(divId: string): IPlotlyLib;
}

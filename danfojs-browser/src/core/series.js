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
import { variance, std, median, mode } from 'mathjs';
import { _genericMathOp } from "./math.ops";
import { DATA_TYPES } from '../shared/defaults';
import ErrorThrower from "../shared/errors";
import { _iloc, _loc } from "./indexing";
import { utils } from "../shared/utils";
import NDframe from "./generic";
import { table } from "table";
import Str from './strings';
import Dt from './datetime';
import dummyEncode from "./get_dummies";
import { Plot } from "../plotting/plot";
import { data as tfData } from "@tensorflow/tfjs";

// const utils = new Utils();

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
export default class Series extends NDframe {

  constructor(data = [], options) {
    const { index, columns, dtypes, config } = { index: undefined, columns: undefined, dtypes: undefined, config: undefined, ...options };
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
    */
  iloc(rows) {
    return _iloc({ ndFrame: this, rows });
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
  loc(rows) {
    return _loc({ ndFrame: this, rows });
  }

  /**
      * Returns the first n values in a Series
      * @param rows The number of rows to return
    */
  head(rows = 5) {
    return this.iloc([`0:${rows}`]);
  }

  /**
      * Returns the last n values in a Series
      * @param rows The number of rows to return
    */
  tail(rows = 5) {
    const startIdx = this.shape[0] - rows;
    return this.iloc([`${startIdx}:`]);
  }

  /**
     * Returns specified number of random rows in a Series
     * @param num The number of rows to return
     * @param options.seed An integer specifying the random seed that will be used to create the distribution.
    */
  async sample(num = 5, options) {
    const { seed } = { seed: 1, ...options };

    if (num > this.shape[0]) {
      throw new Error("Sample size n cannot be bigger than size of dataset");
    }
    if (num < -1 || num == 0) {
      throw new Error("Sample size cannot be less than -1 or be equal to 0");
    }
    num = num === -1 ? this.shape[0] : num;

    const shuffledIndex = await tfData.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
    const sf = this.iloc(shuffledIndex);
    return sf;
  }

  /**
      * Return Addition of series and other, element-wise (binary operator add).
      * Equivalent to series + other
      * @param other Series, Array of same length or scalar number to add
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
  add(other, options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("add");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "add" });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
    }
  }

  /**
      * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
      * Equivalent to series - other
      * @param other Number to subtract
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
  sub(other, options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("sub");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "sub" });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
    }

  }

  /**
      * Return Multiplication of series and other, element-wise (binary operator mul).
      * Equivalent to series * other
      * @param other Number to multiply with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  mul(other, options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("mul");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "mul" });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
    }
  }

  /**
      * Return division of series and other, element-wise (binary operator div).
      * Equivalent to series / other
      * @param other Series or number to divide with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
  div(other, options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("div");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "div" });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
    }
  }

  /**
      * Return Exponential power of series and other, element-wise (binary operator pow).
      * Equivalent to series ** other
      * @param other Number to multiply with.
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
      */
  pow(other, options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("pow");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "pow" });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
    }
  }

  /**
      * Return Modulo of series and other, element-wise (binary operator mod).
      * Equivalent to series % other
      * @param other Number to modulo with
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  mod(other, options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("mod");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "mod" });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({ ndFrame: this, newData, isSeries: true });
    }
  }

  /**
     * Checks if the array value passed has a compatible dtype, removes NaN values, and if
     * boolean values are present, converts them to integer values.
     * */
  $checkAndCleanValues(values, operation) {
    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError(operation);
    values = utils.removeMissingValuesFromArray(values);

    if (this.dtypes[0] == "boolean") {
      values = (utils.mapBooleansToIntegers(values, 1));
    }
    return values;
  }

  /**
     * Returns the mean of elements in Series
    */
  mean() {
    const values = this.$checkAndCleanValues(this.values, "mean");
    return (values.reduce((a, b) => a + b) / values.length);
  }


  /**
      * Returns the median of elements in Series
    */
  median() {
    const values = this.$checkAndCleanValues(this.values, "median");
    return median(values);
  }

  /**
      * Returns the modal value of elements in Series
    */
  mode() {
    const values = this.$checkAndCleanValues(this.values, "mode");
    return mode(values);
  }

  /**
      * Returns the minimum value in a Series
    */
  min() {
    const values = this.$checkAndCleanValues(this.values, "min");
    let smallestValue = values[0];
    for (let i = 0; i < values.length; i++) {
      smallestValue = smallestValue < values[i] ? smallestValue : values[i];
    }
    return smallestValue;
  }

  /**
      * Returns the maximum value in a Series
      * @returns {Number}
    */
  max() {
    const values = this.$checkAndCleanValues(this.values, "max");
    let biggestValue = values[0];
    for (let i = 0; i < values.length; i++) {
      biggestValue = biggestValue > values[i] ? biggestValue : values[i];
    }
    return biggestValue;
  }

  /**
      * Return the sum of the values in a series.
    */
  sum() {
    const values = this.$checkAndCleanValues(this.values, "sum");
    return values.reduce((sum, value) => sum + value, 0);
  }

  /**
       * Return number of non-null elements in a Series
    */
  count() {
    const values = utils.removeMissingValuesFromArray(this.values);
    return values.length;
  }

  /**
      * Return maximum of series and other.
      * @param other Series or number to check against
    */
  maximum(other) {
    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("maximum");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "maximum" });
    return new Series(newData, {
      columns: this.columns,
      index: this.index
    });
  }

  /**
      * Return minimum of series and other.
      * @param other Series, Numbers to check against
    */
  minimum(other) {
    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("maximum");

    const newData = _genericMathOp({ ndFrame: this, other, operation: "minimum" });
    return new Series(newData, {
      columns: this.columns,
      index: this.index
    });
  }

  /**
     * Round each value in a Series to the specified number of decimals.
     * @param dp Number of Decimal places to round to
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  round(dp = 1, options) {
    const { inplace } = { inplace: false, ...options };

    const newValues = utils.round(this.values, dp, true);

    if (inplace) {
      this.$setValues(newValues);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData: newValues,
        isSeries: true
      });
    }

  }

  /**
      * Return sample standard deviation of elements in Series
    */
  std() {
    const values = this.$checkAndCleanValues(this.values, "max");
    return std(values);
  }

  /**
      *  Return unbiased variance of elements in a Series.
    */
  var() {
    const values = this.$checkAndCleanValues(this.values, "max");
    return variance(values);
  }

  /**
     * Return a boolean same-sized object indicating where elements are NaN.
     * NaN and undefined values gets mapped to true, and everything else gets mapped to false.
    */
  isna() {
    const newData = this.values.map((value) => {
      if (isNaN(value) && typeof value != "string") {
        return true;
      } else {
        return false;
      }
    });
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
  fillna(options) {
    const { value, inplace } = { value: undefined, inplace: false, ...options };

    if (!value && typeof value !== 'boolean') {
      throw Error('Value Error: Must specify value to replace with');
    }

    const newValues = [];
    (this.values).forEach((val) => {
      if (isNaN(val) && typeof val != "string") {
        newValues.push(value);
      } else {
        newValues.push(val);
      }
    });

    if (inplace) {
      this.$setValues(newValues);
    } else {
      return utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData: newValues,
        isSeries: true
      });
    }
  }


  /**
      * Sort a Series in ascending or descending order by some criterion.
      * @param options Method options
      * @param ascending Whether to return sorted values in ascending order or not. Defaults to true
      * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  sort_values(options) {
    const { ascending, inplace } = { inplace: false, ascending: true, ...options };

    let sortedValues = [];
    const rangeIdx = utils.range(0, this.index.length - 1);
    let sortedIdx = utils.sortArrayByIndex(rangeIdx, this.values, this.dtypes[0]);

    for (let indx of sortedIdx) {
      sortedValues.push(this.values[indx]);
    }

    if (ascending) {
      sortedValues = sortedValues.reverse();
      sortedIdx = sortedIdx.reverse();
    }

    if (inplace) {
      this.$setValues(sortedValues);
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
  copy() {
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
    */
  describe() {
    if (this.dtypes[0] == "string") {
      throw new Error("DType Error: Cannot generate descriptive statistics for Series with string dtype");
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
  reset_index(options) {
    const { inplace } = { inplace: false, ...options };

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
  set_index(options) {
    const { index, inplace } = { index: undefined, inplace: false, ...options };

    if (!index) {
      throw Error('Param Error: Must specify index array');
    }

    if (inplace) {
      this.$setIndex(index);
    } else {
      const sf = this.copy();
      sf.$setIndex(index);
      return sf;
    }
  }


  /**
       * map all the element in a column to a variable or function
       * @param callable callable can either be a funtion or an object
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  map(callable, options) {
    const { inplace } = { inplace: false, ...options };

    const isCallable = utils.isFunction(callable);

    const data = this.values.map((val) => {
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
      this.$setValues(data);
    } else {
      const sf = this.copy();
      sf.$setValues(data);
      return sf;
    }
  }

  /**
       * Applies a function to each element of a Series
       * @param callable Function to apply to each element of the series
       * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  apply(callable, options) {
    const { inplace } = { inplace: false, ...options };

    const isCallable = utils.isFunction(callable);
    if (!isCallable) {
      throw new Error("Param Error: callable must be a function");
    }

    const data = this.values.map((val) => {
      return callable(val);
    });

    if (inplace) {
      this.$setValues(data);
    } else {
      const sf = this.copy();
      sf.$setValues(data);
      return sf;
    }
  }

  /**
     * Returns a Series with only the unique value(s) in the original Series
    */
  unique() {
    const newValues = new Set(this.values);
    let series = new Series(Array.from(newValues));
    return series;
  }

  /**
       * Return the number of unique elements in a Series
    */
  nunique() {
    return (new Set(this.values)).size;
  }

  /**
     * Returns unique values and their counts in a Series
    */
  value_counts() {
    const sData = this.values;
    const dataDict = {};
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
  abs(options) {
    const { inplace } = { inplace: false, ...options };

    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError("abs");
    let newValues;


    newValues = this.values.map((val) => Math.abs(val));

    if (inplace) {
      this.$setValues(newValues);
    } else {
      const sf = this.copy();
      sf.$setValues(newValues);
      return sf;
    }
  }

  /**
      * Returns the cumulative sum over a Series
    */
  cumsum(options) {
    const ops = { inplace: false, ...options };
    return this.cumOps("sum", ops);
  }

  /**
       * Returns cumulative minimum over a Series
    */
  cummin(options) {
    const ops = { inplace: false, ...options };
    return this.cumOps("min", ops);
  }


  /**
       * Returns cumulative maximum over a Series
    */
  cummax(options) {
    const ops = { inplace: false, ...options };
    return this.cumOps("max", ops);
  }

  /**
       * Returns cumulative product over a Series
    */
  cumprod(options) {
    const ops = { inplace: false, ...options };
    return this.cumOps("prod", ops);
  }

  /**
     * perform cumulative operation on series data
    */
  cumOps(ops, options) {
    if (this.dtypes[0] == "string") ErrorThrower.throwStringDtypeOperationError(ops);
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
          tempval = (tempval) + (currVal);
          data.push(tempval);
          break;
        case "prod":
          tempval = (tempval) * (currVal);
          data.push(tempval);
          break;

      }
    }

    if (inplace) {
      this.$setValues(data);
    } else {
      return new Series(data, {
        index: this.index,
        config: { ...this.config }
      });
    }
  }


  /**
       * Returns less than of series and other. Supports element wise operations
       * @param other Series or number to compare against
    */
  lt(other) {
    return this.boolOps(other, "lt");
  }

  /**
       * Returns Greater than of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
  gt(other) {
    return this.boolOps(other, "gt");
  }

  /**
       * Returns Less than or Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
  le(other) {
    return this.boolOps(other, "le");
  }

  /**
       * Returns Greater than or Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
  ge(other) {
    return this.boolOps(other, "ge");
  }

  /**
        * Returns Not Equal to of series and other. Supports element wise operations
        * @param {other} Series, Scalar
        * @return {Series}
        */
  ne(other) {
    return this.boolOps(other, "ne");
  }

  /**
       * Returns Equal to of series and other. Supports element wise operations
       * @param {other} Series, Scalar
       * @return {Series}
       */
  eq(other) {
    return this.boolOps(other, "eq");
  }

  /**
     * Perform boolean operations on bool values
     * @param other Other Series or number to compare with
     * @param bOps Name of operation to perform [ne, ge, le, gt, lt, eq]
     */
  boolOps(other, bOps) {
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
    */
  replace(options) {
    const { oldValue, newValue, inplace } = { oldValue: undefined, newValue: undefined, inplace: false, ...options };

    if (!oldValue && typeof oldValue !== 'boolean') {
      throw Error(`Params Error: Must specify param 'oldValue' to replace`);
    }

    if (!newValue && typeof newValue !== 'boolean') {
      throw Error(`Params Error: Must specify param 'newValue' to replace with`);
    }

    const newArr = [...this.values].map((val) => {
      if (val === oldValue) {
        return newValue;
      } else {
        return val;
      }
    });

    if (inplace) {
      this.$setValues(newArr);
    } else {
      const sf = this.copy();
      sf.$setValues(newArr);
      return sf;
    }

  }

  /**
     * Drops all missing values (NaN) from a Series.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  dropna(options) {
    const { inplace } = { inplace: false, ...options };

    const oldValues = this.values;
    const oldIndex = this.index;
    const newValues = [];
    const newIndex = [];
    const isNaVals = this.isna().values;

    isNaVals.forEach((val, i) => {
      if (!val) {
        newValues.push((oldValues)[i]);
        newIndex.push(oldIndex[i]);
      }
    });

    if (inplace) {
      this.$setValues(newValues, false);
      this.$setIndex(newIndex);
    } else {
      const sf = this.copy();
      sf.$setValues(newValues, false);
      sf.$setIndex(newIndex);
      return sf;
    }

  }

  /**
     * Return the integer indices that would sort the Series.
     * @param ascending boolean true: will sort the Series in ascending order, false: will sort in descending order
     */
  argsort(ascending = true) {
    const sortedIndex = this.sort_values(ascending);
    const sf = new Series(sortedIndex.index);
    return sf;
  }

  /**
       * Return int position of the largest value in the Series.
    */
  argmax() {
    return this.tensor.argMax().arraySync();
  }


  /**
       * Return int position of the smallest value in the Series.
    */
  argmin() {
    return this.tensor.argMin().arraySync();
  }

  /**
     * Remove duplicate values from a Series
     * @param keep "first" | "last", which dupliate value to keep. Defaults to "first".
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
  drop_duplicates(options) {
    const { keep, inplace } = { keep: "first", inplace: false, ...options };

    if (!(["first", "last"].includes(keep))) {
      throw Error(`Params Error: Keep must be one of 'first' or 'last'`);
    }

    let dataArr;
    let newArr = [];
    let oldIndex;
    let newIndex = [];

    if (keep === "last") {
      dataArr = (this.values).reverse();
      oldIndex = this.index.reverse();
    } else {
      dataArr = (this.values);
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
      this.$setValues(newArr, false);
      this.$setIndex(newIndex);
    } else {
      const sf = this.copy();
      sf.$setValues(newArr, false);
      sf.$setIndex(newIndex);
      return sf;
    }

  }

  /**
     * Cast Series to specified data type
     * @param dtype Data type to cast to. One of [float32, int32, string, boolean, undefined]
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
  astype(dtype, options) {
    const { inplace } = { inplace: false, ...options };

    if (!dtype) {
      throw Error("Param Error: Please specify dtype to cast to");
    }

    if (!(DATA_TYPES.includes(dtype))) {
      throw Error(`dtype ${dtype} not supported. dtype must be one of ${DATA_TYPES}`);
    }

    const oldValues = [...this.values];
    const newValues = [];

    switch (dtype) {
      case "float32":
        oldValues.forEach((val) => {
          newValues.push(Number(val));
        });
        break;
      case "int32":
        oldValues.forEach((val) => {
          newValues.push(parseInt(val));
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
      this.$setValues(newValues, false);
      this.$setDtypes([dtype]);
    } else {
      const sf = this.copy();
      sf.$setValues(newValues, false);
      sf.$setDtypes([dtype]);
      return sf;
    }

  }

  /**
     * Add a new value or values to the end of a Series
     * @param newValues Single value | Array | Series to append to the Series
     * @param index The new index value(s) to append to the Series. Must contain the same number of values as `newValues`
     * as they map `1 - 1`.
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
     */
  append(
    newValue,
    index,
    options
  ) {
    const { inplace } = { inplace: false, ...options };

    if (!newValue && typeof newValue !== "boolean") {
      throw Error("Param Error: newValues cannot be null or undefined");
    }

    if (!index) {
      throw Error("Param Error: index cannot be null or undefined");
    }

    const newData = [...this.values];
    const newIndx = [...this.index];

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
      newIndx.push(index);
    }

    if (inplace) {
      this.$setValues(newData, false);
      this.$setIndex(newIndx);
    } else {
      const sf = new Series(
        newData,
        {
          index: newIndx,
          columns: this.columns,
          dtypes: this.dtypes,
          config: this.config
        });

      return sf;
    }
  }

  /**
     * Returns dtype of Series
    */
  get dtype() {
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
  toString() {
    const maxRow = this.$config.getMaxRow;
    let indx;
    let values = [];

    if (this.shape[0] > maxRow) {
      //slice rows to show [max_rows] rows
      const sfSlice = this.iloc([`0:${maxRow}`]);

      indx = sfSlice.index;
      values = sfSlice.values;

    } else {
      indx = this.index;
      values = this.values;
    }

    const tabledata = values.map((x, i) => [indx[i], x]);
    return table(tabledata);
  }

  /**
     * Returns the logical AND between Series and other. Supports element wise operations and broadcasting.
     * @param other Series, Scalar, Array of Scalars
    */
  and(other) {

    if (other === undefined) {
      throw new Error("Param Error: other cannot be undefined");
    }
    const newValues = [];

    if (other instanceof Series) {
      if (this.dtypes[0] !== other.dtypes[0]) {
        throw new Error("Param Error must be of same dtype");
      }

      if (this.shape[0] !== other.shape[0]) {
        throw new Error("Param Error must be of same shape");
      }
      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) && Boolean(other.values[i]));
      });

    } else if (Array.isArray(other)) {

      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) && Boolean(other[i]));
      });

    } else {

      this.values.forEach((val) => {
        newValues.push(Boolean(val) && Boolean(other));
      });

    }

    return new Series(newValues, {
      index: this.index,
      config: { ...this.config }
    });
  }

  /**
     * Returns the logical OR between Series and other. Supports element wise operations and broadcasting.
     * @param other Series, Scalar, Array of Scalars
    */
  or(other) {

    if (other === undefined) {
      throw new Error("Param Error: other cannot be undefined");
    }
    const newValues = [];

    if (other instanceof Series) {
      if (this.dtypes[0] !== other.dtypes[0]) {
        throw new Error("Param Error must be of same dtype");
      }

      if (this.shape[0] !== other.shape[0]) {
        throw new Error("Param Error must be of same shape");
      }

      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) || (other.values[i]));
      });

    } else if (typeof other === "boolean") {

      this.values.forEach((val) => {
        newValues.push(Boolean(val) || (other));
      });

    } else if (Array.isArray(other)) {

      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) || (other[i]));
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
     * @returns A DataFrame with the one-hot encoded columns.
     * @example
     * sf.get_dummies()
     * sf.get_dummies({prefix: 'cat' })
     * sf.get_dummies({ prefix: 'cat', prefixSeparator: '-' })
     */
  get_dummies(options) {
    return dummyEncode(this, options);
  }

  /**
   * Make plots of Series or DataFrame.
   * Uses the Plotly as backend, so supports Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @returns {Class} Plot class that expoese different plot type
  */
  plot(div) {
    const plt = new Plot(this, div);
    return plt;
  }
}

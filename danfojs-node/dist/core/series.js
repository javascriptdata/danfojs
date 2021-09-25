"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mathjs = require("mathjs");

var _math = require("./math.ops");

var _defaults = require("../shared/defaults");

var _errors = _interopRequireDefault(require("../shared/errors"));

var _indexing = require("./indexing");

var _utils = require("../shared/utils");

var _generic = _interopRequireDefault(require("./generic"));

var _table = require("table");

var _strings = _interopRequireDefault(require("./strings"));

var _datetime = _interopRequireDefault(require("./datetime"));

var _tfjsNode = require("@tensorflow/tfjs-node");

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
class Series extends _generic.default {
  constructor(data = [], options) {
    const {
      index,
      columns,
      dtypes,
      config
    } = {
      index: undefined,
      columns: undefined,
      dtypes: undefined,
      config: undefined,
      ...options
    };

    if (Array.isArray(data[0]) || _utils.utils.isObject(data[0])) {
      data = _utils.utils.convert2DArrayToSeriesArray(data);
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

  iloc(rows) {
    return (0, _indexing._iloc)({
      ndFrame: this,
      rows
    });
  }

  loc(rows) {
    return (0, _indexing._loc)({
      ndFrame: this,
      rows
    });
  }

  head(rows = 5) {
    return this.iloc([`0:${rows}`]);
  }

  tail(rows = 5) {
    const startIdx = this.shape[0] - rows;
    return this.iloc([`${startIdx}:`]);
  }

  async sample(num = 5, options) {
    const {
      seed
    } = {
      seed: 1,
      ...options
    };

    if (num > this.shape[0]) {
      throw new Error("Sample size n cannot be bigger than size of dataset");
    }

    if (num < -1 || num == 0) {
      throw new Error("Sample size cannot be less than -1 or be equal to 0");
    }

    num = num === -1 ? this.shape[0] : num;
    const shuffledIndex = await _tfjsNode.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
    const sf = this.iloc(shuffledIndex);
    return sf;
  }

  add(other, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("add");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "add"
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData,
        isSeries: true
      });
    }
  }

  sub(other, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("sub");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "sub"
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData,
        isSeries: true
      });
    }
  }

  mul(other, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("mul");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "mul"
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData,
        isSeries: true
      });
    }
  }

  div(other, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("div");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "div"
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData,
        isSeries: true
      });
    }
  }

  pow(other, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("pow");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "pow"
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData,
        isSeries: true
      });
    }
  }

  mod(other, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("mod");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "mod"
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData,
        isSeries: true
      });
    }
  }

  $checkAndCleanValues(values, operation) {
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError(operation);
    values = _utils.utils.removeMissingValuesFromArray(values);

    if (this.dtypes[0] == "boolean") {
      values = _utils.utils.mapBooleansToIntegers(values, 1);
    }

    return values;
  }

  mean() {
    const values = this.$checkAndCleanValues(this.values, "mean");
    return values.reduce((a, b) => a + b) / values.length;
  }

  median() {
    const values = this.$checkAndCleanValues(this.values, "median");
    return (0, _mathjs.median)(values);
  }

  mode() {
    const values = this.$checkAndCleanValues(this.values, "mode");
    return (0, _mathjs.mode)(values);
  }

  min() {
    const values = this.$checkAndCleanValues(this.values, "min");
    let smallestValue = values[0];

    for (let i = 0; i < values.length; i++) {
      smallestValue = smallestValue < values[i] ? smallestValue : values[i];
    }

    return smallestValue;
  }

  max() {
    const values = this.$checkAndCleanValues(this.values, "max");
    let biggestValue = values[0];

    for (let i = 0; i < values.length; i++) {
      biggestValue = biggestValue > values[i] ? biggestValue : values[i];
    }

    return biggestValue;
  }

  sum() {
    const values = this.$checkAndCleanValues(this.values, "sum");
    return values.reduce((sum, value) => sum + value, 0);
  }

  count() {
    const values = _utils.utils.removeMissingValuesFromArray(this.values);

    return values.length;
  }

  maximum(other) {
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("maximum");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "maximum"
    });
    return new Series(newData, {
      columns: this.columns,
      index: this.index
    });
  }

  minimum(other) {
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("maximum");
    const newData = (0, _math._genericMathOp)({
      ndFrame: this,
      other,
      operation: "minimum"
    });
    return new Series(newData, {
      columns: this.columns,
      index: this.index
    });
  }

  round(dp = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    const newValues = _utils.utils.round(this.values, dp, true);

    if (inplace) {
      this.$setValues(newValues);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData: newValues,
        isSeries: true
      });
    }
  }

  std() {
    const values = this.$checkAndCleanValues(this.values, "max");
    return (0, _mathjs.std)(values);
  }

  var() {
    const values = this.$checkAndCleanValues(this.values, "max");
    return (0, _mathjs.variance)(values);
  }

  isna() {
    const newData = this.values.map(value => {
      if (isNaN(value) && typeof value != "string") {
        return true;
      } else {
        return false;
      }
    });
    const sf = new Series(newData, {
      index: this.index,
      dtypes: ["boolean"],
      config: this.config
    });
    return sf;
  }

  fillna(options) {
    const {
      value,
      inplace
    } = {
      value: undefined,
      inplace: false,
      ...options
    };

    if (!value && typeof value !== 'boolean') {
      throw Error('Value Error: Must specify value to replace with');
    }

    const newValues = [];
    this.values.forEach(val => {
      if (isNaN(val) && typeof val != "string") {
        newValues.push(value);
      } else {
        newValues.push(val);
      }
    });

    if (inplace) {
      this.$setValues(newValues);
    } else {
      return _utils.utils.createNdframeFromNewDataWithOldProps({
        ndFrame: this,
        newData: newValues,
        isSeries: true
      });
    }
  }

  sort_values(options) {
    const {
      ascending,
      inplace
    } = {
      inplace: false,
      ascending: true,
      ...options
    };
    let sortedValues = [];

    const rangeIdx = _utils.utils.range(0, this.index.length - 1);

    let sortedIdx = _utils.utils.sortArrayByIndex(rangeIdx, this.values, this.dtypes[0]);

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

  copy() {
    const sf = new Series([...this.values], {
      columns: [...this.columns],
      index: [...this.index],
      dtypes: [...this.dtypes],
      config: { ...this.config
      }
    });
    return sf;
  }

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
      const sf = new Series(data, {
        index: index
      });
      return sf;
    }
  }

  reset_index(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (inplace) {
      this.$resetIndex();
    } else {
      const sf = this.copy();
      sf.$resetIndex();
      return sf;
    }
  }

  set_index(options) {
    const {
      index,
      inplace
    } = {
      index: undefined,
      inplace: false,
      ...options
    };

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

  map(callable, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    const isCallable = _utils.utils.isFunction(callable);

    const data = this.values.map(val => {
      if (isCallable) {
        return callable(val);
      } else if (_utils.utils.isObject(callable)) {
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

  apply(callable, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    const isCallable = _utils.utils.isFunction(callable);

    if (!isCallable) {
      throw new Error("Param Error: callable must be a function");
    }

    const data = this.values.map(val => {
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

  unique() {
    const newValues = new Set(this.values);
    let series = new Series(Array.from(newValues));
    return series;
  }

  nunique() {
    return new Set(this.values).size;
  }

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

    const index = Object.keys(dataDict).map(x => {
      return parseInt(x) ? parseInt(x) : x;
    });
    const data = Object.values(dataDict);
    const series = new Series(data, {
      index: index
    });
    return series;
  }

  abs(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError("abs");
    let newValues;
    newValues = this.values.map(val => Math.abs(val));

    if (inplace) {
      this.$setValues(newValues);
    } else {
      const sf = this.copy();
      sf.$setValues(newValues);
      return sf;
    }
  }

  cumsum(options) {
    const ops = {
      inplace: false,
      ...options
    };
    return this.cumOps("sum", ops);
  }

  cummin(options) {
    const ops = {
      inplace: false,
      ...options
    };
    return this.cumOps("min", ops);
  }

  cummax(options) {
    const ops = {
      inplace: false,
      ...options
    };
    return this.cumOps("max", ops);
  }

  cumprod(options) {
    const ops = {
      inplace: false,
      ...options
    };
    return this.cumOps("prod", ops);
  }

  cumOps(ops, options) {
    if (this.dtypes[0] == "string") _errors.default.throwStringDtypeOperationError(ops);
    const {
      inplace
    } = options;
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
          tempval = tempval + currVal;
          data.push(tempval);
          break;

        case "prod":
          tempval = tempval * currVal;
          data.push(tempval);
          break;
      }
    }

    if (inplace) {
      this.$setValues(data);
    } else {
      const sf = this.copy();
      sf.$setValues(data);
      return sf;
    }
  }

  lt(other) {
    return this.boolOps(other, "lt");
  }

  gt(other) {
    return this.boolOps(other, "gt");
  }

  le(other) {
    return this.boolOps(other, "le");
  }

  ge(other) {
    return this.boolOps(other, "ge");
  }

  ne(other) {
    return this.boolOps(other, "ne");
  }

  eq(other) {
    return this.boolOps(other, "eq");
  }

  boolOps(other, bOps) {
    const data = [];
    const lSeries = this.values;
    let rSeries;

    if (typeof other == "number") {
      rSeries = Array(this.values.length).fill(other);
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

    return new Series(data);
  }

  replace(options) {
    const {
      oldValue,
      newValue,
      inplace
    } = {
      oldValue: undefined,
      newValue: undefined,
      inplace: false,
      ...options
    };

    if (!oldValue && typeof oldValue !== 'boolean') {
      throw Error(`Params Error: Must specify param 'oldValue' to replace`);
    }

    if (!newValue && typeof newValue !== 'boolean') {
      throw Error(`Params Error: Must specify param 'newValue' to replace with`);
    }

    const newArr = [...this.values].map(val => {
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

  dropna(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const oldValues = this.values;
    const oldIndex = this.index;
    const newValues = [];
    const newIndex = [];
    const isNaVals = this.isna().values;
    isNaVals.forEach((val, i) => {
      if (!val) {
        newValues.push(oldValues[i]);
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

  argsort(ascending = true) {
    const sortedIndex = this.sort_values(ascending);
    const sf = new Series(sortedIndex?.index);
    return sf;
  }

  argmax() {
    return this.tensor.argMax().arraySync();
  }

  argmin() {
    return this.tensor.argMin().arraySync();
  }

  drop_duplicates(options) {
    const {
      keep,
      inplace
    } = {
      keep: "first",
      inplace: false,
      ...options
    };

    if (!["first", "last"].includes(keep)) {
      throw Error(`Params Error: Keep must be one of 'first' or 'last'`);
    }

    let dataArr;
    let newArr = [];
    let oldIndex;
    let newIndex = [];

    if (keep === "last") {
      dataArr = this.values.reverse();
      oldIndex = this.index.reverse();
    } else {
      dataArr = this.values;
      oldIndex = this.index;
    }

    dataArr.forEach((val, i) => {
      if (!newArr.includes(val)) {
        newIndex.push(oldIndex[i]);
        newArr.push(val);
      }
    });

    if (keep === "last") {
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

  astype(dtype, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!dtype) {
      throw Error("Param Error: Please specify dtype to cast to");
    }

    if (!_defaults.DATA_TYPES.includes(dtype)) {
      throw Error(`dtype ${dtype} not supported. dtype must be one of ${_defaults.DATA_TYPES}`);
    }

    const oldValues = [...this.values];
    const newValues = [];

    switch (dtype) {
      case "float32":
        oldValues.forEach(val => {
          newValues.push(Number(val));
        });
        break;

      case "int32":
        oldValues.forEach(val => {
          newValues.push(parseInt(val));
        });
        break;

      case "string":
        oldValues.forEach(val => {
          newValues.push(String(val));
        });
        break;

      case "boolean":
        oldValues.forEach(val => {
          newValues.push(Boolean(val));
        });
        break;

      case "undefined":
        oldValues.forEach(_ => {
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

  append(newValue, index, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

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
      const sf = new Series(newData, {
        index: newIndx,
        columns: this.columns,
        dtypes: this.dtypes,
        config: this.config
      });
      return sf;
    }
  }

  get dtype() {
    return this.dtypes[0];
  }

  get str() {
    if (this.dtypes[0] == "string") {
      return new _strings.default(this);
    } else {
      throw new Error("Cannot call accessor str on non-string type");
    }
  }

  get dt() {
    if (this.dtypes[0] == "string") {
      return new _datetime.default(this);
    } else {
      throw new Error("Cannot call accessor dt on non-string type");
    }
  }

  toString() {
    const maxRow = this.$config.getMaxRow;
    let indx;
    let values = [];

    if (this.shape[0] > maxRow) {
      const sfSlice = this.iloc([`0:${maxRow}`]);
      indx = sfSlice.index;
      values = sfSlice.values;
    } else {
      indx = this.index;
      values = this.values;
    }

    const tabledata = values.map((x, i) => [indx[i], x]);
    return (0, _table.table)(tabledata);
  }

  and(other) {
    if (other === undefined) {
      throw new Error("Param Error: other cannot be undefined");
    }

    if (other instanceof Series) {
      if (this.dtypes[0] !== other.dtypes[0]) {
        throw new Error("Param Error must be of same dtype");
      }

      if (this.shape[0] !== other.shape[0]) {
        throw new Error("Param Error must be of same shape");
      }

      const newValues = [];
      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) && Boolean(other.values[i]));
      });
      return new Series(newValues, {
        config: { ...this.config
        }
      });
    } else if (Array.isArray(other)) {
      const newValues = [];
      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) && Boolean(other[i]));
      });
      return new Series(newValues, {
        config: { ...this.config
        }
      });
    } else {
      const newValues = [];
      this.values.forEach(val => {
        newValues.push(Boolean(val) && Boolean(other));
      });
      return new Series(newValues, {
        config: { ...this.config
        }
      });
    }
  }

  or(other) {
    if (other === undefined) {
      throw new Error("Param Error: other cannot be undefined");
    }

    if (other instanceof Series) {
      if (this.dtypes[0] !== other.dtypes[0]) {
        throw new Error("Param Error must be of same dtype");
      }

      if (this.shape[0] !== other.shape[0]) {
        throw new Error("Param Error must be of same shape");
      }

      const newValues = [];
      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) | other.values[i]);
      });
      return new Series(newValues, {
        config: { ...this.config
        }
      });
    } else if (typeof other === "boolean") {
      const newValues = [];
      this.values.forEach(val => {
        newValues.push(Boolean(val) | other);
      });
      return new Series(newValues, {
        config: { ...this.config
        }
      });
    } else if (Array.isArray(other)) {
      const newValues = [];
      this.values.forEach((val, i) => {
        newValues.push(Boolean(val) | other[i]);
      });
      return new Series(newValues, {
        config: { ...this.config
        }
      });
    } else {
      throw new Error("Param Error: other must be a Series, Scalar, or Array of Scalars");
    }
  }

}

exports.default = Series;
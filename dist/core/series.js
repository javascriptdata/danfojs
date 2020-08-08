"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Series = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _mathjs = require("mathjs");

var _utils = require("./utils");

var _strings = require("./strings");

var _generic = _interopRequireDefault(require("./generic"));

var _table = require("table");

var _config = require("../config/config");

var _timeseries = require("./timeseries");

var _plot = require("../plotting/plot");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();
const config = new _config.Configs();

class Series extends _generic.default {
  constructor(data, kwargs) {
    if (Array.isArray(data[0]) || utils.__is_object(data[0])) {
      data = utils.__convert_2D_to_1D(data);
      super(data, kwargs);
    } else {
      super(data, kwargs);
    }
  }

  get tensor() {
    return tf.tensor(this.values).asType(this.dtypes[0]);
  }

  head(rows = 5) {
    if (rows > this.values.length || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };
      let data = this.values.slice(0, rows);
      return new Series(data, config);
    }
  }

  tail(rows = 5) {
    if (rows > this.values.length || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };
      let data = this.values.slice(this.values.length - rows);
      let idx = this.index.slice(this.values.length - rows);
      let sf = new Series(data, config);

      sf.__set_index(idx);

      return sf;
    }
  }

  sample(num = 5) {
    if (num > this.values.length || num < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let values = this.values;
      let idx = this.index;
      let new_values = [];
      let new_idx = [];
      let counts = [...Array(idx.length).keys()];

      let rand_nums = utils.__randgen(num, 0, counts.length);

      rand_nums.map(i => {
        new_values.push(values[i]);
        new_idx.push(idx[i]);
      });
      let config = {
        columns: this.column_names,
        index: new_idx
      };
      let sf = new Series(new_values, config);
      return sf;
    }
  }

  add(other) {
    if (utils.__is_number(other)) {
      let sum = this.tensor.add(other).arraySync();
      return new Series(sum, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let sum = this.tensor.add(other.tensor).arraySync();
        return new Series(sum, {
          columns: this.column_names
        });
      }
    }
  }

  sub(other) {
    if (utils.__is_number(other)) {
      let sub = this.tensor.sub(other).arraySync();
      return new Series(sub, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let sub = this.tensor.sub(other.tensor).arraySync();
        return new Series(sub, {
          columns: this.column_names
        });
      }
    }
  }

  mul(other) {
    if (utils.__is_number(other)) {
      let mul = this.tensor.mul(other).arraySync();
      return new Series(mul, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let mul = this.tensor.mul(other.tensor).arraySync();
        return new Series(mul, {
          columns: this.column_names
        });
      }
    }
  }

  div(other, round = true) {
    if (utils.__is_number(other)) {
      let div_result = this.tensor.div(other);
      return new Series(div_result.arraySync(), {
        columns: this.column_names,
        dtypes: [div_result.dtype]
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let dtype;

        if (round) {
          dtype = "float32";
        } else {
          dtype = "int32";
        }

        let tensor1 = this.tensor.asType(dtype);
        let tensor2 = other.tensor.asType(dtype);
        let result = tensor1.div(tensor2);
        dtype = result.dtype;
        return new Series(result.arraySync(), {
          columns: this.column_names,
          dtypes: [dtype]
        });
      }
    }
  }

  pow(other) {
    if (utils.__is_number(other)) {
      let pow_result = this.tensor.pow(other).arraySync();
      return new Series(pow_result, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let pow_result = this.tensor.pow(other.tensor).arraySync();
        return new Series(pow_result, {
          columns: this.column_names
        });
      }
    }
  }

  mod(other) {
    if (utils.__is_number(other)) {
      let mod_result = this.tensor.mod(other).arraySync();
      return new Series(mod_result, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let mod_result = this.tensor.mod(other.tensor).arraySync();
        return new Series(mod_result, {
          columns: this.column_names
        });
      }
    }
  }

  mean() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support mean operation");
    }

    let values = [];
    this.values.map(val => {
      if (!isNaN(val) && typeof val != "string") {
        values.push(val);
      }
    });
    let mean = tf.tensor(values).mean().arraySync();
    return mean;
  }

  median() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support median operation");
    }

    let values = this.values;

    let median = utils.__median(values, true);

    return median;
  }

  mode() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support mode operation");
    }

    let values = this.values;

    let mode = utils.__mode(values);

    return mode;
  }

  min() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support min operation");
    }

    let values = this.values;
    let min = tf.min(values).arraySync();
    return min;
  }

  max() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support max operation");
    }

    let values = this.values;
    let max = tf.max(values).arraySync();
    return max;
  }

  sum() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support sum operation");
    }

    if (this.dtypes[0] == "boolean") {
      let temp_sum = tf.tensor(this.values).sum().arraySync();
      return Number(temp_sum);
    }

    let temp_sum = tf.tensor(this.values).asType(this.dtypes[0]).sum().arraySync();
    return Number(temp_sum.toFixed(5));
  }

  count() {
    if (!this.series) {
      throw Error("property error: Object must be a series");
    }

    return utils.__count_nan(this.values, true, true);
  }

  maximum(other) {
    if (utils.__is_number(other)) {
      let max_result = this.tensor.maximum(other);
      return new Series(max_result.arraySync(), {
        columns: this.column_names,
        dtypes: max_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let tensor1 = this.tensor;
        let tensor2 = other.tensor;
        let result = tensor1.maximum(tensor2);
        return new Series(result.arraySync(), {
          columns: this.column_names
        });
      }
    }
  }

  minimum(other) {
    if (utils.__is_number(other)) {
      let max_result = this.tensor.minimum(other);
      return new Series(max_result.arraySync(), {
        columns: this.column_names,
        dtypes: max_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let tensor1 = this.tensor;
        let tensor2 = other.tensor;
        let result = tensor1.minimum(tensor2).arraySync();
        return new Series(result, {
          columns: this.column_names
        });
      }
    }
  }

  round(dp) {
    if (utils.__is_undefined(dp)) {
      let result = tf.round(this.tensor);
      return new Series(result.arraySync(), {
        columns: this.column_names
      });
    } else {
      let result = utils.__round(this.values, dp, true);

      return new Series(result, {
        columns: this.column_names
      });
    }
  }

  std() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support std operation");
    }

    let values = this.values;
    let std_val = (0, _mathjs.std)(values);
    return std_val;
  }

  var() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support var operation");
    }

    let values = this.values;
    let var_val = (0, _mathjs.variance)(values);
    return var_val;
  }

  isna() {
    let new_arr = [];
    this.values.map(val => {
      if (val == NaN) {
        new_arr.push(true);
      } else if (isNaN(val) && typeof val != "string") {
        new_arr.push(true);
      } else {
        new_arr.push(false);
      }
    });
    let sf = new Series(new_arr, {
      index: this.index,
      columns: this.column_names,
      dtypes: ["boolean"]
    });
    return sf;
  }

  fillna(kwargs = {}) {
    let params_needed = ["value", "inplace"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    kwargs['inplace'] = kwargs['inplace'] || false;

    if (!utils.__key_in_object(kwargs, "value")) {
      throw Error('Value Error: Must specify value to replace with');
    }

    let values = this.values;
    let new_values = [];
    values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        new_values.push(kwargs['value']);
      } else {
        new_values.push(val);
      }
    });

    if (kwargs['inplace']) {
      this.data = new_values;
      this.print();
    } else {
      let sf = new Series(new_values, {
        columns: this.column_names,
        index: this.index,
        dtypes: this.dtypes
      });
      sf.print();
      return sf;
    }
  }

  sort_values(kwargs = {}) {
    if (this.dtypes[0] == 'string') {
      throw Error("Dtype Error: cannot sort Series of type string");
    }

    let params_needed = ["inplace", "ascending", "by"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    let options = {};

    if (utils.__key_in_object(kwargs, 'ascending')) {
      options['ascending'] = kwargs["ascending"];
    } else {
      options['ascending'] = true;
    }

    if (utils.__key_in_object(kwargs, 'inplace')) {
      options['inplace'] = kwargs["inplace"];
    } else {
      options['inplace'] = false;
    }

    let sorted_arr = [];
    let sorted_idx = [];
    let arr_tensor = tf.clone(this.tensor);
    let arr_obj = [...this.values];

    for (let i = 0; i < this.shape[0]; i++) {
      let min_idx = arr_tensor.argMin().arraySync();
      sorted_arr.push(this.values[min_idx]);
      sorted_idx.push(this.index[min_idx]);
      arr_obj[min_idx] = NaN;
      arr_tensor = tf.tensor(arr_obj);
    }

    if (!options['ascending']) {
      sorted_arr = sorted_arr.reverse();
      sorted_idx = sorted_idx.reverse();
    }

    if (options['inplace']) {
      this.data = sorted_arr;

      this.__set_index(sorted_idx);
    } else {
      let sf = new Series(sorted_arr, {
        columns: this.column_names,
        index: sorted_idx
      });
      return sf;
    }
  }

  copy() {
    let sf = new Series([...this.values], {
      columns: [...this.column_names]
    });

    sf.__set_index([...this.index]);

    sf.astype([...this.dtypes], false);
    return sf;
  }

  describe() {
    if (this.dtypes[0] == "string") {
      return null;
    } else {
      let index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'];
      let count = this.count();
      let mean = this.mean();
      let std = this.std();
      let min = this.min();
      let median = this.median();
      let max = this.max();
      let variance = this.var();
      let vals = [count, mean, std, min, median, max, variance];
      let sf = new Series(vals, {
        columns: this.columns
      });

      sf.__set_index(index);

      return sf;
    }
  }

  reset_index(kwargs = {}) {
    let params_needed = ["inplace"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    kwargs['inplace'] = kwargs['inplace'] || false;

    if (kwargs['inplace']) {
      this.__reset_index();
    } else {
      let sf = this.copy();

      sf.__reset_index();

      return sf;
    }
  }

  set_index(kwargs = {}) {
    let params_needed = ["index", "inplace"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    kwargs['inplace'] = kwargs['inplace'] || false;

    if (!utils.__key_in_object(kwargs, 'index')) {
      throw Error("Index ValueError: You must specify an array of index");
    }

    if (kwargs['index'].length != this.index.length) {
      throw Error(`Index LengthError: Lenght of new Index array ${kwargs['index'].length} must match lenght of existing index ${this.index.length}`);
    }

    if (kwargs['inplace']) {
      this.index_arr = kwargs['index'];
    } else {
      let sf = this.copy();

      sf.__set_index(kwargs['index']);

      return sf;
    }
  }

  __check_series_op_compactibility(other) {
    if (utils.__is_undefined(other.series)) {
      throw Error("param [other] must be a Series or a single value that can be broadcasted");
    }

    if (other.values.length != this.values.length) {
      throw Error("Shape Error: Series shape do not match");
    }

    if (this.dtypes[0] != 'float' || this.dtypes[0] != 'int') {
      throw Error(`dtype Error: Cannot perform operation on type ${this.dtypes[0]} with type ${other.dtypes[0]}`);
    }

    if (other.dtypes[0] != 'float' || other.dtypes[0] != 'int') {
      throw Error(`dtype Error: Cannot perform operation on type ${other.dtypes[0]} with type ${this.dtypes[0]}`);
    }

    return true;
  }

  map(callable) {
    let is_callable = utils.__is_function(callable);

    let data = this.data.map(val => {
      if (is_callable) {
        return callable(val);
      } else {
        if (utils.__is_object(callable)) {
          if (utils.__key_in_object(callable, val)) {
            return callable[val];
          } else {
            return "NaN";
          }
        } else {
          throw new Error("callable must either be a function or an object");
        }
      }
    });
    let sf = new Series(data, {
      columns: this.column_names,
      index: this.index
    });
    return sf;
  }

  apply(callable) {
    let is_callable = utils.__is_function(callable);

    if (!is_callable) {
      throw new Error("the arguement most be a function");
    }

    let data = this.data.map(val => {
      return callable(val);
    });
    return new Series(data, {
      columns: this.column_names,
      index: this.index
    });
  }

  unique() {
    let data_set = new Set(this.values);
    let data = Array.from(data_set);
    let series = new Series(data);
    return series;
  }

  nunique() {
    let unique = this.unique().values;
    return unique.length;
  }

  value_counts() {
    let s_data = this.values;
    let data_dict = {};

    for (let i = 0; i < s_data.length; i++) {
      let val = s_data[i];

      if (val in data_dict) {
        data_dict[val] += 1;
      } else {
        data_dict[val] = 1;
      }
    }

    let index = Object.keys(data_dict).map(x => {
      return parseInt(x) ? parseInt(x) : x;
    });
    let data = index.map(x => {
      return data_dict[x];
    });
    let series = new Series(data, {
      index: index
    });
    return series;
  }

  abs() {
    let s_data = this.values;
    let tensor_data = tf.tensor1d(s_data);
    let abs_data = tensor_data.abs().arraySync();
    return new Series(utils.__round(abs_data, 2, true));
  }

  cumsum() {
    let data = this.__cum_ops("sum");

    return data;
  }

  cummin() {
    let data = this.__cum_ops("min");

    return data;
  }

  cummax() {
    let data = this.__cum_ops("max");

    return data;
  }

  cumprod() {
    let data = this.__cum_ops("prod");

    return data;
  }

  lt(other) {
    return this.__bool_ops(other, "lt");
  }

  gt(other) {
    return this.__bool_ops(other, "gt");
  }

  le(other) {
    return this.__bool_ops(other, "le");
  }

  ge(other) {
    return this.__bool_ops(other, "ge");
  }

  ne(other) {
    return this.__bool_ops(other, "ne");
  }

  eq(other) {
    return this.__bool_ops(other, "eq");
  }

  replace(kwargs = {}) {
    let params_needed = ["replace", "with", "inplace"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    kwargs['inplace'] = kwargs['inplace'] || false;

    if (utils.__key_in_object(kwargs, "replace") && utils.__key_in_object(kwargs, "with")) {
      let replaced_arr = [];
      let old_arr = this.values;
      old_arr.map(val => {
        if (val == kwargs['replace']) {
          replaced_arr.push(kwargs['with']);
        } else {
          replaced_arr.push(val);
        }
      });

      if (kwargs['inplace']) {
        this.data = replaced_arr;
      } else {
        let sf = new Series(replaced_arr, {
          index: this.index,
          columns: this.columns,
          dtypes: this.dtypes
        });
        return sf;
      }
    } else {
      throw Error("Params Error: Must specify both 'replace' and 'with' parameters.");
    }
  }

  dropna(kwargs = {}) {
    let params_needed = ["inplace"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    kwargs['inplace'] = kwargs['inplace'] || false;
    let old_values = this.values;
    let old_index = this.index;
    let new_values = [];
    let new_index = [];
    let isna_vals = this.isna().values;
    isna_vals.map((val, i) => {
      if (!val) {
        new_values.push(old_values[i]);
        new_index.push(old_index[i]);
      }
    });

    if (kwargs['inplace']) {
      this.index_arr = new_index;
      this.data = new_values;
    } else {
      let sf = new Series(new_values, {
        columns: this.column_names,
        index: new_index,
        dtypes: this.dtypes
      });
      return sf;
    }
  }

  argsort(ascending = true) {
    let sorted_index = this.sort_values({
      ascending: ascending
    }).index;
    let sf = new Series(sorted_index);
    return sf;
  }

  argmax() {
    return this.values.map((x, i) => [x, i]).reduce((r, a) => a[0] > r[0] ? a : r)[1];
  }

  argmin() {
    let sorted_index = this.sort_values({
      ascending: true
    }).index;
    let first_idx = sorted_index[0];
    return first_idx;
  }

  get dtype() {
    return this.dtypes[0];
  }

  drop_duplicates(kwargs = {}) {
    let params_needed = ["inplace", "keep"];

    if (!utils.__right_params_are_passed(kwargs, params_needed)) {
      throw Error(`Params Error: Specified parameter is not supported. Your params must be any of the following [${params_needed}]`);
    }

    kwargs['inplace'] = kwargs['inplace'] || false;
    kwargs['keep'] = kwargs['keep'] || "first";
    let data_arr, old_index;

    if (kwargs['keep'] == "last") {
      data_arr = this.values.reverse();
      old_index = this.index.reverse();
    } else {
      data_arr = this.values;
      old_index = this.index;
    }

    let seen = [];
    let new_index = [];
    let new_arr = [];
    data_arr.map((val, i) => {
      if (!seen.includes(val)) {
        new_index.push(old_index[i]);
        new_arr.push(val);
        seen.push(val);
      }
    });

    if (kwargs['keep'] == "last") {
      new_arr = new_arr.reverse();
      new_index = new_index.reverse();
    }

    if (kwargs['inplace'] == true) {
      this.data = new_arr;
      this.index_arr = new_index;
    } else {
      let sf = new Series(new_arr, {
        index: new_index,
        columns: this.column_names,
        dtypes: this.dtypes
      });
      return sf;
    }
  }

  toString() {
    let table_width = 20;
    let table_truncate = 20;
    let max_row = config.get_max_row;
    let data_arr = [];
    let table_config = {};
    let header = [""].concat(this.columns);
    let idx, data;

    if (this.values.length > max_row) {
      data = this.values.slice(0, max_row);
      idx = this.index.slice(0, max_row);
    } else {
      data = this.values;
      idx = this.index;
    }

    idx.map((val, i) => {
      let row = [val].concat(data[i]);
      data_arr.push(row);
    });
    table_config[0] = 10;
    table_config[1] = {
      width: table_width,
      truncate: table_truncate
    };
    data_arr.unshift(header);
    return (0, _table.table)(data_arr, {
      columns: table_config
    });
  }

  __bool_ops(other, b_ops) {
    let r_series;
    let l_series = this.values;

    if (typeof other == "number") {
      r_series = [];

      for (let i = 0; i < this.values.length; i++) {
        r_series.push(other);
      }
    } else {
      if (!(other instanceof Series)) {
        throw new Error("must be an instance of series");
      }

      l_series = this.values;
      r_series = other.values;
    }

    if (!(l_series.length === r_series.length)) {
      throw new Error("Both series must be of the same length");
    }

    let data = [];

    for (let i = 0; i < l_series.length; i++) {
      let l_val = l_series[i];
      let r_val = r_series[i];
      let bool = null;

      switch (b_ops) {
        case "lt":
          bool = l_val < r_val ? true : false;
          data.push(bool);
          break;

        case "gt":
          bool = l_val > r_val ? true : false;
          data.push(bool);
          break;

        case "le":
          bool = l_val <= r_val ? true : false;
          data.push(bool);
          break;

        case "ge":
          bool = l_val >= r_val ? true : false;
          data.push(bool);
          break;

        case "ne":
          bool = l_val != r_val ? true : false;
          data.push(bool);
          break;

        case "eq":
          bool = l_val === r_val ? true : false;
          data.push(bool);
          break;
      }
    }

    return new Series(data);
  }

  __cum_ops(ops) {
    let s_data = this.values;
    let temp_val = s_data[0];
    let data = [temp_val];

    for (let i = 1; i < s_data.length; i++) {
      let curr_val = s_data[i];

      switch (ops) {
        case "max":
          if (curr_val > temp_val) {
            data.push(curr_val);
            temp_val = curr_val;
          } else {
            data.push(temp_val);
          }

          break;

        case "min":
          if (curr_val < temp_val) {
            data.push(curr_val);
            temp_val = curr_val;
          } else {
            data.push(temp_val);
          }

          break;

        case "sum":
          temp_val = temp_val + curr_val;
          data.push(temp_val);
          break;

        case "prod":
          temp_val = temp_val * curr_val;
          data.push(temp_val);
          break;
      }
    }

    return new Series(data);
  }

  get str() {
    let values = this.values;

    if (this.dtypes[0] != "string") {
      let new_vals = [];
      values.map(val => {
        new_vals.push(`${val}`);
      });
      let sf = new Series(new_vals, {
        columns: this.column_names,
        index: this.index
      });
      return new _strings.Str(sf);
    }

    return new _strings.Str(this);
  }

  get dt() {
    let timeseries = new _timeseries.TimeSeries({
      data: this
    });
    timeseries.preprocessed();
    return timeseries;
  }

  print() {
    console.log(this + "");
  }

  plot(div, config = {}) {
    const plt = new _plot.Plot();
    plt.plot(this, div, config);
  }

}

exports.Series = Series;
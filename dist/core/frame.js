"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFrame = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

var _generic = _interopRequireDefault(require("./generic"));

var _series = require("./series");

var _utils = require("./utils");

var _groupby = require("./groupby");

var _plot = require("../plotting/plot");

var _indexing = require("../core/indexing");

var _concat = require("../core/concat.js");

var _mathjs = require("mathjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();

class DataFrame extends _generic.default {
  constructor(data, kwargs) {
    super(data, kwargs);

    this._set_column_property();
  }

  _set_column_property() {
    let col_vals = this.col_data;
    let col_names = this.column_names;
    col_vals.forEach((col, i) => {
      this[col_names[i]] = null;
      Object.defineProperty(this, col_names[i], {
        get() {
          return new _series.Series(this.col_data[i], {
            columns: col_names[i],
            index: this.index
          });
        },

        set(value) {
          this.addColumn({
            column: col_names[i],
            value: value
          });
        }

      });
    });
  }

  drop(kwargs = {}) {
    let params_needed = ["columns", "index", "inplace", "axis"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    kwargs['inplace'] = kwargs['inplace'] || false;

    if (!("axis" in kwargs)) {
      kwargs['axis'] = 1;
    }

    let to_drop = null;

    if ("index" in kwargs && kwargs['axis'] == 0) {
      to_drop = kwargs["index"];
    } else {
      to_drop = kwargs["columns"];
    }

    if (kwargs['axis'] == 1) {
      if (!("columns" in kwargs)) {
        throw Error("No column found. Axis of 1 must be accompanied by an array of column(s) names");
      }

      let self = this;
      let new_col_data = {};
      let new_dtype = [];
      const index = to_drop.map(x => {
        let col_idx = self.columns.indexOf(x);

        if (col_idx == -1) {
          throw new Error(`column "${x}" does not exist`);
        }

        return col_idx;
      });
      this.col_data.forEach((col, idx) => {
        if (!index.includes(idx)) {
          new_col_data[self.column_names[idx]] = col;
          new_dtype.push(self.dtypes[idx]);
        }
      });

      if (!kwargs['inplace']) {
        let old_cols = self.columns;
        let new_columns = Object.keys(new_col_data);
        let df = new DataFrame(new_col_data, {
          index: self.index,
          dtypes: new_dtype
        });

        df.__set_col_property(df, df.col_data, new_columns, old_cols);

        return df;
      } else {
        let old_cols = self.columns;
        let new_columns = Object.keys(new_col_data);

        this.__update_frame_in_place(null, null, new_col_data, null, new_dtype);

        this.__set_col_property(self, self.col_data, new_columns, old_cols);
      }
    } else {
      if (!utils.__key_in_object(kwargs, "index")) {
        throw Error("No index label found. Axis of 0 must be accompanied by an array of index labels");
      }

      to_drop.forEach(x => {
        if (!this.index.includes(x)) throw new Error(`${x} does not exist in index`);
      });
      const values = this.values;
      let data_idx = [];
      let new_data, new_index;

      if (typeof to_drop[0] == 'string') {
        this.index.forEach((idx, i) => {
          if (to_drop.includes(idx)) {
            data_idx.push(i);
          }
        });
        new_data = utils.__remove_arr(values, data_idx);
        new_index = utils.__remove_arr(this.index, data_idx);
      } else {
        new_data = utils.__remove_arr(values, to_drop);
        new_index = utils.__remove_arr(this.index, to_drop);
      }

      if (!kwargs['inplace']) {
        return new DataFrame(new_data, {
          columns: this.columns,
          index: new_index
        });
      } else {
        this.row_data_tensor = tf.tensor(new_data);
        this.data = new_data;

        this.__set_index(new_index);
      }
    }
  }

  loc(kwargs = {}) {
    let params_needed = ["columns", "rows"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    kwargs["type"] = "loc";
    let [new_data, columns, rows] = (0, _indexing.indexLoc)(this, kwargs);
    let df_columns = {
      "columns": columns
    };
    let df = new DataFrame(new_data, df_columns);

    df.__set_index(rows);

    return df;
  }

  iloc(kwargs = {}) {
    let params_needed = ["columns", "rows"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    kwargs["type"] = "iloc";
    let [new_data, columns, rows] = (0, _indexing.indexLoc)(this, kwargs);
    let df_columns = {
      "columns": columns
    };
    let df = new DataFrame(new_data, df_columns);

    df.__set_index(rows);

    return df;
  }

  head(rows = 5) {
    if (rows > this.values.length || rows < 1) {
      return this;
    } else {
      let data = this.values.slice(0, rows);
      let idx = this.index.slice(0, rows);
      let config = {
        columns: this.column_names,
        index: idx
      };
      let df = new DataFrame(data, config);
      return df;
    }
  }

  tail(rows = 5) {
    let row_len = this.values.length;

    if (rows > row_len || rows < 1) {
      return this;
    } else {
      let data = this.values.slice(row_len - rows);
      let indx = this.index.slice(row_len - rows);
      let config = {
        columns: this.column_names,
        index: indx
      };
      let df = new DataFrame(data, config);
      return df;
    }
  }

  sample(num = 5) {
    if (num > this.values.length || num < 1) {
      let config = {
        columns: this.column_names
      };
      return new DataFrame(this.values, config);
    } else {
      let values = this.values;
      let idx = this.index;
      let new_values = [];
      let new_idx = [];
      let counts = [...Array(idx.length).keys()];

      let rand_nums = utils.__sample_from_iter(counts, num, false);

      rand_nums.map(i => {
        new_values.push(values[i]);
        new_idx.push(idx[i]);
      });
      let config = {
        columns: this.column_names,
        index: new_idx
      };
      let df = new DataFrame(new_values, config);
      return df;
    }
  }

  add(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let sum_vals = tensors[0].add(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(sum_vals, col_names);
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  sub(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let result = tensors[0].sub(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(result, col_names);
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  mul(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let result = tensors[0].mul(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(result, col_names);
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  div(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let result = tensors[0].div(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(result, col_names);
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  pow(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let result = tensors[0].pow(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(result, col_names);
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  mod(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let result = tensors[0].mod(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(result, col_names);
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  mean(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let operands = this.__get_tensor_and_idx(this, axis);

      let tensor_vals = operands[0];
      let idx = operands[1];
      let result = tensor_vals.mean(operands[2]);
      let sf = new _series.Series(result.arraySync(), {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  median(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let tensor_vals, idx;

      if (axis == 1) {
        tensor_vals = this.col_data_tensor.arraySync();
        idx = this.column_names;
      } else {
        tensor_vals = this.row_data_tensor.arraySync();
        idx = this.index;
      }

      let median = utils.__median(tensor_vals, false);

      let sf = new _series.Series(median, {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  min(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let operands = this.__get_tensor_and_idx(this, axis);

      let tensor_vals = operands[0];
      let idx = operands[1];
      let result = tensor_vals.min(operands[2]);
      let sf = new _series.Series(result.arraySync(), {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  max(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let operands = this.__get_tensor_and_idx(this, axis);

      let tensor_vals = operands[0];
      let idx = operands[1];
      let result = tensor_vals.max(operands[2]);
      let sf = new _series.Series(result.arraySync(), {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  std(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let tensor_vals = this.col_data_tensor.arraySync();
      let idx;

      if (axis == 1) {
        idx = this.column_names;
      } else {
        idx = this.index;
      }

      let median = (0, _mathjs.std)(tensor_vals, axis);
      let sf = new _series.Series(median, {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  var(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let tensor_vals = this.col_data_tensor.arraySync();
      let idx;

      if (axis == 1) {
        idx = this.column_names;
      } else {
        idx = this.index;
      }

      let median = (0, _mathjs.variance)(tensor_vals, axis);
      let sf = new _series.Series(median, {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  count(axis = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let tensor_vals, idx;

      if (axis == 1) {
        tensor_vals = this.col_data_tensor.arraySync();
        idx = this.column_names;
      } else {
        tensor_vals = this.row_data_tensor.arraySync();
        idx = this.index;
      }

      let counts = utils.__count_nan(tensor_vals, true, false);

      let sf = new _series.Series(counts, {
        "index": idx
      });
      return sf;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  round(dp = 1) {
    if (this.__frame_is_compactible_for_operation) {
      let values = this.values;
      let idx = this.index;

      let new_vals = utils.__round(values, dp, false);

      let options = {
        "columns": this.column_names,
        "index": idx
      };
      let df = new DataFrame(new_vals, options);
      return df;
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  __cum_ops(axis = 0, ops) {
    if (!(axis == 0) && !(axis == 1)) {
      throw new Error("axis must be between 0 or 1");
    }

    if (this.__frame_is_compactible_for_operation) {
      let data = [];
      let df_data = null;

      if (axis == 0) {
        df_data = this.col_data;
      } else {
        df_data = this.values;
      }

      for (let i = 0; i < df_data.length; i++) {
        let value = df_data[i];
        let temp_val = value[0];
        let temp_data = [temp_val];

        for (let j = 1; j < value.length; j++) {
          let curr_val = value[j];

          switch (ops) {
            case "max":
              if (curr_val > temp_val) {
                temp_val = curr_val;
                temp_data.push(curr_val);
              } else {
                temp_data.push(temp_val);
              }

              break;

            case "min":
              if (curr_val < temp_val) {
                temp_val = curr_val;
                temp_data.push(curr_val);
              } else {
                temp_data.push(temp_val);
              }

              break;

            case "sum":
              temp_val = temp_val + curr_val;
              temp_data.push(temp_val);
              break;

            case "prod":
              temp_val = temp_val * curr_val;
              temp_data.push(temp_val);
              break;
          }
        }

        data.push(temp_data);
      }

      if (axis == 0) {
        data = utils.__get_col_values(data);
      }

      return new DataFrame(data, {
        columns: this.columns
      });
    } else {
      throw Error("TypeError: Dtypes of columns must be Float of Int");
    }
  }

  cumsum(kwargs = {}) {
    let axis;

    if (!utils.__key_in_object(kwargs, "axis")) {
      axis = 0;
    } else {
      axis = kwargs['axis'];
    }

    let data = this.__cum_ops(axis, "sum");

    return data;
  }

  cummin(kwargs = {}) {
    let axis;

    if (!utils.__key_in_object(kwargs, "axis")) {
      axis = 0;
    } else {
      axis = kwargs['axis'];
    }

    let data = this.__cum_ops(axis, "min");

    return data;
  }

  cummax(kwargs = {}) {
    let axis;

    if (!utils.__key_in_object(kwargs, "axis")) {
      axis = 0;
    } else {
      axis = kwargs['axis'];
    }

    let data = this.__cum_ops(axis, "max");

    return data;
  }

  cumprod(kwargs = {}) {
    let axis;

    if (!utils.__key_in_object(kwargs, "axis")) {
      axis = 0;
    } else {
      axis = kwargs['axis'];
    }

    let data = this.__cum_ops(axis, "prod");

    return data;
  }

  copy() {
    let df = new DataFrame([...this.values], {
      columns: [...this.column_names],
      index: this.index,
      dtypes: this.dtypes
    });
    return df;
  }

  reset_index(inplace = false) {
    if (inplace) {
      this.__reset_index();
    } else {
      let df = this.copy();

      df.__reset_index();

      return df;
    }
  }

  set_index(kwargs = {}) {
    let params_needed = ["key", "drop", "inplace"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    if (!utils.__key_in_object(kwargs, 'key')) {
      throw Error("Index ValueError: You must specify an array of index");
    }

    if (!utils.__key_in_object(kwargs, 'inplace')) {
      kwargs['inplace'] = false;
    }

    if (!utils.__key_in_object(kwargs, 'drop')) {
      kwargs['drop'] = true;
    }

    if (Array.isArray(kwargs['key']) && kwargs['key'].length != this.index.length) {
      throw Error(`Index LengthError: Lenght of new Index array ${kwargs['key'].length} must match lenght of existing index ${this.index.length}`);
    }

    if (typeof kwargs['key'] == "string" && this.column_names.includes(kwargs['key'])) {
      kwargs['key_name'] = kwargs['key'];
      kwargs['key'] = this[kwargs['key']].values;
    }

    if (kwargs['inplace']) {
      this.__set_index(kwargs['key']);

      if (kwargs['drop'] && typeof kwargs['key_name'] == 'string') {
        this.drop({
          columns: [kwargs['key_name']],
          inplace: true,
          axis: 1
        });
      }
    } else {
      let df = this.copy();

      df.__set_index(kwargs['key']);

      if (kwargs['drop'] && typeof kwargs['key_name'] == 'string') {
        df.drop({
          columns: [kwargs['key_name']],
          axis: 1,
          inplace: true
        });
      }

      return df;
    }
  }

  describe() {
    let numeric_df = this.select_dtypes(['float32', 'int32']);
    let col_names = numeric_df.column_names;
    let index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'];
    let stats_arr = {};
    col_names.forEach(name => {
      let col_series = numeric_df[name];
      let count = col_series.count();
      let mean = col_series.mean();
      let std = col_series.std();
      let min = col_series.min();
      let median = col_series.median();
      let max = col_series.max();
      let variance = col_series.var();
      let _stats = [count, mean, std, min, median, max, variance];
      stats_arr[name] = _stats;
    });
    let df = new DataFrame(stats_arr, {
      "index": index
    });
    return df.round(6);
  }

  select_dtypes(include) {
    let dtypes = this.dtypes;
    let col_names = this.column_names;
    let col_vals = {};
    let original_col_vals = this.col_data;
    const __supported_dtypes = ['float32', "int32", 'string', 'boolean'];

    if (include == undefined) {
      let df = this.copy();
      return df;
    } else {
      include.forEach(type => {
        if (!__supported_dtypes.includes(type)) {
          throw Error(`Dtype Error: dtype ${type} not supported.`);
        }
      });
      dtypes.forEach((dtype, i) => {
        if (include.includes(dtype)) {
          col_vals[col_names[i]] = original_col_vals[i];
        }
      });
      let df = new DataFrame(col_vals);
      return df;
    }
  }

  sum(kwargs = {
    axis: 1
  }) {
    if (this.__frame_is_compactible_for_operation()) {
      let values;
      let val_sums = [];

      if (kwargs['axis'] == 1) {
        values = this.col_data;
      } else {
        values = this.values;
      }

      values.map(arr => {
        let temp_sum = tf.tensor(arr).sum().arraySync();
        val_sums.push(Number(temp_sum.toFixed(5)));
      });
      let new_index;

      if (kwargs['axis'] == 1) {
        new_index = this.column_names;
      } else {
        new_index = this.index;
      }

      let sf = new _series.Series(val_sums, {
        columns: "sum",
        index: new_index
      });
      return sf;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  abs() {
    let data = this.values;
    let tensor_data = tf.tensor(data);
    let abs_data = tensor_data.abs().arraySync();
    let df = new DataFrame(utils.__round(abs_data, 2, false), {
      columns: this.column_names,
      index: this.index
    });
    return df;
  }

  __get_tensor_and_idx(df, axis) {
    let tensor_vals, idx, t_axis;

    if (axis == 1) {
      tensor_vals = df.row_data_tensor;
      idx = df.column_names;
      t_axis = 0;
    } else {
      tensor_vals = df.row_data_tensor;
      idx = df.index;
      t_axis = 1;
    }

    return [tensor_vals, idx, t_axis];
  }

  query(kwargs) {
    let operators = [">", "<", "<=", ">=", "==", "!="];

    if (!utils.__key_in_object(kwargs, "inplace")) {
      kwargs['inplace'] = false;
    }

    let column_index, operator, value;

    if (utils.__key_in_object(kwargs, "column")) {
      if (this.columns.includes(kwargs["column"])) {
        column_index = this.columns.indexOf(kwargs["column"]);
      } else {
        throw new Error(`column ${kwargs["column"]} does not exist`);
      }
    } else {
      throw new Error("specify the column");
    }

    if (utils.__key_in_object(kwargs, "is")) {
      if (operators.includes(kwargs["is"])) {
        operator = kwargs["is"];
      } else {
        throw new Error(` ${kwargs["is"]} is not a supported logical operator`);
      }
    } else {
      throw new Error("specify an operator in param [is]");
    }

    if (utils.__key_in_object(kwargs, "to")) {
      value = kwargs["to"];
    } else {
      throw new Error("specify a value in param [to]");
    }

    let data = this.values;
    let index = this.index;
    let new_data = [];
    let new_index = [];

    for (var i = 0; i < data.length; i++) {
      let data_value = data[i];
      let elem = data_value[column_index];

      if (eval(`elem${operator}value`)) {
        new_data.push(data_value);
        new_index.push(index[i]);
      }
    }

    if (new_data.length == 0) {
      throw new Error(`query returned empty data; is either ${value} does not exist in column ${kwargs["column"]}`);
    }

    if (kwargs['inplace']) {
      this.__update_frame_in_place(new_data, this.columns, null, new_index, null);
    } else {
      let new_df = new DataFrame(new_data, {
        "columns": this.columns,
        index: new_index
      });
      return new_df;
    }
  }

  addColumn(kwargs) {
    utils.__in_object(kwargs, "column", "column name not specified");

    utils.__in_object(kwargs, "value", "column value not specified");

    let column_name = kwargs["column"];
    let data_length = this.shape[0];
    let value;

    if (kwargs['value'] instanceof _series.Series) {
      value = kwargs['value'].values;
    } else {
      value = kwargs["value"];
    }

    if (value.length != data_length) {
      throw new Error(`Array length ${value.length} not equal to ${data_length}`);
    }

    if (this.columns.includes(column_name)) {
      let col_idx = this.columns.indexOf(column_name);
      let new_data = [];
      this.values.map((val, index) => {
        let new_val = val.slice();
        new_val[col_idx] = value[index];
        new_data.push(new_val);
      });

      this.__update_frame_in_place(new_data, null, null, null, null);
    } else {
      let data = this.values;
      let new_data = [];
      data.map(function (val, index) {
        let new_val = val.slice();
        new_val.push(value[index]);
        new_data.push(new_val);
      });
      let new_dtypes = [...this.dtypes];
      new_dtypes.push(utils.__get_t(value)[0]);
      let new_col_names = [...this.columns];
      new_col_names.push(column_name);

      this.__update_frame_in_place(new_data, new_col_names, null, null, new_dtypes);

      Object.defineProperty(this, column_name, {
        get() {
          return new _series.Series(value, {
            columns: column_name,
            index: this.index
          });
        },

        set(value) {
          this.addColumn({
            column: column_name,
            value: value
          });
        }

      });
    }
  }

  groupby(col) {
    let len = this.shape[0];
    let column_names = this.column_names;
    let col_dict = {};
    let key_column = null;

    if (col.length == 2) {
      if (column_names.includes(col[0])) {
        var [data1, col_name1] = (0, _indexing.indexLoc)(this, {
          "rows": [`0:${len}`],
          "columns": [`${col[0]}`],
          "type": "loc"
        });
      } else {
        throw new Error(`column ${col[0]} does not exist`);
      }

      if (column_names.includes(col[1])) {
        var [data2, col_name2] = (0, _indexing.indexLoc)(this, {
          "rows": [`0:${len}`],
          "columns": [`${col[1]}`],
          "type": "loc"
        });
      } else {
        throw new Error(`column ${col[1]} does not exist`);
      }

      key_column = [col[0], col[1]];

      var column_1_Unique = utils.__unique(data1);

      var column_2_unique = utils.__unique(data2);

      for (var i = 0; i < column_1_Unique.length; i++) {
        let col_value = column_1_Unique[i];
        col_dict[col_value] = {};

        for (var j = 0; j < column_2_unique.length; j++) {
          let col2_value = column_2_unique[j];
          col_dict[col_value][col2_value] = [];
        }
      }
    } else {
      if (column_names.includes(col[0])) {
        var [data1, col_name1] = (0, _indexing.indexLoc)(this, {
          "rows": [`0:${len}`],
          "columns": [`${col[0]}`],
          "type": "loc"
        });
      } else {
        throw new Error(`column ${col[0]} does not exist`);
      }

      key_column = [col[0]];

      var column_Unique = utils.__unique(data1);

      for (let i = 0; i < column_Unique.length; i++) {
        let col_value = column_Unique[i];
        col_dict[col_value] = [];
      }
    }

    let groups = new _groupby.GroupBy(col_dict, key_column, this.values, column_names).group();
    return groups;
  }

  column(col_name) {
    if (!this.columns.includes(col_name)) {
      throw new Error(`column ${col_name} does not exist`);
    }

    let col_indx_objs = utils.__arr_to_obj(this.columns);

    let indx = col_indx_objs[col_name];
    let data = this.col_data[indx];
    return new _series.Series(data, {
      columns: [col_name]
    });
  }

  fillna(kwargs = {}) {
    let params_needed = ["columns", "values", "inplace"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    if (!utils.__key_in_object(kwargs, "inplace")) {
      kwargs['inplace'] = false;
    }

    if (utils.__key_in_object(kwargs, "columns")) {
      kwargs['columns'].map(col => {
        if (!this.column_names.includes(col)) {
          throw Error(`Value Error: Specified columns must be one of ${this.column_names}, got ${col}`);
        }
      });

      if (kwargs['columns'].length != kwargs['values'].length) {
        throw Error(`Lenght Error: The lenght of the columns names must be equal to the lenght of the values,
                 got column of length ${kwargs['columns'].length} but values of length ${kwargs['values'].length}`);
      }

      let new_col_data = this.col_data;
      kwargs['columns'].map((col, i) => {
        let col_idx = this.column_names.indexOf(col);
        let col_data = this.col_data[col_idx];
        let __temp = [];
        col_data.map(val => {
          if (isNaN(val) && typeof val != "string") {
            __temp.push(kwargs['values'][i]);
          } else {
            __temp.push(val);
          }
        });
        new_col_data[col_idx] = __temp;
      });
      let final_data = {};
      new_col_data.map((col, i) => {
        final_data[this.column_names[i]] = col;
      });

      if (kwargs['inplace']) {
        this.__update_frame_in_place(null, null, final_data, null, null);
      } else {
        return new DataFrame(final_data, {
          index: this.index
        });
      }
    } else {
      if (!utils.__key_in_object(kwargs, "values")) {
        throw Error("Value Error: Please specify a fill value");
      }

      let nan_val;

      if (Array.isArray(kwargs['values'])) {
        nan_val = kwargs['values'][0];
      } else {
        nan_val = kwargs["values"];
      }

      let data = [];
      let values = this.values;
      let columns = this.columns;

      for (let i = 0; i < values.length; i++) {
        let temp_data = [];
        let row_value = values[i];

        for (let j = 0; j < row_value.length; j++) {
          if (isNaN(row_value[j]) && typeof row_value[j] != "string") {
            temp_data.push(nan_val);
          } else {
            temp_data.push(row_value[j]);
          }
        }

        data.push(temp_data);
      }

      if (kwargs['inplace']) {
        this.__update_frame_in_place(data, null, null, null, null);
      } else {
        return new DataFrame(data, {
          columns: columns,
          index: this.index
        });
      }
    }
  }

  isna() {
    let new_row_data = this.__isna();

    let columns = this.column_names;
    return new DataFrame(new_row_data, {
      columns: columns,
      index: this.index
    });
  }

  nanIndex() {
    let df_values = this.values;
    let index_data = [];

    for (let i = 0; i < df_values.length; i++) {
      let row_values = df_values[i];

      if (row_values.includes(NaN)) {
        index_data.push(i);
      }
    }

    return index_data;
  }

  dropna(kwargs = {}) {
    let axis = kwargs["axis"] || 0;
    let inplace = kwargs["inplace"] || false;

    if (axis != 0 && axis != 1) {
      throw new Error("axis must either be 1 or 0");
    }

    let df_values = null;
    let columns = null;

    if (axis == 0) {
      df_values = this.values;
      columns = this.columns;
    } else {
      df_values = this.col_data;
      columns = [];
    }

    let data = [];

    for (let i = 0; i < df_values.length; i++) {
      let values = df_values[i];

      if (!values.includes(NaN)) {
        if (axis == 0) {
          data.push(values);
        } else {
          columns.push(this.columns[i]);

          if (data.length == 0) {
            for (let j = 0; j < values.length; j++) {
              data.push([values[j]]);
            }
          } else {
            for (let j = 0; j < data.length; j++) {
              data[j].push(values[j]);
            }
          }
        }
      }
    }

    if (inplace == true) {
      this.data = data;

      this.__reset_index();

      this.columns = columns;
    } else {
      return new DataFrame(data, {
        columns: columns
      });
    }
  }

  apply(kwargs) {
    let is_callable = utils.__is_function(kwargs["callable"]);

    if (!is_callable) {
      throw new Error("the arguement most be a function");
    }

    let callable = kwargs["callable"];
    let data = [];

    if (utils.__key_in_object(kwargs, "axis")) {
      let axis = kwargs["axis"];
      let df_data;

      if (axis == 0) {
        df_data = this.values;
      } else {
        df_data = this.col_data;
      }

      for (let i = 0; i < df_data.length; i++) {
        let value = tf.tensor(df_data[i]);
        let callable_data;

        try {
          callable_data = callable(value).arraySync();
        } catch (error) {
          throw Error(`Callable Error: You can only apply JavaScript functions on DataFrames when axis is not specified. This operation is applied on all element, and returns a DataFrame of the same shape.`);
        }

        data.push(callable_data);
      }
    } else {
      let df_data = this.values;
      let new_data = [];
      df_data.forEach(row => {
        let new_row = [];
        row.forEach(val => {
          new_row.push(callable(val));
        });
        new_data.push(new_row);
      });
      data = new_data;
    }

    if (utils.__is_1D_array(data)) {
      if (kwargs['axis'] == 0) {
        let sf = new _series.Series(data, {
          index: this.index
        });
        return sf;
      } else {
        let sf = new _series.Series(data, {
          index: this.column_names
        });
        return sf;
      }
    } else {
      let df = new DataFrame(data, {
        columns: this.column_names,
        index: this.index
      });
      return df;
    }
  }

  lt(other, axis) {
    if (this.__frame_is_compactible_for_operation()) {
      if (axis == undefined) {
        axis = 0;
      }

      let df = this.__logical_ops(other, "lt", axis);

      return df;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  gt(other, axis) {
    if (this.__frame_is_compactible_for_operation()) {
      if (axis == undefined) {
        axis = 0;
      }

      let df = this.__logical_ops(other, "gt", axis);

      return df;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  le(other, axis) {
    if (this.__frame_is_compactible_for_operation()) {
      if (axis == undefined) {
        axis = 0;
      }

      let df = this.__logical_ops(other, "le", axis);

      return df;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  ge(other, axis) {
    if (this.__frame_is_compactible_for_operation()) {
      if (axis == undefined) {
        axis = 0;
      }

      let df = this.__logical_ops(other, "ge", axis);

      return df;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  ne(other, axis) {
    if (this.__frame_is_compactible_for_operation()) {
      if (axis == undefined) {
        axis = 0;
      }

      let df = this.__logical_ops(other, "ne", axis);

      return df;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  eq(other, axis) {
    if (this.__frame_is_compactible_for_operation()) {
      if (axis == undefined) {
        axis = 0;
      }

      let df = this.__logical_ops(other, "eq", axis);

      return df;
    } else {
      throw Error("Dtype Error: Operation can not be performed on string type");
    }
  }

  replace(kwargs = {}) {
    let params_needed = ["replace", "with", "in"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    if (utils.__key_in_object(kwargs, "in")) {
      kwargs['in'].map(col => {
        if (!this.column_names.includes(col)) {
          throw Error(`Value Error: Specified columns must be one of ${this.column_names}, got ${col}`);
        }
      });

      if (utils.__key_in_object(kwargs, "replace") && utils.__key_in_object(kwargs, "with")) {
        let new_col_data_obj = {};
        this.column_names.map((col, idx) => {
          if (kwargs['in'].includes(col)) {
            let temp_col_data = this.col_data[idx];
            let __temp = [];
            temp_col_data.map(val => {
              if (val == kwargs['replace']) {
                __temp.push(kwargs['with']);
              } else {
                __temp.push(val);
              }
            });
            new_col_data_obj[col] = __temp;
          } else {
            new_col_data_obj[col] = this.col_data[idx];
          }
        });
        return new DataFrame(new_col_data_obj, {
          columns: this.column_names,
          index: this.index
        });
      } else {
        throw Error("Params Error: Must specify both 'replace' and 'with' parameters.");
      }
    } else {
      if (utils.__key_in_object(kwargs, "replace") && utils.__key_in_object(kwargs, "with")) {
        let replaced_arr = [];
        let old_arr = this.values;
        old_arr.map(inner_arr => {
          let temp = [];
          inner_arr.map(val => {
            if (val == kwargs['replace']) {
              temp.push(kwargs['with']);
            } else {
              temp.push(val);
            }
          });
          replaced_arr.push(temp);
        });
        let df = new DataFrame(replaced_arr, {
          index: this.index,
          columns: this.column_names
        });
        return df;
      } else {
        throw Error("Params Error: Must specify both 'replace' and 'with' parameters.");
      }
    }
  }

  __logical_ops(val, logical_type, axis) {
    let int_vals, other;

    if (utils.__is_number(val)) {
      other = val;
    } else {
      if (val.series) {
        if (axis == 0) {
          if (val.values.length != this.shape[0]) {
            throw Error(`Shape Error: Operands could not be broadcast together with shapes ${this.shape} and ${val.values.length}.`);
          }

          other = tf.tensor(val.values);
        } else {
          if (val.values.length != this.shape[1]) {
            throw Error(`Shape Error: Operands could not be broadcast together with shapes ${this.shape} and ${val.values.length}.`);
          }

          other = tf.tensor(val.values);
        }
      } else if (Array.isArray(val)) {
        other = tf.tensor(val);
      } else {
        other = val.row_data_tensor;
      }
    }

    switch (logical_type) {
      case "lt":
        int_vals = tf.tensor(this.values).less(other).arraySync();
        break;

      case "gt":
        int_vals = tf.tensor(this.values).greater(other).arraySync();
        break;

      case "le":
        int_vals = tf.tensor(this.values).lessEqual(other).arraySync();
        break;

      case "ge":
        int_vals = tf.tensor(this.values).greaterEqual(other).arraySync();
        break;

      case "ne":
        int_vals = tf.tensor(this.values).notEqual(other).arraySync();
        break;

      case "eq":
        int_vals = tf.tensor(this.values).equal(other).arraySync();
        break;
    }

    let bool_vals = utils.__map_int_to_bool(int_vals, 2);

    let df = new DataFrame(bool_vals, {
      columns: this.column_names,
      index: this.index
    });
    return df;
  }

  __get_df_from_tensor(val, col_names) {
    let len = val.shape[0];
    let new_array = [];

    for (let i = 0; i < len; i++) {
      let arr = val.slice([i], [1]).arraySync()[0];
      new_array.push(arr);
    }

    return new DataFrame(new_array, {
      columns: col_names
    });
  }

  __frame_is_compactible_for_operation() {
    let dtypes = this.dtypes;

    const str = element => element == "string";

    if (dtypes.some(str)) {
      return false;
    } else {
      return true;
    }
  }

  __get_ops_tensors(tensors, axis) {
    if (utils.__is_undefined(tensors[1].series)) {
      let tensors_arr = [];

      if (utils.__is_undefined(axis) || axis == 1) {
        tensors_arr.push(tensors[0].row_data_tensor);
        tensors_arr.push(tensors[1]);
        return tensors_arr;
      } else {
        tensors_arr.push(tensors[0].col_data_tensor);
        tensors_arr.push(tensors[1]);
        return tensors_arr;
      }
    } else {
      let tensors_arr = [];

      if (utils.__is_undefined(axis) || axis == 1) {
        let this_tensor, other_tensor;
        this_tensor = tensors[0].row_data_tensor;

        if (tensors[1].series) {
          other_tensor = tf.tensor(tensors[1].values, [1, tensors[1].values.length]);
        } else {
          other_tensor = tensors[1].row_data_tensor;
        }

        tensors_arr.push(this_tensor);
        tensors_arr.push(other_tensor);
        return tensors_arr;
      } else {
        let this_tensor, other_tensor;
        this_tensor = tensors[0].row_data_tensor;

        if (tensors[1].series) {
          other_tensor = tf.tensor(tensors[1].values, [tensors[1].values.length, 1]);
        } else {
          other_tensor = tensors[1].row_data_tensor;
        }

        tensors_arr.push(this_tensor);
        tensors_arr.push(other_tensor);
        return tensors_arr;
      }
    }
  }

  transpose() {
    let new_values = this.col_data;
    let new_index = this.column_names;
    let new_col_names = this.index;
    let df = new DataFrame(new_values, {
      columns: new_col_names,
      index: new_index
    });
    return df;
  }

  get T() {
    return this.transpose();
  }

  get ctypes() {
    let cols = this.column_names;
    let d_types = this.col_types;
    let sf = new _series.Series(d_types, {
      index: cols
    });
    return sf;
  }

  plot(div) {
    const plt = new _plot.Plot(this, div);
    return plt;
  }

  get tensor() {
    return this.row_data_tensor;
  }

  astype(kwargs = {}) {
    if (!utils.__key_in_object(kwargs, "column")) {
      throw Error("Value Error: Please specify a column to cast");
    }

    if (!utils.__key_in_object(kwargs, "dtype")) {
      throw Error("Value Error: Please specify dtype to cast to");
    }

    if (!this.column_names.includes(kwargs['column'])) {
      throw Error(`'${kwargs['column']}' not found in columns`);
    }

    let col_idx = this.column_names.indexOf(kwargs['column']);
    let new_types = this.col_types;
    let col_values = this.col_data;
    new_types[col_idx] = kwargs['dtype'];
    let new_col_values = [];
    let temp_col = col_values[col_idx];

    switch (kwargs['dtype']) {
      case "float32":
        temp_col.map(val => {
          new_col_values.push(Number(val));
        });
        col_values[col_idx] = new_col_values;
        break;

      case "int32":
        temp_col.map(val => {
          new_col_values.push(Number(Number(val).toFixed()));
        });
        col_values[col_idx] = new_col_values;
        break;

      case "string":
        temp_col.map(val => {
          new_col_values.push(String(val));
        });
        col_values[col_idx] = new_col_values;
        break;

      default:
        break;
    }

    let new_col_obj = {};
    this.column_names.forEach((cname, i) => {
      new_col_obj[cname] = col_values[i];
    });
    let df = new DataFrame(new_col_obj, {
      dtypes: new_types,
      index: this.index
    });
    return df;
  }

  unique(axis = 1) {
    if (axis == undefined || axis > 1 || axis < 0) {
      throw Error(`Axis Error: Please specify a correct axis. Axis must either be '0' or '1', got ${axis}`);
    }

    let _unique = {};

    if (axis == 1) {
      let col_names = this.column_names;
      col_names.forEach(cname => {
        _unique[cname] = this[cname].unique().values;
      });
    } else {
      let rows = this.values;
      let _index = this.index;
      rows.forEach((row, i) => {
        let data_set = new Set(row);
        _unique[_index[i]] = Array.from(data_set);
      });
    }

    return _unique;
  }

  nunique(axis = 1) {
    if (axis == undefined || axis > 1 || axis < 0) {
      throw Error(`Axis Error: Please specify a correct axis. Axis must either be '0' or '1', got ${axis}`);
    }

    let _nunique = [];

    if (axis == 1) {
      let col_names = this.column_names;
      col_names.forEach(cname => {
        _nunique.push(this[cname].unique().values.length);
      });
      let sf = new _series.Series(_nunique, {
        index: this.column_names
      });
      return sf;
    } else {
      let rows = this.values;
      rows.forEach(row => {
        let data_set = new Set(row);

        _nunique.push(Array.from(data_set).length);
      });
    }

    let sf = new _series.Series(_nunique, {
      index: this.index
    });
    return sf;
  }

  rename(kwargs = {}) {
    let params_needed = ["mapper", "inplace", "axis"];

    utils._throw_wrong_params_error(kwargs, params_needed);

    if (!utils.__key_in_object(kwargs, "inplace")) {
      kwargs['inplace'] = false;
    }

    if (!utils.__key_in_object(kwargs, "axis")) {
      kwargs['axis'] = 1;
    }

    if (!utils.__key_in_object(kwargs, "mapper")) {
      throw Error("Please specify a mapper object");
    }

    if (kwargs['axis'] == 1) {
      let old_col_names = Object.keys(kwargs['mapper']);
      let new_col_names = Object.values(kwargs['mapper']);
      let col_names = [...this.column_names];
      old_col_names.forEach((cname, i) => {
        if (!col_names.includes(cname)) {
          throw Error(`Label Error: Specified column '${cname}' not found in column axis`);
        }

        let idx = col_names.indexOf(cname);
        col_names[idx] = new_col_names[i];
      });

      if (kwargs['inplace']) {
        this.columns = col_names;

        this.__set_col_property(this, this.col_data, col_names, old_col_names);
      } else {
        let df = this.copy();
        df.columns = col_names;

        df.__set_col_property(df, df.col_data, col_names, old_col_names);

        return df;
      }
    } else {
      let old_index = Object.keys(kwargs['mapper']);
      let row_index = this.index;
      let new_index = [];
      row_index.forEach(idx => {
        if (old_index.includes(idx)) {
          new_index.push(kwargs['mapper'][idx]);
        } else {
          new_index.push(idx);
        }
      });

      if (kwargs['inplace']) {
        this.__set_index(new_index);
      } else {
        let df = this.copy();

        df.__set_index(new_index);

        return df;
      }
    }
  }

  sort_index(kwargs = {}) {
    let inplace = typeof kwargs["inplace"] == "undefined" ? false : kwargs["inplace"];
    let asc = typeof kwargs["ascending"] == "undefined" ? true : kwargs["ascending"];
    let index_val = this.index;

    let [data, index] = this.__sort_by(index_val, index_val, asc);

    if (inplace) {
      this.__update_frame_in_place(data, null, null, index, null);
    } else {
      let df = this.copy();

      df.__update_frame_in_place(data, null, null, index, null);

      return df;
    }
  }

  sort_values(kwargs = {}) {
    if (!utils.__key_in_object(kwargs, "by")) {
      throw Error(`use col_name to specify column name`);
    }

    let inplace = typeof kwargs["inplace"] == "undefined" ? false : kwargs["inplace"];
    let asc = typeof kwargs["ascending"] == "undefined" ? true : kwargs["ascending"];
    let index_val = this.index;
    let column_val = this.column(kwargs["by"]).values;

    let [data, index] = this.__sort_by(column_val, index_val, asc);

    if (inplace) {
      this.__update_frame_in_place(data, null, null, index, null);
    } else {
      let df = this.copy();

      df.__update_frame_in_place(data, null, null, index, null);

      return df;
    }
  }

  __set_col_property(self, col_vals, col_names, old_col_names) {
    old_col_names.forEach(name => {
      delete self[name];
    });
    col_vals.forEach((col, i) => {
      Object.defineProperty(self, col_names[i], {
        get() {
          return new _series.Series(col, {
            columns: col_names[i],
            index: self.index
          });
        },

        set(value) {
          this.addColumn({
            column: col_names[i],
            value: value
          });
        }

      });
    });
  }

  __update_frame_in_place(row_data, column_names, col_obj, index, dtypes) {
    if (row_data != undefined) {
      this.data = row_data;
    } else {
      if (col_obj != undefined) {
        let _res = utils._get_row_and_col_values(col_obj);

        this.data = _res[0];
        this.columns = _res[1];
        column_names = _res[1];
      }
    }

    if (col_obj != undefined) {
      this.col_data = Object.values(col_obj);
      this.columns = Object.keys(col_obj);
      column_names = Object.keys(col_obj);
    } else {
      if (row_data != undefined) {
        this.col_data = utils.__get_col_values(row_data);
      }
    }

    if (column_names != undefined) {
      this.columns = column_names;
    }

    if (index != undefined) {
      this.index_arr = index;
    }

    if (dtypes != undefined) {
      this.col_types = dtypes;
    }
  }

  __sort_by(col_value, df_index, asc) {
    let values = this.values;

    let sorted_val = utils.__sort(col_value, asc);

    let duplicate_obj = utils.__get_duplicate(col_value);

    let data = [];
    let indexs = [];

    for (let row_i = 0; row_i < sorted_val.length; row_i++) {
      let val = sorted_val[row_i];
      let index = null;

      if (duplicate_obj.hasOwnProperty(val)) {
        index = duplicate_obj[val]["index"][0];
        duplicate_obj[val]["index"].splice(0, 1);
      } else {
        index = col_value.indexOf(val);
      }

      data.push(values[index]);
      indexs.push(df_index[index]);
    }

    return [data, indexs];
  }

  append(val) {
    let df2 = null;

    if (Array.isArray(val)) {
      if (Array.isArray(val[0])) {
        if (val[0].length != this.shape[1]) {
          throw Error(`length Mixmatch: The lenght of provided value (${val.length}) does not match the original DataFrame (${this.shape[1]})`);
        }

        df2 = new DataFrame(val);
      }
    } else if (utils.__is_object(val)) {
      df2 = new DataFrame(val);
    } else if (val instanceof DataFrame) {
      df2 = val.copy();
    }

    let concat_df = (0, _concat.concat)({
      df_list: [this, df2],
      axis: 0
    });
    return concat_df;
  }

}

exports.DataFrame = DataFrame;
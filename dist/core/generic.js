"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

var _table = require("table");

var _utils = require("./utils");

var _config = require("../config/config");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();
const config = new _config.Configs();

class NDframe {
  constructor(data, kwargs = {}) {
    this.kwargs = kwargs;

    if (data instanceof tf.Tensor) {
      data = data.arraySync();
    }

    if (utils.__is_1D_array(data)) {
      this.series = true;

      this._read_array(data);
    } else {
      this.series = false;

      if (utils.__is_object(data[0])) {
        this._read_object(data, 1);
      } else if (utils.__is_object(data)) {
        this._read_object(data, 2);
      } else if (Array.isArray(data[0]) || utils.__is_number(data[0]) || utils.__is_string(data[0])) {
        this._read_array(data);
      } else {
        throw new Error("File format not supported");
      }
    }
  }

  _read_array(data) {
    this.data = utils.__replace_undefined_with_NaN(data, this.series);
    this.row_data_tensor = tf.tensor(this.data);

    if (this.series) {
      this.col_data = [this.values];
    } else {
      this.col_data = utils.__get_col_values(this.data);
    }

    this.col_data_tensor = tf.tensor(this.col_data);

    if ('index' in this.kwargs) {
      this.__set_index(this.kwargs['index']);
    } else {
      this.index_arr = [...Array(this.row_data_tensor.shape[0]).keys()];
    }

    if (this.ndim == 1) {
      if ('columns' in this.kwargs) {
        this.columns = this.kwargs['columns'];
      } else {
        this.columns = ["0"];
      }
    } else {
      if ('columns' in this.kwargs) {
        if (this.kwargs['columns'].length == Number(this.row_data_tensor.shape[1])) {
          this.columns = this.kwargs['columns'];
        } else {
          throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has lenght of ${this.row_data_tensor.shape[1]}`;
        }
      } else {
        this.columns = [...Array(this.row_data_tensor.shape[1]).keys()];
      }
    }

    if ('dtypes' in this.kwargs) {
      this._set_col_types(this.kwargs['dtypes'], false);
    } else {
      this._set_col_types(null, true);
    }
  }

  _read_object(data, type) {
    if (type == 2) {
      let [row_arr, col_names] = utils._get_row_and_col_values(data);

      this.kwargs['columns'] = col_names;

      this._read_array(row_arr);
    } else {
      let data_arr = data.map(item => {
        return Object.values(item);
      });
      this.data = utils.__replace_undefined_with_NaN(data_arr, this.series);
      this.row_data_tensor = tf.tensor(this.data);
      this.kwargs['columns'] = Object.keys(Object.values(data)[0]);

      if (this.series) {
        this.col_data = [this.values];
      } else {
        this.col_data = utils.__get_col_values(this.data);
      }

      this.col_data_tensor = tf.tensor(this.col_data);

      if ('index' in this.kwargs) {
        this.__set_index(this.kwargs['index']);
      } else {
        this.index_arr = [...Array(this.row_data_tensor.shape[0]).keys()];
      }

      if (this.ndim == 1) {
        if (!this.kwargs['columns']) {
          this.columns = ["0"];
        } else {
          this.columns = this.kwargs['columns'];
        }
      } else {
        if ('columns' in this.kwargs) {
          if (this.kwargs['columns'].length == Number(this.row_data_tensor.shape[1])) {
            this.columns = this.kwargs['columns'];
          } else {
            throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has column length of ${this.row_data_tensor.shape[1]}`;
          }
        } else {
          this.columns = [...Array(this.row_data_tensor.shape[1]).keys()];
        }
      }

      if ('dtypes' in this.kwargs) {
        this._set_col_types(this.kwargs['dtypes'], false);
      } else {
        this._set_col_types(null, true);
      }
    }
  }

  _set_col_types(dtypes, infer) {
    const __supported_dtypes = ['float32', "int32", 'string', 'boolean'];

    if (infer) {
      if (this.series) {
        this.col_types = utils.__get_t(this.values);
      } else {
        this.col_types = utils.__get_t(this.col_data);
      }
    } else {
      if (this.series) {
        this.col_types = dtypes;
      } else {
        if (dtypes.length != this.columns.length) {
          throw new Error(`length Mixmatch: Length of specified dtypes is ${dtypes.length}, but length of columns is ${this.columns.length}`);
        }

        if (Array.isArray(dtypes)) {
          dtypes.forEach((type, indx) => {
            if (!__supported_dtypes.includes(type)) {
              throw new Error(`dtype error: dtype specified at index ${indx} is not supported`);
            }
          });
          this.col_types = dtypes;
        } else {
          throw new Error(`dtypes must be an Array of types`);
        }
      }
    }
  }

  get dtypes() {
    return this.col_types;
  }

  get ndim() {
    if (this.series) {
      return 1;
    } else {
      return this.row_data_tensor.shape.length;
    }
  }

  get axes() {
    let axes = {
      "index": this.index,
      "columns": this.columns
    };
    return axes;
  }

  get index() {
    return this.index_arr;
  }

  __set_index(labels) {
    if (!Array.isArray(labels)) {
      throw Error("Value Error: index must be an array");
    }

    if (labels.length > this.shape[0] || labels.length < this.shape[0]) {
      throw Error("Value Error: length of labels must match row shape of data");
    }

    this.index_arr = labels;
  }

  __reset_index() {
    let new_idx = [...Array(this.values.length).keys()];
    this.index_arr = new_idx;
  }

  get shape() {
    if (this.series) {
      return [this.values.length, 1];
    } else {
      return this.row_data_tensor.shape;
    }
  }

  get values() {
    return this.data;
  }

  get column_names() {
    return this.columns;
  }

  __isna() {
    let new_arr = [];

    if (this.series) {
      this.values.map(val => {
        if (val == NaN) {
          new_arr.push(true);
        } else if (isNaN(val) && typeof val != "string") {
          new_arr.push(true);
        } else {
          new_arr.push(false);
        }
      });
    } else {
      let row_data = this.values;
      row_data.map(arr => {
        let temp_arr = [];
        arr.map(val => {
          if (val == NaN) {
            temp_arr.push(true);
          } else if (isNaN(val) && typeof val != "string") {
            temp_arr.push(true);
          } else {
            temp_arr.push(false);
          }
        });
        new_arr.push(temp_arr);
      });
    }

    return new_arr;
  }

  get size() {
    return this.row_data_tensor.size;
  }

  async to_csv() {
    if (this.series) {
      let csv = this.values.join(",");
      return csv;
    } else {
      let records = this.values;
      let header = this.column_names.join(",");
      let csv_str = `${header}\n`;
      records.forEach(val => {
        let row = `${val.join(",")}\n`;
        csv_str += row;
      });
      return csv_str;
    }
  }

  async to_json() {
    if (this.series) {
      let obj = {};
      obj[this.column_names[0]] = this.values;
      let json = JSON.stringify(obj);
      return json;
    } else {
      let values = this.values;
      let header = this.column_names;
      let json_arr = [];
      values.forEach(val => {
        let obj = {};
        header.forEach((h, i) => {
          obj[h] = val[i];
        });
        json_arr.push(obj);
      });
      return JSON.stringify(json_arr);
    }
  }

  toString() {
    let table_width = config.get_width;
    let table_truncate = config.get_truncate;
    let max_row = config.get_max_row;
    let max_col_in_console = config.get_max_col_in_console;
    let data_arr = [];
    let table_config = {};
    let col_len = this.columns.length;
    let header = [];

    if (col_len > max_col_in_console) {
      let first_4_cols = this.columns.slice(0, 4);
      let last_3_cols = this.columns.slice(col_len - 4);
      header = [""].concat(first_4_cols).concat(["..."]).concat(last_3_cols);
      let sub_idx, values_1, value_2;

      if (this.values.length > max_row) {
        let df_subset_1 = this.iloc({
          rows: [`0:${max_row}`],
          columns: ["0:4"]
        });
        let df_subset_2 = this.iloc({
          rows: [`0:${max_row}`],
          columns: [`${col_len - 4}:`]
        });
        sub_idx = this.index.slice(0, max_row);
        values_1 = df_subset_1.values;
        value_2 = df_subset_2.values;
      } else {
        let df_subset_1 = this.iloc({
          rows: ["0:"],
          columns: ["0:4"]
        });
        let df_subset_2 = this.iloc({
          rows: ["0:"],
          columns: [`${col_len - 4}:`]
        });
        sub_idx = this.index.slice(0, max_row);
        values_1 = df_subset_1.values;
        value_2 = df_subset_2.values;
      }

      sub_idx.map((val, i) => {
        let row = [val].concat(values_1[i]).concat(["..."]).concat(value_2[i]);
        data_arr.push(row);
      });
    } else {
      header = [""].concat(this.columns);
      let idx, values;

      if (this.values.length > max_row) {
        let data = this.loc({
          rows: [`0:${max_row}`],
          columns: this.columns
        });
        idx = data.index;
        values = data.values;
      } else {
        values = this.values;
        idx = this.index;
      }

      idx.forEach((val, i) => {
        let row = [val].concat(values[i]);
        data_arr.push(row);
      });
    }

    table_config[0] = 10;

    for (let index = 1; index < header.length; index++) {
      table_config[index] = {
        width: table_width,
        truncate: table_truncate
      };
    }

    let table_data = [header].concat(data_arr);
    return (0, _table.table)(table_data, {
      columns: table_config
    });
  }

  print() {
    console.log(this + "");
  }

}

exports.default = NDframe;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

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

    if (utils.__is_1D_array(data)) {
      this.series = true;

      this.__read_array(data);
    } else {
      this.series = false;

      if (utils.__is_object(data[0])) {
        this.__read_object(data);
      } else if (Array.isArray(data[0]) || utils.__is_number(data[0]) || utils.__is_string(data[0])) {
        this.__read_array(data);
      } else {
        throw "File format not supported for now";
      }
    }
  }

  __read_array(data) {
    this.data = data;
    this.data_tensor = tf.tensor(data);

    if (this.ndim == 1) {
      if (!utils.__key_in_object(this.kwargs, 'columns')) {
        this.columns = ["0"];
      } else {
        this.columns = this.kwargs['columns'];
      }

      if (utils.__key_in_object(this.kwargs, 'dtypes')) {
        this.__set_col_types(this.kwargs['dtypes'], false);
      } else {
        this.__set_col_types(null, true);
      }
    } else {
      if (this.kwargs['columns'] == undefined) {
        this.columns = [...Array(this.data_tensor.shape[0]).keys()];
      } else {
        if (this.kwargs['columns'].length == this.data_tensor.shape[1]) {
          this.columns = this.kwargs['columns'];
        } else {
          throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has lenght of ${this.data_tensor.shape[1]}`;
        }
      }

      if (utils.__key_in_object(this.kwargs, 'dtypes')) {
        this.__set_col_types(this.kwargs['dtypes'], false);
      } else {
        this.__set_col_types(null, true);
      }
    }
  }

  __read_object(data) {
    let data_arr = [];
    data.forEach(item => {
      data_arr.push(Object.values(item));
    });
    this.data = data_arr;
    this.data_tensor = tf.tensor(data_arr);
    this.kwargs['columns'] = Object.keys(Object.values(data)[0]);

    if (this.ndim == 1) {
      if (this.kwargs['columns'] == undefined) {
        this.columns = ["0"];
      } else {
        this.columns = this.kwargs['columns'];
      }
    } else {
      if (this.kwargs['columns'] == undefined) {
        this.columns = [...Array(this.data_tensor.shape[0]).keys()];
      } else {
        if (this.kwargs['columns'].length == this.data_tensor.shape[1]) {
          this.columns = this.kwargs['columns'];
        } else {
          throw `Column lenght mismatch. You provided a column of lenght ${this.kwargs['columns'].length} but data has column length of ${this.data_tensor.shape[1]}`;
        }
      }

      if (utils.__key_in_object(this.kwargs, 'dtypes')) {
        this.__set_col_types(this.kwargs['dtypes'], false);
      } else {
        this.__set_col_types(null, true);
      }
    }
  }

  __set_col_types(dtypes, infer) {
    const __supported_dtypes = ['float', "int", 'string', 'datetime'];

    if (infer) {
      if (this.series) {
        this.col_types = utils.__get_t(this.values);
      } else {
        this.col_data = utils.__get_col_values(this.data);
        this.col_types = utils.__get_t(this.col_data);
      }
    } else {
      if (Array.isArray(dtypes) && dtypes.length == this.columns.length) {
        dtypes.map((type, indx) => {
          if (!__supported_dtypes.includes(type)) {
            throw new Error(`dtype error: dtype specified at index ${indx} is not supported`);
          }
        });
        this.col_data = utils.__get_col_values(this.data);
        this.col_types = dtypes;
      }
    }
  }

  get dtypes() {
    return this.col_types;
  }

  astype(dtype) {
    this.__set_col_types(dtype, false);
  }

  get ndim() {
    if (this.series) {
      return 1;
    } else {
      return this.data_tensor.shape.length;
    }
  }

  get axes() {
    let axes = {
      "index": [...Array(this.data.length - 1).keys()],
      "columns": this.columns
    };
    return axes;
  }

  get shape() {
    if (this.series) {
      return [1];
    } else {
      return this.data_tensor.shape;
    }
  }

  get values() {
    return this.data;
  }

  get column_names() {
    return this.columns;
  }

  get size() {
    return this.data_tensor.size;
  }

  toString() {
    let data = this.values;
    let table_width = config.get_width;
    let table_truncate = config.get_truncate;
    let table_config = {};

    for (let index = 0; index < this.columns.length; index++) {
      table_config[index] = {
        width: table_width,
        truncate: table_truncate
      };
    }

    data.unshift(this.columns);
    return (0, _table.table)(data, {
      columns: table_config
    });
  }

}

exports.default = NDframe;
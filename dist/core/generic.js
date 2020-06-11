"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();

class NDframe {
  constructor(data, kwargs = {}) {
    this.kwargs = kwargs;

    if (utils.isObject(data[0])) {
      this.__read_object(data);
    } else if (Array.isArray(data[0]) || utils.isNumber(data[0]) || utils.isString(data[0])) {
      this.__read_array(data);
    } else {
      throw "File format not supported for now";
    }
  }

  __read_array(data) {
    this.data = tf.tensor(data);

    if (this.ndim == 1) {
      if (this.kwargs['columns'] == undefined) {
        this.columns = "0";
      } else {
        this.columns = this.kwargs['columns'];
      }
    } else {
      if (this.kwargs['columns'] == undefined) {
        this.columns = [...Array(this.data.shape[0]).keys()];
      } else {
        if (this.kwargs['columns'].length == this.data.shape[1]) {
          this.columns = this.kwargs['columns'];
        } else {
          throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has lenght of ${this.data.shape[1]}`;
        }
      }
    }
  }

  __read_object(data) {
    let data_arr = [];
    data.forEach(item => {
      data_arr.push(Object.values(item));
    });
    this.data = tf.tensor(data_arr);
    this.kwargs['columns'] = Object.keys(Object.values(data)[0]);

    if (this.ndim == 1) {
      if (this.kwargs['columns'] == undefined) {
        this.columns = "0";
      } else {
        this.columns = this.kwargs['columns'];
      }
    } else {
      if (this.kwargs['columns'] == undefined) {
        this.columns = [...Array(this.data.shape[0]).keys()];
      } else {
        if (this.kwargs['columns'].length == this.data.shape[1]) {
          this.columns = this.kwargs['columns'];
        } else {
          throw `Column lenght mismatch. You provided a column of lenght ${this.kwargs['columns'].length} but data has column length of ${this.data.shape[1]}`;
        }
      }
    }
  }

  get ndim() {
    return this.data.shape.length;
  }

  get axes() {
    let axes = {
      "index": [...Array(this.data.shape[0]).keys()],
      "columns": this.columns
    };
    return axes;
  }

  get shape() {
    if (this.ndim == 1) {
      return 1;
    } else {
      return this.data.shape;
    }
  }

  get values() {
    return this.data.arraySync();
  }

  get column_names() {
    return this.columns;
  }

  get size() {
    return this.data.size;
  }

  get to_string() {
    let global_string = "  |";
    this.columns.map(val => {
      global_string += `  ${val} |`;
    });
    global_string += "\n";
    global_string += "---".repeat(this.columns.length * 2) + "\n";
    let col_str = "";
    this.values.forEach((val, i) => {
      col_str += ` ${i}|`;
      val.forEach(element => {
        col_str += `  ${element} |`;
      });
      col_str += "\n";
    });
    global_string += col_str;
    return global_string;
  }

}

exports.default = NDframe;
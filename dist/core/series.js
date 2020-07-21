"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Series = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _utils = require("./utils");

var _generic = _interopRequireDefault(require("./generic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();

class Series extends _generic.default {
  constructor(data, kwargs) {
    super(data, kwargs);
  }

  tensor() {
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
      return new Series(data, config);
    }
  }

  sample(num = 1) {
    if (num > this.values.length || num < 1) {
      let config = {
        columns: this.column_names
      };
      return new Series(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };

      let sampled_arr = utils.__sample_from_iter(this.values, num);

      return new Series(sampled_arr, config);
    }
  }

  add(other) {
    if (utils.__is_number(other)) {
      let sum = this.tensor().add(other).arraySync();
      return new Series(sum, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let sum = this.tensor().add(other.tensor()).arraySync();
        return new Series(sum, {
          columns: this.column_names
        });
      }
    }
  }

  sub(other) {
    if (utils.__is_number(other)) {
      let sub = this.tensor().sub(other).arraySync();
      return new Series(sub, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let sub = this.tensor().sub(other.tensor()).arraySync();
        return new Series(sub, {
          columns: this.column_names
        });
      }
    }
  }

  mul(other) {
    if (utils.__is_number(other)) {
      let mul = this.tensor().mul(other).arraySync();
      return new Series(mul, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let mul = this.tensor().mul(other.tensor()).arraySync();
        return new Series(mul, {
          columns: this.column_names
        });
      }
    }
  }

  div(other, round = true) {
    if (utils.__is_number(other)) {
      let div_result = this.tensor().div(other);
      return new Series(div_result.arraySync(), {
        columns: this.column_names,
        dtypes: div_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let dtype;

        if (round) {
          dtype = "float32";
        } else {
          dtype = "int32";
        }

        let tensor1 = this.tensor().asType(dtype);
        let tensor2 = other.tensor().asType(dtype);
        let result = tensor1.div(tensor2);
        dtype = result.dtype;
        return new Series(result.arraySync(), {
          columns: this.column_names,
          dtypes: dtype
        });
      }
    }
  }

  pow(other) {
    if (utils.__is_number(other)) {
      let pow_result = this.tensor().pow(other).arraySync();
      return new Series(pow_result, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let pow_result = this.tensor().pow(other.tensor()).arraySync();
        return new Series(pow_result, {
          columns: this.column_names
        });
      }
    }
  }

  mod(other) {
    if (utils.__is_number(other)) {
      let mod_result = this.tensor().mod(other).arraySync();
      return new Series(mod_result, {
        columns: this.column_names
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let mod_result = this.tensor().mod(other.tensor()).arraySync();
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

    let mean = this.tensor().mean().arraySync();
    return mean;
  }

  median() {
    if (this.dtypes[0] == "string") {
      throw Error("dtype error: String data type does not support median operation");
    }

    let values = this.values;

    let median = utils.__median(values);

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

    let temp_sum = tf.tensor(this.values).asType(this.dtypes[0]).sum().arraySync();
    return temp_sum;
  }

  count() {
    if (!this.series) {
      throw Error("property error: Object must be a series");
    }

    return utils.__count_nan(this.values);
  }

  maximum(other) {
    if (utils.__is_number(other)) {
      let max_result = this.tensor().maximum(other);
      return new Series(max_result.arraySync(), {
        columns: this.column_names,
        dtypes: max_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let tensor1 = this.tensor();
        let tensor2 = other.tensor();
        let result = tensor1.maximum(tensor2);
        return new Series(result.arraySync(), {
          columns: this.column_names
        });
      }
    }
  }

  minimum(other) {
    if (utils.__is_number(other)) {
      let max_result = this.tensor().minimum(other);
      return new Series(max_result.arraySync(), {
        columns: this.column_names,
        dtypes: max_result.dtype
      });
    } else {
      if (this.__check_series_op_compactibility) {
        let tensor1 = this.tensor();
        let tensor2 = other.tensor();
        let result = tensor1.minimum(tensor2).arraySync();
        return new Series(result, {
          columns: this.column_names
        });
      }
    }
  }

  round(dp) {
    if (utils.__is_undefined(dp)) {
      let result = tf.round(this.tensor());
      return new Series(result.arraySync(), {
        columns: this.column_names
      });
    } else {
      let result = utils.__round(this.values, dp);

      return new Series(result, {
        columns: this.column_names
      });
    }
  }

  sort_values(ascending = true, inplace = false) {
    console.log(this.axes['index']);
    let result = this.values.sort(function (a, b) {
      return a - b;
    });

    if (ascending) {
      if (inplace) {
        return new Series(result, {
          columns: this.column_names
        });
      } else {
        this.values = result;
      }
    } else {
      result = result.reverse();

      if (inplace) {
        return new Series(result, {
          columns: this.column_names
        });
      } else {
        this.values = result;
      }
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

}

exports.Series = Series;
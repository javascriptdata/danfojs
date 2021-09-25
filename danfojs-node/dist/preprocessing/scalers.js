"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StandardScaler = exports.MinMaxScaler = void 0;

var _tfjsNode = require("@tensorflow/tfjs-node");

var _series = _interopRequireDefault(require("../core/series"));

var _frame = _interopRequireDefault(require("../core/frame"));

var _utils = require("../shared/utils");

class MinMaxScaler {
  fit(data) {
    let tensor_data = null;

    if (Array.isArray(data)) {
      tensor_data = (0, _tfjsNode.tensor)(data);
    } else if (data instanceof _frame.default || data instanceof _series.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      tensor_data = (0, _tfjsNode.tensor)(data.values);
    } else {
      throw new Error("data must either be an Array, DataFrame or Series");
    }

    this.max = tensor_data.max(0);
    this.min = tensor_data.min(0);
    let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync();

    if (data instanceof _series.default || Array.isArray(data)) {
      return new _series.default(output_data);
    } else {
      return new _frame.default(output_data);
    }
  }

  transform(data) {
    if (data instanceof _series.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync();
      return new _series.default(output_data);
    } else if (Array.isArray(data)) {
      let tensor_data = (0, _tfjsNode.tensor)(data);
      let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync();

      if (_utils.utils.is1DArray(data)) {
        return new _series.default(output_data);
      } else {
        return new _frame.default(output_data);
      }
    } else if (data instanceof _frame.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync();
      return new _frame.default(output_data);
    } else {
      throw Error("Value Error: Data type not supported");
    }
  }

  inverse_transform(data) {
    if (data instanceof _series.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.mul(this.max.sub(this.min)).add(this.min).arraySync();
      return new _series.default(output_data);
    } else if (Array.isArray(data)) {
      let tensor_data = (0, _tfjsNode.tensor)(data);
      let output_data = tensor_data.mul(this.max.sub(this.min)).add(this.min).arraySync();

      if (_utils.utils.is1DArray(data)) {
        return new _series.default(output_data);
      } else {
        return new _frame.default(output_data);
      }
    } else if (data instanceof _frame.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.mul(this.max.sub(this.min)).add(this.min).arraySync();
      return new _frame.default(output_data);
    } else {
      throw Error("Value Error: Data type not supported");
    }
  }

}

exports.MinMaxScaler = MinMaxScaler;

class StandardScaler {
  fit(data) {
    let tensor_data = null;

    if (Array.isArray(data)) {
      tensor_data = (0, _tfjsNode.tensor)(data);
    } else if (data instanceof _frame.default || data instanceof _series.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      tensor_data = (0, _tfjsNode.tensor)(data.values);
    } else {
      throw new Error("data must either be an Array, DataFrame or Series");
    }

    this.std = (0, _tfjsNode.moments)(tensor_data, 0).variance.sqrt();
    this.mean = tensor_data.mean(0);
    let output_data = tensor_data.sub(this.mean).div(this.std).arraySync();

    if (data instanceof _series.default || Array.isArray(data)) {
      return new _series.default(data = output_data);
    } else {
      return new _frame.default(data = output_data);
    }
  }

  transform(data) {
    if (data instanceof _series.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.sub(this.mean).div(this.std).arraySync();
      return new _series.default(output_data);
    } else if (Array.isArray(data)) {
      let tensor_data = (0, _tfjsNode.tensor)(data);
      let output_data = tensor_data.sub(this.mean).div(this.std).arraySync();

      if (_utils.utils.is1DArray(data)) {
        return new _series.default(output_data);
      } else {
        return new _frame.default(output_data);
      }
    } else if (data instanceof _frame.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.sub(this.mean).div(this.std).arraySync();
      return new _frame.default(output_data);
    } else {
      throw Error("Value Error: Data type not supported");
    }
  }

  inverse_transform(data) {
    if (data instanceof _series.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.mul(this.std).add(this.mean).arraySync();
      return new _series.default(output_data);
    } else if (Array.isArray(data)) {
      let tensor_data = (0, _tfjsNode.tensor)(data);
      let output_data = tensor_data.mul(this.std).add(this.mean).arraySync();

      if (_utils.utils.is1DArray(data)) {
        return new _series.default(output_data);
      } else {
        return new _frame.default(output_data);
      }
    } else if (data instanceof _frame.default) {
      if (data.dtypes.includes("string")) {
        throw Error("Dtype Error: Cannot perform operation on string dtypes");
      }

      let tensor_data = (0, _tfjsNode.tensor)(data.values);
      let output_data = tensor_data.mul(this.std).add(this.mean).arraySync();
      return new _frame.default(output_data);
    } else {
      throw Error("Value Error: Data type not supported");
    }
  }

}

exports.StandardScaler = StandardScaler;
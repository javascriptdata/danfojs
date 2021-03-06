"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OneHotEncoder = exports.LabelEncoder = void 0;

var _series = require("../core/series");

var _utils = require("../core/utils");

var _frame = require("../core/frame");

const utils = new _utils.Utils();

class LabelEncoder {
  fit(data) {
    let in_data = null;

    if (Array.isArray(data)) {
      in_data = data;
    } else if (data instanceof _series.Series) {
      in_data = data.values;
    } else {
      throw new Error("data must be an array or a Series");
    }

    let data_set = new Set(in_data);
    this.label = Array.from(data_set);
    let self = this;
    let output_data = in_data.map(x => {
      return self.label.indexOf(x);
    });
    return new _series.Series(output_data);
  }

  transform(data) {
    let in_data = null;

    if (Array.isArray(data)) {
      in_data = data;
    } else if (data instanceof _series.Series) {
      in_data = data.values;
    } else {
      throw new Error("data must be an array or a Series");
    }

    let self = this;
    let output_data = in_data.map(x => {
      return self.label.indexOf(x);
    });
    return new _series.Series(output_data);
  }

}

exports.LabelEncoder = LabelEncoder;

class OneHotEncoder {
  fit(data) {
    let in_data = null;

    if (Array.isArray(data)) {
      in_data = data;
    } else if (data instanceof _series.Series) {
      in_data = data.values;
    } else {
      throw new Error("data must be an array");
    }

    let data_set = new Set(in_data);
    this.label = Array.from(data_set);

    let onehot_data = utils.__zeros(in_data.length, this.label.length);

    for (let i = 0; i < in_data.length; i++) {
      let elem = in_data[i];
      let elem_index = this.label.indexOf(elem);
      onehot_data[i][elem_index] = 1;
    }

    return new _frame.DataFrame(onehot_data, {
      columns: this.label
    });
  }

  transform(data) {
    let in_data = null;

    if (Array.isArray(data)) {
      in_data = data;
    } else if (data instanceof _series.Series) {
      in_data = data.values;
    } else {
      throw new Error("data must be an array");
    }

    let onehot_data = utils.__zeros(in_data.length, this.label.length);

    for (let i = 0; i < in_data.length; i++) {
      let elem = in_data[i];
      let elem_index = this.label.indexOf(elem);
      onehot_data[i][elem_index] = 1;
    }

    return new _frame.DataFrame(onehot_data, {
      columns: this.label
    });
  }

}

exports.OneHotEncoder = OneHotEncoder;
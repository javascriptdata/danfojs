"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class NDframe {
  constructor(data, values = null, columns = null, axes = null, name = '') {
    this.data = data;
    this.values = values;
    this.columns = columns;
    this.axes = axes;
    this.name = name;
  }

  get shape() {
    return null;
  }

  get values() {
    return null;
  }

  set values(values) {}

  get size() {
    return null;
  }

}

exports.default = NDframe;
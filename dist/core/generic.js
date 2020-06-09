"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class NDframe {
  constructor(data, columns, name) {
    this.name = name;

    if (Array.isArray(data)) {
      this.data = tf.tensor(data);

      if (this.ndim == 1) {
        if (columns == undefined) {
          this.columns = "0";
        } else {
          this.columns = columns;
        }

        this.axes = {
          "index": [...Array(this.data.arraySync().length).keys()],
          "columns": this.columns
        };
      } else {
        if (columns == undefined) {
          this.columns = [...Array(this.data.shape[1]).keys()];
        } else {
          if (columns.length == this.data.shape[1]) {
            this.columns = columns;
          } else {
            throw `Column lenght mismatch. You provided a column of lenght ${this.columns.length} but data has lenght of ${this.data.shape}`;
          }
        }

        this.axes = {
          "index": [...Array(this.data.shape[0]).keys()],
          "columns": this.columns
        };
      }
    }
  }

  get ndim() {
    return this.data.shape.length;
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

}

exports.default = NDframe;
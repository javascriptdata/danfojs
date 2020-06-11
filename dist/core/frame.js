"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFrame = void 0;

var _generic = _interopRequireDefault(require("./generic"));

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const utils = new _utils.Utils();

class DataFrame extends _generic.default {
  constructor(data, kwargs) {
    super(data, kwargs);
  }

  drop(val, kwargs = {
    axis: 0,
    inplace: false
  }) {
    if (kwargs['axis'] == 1) {
      const index = this.columns.indexOf(val);
      const values = this.values;

      if (index == -1) {
        throw new Error(`column ${val} does not exist`);
      }

      let new_data = values.map(function (element) {
        let new_arr = utils.remove(element, index);
        return new_arr;
      });

      if (!kwargs['inplace']) {
        let columns = utils.remove(this.columns, index);
        return new DataFrame(new_data, {
          columns: columns
        });
      } else {
        this.columns = utils.remove(this.columns, index);
        this.data = tf.tensor(new_data);
      }
    } else {
      const axes = this.axes;
      const isIndex = axes["index"].includes(val);
      const values = this.values;

      if (isIndex) {
        var index = val;
      } else {
        throw new Error("Index does not exist");
      }

      let new_data = utils.remove(values, index);

      if (!kwargs['inplace']) {
        return new DataFrame(new_data, {
          columns: this.columns
        });
      } else {
        this.data = tf.tensor(new_data);
      }
    }
  }

}

exports.DataFrame = DataFrame;
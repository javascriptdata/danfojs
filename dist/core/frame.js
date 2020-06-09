"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFrame = void 0;

var _generic = _interopRequireDefault(require("./generic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataFrame extends _generic.default {
  constructor(data, columns, name) {
    super(data, columns, name);
  }

  get to_string() {
    return null;
  }

}

exports.DataFrame = DataFrame;
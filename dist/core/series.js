"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Series = void 0;

var _generic = _interopRequireDefault(require("./generic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Series extends _generic.default {
  constructor(data, kwargs) {
    super(data, kwargs);
  }

}

exports.Series = Series;
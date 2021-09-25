"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NDframe", {
  enumerable: true,
  get: function () {
    return _generic.default;
  }
});
Object.defineProperty(exports, "Series", {
  enumerable: true,
  get: function () {
    return _series.default;
  }
});
exports._version = void 0;

var _generic = _interopRequireDefault(require("./core/generic"));

var _series = _interopRequireDefault(require("./core/series"));

const _version = "0.2.8";
exports._version = _version;
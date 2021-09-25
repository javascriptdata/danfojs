"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "readCSV", {
  enumerable: true,
  get: function () {
    return _io.$readCSV;
  }
});
Object.defineProperty(exports, "streamCSV", {
  enumerable: true,
  get: function () {
    return _io.$streamCSV;
  }
});
Object.defineProperty(exports, "toCSV", {
  enumerable: true,
  get: function () {
    return _io.$toCSV;
  }
});
Object.defineProperty(exports, "readJSON", {
  enumerable: true,
  get: function () {
    return _io2.$readJSON;
  }
});
Object.defineProperty(exports, "toJSON", {
  enumerable: true,
  get: function () {
    return _io2.$toJSON;
  }
});
Object.defineProperty(exports, "readExcel", {
  enumerable: true,
  get: function () {
    return _io3.$readExcel;
  }
});
Object.defineProperty(exports, "toExcel", {
  enumerable: true,
  get: function () {
    return _io3.$toExcel;
  }
});

var _io = require("./io.csv");

var _io2 = require("./io.json");

var _io3 = require("./io.excel");
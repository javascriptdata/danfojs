"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFrame = void 0;

var _ndframe = require("./ndframe");

class DataFrame extends _ndframe.ndframe {
  print(val) {
    console.log(`Printing In DataFrame ${val}`);
  }

}

exports.DataFrame = DataFrame;
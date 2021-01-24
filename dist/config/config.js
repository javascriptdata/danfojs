"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Configs = void 0;

class Configs {
  constructor() {
    this.table_width = 17;
    this.table_truncate = 16;
    this.dtype_test_lim = 10;
    this.table_max_row = 21;
    this.table_max_col_in_console = 7;
  }

  set_width(val) {
    this.table_width = val;
  }

  get get_width() {
    return this.table_width;
  }

  set_max_col_in_console(val) {
    this.table_max_col_in_console = val;
  }

  get get_max_col_in_console() {
    return this.table_max_col_in_console;
  }

  set_row_num(val) {
    this.table_max_row = val;
  }

  get get_max_row() {
    return this.table_max_row;
  }

  get get_truncate() {
    return this.table_truncate;
  }

  set_truncate(val) {
    this.table_truncate = val;
  }

  get get_dtype_test_lim() {
    return this.dtype_test_lim;
  }

  set_dtype_test_lim(val) {
    this.dtype_test_lim = val;
  }

}

exports.Configs = Configs;
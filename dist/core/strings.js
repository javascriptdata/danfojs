"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Str = void 0;

var _series = require("./series");

class Str {
  constructor(series) {
    this.series = series;
    this.array = series.values;
  }

  toLowerCase() {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.toLowerCase());
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  toUpperCase() {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.toUpperCase());
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  capitalize() {
    let new_arr = [];
    this.array.map(val => {
      let f_char = val.slice(0, 1);
      let l_char = val.slice(1);
      let new_str = `${f_char.toUpperCase()}${l_char.toLowerCase()}`;
      new_arr.push(new_str);
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  charAt(index = 0) {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.charAt(index));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  concat(other = "", position = 1) {
    if (Array.isArray(other)) {
      let final_arr = [];

      for (let i = 0; i < other.length; i++) {
        let l_str = this.array[i];
        let r_str = other[i];

        if (position == 1) {
          final_arr.push(l_str.concat(r_str));
        } else {
          final_arr.push(r_str.concat(l_str));
        }
      }

      let sf = this.__create_new_sf_from(final_arr, this.series);

      return sf;
    } else {
      let new_arr = [];
      this.array.map(val => {
        if (position == 1) {
          new_arr.push(val.concat(other));
        } else {
          new_arr.push(other.concat(val));
        }
      });

      let sf = this.__create_new_sf_from(new_arr, this.series);

      return sf;
    }
  }

  startsWith(str = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.startsWith(str));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  endsWith(str = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.endsWith(str));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  includes(str = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.includes(str));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  indexOf(str = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.indexOf(str));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  lastIndexOf(str = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.lastIndexOf(str));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  replace(searchValue = "", replaceValue = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.replace(searchValue, replaceValue));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  repeat(num = 1) {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.repeat(num));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  search(str = "") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.search(str));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  slice(startIndex = 0, endIndex = 1) {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.slice(startIndex, endIndex));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  split(splitVal = " ") {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.split(splitVal));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  substr(startIndex = 0, num = 1) {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.substr(startIndex, num));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  substring(startIndex = 0, endIndex = 1) {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.substring(startIndex, endIndex));
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  trim() {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.trim());
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  join(valToJoin = "", joinChar = " ") {
    let new_arr = [];
    this.array.map(val => {
      let l_char = val;
      let r_char = valToJoin;
      let new_char = `${l_char}${joinChar}${r_char}`;
      new_arr.push(new_char);
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  len() {
    let new_arr = [];
    this.array.map(val => {
      new_arr.push(val.length);
    });

    let sf = this.__create_new_sf_from(new_arr, this.series);

    return sf;
  }

  __create_new_sf_from(new_val, series) {
    let sf = new _series.Series(new_val, {
      columns: series.column_names,
      index: series.index
    });
    return sf;
  }

}

exports.Str = Str;
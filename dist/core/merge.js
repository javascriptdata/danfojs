"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = exports.Merge = void 0;

var _frame = require("./frame");

var _utils = require("./utils");

const utils = new _utils.Utils();

class Merge {
  constructor(kwargs) {
    utils.__in_object(kwargs, "left");

    utils.__in_object(kwargs, "right");

    utils.__in_object(kwargs, "on");

    if (!utils.__key_in_object(kwargs, "how")) {
      this.how = 'inner';
      kwargs['how'] = 'inner';
    } else {
      this.how = kwargs['how'];
    }

    this.left = null;
    this.right = null;
    this.on = null;
    let how_keys = ["outer", "inner", "left", "right"];

    if (kwargs["left"] instanceof _frame.DataFrame && kwargs["right"] instanceof _frame.DataFrame) {
      this.left = kwargs["left"];
      this.right = kwargs["right"];
    } else {
      throw new Error("The left and right key value must be a dataFrame");
    }

    if (Array.isArray(kwargs["on"])) {
      this.on = kwargs["on"];
    } else {
      throw new Error("key 'on' must be a list");
    }

    if (how_keys.includes(kwargs["how"])) {
      this.how = kwargs["how"];
    } else {
      throw new Error(`${kwargs["how"]} specify in keyword how is not recognise`);
    }

    this.left_col_index = [];
    this.right_col_index = [];

    for (let i = 0; i < this.on.length; i++) {
      if (this.left.columns.includes(this.on[i]) && this.right.columns.includes(this.on[i])) {
        let left_index = this.left.columns.indexOf(this.on[i]);
        let right_index = this.right.columns.indexOf(this.on[i]);
        this.left_col_index.push(left_index);
        this.right_col_index.push(right_index);
      }
    }

    this.left_key_dict = {};
    this.right_key_dict = {};
    let left_values = this.left.values;
    let right_values = this.right.values;

    for (let i = 0; i < left_values.length; i++) {
      let left_value = left_values[i];
      let right_value = right_values[i];
      let right_key_comb = "";
      let left_key_comb = "";

      for (let j = 0; j < this.left_col_index.length; j++) {
        let index = this.left_col_index[j];
        left_key_comb += `_${left_value[index]}`;
      }

      let self = this;
      let left_value_filter = left_value.filter(function (val, index) {
        return !self.left_col_index.includes(index);
      });

      if (utils.__key_in_object(this.left_key_dict, left_key_comb)) {
        this.left_key_dict[left_key_comb].push(left_value_filter);
      } else {
        this.left_key_dict[left_key_comb] = [left_value_filter];
      }
    }

    for (let i = 0; i < right_values.length; i++) {
      let right_value = right_values[i];
      let right_key_comb = "";

      for (let j = 0; j < this.right_col_index.length; j++) {
        let index = this.right_col_index[j];
        right_key_comb += `_${right_value[index]}`;
      }

      let self = this;
      let right_value_filter = right_value.filter(function (val, index) {
        return !self.right_col_index.includes(index);
      });

      if (utils.__key_in_object(this.right_key_dict, right_key_comb)) {
        this.right_key_dict[right_key_comb].push(right_value_filter);
      } else {
        this.right_key_dict[right_key_comb] = [right_value_filter];
      }
    }

    this.__create_columns();

    let data = null;

    switch (this.how) {
      case "outer":
        data = this.outer();
        break;

      case "inner":
        data = this.inner();
        break;

      case "left":
        data = this.left_merge();
        break;

      case "right":
        data = this.right_merge();
        break;
    }

    let df = new _frame.DataFrame(data = data, {
      columns: this.columns
    });
    return df;
  }

  __create_columns() {
    let self = this;
    self.left_col = self.left.columns.filter((val, index) => {
      return !self.left_col_index.includes(index);
    });
    self.right_col = self.right.columns.filter((val, index) => {
      return !self.right_col_index.includes(index);
    });
    self.columns = [...self.on];
    let column_duplicate = {};
    let temp_column = [...self.left_col];
    temp_column.push(...self.right_col);

    for (let i = 0; i < temp_column.length; i++) {
      let col = temp_column[i];

      if (utils.__key_in_object(column_duplicate, col)) {
        let col_name = `${col}_${column_duplicate[col]}`;
        self.columns.push(col_name);
        column_duplicate[col] += 1;
      } else {
        self.columns.push(col);
        column_duplicate[col] = 1;
      }
    }
  }

  outer() {
    let keys = Object.keys(this.left_key_dict);
    keys.push(...Object.keys(this.right_key_dict));
    keys = Array.from(new Set(keys));
    let data = this.basic(keys);
    return data;
  }

  inner() {
    let left_keys = Object.keys(this.left_key_dict);
    let right_keys = Object.keys(this.right_key_dict);
    let keys = left_keys.filter(val => {
      return right_keys.includes(val);
    });
    let data = this.basic(keys);
    return data;
  }

  left_merge() {
    let keys = Object.keys(this.left_key_dict);
    let data = this.basic(keys);
    return data;
  }

  right_merge() {
    let keys = Object.keys(this.right_key_dict);
    let data = this.basic(keys);
    return data;
  }

  basic(keys) {
    let data = [];

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let key_array = key.split("_").filter(val => {
        return val != "";
      });

      if (utils.__key_in_object(this.left_key_dict, key)) {
        let left_row = this.left_key_dict[key];

        for (let left_i = 0; left_i < left_row.length; left_i++) {
          let left_row_row = left_row[left_i];

          if (utils.__key_in_object(this.right_key_dict, key)) {
            let right_row = this.right_key_dict[key];

            for (let r_i = 0; r_i < right_row.length; r_i++) {
              let right_row_row = right_row[r_i];
              let inner_data = key_array.slice(0);
              inner_data.push(...left_row_row);
              inner_data.push(...right_row_row);
              data.push(inner_data);
            }
          } else {
            let nan_array = Array(this.right_col.length);

            for (let i = 0; i < this.right_col.length; i++) {
              nan_array[i] = NaN;
            }

            let inner_data = key_array.slice(0);
            inner_data.push(...left_row_row);
            inner_data.push(...nan_array);
            data.push(inner_data);
          }
        }
      } else {
        let right_row = this.right_key_dict[key];

        for (let i = 0; i < right_row.length; i++) {
          let right_row_row = right_row[i];
          let nan_array = Array(this.left_col.length);

          for (let j = 0; j < nan_array.length; j++) {
            nan_array[j] = NaN;
          }

          let inner_data = key_array.slice(0);
          inner_data.push(...nan_array);
          inner_data.push(...right_row_row);
          data.push(inner_data);
        }
      }
    }

    return data;
  }

}

exports.Merge = Merge;

const merge = kwargs => {
  let merge = new Merge(kwargs);
  return merge;
};

exports.merge = merge;
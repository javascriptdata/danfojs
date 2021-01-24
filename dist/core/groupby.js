"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupBy = void 0;

var _frame = require("./frame");

var _utils = require("./utils");

const utils = new _utils.Utils();

class GroupBy {
  constructor(col_dict, key_col, data, column_name) {
    this.key_col = key_col;
    this.col_dict = col_dict;
    this.data = data;
    this.column_name = column_name;
    this.data_tensors = {};
  }

  group() {
    if (this.key_col.length == 2) {
      for (var i = 0; i < this.data.length; i++) {
        let col1_index = this.column_name.indexOf(this.key_col[0]);
        let col2_index = this.column_name.indexOf(this.key_col[1]);
        let value = this.data[i];
        let col1_value = value[col1_index];
        let col2_value = value[col2_index];

        if (Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)) {
          if (Object.prototype.hasOwnProperty.call(this.col_dict[col1_value], col2_value)) {
            this.col_dict[col1_value][col2_value].push(value);
          }
        }
      }

      for (var key in this.col_dict) {
        this.data_tensors[key] = {};

        for (var key2 in this.col_dict[key]) {
          let data = this.col_dict[key][key2];

          if (data.length == 0) {
            delete this.col_dict[key][key2];
          } else {
            this.data_tensors[key][key2] = new _frame.DataFrame(data, {
              columns: this.column_name
            });
          }
        }
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        let col1_index = this.column_name.indexOf(this.key_col[0]);
        let value = this.data[i];
        let col1_value = value[col1_index];

        if (Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)) {
          this.col_dict[col1_value].push(value);
        }
      }

      for (let key in this.col_dict) {
        let data = this.col_dict[key];
        this.data_tensors[key] = new _frame.DataFrame(data, {
          columns: this.column_name
        });
      }
    }

    return this;
  }

  col(col_names) {
    if (Array.isArray(col_names)) {
      for (let i = 0; i < col_names.length; i++) {
        let col_name = col_names[i];

        if (!this.column_name.includes(col_name)) {
          throw new Error(`Column ${col_name} does not exist in groups`);
        }
      }
    } else {
      throw new Error(`Col_name must be an array of column`);
    }

    this.group_col_name = col_names;

    if (this.key_col.length == 2) {
      this.group_col = {};

      for (var key1 in this.data_tensors) {
        this.group_col[key1] = {};

        for (var key2 in this.data_tensors[key1]) {
          this.group_col[key1][key2] = [];

          for (let i = 0; i < col_names.length; i++) {
            let col_name = col_names[i];
            let data = this.data_tensors[key1][key2].column(col_name);
            this.group_col[key1][key2].push(data);
          }
        }
      }
    } else {
      this.group_col = {};

      for (let key1 in this.data_tensors) {
        this.group_col[key1] = [];

        for (let i = 0; i < col_names.length; i++) {
          let col_name = col_names[i];
          let data = this.data_tensors[key1].column(col_name);
          this.group_col[key1].push(data);
        }
      }
    }

    return this;
  }

  arithemetic(operation) {
    let ops_name = ["mean", "sum", "count", "mode", "std", "var", "cumsum", "cumprod", "cummax", "cummin"];
    let ops_map = {
      "mean": "mean()",
      "sum": "sum()",
      "mode": "mode()",
      "count": "count()",
      "std": "std()",
      "var": "var()",
      "cumsum": "cumsum().values",
      "cumprod": "cumprod().values",
      "cummax": "cummax().values",
      "cummin": "cummin().values"
    };
    let is_array = false;

    if (Array.isArray(operation)) {
      is_array = true;
    }

    if (this.key_col.length == 2) {
      let count_group = {};

      for (var key1 in this.group_col) {
        count_group[key1] = {};

        for (var key2 in this.group_col[key1]) {
          count_group[key1][key2] = [];

          for (let i = 0; i < this.group_col[key1][key2].length; i++) {
            let data = null;

            if (is_array) {
              let op = operation[i];

              if (!ops_name.includes(op)) {
                throw new Error("operation does not exist");
              }

              data = eval(`this.group_col[key1][key2][i].${ops_map[op]}`);
            } else {
              data = eval(`this.group_col[key1][key2][i].${operation}`);
            }

            count_group[key1][key2].push(data);
          }
        }
      }

      return count_group;
    } else {
      let count_group = {};

      for (let key1 in this.group_col) {
        count_group[key1] = [];

        for (let i = 0; i < this.group_col[key1].length; i++) {
          let data = null;

          if (is_array) {
            let op = operation[i];

            if (!ops_name.includes(op)) {
              throw new Error("operation does not exist");
            }

            data = eval(`this.group_col[key1][i].${ops_map[op]}`);
          } else {
            data = eval(`this.group_col[key1][i].${operation}`);
          }

          count_group[key1].push(data);
        }
      }

      return count_group;
    }
  }

  count() {
    let value = this.arithemetic("count()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "count");
    return df;
  }

  sum() {
    let value = this.arithemetic("sum()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "sum");
    return df;
  }

  std() {
    let value = this.arithemetic("std()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "std");
    return df;
  }

  var() {
    let value = this.arithemetic("var()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "var");
    return df;
  }

  mean() {
    let value = this.arithemetic("mean()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "mean");
    return df;
  }

  cumsum() {
    let value = this.arithemetic("cumsum().values");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "cumsum");
    return df;
  }

  cummax() {
    let value = this.arithemetic("cummax().values");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "cummax");
    return df;
  }

  cumprod() {
    let value = this.arithemetic("cumprod().values");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "cumprod");
    return df;
  }

  cummin() {
    let value = this.arithemetic("cummin().values");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "cummin");
    return df;
  }

  max() {
    let value = this.arithemetic("max()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "max");
    return df;
  }

  min() {
    let value = this.arithemetic("min()");
    let df = this.to_DataFrame(this.key_col, this.group_col_name, value, "min");
    return df;
  }

  get_groups(key) {
    if (this.key_col.length == 2) {
      if (key.length == 2) {
        let key1 = key[0];
        let key2 = key[1];

        utils.__is_object(this.data_tensors, key1, `Key Error: ${key1} not in object`);

        return this.data_tensors[key1][key2];
      } else {
        throw new Error("specify the two group by column");
      }
    } else if (this.key_col.length == 1) {
      if (key.length == 1) {
        utils.__is_object(this.data_tensors, key[0], `Key Error: ${key[0]} not in object`);

        return this.data_tensors[key[0]];
      } else {
        throw new Error("specify the one group by column");
      }
    }

    return this.data_tensors[key];
  }

  agg(kwargs = {}) {
    let columns = Object.keys(kwargs);
    let operations = columns.map(x => {
      return kwargs[x].toLocaleLowerCase();
    });
    this.col(columns);
    let data = this.arithemetic(operations);
    let df = this.to_DataFrame(this.key_col, this.group_col_name, data, operations);
    return df;
  }

  to_DataFrame(key_col, col, data, ops) {
    if (key_col.length == 2) {
      let df_data = [];

      for (let key_1 in data) {
        let key_val = data[key_1];

        for (let key_2 in key_val) {
          let k_data = key_val[key_2];
          let key_data = [];

          if (Array.isArray(k_data[0])) {
            for (let i = 0; i < k_data.length; i++) {
              let col_data = k_data[i];

              for (let j = 0; j < col_data.length; j++) {
                if (typeof key_data[j] === "undefined") {
                  key_data[j] = [];
                  key_data[j][0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
                  key_data[j][1] = isNaN(parseInt(key_2)) ? key_2 : parseInt(key_2);
                  key_data[j].push(col_data[j]);
                } else {
                  key_data[j].push(col_data[j]);
                }
              }
            }

            df_data.push(...key_data);
          } else {
            key_data[0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
            key_data[1] = isNaN(parseInt(key_2)) ? key_2 : parseInt(key_2);
            key_data.push(...k_data);
            df_data.push(key_data);
          }
        }
      }

      let column = [...key_col];
      let group_col = col.slice().map((x, i) => {
        if (Array.isArray(ops)) {
          return `${x}_${ops[i]}`;
        }

        return `${x}_${ops}`;
      });
      column.push(...group_col);
      return new _frame.DataFrame(df_data, {
        columns: column
      });
    } else {
      let df_data = [];

      for (let key_1 in data) {
        let key_val = data[key_1];
        let key_data = [];

        if (Array.isArray(key_val[0])) {
          for (let i = 0; i < key_val.length; i++) {
            let col_data = key_val[i];

            for (let j = 0; j < col_data.length; j++) {
              if (typeof key_data[j] === "undefined") {
                key_data[j] = [];
                key_data[j][0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
                key_data[j].push(col_data[j]);
              } else {
                key_data[j].push(col_data[j]);
              }
            }

            df_data.push(...key_data);
          }
        } else {
          key_data[0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
          key_data.push(...key_val);
          df_data.push(key_data);
        }
      }

      let column = [...key_col];
      let group_col = col.slice().map((x, i) => {
        if (Array.isArray(ops)) {
          return `${x}_${ops[i]}`;
        }

        return `${x}_${ops}`;
      });
      column.push(...group_col);
      return new _frame.DataFrame(df_data, {
        columns: column
      });
    }
  }

}

exports.GroupBy = GroupBy;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFrame = void 0;

var _generic = _interopRequireDefault(require("./generic"));

var _series = require("./series");

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _utils = require("./utils");

var _groupby = require("./groupby");

var _merge = require("./merge");

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
        throw new Error(`column "${val}" does not exist`);
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
        this.data_tensor = tf.tensor(new_data);
        this.data = new_data;
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
        this.data_tensor = tf.tensor(new_data);
        this.data = new_data;
      }
    }
  }

  __indexLoc(kwargs) {
    let rows = null;
    let columns = null;
    let isColumnSplit = false;

    if (Object.prototype.hasOwnProperty.call(kwargs, "rows")) {
      if (Array.isArray(kwargs["rows"])) {
        if (kwargs["rows"].length == 1 && typeof kwargs["rows"][0] == "string") {
          if (kwargs["rows"][0].includes(":")) {
            let row_split = kwargs["rows"][0].split(":");
            let start = parseInt(row_split[0]) || 0;
            let end = parseInt(row_split[1]) || this.values.length - 1;

            if (typeof start == "number" && typeof end == "number") {
              rows = utils.__range(start, end);
            }
          } else {
            throw new Error("numbers in string must be separated by ':'");
          }
        } else {
          rows = kwargs["rows"];
        }
      } else {
        throw new Error("rows must be a list");
      }
    } else {
      throw new Error("Kwargs keywords are {rows, columns}");
    }

    if (Object.prototype.hasOwnProperty.call(kwargs, "columns")) {
      if (Array.isArray(kwargs["columns"])) {
        if (kwargs["columns"].length == 1 && kwargs["columns"][0].includes(":")) {
          let row_split = kwargs["columns"][0].split(":");
          let start, end;

          if (kwargs["type"] == "iloc" || row_split[0] == "") {
            start = parseInt(row_split[0]) || 0;
            end = parseInt(row_split[1]) || this.values[0].length - 1;
          } else {
            start = parseInt(this.columns.indexOf(row_split[0]));
            end = parseInt(this.columns.indexOf(row_split[1]));
          }

          if (typeof start == "number" && typeof end == "number") {
            columns = utils.__range(start, end);
            isColumnSplit = true;
          }
        } else {
          columns = kwargs["columns"];
        }
      } else {
        throw new Error("columns must be a list");
      }
    } else {
      throw new Error("Kwargs keywords are {rows, columns}");
    }

    let data_values = this.values;
    let new_data = [];

    for (var index = 0; index < rows.length; index++) {
      let row_val = rows[index];
      let max_rowIndex = data_values.length - 1;

      if (row_val > max_rowIndex) {
        throw new Error(`Specified row index ${row_val} is bigger than maximum row index of ${max_rowIndex}`);
      }

      let value = data_values[row_val];
      let row_data = [];

      for (var i in columns) {
        var col_index;

        if (kwargs["type"] == "loc" && !isColumnSplit) {
          col_index = this.columns.indexOf(columns[i]);

          if (col_index == -1) {
            throw new Error(`Column ${columns[i]} does not exist`);
          }
        } else {
          col_index = columns[i];
          let max_colIndex = this.columns.length - 1;

          if (col_index > max_colIndex) {
            throw new Error(`column index ${col_index} is bigger than ${max_colIndex}`);
          }
        }

        let elem = value[col_index];
        row_data.push(elem);
      }

      new_data.push(row_data);
    }

    let column_names = [];

    if (kwargs["type"] == "iloc" || isColumnSplit) {
      columns.map(col => {
        column_names.push(this.columns[col]);
      });
    } else {
      column_names = columns;
    }

    return [new_data, column_names, rows];
  }

  loc(kwargs) {
    kwargs["type"] = "loc";

    let [new_data, columns, rows] = this.__indexLoc(kwargs);

    let df_columns = {
      "columns": columns
    };
    let df = new DataFrame(new_data, df_columns);
    df.index_arr = rows;
    return df;
  }

  iloc(kwargs) {
    kwargs["type"] = "iloc";

    let [new_data, columns, rows] = this.__indexLoc(kwargs);

    let df_columns = {
      "columns": columns
    };
    let df = new DataFrame(new_data, df_columns);
    df.index_arr = rows;
    return df;
  }

  head(rows = 5) {
    if (rows > this.values.length || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new DataFrame(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };
      let data = this.values.slice(0, rows);
      return new DataFrame(data, config);
    }
  }

  tail(rows = 5) {
    let row_len = this.values.length;

    if (rows > row_len || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new DataFrame(this.values, config);
    } else {
      let data = this.values.slice(row_len - rows);
      let indx = this.index.slice(row_len - rows);
      let config = {
        columns: this.column_names
      };
      let df = new DataFrame(data, config);

      df.__set_index(indx);

      return df;
    }
  }

  sample(num = 5) {
    let row_len = this.values.length;

    if (num > this.values.length || num < 1) {
      let config = {
        columns: this.column_names
      };
      return new DataFrame(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };

      let sampled_index = utils.__randgen(num, 0, row_len);

      let sampled_arr = [];
      let new_idx = [];
      let self = this;
      sampled_index.map(val => {
        sampled_arr.push(self.values[val]);
        new_idx.push(self.index[val]);
      });
      let df = new DataFrame(sampled_arr, config);

      df.__set_index(new_idx);

      return df;
    }
  }

  add(other, axis) {
    if (this.__frame_is_compactible_for_operation) {
      let tensors = this.__get_ops_tensors([this, other], axis);

      let sum_vals = tensors[0].add(tensors[1]);
      let col_names = this.columns;
      return this.__get_df_from_tensor(sum_vals, col_names);
    } else {
      throw Error("TypeError: Dtypes of column must be Float of Int");
    }
  }

  query(kwargs) {
    let operators = [">", "<", "<=", ">=", "=="];

    if (Object.prototype.hasOwnProperty.call(kwargs, "column")) {
      if (this.columns.includes(kwargs["column"])) {
        var column_index = this.columns.indexOf(kwargs["column"]);
      } else {
        throw new Error(`column ${kwargs["column"]} does not exist`);
      }
    } else {
      throw new Error("specify the column");
    }

    if (Object.prototype.hasOwnProperty.call(kwargs, "operator")) {
      if (operators.includes(kwargs["operator"])) {
        var operator = kwargs["operator"];
      } else {
        throw new Error(` ${kwargs["operator"]} is not identified`);
      }
    } else {
      throw new Error("specify operator");
    }

    if (Object.prototype.hasOwnProperty.call(kwargs, "value")) {
      var value = kwargs["value"];
    } else {
      throw new Error("specify value");
    }

    let data = this.values;
    let new_data = [];

    for (var i = 0; i < data.length; i++) {
      let data_value = data[i];
      let elem = data_value[column_index];

      if (eval(`${elem}${operator}${value}`)) {
        new_data.push(data_value);
      }
    }

    let columns = this.columns;
    let new_df = new DataFrame(new_data, {
      "columns": columns
    });
    return new_df;
  }

  addColumn(kwargs) {
    let data_length = this.shape[0];

    utils.__in_object(kwargs, "column", "column name not specified");

    utils.__in_object(kwargs, "value", "column value not specified");

    let value = kwargs["value"];
    let column_name = kwargs["column"];

    if (value.length != data_length) {
      throw new Error(`Array length ${value.length} not equal to ${data_length}`);
    }

    let data = this.values;
    let new_data = [];
    data.map(function (val, index) {
      let new_val = val.slice();
      new_val.push(value[index]);
      new_data.push(new_val);
    });
    this.data = new_data;
    this.col_data = utils.__get_col_values(new_data);
    this.data_tensor = tf.tensor(new_data);
    this.columns.push(column_name);
  }

  groupby(col) {
    let len = this.shape[0] - 1;
    let column_names = this.column_names;
    let col_dict = {};
    let key_column = null;

    if (col.length == 2) {
      if (column_names.includes(col[0])) {
        var [data1, col_name1] = this.__indexLoc({
          "rows": [`0:${len}`],
          "columns": [`${col[0]}`],
          "type": "loc"
        });
      } else {
        throw new Error(`column ${col[0]} does not exist`);
      }

      if (column_names.includes(col[1])) {
        var [data2, col_name2] = this.__indexLoc({
          "rows": [`0:${len}`],
          "columns": [`${col[1]}`],
          "type": "loc"
        });
      } else {
        throw new Error(`column ${col[1]} does not exist`);
      }

      key_column = [col[0], col[1]];

      var column_1_Unique = utils.__unique(data1);

      var column_2_unique = utils.__unique(data2);

      for (var i = 0; i < column_1_Unique.length; i++) {
        let col_value = column_1_Unique[i];
        col_dict[col_value] = {};

        for (var j = 0; j < column_2_unique.length; j++) {
          let col2_value = column_2_unique[j];
          col_dict[col_value][col2_value] = [];
        }
      }
    } else {
      if (column_names.includes(col[0])) {
        var [data1, col_name1] = this.__indexLoc({
          "rows": [`0:${len}`],
          "columns": [`${col[0]}`],
          "type": "loc"
        });
      } else {
        throw new Error(`column ${col[0]} does not exist`);
      }

      key_column = [col[0]];

      var column_Unique = utils.__unique(data1);

      for (let i = 0; i < column_Unique.length; i++) {
        let col_value = column_Unique[i];
        col_dict[col_value] = [];
      }
    }

    let groups = new _groupby.GroupBy(col_dict, key_column, this.values, column_names).group();
    return groups;
  }

  column(col_name) {
    if (!this.columns.includes(col_name)) {
      throw new Error(`column ${col_name} does not exist`);
    }

    let col_indx_objs = utils.__arr_to_obj(this.columns);

    let indx = col_indx_objs[col_name];
    let data = this.col_data[indx];
    return new _series.Series(data, {
      columns: [col_name]
    });
  }

  static concat(kwargs) {
    utils.__in_object(kwargs, "df_list", "df_list not found: specify the list of dataframe");

    utils.__in_object(kwargs, "axis", "axis not found: specify the axis");

    let df_list = null;
    let axis = null;

    if (Array.isArray(kwargs["df_list"])) {
      df_list = kwargs["df_list"];
    } else {
      throw new Error("df_list must be an Array of dataFrame");
    }

    if (typeof kwargs["axis"] === "number") {
      if (kwargs["axis"] == 0 || kwargs["axis"] == 1) {
        axis = kwargs["axis"];
      } else {
        throw new Error("Invalid axis: axis must be 0 or 1");
      }
    } else {
      throw new Error("axis must be a number");
    }

    let df_object = Object.assign({}, df_list);

    if (axis == 1) {
      let columns = [];
      let duplicate_col_count = {};
      let max_length = 0;

      for (let key in df_object) {
        let column = df_object[key].columns;
        let length = df_object[key].values.length;

        if (length > max_length) {
          max_length = length;
        }

        for (let index in column) {
          let col_name = column[index];

          if (col_name in duplicate_col_count) {
            let count = duplicate_col_count[col_name];
            let name = `${col_name}_${count + 1}`;
            columns.push(name);
            duplicate_col_count[col_name] = count + 1;
          } else {
            columns.push(col_name);
            duplicate_col_count[col_name] = 1;
          }
        }
      }

      let data = new Array(max_length);

      for (let key in df_list) {
        let values = df_list[key].values;

        for (let index = 0; index < values.length; index++) {
          let val = values[index];

          if (typeof data[index] === "undefined") {
            data[index] = val;
          } else {
            data[index].push(...val);
          }
        }

        if (values.length < max_length) {
          let column_length = df_list[key].columns.length;
          let null_array = Array(column_length);

          for (let col = 0; col < column_length; col++) {
            null_array[col] = "NaN";
          }

          if (typeof data[max_length - 1] === "undefined") {
            data[max_length - 1] = null_array;
          } else {
            data[max_length - 1].push(...null_array);
          }
        }
      }

      let df = new DataFrame(data, {
        columns: columns
      });
      return df;
    } else {
      let columns = [];

      for (let key in df_list) {
        let column = df_list[key].columns;
        columns.push(...column);
      }

      let column_set = new Set(columns);
      columns = Array.from(column_set);
      let data = [];

      for (let key in df_list) {
        let value = df_list[key].values;
        let df_columns = df_list[key].columns;
        let not_exist = [];

        for (let col_index in columns) {
          let col_name = columns[col_index];
          let is_index = df_columns.indexOf(col_name);

          if (is_index == -1) {
            not_exist.push(col_name);
          }
        }

        if (not_exist.length > 0) {
          for (let i = 0; i < value.length; i++) {
            let row_value = value[i];
            let new_arr = Array(columns.length);

            for (let j = 0; j < columns.length; j++) {
              let col_name = columns[j];

              if (not_exist.includes(col_name)) {
                new_arr[j] = "NaN";
              } else {
                let index = df_columns.indexOf(col_name);
                new_arr[j] = row_value[index];
              }
            }

            data.push(new_arr);
          }
        } else {
          data.push(...value);
        }
      }

      let df = new DataFrame(data, {
        columns: columns
      });
      return df;
    }
  }

  static merge(kwargs) {
    let merge = new _merge.Merge(kwargs);
    return merge;
  }

  apply(kwargs) {
    let is_callable = utils.__is_function(kwargs["callable"]);

    if (!is_callable) {
      throw new Error("the arguement most be a function");
    }

    let callable = kwargs["callable"];
    let data = [];

    if (!(kwargs["axis"] == 0) && !(kwargs["axis"] == 1)) {
      throw new Error("axis must either be 0 or 1");
    }

    let axis = kwargs["axis"];

    if (axis == 1) {
      let df_data = this.values;

      for (let i = 0; i < df_data.length; i++) {
        let row_value = tf.tensor(df_data[i]);
        let callable_data = callable(row_value).arraySync();
        data.push(callable_data);
      }
    } else {
      let df_data = this.col_data;

      for (let i = 0; i < df_data.length; i++) {
        let row_value = tf.tensor(df_data[i]);
        let callable_data = callable(row_value).arraySync();
        data.push(callable_data);
      }
    }

    return data;
  }

  __get_df_from_tensor(val, col_names) {
    let len = val.shape[0];
    let new_array = [];

    for (let i = 0; i < len; i++) {
      let arr = val.slice([i], [1]).arraySync()[0];
      new_array.push(arr);
    }

    return new DataFrame(new_array, {
      columns: col_names
    });
  }

  __frame_is_compactible_for_operation() {
    let dtypes = this.dtypes;

    const float = element => element == "float32";

    const int = element => element == "int32";

    if (dtypes.every(float)) {
      return true;
    } else if (dtypes.every(int)) {
      return true;
    } else {
      return false;
    }
  }

  __get_ops_tensors(tensors, axis) {
    if (utils.__is_undefined(tensors[1].series)) {
      let tensors_arr = [];

      if (utils.__is_undefined(axis) || axis == 1) {
        tensors_arr.push(tensors[0].row_data_tensor);
        tensors_arr.push(tensors[1]);
        return tensors_arr;
      } else {
        tensors_arr.push(tensors[0].col_data_tensor);
        tensors_arr.push(tensors[1]);
        return tensors_arr;
      }
    } else {
      let tensors_arr = [];

      if (utils.__is_undefined(axis) || axis == 1) {
        let this_tensor, other_tensor;
        this_tensor = tensors[0].row_data_tensor;

        if (tensors[1].series) {
          other_tensor = tf.tensor(tensors[1].values, [1, tensors[1].values.length]);
        } else {
          other_tensor = tensors[1].row_data_tensor;
        }

        tensors_arr.push(this_tensor);
        tensors_arr.push(other_tensor);
        return tensors_arr;
      } else {
        let this_tensor, other_tensor;
        this_tensor = tensors[0].row_data_tensor;

        if (tensors[1].series) {
          other_tensor = tf.tensor(tensors[1].values, [tensors[1].values.length, 1]);
        } else {
          other_tensor = tensors[1].col_data_tensor;
        }

        tensors_arr.push(this_tensor);
        tensors_arr.push(other_tensor);
        return tensors_arr;
      }
    }
  }

}

exports.DataFrame = DataFrame;
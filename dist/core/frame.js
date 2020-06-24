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
            let start = parseInt(row_split[0]);
            let end = parseInt(row_split[1]);

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
        if (kwargs["columns"].length == 1 && typeof kwargs["columns"][0] == "string") {
          if (kwargs["columns"][0].includes(":")) {
            let row_split = kwargs["columns"][0].split(":");
            let start, end;

            if (kwargs["type"] == "iloc") {
              start = parseInt(row_split[0]);
              end = parseInt(row_split[1]);
            } else {
              let axes = this.axes["columns"];
              start = parseInt(axes.indexOf(row_split[0]));
              end = parseInt(axes.indexOf(row_split[1]));
            }

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
    let axes = this.axes;
    let new_data = [];

    for (var index = 0; index < rows.length; index++) {
      let row_val = rows[index];
      let max_rowIndex = data_values.length - 1;

      if (row_val > max_rowIndex) {
        throw new Error(`row index ${row_val} is bigger than ${max_rowIndex}`);
      }

      let value = data_values[row_val];
      let row_data = [];

      for (var i in columns) {
        var col_index;

        if (kwargs["type"] == "loc" && !isColumnSplit) {
          col_index = axes["columns"].indexOf(columns[i]);

          if (col_index == -1) {
            throw new Error(`Column ${columns[i]} does not exist`);
          }
        } else {
          col_index = columns[i];
          let max_colIndex = axes["columns"].length - 1;

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
      let axes = this.axes;
      columns.map(col => {
        column_names.push(axes["columns"][col]);
      });
    } else {
      column_names = columns;
    }

    return [new_data, column_names];
  }

  loc(kwargs) {
    kwargs["type"] = "loc";

    let [new_data, columns] = this.__indexLoc(kwargs);

    let df_columns = {
      "columns": columns
    };
    let df = new DataFrame(new_data, df_columns);
    return df;
  }

  iloc(kwargs) {
    kwargs["type"] = "iloc";

    let [new_data, columns] = this.__indexLoc(kwargs);

    let df_columns = {
      "columns": columns
    };
    let df = new DataFrame(new_data, df_columns);
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
    if (rows > this.values.length || rows < 1) {
      let config = {
        columns: this.column_names
      };
      return new DataFrame(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };
      let data = this.values.slice(this.values.length - rows);
      return new DataFrame(data, config);
    }
  }

  sample(num = 1) {
    if (num > this.values.length || num < 1) {
      let config = {
        columns: this.column_names
      };
      return new DataFrame(this.values, config);
    } else {
      let config = {
        columns: this.column_names
      };

      let sampled_arr = utils.__sample_from_iter(this.values, num);

      return new DataFrame(sampled_arr, config);
    }
  }

  query(kwargs) {
    let operators = [">", "<", "<=", ">=", "=="];

    if (Object.prototype.hasOwnProperty.call(kwargs, "column")) {
      let axes = this.axes;

      if (axes["columns"].includes(kwargs["column"])) {
        var column_index = axes["columns"].indexOf(kwargs["column"]);
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

    let columns = this.axes["columns"];
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
    let dtype = this.dtypes[indx];
    return new _series.Series(data, {
      columns: col_name,
      dtypes: dtype
    });
  }

}

exports.DataFrame = DataFrame;
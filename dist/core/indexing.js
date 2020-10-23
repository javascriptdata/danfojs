"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexLoc = void 0;

var _utils = require("./utils");

const utils = new _utils.Utils();

const indexLoc = (ndframe, kwargs) => {
  let rows = null;
  let columns = null;
  let isColumnSplit = false;

  if (Object.prototype.hasOwnProperty.call(kwargs, "rows")) {
    if (Array.isArray(kwargs["rows"])) {
      if (kwargs["rows"].length == 1 && typeof kwargs["rows"][0] == "string") {
        if (kwargs["rows"][0].includes(":")) {
          let row_split = kwargs["rows"][0].split(":");

          if (kwargs['type'] == 'loc') {
            let start, end;

            if (isNaN(Number(row_split[0]))) {
              start = ndframe.index.indexOf(row_split[0]);
            } else {
              start = Number(row_split[0]);
            }

            if (isNaN(Number(row_split[1]))) {
              end = ndframe.index.lastIndexOf(row_split[1]) - 1 || ndframe.values.length - 1;
            } else {
              end = Number(row_split[1]) - 1 || ndframe.values.length - 1;
            }

            rows = utils.__range(start, end);
          } else {
            let start = parseInt(row_split[0]) || 0;
            let end = parseInt(row_split[1]) - 1 || ndframe.values.length - 1;

            if (typeof start == "number" && typeof end == "number") {
              rows = utils.__range(start, end);
            }
          }
        } else {
          if (kwargs["type"] == "loc") {
            let row_idx = [];
            ndframe.index.map((idx, i) => {
              if (kwargs['rows'][0] == idx) {
                row_idx.push(i);
              }
            });
            rows = row_idx;
          } else {
            throw new Error("Slice index must be separated by ':'");
          }
        }
      } else {
        if (kwargs["type"] == "loc") {
          let row_idx = [];
          ndframe.index.map((idx, i) => {
            if (kwargs['rows'].includes(idx)) {
              row_idx.push(i);
            }
          });
          rows = row_idx;
        } else {
          rows = kwargs["rows"];
        }
      }
    } else {
      throw new Error("rows parameter must be a Array");
    }
  } else {
    if (kwargs["type"] == "loc") {
      rows = utils.__range(0, Number(ndframe.shape[0]) - 1);
    } else {
      rows = utils.__range(0, Number(ndframe.shape[0]) - 1);
    }
  }

  if (Object.prototype.hasOwnProperty.call(kwargs, "columns")) {
    if (Array.isArray(kwargs["columns"])) {
      if (kwargs["columns"].length == 1 && kwargs["columns"][0].includes(":")) {
        let row_split = kwargs["columns"][0].split(":");
        let start, end;

        if (kwargs["type"] == "iloc" || row_split[0] == "") {
          start = parseInt(row_split[0]) || 0;
          end = parseInt(row_split[1]) - 1 || ndframe.values[0].length - 1;
        } else {
          start = parseInt(ndframe.columns.indexOf(row_split[0]));
          end = parseInt(ndframe.columns.indexOf(row_split[1])) - 1;
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
    if (kwargs["type"] == "loc") {
      columns = ndframe.column_names;
    } else {
      columns = utils.__range(0, Number(ndframe.shape[1]) - 1);
    }
  }

  let data_values = ndframe.values;
  let new_data = [];

  for (var index = 0; index < rows.length; index++) {
    let row_val = rows[index];
    let max_rowIndex = data_values.length - 1;

    if (row_val > max_rowIndex) {
      throw new Error(`Specified row index ${row_val} is bigger than maximum row index of ${max_rowIndex}`);
    }

    if (Array.isArray(data_values[0])) {
      let value = data_values[row_val];
      let row_data = [];

      for (var i in columns) {
        var col_index;

        if (kwargs["type"] == "loc" && !isColumnSplit) {
          col_index = ndframe.columns.indexOf(columns[i]);

          if (col_index == -1) {
            throw new Error(`Column ${columns[i]} does not exist`);
          }
        } else {
          col_index = columns[i];
          let max_colIndex = ndframe.columns.length - 1;

          if (col_index > max_colIndex) {
            throw new Error(`column index ${col_index} is bigger than ${max_colIndex}`);
          }
        }

        let elem = value[col_index];
        row_data.push(elem);
      }

      new_data.push(row_data);
    } else {
      new_data.push(data_values[row_val]);
    }
  }

  let column_names = [];

  if (kwargs["type"] == "iloc" || isColumnSplit) {
    columns.map(col => {
      column_names.push(ndframe.columns[col]);
    });
  } else {
    column_names = columns;
  }

  let final_row = [];
  rows.forEach(i => {
    final_row.push(ndframe.index[i]);
  });
  return [new_data, column_names, final_row];
};

exports.indexLoc = indexLoc;
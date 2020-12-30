"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_dummies = void 0;

var _frame = require("./frame");

var _utils = require("./utils");

const utils = new _utils.Utils();

function oneHot(in_data, prefix, prefix_sep) {
  let data_set = new Set(in_data);
  let labels = Array.from(data_set);
  let prefix_labels = null;

  if (prefix) {
    prefix_labels = labels.map(x => {
      return prefix + prefix_sep + x;
    });
  } else {
    prefix_labels = labels.map(x => {
      return x;
    });
  }

  let onehot_data = utils.__zeros(in_data.length, labels.length);

  for (let i = 0; i < in_data.length; i++) {
    let elem = in_data[i];
    let elem_index = labels.indexOf(elem);
    onehot_data[i][elem_index] = 1;
  }

  return [onehot_data, prefix_labels];
}

function get_dummy(kwargs = {}) {
  utils.__in_object(kwargs, "data", "data not provided");

  let prefix = kwargs["prefix"] || null;
  let prefix_sep = kwargs["prefix_sep"] || ["_"];
  let columns = kwargs["columns"] || null;
  let is_dataframe = false;
  let in_data = null;

  if (Array.isArray(kwargs["data"])) {
    in_data = kwargs["data"];
  } else if (kwargs["data"] instanceof _frame.DataFrame) {
    in_data = kwargs["data"];
    is_dataframe = true;
  } else {
    in_data = kwargs["data"].values;
  }

  if (!is_dataframe) {
    let [onehot_data, prefix_labels] = oneHot(in_data, prefix, prefix_sep);
    return new _frame.DataFrame(onehot_data, {
      columns: prefix_labels
    });
  } else {
    let column_index = [];

    if (!columns) {
      columns = [];
      in_data.col_types.map((x, i) => {
        if (x == "string") {
          let name_column = in_data.columns[i];
          columns.push(name_column);
          column_index.push(i);
        }
      });
    } else {
      columns.forEach(x => {
        let col_idx = columns.indexOf(x);
        column_index.push(col_idx);
      });
    }

    if (prefix) {
      if (Array.isArray(prefix)) {
        if (prefix.length != columns.length) {
          throw new Error("prefix must be the same length with the number of onehot encoding column");
        }
      } else {
        throw new Error("prefix for dataframe must be an array");
      }
    } else {
      prefix = columns;
    }

    let df_data = in_data.values;
    let df_columns = in_data.columns;
    let col_data = in_data.col_data;
    let column_data = [];
    column_index.forEach(x => {
      column_data.push(col_data[x]);
    });
    let one_hotColumns = [];
    let one_hotData = [];
    column_data.forEach((data, i) => {
      let [onehot_data, prefix_labels] = oneHot(data, prefix[i], prefix_sep);
      one_hotColumns.push(...prefix_labels);

      if (one_hotData.length == 0) {
        one_hotData.push(...onehot_data);
      } else {
        onehot_data.forEach((x, i) => {
          one_hotData[i].push(...x);
        });
      }
    });
    let final_data = df_data.map((elem, i) => {
      let ele = elem.slice();

      let dt = utils.__remove_arr(ele, column_index);

      dt.push(...one_hotData[i]);
      return dt;
    });

    let final_columns = utils.__remove_arr(df_columns, column_index);

    final_columns.push(...one_hotColumns);
    return new _frame.DataFrame(final_data, {
      columns: final_columns
    });
  }
}

const get_dummies = get_dummy;
exports.get_dummies = get_dummies;
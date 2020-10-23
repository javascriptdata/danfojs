"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.read_excel = exports.read_json = exports.read_csv = void 0;

var _frame = require("../core/frame");

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

var _utils = require("../core/utils");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _data = require("data.js");

var _streamToArray = _interopRequireDefault(require("stream-to-array"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const utils = new _utils.Utils();

const read_csv = async (source, chunk) => {
  if (!(utils.__is_browser_env() || source.startsWith("file://") || source.startsWith("http"))) {
    source = `file://${process.cwd()}/${source}`;
  }

  let data = [];
  const csvDataset = tf.data.csv(source);
  const column_names = await csvDataset.columnNames();
  const sample = csvDataset.take(chunk);
  await sample.forEachAsync(row => data.push(Object.values(row)));
  let df = new _frame.DataFrame(data, {
    columns: column_names
  });
  return df;
};

exports.read_csv = read_csv;

const read_json = async source => {
  if (utils.__is_node_env()) {
    if (source.startsWith("https://") || source.startsWith("http://") || source.startsWith("file://")) {
      let res = await (0, _nodeFetch.default)(source, {
        method: "Get"
      });
      let json = await res.json();
      let df = new _frame.DataFrame(json);
      return df;
    } else {
      let fs = await Promise.resolve().then(() => _interopRequireWildcard(require('fs')));
      fs.readFile(source, (err, data) => {
        if (err) throw err;
        let df = new _frame.DataFrame(JSON.parse(data));
        return df;
      });
    }
  } else {
    let res = await (0, _nodeFetch.default)(source, {
      method: "Get"
    });
    let json = await res.json();
    let df = new _frame.DataFrame(json);
    return df;
  }
};

exports.read_json = read_json;

const read_excel = async kwargs => {
  var {
    source,
    sheet_name,
    header_index,
    data_index
  } = kwargs;
  var is_a_url = source.match(/(http(s?)):\/\//g);
  var workbook;

  if (!header_index) {
    header_index = 1;
  }

  if (!data_index) {
    data_index = header_index + 1;
  }

  try {
    if (utils.__is_node_env()) {
      if (is_a_url) {
        let res = await (0, _nodeFetch.default)(source, {
          method: "Get"
        });
        res = await res.arrayBuffer();
        res = new Uint8Array(res);
        workbook = _xlsx.default.read(res, {
          type: "array"
        });
      } else {
        workbook = _xlsx.default.readFile(source);
      }
    } else {
      let res = await (0, _nodeFetch.default)(source, {
        method: "Get"
      });
      res = await res.arrayBuffer();
      res = new Uint8Array(res);
      workbook = _xlsx.default.read(res, {
        type: "array"
      });
    }

    const worksheet = workbook.Sheets[sheet_name || workbook.SheetNames[0]];

    var range = _xlsx.default.utils.decode_range(worksheet['!ref']);

    var column_names = [],
        data = [];

    for (var R = header_index - 1; R <= range.e.r; ++R) {
      var row_data = [];

      for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell_ref;

        if (R == header_index - 1) {
          cell_ref = _xlsx.default.utils.encode_cell({
            c: C,
            r: header_index - 1
          });

          if (worksheet[cell_ref]) {
            column_names.push(worksheet[cell_ref].v);
          }
        }

        if (R >= data_index - 1) {
          cell_ref = _xlsx.default.utils.encode_cell({
            c: C,
            r: R
          });

          if (worksheet[cell_ref]) {
            row_data.push(worksheet[cell_ref].v);
          }
        }
      }

      if (R >= data_index - 1) {
        data.push(row_data);
      }
    }

    let df = new _frame.DataFrame(data, {
      columns: column_names
    });
    return df;
  } catch (err) {
    throw new Error(err);
  }
};

exports.read_excel = read_excel;

const read = async (path_or_descriptor, configs = {
  data_num: 0,
  header: true
}) => {
  let data_num = configs['data_num'];
  let header = configs['header'];
  let rows, file;

  if ((0, _data.isDataset)(path_or_descriptor)) {
    console.log("datapackage.json found. Loading Dataset package from Datahub.io");
    const dataset = await _data.Dataset.load(path_or_descriptor);
    file = dataset.resources[data_num];
    rows = await (0, _streamToArray.default)(await file.rows());
  } else {
    try {
      file = (0, _data.open)(path_or_descriptor);
      rows = await (0, _streamToArray.default)(await file.rows());
    } catch (error) {
      console.log(error);
    }
  }

  if (['csv', 'xls', 'xlsx'].includes(await file.descriptor.format)) {
    if (header) {
      let df = new _frame.DataFrame(rows.slice(1), {
        columns: rows[0]
      });
      return df;
    } else {
      let df = new _frame.DataFrame(rows);
      return df;
    }
  } else {
    let df = new _frame.DataFrame(rows);
    return df;
  }
};

exports.read = read;
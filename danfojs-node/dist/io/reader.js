"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.read_excel = exports.read_json = exports.read_csv = void 0;

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _tfjsNode = require("@tensorflow/tfjs-node");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _frictionless = require("frictionless.js");

var _streamToArray = _interopRequireDefault(require("stream-to-array"));

var _frame = require("../core/frame");

const read_csv = async (source, configs = {}) => {
  let {
    start,
    end
  } = configs;

  if (!(source.startsWith("file://") || source.startsWith("http"))) {
    source = source.startsWith("/") ? `file://${source}` : `file://${process.cwd()}/${source}`;
  }

  let tfdata = [];
  await _tfjsNode.data.csv(source, configs).skip(start).take(end).forEachAsync(row => {
    return tfdata.push(row);
  });
  const df = new _frame.DataFrame(tfdata);
  return df;
};

exports.read_csv = read_csv;

const read_json = async source => {
  if (source.startsWith("https://") || source.startsWith("http://") || source.startsWith("file://")) {
    let res = await (0, _nodeFetch.default)(source, {
      method: "Get"
    });
    let json = await res.json();
    let df = new _frame.DataFrame(json);
    return df;
  } else {
    let fs = await Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require("fs")));
    return new Promise((resolve, reject) => {
      fs.readFile(source, (err, data) => {
        if (err) reject(err);
        let df = new _frame.DataFrame(JSON.parse(data));
        resolve(df);
      });
    });
  }
};

exports.read_json = read_json;

const read_excel = async (source, configs) => {
  const df = await read(source, configs);
  return df;
};

exports.read_excel = read_excel;

const read = async (source, configs = {}) => {
  let {
    data_num,
    header,
    sheet
  } = configs;
  data_num = data_num === undefined ? 0 : data_num;
  header = header === undefined ? true : header;
  let rows, file;

  if ((0, _frictionless.isDataset)(source)) {
    console.log("datapackage.json found. Loading Dataset package from Datahub.io");
    const dataset = await _frictionless.Dataset.load(source);
    file = dataset.resources[data_num];
    rows = await (0, _streamToArray.default)(await file.rows());
  } else {
    try {
      file = (0, _frictionless.open)(source);

      if (sheet) {
        rows = await (0, _streamToArray.default)(await file.rows({
          sheet
        }));
      } else {
        rows = await (0, _streamToArray.default)(await file.rows());
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (["csv", "xls", "xlsx"].includes(await file.descriptor.format)) {
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
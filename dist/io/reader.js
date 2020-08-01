"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read_json = exports.read_csv = void 0;

var _frame = require("../core/frame");

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const read_csv = async (source, config = {}) => {
  let data = [];
  const csvDataset = tf.data.csv(source, config);
  const column_names = await csvDataset.columnNames();
  await csvDataset.forEachAsync(row => data.push(Object.values(row)));
  return new _frame.DataFrame(data, {
    columns: column_names
  });
};

exports.read_csv = read_csv;

const read_json = async source => {
  if (source.startsWith("http")) {
    (0, _nodeFetch.default)(source, {
      method: "Get"
    }).then(res => res.json()).then(json => {
      let df = new _frame.DataFrame(json);
      return df;
    }).catch(err => {
      throw Error(err);
    });
  } else {
    _fs.default.readFile(source, (err, fileData) => {
      if (err) {
        throw Error(err);
      }

      try {
        const object = JSON.parse(fileData);
        let df = new _frame.DataFrame(object);
        return df;
      } catch (err) {
        throw Error(err);
      }
    });
  }
};

exports.read_json = read_json;
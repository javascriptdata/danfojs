"use strict";

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

var _chai = require("chai");

var _reader = require("../../io/reader");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe("read_csv", function () {
  it("reads a csv file from source", async function () {
    const csvUrl = 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';
    const tf_csv_dataset = tf.data.csv(csvUrl);
    const csv_dataset = (0, _reader.read_csv)(csvUrl);
    const tf_num_of_columns = (await tf_csv_dataset.columnNames()).length;
    const num_of_columns = (await csv_dataset.columnNames()).length;

    _chai.assert.equal(tf_num_of_columns, num_of_columns);
  });
});
import { assert } from "chai";
import { read_csv, read_json, read_excel, read } from "../../src/io/reader";

describe("read_csv", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads a csv file from source from local disk", async function () {
    const csvUrl = "tests/samples/titanic.csv";

    const df = await read_csv(csvUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 8);
  });
  it("reads a csv file from remote source", async function () {
    const csvUrl = "https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv";
    const df = await read_csv(csvUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 13);
  });
});

describe("read_json", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads a json file from source over the internet", async function () {
    const jUrl =
      "https://raw.githubusercontent.com/risenW/Tensorflowjs_Projects/master/recommender-sys/Python-Model/web_book_data.json";

    const df = await read_json(jUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 4);

  });

  it("reads a json file from source from local disk", async function () {
    const jUrl = "tests/samples/book.json";

    const df = await read_json(jUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 4);

  });
});

describe("read_excel", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads an excel file from source from local disk", async function () {
    const file = "tests/samples/SampleData.xlsx";
    const df = await read_excel(file);
    assert(df.columns.length, 4);

  });
});

describe("read: Generic read function from frictionless.js", async function () {
  this.timeout(20000); // all tests in this suite get 10 seconds before timeout

  it("read an excel file from source over the internet", async function () {
    const remote_url =
      "https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_100.xls";
    const df = await read(remote_url);
    assert(df.columns.length, 8);

  });

  it("read an excel file from source from local disk", async function () {
    const file_url = "tests/samples/SampleData.xlsx";
    const df = await read(file_url);
    assert(df.columns.length, 4);
  });

  it("read a csv file from source over the internet", async function () {
    const csvUrl =
      "https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv";

    const df = await read(csvUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 13);

  });

  it("read a csv file from source from local disk", async function () {
    const csvUrl = "tests/samples/titanic.csv";

    const df = await read(csvUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 8);

  });
  it("read a csv file from source from local disk with header set to false", async function () {
    const csvUrl = "tests/samples/titanic.csv";
    const df = await read(csvUrl, { header: false });
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 8);

  });

  it("read a Dataset package", async function () {
    const jUrl =
      "https://raw.githubusercontent.com/frictionlessdata/frictionless-js/master/test/fixtures/co2-ppm/datapackage.json";

    const df = await read(jUrl);
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 6);

  });

  it("read a specific data from Dataset package", async function () {
    const jUrl =
      "https://raw.githubusercontent.com/frictionlessdata/frictionless-js/master/test/fixtures/co2-ppm/datapackage.json";

    const df = await read(jUrl, { data_num: 2 });
    const num_of_columns = df.column_names.length;
    assert.equal(num_of_columns, 3);

  });
});

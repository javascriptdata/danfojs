/* eslint-disable no-undef */
describe("read_csv", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads a csv file from source over the internet", async function () {
    const csvUrl =
      "https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv";

    dfd.read_csv(csvUrl).then((df) => {
      const num_of_columns = df.column_names.length;
      assert.equal(num_of_columns, 13);
    });
  });

  it("reads a csv file from source from local disk", async function () {
    const csvUrl = "danfojs/tests/samples/titanic.csv";

    dfd.read_csv(csvUrl).then((df) => {
      const num_of_columns = df.column_names.length;
      assert.equal(num_of_columns, 8);
    });
  });
});

describe("read_json", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads a json file from source over the internet", async function () {
    const jUrl =
      "https://raw.githubusercontent.com/risenW/Tensorflowjs_Projects/master/recommender-sys/Python-Model/web_book_data.json";

    dfd.read_json(jUrl).then((df) => {
      const num_of_columns = df.column_names.length;
      assert.equal(num_of_columns, 4);
    });
  });

  it("reads a json file from source from local disk", async function () {
    const jUrl = "danfojs/tests/samples/book.json";

    dfd.read_json(jUrl).then((df) => {
      const num_of_columns = df.column_names.length;
      assert.equal(num_of_columns, 4);
    });
  });
});

describe("read_excel", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads an excel file from source over the internet", async function () {
    const remote_url =
      "https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_100.xls";
    dfd.read_excel({ source: remote_url }).then((df) => {
      assert(df.columns.length, 8);
    });
  });

  it("reads an excel file from source from local disk", async function () {
    const file_url = "danfojs/tests/samples/SampleData.xlsx";
    dfd.read_excel({ source: file_url, header_index: 7, data_index: 8 }).then(
      (df) => {
        assert(df.columns.length, 4);
      }
    );
  });
});

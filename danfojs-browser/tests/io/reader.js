/* eslint-disable no-undef */

describe("read_csv", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads a csv file from source over the internet", async function () {
    const csvUrl =
        "https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv";

    const df = await dfd.read_csv(csvUrl);
    const num_of_columns = df.columns.length;
    assert.equal(num_of_columns, 13);

  });
});

describe("read_json", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads a json file from source over the internet", async function () {
    const jUrl =
      "https://raw.githubusercontent.com/risenW/Tensorflowjs_Projects/master/recommender-sys/Python-Model/web_book_data.json";

    const df = await dfd.read_json(jUrl);
    const num_of_columns = df.columns.length;
    assert.equal(num_of_columns, 4);

  });

});

describe("read_excel", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads an excel file from source over the internet", async function () {
    const remote_url =
      "https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_100.xls";
    const df = await dfd.read_excel(remote_url, { sheet: 0 });
    assert(df.columns.length, 8);
  });

});

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
  this.timeout(100000); // all tests in this suite get 10 seconds before timeout
  it("reads a json file from source over the internet", async function () {
    const jUrl =
      "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/book.json";

    const df = await dfd.read_json(jUrl);
    assert.deepEqual(df.columns, [
      'book_id',
      'title',
      'image_url',
      'authors'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'string',
      'string', 'string'
    ]);

  });

});

describe("read_excel", async function () {
  this.timeout(10000); // all tests in this suite get 10 seconds before timeout
  it("reads an excel file from source over the internet", async function () {
    const remote_url =
      "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/SampleData.xlsx";
    const df = await dfd.read_excel(remote_url);
    assert.deepEqual(df.columns, [
      'Year',
      'Stocks',
      'T.Bills',
      'T.Bonds'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'float32',
      'float32', 'float32'
    ]);
    assert.deepEqual(df.shape, [ 82, 4 ]);
  });

});

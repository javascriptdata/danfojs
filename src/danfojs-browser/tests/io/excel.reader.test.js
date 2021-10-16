/* eslint-disable no-undef */

describe("readExcel", function () {
  this.timeout(100000);
  it("Read remote excel file works", async function () {
    const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/SampleData.xlsx";
    let df = await dfd.readExcel(remoteFile);
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


/* eslint-disable no-undef */

describe("readExcel", function () {
  this.timeout(100000);
  it("Read remote excel file works", async function () {
    const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev//src/danfojs-node/test/samples/sample.xlsx";
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

  it("Read remote excel file with config works", async function () {
    const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev//src/danfojs-node/test/samples/sample.xlsx";
    const frameConfig = {
      columns: [
        'A',
        'B',
        'C',
        'D'
      ]
    };
    let df = await dfd.readExcel(remoteFile, { frameConfig });
    assert.deepEqual(df.columns, [
      'A',
      'B',
      'C',
      'D'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'float32',
      'float32', 'float32'
    ]);
    assert.deepEqual(df.shape, [ 82, 4 ]);
  });
});


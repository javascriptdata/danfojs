/* eslint-disable no-undef */

describe("readCSV", function () {
  this.timeout(10000);
  it("Read remote csv file works", async function () {
    const remoteFile = "https://raw.githubusercontent.com/javascriptdata/danfojs/dev/src/danfojs-node/test/samples/titanic.csv";
    let df = await dfd.readCSV(remoteFile, { header: true, preview: 5 });
    assert.deepEqual(df.shape, [ 5, 8 ]);
    assert.deepEqual(df.columns, [
      'Survived',
      'Pclass',
      'Name',
      'Sex',
      'Age',
      'Siblings/Spouses Aboard',
      'Parents/Children Aboard',
      'Fare'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'int32',
      'string', 'string',
      'int32', 'int32',
      'int32', 'float32'
    ]);
  });

  it("Read remote csv file with config works", async function () {
    const remoteFile = "https://raw.githubusercontent.com/javascriptdata/danfojs/dev/src/danfojs-node/test/samples/titanic.csv";
    const frameConfig = {
      columns: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H'
      ]
    };
    let df = await dfd.readCSV(remoteFile, { header: true, preview: 5, frameConfig });
    assert.deepEqual(df.shape, [ 5, 8 ]);
    assert.deepEqual(df.columns, [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'int32',
      'string', 'string',
      'int32', 'int32',
      'int32', 'float32'
    ]);
  });

  it("Read remote csv file works and returns correct data type", async function () {
    const remoteFile = "https://raw.githubusercontent.com/javascriptdata/danfojs/dev/src/danfojs-node/test/samples/titanic.csv";
    let df = await dfd.readCSV(remoteFile, { header: true, preview: 2 });
    const values = [
      [ 0, 3, 'Mr. Owen Harris Braund', 'male', 22, 1, 0, 7.25 ],
      [ 1, 1, 'Mrs. John Bradley (Florence Briggs Thayer) Cumings', 'female', 38, 1, 0, 71.2833 ]
    ];
    assert.deepEqual(df.values, values);
  });

});

// describe("streamCSV", function () {
//   this.timeout(100000);

//   it("Streaming remote csv file with callback works", async function () {
//     const remoteFile = "https://raw.githubusercontent.com/javascriptdata/danfojs/dev/src/danfojs-node/test/samples/titanic.csv";
//     await dfd.streamCSV(remoteFile, (df) => {
//       if (df) {
//         assert.deepEqual(df.shape, [ 1, 8 ]);
//         assert.deepEqual(df.columns, [
//           'Survived',
//           'Pclass',
//           'Name',
//           'Sex',
//           'Age',
//           'Siblings/Spouses Aboard',
//           'Parents/Children Aboard',
//           'Fare'
//         ]);
//       } else {
//         assert.deepEqual(df, null);
//       }
//     }, { header: true, preview: 3 });

//   });

// });


describe("toCSV", function () {
  it("toCSV works", async function () {
    const data = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ];
    let df = new dfd.DataFrame(data, { columns: [ "a", "b", "c", "d" ] });
    assert.deepEqual(dfd.toCSV(df, { download: false }), `a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
  });
  it("toCSV works for specified seperator", async function () {
    const data = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ];
    let df = new dfd.DataFrame(data, { columns: [ "a", "b", "c", "d" ] });
    assert.deepEqual(dfd.toCSV(df, { sep: "+", download: false }), `a+b+c+d\n1+2+3+4\n5+6+7+8\n9+10+11+12\n`);
  });
  it("toCSV works for series", async function () {
    const data = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
    let df = new dfd.Series(data);
    assert.deepEqual(dfd.toCSV(df, { sep: "+", download: false }), `1+2+3+4+5+6+7+8+9+10+11+12`);
  });

});

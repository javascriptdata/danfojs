/* eslint-disable no-undef */

describe("StandardScaler", function () {

  it("StandardScaler works for DataFrame", function () {
    const data = [ [ 0, 0 ], [ 0, 0 ], [ 1, 1 ], [ 1, 1 ] ];

    const scaler = new dfd.StandardScaler();
    scaler.fit(new dfd.DataFrame(data));

    const expected = [ [ -1, -1 ], [ -1, -1 ], [ 1, 1 ], [ 1, 1 ] ];
    const resultDf = scaler.transform(new dfd.DataFrame(data));
    assert.deepEqual(resultDf.values, expected);
    assert.deepEqual(scaler.transform([ [ 2, 2 ] ]), [ [ 3, 3 ] ]);
  });
  it("fitTransform works for StandardScaler", function () {
    const data = [ [ 0, 0 ], [ 0, 0 ], [ 1, 1 ], [ 1, 1 ] ];

    const scaler = new dfd.StandardScaler();
    const resultDf = scaler.fitTransform(new dfd.DataFrame(data));

    const expected = [ [ -1, -1 ], [ -1, -1 ], [ 1, 1 ], [ 1, 1 ] ];
    assert.deepEqual(resultDf.values, expected);
  });
  it("inverseTransform works for StandardScaler", function () {
    const data = [ [ 0, 0 ], [ 0, 0 ], [ 1, 1 ], [ 1, 1 ] ];

    const scaler = new dfd.StandardScaler();
    scaler.fit(new dfd.DataFrame(data));
    const resultDf = scaler.inverseTransform([ [ -1, -1 ], [ -1, -1 ], [ 1, 1 ], [ 1, 1 ] ]);

    assert.deepEqual(resultDf, data);
  });
  it("StandardScaler works for Array", function () {
    const data = [ [ 0, 0 ], [ 0, 0 ], [ 1, 1 ], [ 1, 1 ] ];

    const scaler = new dfd.StandardScaler();
    scaler.fit(data);
    const expected = [ [ -1, -1 ], [ -1, -1 ], [ 1, 1 ], [ 1, 1 ] ];

    assert.deepEqual(scaler.transform(data), expected);
    assert.deepEqual(scaler.transform([ [ 2, 2 ] ]), [ [ 3, 3 ] ]);
  });

  it("StandardScaler works for Series", function () {
    const data = [ 0, 0, 0, 0, 1, 1, 1, 1 ];

    const scaler = new dfd.StandardScaler();
    scaler.fit(new dfd.Series(data));
    const expected = [ -1, -1, -1, -1, 1, 1, 1, 1 ];

    assert.deepEqual(scaler.transform(new dfd.Series(data)).values, expected);
    assert.deepEqual(scaler.transform([ 2, 2 ]), [ 3, 3 ]);
  });
});

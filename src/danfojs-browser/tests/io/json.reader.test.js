/* eslint-disable no-undef */

describe("readJSON", function () {
  this.timeout(100000);

  it("Read remote csv file works", async function () {
    const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/book.json";
    const df = await dfd.readJSON(remoteFile);
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

describe("toJSON", function () {
  it("toJSON works", async function () {
    const data = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ];
    const df = new dfd.DataFrame(data, { columns: [ "a", "b", "c", "d" ] });
    const expected = [
      { "a": 1, "b": 2, "c": 3, "d": 4 },
      { "a": 5, "b": 6, "c": 7, "d": 8 },
      { "a": 9, "b": 10, "c": 11, "d": 12 }
    ];
    const json = dfd.toJSON(df, { download: false });
    assert.deepEqual(json, expected);
  });
  it("toJSON works for row format", async function () {
    const data = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ];
    const df = new dfd.DataFrame(data, { columns: [ "a", "b", "c", "d" ] });
    const expected = {
      "a": [ 1, 5, 9 ],
      "b": [ 2, 6, 10 ],
      "c": [ 3, 7, 11 ],
      "d": [ 4, 8, 12 ]
    };
    const json = dfd.toJSON(df, { format: "row", download: false });
    assert.deepEqual(json, expected);
  });

  it("toJSON works for series", async function () {
    const data = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
    const df = new dfd.Series(data);
    assert.deepEqual(dfd.toJSON(df, { download: false }), { "0": [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] });
  });

});

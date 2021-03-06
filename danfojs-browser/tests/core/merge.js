
describe("Merge", function () {

  it("test outer merge", function () {
    let data = [ [ 'K0', 'k0', 'A0', 'B0' ], [ 'k0', 'K1', 'A1', 'B1' ],
      [ 'K1', 'K0', 'A2', 'B2' ], [ 'K2', 'K2', 'A3', 'B3' ] ];

    let data2 = [ [ 'K0', 'k0', 'C0', 'D0' ], [ 'K1', 'K0', 'C1', 'D1' ],
      [ 'K1', 'K0', 'C2', 'D2' ], [ 'K2', 'K0', 'C3', 'D3' ] ];

    let colum1 = [ 'Key1', 'Key2', 'A', 'B' ];
    let colum2 = [ 'Key1', 'Key2', 'A', 'D' ];

    let df1 = new dfd.DataFrame(data, { columns: colum1 });
    let df2 = new dfd.DataFrame(data2, { columns: colum2 });
    let merge_df = dfd.merge({ "left": df1, "right": df2, "on": [ "Key1", "Key2" ], "how": "outer" });

    let output_data = [
      [ 'K0', 'k0', 'A0', 'B0', 'C0', 'D0' ],
      [ 'k0', 'K1', 'A1', 'B1', NaN, NaN ],
      [ 'K1', 'K0', 'A2', 'B2', 'C1', 'D1' ],
      [ 'K1', 'K0', 'A2', 'B2', 'C2', 'D2' ],
      [ 'K2', 'K2', 'A3', 'B3', NaN, NaN ],
      [ 'K2', 'K0', NaN, NaN, 'C3', 'D3' ]
    ];


    assert.deepEqual(merge_df.values, output_data);
  });

  it("test inner merge", function () {
    let data = [ [ 'K0', 'k0', 'A0', 'B0' ], [ 'k0', 'K1', 'A1', 'B1' ],
      [ 'K1', 'K0', 'A2', 'B2' ], [ 'K2', 'K2', 'A3', 'B3' ] ];

    let data2 = [ [ 'K0', 'k0', 'C0', 'D0' ], [ 'K1', 'K0', 'C1', 'D1' ],
      [ 'K1', 'K0', 'C2', 'D2' ], [ 'K2', 'K0', 'C3', 'D3' ] ];

    let colum1 = [ 'Key1', 'Key2', 'A', 'B' ];
    let colum2 = [ 'Key1', 'Key2', 'A', 'D' ];

    let df1 = new dfd.DataFrame(data, { columns: colum1 });
    let df2 = new dfd.DataFrame(data2, { columns: colum2 });
    let merge_df = dfd.merge({ "left": df1, "right": df2, "on": [ "Key1", "Key2" ], "how": "inner" });

    let output_data = [
      [ 'K0', 'k0', 'A0', 'B0', 'C0', 'D0' ],
      [ 'K1', 'K0', 'A2', 'B2', 'C1', 'D1' ],
      [ 'K1', 'K0', 'A2', 'B2', 'C2', 'D2' ]
    ];

    assert.deepEqual(merge_df.values, output_data);
  });

  it("test left merge", function () {
    let data = [ [ 'K0', 'k0', 'A0', 'B0' ], [ 'k0', 'K1', 'A1', 'B1' ],
      [ 'K1', 'K0', 'A2', 'B2' ], [ 'K2', 'K2', 'A3', 'B3' ] ];

    let data2 = [ [ 'K0', 'k0', 'C0', 'D0' ], [ 'K1', 'K0', 'C1', 'D1' ],
      [ 'K1', 'K0', 'C2', 'D2' ], [ 'K2', 'K0', 'C3', 'D3' ] ];

    let colum1 = [ 'Key1', 'Key2', 'A', 'B' ];
    let colum2 = [ 'Key1', 'Key2', 'A', 'D' ];

    let df1 = new dfd.DataFrame(data, { columns: colum1 });
    let df2 = new dfd.DataFrame(data2, { columns: colum2 });
    let merge_df = dfd.merge({ "left": df1, "right": df2, "on": [ "Key1", "Key2" ], "how": "left" });

    let output_data = [
      [ 'K0', 'k0', 'A0', 'B0', 'C0', 'D0' ],
      [ 'k0', 'K1', 'A1', 'B1', NaN, NaN ],
      [ 'K1', 'K0', 'A2', 'B2', 'C1', 'D1' ],
      [ 'K1', 'K0', 'A2', 'B2', 'C2', 'D2' ],
      [ 'K2', 'K2', 'A3', 'B3', NaN, NaN ]
    ];

    assert.deepEqual(merge_df.values, output_data);
  });

  it("test right merge", function () {
    let data = [ [ 'K0', 'k0', 'A0', 'B0' ], [ 'k0', 'K1', 'A1', 'B1' ],
      [ 'K1', 'K0', 'A2', 'B2' ], [ 'K2', 'K2', 'A3', 'B3' ] ];

    let data2 = [ [ 'K0', 'k0', 'C0', 'D0' ], [ 'K1', 'K0', 'C1', 'D1' ],
      [ 'K1', 'K0', 'C2', 'D2' ], [ 'K2', 'K0', 'C3', 'D3' ] ];

    let colum1 = [ 'Key1', 'Key2', 'A', 'B' ];
    let colum2 = [ 'Key1', 'Key2', 'A', 'D' ];

    let df1 = new dfd.DataFrame(data, { columns: colum1 });
    let df2 = new dfd.DataFrame(data2, { columns: colum2 });
    let merge_df = dfd.merge({ "left": df1, "right": df2, "on": [ "Key1", "Key2" ], "how": "right" });

    let output_data = [
      [ 'K0', 'k0', 'A0', 'B0', 'C0', 'D0' ],
      [ 'K1', 'K0', 'A2', 'B2', 'C1', 'D1' ],
      [ 'K1', 'K0', 'A2', 'B2', 'C2', 'D2' ],
      [ 'K2', 'K0', NaN, NaN, 'C3', 'D3' ]
    ];

    assert.deepEqual(merge_df.values, output_data);
  });
});

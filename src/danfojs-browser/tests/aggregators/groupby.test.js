/* eslint-disable no-undef */

describe("groupby", function () {
  it("Check group by One column data", function () {
    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let groupDf = df.groupby([ "A" ]);

    let groupDict = {
      '1': { A: [ 1 ], B: [ 2 ], C: [ 3 ] },
      '4': { A: [ 4 ], B: [ 5 ], C: [ 6 ] },
      '20': { A: [ 20 ], B: [ 30 ], C: [ 40 ] },
      '39': { A: [ 39 ], B: [ 89 ], C: [ 78 ] }
    };
    assert.deepEqual(groupDf.colDict, groupDict);
  });

  it("Obtain the DataFrame of one of the group", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 2, 3 ] ];
    assert.deepEqual(group_df.getGroup([ 1 ]).values, new_data);
  });

  it("Check group by Two column data", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = {
      '1-2': { A: [ 1 ], B: [ 2 ], C: [ 3 ] },
      '4-5': { A: [ 4 ], B: [ 5 ], C: [ 6 ] },
      '20-30': { A: [ 20 ], B: [ 30 ], C: [ 40 ] },
      '39-89': { A: [ 39 ], B: [ 89 ], C: [ 78 ] }
    };
    assert.deepEqual(group_df.colDict, new_data);
  });

  it("Obtain the DataFrame of one of the group, grouped by two column", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [ [ 1, 2, 3 ] ];

    assert.deepEqual(group_df.getGroup([ 1, 2 ]).values, new_data);
  });

  it("Count column in group", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [
      [ 1, 2, 1 ],
      [ 4, 5, 1 ],
      [ 20, 30, 1 ],
      [ 39, 89, 1 ]
    ];

    assert.deepEqual(group_df.col([ "C" ]).count().values, new_data);
  });

  it("sum column element in group", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [
      [ 1, 2, 3 ],
      [ 4, 5, 6 ],
      [ 20, 30, 40 ],
      [ 39, 89, 78 ]
    ];
    assert.deepEqual(group_df.col([ "C" ]).sum().values, new_data);
  });

  it("sum column element group by two column", function () {

    let data = [ [ 1, 2, 3 ], [ 1, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);

    let new_data = [
      [ 1, 2, 2, 3 ],
      [ 1, 5, 5, 6 ],
      [ 20, 30, 30, 40 ],
      [ 39, 89, 89, 78 ]
    ];

    assert.deepEqual(group_df.col([ "B", "C" ]).sum().values, new_data);
  });

  it("Perform aggregate on column for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [
      [ 1, 2, 2, 1 ],
      [ 4, 5, 5, 1 ],
      [ 20, 30, 30, 1 ],
      [ 39, 89, 89, 1 ]
    ];

    assert.deepEqual(group_df.agg({ B: "mean", C: "count" }).values, new_data);
  });

  it("cummulative sum for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [
      [ 1, 2, 2, 3 ],
      [ 4, 5, 5, 6 ],
      [ 20, 30, 30, 40 ],
      [ 39, 89, 89, 78 ]
    ];
    assert.deepEqual(group_df.col([ "B", "C" ]).cumSum().values, new_data);
  });

  it("cummulative max for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 3 ], [ 4, 6 ], [ 20, 40 ], [ 39, 78 ] ];


    assert.deepEqual(group_df.col([ "C" ]).cumMax().values, new_data);
  });

  it("cummulative min for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 3 ], [ 4, 6 ], [ 20, 40 ], [ 39, 78 ] ];

    assert.deepEqual(group_df.col([ "C" ]).cumMin().values, new_data);
  });

  it("cummulative prod for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 3 ], [ 4, 6 ], [ 20, 40 ], [ 39, 78 ] ];

    assert.deepEqual(group_df.col([ "C" ]).cumProd().values, new_data);
  });

  it("mean for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new dfd.DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [
      [ 1, 2, 2, 3 ],
      [ 4, 5, 5, 6 ],
      [ 20, 30, 30, 40 ],
      [ 39, 89, 89, 78 ]
    ];

    assert.deepEqual(group_df.col([ "B", "C" ]).mean().values, new_data);
  });

  it("should apply grouby operation to all column", function(){
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let grp = df.groupby([ "A", "B" ]);
    let rslt = [
      [ 'foo', 'one', 2, 2 ],
      [ 'foo', 'two', 2, 2 ],
      [ 'foo', 'three', 1, 1 ],
      [ 'bar', 'one', 1, 1 ],
      [ 'bar', 'three', 1, 1 ],
      [ 'bar', 'two', 1, 1 ]
    ];

    assert.deepEqual(grp.count().values, rslt);
  });
  it("should apply function to specific column", function () {

    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A" ]);
    let rslt = [
      [ 'foo', 5, 3 ],
      [ 'foo', 6, 4 ],
      [ 'foo', 7, 7 ],
      [ 'foo', 9, 8 ],
      [ 'foo', 10, 9 ],
      [ 'bar', 4, 5 ],
      [ 'bar', 3, 6 ],
      [ 'bar', 8, 4 ]
    ];
    assert.deepEqual(group_df.col([ 'D', 'C' ]).apply((x) => x.add(2)).values, rslt);
  });

  it("should apply function to group column", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A", "B" ]);
    let rslt = [
      [ 'foo', 'one', 2, 2, 2, 2 ],
      [ 'foo', 'two', 2, 2, 2, 2 ],
      [ 'foo', 'three', 1, 1, 1, 1 ],
      [ 'bar', 'one', 1, 1, 1, 1 ],
      [ 'bar', 'three', 1, 1, 1, 1 ],
      [ 'bar', 'two', 1, 1, 1, 1 ]
    ];
    assert.deepEqual(group_df.apply((x) => x.count({ axis:0 })).values, rslt);
  });

  it("should obtain the number of groups", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A", "B" ]);
    let rslt = 6;
    assert.equal(group_df.ngroups, rslt);
  });
  it("should obtain all groups", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A", "B" ]);
    let rslt = {
      'foo-one': {
        A: [ 'foo', 'foo' ],
        B: [ 'one', 'one' ],
        C: [ 1, 6 ],
        D: [ 3, 7 ]
      },
      'bar-one': { A: [ 'bar' ], B: [ 'one' ], C: [ 3 ], D: [ 2 ] },
      'foo-two': {
        A: [ 'foo', 'foo' ],
        B: [ 'two', 'two' ],
        C: [ 2, 5 ],
        D: [ 4, 5 ]
      },
      'bar-three': { A: [ 'bar' ], B: [ 'three' ], C: [ 4 ], D: [ 1 ] },
      'bar-two': { A: [ 'bar' ], B: [ 'two' ], C: [ 2 ], D: [ 6 ] },
      'foo-three': { A: [ 'foo' ], B: [ 'three' ], C: [ 7 ], D: [ 8 ] }
    };
    assert.deepEqual(group_df.groups, rslt);
  });

  it("should obtain the first row of all groups", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'one', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A", "B" ]);
    let rslt = [
      [ 'foo', 'one', 'foo', 'one', 1, 3 ],
      [ 'foo', 'two', 'foo', 'two', 5, 5 ],
      [ 'foo', 'three', 'foo', 'three', 7, 8 ],
      [ 'bar', 'one', 'bar', 'one', 3, 2 ],
      [ 'bar', 'three', 'bar', 'three', 4, 1 ],
      [ 'bar', 'two', 'bar', 'two', 2, 6 ]
    ];
    assert.deepEqual(group_df.first().values, rslt);
  });

  it("should obtain the last row of all groups", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'one', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A", "B" ]);
    let rslt = [
      [ 'foo', 'one', 'foo', 'one', 6, 7 ],
      [ 'foo', 'two', 'foo', 'two', 5, 5 ],
      [ 'foo', 'three', 'foo', 'three', 7, 8 ],
      [ 'bar', 'one', 'bar', 'one', 3, 2 ],
      [ 'bar', 'three', 'bar', 'three', 4, 1 ],
      [ 'bar', 'two', 'bar', 'two', 2, 6 ]
    ];
    assert.deepEqual(group_df.last().values, rslt);
  });

  it("should obtain the number of  rows of each groups", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'one', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
    };
    let df = new dfd.DataFrame(data);
    let group_df = df.groupby([ "A", "B" ]);
    let rslt = [
      [ 'foo', 'one', 3 ],
      [ 'foo', 'two', 1 ],
      [ 'foo', 'three', 1 ],
      [ 'bar', 'one', 1 ],
      [ 'bar', 'three', 1 ],
      [ 'bar', 'two', 1 ]
    ];
    assert.deepEqual(group_df.size().values, rslt);
  });
});

import { assert } from "chai";
import { Console } from "console";
import { DataFrame, Series } from '../../dist/danfojs-node/src';


describe("groupby", function () {
  it("Check group by One column data", function () {
    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let groupDf = df.groupby([ "A" ]);

    let groupDict = {
      '1': { A: [ 1 ], B: [ 2 ], C: [ 3 ] },
      '4': { A: [ 4 ], B: [ 5 ], C: [ 6 ] },
      '20': { A: [ 20 ], B: [ 30 ], C: [ 40 ] },
      '39': { A: [ 39 ], B: [ 89 ], C: [ 78 ] }
    }
    assert.deepEqual(groupDf.colDict, groupDict);
  });

  it("Obtain the DataFrame of one of the group", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 2, 3 ] ];
    assert.deepEqual(group_df.get_group([ 1 ]).values, new_data);
  });

  it("Check group by Two column data", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = {
      '1-2': { A: [ 1 ], B: [ 2 ], C: [ 3 ] },
      '4-5': { A: [ 4 ], B: [ 5 ], C: [ 6 ] },
      '20-30': { A: [ 20 ], B: [ 30 ], C: [ 40 ] },
      '39-89': { A: [ 39 ], B: [ 89 ], C: [ 78 ] }
    }
    assert.deepEqual(group_df.colDict, new_data);
  });

  it("Obtain the DataFrame of one of the group, grouped by two column", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [ [ 1, 2, 3 ] ];

    assert.deepEqual(group_df.get_group([ 1, 2 ]).values, new_data);
  });

  it("Count column in group", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
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
    let df = new DataFrame(data, { columns: cols });
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
    let df = new DataFrame(data, { columns: cols });
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
    let df = new DataFrame(data, { columns: cols });
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
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [
      [ 1, 2, 2, 3 ],
      [ 4, 5, 5, 6 ],
      [ 20, 30, 30, 40 ],
      [ 39, 89, 89, 78 ]
    ];
    assert.deepEqual(group_df.col([ "B", "C" ]).cumsum().values, new_data);
  });

  it("cummulative max for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 3 ], [ 4, 6 ], [ 20, 40 ], [ 39, 78 ] ];


    assert.deepEqual(group_df.col([ "C" ]).cummax().values, new_data);
  });

  it("cummulative min for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 3 ], [ 4, 6 ], [ 20, 40 ], [ 39, 78 ] ];

    assert.deepEqual(group_df.col([ "C" ]).cummin().values, new_data);
  });

  it("cummulative prod for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 3 ], [ 4, 6 ], [ 20, 40 ], [ 39, 78 ] ];

    assert.deepEqual(group_df.col([ "C" ]).cumprod().values, new_data);
  });

  it("mean for groupby", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
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
    let df = new DataFrame(data);
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
    let df = new DataFrame(data);
    let group_df = df.groupby([ "A"]);
    let rslt = [
      [ 5, 3, 'foo' ],
      [ 6, 4, 'foo' ],
      [ 7, 7, 'foo' ],
      [ 9, 8, 'foo' ],
      [ 10, 9, 'foo' ],
      [ 4, 5, 'bar' ],
      [ 3, 6, 'bar' ],
      [ 8, 4, 'bar' ]
    ]
    assert.deepEqual(group_df.col(['D', 'C']).apply((x) => x.add(2)).values, rslt);
  });

  it("should apply function to group column", function () {
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
                        'foo', 'bar', 'foo', 'foo' ],
                  'B': [ 'one', 'one', 'two', 'three',
                          'two', 'two', 'one', 'three' ],
                  'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
                  'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ]
     };
    let df = new DataFrame(data);
    let group_df = df.groupby([ "A", "B"]);
    let rslt = [
      [ 2, 2, 2, 2, 'foo', 'one' ],
      [ 2, 2, 2, 2, 'foo', 'two' ],
      [ 1, 1, 1, 1, 'foo', 'three' ],
      [ 1, 1, 1, 1, 'bar', 'one' ],
      [ 1, 1, 1, 1, 'bar', 'three' ],
      [ 1, 1, 1, 1, 'bar', 'two' ]
    ];
    assert.deepEqual(group_df.apply((x) => x.count({axis:0})).values, rslt);
  });
})
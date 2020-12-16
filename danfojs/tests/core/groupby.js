import { assert } from "chai";
import { DataFrame } from '../../src/core/frame';

describe("groupby", function () {
  it("Check group by One column data", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);

    let group_dict = {
      '1': [ [ 1, 2, 3 ] ],
      '4': [ [ 4, 5, 6 ] ],
      '20': [ [ 20, 30, 40 ] ],
      '39': [ [ 39, 89, 78 ] ]
    };

    assert.deepEqual(group_df.col_dict, group_dict);
  });
  it("Obtain the DataFrame of one of the group", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A" ]);
    let new_data = [ [ 1, 2, 3 ] ];

    assert.deepEqual(group_df.get_groups([ 1 ]).values, new_data);
  });
  it("Check group by Two column data", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = {
      '1': { '2': [ [ 1, 2, 3 ] ] },
      '4': { '5': [ [ 4, 5, 6 ] ] },
      '20': { '30': [ [ 20, 30, 40 ] ] },
      '39': { '89': [ [ 39, 89, 78 ] ] }
    };

    assert.deepEqual(group_df.col_dict, new_data);
  });

  it("Obtain the DataFrame of one of the group, grouped by two column", function () {

    let data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 20, 30, 40 ], [ 39, 89, 78 ] ];
    let cols = [ "A", "B", "C" ];
    let df = new DataFrame(data, { columns: cols });
    let group_df = df.groupby([ "A", "B" ]);
    let new_data = [ [ 1, 2, 3 ] ];

    assert.deepEqual(group_df.get_groups([ 1, 2 ]).values, new_data);
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

  it("sum column element group by one column", function () {

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

    assert.deepEqual(group_df.agg({ "B": "mean", "C": "count" }).values, new_data);
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

  it("printing multiindex table, example with cumsum operation for dataframe group by one column", function(){
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ] };


    let df = new DataFrame(data);

    let grp = df.groupby([ "A" ]);
    let rslt = [
      [ 'foo', 1 ],
      [ 'foo', 3 ],
      [ 'foo', 8 ],
      [ 'foo', 14 ],
      [ 'foo', 21 ],
      [ 'bar', 3 ],
      [ 'bar', 7 ],
      [ 'bar', 9 ]
    ];
    assert.deepEqual(grp.col([ "C" ]).cumsum().values, rslt);

  });
  it("printing multiindex table, example with cumsum operation for dataframe group by one column", function(){
    let data = { 'A': [ 'foo', 'bar', 'foo', 'bar',
      'foo', 'bar', 'foo', 'foo' ],
    'B': [ 'one', 'one', 'two', 'three',
      'two', 'two', 'one', 'three' ],
    'C': [ 1, 3, 2, 4, 5, 2, 6, 7 ],
    'D': [ 3, 2, 4, 1, 5, 6, 7, 8 ] };

    let df = new DataFrame(data);


    let grp = df.groupby([ "A", "B" ]);
    let rslt = [
      [ 'foo', 'one', 1, 3 ],
      [ 'foo', 'one', 7, 10 ],
      [ 'foo', 'two', 2, 4 ],
      [ 'foo', 'two', 7, 9 ],
      [ 'foo', 'three', 7, 8 ],
      [ 'bar', 'one', 3, 2 ],
      [ 'bar', 'two', 2, 6 ],
      [ 'bar', 'three', 4, 1 ]
    ];
    assert.deepEqual(grp.col([ "C", "D" ]).cumsum().values, rslt);

  });

});

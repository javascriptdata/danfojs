import { assert } from "chai";
import { get_dummies } from '../../src/core/get_dummies';
import { DataFrame } from "../../src/core/frame";
import { Series } from "../../src/core/series";

describe("get_dummies", function(){

  it("test on array", function(){

    let data = [ "dog", "male", "female", "male", "female", "male", "dog" ];

    let df = get_dummies({ data:data });

    let df_values = [
      [ 1, 0, 0 ],
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
      [ 0, 1, 0 ],
      [ 1, 0, 0 ]
    ];
    let df_columns = [ 'dog', 'male', 'female' ];

    assert.deepEqual(df.values, df_values);
    assert.deepEqual(df.columns, df_columns);

  });
  it("test on Series", function(){

    let data = [ "dog", "male", "female", "male", "female", "male", "dog" ];
    let series = new Series(data);

    let df = get_dummies({ data:series, prefix:"test", prefix_sep:"/" });

    let df_values = [
      [ 1, 0, 0 ],
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
      [ 0, 1, 0 ],
      [ 1, 0, 0 ]
    ];
    let df_columns = [ 'test/dog', 'test/male', 'test/female' ];

    assert.deepEqual(df.values, df_values);
    assert.deepEqual(df.columns, df_columns);
  });

  it("get dummies on DataFrame", function(){

    let data = [ [ 1, "dog", 1.0, "fat" ], [ 3, "fog", 2.0, "good" ], [ 4, "gof", 3.0, "best" ] ];
    let columns = [ "A", "B", "C", "d" ];
    let df = new DataFrame(data, { columns:columns });

    let df1 = get_dummies({ data:df, prefix_sep:"_", columns:[ "A", "d" ] });
    let df1_columns = [
      'C', 'd',
      'A_1', 'A_3',
      'A_4', 'd_dog',
      'd_fog', 'd_gof'
    ];

    let df1_values = [
      [ 1, 'fat', 1, 0, 0, 1, 0, 0 ],
      [ 2, 'good', 0, 1, 0, 0, 1, 0 ],
      [ 3, 'best', 0, 0, 1, 0, 0, 1 ]
    ];

    assert.deepEqual(df1.values, df1_values);
    assert.deepEqual(df1.columns, df1_columns);

  });
  it("Throw error if the prefix specified is not equal to the column specified", function(){

    let data = [ [ 1, "dog", 1.0, "fat" ], [ 3, "fog", 2.0, "good" ], [ 4, "gof", 3.0, "best" ] ];
    let columns = [ "A", "B", "C", "d" ];
    let df = new DataFrame(data, { columns:columns });

    assert.throws(function () { get_dummies({ data:df, prefix:[ "fg" ], prefix_sep:"_", columns:[ "A", "d" ] }); }, Error,
      'prefix must be the same length with the number of onehot encoding column');

  });
  it("replace column sepecified with prefix", function(){

    let data = [ [ 1, "dog", 1.0, "fat" ], [ 3, "fog", 2.0, "good" ], [ 4, "gof", 3.0, "best" ] ];
    let columns = [ "A", "B", "C", "d" ];
    let df = new DataFrame(data, { columns:columns });

    let df1 = get_dummies({ data:df, prefix:[ "F", "G" ], prefix_sep:"_", columns:[ "A", "d" ] });
    let df1_columns = [
      'C', 'd',
      'F_1', 'F_3',
      'F_4', 'G_dog',
      'G_fog', 'G_gof'
    ];

    let df1_values = [
      [ 1, 'fat', 1, 0, 0, 1, 0, 0 ],
      [ 2, 'good', 0, 1, 0, 0, 1, 0 ],
      [ 3, 'best', 0, 0, 1, 0, 0, 1 ]
    ];

    assert.deepEqual(df1.values, df1_values);
    assert.deepEqual(df1.columns, df1_columns);

  });

  it("infer the onehotencoding column base on string dtypes", function(){

    let data = [ [ 1, "dog", 1.0, "fat" ], [ 3, "fog", 2.0, "good" ], [ 4, "gof", 3.0, "best" ] ];
    let columns = [ "A", "B", "C", "d" ];
    let df = new DataFrame(data, { columns:columns });

    let df1 = get_dummies({ data:df, prefix_sep:"_" });
    let df1_columns = [
      'A', 'C',
      'B_dog', 'B_fog',
      'B_gof', 'd_fat',
      'd_good', 'd_best'
    ];
    let df1_values = [
      [
        1, 1, 1, 0,
        0, 1, 0, 0
      ],
      [
        3, 2, 0, 1,
        0, 0, 1, 0
      ],
      [
        4, 3, 0, 0,
        1, 0, 0, 1
      ]
    ];

    assert.deepEqual(df1.values, df1_values);
    assert.deepEqual(df1.columns, df1_columns);

  });
  it("replace column sepecified with prefix", function(){

    let data = [ [ 1, "dog", 1.0, "fat" ], [ 3, "fog", 2.0, "good" ], [ 4, "gof", 3.0, "best" ] ];
    let columns = [ "A", "B", "C", "d" ];
    let df = new DataFrame(data, { columns:columns });

    assert.throws(function () { get_dummies({ data:df, prefix:"F", prefix_sep:"_", columns:[ "A", "d" ] }); }, Error,
      "prefix for dataframe must be an array");

  });


});

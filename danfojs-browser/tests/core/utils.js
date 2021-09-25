/* eslint-disable no-undef */

describe("Utils Functions", function () {
  it("removes an element from an array", function () {
    let arr = [ 1, 2, 3, 4 ];
    assert.deepEqual(dfd.utils.removeElementFromArray(arr, 2), [ 1, 2, 4 ]);
  });
  it("Checks if variable is a string", function () {
    let arr = [ "1", "2" ];
    assert.isTrue(dfd.utils.isString(arr[0]));
  });
  it("Checks if variable is a number", function () {
    let arr = [ 1, 2, 3, 4 ];
    assert.isTrue(dfd.utils.isNumber(arr[0]));
  });
  it("Checks if value is null", function () {
    let val = null;
    let val2 = 1;
    assert.isTrue(dfd.utils.isNull(val));
    assert.isFalse(dfd.utils.isNull(val2));
  });

  it("Checks if value is undefined", function () {
    let arr;
    assert.isTrue(dfd.utils.isUndefined(arr));
  });

  it("Generate number betwee two set of values", function () {

    let start = 0;
    let end = 5;
    let data = [ 0, 1, 2, 3, 4, 5 ];
    assert.deepEqual(dfd.utils.range(start, end), data);
  });

  describe("inferDtype", function () {
    it("Returns string type present in an 1D array", function () {
      let data = [ 'Alice', 'Boy', 'Girl', "39" ];
      let result = [ 'string' ];
      assert.deepEqual(dfd.utils.inferDtype(data), result);
    });
    it("Returns float type present in an 1D array", function () {
      let data = [ 1.1, 2.1, 3.2, 4.4 ];
      let result = [ 'float32' ];
      assert.deepEqual(dfd.utils.inferDtype(data), result);
    });
    it("Returns int type present in an 1D array", function () {
      let data = [ 1, 2, 3, 45 ];
      let result = [ 'int32' ];
      assert.deepEqual(dfd.utils.inferDtype(data), result);
    });
    it("Returns float when there's a mixture of int and float in a 1D array", function () {
      let data = [ 1, 2.1, 3, 45 ];
      let result = [ 'float32' ];
      assert.deepEqual(dfd.utils.inferDtype(data), result);
    });
    it("Returns float type when NaN is present in an 1D array", function () {
      let data = [ 1, 2, 3, 45, NaN ];
      let result = [ 'float32' ];
      assert.deepEqual(dfd.utils.inferDtype(data), result);
    });
  });

  describe("__map_int_to_bool", function () {
    it("map ints to bools in array of arrays", function () {
      let data = [ [ 1, 0, 1 ], [ 1, 1, 0 ] ];
      assert.deepEqual(dfd.utils.mapIntegersToBooleans(data, 2), [ [ true, false, true ], [ true, true, false ] ]);
    });
    it("map ints to bools in array", function () {
      let data = [ 1, 0, 0, 1, 1 ];
      assert.deepEqual(dfd.utils.mapIntegersToBooleans(data, 1), [ true, false, false, true, true ]);
    });
  });

  describe("__round", function () {
    it("round elements in array to 1 dp", function () {
      let data = [ 10.01, 2.2, 3.11, 20.505, 20.22, 40.0909 ];
      assert.deepEqual(dfd.utils.round(data, 1, true), [ 10.0, 2.2, 3.1, 20.5, 20.2, 40.1 ]);
    });
    it("round elements in array to 2 dp", function () {
      let data = [ 10.019, 2.2099, 3.1145, 20.506, 20.22, 40.0909 ];
      assert.deepEqual(dfd.utils.round(data, 2, true), [ 10.02, 2.21, 3.11, 20.51, 20.22, 40.09 ]);
    });
  });

  describe("__replace_undefined_with_NaN", function () {
    it("replace undefined in Series with NaN", function () {
      let data = [ 10.01, 2.2, undefined, 20.505, 20.22, undefined ];
      assert.deepEqual(dfd.utils.replaceUndefinedWithNaN(data, true), [ 10.01, 2.2, NaN, 20.505, 20.22, NaN ]);
    });
    it("replace undefined in DataFrame with NaN", function () {
      let data = [ [ 10.01, 2.2, undefined, 20.505, 20.22, undefined ],
        [ 10.01, undefined, undefined, 20.505, 20, undefined ] ];

      let result = [ [ 10.01, 2.2, NaN, 20.505, 20.22, NaN ],
        [ 10.01, NaN, NaN, 20.505, 20, NaN ] ];
      assert.deepEqual(dfd.utils.replaceUndefinedWithNaN(data, false), result);
    });
    it("replace null in Series with NaN", function () {
      let data = [ 10.01, 2.2, null, 20.505, 20.22, null ];
      assert.deepEqual(dfd.utils.replaceUndefinedWithNaN(data, true), [ 10.01, 2.2, NaN, 20.505, 20.22, NaN ]);
    });
    it("replace null in DataFrame with NaN", function () {
      let data = [ [ 10.01, 2.2, null, 20.505, 20.22, null ],
        [ 10.01, null, null, 20.505, 20, null ] ];

      let result = [ [ 10.01, 2.2, NaN, 20.505, 20.22, NaN ],
        [ 10.01, NaN, NaN, 20.505, 20, NaN ] ];
      assert.deepEqual(dfd.utils.replaceUndefinedWithNaN(data, false), result);
    });
  });

  describe("__convert_2D_to_1D", function () {
    it("convert 2D array of array to 1D of string values", function () {
      let data = [ [ 10.01, 2.2, "a" ], [ 20.505, 20.22, "boy" ] ];
      assert.deepEqual(dfd.utils.convert2DArrayToSeriesArray(data), [ "10.01,2.2,a", "20.505,20.22,boy" ]);
    });

  });

  // describe("_throw_wrong_params_error", function () {
  //     it("check if the right params are passed to a function", function () {
  //         let params_needed = ["replace", "with", "inplace"]
  //         let kwargs = { "replae": 2, "with": 12, "inplace": true }
  //         assert.equal(dfd.utils._throw_wrong_params_error(kwargs, params_needed), false)
  //     })
  //     it("check if the right params are passed to a function 2", function () {
  //         let params_needed = ["replace", "with", "inplace"]
  //         let kwargs = { "replace": 2, "with": 12, "inplace": true }
  //         assert.equal(dfd.utils._throw_wrong_params_error(kwargs, params_needed), true)
  //     })

  // })

  describe("_get_row_and_col_values", function () {
    it("retreive rows and labels from column object", function () {
      let data = { "Alpha": [ "A", "B", "C", "D" ], count: [ 1, 2, 3, 4 ], sum: [ 20.3, 30.456, 40.90, 90.1 ] };
      let res = [ [ "A", 1, 20.3 ], [ "B", 2, 30.456 ], [ "C", 3, 40.90 ], [ "D", 4, 90.1 ] ];
      assert.deepEqual(dfd.utils.getRowAndColValues(data)[0], res);
      assert.deepEqual(dfd.utils.getRowAndColValues(data)[1], [ "Alpha", "count", "sum" ]);

    });


  });


  describe("_get_duplicate", function(){
    it("obtain duplicate and their index", function(){

      let data = [ 1, 2, 3, 4, 5, 3, 4, 6, 4, 5 ];
      let res = { '3': { count: 2, index: [ 2, 5 ] },
        '4': { count: 3, index: [ 3, 6, 8 ] },
        '5': { count: 2, index: [ 4, 9 ] } };

      assert.deepEqual(dfd.utils.getDuplicate(data), res);
    });
  });

});

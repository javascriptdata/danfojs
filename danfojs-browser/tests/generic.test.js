/* eslint-disable no-undef */

// import * as tf from '@tensorflow/tfjs';

describe("Generic (NDFrame)", function () {
  describe("NDframe Created from Array", function () {
    it("prints the shape of a 1D array", function () {
      let data = [ 1, 2, 3, "Boy", "Girl" ];
      let ndframe = new dfd.NDframe({ data, isSeries: true });
      assert.deepEqual(ndframe.shape, [ 5, 1 ]);
    });
    it("prints the default assigned column name in a series", function () {
      let data = [ "Boy", 20, 25 ];
      let ndframe = new dfd.NDframe({ data, isSeries: true });
      assert.deepEqual(ndframe.columnNames, [ "0" ]);
    });
    it("prints the assigned column name in a series", function () {
      let data = [ "Boy", 20, 25 ];
      let ndframe = new dfd.NDframe({ data, columnNames: [ "Records" ], isSeries: true });
      assert.deepEqual(ndframe.columnNames, [ "Records" ]);
    });
    it("prints the shape of a 2D array", function () {
      let data = [ [ "Boy", 20 ], [ "Girl", 25 ] ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.shape, [ 2, 2 ]);
    });
    it("prints the default assigned column names in 2D frame", function () {
      let data = [ [ "Boy", 20 ], [ "Girl", 25 ] ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.columnNames, [ "0", "1" ]);
    });
    it("prints the assigned column names", function () {
      let data = [ [ "Boy", 20 ], [ "Girl", 25 ] ];
      let options = { "columnNames": [ "Gender", "Age" ], "isSeries": false };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.columnNames, [ "Gender", "Age" ]);
    });
    it("prints the size of a frame", function () {
      let data = [ [ "Boy", 20, 1 ], [ "Girl", 25, 3 ] ];
      let options = { "columnNames": [ "Gender", "Age", "count" ], "isSeries": false };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.size, 6);
    });
    it("prints the dimension of a frame", function () {
      let data = [ [ "Boy", 20, 1 ], [ "Girl", 25, 3 ] ];
      let options = { "columnNames": [ "Gender", "Age", "count" ], "isSeries": false };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.ndim, 2);
    });
    it("prints the values of a frame", function () {
      let data = [ [ 21, 20, 1 ], [ 20, 25, 3 ] ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, data);
    });
    it("prints the values of a frame", function () {
      let data = [ [ 21, 20, 1 ], [ 20, 25, 3 ] ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, data);
    });

    it("Throws error on duplicate column name", function () {
      let data = [ [ 21, 20, 1 ], [ 20, 25, 3 ] ];
      assert.throws(() => {
        new dfd.NDframe({ data, isSeries: false, columnNames: [ "A", "A", "C" ] }),
        Error,
        "ColumnIndexError: Column index must contain unique values";
      });
    });

    it("Throws error on duplicate index", function () {
      let data = [ [ 21, 20, 1 ], [ 20, 25, 3 ] ];
      assert.throws(() => {
        new dfd.NDframe({ data, isSeries: false, index: [ 1, 1, 2 ] }),
        Error,
        "IndexError: Row index must contain unique values";
      });
    });
  });

  describe("NDframe Created from JavaScript Object", function () {

    it("prints the shape of a 2D frame created from an Object", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.shape, [ 3, 2 ]);
    });
    it("prints the column names of frame created from an Object", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.columnNames, [ "alpha", "count" ]);
    });
    it("prints the shape of a 1D frame created from an Object", function () {
      let data = [ { alpha: "A", count: 1 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.shape, [ 1, 2 ]);
    });

    it("prints the size of a frame created from an Object", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.size, 6);
    });
    it("prints the dimension of a frame created from an Object", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.ndim, 2);
    });
    it("prints the values of a frame created from an Object", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, [ [ "A", 1 ], [ "B", 2 ] ]);
    });
    it("prints the values of a frame created from an Object with undefined values", function () {
      let data = [ { alpha: "A", count: undefined }, { alpha: undefined, count: 2 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, [ [ "A", undefined ], [ undefined, 2 ] ]);
    });

    it("prints the values of a frame created from an Object with NaN values", function () {
      let data = [ { alpha: "A", count: NaN }, { alpha: NaN, count: 2 } ];
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, [ [ "A", NaN ], [ NaN, 2 ] ]);
    });


  });

  describe("Replacing row data", function () {
    it("retrieves the col data after row data is replaced in a DataFrame", function () {
      let data = { alpha: [ "A", "B" ], count: [ 1, 2 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      ndframe.$setValues([ [ "A", 20 ], [ "D", 211 ] ]);
      assert.deepEqual(ndframe.values, [ [ "A", 20 ], [ "D", 211 ] ]);

    });
    it("Correct dtypes is inferred after row data is replaced in a DataFrame", function () {
      let data = { alpha: [ "A", "B" ], count: [ 1, 2 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      ndframe.$setValues([ [ 20, 20 ], [ 11.4, 211 ] ]);
      assert.deepEqual(ndframe.dtypes, [ "float32", "int32" ]);

    });
    it("Throws row length error on invalid data length in DataFrame", function () {
      let data = { alpha: [ "A", "B" ], count: [ 1, 2 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.throws(
        () => {
          ndframe.$setValues([ [ 20, 20 ], [ 11.4, 211 ], [ 11.4, 211 ] ]);
        },
        Error,
        "Row data length mismatch. You provided data with length 3 but Ndframe has row of lenght 2"
      );
    });
    it("Throws column length error on invalid data length in DataFrame", function () {
      let data = { alpha: [ "A", "B" ], count: [ 1, 2 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.throws(
        () => {
          ndframe.$setValues([ [ 20, 211 ], [ 20, 20, 11.4, 211 ] ]);
        },
        Error,
        "Column data length mismatch. You provided data with length 2 but Ndframe has column of lenght 2"
      );
    });
    it("retrieves the col data after row data is replaced in a Series", function () {
      let data = [ "A", "B", 1, 2 ];
      let ndframe = new dfd.NDframe({ data, isSeries: true });
      ndframe.$setValues([ "A", "D", "E", "O" ]);
      assert.deepEqual(ndframe.values, [ "A", "D", "E", "O" ]);
      assert.deepEqual(ndframe.$dataIncolumnFormat, [ "A", "D", "E", "O" ]);

    });
    it("Correct dtypes is inferred after updating values", function () {
      let data = [ "A", "D", "E", "O" ];
      let ndframe = new dfd.NDframe({ data, isSeries: true });
      ndframe.$setValues([ 1, 2, 3, 4 ]);
      assert.deepEqual(ndframe.values, [ 1, 2, 3, 4 ]);
      assert.deepEqual(ndframe.dtypes[0], "int32");
    });
    it("Correct dtypes is inferred after updating values in low memory mode", function () {
      let data = [ "A", "D", "E", "O" ];
      let ndframe = new dfd.NDframe({ data, isSeries: true, config: { lowMemoryMode: true } });
      ndframe.$setValues([ 1, 2, 3, 4 ]);
      assert.deepEqual(ndframe.values, [ 1, 2, 3, 4 ]);
      assert.deepEqual(ndframe.dtypes[0], "int32");
    });
    it("Throws row length error on invalid data length", function () {
      let data = [ "A", "D", "E", "O" ];
      let ndframe = new dfd.NDframe({ data, isSeries: true, config: { lowMemoryMode: true } });
      assert.throws(
        () => {
          ndframe.$setValues([ 1, 2, 3, 4, 1, 3 ]);
        },
        Error,
        "Row data length mismatch. You provided data with length 6 but Ndframe has row of lenght 4"
      );
    });

  });

  // describe("NDframe Created from a Tensor", function () {

  //   it("prints the shape of a 2D frame created from a 2D tensor", function () {
  //     let data = tf.tensor([ 1, 2, 3, 4 ]);
  //     let ndframe = new dfd.NDframe({ data, isSeries: true });
  //     assert.deepEqual(ndframe.ndim, 1);
  //     assert.deepEqual(ndframe.values, [ 1, 2, 3, 4 ]);

  //   });
  //   it("prints the shape of a 2D frame created from a 1D tensor", function () {
  //     let data = tf.tensor([ [ 2, 3, 4 ], [ 4, 5, 6 ] ]);
  //     let ndframe = new dfd.NDframe({ data, columnNames: [ "alpha", "count", "sum" ], isSeries: false });
  //     assert.deepEqual(ndframe.columnNames, [ "alpha", "count", "sum" ]);
  //   });

  // });

  describe("index", function () {
    it("Returns the index of an NDframe", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 } ];
      let df = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(df.index, [ 0, 1, 2 ]);
    });
    it("Returns the index of an NDframe created from an Array", function () {
      let data = [ [ 12, 2, 20 ], [ 90, 5, 23 ], [ 45, 56, 70 ], [ 9, 10, 19 ] ];
      let df = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(df.index, [ 0, 1, 2, 3 ]);
    });
  });

  describe("NDframe Created from JavaScript Object of Arrays", function () {

    it("retrieves the col data created from OA ", function () {
      let data = { alpha: [ "A", "B", "C", "D" ], count: [ 1, 2, 3, 4 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, [ [ 'A', 1 ], [ 'B', 2 ], [ 'C', 3 ], [ 'D', 4 ] ]);
    });
    it("retrieves the data 2", function () {
      let data = { alpha: [ "A", "B", "C", "D" ], count: [ 1, 2, 3, 4 ], sum: [ 20.3, 30.456, 40.90, 90.1 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      let res = [
        [ 'A', 1, 20.3 ],
        [ 'B', 2, 30.456 ],
        [ 'C', 3, 40.9 ],
        [ 'D', 4, 90.1 ]
      ];
      assert.deepEqual(ndframe.values, res);
    });
    it("retrieves the row data created from OA ", function () {
      let data = { alpha: [ "A", "B" ], count: [ 1, 2 ] };
      let ndframe = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(ndframe.values, [ [ "A", 1 ], [ "B", 2 ] ]);
    });
  });

  describe("setIndex", function () {
    it("sets the index of an NDframe", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 } ];
      let df = new dfd.NDframe({ data, isSeries: false });
      df.$setIndex([ "A", "B", "C" ]);
      assert.deepEqual(df.index, [ "A", "B", "C" ]);
    });
    it("Returns the index of an NDframe created from an Array", function () {
      let data = [ [ 12, 2, 20 ], [ 90, 5, 23 ], [ 45, 56, 70 ], [ 9, 10, 19 ] ];
      let df = new dfd.NDframe({ data, isSeries: false });
      df.$setIndex([ 10, 20, 30, 40 ]);
      assert.deepEqual(df.index, [ 10, 20, 30, 40 ]);
    });
  });


  describe("dtype", function () {
    it("Returns int dtype set during creation of 1DFrame (Series) from an Object", function () {
      let data = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
      let options = { dtypes: [ 'int32' ], isSeries: true };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ 'int32' ]);
    });

    it("Returns string dtype set during creation of 1DFrame (Series) from an Array", function () {
      let data = [ "Alice", "Yemi", "Rising", "Mark" ];
      let options = { dtypes: [ 'string' ], isSeries: true };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ "string" ]);
    });

    it("Returns string dtype automatically inferred from 1DFrame (Series)", function () {
      let data = [ "Alice", "Yemi", "Rising", "Mark" ];
      let options = { columnNames: 'Names', isSeries: true };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ "string" ]);
    });

    it("Returns int dtype automatically inferred from 1DFrame (Series)", function () {
      let data = [ 20, 30, 20, 20 ];
      let options = { columnNames: 'Size', isSeries: true };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ "int32" ]);
    });
    it("Returns float dtype automatically inferred from 1DFrame (Series)", function () {
      let data = [ 20.1, 30.4, 20.2, 4.23, 20.1 ];
      let options = { columnNames: 'Size', isSeries: true };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ "float32" ]);
    });


    it("Returns dtype set during creation of 2DFrame from an Object", function () {
      let data = [ { alpha: "A", count: 1 }, { alpha: "B", count: 2 } ];
      let options = { dtypes: [ 'string', 'int32' ] };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ 'string', 'int32' ]);
    });
    it("Returns dtype set during creation of 2DFrame from an Array", function () {
      let data = [ [ "Alice", 2, 3.0 ], [ "Boy", 5, 6.1 ], [ "Girl", 30, 40 ], [ 39, 89, 78.2 ] ];
      let cols = [ "Name", "Count", "Score" ];
      let options = { columnNames: cols, dtypes: [ 'string', 'int32', 'float32' ] };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ "string", "int32", "float32" ]);
    });

    it("Returns dtype automatically inferred from 2DFrame", function () {
      let data = [ [ "Alice", 2, 3.1 ], [ "Boy", 5, 6.1 ], [ "Girl", 30, 40.2 ], [ 39, 89, 78.2 ] ];
      let cols = [ "Name", "Count", "Score" ];
      let options = { columnNames: cols };
      let ndframe = new dfd.NDframe({ data, ...options });
      assert.deepEqual(ndframe.dtypes, [ "string", "int32", "float32" ]);
    });

  });

  describe("Empty NDFrame", function () {
    it("Can successfully create an empty NDframe from empty array", function () {
      let data = [];
      let sf = new dfd.NDframe({ data, isSeries: false });
      assert.deepEqual(sf.shape, [ 0, 0 ]);
      assert.deepEqual(sf.columnNames, []);
      assert.deepEqual(sf.dtypes, []);
      assert.deepEqual(sf.values, []);
    });
    it("Can successfully create an empty NDframe from undefined data", function () {
      let data = undefined;
      let sf = new dfd.NDframe({ data, isSeries: true });
      assert.deepEqual(sf.shape, [ 0, 0 ]);
      assert.deepEqual(sf.columnNames, []);
      assert.deepEqual(sf.dtypes, []);
      assert.deepEqual(sf.values, []);
    });

    it("Can successfully create an empty NDframe", function () {
      let sf = new dfd.NDframe({ isSeries: true });
      assert.deepEqual(sf.shape, [ 0, 0 ]);
      assert.deepEqual(sf.columnNames, []);
      assert.deepEqual(sf.dtypes, []);
      assert.deepEqual(sf.values, []);
    });
  });
  // describe("to_csv", async function () {
  //     it("Converts DataFrame to csv format and return string", async function () {
  //         let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
  //         let df = new dfd.NDframe({ data, isSeries: false });
  //         let result = `alpha,count\nA,1\nB,2\nC,3\n`;
  //         df.to_csv().then((csv) => {
  //             assert.deepEqual(csv, result);
  //         });
  //     });
  //     it("Converts DataFrame of Series to csv format and return string when path is not specified", async function () {
  //         let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70], [9, 10, 19]];
  //         let df = new dfd.NDframe(data, { columns: ["A", "B", "C"] });
  //         let result = `A,B,C\n12,2,20\n90,5,23\n45,56,70\n9,10,19\n`;
  //         assert.deepEqual(await df.to_csv(), result);
  //     });
  // });

  // describe("to_json", async function () {
  //     it("Converts DataFrame to json format and return string", async function () {
  //         let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
  //         let result = JSON.stringify([{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]);

  //         let df = new dfd.NDframe({ data, isSeries: false });
  //         df.to_json().then((json) => {
  //             assert.deepEqual(json, result);
  //         });
  //     });
  //     it("Converts DataFrame to json format", async function () {
  //         let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70]];
  //         let df = new dfd.NDframe(data, { columns: ["A", "B", "C"] });
  //         let result = JSON.stringify([{ A: 12, B: 2, C: 20 }, { A: 90, B: 5, C: 23 }, { A: 45, B: 56, C: 70 }]);
  //         df.to_json().then((json) => {
  //             assert.deepEqual(json, result);
  //         });
  //     });
  // });


});

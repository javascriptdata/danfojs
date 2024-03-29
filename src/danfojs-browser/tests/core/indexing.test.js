/* eslint-disable no-undef */

describe("Iloc and Loc based Indexing", function () {
  describe("Iloc Index", function () {
    it("throw error for wrong row index value", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc(0); }, Error, `rows parameter must be an Array. For example: rows: [1,2] or rows: ["0:10"]`);
    });

    it("throw error for wrong string split parameter", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "0;1" ]); }, Error, `Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
    });

    it("throw error for wrong string split value", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "0:a" ]); }, Error, `Invalid row split parameter. Split parameter must be a number`);
    });

    it("throw error for string split values greater than 2", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "0:4:2" ]); }, Error, `Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
    });

    it("throw error for row index larger than series length", function () {
      let data = [ 1, 2, 34, 5, 6 ];

      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ 0, 8 ]); }, Error, "Invalid row parameter: Specified index 8 cannot be bigger than index length 5");
    });

    it("throw error for non-numeric row index", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ 0, "4" ]); }, Error, "Invalid row parameter: row index 4 must be a number");
    });


    it("df.iloc works for rows:[0,1]", function () {
      let data = [ 1, 2, 34, 5, 6 ];

      let df = new dfd.Series(data);

      let sf = df.iloc([ 0, 1 ]);
      let expected = [ 1, 2 ];

      assert.deepEqual(sf.values, expected);
    });

    it("df.iloc works for rows:[1]", function () {
      let data = [ 1, 2, 34, 5, 6 ];

      let df = new dfd.Series(data);

      let sf = df.iloc([ 1 ]);
      let expected = [ 2 ];

      assert.deepEqual(sf.values, expected);
    });

    it("correct index is returned for df.iloc rows:[1, 2]", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data, { index: [ "a", "b", "c", "d", "e" ] });

      let sf = df.iloc([ 1, 4 ]);
      let expected = [ "b", "e" ];

      assert.deepEqual(sf.index, expected);
    });


    it("row slice with string param works [0:2]", function () {
      let data = [ 1, 2, 4, 5, 6, 20, 30, 40, 39, 89, 78 ];
      let df = new dfd.Series(data);

      let sf = df.iloc([ "0:2" ]);
      let expected = [ 1, 2 ];

      assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [1:]", function () {
      let data = [ 1, 2, 34, 5, 620, 30, 409, 89, 78 ];
      let df = new dfd.Series(data);

      let sf = df.iloc([ "1:" ]);
      let expected = [ 2, 34, 5, 620, 30, 409, 89, 78 ];

      assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [:2]", function () {
      let data = [ 1, 2, 34, 5, 6, 20, 30, 40, 39, 89, 78 ];
      let df = new dfd.Series(data);
      let sf = df.iloc([ ":2" ]);
      let expected = [ 1, 2 ];

      assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [:]", function () {
      let data = [ 1, 2, 3, 5, 20, 30, 4039, 89, 78 ];
      let df = new dfd.Series(data);
      let expected = [ 1, 2, 3, 5, 20, 30, 4039, 89, 78 ];

      let sf = df.iloc([ ":" ]);
      assert.deepEqual(sf.values, expected);

    });

    it(`throw error for wrong start index size ["0:20"]`, function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "0:20" ]); }, Error, `row slice [end] index cannot be bigger than 5`);
    });

    it(`throw error for wrong start index size ["-1:2"]`, function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "-1:2" ]); }, Error, `row slice [start] index cannot be less than 0`);
    });

    it("check data after column slice", function () {
      let data = [ 1, 2, 34, 5, 620, 30, 4039, 89, 78 ];
      let df = new dfd.Series(data);

      let sf = df.iloc([ 0, 1, 6 ]);
      let expected = [ 1, 2, 4039 ];
      assert.deepEqual(sf.values, expected);

    });

    it("iloc works for boolean array", function () {
      let data = [ 1, 2, 34, 5, 620 ];
      let df = new dfd.Series(data);

      let sf = df.iloc([ true, true, false, true, false ]);
      let expected = [ 1, 2, 5 ];
      assert.deepEqual(sf.values, expected);

    });

    it("iloc works for boolean array (all true)", function () {
      let data = [ 1, 2, 34, 5, 620 ];
      let df = new dfd.Series(data);

      let sf = df.iloc([ true, true, true, true, true ]);
      let expected = [ 1, 2, 34, 5, 620 ];
      assert.deepEqual(sf.values, expected);

    });
    it("iloc works for boolean array (all false)", function () {
      let data = [ 1, 2, 34, 5, 620 ];
      let df = new dfd.Series(data);

      let sf = df.iloc([ false, false, false, false, false ]);
      let expected = [];
      assert.deepEqual(sf.values, expected);

    });

    it("boolean iloc works for DataFrame", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.iloc({ rows: [ false, false, false, true ] });
      const result = [ [ 'Pear', 10, 250 ] ];
      assert.deepEqual(subDf.values, result);

    });


    it("boolean iloc works for DataFrame with specified columns", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.iloc({ rows: [ false, false, false, true ], columns: [ 0, 2 ] });
      const result = [ [ 'Pear', 250 ] ];
      assert.deepEqual(subDf.values, result);

    });

    it("boolean iloc works for DataFrame with Series bool selector", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.iloc({ rows: df["Count"].gt(10), columns: [ 0, 2 ] });
      const result = [ [ 'Apples', 200 ], [ 'Banana', 40 ] ];
      assert.deepEqual(subDf.values, result);

    });
  });

  describe("Loc Index", function () {
    it("throw error for wrong row index value", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.loc(0); }, Error, `rows parameter must be an Array. For example: rows: [1,2] or rows: ["0:10"]`);
    });

    it("throw error for wrong string split parameter", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.loc([ "a;1" ]); }, Error, `IndexError: Specified index (a;1) not found`);
    });
    it(`throw error for wrong string split parameter ("0;1")`, function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.loc([ "0;1" ]); }, Error, `IndexError: Specified index (0;1) not found`);
    });

    it("throw error for wrong string split end value", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.loc([ "0:a" ]); }, Error, `IndexError: Specified end index not found`);
    });

    it("throw error for string split values greater than 2", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.loc([ "0:4:2" ]); }, Error, `Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
    });

    it("throw error for row index larger than series length", function () {
      let data = [ 1, 2, 34, 5, 6 ];

      let df = new dfd.Series(data);
      assert.throws(function () { df.loc([ 0, 8 ]); }, Error, "IndexError: Specified index (8) not found");
    });

    it("throw error for non-numeric row index not found", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.loc([ 0, "4" ]); }, Error, "IndexError: Specified index (4) not found");
    });


    it("df.iloc works for rows:[0,1]", function () {
      let data = [ 1, 2, 34, 5, 6 ];

      let df = new dfd.Series(data);

      let sf = df.loc([ 0, 1 ]);
      let expected = [ 1, 2 ];

      assert.deepEqual(sf.values, expected);
    });

    it("df.iloc works for rows:[1]", function () {
      let data = [ 1, 2, 34, 5, 6 ];

      let df = new dfd.Series(data);

      let sf = df.loc([ 1 ]);
      let expected = [ 2 ];

      assert.deepEqual(sf.values, expected);
    });

    it("correct index is returned for df.loc([1, 4])", function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data, { index: [ "a", "b", "c", "d", "e" ] });

      let sf = df.loc([ "b", "e" ]);
      let expected = [ "b", "e" ];
      assert.deepEqual(sf.index, expected);
    });

    it("row slice with string param works [0:2]", function () {
      let data = [ 1, 2, 4, 5, 6, 20, 30, 40, 39, 89, 78 ];
      let df = new dfd.Series(data);

      let sf = df.loc([ "0:2" ]);
      let expected = [ 1, 2 ];

      assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [1:]", function () {
      let data = [ 1, 2, 34, 5, 620, 30, 409, 89, 78 ];
      let df = new dfd.Series(data);

      let sf = df.loc([ "1:" ]);
      let expected = [ 2, 34, 5, 620, 30, 409, 89, 78 ];

      assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [:2]", function () {
      let data = [ 1, 2, 34, 5, 6, 20, 30, 40, 39, 89, 78 ];
      let df = new dfd.Series(data);
      let sf = df.loc([ ":2" ]);
      let expected = [ 1, 2 ];

      assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [:]", function () {
      let data = [ 1, 2, 3, 5, 20, 30, 4039, 89, 78 ];
      let df = new dfd.Series(data);
      let expected = [ 1, 2, 3, 5, 20, 30, 4039, 89, 78 ];

      let sf = df.loc([ ":" ]);
      assert.deepEqual(sf.values, expected);

    });

    it(`throw error for wrong start index size ["0:20"]`, function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "0:20" ]); }, Error, `row slice [end] index cannot be bigger than 5`);
    });

    it(`throw error for wrong start index size ["-1:2"]`, function () {
      let data = [ 1, 2, 34, 5, 6 ];
      let df = new dfd.Series(data);
      assert.throws(function () { df.iloc([ "-1:2" ]); }, Error, `row slice [start] index cannot be less than 0`);
    });

    it("check data after column slice", function () {
      let data = [ 1, 2, 34, 5, 620, 30, 4039, 89, 78 ];
      let df = new dfd.Series(data);

      let sf = df.loc([ 0, 1, 6 ]);
      let expected = [ 1, 2, 4039 ];
      assert.deepEqual(sf.values, expected);

    });

    it("loc works for boolean array", function () {
      let data = [ 1, 2, 34, 5, 620 ];
      let df = new dfd.Series(data);

      let sf = df.loc([ true, true, false, true, false ]);
      let expected = [ 1, 2, 5 ];
      assert.deepEqual(sf.values, expected);

    });

    it("loc works for boolean array (all true)", function () {
      let data = [ 1, 2, 34, 5, 620 ];
      let df = new dfd.Series(data);

      let sf = df.loc([ true, true, true, true, true ]);
      let expected = [ 1, 2, 34, 5, 620 ];
      assert.deepEqual(sf.values, expected);

    });
    it("loc works for boolean array (all false)", function () {
      let data = [ 1, 2, 34, 5, 620 ];
      let df = new dfd.Series(data);

      let sf = df.loc([ false, false, false, false, false ]);
      let expected = [];
      assert.deepEqual(sf.values, expected);

    });

    it("boolean loc works for DataFrame", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.loc({ rows: [ false, false, false, true ] });
      const result = [ [ 'Pear', 10, 250 ] ];
      assert.deepEqual(subDf.values, result);

    });


    it("boolean loc works for DataFrame with specified columns", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.loc({ rows: [ false, false, false, true ], columns: [ "Name", "Price" ] });
      const result = [ [ 'Pear', 250 ] ];
      assert.deepEqual(subDf.values, result);

    });

    it("boolean loc works for DataFrame with Series bool selector", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.loc({ rows: df["Count"].gt(10), columns: [ "Name", "Price" ] });
      const result = [ [ 'Apples', 200 ], [ 'Banana', 40 ] ];
      assert.deepEqual(subDf.values, result);

    });

    it("loc with no matches create a Empty DataFrame conserving columns information", function () {
      const data = {
        "Name": [ "Apples", "Mango", "Banana", "Pear" ],
        "Count": [ 21, 5, 30, 10 ],
        "Price": [ 200, 300, 40, 250 ]
      };
      const df = new dfd.DataFrame(data);
      const subDf = df.loc({ rows: df["Count"].gt(50) });

      assert.deepEqual(subDf.values, []);
      assert.deepEqual(subDf.shape, [ 0, 3 ]);
      assert.deepEqual(subDf.columns, [ "Name", "Count", "Price" ]);
      assert.deepEqual(subDf.dtypes, [ "string", "int32", "int32" ]);

    });
  });

});

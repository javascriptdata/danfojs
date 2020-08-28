import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'
import { Series } from "../../src/core/series";

describe("DataFrame", function () {

    describe("drop", function () {
        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.drop({ columns: [3], axis: 0, inplace: false }) }, Error, 'No index label found. Axis of 0 must be accompanied by an array of index labels');
        })
        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.drop({ columns: ["D"], axis: 1, inplace: false }) }, Error, 'column "D" does not exist');
        })

        it("drop a column inplace", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop({ columns: ["C", "B"], axis: 1, inplace: true });
            let column = ["A"]
            assert.deepEqual(df.columns, column);
        })
        it("check if data is updated after column is dropped", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop({ columns: ["C"], axis: 1, inplace: true });
            let new_data = [[1, 2], [4, 5]]
            assert.deepEqual(df.values, new_data);
            assert.deepEqual(df.dtypes.length, 2);

        })

        it("check if data is updated after row is dropped", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop({ index: [0], axis: 0, inplace: true });
            let new_data = [[4, 5, 6],]
            assert.deepEqual(df.values, new_data);
        })
        it("check if new dataframe is properly created after column is dropped (not-in-inplace)", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let df_drop = df.drop({ columns: ["C"], axis: 1, inplace: false });

            let expected_data = [[1, 2], [4, 5]]
            let expected_cols = ["A", "B"]
            let expected_df = new DataFrame(expected_data, { columns: expected_cols })
            assert.deepEqual(df_drop.values, expected_df.values);
        })
        it("check that the dtype is updated after column drop", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop({ columns: ["A"], axis: 1, inplace: true });
            let dtype = ['int32', 'int32']
            assert.deepEqual(df.ctypes.values, dtype);
        })
        it("drop row by single string labels", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 34, 5]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols, index: ["a", "b", "c"] })
            df.drop({ index: ["a"], axis: 0, inplace: true });
            let new_data = [[4, 5, 6], [20, 34, 5]]
            assert.deepEqual(df.values, new_data);
        })
        it("drop row by two or more string labels", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 34, 5], [2, 3.4, 5], [2.0, 340, 5]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols, index: ["a", "b", "c", "a", "b"] })
            df.drop({ index: ["a", "b"], axis: 0, inplace: true });
            let new_data = [[20, 34, 5]]
            assert.deepEqual(df.values, new_data);

        })
    })

    describe("head", function () {
        it("Gets the first n rows in a DataFrame", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.head(2).values, [[1, 2, 3], [4, 5, 6]])
        })
        it("Return all rows in a DataFrame if row specified is greater than values", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.head(10).values, data)
        })
        it("Return all rows in a DataFrame if row specified is less than 0", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.head(-1).values, data)
        })

    })

    describe("tail", function () {
        it("Prints the last n rows of a DataFrame", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.tail(2).values, [[20, 30, 40], [39, 89, 78]])
        })
        it("Return all rows in a DataFrame if row specified is greater than values", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.tail(10).values, data)
        })
        it("Return all rows in a DataFrame if row specified is less than 0", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.tail(-1).values, data)
        })
        it("Return last 3 row index in a DataFrame", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.tail(2).index, [2, 3])
        })
        it("Check print format on head call", function () {
            let data = [[1, 2, 34, 5, 0, 6, 4, 5, 6, 7], [20, 30, 40, 39, 89, 78, 45, 56, 56, 45]]
            let df = new DataFrame(data)
            assert.deepEqual(df.tail(2).values, [[1, 2, 34, 5, 0, 6, 4, 5, 6, 7], [20, 30, 40, 39, 89, 78, 45, 56, 56, 45]])
        })
    })

    describe("sample", function () {
        it("Samples n number of random elements from a DataFrame", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.sample(2).shape, [2, 3])
        })
        it("Samples n number of random elements from a DataFrame", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.sample().shape, [5, 3])
        })
        it("Return all values if n of sample is greater than lenght of Dataframe", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.sample(6).shape, [5, 3])
        })
        it("Return all values if n of sample is less than 1", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.deepEqual(df.sample(-1).shape, [5, 3])
        })
    })

    describe("loc", function () {

        it("throw error for wrong column name", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.loc({ "rows": [0, 1], "columns": ["A", "D"] }) }, Error, "Column D does not exist");
        })
        it("check data after selecting column", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": [0, 1], "columns": ["B", "C"] })
            let col_data = [[2, 3], [5, 6]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after selecting row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": [1], "columns": ["B", "C"] })
            let col_data = [[5, 6],]

            assert.deepEqual(col_df.values, col_data)

        });
        it("check data after row and column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": ["0:2"], "columns": ["B:C"] })
            let col_data = [[2], [5]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": ["0:2"], "columns": ["B", "C"] })
            let col_data = [[2, 3], [5, 6]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": [0, 1], "columns": ["A:C"] })
            let col_data = [[1, 2], [4, 5]]
            assert.deepEqual(col_df.values, col_data)

        })
        it("loc by single string index", function () {
            let data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            }

            let df = new DataFrame(data)
            df.set_index({ key: ["a", "b", "c", "a"], inplace: true })
            let sub_df = df.loc({ rows: ["a"], columns: ["Name", "Count"] })
            let expected = [["Apples", 21], ["Pear", 10]]
            assert.deepEqual(sub_df.values, expected)

        })
        it("loc by multiple string index", function () {
            let data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            }

            let df = new DataFrame(data)
            df.set_index({ key: ["a", "b", "c", "a"], inplace: true })
            let sub_df = df.loc({ rows: ["a", "b"], columns: ["Name", "Count"] })
            let expected = [["Apples", 21], ["Mango", 5], ["Pear", 10]]
            assert.deepEqual(sub_df.values, expected)

        })
        it("loc by slice string index", function () {
            let data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            }

            let df = new DataFrame(data)
            df.set_index({ key: ["a", "b", "c", "d"], inplace: true })
            let sub_df = df.loc({ rows: ["a:c"], columns: ["Name", "Count"] })
            let expected = [["Apples", 21], ["Mango", 5]]
            assert.deepEqual(sub_df.values, expected)

        })


    });

    describe("iloc", function () {

        it("throw error for wrong column index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.iloc({ "rows": [0, 1], "columns": [0, 3] }) }, Error, "column index 3 is bigger than 2");
        })

        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.iloc({ "rows": 0, "columns": [0, 3] }) }, Error, "rows parameter must be a Array");
        })

        it("throw error for wrong column index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.iloc({ "rows": [0, 1], "columns": 3 }) }, Error, "columns must be a list");
        })

        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.iloc({ "rows": [0, 8], "columns": [1, 2] }) }, Error, "Specified row index 8 is bigger than maximum row index of 1");
        })

        it("check data after selecting column", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": [0, 1], "columns": [1, 2] })
            let col_data = [[2, 3], [5, 6]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after selecting row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": [1], "columns": [1, 2] })
            let col_data = [[5, 6],]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row and column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": ["0:2"], "columns": ["1:2"] })
            let col_data = [[2], [5]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": ["0:2"], "columns": [1, 2] })
            let col_data = [[2, 3], [5, 6]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": [0, 1, 2], "columns": ["1:2"] })
            let col_data = [[2], [5], [30]]
            assert.deepEqual(col_df.values, col_data)

        })
        it("Return all columns if columns parameter is not specified", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": [0, 1, 2] })
            let col_data = [[1, 2, 3], [4, 5, 6], [20, 30, 40]]
            assert.deepEqual(col_df.values, col_data)

        })
        it("Return all rows if rows parameter is not specified", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "columns": ["1:2"] })
            let col_data = [[2], [5], [30], [89]]
            assert.deepEqual(col_df.values, col_data)

        })

    });


    describe("add", function () {
        it("Return Addition of DataFrame with a single Number", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.add(2).values, [[2, 4, 6], [362, 182, 362]])
        })
        it("Return addition of a DataFrame with a Series along default axis 1", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2, 1])
            let df = new DataFrame(data)
            assert.deepEqual(df.add(sf).values, [[1, 4, 5], [361, 182, 361]])
        })
        it("Return addition of a DataFrame with a Series along axis 0", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2])
            let df = new DataFrame(data)
            assert.deepEqual(df.add(sf, 0).values, [[1, 3, 5], [362, 182, 362]])
        })
        it("Return addition of a DataFrame with a DataFrame along default axis 1", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.add(df2).values, [[1, 4, 8], [370, 185, 360]])
        })
        it("Return addition of a DataFrame with a DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.add(df2).values, [[1, 4, 8], [370, 185, 360]])
        })

    })

    describe("sub", function () {
        it("Return subtraction of DataFrame with a single Number", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.sub(2).values, [[-2, 0, 2], [358, 178, 358]])
        })
        it("Return subtraction of a DataFrame with a Series along default axis 1", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2, 1])
            let df = new DataFrame(data)
            assert.deepEqual(df.sub(sf).values, [[-1, 0, 3], [359, 178, 359]])
        })
        it("Return subtraction of a DataFrame with a Series along axis 0", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2])
            let df = new DataFrame(data)
            assert.deepEqual(df.sub(sf, 0).values, [[-1, 1, 3], [358, 178, 358]])
        })
        it("Return subtraction of a DataFrame with a DataFrame along default axis 1", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.sub(df2).values, [[-1, 0, 0], [350, 175, 360]])
        })
        it("Return subtraction of a DataFrame with a DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.sub(df2).values, [[-1, 0, 0], [350, 175, 360]])
        })

    })

    describe("mul", function () {
        it("Return multiplication of DataFrame with a single Number", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.mul(2).values, [[0, 4, 8], [720, 360, 720]])
        })
        it("Return multiplication of a DataFrame with a Series along default axis 1", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2, 1])
            let df = new DataFrame(data)
            assert.deepEqual(df.mul(sf).values, [[0, 4, 4], [360, 360, 360]])
        })
        it("Return multiplication of a DataFrame with a Series along axis 0", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2])
            let df = new DataFrame(data)
            assert.deepEqual(df.mul(sf, 0).values, [[0, 2, 4], [720, 360, 720]])
        })
        it("Return multiplication of a DataFrame with a DataFrame along default axis 1", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.mul(df2).values, [[0, 4, 16], [3600, 900, 0]])
        })
        it("Return multiplication of a DataFrame with a DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.mul(df2, 0).values, [[0, 4, 16], [3600, 900, 0]])
        })

    })

    describe("div", function () {
        it("Return division of DataFrame with a single Number", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.div(2).values, [[0, 1, 2], [180, 90, 180]])
        })
        it("Return division of a DataFrame with a Series along default axis 1", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2, 1])
            let df = new DataFrame(data)
            assert.deepEqual(df.div(sf).values, [[0, 1, 4], [360, 90, 360]])
        })
        it("Return division of a DataFrame with a Series along axis 0", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2])
            let df = new DataFrame(data)
            assert.deepEqual(df.div(sf, 0).values, [[0, 2, 4], [180, 90, 180]])
        })
        it("Return division of a DataFrame with a DataFrame along default axis 1", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.div(df2).values, [[0, 1, 1], [36, 36, Infinity]])
        })
        it("Return division of a DataFrame with a DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            assert.deepEqual(df1.div(df1).values, [[NaN, 1, 1], [1, 1, 1]])
        })
        it("Return division of a DataFrame with a DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.div(df2).values, [[0, 1, 1], [36, 36, Infinity]])
        })

    })

    describe("pow", function () {
        it("Return exponential of DataFrame with a single Number", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.pow(2).values, [[0, 4, 16], [129600, 32400, 129600]])
        })
        it("Return exponential of a DataFrame with a Series along default axis 1", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2, 1])
            let df = new DataFrame(data)
            assert.deepEqual(df.pow(sf).values, [[0, 4, 4], [360, 32400, 360]])
        })
        it("Return exponential of a DataFrame with a Series along axis 0", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let sf = new Series([1, 2])
            let df = new DataFrame(data)
            assert.deepEqual(df.pow(sf, 0).values, [[0, 2, 4], [129600, 32400, 129600]])
        })
        it("Return exponential of a DataFrame with another DataFrame along default axis 1", function () {
            let df1 = new DataFrame([[0, 2, 4], [3, 10, 4]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.pow(df2).values, [[0, 4, 256], [59049, 100000, 1]])
        })
        it("Return exponential of a DataFrame with another DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [3, 10, 4]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.pow(df2, 0).values, [[0, 4, 256], [59049, 100000, 1]])
        })

    })

    describe("mod", function () {
        it("Return modulus of DataFrame with a single Number", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.mod(2).values, [[0, 0, 0], [0, 0, 0]])
        })
        it("Return modulus of a DataFrame with a Series along default axis 1", function () {
            let data = [[0, 2, 4], [31, 15, 360]]
            let sf = new Series([1, 2, 1])
            let df = new DataFrame(data)
            assert.deepEqual(df.mod(sf).values, [[0, 0, 0], [0, 1, 0]])
        })
        it("Return modulus of a DataFrame with a Series along axis 0", function () {
            let data = [[0, 2, 4], [31, 15, 360]]
            let sf = new Series([1, 2])
            let df = new DataFrame(data)
            assert.deepEqual(df.mod(sf, 0).values, [[0, 0, 0], [1, 1, 0]])
        })
        it("Return modulus of a DataFrame with a DataFrame along default axis 1", function () {
            let df1 = new DataFrame([[0, 2, 4], [31, 15, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.mod(df2).values, [[0, 0, 0], [1, 0, NaN]])
        })
        it("Return modulus of a DataFrame with a DataFrame along axis 0", function () {
            let df1 = new DataFrame([[0, 2, 4], [360, 180, 360]])
            let df2 = new DataFrame([[1, 2, 4], [10, 5, 0]])
            assert.deepEqual(df1.mod(df2).values, [[0, 0, 0], [0, 0, NaN]])
        })

    })

    describe("mean", function () {
        it("Returns the mean of a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data, { columns: ["col1", "col2", "col3"] })
            assert.deepEqual(df.mean().values, [180, 91, 182])
        })
        it("Return mean of a DataFrame along axis 0 (row)", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.mean(0).values, [2, 300])
        })
    })

    describe("median", function () {
        it("Returns the median of a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.median().values, [180, 91, 182])
        })
        it("Return median of a DataFrame along axis 0 (row)", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.median({ "axis": 0 }).values, [2, 360])
        })

    })

    // describe("mode", function () {
    //     it("Returns the mode of a DataFrame (Default axis is [1:column])", function () {
    //         let data = [[0, 2, 4], [360, 180, 360]]
    //         let df = new DataFrame(data)
    //         assert.deepEqual(df.mode().values, [362, 182, 362])
    //     })
    //     it("Returns mode of a DataFrame along axis 0 (row)", function () {
    //         let data = [[0, 2, 4], [360, 180, 360]]
    //         let df = new DataFrame(data)
    //         assert.deepEqual(df.mode({ "axis": 0 }).values, [1, 182])
    //     })
    //     it("Returns mode of a DataFrame along axis 1", function () {
    //         let data = [{ "col1": [0, 2, 4] }, { "col2": [360, 180, 360] }]
    //         let df = new DataFrame(data)
    //         assert.deepEqual(df.mode().values, [1, 362, 40])
    //     })

    // })

    describe("min", function () {
        it("Returns the minimum values in a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.min().values, [0, 2, 4])
        })
        it("Returns the minimum values of a DataFrame along axis 0 (row)", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.min({ "axis": 0 }).values, [0, 180])
        })

    })

    describe("max", function () {
        it("Returns the maximum values in a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.max().values, [360, 180, 360])
        })
        it("Returns the maximum values of a DataFrame along axis 0 (row)", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.max({ "axis": 0 }).values, [4, 360])
        })

    })

    describe("std", function () {
        it("Returns the standard deviations of values in a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.std().values, [254.55844122715712, 125.86500705120545, 251.7300141024109])
        })
        it("Return the standard deviations of values of a DataFrame along axis 0 (row)", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.std(0).values, [2, 103.92304845413264])
        })


    })

    describe("var", function () {
        it("Returns the variance of values in a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.var().values, [64800, 15842, 63368])
        })
        it("Return the variance of values of a DataFrame along axis 0 (row)", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.var(0).values, [4, 10800])
        })


    })

    describe("describe", function () {
        it("Returns descriptive statistics of columns in a DataFrame created from an array", function () {
            let data = [[0, 2, 4, "a"],
            [360, 180, 360, "b"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data)
            let res = [[3, 3, 3], [120.666664, 62, 123.333336],
            [207.271159, 102.19589, 204.961785],
            [0, 2, 4], [2, 4, 6],
            [360, 180, 360],
            [42961.333333, 10444, 42009.333333]]

            assert.deepEqual(df.describe().values, res)
        })
        it("Returns descriptive statistics of columns in a DataFrame created from an Object", function () {
            let data = {
                "col1": [0, 2, 4],
                "col2": [360, 180, 360],
                "col3": [2, 4, 6],
                "col4": ["boy", "girl", "man"],
                "col5": ["apple", "car", "bee"]
            }
            let df = new DataFrame(data)

            let res = [[3, 3, 3], [2, 300, 4],
            [2, 103.923048, 2],
            [0, 180, 2], [2, 360, 4],
            [4, 360, 6],
            [4, 10800, 4]]

            assert.deepEqual(df.describe().values, res)
        })

    })

    describe("count", function () {
        it("Returns the count of non-nan values in a DataFrame (Default axis is [1:column])", function () {
            let data = [[0, 2, 4], [360, 180.1, 360.11], [NaN, 2, 4], [360, undefined, 360]]
            let df = new DataFrame(data)
            assert.deepEqual(df.count().values, [3, 3, 4])
        })
        it("Return the count of non NaN values of a DataFrame along axis 0", function () {
            let data = [[0, 2, 4, NaN], [360, undefined, 360, 70]]
            let df = new DataFrame(data)
            assert.deepEqual(df.count(0).values, [3, 3])
        })

    })

    describe("round", function () {
        it("Rounds values in a DataFrame to 3dp", function () {
            let data = [[10.1, 2.092, 4.23], [360.232244, 180.0190290, 36.902612]]
            let df = new DataFrame(data)
            let expected = [[10.1, 2.092, 4.23], [360.232, 180.0190, 36.903]]
            assert.deepEqual(df.round(3).values, expected)
        })
        it("Rounds values in a DataFrame to 1dp", function () {
            let data = [[10.1, 2.092, 4.23], [360.232244, 180.0190290, 36.902612]]
            let df = new DataFrame(data)
            let expected = [[10.1, 2.1, 4.2], [360.2, 180.0, 36.9]]
            assert.deepEqual(df.round(1).values, expected)
        })

    })

    describe("sort_values", function () {
        it("Sort values in DataFrame by specified column in ascending order (Default)", function () {
            let data = [[0, 2, 4, "a"],
            [360, 180, 360, "b"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            df.sort_values({ "by": "col1", inplace: true, ascending: true })
            let expected = [[0, 2, 4, "a"], [2, 4, 6, "c"], [360, 180, 360, "b"]]
            assert.deepEqual(df.values, expected)
            assert.deepEqual(df.index, [0, 2, 1])

        })

        it("Sort values in DataFrame by specified column in ascending order (Default)", function () {
            let data = [[0, 2, 4, "a"],
            [360, 180, 1, "b"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            let df_sort = df.sort_values({ "by": "col3" })
            let expected = [[360, 180, 1, "b"], [0, 2, 4, "a"], [2, 4, 6, "c"]]
            assert.deepEqual(df_sort.values, expected)
            assert.deepEqual(df_sort.index, [1, 0, 2])

        })
        it("Sort values in DataFrame by specified column in descending order", function () {
            let data = [[0, 2, 4, "a"],
            [360, 180, 360, "b"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            let expected = [[360, 180, 360, "b"], [2, 4, 6, "c"], [0, 2, 4, "a"]]
            assert.deepEqual(df.sort_values({ "by": "col1", "ascending": false }).values, expected)
        })

        it("Sort values in DataFrame by specified column in descending order (second col)", function () {
            let data = [[0, 2, 4, "a"],
            [360, 180, 1, "b"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            let expected = [[2, 4, 6, "c"], [0, 2, 4, "a"], [360, 180, 1, "b"]]
            assert.deepEqual(df.sort_values({ "by": "col3", "ascending": false }).values, expected)
        })
        it("Sort values in DataFrame by specified column containing alpha(numeric) values", function () {
            let data = [[0, 2, 4, "a"],
            [360, 180, 1, "b"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            let expected = [[2, 4, 6, 'c'], [360, 180, 1, 'b'], [0, 2, 4, 'a']]
            assert.deepEqual(df.sort_values({ "by": "col4", "ascending": false }).values, expected)
        })


    })

    describe("copy", function () {
        it("Makes a deep copy of DataFrame", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            let df_copy = df.copy()
            assert.deepEqual(df_copy.values, [[0, 2, 4], [360, 180, 360]])
        })
        it("Confirms child copy modification does not affect parent DataFrame", function () {
            let data = [[0, 2, 4], [360, 180, 360]]
            let df = new DataFrame(data)
            let df_copy = df.copy()
            df_copy.addColumn({ column: "col_new", value: ["boy", "girl"] })
            assert.notDeepEqual(df_copy.values, df.values)
        })

    })


    describe("set_index", function () {
        it("Sets the index of a DataFrame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new DataFrame(data)
            let df_new = df.set_index({ "key": ["one", "two", "three"] })
            assert.deepEqual(df_new.index, ["one", "two", "three"])
        })
        it("Sets the index of a DataFrame from column name", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new DataFrame(data)
            let df_new = df.set_index({ "key": "alpha" })
            assert.deepEqual(df_new.index, ["A", "B", "C"])
        })
        it("Sets the index of a DataFrame from column name", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new DataFrame(data)
            let df_new = df.set_index({ key: "alpha", drop: true })
            assert.deepEqual(df_new.index, ["A", "B", "C"])
        })
        it("Sets the index of a DataFrame created from an Array", function () {
            let data = [[0, 2, 4], [360, 180, 360], [0, 2, 4], [360, 180, 360], [0, 2, 4]]
            let df = new DataFrame(data)
            df.set_index({ "key": ["one", "two", "three", "four", "five"], "inplace": true })
            assert.deepEqual(df.index, ["one", "two", "three", "four", "five"])
        })

    })

    describe("reset_index", function () {
        it("Resets the index of a DataFrame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new DataFrame(data)
            let df_new = df.set_index({ "key": ["one", "two", "three"] })
            let df_reset = df_new.reset_index()
            assert.deepEqual(df_reset.index, [0, 1, 2])
        })
        it("Resets the index of a DataFrame created from an Array", function () {
            let data = [[0, 2, 4], [360, 180, 360], [0, 2, 4], [360, 180, 360], [0, 2, 4]]
            let df = new DataFrame(data)
            df.set_index({ "key": ["one", "two", "three", "four", "five"], "inplace": true })
            df.reset_index(true)
            assert.deepEqual(df.index, [0, 1, 2, 3, 4])
        })

    })



    // describe("apply", function () {
    //     it("Apply a function to all values of a DataFrame", function () {
    //         let data = [[0, 2, 4],
    //         [360, 180, 360],
    //         [0, 2, 4]]
    //         let df = new DataFrame(data)

    //         let apply_func = (x) => {
    //             return x + 1000
    //         }
    //         let expected = [[1000, 1002, 1004], [1360, 1180, 1360], [1000, 1002, 1004]]
    //         assert.deepEqual(df.apply(apply_func), expected)
    //     });

    //     it("Throws error on applying function to string columns", function () {
    //         let data = [[0, 2, "ab"],
    //         [360, 180, "mk"],
    //         [0, 2, "po"]]
    //         let df = new DataFrame(data)

    //         let apply_func = (x) => {
    //             return x + 1000
    //         }
    //         let expected = "Dtypes Error: columns dtypes must be numeric, got strings"
    //         assert.deepEqual(df.apply(apply_func), expected)
    //     });
    // });



    describe("query", function () {

        it("Get the DataFrame containing rows with the filtered column", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let query_df = df.query({ "column": "B", "is": ">=", "to": 5 })
            let query_data = [[4, 5, 6], [20, 30, 40], [39, 89, 78]]
            assert.deepEqual(query_df.values, query_data)
        });
        it("Print Error for value key not specified", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "column": "B", "is": ">=" }) }, Error, "specify a value in param [to]");
        });
        it("Print Error for operator key not specified", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "column": "B", "to": 5 }) }, Error, "specify an operator in param [is]");
        });

        it("Print Error for column key not specified", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "is": ">=", "to": 5 }) }, Error, "specify the column");
        });
        it("Print Error for column name not in dataframe", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "column": "D", "is": ">=", "to": 5 }) }, Error, "column D does not exist");
        });
        it("Confirms that query index are updated", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let df_query = df.query({ "column": "B", "is": ">=", "to": 5 })
            assert.deepEqual(df_query.index, [1, 2, 3])
        });
        it("Confirms that columns data are updated inplace", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.query({ "column": "B", "is": ">=", "to": 5, inplace: true })
            assert.deepEqual(df.col_data, [[4, 20, 39], [5, 30, 89], [6, 40, 78]])
        });
        it("Confirms that query happens inplace", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.query({ "column": "B", "is": ">=", "to": 5, inplace: true })
            let query_data = [[4, 5, 6], [20, 30, 40], [39, 89, 78]]
            assert.deepEqual(df.values, query_data)
        });
        it("Confirms that query happens inplace and index are updated", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.query({ "column": "B", "is": ">=", "to": 5, inplace: true })
            assert.deepEqual(df.index, [1, 2, 3])
        });

    });

    describe("addColumn", function () {
        it("Print the data, after changing a column data", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let new_col = [1, 2, 3, 4]

            df.addColumn({ "column": "C", "value": new_col });

            let new_data = [[1, 2, 1], [4, 5, 2], [20, 30, 3], [39, 89, 4]];

            assert.deepEqual(df.values, new_data);
        });
        it("Print the Dataframe column names, after a new column is added ", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let new_col = [1, 2, 3, 4]

            df.addColumn({ "column": "D", "value": new_col });

            let new_column = ["A", "B", "C", "D"]

            assert.deepEqual(df.column_names, new_column);
        });
        it("Print Error for column name not in keyword passed", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_col = [1, 2, 3, 4]

            assert.throws(function () { df.addColumn({ "value": new_col }); }, Error, "column name not specified");
        });
        it("Check if new column value length is the same with Dataframe length", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_col = [1, 2, 3]
            assert.throws(function () { df.addColumn({ "column": "D", "value": new_col }); }, Error, "Array length 3 not equal to 4");
        });

        it("Check that dtype is updated after a new column is added ", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_col = ["n", "b", "c", "f"]

            df.addColumn({ "column": "D", "value": new_col });
            let dtype = ["int32", "int32", "int32", "string"]

            assert.deepEqual(df.dtypes, dtype);
        });

        it("add series as value to a new column ", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let sf = new Series(["n", "b", "c", "f"])

            df.addColumn({ "column": "D", "value": sf });
            let dtype = ["int32", "int32", "int32", "string"]

            assert.deepEqual(df.dtypes, dtype);
        });

    });

    // describe("groupby", function () {
    //     it("Check group by One column data", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A"]);

    //         let group_dict = {
    //             '1': [[1, 2, 3]],
    //             '4': [[4, 5, 6]],
    //             '20': [[20, 30, 40]],
    //             '39': [[39, 89, 78]]
    //         }

    //         assert.deepEqual(group_df.col_dict, group_dict);
    //     });
    //     it("Obtain the DataFrame of one of the group", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A"]);
    //         let new_data = [[1, 2, 3]]

    //         assert.deepEqual(group_df.get_groups([1]).values, new_data);
    //     });
    //     it("Check group by Two column data", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A", "B"]);
    //         let new_data = {
    //             '1': { '2': [[1, 2, 3]] },
    //             '4': { '5': [[4, 5, 6]] },
    //             '20': { '30': [[20, 30, 40]] },
    //             '39': { '89': [[39, 89, 78]] }
    //         }

    //         assert.deepEqual(group_df.col_dict, new_data);
    //     });

    //     it("Obtain the DataFrame of one of the group, grouped by two column", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A", "B"]);
    //         let new_data = [[1, 2, 3]]

    //         assert.deepEqual(group_df.get_groups([1, 2]).values, new_data);
    //     });

    //     it("Count column in group", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A", "B"]);
    //         let new_data = {
    //             '1': { '2': [1] },
    //             '4': { '5': [1] },
    //             '20': { '30': [1] },
    //             '39': { '89': [1] }
    //         }

    //         assert.deepEqual(group_df.col(["C"]).count(), new_data);
    //     });
    //     it("sum column element in group", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A", "B"]);
    //         let new_data = {
    //             '1': { '2': [3] },
    //             '4': { '5': [6] },
    //             '20': { '30': [40] },
    //             '39': { '89': [78] }
    //         }

    //         assert.deepEqual(group_df.col(["C"]).sum(), new_data);
    //     });

    //     it("sum column element group by one column", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A"]);

    //         let new_data = { '1': [2, 3], '4': [5, 6], '20': [30, 40], '39': [89, 78] }

    //         assert.deepEqual(group_df.col(["B", "C"]).sum(), new_data);
    //     });

    //     it("Perform aggregate on column for groupby", function () {

    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })
    //         let group_df = df.groupby(["A", "B"]);
    //         let new_data = {
    //             '1': { '2': [2, 1] },
    //             '4': { '5': [5, 1] },
    //             '20': { '30': [30, 1] },
    //             '39': { '89': [89, 1] }
    //         }

    //         assert.deepEqual(group_df.agg({ "B": "mean", "C": "count" }), new_data);
    //     });


    // });

    describe("column", function () {
        it("Obtain a column from a dataframe created from object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let options = { columns: ["Gender", "count"] }
            let df = new DataFrame(data, options)
            let col_data = df.column("count")
            let rslt_data = [1, 2, 3]
            assert.deepEqual(col_data.values, rslt_data);
        })
        it("Obtain a column from a dataframe", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let col_data = df.column("C")
            let rslt_data = [3, 6, 40, 78]
            assert.deepEqual(col_data.values, rslt_data);
        })
        it("Throw Error for wrong column", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(() => { df.column("D") }, Error, "column D does not exist")

        })
    });

    // describe("Concatenate", function () {

    //     it("Check the axis 0 concatenation", function () {
    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })

    //         let data1 = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols1 = ["A", "B", "C"]
    //         let df1 = new DataFrame(data1, { columns: cols1 })

    //         let data2 = [[1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]
    //         let cols2 = ["A", "B", "C", "D"]
    //         let df2 = new DataFrame(data2, { columns: cols2 })

    //         let new_df = DataFrame.concat({ "df_list": [df, df1, df2], "axis": 0 })

    //         let data_values = [[1, 2, 3, NaN], [4, 5, 6, NaN], [20, 30, 40, NaN], [39, 89, 78, NaN],
    //         [1, 2, 3, NaN], [4, 5, 6, NaN], [20, 30, 40, NaN], [39, 89, 78, NaN],
    //         [1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]

    //         assert.deepEqual(new_df.values, data_values);
    //     });

    //     it("Check the axis 1 concatenation", function () {
    //         let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols = ["A", "B", "C"]
    //         let df = new DataFrame(data, { columns: cols })

    //         let data1 = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //         let cols1 = ["A", "B", "C"]
    //         let df1 = new DataFrame(data1, { columns: cols1 })

    //         let data2 = [[1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]
    //         let cols2 = ["A", "B", "C", "D"]
    //         let df2 = new DataFrame(data2, { columns: cols2 })

    //         let new_df = DataFrame.concat({ "df_list": [df, df1, df2], "axis": 1 })

    //         let data_values = [[1, 2, 3, 1, 2, 3, 1, 2, 3, 5], [4, 5, 6, 4, 5, 6, 4, 5, 6, 8],
    //         [20, 30, 40, 20, 30, 40, 20, 30, 40, 10], [39, 89, 78, 39, 89, 78, NaN,
    //             NaN, NaN, NaN]]
    //         assert.deepEqual(new_df.values, data_values);
    //     });
    // });



    describe("Apply", function () {
        it("Apply math operation on dataframe element wise", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let rslt = [[2, 3, 4], [5, 6, 7], [21, 31, 41], [40, 90, 79]]

            let apply_rslt = df.apply({
                callable: (x) => {
                    return x + 1
                }
            })

            assert.deepEqual(apply_rslt.values, rslt)
        });

        it("Apply string function on all elements of a dataframe", function () {
            let data = [["BOY", "GIRL", "ALL"], ["Man", "Woman", "Girl"]]
            let df = new DataFrame(data)
            let rslt = [["boy", "girl", "all"], ["man", "woman", "girl"]]

            let apply_rslt = df.apply({
                callable: (x) => {
                    return x.toLowerCase()

                }
            })
            assert.deepEqual(apply_rslt.values, rslt)
        });

        it("Throws error if you try to run a function that does not operate on axis and axis is specified", function () {
            let data = [["BOY", "GIRL", "ALL"], ["Man", "Woman", "Girl"]]
            let df = new DataFrame(data)

            let err = `Callable Error: You can only apply JavaScript functions on DataFrames when axis is not specified. This operation is applied on all element, and returns a DataFrame of the same shape.`

            assert.throws(() => {
                df.apply({
                    axis: 0, callable: (x) => {
                        return x.toLowerCase()
                    }
                })
            }, Error, err)

        });

        it("Apply math operation on dataframe at axis 1", function () {
            let data = [[1, 2, 3],
            [4, 5, 6],
            [20, 30, 40],
            [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let rslt = [64, 126, 127]

            let apply_rslt = df.apply({
                axis: 1, callable: (x) => {
                    return x.sum()
                }
            })

            assert.deepEqual(apply_rslt.values, rslt)
        });

        it("Apply tensor operation on dataframe at axis 0", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let rslt = [6, 15, 90, 206]

            let apply_rslt = df.apply({
                axis: 0, callable: (x) => {
                    return x.sum()
                }
            })

            assert.deepEqual(apply_rslt.values, rslt)

        })

        it("Apply add operation element wise dataframe on axis 1", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let result = [[2, 3, 4],
            [5, 6, 7],
            [21, 31, 41],
            [40, 90, 79]]

            let apply_rslt = df.apply({
                axis: 0, callable: (x) => {
                    return x.add(1)
                }
            })

            assert.deepEqual(apply_rslt.values, result)
        });
    });

    describe("dropna", function () {
        it("drop inplace at axis 0 at inplace false", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [[5, 6, 7, 8]]

            assert.deepEqual(df.dropna().values, df_val)

        })
        it("drop inplace at axis 1, inplace false ", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [[1, 3], [4, 9], [6, 8]]

            assert.deepEqual(df.dropna({ axis: 1 }).values, df_val)

        })
        it("drop inplace at axis 1, inplace true ", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [[1, 3], [4, 9], [6, 8]]
            df.dropna({ axis: 1, inplace: true })


            assert.deepEqual(df.values, df_val)

        })
        it("drop inplace at axis 0 at inplace true", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [[5, 6, 7, 8]]

            df.dropna({ inplace: true })
            assert.deepEqual(df.values, df_val)

        })
    });

    describe("isna", function () {

        it("check if each value are nan", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, undefined, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [
                [true, false, false, false],
                [false, false, true, false],
                [false, false, false, false]
            ]

            assert.deepEqual(df.isna().values, df_val)
        });
    })

    describe("fillna", function () {

        it("replace all NaN value", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [[-999, 1, 2, 3], [3, 4, -999, 9], [5, 6, 7, 8]]
            df.fillna({ values: -999, inplace: true })
            assert.deepEqual(df.values, df_val)
        });
        it("replace all NaN value", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [[-999, 1, 2, 3], [3, 4, -999, 9], [5, 6, 7, 8]]

            let df_filled = df.fillna({ values: [-999] })
            assert.deepEqual(df_filled.values, df_val)
        });

        it("Fills only a specified column", function () {
            let data = [[1, 2, 3],
            [4, 5, 6],
            [20, NaN, 40],
            [39, NaN, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_vals = [[1, 2, 3], [4, 5, 6], [20, 2, 40], [39, 2, 78]]
            let df_filled = df.fillna({ columns: ["B"], values: [2] })

            assert.deepEqual(df_filled.values, new_vals);
        });
        it("Fills column with specified values not in place", function () {
            let data = [[1, 2, 3], [4, 5, 6], [NaN, 20, 40], [NaN, -1, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_vals = [[1, 2, 3], [4, 5, 6], [-2, 20, 40], [-2, -1, 78]]
            let df_filled = df.fillna({ columns: ["A"], values: [-2] })

            assert.deepEqual(df_filled.values, new_vals);
        });

        it("Fills a list of columns with specified values", function () {
            let data = [[1, undefined, 3], [4, undefined, 6], [NaN, "boy", 40], [NaN, "girl", 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_vals = [[1, "girl", 3], [4, "girl", 6], [200, "boy", 40], [200, "girl", 78]]
            let df_filled = df.fillna({ columns: ["A", "B"], values: [200, "girl"] })
            assert.deepEqual(df_filled.values, new_vals);
        });
        it("Fills a list of columns with specified values inplace", function () {
            let data = [[1, undefined, 3], [4, undefined, 6], [NaN, "boy", 40], [NaN, "girl", 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_vals = [[1, "girl", 3], [4, "girl", 6], [200, "boy", 40], [200, "girl", 78]]
            df.fillna({ columns: ["A", "B"], values: [200, "girl"], inplace: true })
            assert.deepEqual(df.values, new_vals);
        });
    })


    describe("nanindex", function () {

        it("print out the nanIndex", function () {
            let data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })

            let df_val = [0, 1]
            assert.deepEqual(df.nanIndex(), df_val)
        });
    })

    describe("select_dtypes", function () {

        it("Returns float columns in a DataFrame", function () {
            let data = [[30, 1, 2, "boy"], [3.2, 4, 30, "girl"], [5.09, 6, 7, "cat"]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let df_sub = df.select_dtypes(['float32'])
            assert.deepEqual(df_sub.col_data, [[30, 3.2, 5.09]])
        });

        it("Returns int columns in a DataFrame", function () {
            let data = [[30, 1, 2, "boy"],
            [3.2, 4, 30, "girl"],
            [5.09, 6, 7, "cat"]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let df_sub = df.select_dtypes(['int32'])
            assert.deepEqual(df_sub.values, [[1, 2], [4, 30], [6, 7]])
        });

        it("Returns string columns in a DataFrame", function () {
            let data = [[30, 1, 2, "boy"],
            [3.2, 4, 30, "girl"],
            [5.09, 6, 7, "cat"]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let df_sub = df.select_dtypes(['string'])
            assert.deepEqual(df_sub.col_data, [["boy", "girl", "cat"]])
        });

        it("Returns string and float columns in a DataFrame", function () {
            let data = [[30, 1, 2, "boy"],
            [3.2, 4, 30, "girl"],
            [5.09, 6, 7, "cat"]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let df_sub = df.select_dtypes(['string', 'float32'])
            assert.deepEqual(df_sub.col_data, [[30, 3.2, 5.09], ["boy", "girl", "cat"]])
        });

        it("Returns int and float columns in a DataFrame", function () {
            let data = [[30, 1, 2, "boy"],
            [3.2, 4, 30, "girl"],
            [5.09, 6, 7, "cat"]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let df_sub = df.select_dtypes(['int32', 'float32'])
            assert.deepEqual(df_sub.values, [[30, 1, 2], [3.2, 4, 30], [5.09, 6, 7]])
        });
    })

    describe("cum_ops", function () {

        it("check cumsum data", function () {
            let data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let rslt = [[2, 1, 2, 3], [5, 5, 13, 12], [10, 11, 20, 20]]

            assert.deepEqual(df.cumsum().values, rslt)
        });
        it("check cumsum data along axis 1", function () {
            let data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]]
            let column = ["A", "B", "C", "D"]
            let df = new DataFrame(data, { columns: column })
            let rslt = [[2, 3, 5, 8], [3, 7, 18, 27], [5, 11, 18, 26]]

            assert.deepEqual(df.cumsum({ axis: 1 }).values, rslt)
        });
    })

    describe("__set_column_property", async function () {
        it("Access column object using list subset and name of column", async function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new DataFrame(data)
            let col1 = ["A", "B", "C"]
            let col2 = [1, 2, 3]
            assert.deepEqual(df['alpha'].values, col1)
            assert.deepEqual(df['count'].values, col2)
        })
        it("Access column object using list subset and name of column after assigning", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df["A"] = [30, 40]
            let col1 = [30, 40]
            assert.deepEqual(df["A"].values, col1)
        })
    })

    describe("lt", function () {
        it("Returns Less than of DataFrame and other DataFrame (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let data2 = [[100, 450, 590, 5], [25, 2, 0, 10]]

            let df = new DataFrame(data1)
            let df2 = new DataFrame(data2)
            let expected = [[true, true, true, false],
            [false, false, false, false]]
            assert.deepEqual(df.lt(df2).values, expected)
        })

        it("Return Less than of series scalar (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let sf = new DataFrame(data1)
            let expected = [[true, false, false, true],
            [true, true, true, true]]
            assert.deepEqual(sf.lt(30).values, expected)
        })
        it("Return Less than of series and DataFrame scalar along axis 1 (column)", function () {
            let data1 = [[10, 45, 56, 10],
            [23, 20, 10, 10]]
            let sf = new Series([10, 23, 56, 100])
            let df = new DataFrame(data1)
            let expected = [[false, false, false, true], [false, true, true, true]]
            assert.deepEqual(df.lt(sf, 1).values, expected)
        })

        it("Return Less than of Array and DataFrame scalar along axis 1 (column)", function () {
            let data1 = [[10, 45, 56, 10], [23, 20, 10, 10]]
            let sf = [10, 23, 56, 100]
            let df = new DataFrame(data1)
            let expected = [[false, false, false, true], [false, true, true, true]]
            assert.deepEqual(df.lt(sf, 1).values, expected)
        })

    })

    describe("gt", function () {
        it("Return Greater than of series and other series (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let data2 = [[100, 450, 590, 5], [25, 2, 0, 10]]

            let df = new DataFrame(data1)
            let df2 = new DataFrame(data2)
            let expected = [[false, false, false, true], [false, true, true, false]]
            assert.deepEqual(df.gt(df2).values, expected)
        })

        it("Return Greater than of series scalar (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let sf = new DataFrame(data1)
            let expected = [[false, true, true, false], [false, false, false, false]]
            assert.deepEqual(sf.gt(30).values, expected)
        })

        it("Return Less than of Array and DataFrame scalar along axis 1 (column)", function () {
            let data1 = [[10, 45, 56, 10], [23, 20, 10, 10]]
            let sf = [10, 23, 56, 100]
            let df = new DataFrame(data1)
            let expected = [[false, true, false, false], [true, false, false, false]]
            assert.deepEqual(df.gt(sf, 1).values, expected)
        })

    })

    describe("le", function () {
        it("Return Less than or Equal to of series and other series (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let data2 = [[100, 450, 590, 5], [25, 2, 0, 10]]

            let df = new DataFrame(data1)
            let df2 = new DataFrame(data2)
            let expected = [[true, true, true, false], [true, false, false, true]]
            assert.deepEqual(df.le(df2).values, expected)
        })

        it("Return Less than or Equal to of series scalar (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 30, 10]]
            let sf = new DataFrame(data1)
            let expected = [[true, false, false, true], [true, true, true, true]]
            assert.deepEqual(sf.le(30).values, expected)
        })

    })

    describe("ge", function () {
        it("Return Greater than or Equal to of series and other series (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let data2 = [[100, 450, 590, 5], [25, 2, 0, 10]]

            let df = new DataFrame(data1)
            let df2 = new DataFrame(data2)
            let expected = [[false, false, false, true], [true, true, true, true]]
            assert.deepEqual(df.ge(df2).values, expected)
        })

        it("Return Greater than or Equal to of series scalar (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 30, 10]]
            let sf = new DataFrame(data1)
            let expected = [[false, true, true, false], [false, false, true, false]]
            assert.deepEqual(sf.ge(30).values, expected)
        })

    })

    describe("ne", function () {
        it("Return Not Equal to of series and other series (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let data2 = [[100, 450, 590, 5], [25, 2, 0, 10]]

            let df = new DataFrame(data1)
            let df2 = new DataFrame(data2)
            let expected = [[true, true, true, true], [false, true, true, false]]
            assert.deepEqual(df.ne(df2).values, expected)
        })

        it("Return Not Equal to of series scalar (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 30, 10]]
            let sf = new DataFrame(data1)
            let expected = [[true, true, true, true], [true, true, false, true]]
            assert.deepEqual(sf.ne(30).values, expected)
        })

    })

    describe("eq", function () {
        it("Return Equal to of DataFrame and other DataFrame (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 20, 10]]
            let data2 = [[100, 450, 590, 5], [25, 2, 0, 10]]

            let df = new DataFrame(data1)
            let df2 = new DataFrame(data2)
            let expected = [[false, false, false, false], [true, false, false, true]]
            assert.deepEqual(df.eq(df2).values, expected)
        })

        it("Return Equal to of DataFrame with scalar (element-wise)", function () {
            let data1 = [[10, 45, 56, 10], [25, 23, 30, 10]]
            let sf = new DataFrame(data1)
            let expected = [[false, false, false, false], [false, false, true, false]]
            assert.deepEqual(sf.eq(30).values, expected)
        })
        it("Return Equal to of series and DataFrame scalar along axis 1 (column)", function () {
            let data1 = { "Col1": [10, 45, 56, 10], "Col2": [23, 20, 10, 10] }
            let sf = new Series([10, 23])
            let df = new DataFrame(data1)
            let expected = [[true, false, false, true], [true, false, false, false]]
            assert.deepEqual(df.eq(sf, 1).col_data, expected)
        })

    })

    describe("replace", function () {
        it("Replace values given in replace param", function () {
            let data1 = [[10, 45, 56, 25], [23, 20, 10, 24]]
            let sf = new DataFrame(data1)
            let expected = [[-999, 45, 56, 25], [23, 20, -999, 24]]
            let df_rep = sf.replace({ replace: 10, with: -999 })
            assert.deepEqual(df_rep.values, expected)
        })

        it("Replace values given in replace param with value (String type)", function () {
            let data1 = [["A", "A", "A", "B"], ["B", "C", "C", "D"]]
            let df = new DataFrame(data1)
            let expected = [["boy", "boy", "boy", "B"], ["B", "C", "C", "D"]]
            let df_rep = df.replace({ replace: "A", with: "boy" })
            assert.deepEqual(df_rep.values, expected)
        })
        it("Throw error on wrong param passed", function () {
            let data1 = [["A", "A", "A", "B"], ["B", "C", "C", "D"]]
            let sf = new DataFrame(data1)
            let expected = `Params Error: A specified parameter is not supported. Your params must be any of the following [replace,with,in]`
            assert.throws(() => { sf.replace({ replce: "A", with: "boy" }) }, Error, expected)
        })
        it("Replace values in specified two column(s)", function () {
            let data1 = [["A", "A", 1, "girl"],
            ["B", "A", 2, "woman"],
            ["A", "B", 3, "man"]]
            let df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] })
            let expected = [["boy", "boy", 1, "girl"],
            ["B", "boy", 2, "woman"],
            ["boy", "B", 3, "man"]]
            let df_rep = df.replace({ replace: "A", with: "boy", in: ["col1", "col2"] })
            assert.deepEqual(df_rep.values, expected)
        })

        it("Replace values in specified single column(s)", function () {
            let data1 = [[2, "A", 1, "girl"],
            [3, "A", 2, "woman"],
            [4, "B", 3, "man"]]
            let df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] })
            let expected = [[2, "A", 1, "girl"],
            [100, "A", 2, "woman"],
            [4, "B", 3, "man"]]
            let df_rep = df.replace({ replace: 3, with: 100, in: ["col1"] })
            assert.deepEqual(df_rep.values, expected)
        })


    })

    describe("drop_duplicates", function () {
        it("Return Series with duplicate values removed (Default, first values kept)", function () {
            let data1 = [10, 45, 56, 10, 23, 20, 10, 10]
            let sf = new Series(data1)
            let expected = [10, 45, 56, 23, 20]
            let expected_index = [0, 1, 2, 4, 5]
            let df_drop = sf.drop_duplicates()
            assert.deepEqual(df_drop.values, expected)
            assert.deepEqual(df_drop.index, expected_index)

        })

        it("Return Series with duplicate values removed (last values kept)", function () {
            let data1 = [10, 45, 56, 10, 23, 20, 10, 10]
            let sf = new Series(data1)
            let expected = [45, 56, 23, 20, 10]
            let expected_index = [1, 2, 4, 5, 7]
            let df_drop = sf.drop_duplicates({ keep: "last" })
            assert.deepEqual(df_drop.values, expected)
            assert.deepEqual(df_drop.index, expected_index)

        })

        it("Return Series with duplicate values removed (String)", function () {
            let data1 = ["A", "A", "A", "B", "B", "C", "C", "D"]
            let sf = new Series(data1)
            let expected = ["A", "B", "C", "D"]
            let expected_index = [0, 3, 5, 7]
            sf.drop_duplicates({ inplace: true })
            assert.deepEqual(sf.values, expected)
            assert.deepEqual(sf.index, expected_index)

        })

    })

    describe("sum", function () {
        it("Sum values of a DataFrame by Default axis column (axis=1)", function () {
            let data1 = [[30, 40, 3.1],
            [5, 5, 5.1],
            [5, 5, 3.2]]
            let sf = new DataFrame(data1)
            let res = [40, 50, 11.4]
            assert.deepEqual(sf.sum().values, res)
        })
        it("Sum values of a DataFrame along row axis (axis=0)", function () {
            let data1 = [[30, 40, 3.1],
            [5, 5, 5.1],
            [5, 5, 3.2]]
            let df = new DataFrame(data1)
            let res = [73.1, 15.1, 13.2]
            assert.deepEqual(df.sum({ axis: 0 }).values, res)
        })
        it("Sum values of a mixed DataFrame along row axis (axis=0)", function () {
            let data1 = [[30, 40, 3.1, true],
            [5, 5, 5.1, true],
            [5, 5, 3.2, true]]
            let df = new DataFrame(data1)
            let res = [74.1, 16.1, 14.2]
            assert.deepEqual(df.sum({ axis: 0 }).values, res)
        })
        it("Sum values of a boolean DataFrame along row axis (axis=0)", function () {
            let data1 = [[true, true, false, true],
            [false, false, false, false],
            [false, true, true, false]]
            let df = new DataFrame(data1)
            let res = [3, 0, 2]
            assert.deepEqual(df.sum({ axis: 0 }).values, res)
        })
        it("Sum values of a boolean DataFrame along default column axis (axis=1)", function () {
            let data1 = [[true, true, false, true],
            [false, false, false, false],
            [false, true, true, false]]
            let df = new DataFrame(data1)
            let res = [1, 2, 1, 1]
            assert.deepEqual(df.sum().values, res)
        })

    })

    describe("abs", function () {
        it("Returns the absolute values in DataFrame of ints", function () {
            let data1 = [[-10, 45, 56, 10], [-25, 23, 20, -10]]
            let df = new DataFrame(data1)
            let expected = [[10, 45, 56, 10], [25, 23, 20, 10]]
            assert.deepEqual(df.abs().values, expected)
        })

        it("Returns the absolute values in mixed DataFrame", function () {
            let data1 = [[-10, -45.1, 56, 10], [-25, -23.2, 20, -10]]
            let df = new DataFrame(data1)
            let expected = [[10, 45.1, 56, 10], [25, 23.2, 20, 10]]
            assert.deepEqual(df.abs().values, expected)
        })
    })

    describe("T", function () {
        it("Returns the Tranpose of a DataFrame", function () {
            let data1 = [[10, 45, 56, 10],
            [25, 23, 20, 10]]

            let cols = ["a", "b", "c", "d"]
            let df = new DataFrame(data1, { columns: cols })
            let df_trans = df.T
            let expected_vals = [[10, 25], [45, 23], [56, 20], [10, 10]]
            let expected_index = cols
            let expected_col_names = [0, 1]
            assert.deepEqual(df_trans.index, expected_index)
            assert.deepEqual(df_trans.values, expected_vals)
            assert.deepEqual(df_trans.column_names, expected_col_names)

        })

    })


    describe("astype", function () {
        it("set type of float column to int", function () {
            let data = {
                "A": [-20.1, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20.1, -20.23, 30.3, 40.11],
                "D": ["a", "b", "c", "c"]
            }
            let ndframe = new DataFrame(data)
            let df = ndframe.astype({ column: "A", dtype: "int32" })

            assert.deepEqual(df.dtypes, ['int32', 'int32', 'float32', 'string'])
            assert.deepEqual(df['A'].values, [-20, 30, 47, -20])

        })
        it("set type of int column to float", function () {
            let data = {
                "A": [-20.1, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20.1, -20.23, 30.3, 40.11],
                "D": ["a", "b", "c", "c"]
            }
            let ndframe = new DataFrame(data)
            let df = ndframe.astype({ column: "B", dtype: "float32" })

            assert.deepEqual(df.dtypes, ['float32', 'float32', 'float32', 'string'])
            assert.deepEqual(df['B'].values, [34, -4, 5, 6])

        })
        it("set type of string column to int", function () {
            let data = {
                "A": [-20.1, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20.1, -20.23, 30.3, 40.11],
                "D": ["20.1", "21", "23.4", "50.78"]
            }
            let ndframe = new DataFrame(data)
            let df = ndframe.astype({ column: "D", dtype: "int32" })

            assert.deepEqual(df.dtypes, ['float32', 'int32', 'float32', 'int32'])
            assert.deepEqual(df['D'].values, [20, 21, 23, 51])

        })
        it("set type of string column to float", function () {
            let data = {
                "A": [-20.1, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20.1, -20.23, 30.3, 40.11],
                "D": ["20.1", "21", "23.4", "50.78"]
            }
            let ndframe = new DataFrame(data)
            let df = ndframe.astype({ column: "D", dtype: "float32" })

            assert.deepEqual(df.dtypes, ['float32', 'int32', 'float32', 'float32'])
            assert.deepEqual(df['D'].values, [20.1, 21, 23.4, 50.78])

        })
    })


    describe("nunique", function () {
        it("Returns the number of unique elements along axis 1", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data)
            let df = ndframe.nunique(1)
            let res = [3, 4, 2, 3]
            assert.deepEqual(df.values, res)

        })
        it("Returns the number of unique elements along axis 0", function () {
            let data = {
                "A": [20, 30, 47.3, 30],
                "B": [34, -4, 5, 30],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data)
            let df = ndframe.nunique(0)
            let res = [3, 4, 4, 2]
            assert.deepEqual(df.values, res)

        })

    })


    describe("unique", function () {
        it("Returns the unique elements along axis 1", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data)
            let df = ndframe.unique(1)
            let res = {
                "A": [-20, 30, 47.3],
                "B": [34, -4, 5, 6],
                "C": [20, 30],
                "D": ["a", "b", "c"]
            }

            assert.deepEqual(df, res)

        })
        it("Returns the unique elements along axis 0", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data)
            let df = ndframe.unique(0)
            let res = {
                0: [-20, 34, 20, "a"],
                1: [30, -4, 20, "b"],
                2: [47.3, 5, 30, "c"],
                3: [-20, 6, 30, "c"]
            }
            assert.deepEqual(df, res)

        })
    })


    describe("rename", function () {
        it("Rename columns along axis 1", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data)
            let df = ndframe.rename({ mapper: { "A": "a1", "B": "b1" } })
            let res = ["a1", "b1", "C", "D"]
            assert.deepEqual(df.columns, res)

        })
        it("confirms original column name is not modified along axis 1", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data)
            let df = ndframe.rename({ mapper: { "A": "a1", "B": "b1" } })
            let res = ["A", "B", "C", "D"]
            assert.deepEqual(ndframe.columns, res)

        })
        it("Rename columns along axis 1 inplace", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let df = new DataFrame(data)
            df.rename({ mapper: { "A": "a1", "B": "b1" }, inplace: true })
            let res = ["a1", "b1", "C", "D"]
            assert.deepEqual(df.columns, res)

        })
        it("Rename string index along axis 0", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let ndframe = new DataFrame(data, { index: ["a", "b", "c", "d"] })
            let df = ndframe.rename({ mapper: { "a": 0, "b": 1 }, axis: 0 })
            let res = [0, 1, "c", "d"]
            assert.deepEqual(df.index, res)

        })
        it("Rename string index along axis 0 inplace", function () {
            let data = {
                "A": [-20, 30, 47.3, -20],
                "B": [34, -4, 5, 6],
                "C": [20, 20, 30, 30],
                "D": ["a", "b", "c", "c"]
            }

            let df = new DataFrame(data, { index: ["a", "b", "c", "d"] })
            df.rename({ mapper: { "a": 0, "b": 1 }, axis: 0, inplace: true })
            let res = [0, 1, "c", "d"]
            assert.deepEqual(df.index, res)

        })
    })

    describe("SortIndex", function () {

        it("sort index in ascending order", function () {
            let data = [[0, 2, 4, "b"],
            [360, 180, 360, "a"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            df.set_index({ key: ["b", "a", "c"], inplace: true })

            let df2 = df.sortIndex()
            let rslt = [[360, 180, 360, 'a'], [0, 2, 4, 'b'], [2, 4, 6, 'c']]

            assert.deepEqual(df2.values, rslt)
        })
        it("sort index in descending order", function () {
            let data = [[0, 2, 4, "b"],
            [360, 180, 360, "a"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            df.set_index({ key: ["b", "a", "c"], inplace: true })

            let df2 = df.sortIndex({ ascending: false })
            let rslt = [[2, 4, 6, 'c'], [0, 2, 4, 'b'], [360, 180, 360, 'a']]

            assert.deepEqual(df2.values, rslt)
        })
        it("sort index in descending order with inplace set to true", function () {
            let data = [[0, 2, 4, "b"],
            [360, 180, 360, "a"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] })
            df.set_index({ key: ["b", "a", "c"], inplace: true })

            df.sortIndex({ ascending: false, inplace: true })
            let rslt = [[2, 4, 6, 'c'], [0, 2, 4, 'b'], [360, 180, 360, 'a']]
            assert.deepEqual(df.values, rslt)
        })
    });

    describe("append", function () {

        it("Add a new single row (array) to the end of a DataFrame", function () {
            let data = [[0, 2, 4, "b"],
            [360, 180, 360, "a"],
            [2, 4, 6, "c"]]

            let df = new DataFrame(data)
            let expected_val = [[0, 2, 4, "b"],
            [360, 180, 360, "a"],
            [2, 4, 6, "c"],
            [20, 40, 60, "d"]]

            assert.deepEqual(df.append([20, 40, 60, "d"]).values, expected_val)

        });
        
        it("Add a new single row (object) to the end of a DataFrame", function () {
            let data = [[0, 2, 4, "b"],
                        [360, 180, 360, "a"],
                        [2, 4, 6, "c"]]

            let df = new DataFrame(data, {"columns": ["col1", "col2", "col3", "col4"]})
            let expected_val = [[0, 2, 4, "b"],
                                [360, 180, 360, "a"],
                                [2, 4, 6, "c"],
                                [20, 40, 60, "d"]]

            assert.deepEqual(df.append({col1: 20, col2: 40, col3: 60, col4:"d"}).values, expected_val)

        });
    });
});

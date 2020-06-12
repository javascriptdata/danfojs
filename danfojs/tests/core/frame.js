import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'

describe("DataFrame", function () {

    describe("drop", function () {
        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.drop(3, { axis: 0, inplace: false }) }, Error, "Index does not exist");
        })
        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.drop("D", { axis: 1, inplace: false }) }, Error, "column D does not exist");
        })

        it("drop a column inplace", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop("C", { axis: 1, inplace: true });
            let column = ["A", "B"]
            assert.deepEqual(df.columns, column);
        })
        it("check if data is updated after column is dropped", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop("C", { axis: 1, inplace: true });
            let new_data = [[1, 2], [4, 5]]
            assert.deepEqual(df.values, new_data);
        })

        it("check if data is updated after row is dropped", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            df.drop(0, { axis: 0, inplace: true });
            let new_data = [[4, 5, 6],]
            assert.deepEqual(df.values, new_data);
        })
        it("check if new dataframe is properly created after column is dropped (not-in-inplace)", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let df_drop = df.drop("C", { axis: 1, inplace: false });

            let expected_data = [[1, 2], [4, 5]]
            let expected_cols = ["A", "B"]
            let expected_df = new DataFrame(expected_data, { columns: expected_cols })
            assert.deepEqual(df_drop.values, expected_df.values);
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
    })

    describe("loc", function () {

        it("throw error for wrong column name", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.loc({ "rows": [0, 1], "columns": ["A", "D"] }) }, Error, "Column D does not exist");
        })
        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.loc({ "rows": [0, 8], "columns": ["B", "C"] }) }, Error, "row index 8 is bigger than 1");
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

        })

    });

    describe("iloc", function () {

        it("throw error for wrong column index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.iloc({ "rows": [0, 1], "columns": [0, 3] }) }, Error, "column index 3 is bigger than 2");
        })

        it("throw error for wrong column index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.iloc({ "rows": 0, "columns": [0, 3] }) }, Error, "rows must be a list");
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
            assert.throws(function () { df.iloc({ "rows": [0, 8], "columns": [1, 2] }) }, Error, "row index 8 is bigger than 1");
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

    });

});

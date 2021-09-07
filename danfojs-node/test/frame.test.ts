import { assert, expect } from "chai";
import { DataFrame, Series } from '../build';

// const testCSVPath = "./tester.csv";

describe("DataFrame", function () {

    describe("Subsetting by column names", function () {
        it("retrieves the col data created from an df with two columns", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4] };
            let df = new DataFrame(data);
            assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
        });
        it("retrieves the column data from an df with three columns", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
            assert.deepEqual(df["sum"].values, [20.3, 30.456, 40.90, 90.1]);
        });

        it("Set column count by subseting", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            df["alpha"] = ["E", "F", "G", "H"]
            assert.deepEqual(df["alpha"].values, ["E", "F", "G", "H"]);
            assert.deepEqual(df.values[0], ['E', 1, 20.3]);
            assert.deepEqual(df.dtypes, ["string", "int32", "float32",]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
            assert.deepEqual(df["sum"].values, [20.3, 30.456, 40.90, 90.1]);
        });

        it("Correct dtype is set after setting a column by subseting", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            df["alpha"] = [2.4, 5.6, 32.5, 1]

            assert.deepEqual(df["alpha"].values, [2.4, 5.6, 32.5, 1]);
            assert.deepEqual(df.values[0], [2.4, 1, 20.3]);
            assert.deepEqual(df.values[1], [5.6, 2, 30.456]);
            assert.deepEqual(df.values[2], [32.5, 3, 40.90]);
            assert.deepEqual(df.values[3], [1, 4, 90.1]);

            df["count"] = ["A", "B", "C", "D"]
            assert.deepEqual(df["count"].values, ["A", "B", "C", "D"]);
            assert.deepEqual(df.dtypes, ["float32", "string", "float32",]);
        });

        it("retrieves the col data created from an df with two columns in low memory mode", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4] };
            let df = new DataFrame(data, { lowMemoryMode: true });
            assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
        });
        it("retrieves the column data from an df with threee columns in low memory mode", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data, { lowMemoryMode: true });
            assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
            assert.deepEqual(df["sum"].values, [20.3, 30.456, 40.90, 90.1]);
        });

        it("Set column count by subseting (low memory mode) ", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data, { lowMemoryMode: true });
            df["alpha"] = ["E", "F", "G", "H"]
            assert.deepEqual(df["alpha"].values, ["E", "F", "G", "H"]);
            assert.deepEqual(df.values[0], ['E', 1, 20.3]);
            assert.deepEqual(df.dtypes, ["string", "int32", "float32",]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
            assert.deepEqual(df["sum"].values, [20.3, 30.456, 40.90, 90.1]);
        });

        it("Correct dtype is set after setting a column by subseting (low memory mode) ", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data, { lowMemoryMode: true });
            df["alpha"] = [2.4, 5.6, 32.5, 1]
            assert.deepEqual(df["alpha"].values, [2.4, 5.6, 32.5, 1]);
            assert.deepEqual(df.values[0], [2.4, 1, 20.3]);
            assert.deepEqual(df.values[1], [5.6, 2, 30.456]);
            assert.deepEqual(df.values[2], [32.5, 3, 40.90]);
            assert.deepEqual(df.values[3], [1, 4, 90.1]);
            assert.deepEqual(df.dtypes, ["float32", "int32", "float32",]);
        });
    })

    describe("addColumn", function () {
        it("Add new array values to DataFrame works", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            const newdf = df.addColumn({ column: "new_column", values: ["a", "b", "c", "d"] });
            assert.deepEqual(newdf["new_column"].values, ["a", "b", "c", "d"]);
            assert.deepEqual(newdf.columns, ["alpha", "count", "sum", "new_column"]);
            assert.deepEqual(newdf.dtypes, ["string", "int32", "float32", "string"]);
            assert.deepEqual(newdf.index, [0, 1, 2, 3]);
        });
        it("Add new array values to DataFrame inplace works", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            df.addColumn({ column: "new_column", values: ["a", "b", "c", "d"], inplace: true });
            assert.deepEqual(df["new_column"].values, ["a", "b", "c", "d"]);
            assert.deepEqual(df.columns, ["alpha", "count", "sum", "new_column"]);
            assert.deepEqual(df.dtypes, ["string", "int32", "float32", "string"]);
            assert.deepEqual(df.index, [0, 1, 2, 3]);
        });
        it("Add new Series to DataFrame works", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            const newdf = df.addColumn({ column: "new_column", values: new Series(["a", "b", "c", "d"]) });
            assert.deepEqual(newdf["new_column"].values, ["a", "b", "c", "d"]);
            assert.deepEqual(newdf.columns, ["alpha", "count", "sum", "new_column"]);
            assert.deepEqual(newdf.dtypes, ["string", "int32", "float32", "string"]);
            assert.deepEqual(newdf.index, [0, 1, 2, 3]);
        });
        it("Correct column data is set", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let df = new DataFrame(data);
            df.addColumn({ column: "new_column", values: ["a", "b", "c", "d"], inplace: true });
            assert.deepEqual(df["new_column"].values, ["a", "b", "c", "d"]);
            assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
            assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
            assert.deepEqual(df["sum"].values, [20.3, 30.456, 40.90, 90.1]);
        });
        it("throw error for wrong column lenght", function () {
            const data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            const df = new DataFrame(data);

            assert.throws(function () {
                df.addColumn({ column: "new_column", values: new Series(["a", "b", "c"]) }),
                    Error,
                    'ParamError: Column data length mismatch. You provided data with length 3 but Ndframe has column of lenght 4'
            })

        });
        it("Ensure add column does not mutate parent when not in place", function () {
            const data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            const df = new DataFrame(data);
            const dfNew = df.addColumn({ column: "new_column", values: ["a", "b", "c", "d"] });
            assert.notDeepEqual(df, dfNew)
            // assert.deepEqual(df["new_column"].values, ["a", "b", "c", "d"]);
            // assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
            // assert.deepEqual(df["count"].values, [1, 2, 3, 4]);
            // assert.deepEqual(df["sum"].values, [20.3, 30.456, 40.90, 90.1]);
        });
    })

    //     describe("to_csv", function () {
    //         afterEach(function () {
    //             // Clean up generated file
    //             fs.unlinkSync(testCSVPath);
    //         });

    //         it("save dataframe to CSV file", async function () {
    //             const data = [[1, 2, 3], [4, 5, 6]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             await df.to_csv(testCSVPath);
    //             assert.isTrue(fs.existsSync(testCSVPath));
    //         });

    //         it("return dataframe csv string", async function () {
    //             const data = [[1, 2, 3], [4, 5, 6]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const csvContent = await df.to_csv(testCSVPath);
    //             assert.deepEqual(csvContent, "A,B,C\n1,2,3\n4,5,6\n");
    //         });

    //     });

    describe("drop", function () {
        it("throw error for wrong column name", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () {
                df.drop({ columns: [3] });
            },
                Error,
                'ParamError: specified column "3" not found in columns');
        });
        it("throw error for wrong row index", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () { df.drop({ index: [10] }); },
                Error, 'ParamError: specified index "10" not found in indices');
        });

        it("drop a column inplace", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            df.drop({ columns: ["C", "B"], inplace: true });
            assert.deepEqual(df.columns, ["A"]);
            assert.deepEqual(df.values, [[1], [4]]);
            assert.deepEqual(df["A"].values, [1, 4]);
            assert.deepEqual(df.dtypes, ["int32"]);
        });
        it("drop a column inplace in low memory mode", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, config: { lowMemoryMode: true } });
            df.drop({ columns: ["C", "B"], inplace: true });
            assert.deepEqual(df.columns, ["A"]);
            assert.deepEqual(df.values, [[1], [4]]);
            assert.deepEqual(df["A"].values, [1, 4]);
            assert.deepEqual(df.dtypes, ["int32"]);
        });
        it("drop a scalar column inplace", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            df.drop({ columns: "C", inplace: true });
            assert.deepEqual(df.columns, ["A", "B"]);
            assert.deepEqual(df.values, [[1, 2], [4, 5]]);
            assert.deepEqual(df["A"].values, [1, 4]);
            assert.deepEqual(df["B"].values, [2, 5]);
        });
        it("check if data is updated after column is dropped", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            df.drop({ columns: ["C"], axis: 1, inplace: true });
            const new_data = [[1, 2], [4, 5]];
            assert.deepEqual(df.values, new_data);
            assert.deepEqual(df.dtypes.length, 2);

        });

        it("check if data is updated after row is dropped", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const dfNew = new DataFrame(data, { columns: cols });
            const df = dfNew.drop({ index: [0] });
            const new_data = [[4, 5, 6]];
            assert.deepEqual(df.values, new_data);
            assert.deepEqual(df.dtypes, ["int32", "int32", "int32"]);
            assert.deepEqual(df["A"].values, [4]);
            assert.deepEqual(df["B"].values, [5]);
            assert.deepEqual(df["C"].values, [6]);
            assert.deepEqual(df.columns, cols);
            assert.notDeepEqual(dfNew, df)
        });
        it("check if data is updated after row is dropped (inplace)", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            df.drop({ index: [0], inplace: true });
            const new_data = [[4, 5, 6]];
            assert.deepEqual(df.values, new_data);
            assert.deepEqual(df.dtypes, ["int32", "int32", "int32"]);
            assert.deepEqual(df["A"].values, [4]);
            assert.deepEqual(df["B"].values, [5]);
            assert.deepEqual(df["C"].values, [6]);
            assert.deepEqual(df.columns, cols);
        });
        it("check if new dataframe is properly created after column is dropped (not-in-inplace)", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const df_drop = df.drop({ columns: ["C"], axis: 1, inplace: false });

            const expected_data = [[1, 2], [4, 5]];
            const expected_cols = ["A", "B"];
            const expected_df = new DataFrame(expected_data, { columns: expected_cols });
            assert.deepEqual(df_drop.values, expected_df.values);
        });
        it("check that the dtype is updated after column drop", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            df.drop({ columns: ["A"], axis: 1, inplace: true });
            const dtype = ['int32', 'int32'];
            assert.deepEqual(df.dtypes, dtype);
        });
        it("drop row by single string labels", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 34, 5]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["a", "b", "c"] });
            df.drop({ index: ["a"], inplace: true });
            const new_data = [[4, 5, 6], [20, 34, 5]];
            assert.deepEqual(df.values, new_data);
        });
        it("drop row by two or more string labels", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 34, 5], [2, 3.4, 5], [2.0, 340, 5]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["a", "b", "c", "d", "e"] });
            df.drop({ index: ["a", "b"], inplace: true });
            const new_data = [[20, 34, 5], [2, 3.4, 5], [2.0, 340, 5]];
            assert.deepEqual(df.values, new_data);

        });
        it("drop row by two or more string labels with numeric index", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 34, 5], [2, 3.4, 5], [2.0, 340, 5]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["a", "b", 1, "d", "e"] });
            df.drop({ index: [1, "b"], inplace: true });
            const new_data = [[1, 2, 3], [2, 3.4, 5], [2.0, 340, 5]]
            assert.deepEqual(df.values, new_data);
            assert.deepEqual(df.index, ["a", "d", "e"]);

        });
    });

    describe("head", function () {
        it("Gets the first n rows in a DataFrame", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.deepEqual(df.head(2).values, [[1, 2, 3], [4, 5, 6]]);
        });
        it("Throws error if row specified is greater than values", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(() => df.head(10), Error,
                "ParamError: Number of rows cannot be greater than available rows in data");
        });
        it("Throws error if row specified is less than 0", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(() => df.head(-1), Error,
                "ParamError: Number of rows cannot be less than 1");
        });

    });

    describe("tail", function () {
        it("Prints the last n rows of a DataFrame", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.deepEqual(df.tail(2).values, [[20, 30, 40], [39, 89, 78]]);
        });
        it("Throws error if row specified is greater than values", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(() => df.tail(10), Error,
                "ParamError: Number of rows cannot be greater than available rows in data");
        });
        it("Throws error if row specified is less than 0", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(() => df.tail(-1), Error,
                "ParamError: Number of rows cannot be less than 1");
        });
        it("Return last 3 row index in a DataFrame", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.deepEqual(df.tail(2).index, [2, 3]);
        });
        it("Check print format on head call", function () {
            const data = [[1, 2, 34, 5, 0, 6, 4, 5, 6, 7], [20, 30, 40, 39, 89, 78, 45, 56, 56, 45]];
            const df = new DataFrame(data);
            assert.deepEqual(df.tail(2).values, [[1, 2, 34, 5, 0, 6, 4, 5, 6, 7], [20, 30, 40, 39, 89, 78, 45, 56, 56, 45]]);
        });
    });

    describe("sample", function () {
        it("Samples n number of random elements from a DataFrame", async function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const expected = [[1, 2, 3], [20, 30, 40]];
            const values = (await df.sample(2)).values;
            assert.deepEqual(values, expected);
        });
        it("Throw error if n is greater than lenght of Dataframe", async function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            try {
                await df.sample(100);
            } catch (e: any) {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.eql('ParamError: Sample size cannot be bigger than number of rows');
            }
        });
        it("Throw error if n is less than 0", async function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            try {
                await df.sample(-2);
            } catch (e: any) {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.eql('ParamError: Sample size cannot be less than 1');
            }
        });
        it("Throw error if n is 0", async function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            try {
                await df.sample(0);
            } catch (e: any) {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.eql('ParamError: Sample size cannot be less than 1');
            }
        });
        it("Seed works and random number is reproducible", async function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const values1 = (await df.sample(2, { seed: 453 })).values;
            const values2 = (await df.sample(2, { seed: 453 })).values;
            const values3 = (await df.sample(2, { seed: 1 })).values;

            assert.deepEqual(values1, values2);
            assert.notDeepEqual(values1, values3);

        });
    });

    describe("loc", function () {

        it("throw error for wrong column name", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () {
                df.loc({ "rows": [0, 1], "columns": ["A", "D"] });
            },
                Error,
                "IndexError: Specified column (D) not found");
        });

        it(`check data after selecting { "rows": ["0", "1"], "columns": ["B", "C"] }`, function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["0", "1"] });

            const colDf = df.loc({ "rows": ["0", "1"], "columns": ["B", "C"] });
            const expected = [[2, 3], [5, 6]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after selecting row index", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: [0, 1] });

            const colDf = df.loc({ "rows": ["1"], "columns": ["B"] });
            const expected = [[5]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after selecting with single row index", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["0", "1"] });

            const colDf = df.loc({ "rows": [`"1"`], "columns": ["B", "C"] });
            const expected = [[5, 6]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after selecting with single column index", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["0", "1"] });

            const colDf = df.loc({ "rows": [`"0"`], "columns": ["A"] });
            const expected = [[1]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after row and column slice", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["0", "1", "2", "3"] });

            const colDf = df.loc({ "rows": [`'0':'2'`], "columns": ["B:C"] });
            const expected = [[2], [5]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after row slice", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.loc({ "rows": [`0:2`], "columns": ["B", "C"] });
            const expected = [[2, 3], [5, 6]];

            assert.deepEqual(colDf.values, expected);

        });
        it(`check data after column slice ["A:C"]`, function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols, index: ["0", "1", "2", "3"] });

            const colDf = df.loc({ "rows": ["0", "1"], "columns": ["A:C"] });
            const expected = [[1, 2], [4, 5]];
            assert.deepEqual(colDf.values, expected);

        });
        it("check data after numeric row slice", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.loc({ "rows": [0, 1], "columns": ["A:C"] });
            const expected = [[1, 2], [4, 5]];
            assert.deepEqual(colDf.values, expected);

        });
        it("loc by single string index", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };

            const df = new DataFrame(data, { index: ["a", "b", "c", "d"] });
            const subDf = df.loc({ rows: [`"a"`], columns: ["Name", "Count"] });
            const expected = [['Apples', 21]];
            assert.deepEqual(subDf.values, expected);

        });

        it("loc by slice string index", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };

            const df = new DataFrame(data, { index: ["a", "b", "c", "d"] });
            const subDf = df.loc({ rows: [`"a":"c"`], columns: ["Name", "Count"] });
            const expected = [["Apples", 21], ["Mango", 5]];
            assert.deepEqual(subDf.values, expected);

        });


    });

    describe("DataFrame iloc", function () {

        it("throw error for wrong row index (array format)", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () {
                df.iloc({ "rows": [0, 1, 3] });
            },
                Error,
                "Invalid row parameter: Specified index 3 cannot be bigger than index length 2");
        });

        it("throw error for wrong row index (string slice format)", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () {
                df.iloc({ "rows": ["1:5"] });
            },
                Error,
                "row slice [end] index cannot be bigger than 2");
        });

        it("throw error for wrong column index (array format)", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () {
                df.iloc({ "columns": [1, 4] });
            },
                Error,
                "Invalid column parameter: Specified index 4 cannot be bigger than index length 3");
        });

        it("throw error for wrong column index (string slice format)", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            assert.throws(function () {
                df.iloc({ "columns": ["A:C"] });
            },
                Error,
                "Invalid column split parameter. Split parameter must be a number");
        });

        it("iloc works for {row: [0, 1], column: [1, 2]}", function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.iloc({ "rows": [0, 1], "columns": [1, 2] });
            const expected = [[2, 3], [5, 6]];

            assert.deepEqual(colDf.values, expected);

        });

        it(`iloc works for { "rows": [1], "columns": [1, 2] }`, function () {
            const data = [[1, 2, 3], [4, 5, 6]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const colDf = df.iloc({ "rows": [1], "columns": [1, 2] });
            const expected = [[5, 6]];
            assert.deepEqual(colDf.values, expected);

        });
        it("check data after row and column slice", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.iloc({ "rows": ["0:2"], "columns": ["1:2"] });
            const expected = [[2], [5]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after row slice", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.iloc({ "rows": ["0:2"], "columns": [1, 2] });
            const expected = [[2, 3], [5, 6]];

            assert.deepEqual(colDf.values, expected);

        });
        it("check data after column slice", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.iloc({ "rows": [0, 1, 2], "columns": ["1:2"] });
            const expected = [[2], [5], [30]];
            assert.deepEqual(colDf.values, expected);

        });
        it("Return all columns if columns parameter is not specified", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.iloc({ "rows": [0, 1, 2] });
            const expected = [[1, 2, 3], [4, 5, 6], [20, 30, 40]];
            assert.deepEqual(colDf.values, expected);

        });
        it("Return all rows if rows parameter is not specified", function () {
            const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });

            const colDf = df.iloc({ "columns": ["1:2"] });
            const expected = [[2], [5], [30], [89]];
            assert.deepEqual(colDf.values, expected);

        });
        it("column slice starting with 0 and returning a single result works", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250],
                "index": [1, 2, 3, 4]
            };
            const df = new DataFrame(data);
            const subDf = df.iloc({ rows: ["2:3"], columns: ["0:1"] });
            const result = [["Banana"]];
            assert.deepEqual(subDf.values, result);

        });
        it("column slice with format '0:' works", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            const subDf = df.iloc({ rows: ["2:3"], columns: ["0:"] });
            const result = [["Banana", 30, 40]];
            assert.deepEqual(subDf.values, result);

        });
        it("column slice with format ':2' works", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            const subDf = df.iloc({ rows: ["2:3"], columns: [":2"] });
            const result = [["Banana", 30]];
            assert.deepEqual(subDf.values, result);

        });
        it("row slice with format ':2' works", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            const subDf = df.iloc({ rows: [":2"], columns: [":1"] });
            const result = [['Apples'], ['Mango']];
            assert.deepEqual(subDf.values, result);

        });
        it("row slice with format '1:' works", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            const subDf = df.iloc({ rows: [":2"], columns: [":2"] });
            const result = [['Apples', 21], ['Mango', 5]];
            assert.deepEqual(subDf.values, result);

        });

    });

    describe("toString", function () {
        it("Prints a DataFrame to console", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            df.print()
        })
        it("User config works when printing a DataFrame to console", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250]
            };
            const df = new DataFrame(data, {
                config: {
                    tableDisplayConfig: {
                        header: {
                            alignment: 'center',
                            content: 'THE HEADER\nThis is the table about something',
                        },
                    },
                }
            });
            df.print()
        })
        it("Long columns are properly truncated before printing", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10],
                "Price": [200, 300, 40, 250],
                "Name2": ["Apples", "Mango", "Banana", "Pear"],
                "Count2": [21, 5, 30, 10],
                "Price2": [200, 300, 40, 250],
                "Name3": ["Apples", "Mango", "Banana", "Pear"],
                "Count3": [21, 5, 30, 10],
                "Price3": [200, 300, 40, 250],
                "Name4": ["Apples", "Mango", "Banana", "Pear"],
                "Count4": [21, 5, 30, 10],
                "Price4": [200, 300, 40, 250],
                "Name5": ["Apples", "Mango", "Banana", "Pear"],
                "Count5": [21, 5, 30, 10],
                "Price6": [200, 300, 40, 250],
                "Name7": ["Apples", "Mango", "Banana", "Pear"],
                "Count7": [21, 5, 30, 10],
                "Price7": [200, 300, 40, 250],
                "Name8": ["Apples", "Mango", "Banana", "Pear"],
                "Count8": [21, 5, 30, 10],
                "Price8": [200, 300, 40, 250],
                "Name9": ["Apples", "Mango", "Banana", "Pear"],
                "Count9": [21, 5, 30, 10],
                "Price9": [200, 300, 40, 250],
                "Name10": ["Apples", "Mango", "Banana", "Pear"],
                "Count10": [21, 5, 30, 10],
                "Price10": [200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            df.print()
        })

        it("Long rows are automatically truncated", function () {
            const data = {
                "Name": ["Apples", "Mango", "Banana", "Pear", "Apples", "Mango", "Banana", "Pear", "Apples", "Mango", "Banana", "Pear"],
                "Count": [21, 5, 30, 10, 21, 5, 30, 10, 21, 5, 30, 10],
                "Price": [200, 300, 40, 250, 200, 300, 40, 250, 200, 300, 40, 250]
            };
            const df = new DataFrame(data);
            df.print()
        })
    })

    describe("add", function () {
        it("Return Addition of DataFrame with a single Number", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.add(2).values, [[2, 4, 6], [362, 182, 362]]);
        });
        it("Return addition of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            assert.deepEqual(df.add(sf).values, [[1, 4, 5], [361, 182, 361]]);
        });
        it("Return addition of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = [1, 2, 1]
            const df = new DataFrame(data);
            assert.deepEqual(df.add(sf).values, [[1, 4, 5], [361, 182, 361]]);
        });
        it("Return addition of a DataFrame with a Series along axis 0", function () {
            const data = [[0, 2, 4],
            [360, 180, 360]];
            const sf = new Series([1, 2]);
            const df = new DataFrame(data);
            assert.deepEqual(df.add(sf, { axis: 0 }).values, [[1, 3, 5], [362, 182, 362]]);
        });
        it("Return addition of a DataFrame with a Array along axis 0", function () {
            const data = [[0, 2, 4],
            [360, 180, 360]];
            const sf = [1, 2]
            const df = new DataFrame(data);
            assert.deepEqual(df.add(sf, { axis: 0 }).values, [[1, 3, 5], [362, 182, 362]]);
        });
        it("Return addition of a DataFrame with a DataFrame along default axis 1", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.add(df2).values, [[1, 4, 8], [370, 185, 360]]);
        });
        it("Return addition of a DataFrame with a DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.add(df2).values, [[1, 4, 8], [370, 185, 360]]);
        });
        it("Return addition of a DataFrame with a Series along default axis 1 (inplace)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            df.add(sf, { axis: 1, inplace: true })
            assert.deepEqual(df.values, [[1, 4, 5], [361, 182, 361]]);
        });

        it("Return addition of a DataFrame with a DataFrame along axis 0 (inplace)", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            df1.add(df2, { axis: 0, inplace: true })
            assert.deepEqual(df1.values, [[1, 4, 8], [370, 185, 360]]);
        });
        it("Adds work for DataFrame with undefined and null values", function () {
            const df1 = new DataFrame([[undefined, 2, 4], [360, NaN, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            df1.add(df2, { axis: 0, inplace: true })
            assert.deepEqual(df1.values, [[NaN, 4, 8], [370, NaN, 360]]);
        });

    });

    describe("sub", function () {
        it("Return subtraction of DataFrame with a single Number", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.sub(2).values, [[-2, 0, 2], [358, 178, 358]]);
        });
        it("Return subtraction of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            assert.deepEqual(df.sub(sf).values, [[-1, 0, 3], [359, 178, 359]]);
        });
        it("Return subtraction of a DataFrame with a Series along axis 0", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2]);
            const df = new DataFrame(data);
            assert.deepEqual(df.sub(sf, { axis: 0 }).values, [[-1, 1, 3], [358, 178, 358]]);
        });
        it("Return subtraction of a DataFrame with a DataFrame along default axis 1", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.sub(df2).values, [[-1, 0, 0], [350, 175, 360]]);
        });
        it("Return subtraction of a DataFrame with a DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.sub(df2).values, [[-1, 0, 0], [350, 175, 360]]);
        });

    });

    describe("mul", function () {
        it("Return multiplication of DataFrame with a single Number", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.mul(2).values, [[0, 4, 8], [720, 360, 720]]);
        });
        it("Return multiplication of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            assert.deepEqual(df.mul(sf).values, [[0, 4, 4], [360, 360, 360]]);
        });
        it("Return multiplication of a DataFrame with a Series along axis 0", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2]);
            const df = new DataFrame(data);
            assert.deepEqual(df.mul(sf, { axis: 0 }).values, [[0, 2, 4], [720, 360, 720]]);
        });
        it("Return multiplication of a DataFrame with a DataFrame along default axis 1", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.mul(df2).values, [[0, 4, 16], [3600, 900, 0]]);
        });
        it("Return multiplication of a DataFrame with a DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.mul(df2, { axis: 0 }).values, [[0, 4, 16], [3600, 900, 0]]);
        });

    });

    describe("div", function () {
        it("Return division of DataFrame with a single Number", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.div(2).values, [[0, 1, 2], [180, 90, 180]]);
        });
        it("Return division of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            assert.deepEqual(df.div(sf).values, [[0, 1, 4], [360, 90, 360]]);
        });
        it("Return division of a DataFrame with a Series along axis 0", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2]);
            const df = new DataFrame(data);
            assert.deepEqual(df.div(sf, { axis: 0 }).values, [[0, 2, 4], [180, 90, 180]]);
        });
        it("Return division of a DataFrame with a DataFrame along default axis 1", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.div(df2).values, [[0, 1, 1], [36, 36, Infinity]]);
        });
        it("Return division of same DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            assert.deepEqual(df1.div(df1).values, [[NaN, 1, 1], [1, 1, 1]]);
        });
        it("Return division of a DataFrame with a DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.div(df2).values, [[0, 1, 1], [36, 36, Infinity]]);
        });

    });

    describe("pow", function () {
        it("Return exponential of DataFrame with a single Number", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.pow(2).values, [[0, 4, 16], [129600, 32400, 129600]]);
        });
        it("Return exponential of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            assert.deepEqual(df.pow(sf).values, [[0, 4, 4], [360, 32400, 360]]);
        });
        it("Return exponential of a DataFrame with a Series along axis 0", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const sf = new Series([1, 2]);
            const df = new DataFrame(data);
            assert.deepEqual(df.pow(sf, { axis: 0 }).values, [[0, 2, 4], [129600, 32400, 129600]]);
        });
        it("Return exponential of a DataFrame with another DataFrame along default axis 1", function () {
            const df1 = new DataFrame([[0, 2, 4], [3, 10, 4]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.pow(df2).values, [[0, 4, 256], [59049, 100000, 1]]);
        });
        it("Return exponential of a DataFrame with another DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [3, 10, 4]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.pow(df2, { axis: 0 }).values, [[0, 4, 256], [59049, 100000, 1]]);
        });

    });

    describe("mod", function () {
        it("Return modulus of DataFrame with a single Number", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.mod(2).values, [[0, 0, 0], [0, 0, 0]]);
        });
        it("Return modulus of a DataFrame with a Series along default axis 1", function () {
            const data = [[0, 2, 4], [31, 15, 360]];
            const sf = new Series([1, 2, 1]);
            const df = new DataFrame(data);
            assert.deepEqual(df.mod(sf).values, [[0, 0, 0], [0, 1, 0]]);
        });
        it("Return modulus of a DataFrame with a Series along axis 0", function () {
            const data = [[0, 2, 4], [31, 15, 360]];
            const sf = new Series([1, 2]);
            const df = new DataFrame(data);
            assert.deepEqual(df.mod(sf, { axis: 0 }).values, [[0, 0, 0], [1, 1, 0]]);
        });
        it("Return modulus of a DataFrame with a DataFrame along default axis 1", function () {
            const df1 = new DataFrame([[0, 2, 4], [31, 15, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.mod(df2).values, [[0, 0, 0], [1, 0, NaN]]);
        });
        it("Return modulus of a DataFrame with a DataFrame along axis 0", function () {
            const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
            const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
            assert.deepEqual(df1.mod(df2).values, [[0, 0, 0], [0, 0, NaN]]);
        });

    });

    describe("mean", function () {
        it("Returns the mean of a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4],
            [360, 180, 360]];
            const df = new DataFrame(data, { columns: ["col1", "col2", "col3"] });
            assert.deepEqual(df.mean().values, [2, 300]);
        });
        it("Return mean of a DataFrame along axis 1 (column)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.mean({ "axis": 1 }).values, [2, 300]);
        });
        it("Removes NaN before calculating mean of a DataFrame", function () {
            const data = [[11, 20, 3],
            [NaN, 15, 6],
            [2, 30, 40],
            [2, 89, 78]];
            const df = new DataFrame(data);
            assert.deepEqual(df.mean({ "axis": 1 }).values, [11.333333333333334, 10.5, 24, 56.333333333333336]);
        });
        it("Return mean of a DataFrame along axis 0 (column)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.mean({ "axis": 0 }).values, [180, 91, 182]);
        });
        it("Removes NaN before calculating mean of a DataFrame along axis 0 (column)", function () {
            const data = [[11, 20, 3],
            [NaN, 15, 6],
            [2, 30, 40],
            [2, 89, 78]];
            const df = new DataFrame(data);
            assert.deepEqual(df.mean({ "axis": 0 }).values, [5, 38.5, 31.75]);
        });
        it("Throws error on wrong axis specified", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.throws(() => df.mean({ "axis": 2 }), Error, "ParamError: Axis must be 0 or 1");
        })
    });

    describe("median", function () {
        it("Returns the median of a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.median().values, [2, 360]);
        });
        it("Return median of a DataFrame along axis 0 (row)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.median({ "axis": 0 }).values, [180, 91, 182]);
        });

    });

    describe("mode", function () {
        it("Returns the mode of a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4, 2], [360, 180, 360]]
            const df = new DataFrame(data)
            assert.deepEqual(df.mode().values, [2, 360])
        })
        it("Returns the mode of a DataFrame with keep set to 1", function () {
            const data = [[0, 2, 4, 2, 4], [360, 180, 360, 360]]
            const df = new DataFrame(data)
            assert.deepEqual(df.mode({ keep: 1 }).values, [4, 360])
        })
        it("Returns mode of a DataFrame along axis 0 (row)", function () {
            const data = [[0, 2, 4],
            [360, 180, 360],
            [0, 2, 360]]
            const df = new DataFrame(data)
            assert.deepEqual(df.mode({ "axis": 0 }).values, [0, 2, 360])
        })
        it("Returns mode of a DataFrame along axis 0 for objects", function () {
            const data = { "col1": [0, 2, 4, 0], "col2": [360, 180, 360, 360] }
            const df = new DataFrame(data)
            assert.deepEqual(df.mode({ "axis": 0 }).values, [0, 360])
        })

    })

    describe("min", function () {
        it("Returns the minimum values in a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.min().values, [0, 180]);
        });
        it("Returns the minimum values of a DataFrame along axis 0 (row)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.min({ "axis": 0 }).values, [0, 2, 4]);
        });
        it("Returns the minimum values of a DataFrame along axis 0 (row) using TFJS", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data, { config: { useTfjsMathFunctions: true } });
            assert.deepEqual(df.min({ "axis": 0 }).values, [0, 2, 4]);
        });
        it("Returns the minimum values in a DataFrame-Default axis 1 using TFJS", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data, { config: { useTfjsMathFunctions: true } });
            assert.deepEqual(df.min().values, [0, 180]);
        });

    });

    describe("max", function () {
        it("Returns the maximum values in a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.max().values, [4, 360]);
        });
        it("Returns the maximum values of a DataFrame along axis 0 (row)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.max({ "axis": 0 }).values, [360, 180, 360]);
        });

    });

    describe("std", function () {
        it("Returns the standard deviations of values in a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.std().values, [2, 103.92304845413264]);
        });
        it("Return the standard deviations of values of a DataFrame along axis 0 (row)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.std({ axis: 0 }).values, [254.55844122715712, 125.86500705120545, 251.7300141024109]);
        });


    });

    describe("var", function () {
        it("Returns the variance of values in a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.var().values, [4, 10800]);
        });
        it("Return the variance of values of a DataFrame along axis 0 (row)", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.var({ axis: 0 }).values, [64800, 15842, 63368]);
        });


    });

    describe("describe", function () {
        it("Returns descriptive statistics of columns in a DataFrame created from an array", function () {
            const data = [[0, 2, 4, "a"],
            [360, 180, 360, "b"],
            [2, 4, 6, "c"]];

            const df = new DataFrame(data);
            const res = [[3, 3, 3], [120.66666666666667, 62, 123.33333333333333],
            [207.27115895206774, 102.19589032832974, 204.961785055979],
            [0, 2, 4], [2, 4, 6],
            [360, 180, 360],
            [42961.33333333333, 10444, 42009.333333333336]];
            assert.deepEqual(df.describe().values, res);
        });
        it("Returns descriptive statistics of columns in a DataFrame created from an Object", function () {
            const data = {
                "col1": [0, 2, 4],
                "col2": [360, 180, 360],
                "col3": [2, 4, 6],
                "col4": ["boy", "girl", "man"],
                "col5": ["apple", "car", "bee"]
            };
            const df = new DataFrame(data);

            const res = [[3, 3, 3], [2, 300, 4],
            [2, 103.92304845413264, 2],
            [0, 180, 2], [2, 360, 4],
            [4, 360, 6],
            [4, 10800, 4]];
            assert.deepEqual(df.describe().values, res);
        });

    });

    describe("count", function () {
        it("Returns the count of non-nan values in a DataFrame (Default axis is [1:column])", function () {
            const data = [[0, 2, 4],
            [360, 180.1, 360.11],
            [NaN, 2, 4],
            [360, undefined, 360]];
            const df = new DataFrame(data);
            assert.deepEqual(df.count().values, [3, 3, 2, 2]);
        });
        it("Return the count of non NaN values of a DataFrame along axis 0", function () {
            const data = [[0, 2, 4, NaN],
            [360, undefined, 360, 70]];
            const df = new DataFrame(data);
            assert.deepEqual(df.count({ axis: 0 }).values, [2, 1, 2, 1]);
        });

    });

    describe("round", function () {
        it("Rounds values in a DataFrame to 3dp", function () {
            const data = [[10.1, 2.092, 4.23], [360.232244, 180.0190290, 36.902612]];
            const df = new DataFrame(data);
            const expected = [[10.1, 2.092, 4.23], [360.232, 180.0190, 36.903]];
            assert.deepEqual(df.round(3).values, expected);
        });
        it("Rounds values in a DataFrame to 1dp, inplace", function () {
            const data = [[10.1, 2.092, 4.23], [360.232244, 180.0190290, 36.902612]];
            const df = new DataFrame(data);
            const expected = [[10.1, 2.1, 4.2], [360.2, 180.0, 36.9]];
            df.round(1, { inplace: true })
            assert.deepEqual(df.values, expected);
        });
        it("Rounds values in a DataFrame to 3dp with missing values", function () {
            const data = [[10.1, 2.092, NaN], [360.232244, undefined, 36.902612]];
            const df = new DataFrame(data);
            const expected = [[10.1, 2.092, NaN], [360.232, undefined, 36.903]];
            assert.deepEqual(df.round(3, { axis: 0 }).values, expected);
        });

    });

    //     describe("sort_values", function () {
    //         it("Sort values in DataFrame by specified column in ascending order (Default)", function () {
    //             const data = [[0, 2, 4, "a"],
    //             [360, 180, 360, "b"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             df.sort_values({ "by": "col1", inplace: true, ascending: true });
    //             const expected = [[0, 2, 4, "a"], [2, 4, 6, "c"], [360, 180, 360, "b"]];
    //             assert.deepEqual(df.values, expected);
    //             assert.deepEqual(df.index, [0, 2, 1]);

    //         });

    //         it("Sort values in DataFrame by specified column in ascending order (Default)", function () {
    //             const data = [[0, 2, 4, "a"],
    //             [360, 180, 1, "b"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const df_sort = df.sort_values({ "by": "col3" });
    //             const expected = [[360, 180, 1, "b"], [0, 2, 4, "a"], [2, 4, 6, "c"]];
    //             assert.deepEqual(df_sort.values, expected);
    //             assert.deepEqual(df_sort.index, [1, 0, 2]);

    //         });
    //         it("Sort values in DataFrame by specified column in descending order", function () {
    //             const data = [[0, 2, 4, "a"],
    //             [360, 180, 360, "b"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const expected = [[360, 180, 360, "b"], [2, 4, 6, "c"], [0, 2, 4, "a"]];
    //             assert.deepEqual(df.sort_values({ "by": "col1", "ascending": false }).values, expected);
    //         });

    //         it("Sort values in DataFrame by specified column in descending order (second col)", function () {
    //             const data = [[0, 2, 4, "a"],
    //             [360, 180, 1, "b"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const expected = [[2, 4, 6, "c"], [0, 2, 4, "a"], [360, 180, 1, "b"]];
    //             assert.deepEqual(df.sort_values({ "by": "col3", "ascending": false }).values, expected);
    //         });
    //         it("Sort values in DataFrame by specified column containing alpha(numeric) values", function () {
    //             const data = [[0, 2, 4, "a"],
    //             [360, 180, 1, "b"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const expected = [[2, 4, 6, 'c'], [360, 180, 1, 'b'], [0, 2, 4, 'a']];
    //             assert.deepEqual(df.sort_values({ "by": "col4", "ascending": false }).values, expected);
    //         });
    //         it("Sort duplicate DataGrame with duplicate columns", function () {

    //             const data = {
    //                 "A": [1, 2, 3, 4, 5, 3, 5, 6, 4, 5, 3, 4],
    //                 "B": [2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4]
    //             };

    //             const df = new DataFrame(data);
    //             const expected = [[1, 2],
    //             [2, 3],
    //             [3, 4],
    //             [3, 7],
    //             [3, 3],
    //             [4, 5],
    //             [4, 1],
    //             [4, 4],
    //             [5, 6],
    //             [5, 8],
    //             [5, 2],
    //             [6, 9]];
    //             assert.deepEqual(df.sort_values({ "by": "A", "ascending": true }).values, expected);
    //         });


    //     });

    describe("copy", function () {
        it("Makes a deep copy of DataFrame", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            const df_copy = df.copy();
            assert.deepEqual(df_copy.values, [[0, 2, 4], [360, 180, 360]]);
        });
        it("Confirms child copy modification does not affect parent DataFrame", function () {
            const data = [[0, 2, 4], [360, 180, 360]];
            const df = new DataFrame(data);
            const df_copy = df.copy();
            df_copy.addColumn({ column: "col_new", values: ["boy", "girl"], inplace: true });
            assert.notDeepEqual(df_copy.values, df.values);
            assert.notDeepEqual(df_copy, df);
        });

    });


    //     describe("set_index", function () {
    //         it("Sets the index of a DataFrame created from an Object", function () {
    //             const data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //             const df = new DataFrame(data);
    //             const df_new = df.set_index({ "key": ["one", "two", "three"] });
    //             assert.deepEqual(df_new.index, ["one", "two", "three"]);
    //         });
    //         it("Sets the index of a DataFrame from column name", function () {
    //             const data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //             const df = new DataFrame(data);
    //             const df_new = df.set_index({ "key": "alpha" });
    //             assert.deepEqual(df_new.index, ["A", "B", "C"]);
    //         });
    //         it("Sets the index of a DataFrame from column name", function () {
    //             const data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //             const df = new DataFrame(data);
    //             const df_new = df.set_index({ key: "alpha", drop: true });
    //             assert.deepEqual(df_new.index, ["A", "B", "C"]);
    //         });
    //         it("Sets the index of a DataFrame created from an Array", function () {
    //             const data = [[0, 2, 4], [360, 180, 360], [0, 2, 4], [360, 180, 360], [0, 2, 4]];
    //             const df = new DataFrame(data);
    //             df.set_index({ "key": ["one", "two", "three", "four", "five"], "inplace": true });
    //             assert.deepEqual(df.index, ["one", "two", "three", "four", "five"]);
    //         });

    //     });

    //     describe("reset_index", function () {
    //         it("Resets the index of a DataFrame created from an Object", function () {
    //             const data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //             const df = new DataFrame(data);
    //             const df_new = df.set_index({ "key": ["one", "two", "three"] });
    //             const df_reset = df_new.reset_index();
    //             assert.deepEqual(df_reset.index, [0, 1, 2]);
    //         });
    //         it("Resets the index of a DataFrame created from an Array", function () {
    //             const data = [[0, 2, 4], [360, 180, 360], [0, 2, 4], [360, 180, 360], [0, 2, 4]];
    //             const df = new DataFrame(data);
    //             df.set_index({ "key": ["one", "two", "three", "four", "five"], "inplace": true });
    //             df.reset_index(true);
    //             assert.deepEqual(df.index, [0, 1, 2, 3, 4]);
    //         });

    //     });


    //     // describe("apply", function () {
    //     //     it("Apply a function to all values of a DataFrame", function () {
    //     //         const data = [[0, 2, 4],
    //     //         [360, 180, 360],
    //     //         [0, 2, 4]]
    //     //         const df = new DataFrame(data)

    //     //         const apply_func = (x) => {
    //     //             return x + 1000
    //     //         }
    //     //         const expected = [[1000, 1002, 1004], [1360, 1180, 1360], [1000, 1002, 1004]]
    //     //         assert.deepEqual(df.apply(apply_func), expected)
    //     //     });

    //     //     it("Throws error on applying function to string columns", function () {
    //     //         const data = [[0, 2, "ab"],
    //     //         [360, 180, "mk"],
    //     //         [0, 2, "po"]]
    //     //         const df = new DataFrame(data)

    //     //         const apply_func = (x) => {
    //     //             return x + 1000
    //     //         }
    //     //         const expected = "Dtypes Error: columns dtypes must be numeric, got strings"
    //     //         assert.deepEqual(df.apply(apply_func), expected)
    //     //     });
    //     // });


    //     describe("query", function () {

    //         it("Get the DataFrame containing rows with the filtered column", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const query_df = df.query({ "column": "B", "is": ">=", "to": 5 });
    //             const query_data = [[4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             assert.deepEqual(query_df.values, query_data);
    //         });
    //         it("Get the Dataframe containing rows with the filtered column in String values", function () {
    //             const data = { "Abs": [20, 30, 47], "Count": [34, 4, 5], "country code": ["NG", "FR", "GH"] };
    //             const cols = ["Abs", "Count", "country code"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const query_df = df.query({ column: "country code", is: "==", to: "NG" });
    //             const query_data = [[20, 34, "NG"]];
    //             assert.deepEqual(query_df.values, query_data);
    //         });
    //         it("Print Error for value key not specified", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             assert.throws(function () { df.query({ "column": "B", "is": ">=" }); }, Error, "specify a value in param [to]");
    //         });
    //         it("Print Error for operator key not specified", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             assert.throws(function () { df.query({ "column": "B", "to": 5 }); }, Error, "specify an operator in param [is]");
    //         });

    //         it("Print Error for column key not specified", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             assert.throws(function () { df.query({ "is": ">=", "to": 5 }); }, Error, "specify the column");
    //         });
    //         it("Print Error for column name not in dataframe", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             assert.throws(function () { df.query({ "column": "D", "is": ">=", "to": 5 }); }, Error, "column D does not exist");
    //         });
    //         it("Confirms that query index are updated", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const df_query = df.query({ "column": "B", "is": ">=", "to": 5 });
    //             assert.deepEqual(df_query.index, [1, 2, 3]);
    //         });
    //         it("Confirms that columns data are updated inplace", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             df.query({ "column": "B", "is": ">=", "to": 5, inplace: true });
    //             assert.deepEqual(df.expected, [[4, 20, 39], [5, 30, 89], [6, 40, 78]]);
    //         });
    //         it("Confirms that query happens inplace", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             df.query({ "column": "B", "is": ">=", "to": 5, inplace: true });
    //             const query_data = [[4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             assert.deepEqual(df.values, query_data);
    //         });
    //         it("Confirms that query happens inplace and index are updated", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             df.query({ "column": "B", "is": ">=", "to": 5, inplace: true });
    //             assert.deepEqual(df.index, [1, 2, 3]);
    //         });
    //         it("Wrong query value", function () {
    //             const data = {
    //                 "A": [30, 1, 2, 3],
    //                 "B": [34, 4, 5, 6],
    //                 "C": [20, 20, 30, 40]
    //             };

    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             assert.throws(function () { df.query({ "column": "B", "is": ">", "to": 40 }); }, Error, "query returned empty data; is either 40 does not exist in column B");
    //         });

    //     });

    //     describe("addColumn", function () {
    //         it("Print the data, after changing a column data", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             const new_col = [1, 2, 3, 4];

    //             df.addColumn({ "column": "C", "value": new_col });

    //             const new_data = [[1, 2, 1], [4, 5, 2], [20, 30, 3], [39, 89, 4]];

    //             assert.deepEqual(df.values, new_data);
    //         });
    //         it("Print the Dataframe column names, after a new column is added ", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             const new_col = [1, 2, 3, 4];

    //             df.addColumn({ "column": "D", "value": new_col });

    //             const new_column = ["A", "B", "C", "D"];

    //             assert.deepEqual(df.column_names, new_column);
    //         });
    //         it("Print Error for column name not in keyword passed", function () {

    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const new_col = [1, 2, 3, 4];

    //             assert.throws(function () { df.addColumn({ "value": new_col }); }, Error, "column name not specified");
    //         });
    //         it("Check if new column value length is the same with Dataframe length", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const new_col = [1, 2, 3];
    //             assert.throws(function () { df.addColumn({ "column": "D", "value": new_col }); }, Error, "Array length 3 not equal to 4");
    //         });

    //         it("Check that dtype is updated after a new column is added ", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const new_col = ["n", "b", "c", "f"];

    //             df.addColumn({ "column": "D", "value": new_col });
    //             const dtype = ["int32", "int32", "int32", "string"];

    //             assert.deepEqual(df.dtypes, dtype);
    //         });

    //         it("add series as value to a new column ", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const sf = new Series(["n", "b", "c", "f"]);

    //             df.addColumn({ "column": "D", "value": sf });
    //             const dtype = ["int32", "int32", "int32", "string"];

    //             assert.deepEqual(df.dtypes, dtype);
    //         });

    //     });

    //     // describe("groupby", function () {
    //     //     it("Check group by One column data", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A"]);

    //     //         const group_dict = {
    //     //             '1': [[1, 2, 3]],
    //     //             '4': [[4, 5, 6]],
    //     //             '20': [[20, 30, 40]],
    //     //             '39': [[39, 89, 78]]
    //     //         }

    //     //         assert.deepEqual(group_df.col_dict, group_dict);
    //     //     });
    //     //     it("Obtain the DataFrame of one of the group", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A"]);
    //     //         const new_data = [[1, 2, 3]]

    //     //         assert.deepEqual(group_df.get_groups([1]).values, new_data);
    //     //     });
    //     //     it("Check group by Two column data", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A", "B"]);
    //     //         const new_data = {
    //     //             '1': { '2': [[1, 2, 3]] },
    //     //             '4': { '5': [[4, 5, 6]] },
    //     //             '20': { '30': [[20, 30, 40]] },
    //     //             '39': { '89': [[39, 89, 78]] }
    //     //         }

    //     //         assert.deepEqual(group_df.col_dict, new_data);
    //     //     });

    //     //     it("Obtain the DataFrame of one of the group, grouped by two column", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A", "B"]);
    //     //         const new_data = [[1, 2, 3]]

    //     //         assert.deepEqual(group_df.get_groups([1, 2]).values, new_data);
    //     //     });

    //     //     it("Count column in group", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A", "B"]);
    //     //         const new_data = {
    //     //             '1': { '2': [1] },
    //     //             '4': { '5': [1] },
    //     //             '20': { '30': [1] },
    //     //             '39': { '89': [1] }
    //     //         }

    //     //         assert.deepEqual(group_df.col(["C"]).count(), new_data);
    //     //     });
    //     //     it("sum column element in group", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A", "B"]);
    //     //         const new_data = {
    //     //             '1': { '2': [3] },
    //     //             '4': { '5': [6] },
    //     //             '20': { '30': [40] },
    //     //             '39': { '89': [78] }
    //     //         }

    //     //         assert.deepEqual(group_df.col(["C"]).sum(), new_data);
    //     //     });

    //     //     it("sum column element group by one column", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A"]);

    //     //         const new_data = { '1': [2, 3], '4': [5, 6], '20': [30, 40], '39': [89, 78] }

    //     //         assert.deepEqual(group_df.col(["B", "C"]).sum(), new_data);
    //     //     });

    //     //     it("Perform aggregate on column for groupby", function () {

    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })
    //     //         const group_df = df.groupby(["A", "B"]);
    //     //         const new_data = {
    //     //             '1': { '2': [2, 1] },
    //     //             '4': { '5': [5, 1] },
    //     //             '20': { '30': [30, 1] },
    //     //             '39': { '89': [89, 1] }
    //     //         }

    //     //         assert.deepEqual(group_df.agg({ "B": "mean", "C": "count" }), new_data);
    //     //     });


    //     // });

    //     describe("column", function () {
    //         it("Obtain a column from a dataframe created from object", function () {
    //             const data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //             const options = { columns: ["Gender", "count"] };
    //             const df = new DataFrame(data, options);
    //             const expected = df.column("count");
    //             const rslt_data = [1, 2, 3];
    //             assert.deepEqual(expected.values, rslt_data);
    //         });
    //         it("Obtain a column from a dataframe", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const expected = df.column("C");
    //             const rslt_data = [3, 6, 40, 78];
    //             assert.deepEqual(expected.values, rslt_data);
    //         });
    //         it("Throw Error for wrong column", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             assert.throws(() => { df.column("D"); }, Error, "column D does not exist");

    //         });
    //     });

    //     // describe("Concatenate", function () {

    //     //     it("Check the axis 0 concatenation", function () {
    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })

    //     //         const data1 = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols1 = ["A", "B", "C"]
    //     //         const df1 = new DataFrame(data1, { columns: cols1 })

    //     //         const data2 = [[1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]
    //     //         const cols2 = ["A", "B", "C", "D"]
    //     //         const df2 = new DataFrame(data2, { columns: cols2 })

    //     //         const new_df = DataFrame.concat({ "df_list": [df, df1, df2], "axis": 0 })

    //     //         const data_values = [[1, 2, 3, NaN], [4, 5, 6, NaN], [20, 30, 40, NaN], [39, 89, 78, NaN],
    //     //         [1, 2, 3, NaN], [4, 5, 6, NaN], [20, 30, 40, NaN], [39, 89, 78, NaN],
    //     //         [1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]

    //     //         assert.deepEqual(new_df.values, data_values);
    //     //     });

    //     //     it("Check the axis 1 concatenation", function () {
    //     //         const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols = ["A", "B", "C"]
    //     //         const df = new DataFrame(data, { columns: cols })

    //     //         const data1 = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
    //     //         const cols1 = ["A", "B", "C"]
    //     //         const df1 = new DataFrame(data1, { columns: cols1 })

    //     //         const data2 = [[1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]
    //     //         const cols2 = ["A", "B", "C", "D"]
    //     //         const df2 = new DataFrame(data2, { columns: cols2 })

    //     //         const new_df = DataFrame.concat({ "df_list": [df, df1, df2], "axis": 1 })

    //     //         const data_values = [[1, 2, 3, 1, 2, 3, 1, 2, 3, 5], [4, 5, 6, 4, 5, 6, 4, 5, 6, 8],
    //     //         [20, 30, 40, 20, 30, 40, 20, 30, 40, 10], [39, 89, 78, 39, 89, 78, NaN,
    //     //             NaN, NaN, NaN]]
    //     //         assert.deepEqual(new_df.values, data_values);
    //     //     });
    //     // });


    //     describe("Apply", function () {
    //         it("Apply math operation on dataframe element wise", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const rslt = [[2, 3, 4], [5, 6, 7], [21, 31, 41], [40, 90, 79]];

    //             const apply_rslt = df.apply({
    //                 callable: (x) => {
    //                     return x + 1;
    //                 }
    //             });

    //             assert.deepEqual(apply_rslt.values, rslt);
    //         });

    //         it("Apply string function on all elements of a dataframe", function () {
    //             const data = [["BOY", "GIRL", "ALL"], ["Man", "Woman", "Girl"]];
    //             const df = new DataFrame(data);
    //             const rslt = [["boy", "girl", "all"], ["man", "woman", "girl"]];

    //             const apply_rslt = df.apply({
    //                 callable: (x) => {
    //                     return x.toLowerCase();

    //                 }
    //             });
    //             assert.deepEqual(apply_rslt.values, rslt);
    //         });

    //         it("Throws error if you try to run a function that does not operate on axis and axis is specified", function () {
    //             const data = [["BOY", "GIRL", "ALL"], ["Man", "Woman", "Girl"]];
    //             const df = new DataFrame(data);

    //             const err = `Callable Error: You can only apply JavaScript functions on DataFrames when axis is not specified. This operation is applied on all element, and returns a DataFrame of the same shape.`;

    //             assert.throws(() => {
    //                 df.apply({
    //                     axis: 0, callable: (x) => {
    //                         return x.toLowerCase();
    //                     }
    //                 });
    //             }, Error, err);

    //         });

    //         it("Apply math operation on dataframe at axis 1", function () {
    //             const data = [[1, 2, 3],
    //             [4, 5, 6],
    //             [20, 30, 40],
    //             [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             const rslt = [64, 126, 127];

    //             const apply_rslt = df.apply({
    //                 axis: 1, callable: (x) => {
    //                     return x.sum();
    //                 }
    //             });

    //             assert.deepEqual(apply_rslt.values, rslt);
    //         });

    //         it("Apply tensor operation on dataframe at axis 0", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             const rslt = [6, 15, 90, 206];

    //             const apply_rslt = df.apply({
    //                 axis: 0, callable: (x) => {
    //                     return x.sum();
    //                 }
    //             });

    //             assert.deepEqual(apply_rslt.values, rslt);

    //         });

    //         it("Apply add operation element wise dataframe on axis 1", function () {
    //             const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });

    //             const result = [[2, 3, 4],
    //             [5, 6, 7],
    //             [21, 31, 41],
    //             [40, 90, 79]];

    //             const apply_rslt = df.apply({
    //                 axis: 0, callable: (x) => {
    //                     return x.add(1);
    //                 }
    //             });

    //             assert.deepEqual(apply_rslt.values, result);
    //         });
    //     });

    describe("dropNa", function () {
        it("drop NaNs along axis 1", function () {
            const data = [[0, 2, 4],
            [360, 180, 360],
            [NaN, 180, 360]]
            const column = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: column });
            const df_val = [[2, 4],
            [180, 360],
            [180, 360]]
            assert.deepEqual(df.dropNa(1).values, df_val);

        });
        it("drop NaNs along axis 0", function () {
            const data = [[0, 2, 4],
            [360, 180, 360],
            [NaN, 180, 360]]
            const column = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: column });
            const df_val = [[0, 2, 4],
            [360, 180, 360]]
            assert.deepEqual(df.dropNa(0).values, df_val);

        });
        it("drop NaNs along axis 0", function () {
            const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
            const column = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: column });
            const df_val = [[5, 6, 7, 8]];
            assert.deepEqual(df.dropNa(0).values, df_val);

        });
        it("drop inplace at axis 1, inplace false ", function () {
            const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
            const column = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: column });

            const df_val = [[1, 3], [4, 9], [6, 8]];

            assert.deepEqual(df.dropNa(1).values, df_val);

        });
        it("drop inplace at axis 1, inplace true ", function () {
            const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
            const column = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: column });

            const df_val = [[1, 3], [4, 9], [6, 8]];
            df.dropNa(1, { inplace: true });
            assert.deepEqual(df.values, df_val);

        });
        it("drop inplace at axis 0 at inplace true", function () {
            const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
            const column = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: column });

            const df_val = [[5, 6, 7, 8]];

            df.dropNa(0, { inplace: true });
            assert.deepEqual(df.values, df_val);

        });
    });

    describe("isNa", function () {

        it("check if values are empty (element-wise", function () {
            const data = [[NaN, 1, 2, 3], [3, 4, undefined, 9], [5, 6, 7, 8]];
            const column = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: column });

            const df_val = [
                [true, false, false, false],
                [false, false, true, false],
                [false, false, false, false]
            ];
            const dfNew = df.isNa()
            assert.deepEqual(dfNew.values, df_val);
            assert.deepEqual(dfNew.dtypes, ["boolean", "boolean", "boolean", "boolean"]);
            assert.deepEqual(dfNew.columns, column);
        });
    });

    describe("fillNa", function () {

        it("replace all NaN value inplace", function () {
            const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
            const columns = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: columns });

            const expected = [[-999, 1, 2, 3], [3, 4, -999, 9], [5, 6, 7, 8]];
            df.fillNa({ values: -999, inplace: true });
            assert.deepEqual(df.values, expected);
        });
        it("replace all undefined value", function () {
            const data = [[undefined, 1, 2, 3], [3, 4, undefined, 9], [5, 6, 7, 8]];
            const columns = ["A", "B", "C", "D"];
            const df = new DataFrame(data, { columns: columns });

            const expected = [[-999, 1, 2, 3], [3, 4, -999, 9], [5, 6, 7, 8]];

            const df_filled = df.fillNa({ values: -999 });
            assert.deepEqual(df_filled.values, expected);
        });

        it("Fills only a specified column", function () {
            const data = [[1, 2, 3],
            [4, 5, 6],
            [20, NaN, 40],
            [39, NaN, NaN]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const expected = [[1, 2, 3], [4, 5, 6], [20, 2, 40], [39, 2, NaN]];
            const df_filled = df.fillNa({ columns: ["B"], values: [2] });

            assert.deepEqual(df_filled.values, expected);
        });
        it("Fills column with specified values not in place", function () {
            const data = [[1, 2, 3], [4, 5, 6], [NaN, 20, 40], [NaN, -1, 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const new_vals = [[1, 2, 3], [4, 5, 6], [-2, 20, 40], [-2, -1, 78]];
            const df_filled = df.fillNa({ columns: ["A"], values: [-2] });

            assert.deepEqual(df_filled.values, new_vals);
        });

        it("Fills a list of columns with specified values", function () {
            const data = [[1, undefined, 3], [4, undefined, 6], [NaN, "boy", 40], [NaN, "girl", NaN]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const new_vals = [[1, "girl", 3], [4, "girl", 6], [200, "boy", 40], [200, "girl", NaN]];
            const df_filled = df.fillNa({ columns: ["A", "B"], values: [200, "girl"] });
            assert.deepEqual(df_filled.values, new_vals);
        });
        it("Fills a list of columns with specified values inplace", function () {
            const data = [[1, undefined, 3], [4, undefined, 6], [NaN, "boy", 40], [NaN, "girl", 78]];
            const cols = ["A", "B", "C"];
            const df = new DataFrame(data, { columns: cols });
            const new_vals = [[1, "girl", 3], [4, "girl", 6], [200, "boy", 40], [200, "girl", 78]];
            df.fillNa({ columns: ["A", "B"], values: [200, "girl"], inplace: true });
            assert.deepEqual(df.values, new_vals);
        });
    });


    //     describe("nanindex", function () {

    //         it("print out the nanIndex", function () {
    //             const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });

    //             const df_val = [0, 1];
    //             assert.deepEqual(df.nanIndex(), df_val);
    //         });
    //     });

    //     describe("select_dtypes", function () {

    //         it("Returns float columns in a DataFrame", function () {
    //             const data = [[30, 1, 2, "boy"], [3.2, 4, 30, "girl"], [5.09, 6, 7, "cat"]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const df_sub = df.select_dtypes(['float32']);
    //             assert.deepEqual(df_sub.expected, [[30, 3.2, 5.09]]);
    //         });

    //         it("Returns int columns in a DataFrame", function () {
    //             const data = [[30, 1, 2, "boy"],
    //             [3.2, 4, 30, "girl"],
    //             [5.09, 6, 7, "cat"]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const df_sub = df.select_dtypes(['int32']);
    //             assert.deepEqual(df_sub.values, [[1, 2], [4, 30], [6, 7]]);
    //         });

    //         it("Returns string columns in a DataFrame", function () {
    //             const data = [[30, 1, 2, "boy"],
    //             [3.2, 4, 30, "girl"],
    //             [5.09, 6, 7, "cat"]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const df_sub = df.select_dtypes(['string']);
    //             assert.deepEqual(df_sub.expected, [["boy", "girl", "cat"]]);
    //         });

    //         it("Returns string and float columns in a DataFrame", function () {
    //             const data = [[30, 1, 2, "boy"],
    //             [3.2, 4, 30, "girl"],
    //             [5.09, 6, 7, "cat"]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const df_sub = df.select_dtypes(['string', 'float32']);
    //             assert.deepEqual(df_sub.expected, [[30, 3.2, 5.09], ["boy", "girl", "cat"]]);
    //         });

    //         it("Returns int and float columns in a DataFrame", function () {
    //             const data = [[30, 1, 2, "boy"],
    //             [3.2, 4, 30, "girl"],
    //             [5.09, 6, 7, "cat"]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const df_sub = df.select_dtypes(['int32', 'float32']);
    //             assert.deepEqual(df_sub.values, [[30, 1, 2], [3.2, 4, 30], [5.09, 6, 7]]);
    //         });
    //     });

    //     describe("cum_ops", function () {

    //         it("check cumsum data", function () {
    //             const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const rslt = [[2, 1, 2, 3], [5, 5, 13, 12], [10, 11, 20, 20]];

    //             assert.deepEqual(df.cumsum().values, rslt);
    //         });
    //         it("check cumsum data along axis 1", function () {
    //             const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
    //             const column = ["A", "B", "C", "D"];
    //             const df = new DataFrame(data, { columns: column });
    //             const rslt = [[2, 3, 5, 8], [3, 7, 18, 27], [5, 11, 18, 26]];

    //             assert.deepEqual(df.cumsum({ axis: 1 }).values, rslt);
    //         });
    //     });

    //     describe("__set_column_property", async function () {
    //         it("Access column object using list subset and name of column", async function () {
    //             const data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //             const df = new DataFrame(data);
    //             const col1 = ["A", "B", "C"];
    //             const col2 = [1, 2, 3];
    //             assert.deepEqual(df['alpha'].values, col1);
    //             assert.deepEqual(df['count'].values, col2);
    //         });
    //         it("Access column object using list subset and name of column after assigning", function () {
    //             const data = [[1, 2, 3], [4, 5, 6]];
    //             const cols = ["A", "B", "C"];
    //             const df = new DataFrame(data, { columns: cols });
    //             df["A"] = [30, 40];
    //             const col1 = [30, 40];
    //             assert.deepEqual(df["A"].values, col1);
    //         });
    //     });

    //     describe("lt", function () {
    //         it("Returns Less than of DataFrame and other DataFrame (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

    //             const df = new DataFrame(data1);
    //             const df2 = new DataFrame(data2);
    //             const expected = [[true, true, true, false],
    //             [false, false, false, false]];
    //             assert.deepEqual(df.lt(df2).values, expected);
    //         });

    //         it("Return Less than of series scalar (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[true, false, false, true],
    //             [true, true, true, true]];
    //             assert.deepEqual(sf.lt(30).values, expected);
    //         });
    //         it("Return Less than of series and DataFrame scalar along axis 1 (column)", function () {
    //             const data1 = [[10, 45, 56, 10],
    //             [23, 20, 10, 10]];
    //             const sf = new Series([10, 23, 56, 100]);
    //             const df = new DataFrame(data1);
    //             const expected = [[false, false, false, true], [false, true, true, true]];
    //             assert.deepEqual(df.lt(sf, 1).values, expected);
    //         });

    //         it("Return Less than of Array and DataFrame scalar along axis 1 (column)", function () {
    //             const data1 = [[10, 45, 56, 10], [23, 20, 10, 10]];
    //             const sf = [10, 23, 56, 100];
    //             const df = new DataFrame(data1);
    //             const expected = [[false, false, false, true], [false, true, true, true]];
    //             assert.deepEqual(df.lt(sf, 1).values, expected);
    //         });

    //     });

    //     describe("gt", function () {
    //         it("Return Greater than of series and other series (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

    //             const df = new DataFrame(data1);
    //             const df2 = new DataFrame(data2);
    //             const expected = [[false, false, false, true], [false, true, true, false]];
    //             assert.deepEqual(df.gt(df2).values, expected);
    //         });

    //         it("Return Greater than of series scalar (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[false, true, true, false], [false, false, false, false]];
    //             assert.deepEqual(sf.gt(30).values, expected);
    //         });

    //         it("Return Less than of Array and DataFrame scalar along axis 1 (column)", function () {
    //             const data1 = [[10, 45, 56, 10], [23, 20, 10, 10]];
    //             const sf = [10, 23, 56, 100];
    //             const df = new DataFrame(data1);
    //             const expected = [[false, true, false, false], [true, false, false, false]];
    //             assert.deepEqual(df.gt(sf, 1).values, expected);
    //         });

    //     });

    //     describe("le", function () {
    //         it("Return Less than or Equal to of series and other series (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

    //             const df = new DataFrame(data1);
    //             const df2 = new DataFrame(data2);
    //             const expected = [[true, true, true, false], [true, false, false, true]];
    //             assert.deepEqual(df.le(df2).values, expected);
    //         });

    //         it("Return Less than or Equal to of series scalar (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[true, false, false, true], [true, true, true, true]];
    //             assert.deepEqual(sf.le(30).values, expected);
    //         });

    //     });

    //     describe("ge", function () {
    //         it("Return Greater than or Equal to of series and other series (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

    //             const df = new DataFrame(data1);
    //             const df2 = new DataFrame(data2);
    //             const expected = [[false, false, false, true], [true, true, true, true]];
    //             assert.deepEqual(df.ge(df2).values, expected);
    //         });

    //         it("Return Greater than or Equal to of series scalar (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[false, true, true, false], [false, false, true, false]];
    //             assert.deepEqual(sf.ge(30).values, expected);
    //         });

    //     });

    //     describe("ne", function () {
    //         it("Return Not Equal to of series and other series (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

    //             const df = new DataFrame(data1);
    //             const df2 = new DataFrame(data2);
    //             const expected = [[true, true, true, true], [false, true, true, false]];
    //             assert.deepEqual(df.ne(df2).values, expected);
    //         });

    //         it("Return Not Equal to of series scalar (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[true, true, true, true], [true, true, false, true]];
    //             assert.deepEqual(sf.ne(30).values, expected);
    //         });

    //     });

    //     describe("eq", function () {
    //         it("Return Equal to of DataFrame and other DataFrame (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

    //             const df = new DataFrame(data1);
    //             const df2 = new DataFrame(data2);
    //             const expected = [[false, false, false, false], [true, false, false, true]];
    //             assert.deepEqual(df.eq(df2).values, expected);
    //         });

    //         it("Return Equal to of DataFrame with scalar (element-wise)", function () {
    //             const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[false, false, false, false], [false, false, true, false]];
    //             assert.deepEqual(sf.eq(30).values, expected);
    //         });
    //         it("Return Equal to of series and DataFrame scalar along axis 1 (column)", function () {
    //             const data1 = { "Col1": [10, 45, 56, 10], "Col2": [23, 20, 10, 10] };
    //             const sf = new Series([10, 23]);
    //             const df = new DataFrame(data1);
    //             const expected = [[true, false, false, true], [true, false, false, false]];
    //             assert.deepEqual(df.eq(sf, 1).expected, expected);
    //         });

    //     });

    //     describe("replace", function () {
    //         it("Replace values given in replace param", function () {
    //             const data1 = [[10, 45, 56, 25], [23, 20, 10, 24]];
    //             const sf = new DataFrame(data1);
    //             const expected = [[-999, 45, 56, 25], [23, 20, -999, 24]];
    //             const df_rep = sf.replace({ replace: 10, with: -999 });
    //             assert.deepEqual(df_rep.values, expected);
    //         });

    //         it("Replace values given in replace param with value (String type)", function () {
    //             const data1 = [["A", "A", "A", "B"], ["B", "C", "C", "D"]];
    //             const df = new DataFrame(data1);
    //             const expected = [["boy", "boy", "boy", "B"], ["B", "C", "C", "D"]];
    //             const df_rep = df.replace({ replace: "A", with: "boy" });
    //             assert.deepEqual(df_rep.values, expected);
    //         });
    //         it("Throw error on wrong param passed", function () {
    //             const data1 = [["A", "A", "A", "B"], ["B", "C", "C", "D"]];
    //             const sf = new DataFrame(data1);
    //             const expected = `Params Error: A specified parameter is not supported. Your params must be any of the following [replace,with,in]`;
    //             assert.throws(() => { sf.replace({ replce: "A", with: "boy" }); }, Error, expected);
    //         });
    //         it("Replace values in specified two column(s)", function () {
    //             const data1 = [["A", "A", 1, "girl"],
    //             ["B", "A", 2, "woman"],
    //             ["A", "B", 3, "man"]];
    //             const df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] });
    //             const expected = [["boy", "boy", 1, "girl"],
    //             ["B", "boy", 2, "woman"],
    //             ["boy", "B", 3, "man"]];
    //             const df_rep = df.replace({ replace: "A", with: "boy", in: ["col1", "col2"] });
    //             assert.deepEqual(df_rep.values, expected);
    //         });

    //         it("Replace values in specified single column(s)", function () {
    //             const data1 = [[2, "A", 1, "girl"],
    //             [3, "A", 2, "woman"],
    //             [4, "B", 3, "man"]];
    //             const df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] });
    //             const expected = [[2, "A", 1, "girl"],
    //             [100, "A", 2, "woman"],
    //             [4, "B", 3, "man"]];
    //             const df_rep = df.replace({ replace: 3, with: 100, in: ["col1"] });
    //             assert.deepEqual(df_rep.values, expected);
    //         });


    //     });

    //     describe("drop_duplicates", function () {
    //         it("Return Series with duplicate values removed (Default, first values kept)", function () {
    //             const data1 = [10, 45, 56, 10, 23, 20, 10, 10];
    //             const sf = new Series(data1);
    //             const expected = [10, 45, 56, 23, 20];
    //             const expected_index = [0, 1, 2, 4, 5];
    //             const df_drop = sf.drop_duplicates();
    //             assert.deepEqual(df_drop.values, expected);
    //             assert.deepEqual(df_drop.index, expected_index);

    //         });

    //         it("Return Series with duplicate values removed (last values kept)", function () {
    //             const data1 = [10, 45, 56, 10, 23, 20, 10, 10];
    //             const sf = new Series(data1);
    //             const expected = [45, 56, 23, 20, 10];
    //             const expected_index = [1, 2, 4, 5, 7];
    //             const df_drop = sf.drop_duplicates({ keep: "last" });
    //             assert.deepEqual(df_drop.values, expected);
    //             assert.deepEqual(df_drop.index, expected_index);

    //         });

    //         it("Return Series with duplicate values removed (String)", function () {
    //             const data1 = ["A", "A", "A", "B", "B", "C", "C", "D"];
    //             const sf = new Series(data1);
    //             const expected = ["A", "B", "C", "D"];
    //             const expected_index = [0, 3, 5, 7];
    //             sf.drop_duplicates({ inplace: true });
    //             assert.deepEqual(sf.values, expected);
    //             assert.deepEqual(sf.index, expected_index);

    //         });

    //     });

    //     describe("sum", function () {
    //         it("Sum values of a DataFrame by Default axis column (axis=1)", function () {
    //             const data1 = [[30, 40, 3.1],
    //             [5, 5, 5.1],
    //             [5, 5, 3.2]];
    //             const sf = new DataFrame(data1);
    //             const res = [40, 50, 11.4];
    //             assert.deepEqual(sf.sum().values, res);
    //         });
    //         it("Sum values of a DataFrame along row axis (axis=0)", function () {
    //             const data1 = [[30, 40, 3.1],
    //             [5, 5, 5.1],
    //             [5, 5, 3.2]];
    //             const df = new DataFrame(data1);
    //             const res = [73.1, 15.1, 13.2];
    //             assert.deepEqual(df.sum({ axis: 0 }).values, res);
    //         });
    //         it("Sum values of a mixed DataFrame along row axis (axis=0)", function () {
    //             const data1 = [[30, 40, 3.1, true],
    //             [5, 5, 5.1, true],
    //             [5, 5, 3.2, true]];
    //             const df = new DataFrame(data1);
    //             const res = [74.1, 16.1, 14.2];
    //             assert.deepEqual(df.sum({ axis: 0 }).values, res);
    //         });
    //         it("Sum values of a boolean DataFrame along row axis (axis=0)", function () {
    //             const data1 = [[true, true, false, true],
    //             [false, false, false, false],
    //             [false, true, true, false]];
    //             const df = new DataFrame(data1);
    //             const res = [3, 0, 2];
    //             assert.deepEqual(df.sum({ axis: 0 }).values, res);
    //         });
    //         it("Sum values of a boolean DataFrame along default column axis (axis=1)", function () {
    //             const data1 = [[true, true, false, true],
    //             [false, false, false, false],
    //             [false, true, true, false]];
    //             const df = new DataFrame(data1);
    //             const res = [1, 2, 1, 1];
    //             assert.deepEqual(df.sum().values, res);
    //         });
    //         it("Sum values of a df with missing values", function () {
    //             const data1 = [[11, 20, 3], [null, 15, 6], [2, 30, 40], [2, 89, 78]];
    //             const df = new DataFrame(data1);
    //             const res = [15, 154, 127];
    //             assert.deepEqual(df.sum().values, res);
    //         });

    //     });

    //     describe("abs", function () {
    //         it("Returns the absolute values in DataFrame of ints", function () {
    //             const data1 = [[-10, 45, 56, 10], [-25, 23, 20, -10]];
    //             const df = new DataFrame(data1);
    //             const expected = [[10, 45, 56, 10], [25, 23, 20, 10]];
    //             assert.deepEqual(df.abs().values, expected);
    //         });

    //         it("Returns the absolute values in mixed DataFrame", function () {
    //             const data1 = [[-10, -45.1, 56, 10], [-25, -23.2, 20, -10]];
    //             const df = new DataFrame(data1);
    //             const expected = [[10, 45.1, 56, 10], [25, 23.2, 20, 10]];
    //             assert.deepEqual(df.abs().values, expected);
    //         });
    //     });

    //     describe("T", function () {
    //         it("Returns the Tranpose of a DataFrame", function () {
    //             const data1 = [[10, 45, 56, 10],
    //             [25, 23, 20, 10]];

    //             const cols = ["a", "b", "c", "d"];
    //             const df = new DataFrame(data1, { columns: cols });
    //             const df_trans = df.T;
    //             const expected_vals = [[10, 25], [45, 23], [56, 20], [10, 10]];
    //             const expected_index = cols;
    //             const expected_col_names = [0, 1];
    //             assert.deepEqual(df_trans.index, expected_index);
    //             assert.deepEqual(df_trans.values, expected_vals);
    //             assert.deepEqual(df_trans.column_names, expected_col_names);

    //         });

    //     });


    //     describe("astype", function () {
    //         it("set type of float column to int", function () {
    //             const data = {
    //                 "A": [-20.1, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20.1, -20.23, 30.3, 40.11],
    //                 "D": ["a", "b", "c", "c"]
    //             };
    //             const df = new DataFrame(data);
    //             const df = df.astype({ column: "A", dtype: "int32" });

    //             assert.deepEqual(df.dtypes, ['int32', 'int32', 'float32', 'string']);
    //             assert.deepEqual(df['A'].values, [-20, 30, 47, -20]);

    //         });
    //         it("set type of int column to float", function () {
    //             const data = {
    //                 "A": [-20.1, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20.1, -20.23, 30.3, 40.11],
    //                 "D": ["a", "b", "c", "c"]
    //             };
    //             const df = new DataFrame(data);
    //             const df = df.astype({ column: "B", dtype: "float32" });

    //             assert.deepEqual(df.dtypes, ['float32', 'float32', 'float32', 'string']);
    //             assert.deepEqual(df['B'].values, [34, -4, 5, 6]);

    //         });
    //         it("set type of string column to int", function () {
    //             const data = {
    //                 "A": [-20.1, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20.1, -20.23, 30.3, 40.11],
    //                 "D": ["20.1", "21", "23.4", "50.78"]
    //             };
    //             const df = new DataFrame(data);
    //             const df = df.astype({ column: "D", dtype: "int32" });

    //             assert.deepEqual(df.dtypes, ['float32', 'int32', 'float32', 'int32']);
    //             assert.deepEqual(df['D'].values, [20, 21, 23, 51]);

    //         });
    //         it("set type of string column to float", function () {
    //             const data = {
    //                 "A": [-20.1, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20.1, -20.23, 30.3, 40.11],
    //                 "D": ["20.1", "21", "23.4", "50.78"]
    //             };
    //             const df = new DataFrame(data);
    //             const df = df.astype({ column: "D", dtype: "float32" });

    //             assert.deepEqual(df.dtypes, ['float32', 'int32', 'float32', 'float32']);
    //             assert.deepEqual(df['D'].values, [20.1, 21, 23.4, 50.78]);

    //         });
    //     });


    //     describe("nunique", function () {
    //         it("Returns the number of unique elements along axis 1", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             const df = df.nunique(1);
    //             const res = [3, 4, 2, 3];
    //             assert.deepEqual(df.values, res);

    //         });
    //         it("Returns the number of unique elements along axis 0", function () {
    //             const data = {
    //                 "A": [20, 30, 47.3, 30],
    //                 "B": [34, -4, 5, 30],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             const df = df.nunique(0);
    //             const res = [3, 4, 4, 2];
    //             assert.deepEqual(df.values, res);

    //         });

    //     });


    //     describe("unique", function () {
    //         it("Returns the unique elements along axis 1", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             const df = df.unique(1);
    //             const res = {
    //                 "A": [-20, 30, 47.3],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 30],
    //                 "D": ["a", "b", "c"]
    //             };

    //             assert.deepEqual(df, res);

    //         });
    //         it("Returns the unique elements along axis 0", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             const df = df.unique(0);
    //             const res = {
    //                 0: [-20, 34, 20, "a"],
    //                 1: [30, -4, 20, "b"],
    //                 2: [47.3, 5, 30, "c"],
    //                 3: [-20, 6, 30, "c"]
    //             };
    //             assert.deepEqual(df, res);

    //         });
    //     });


    //     describe("rename", function () {
    //         it("Rename columns along axis 1", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             const df = df.rename({ mapper: { "A": "a1", "B": "b1" } });
    //             const res = ["a1", "b1", "C", "D"];
    //             assert.deepEqual(df.columns, res);

    //         });
    //         it("confirms original column name is not modified along axis 1", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             // const df = df.rename({ mapper: { "A": "a1", "B": "b1" } })
    //             const res = ["A", "B", "C", "D"];
    //             assert.deepEqual(df.columns, res);

    //         });
    //         it("Rename columns along axis 1 inplace", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data);
    //             df.rename({ mapper: { "A": "a1", "B": "b1" }, inplace: true });
    //             const res = ["a1", "b1", "C", "D"];
    //             assert.deepEqual(df.columns, res);

    //         });
    //         it("Rename string index along axis 0", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data, { index: ["a", "b", "c", "d"] });
    //             const df = df.rename({ mapper: { "a": 0, "b": 1 }, axis: 0 });
    //             const res = [0, 1, "c", "d"];
    //             assert.deepEqual(df.index, res);

    //         });
    //         it("Rename string index along axis 0 inplace", function () {
    //             const data = {
    //                 "A": [-20, 30, 47.3, -20],
    //                 "B": [34, -4, 5, 6],
    //                 "C": [20, 20, 30, 30],
    //                 "D": ["a", "b", "c", "c"]
    //             };

    //             const df = new DataFrame(data, { index: ["a", "b", "c", "d"] });
    //             df.rename({ mapper: { "a": 0, "b": 1 }, axis: 0, inplace: true });
    //             const res = [0, 1, "c", "d"];
    //             assert.deepEqual(df.index, res);

    //         });
    //     });

    //     describe("sort_index", function () {

    //         it("sort index in ascending order", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             df.set_index({ key: ["b", "a", "c"], inplace: true });

    //             const df2 = df.sort_index();
    //             const rslt = [[360, 180, 360, 'a'], [0, 2, 4, 'b'], [2, 4, 6, 'c']];

    //             assert.deepEqual(df2.values, rslt);
    //         });
    //         it("sort index in descending order", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             df.set_index({ key: ["b", "a", "c"], inplace: true });

    //             const df2 = df.sort_index({ ascending: false });
    //             const rslt = [[2, 4, 6, 'c'], [0, 2, 4, 'b'], [360, 180, 360, 'a']];

    //             assert.deepEqual(df2.values, rslt);
    //         });
    //         it("sort index in descending order with inplace set to true", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             df.set_index({ key: ["b", "a", "c"], inplace: true });

    //             df.sort_index({ ascending: false, inplace: true });
    //             const rslt = [[2, 4, 6, 'c'], [0, 2, 4, 'b'], [360, 180, 360, 'a']];
    //             assert.deepEqual(df.values, rslt);
    //         });
    //     });

    //     describe("append", function () {

    //         it("Add a new single row (array) to the end of a DataFrame", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data);
    //             const expected_val = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"],
    //             [20, 40, 60, "d"]];

    //             const rslt_df = df.append([[20, 40, 60, "d"]]);
    //             assert.deepEqual(rslt_df.values, expected_val);

    //         });

    //         it("Add a new single row (object) to the end of a DataFrame", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const expected_val = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"],
    //             [20, 40, 60, "d"]];
    //             const rslt_df = df.append({ col1: [20], col2: [40], col3: [60], col4: ["d"] });
    //             assert.deepEqual(rslt_df.values, expected_val);

    //         });

    //         it("Add a new single row (object) to the end of a DataFrame", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const df2 = new DataFrame([[20, 40, 60, "d"]], { "columns": ["col1", "col2", "col3", "col4"] });

    //             const expected_val = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"],
    //             [20, 40, 60, "d"]];

    //             const rslt_df = df.append(df2);
    //             assert.deepEqual(rslt_df.values, expected_val);

    //         });
    //         it("Confirm index Change after append", function () {
    //             const data = [[0, 2, 4, "b"],
    //             [360, 180, 360, "a"],
    //             [2, 4, 6, "c"]];

    //             const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
    //             const df2 = new DataFrame([[20, 40, 60, "d"]], { "columns": ["col1", "col2", "col3", "col4"] });

    //             const rslt_df = df.append(df2);
    //             assert.deepEqual(rslt_df.index, ["0_row0", "1_row0", "2_row0", "0_row1"]);

    //         });
    //     });

    //     describe("Str", function () {
    //         it("Str (startsWith) works for columns selected from a DF", function () {
    //             const data = {
    //                 "Name": ["Apples", "Bake", "Application", undefined],
    //                 "Count": [2, 5, 4, 10],
    //                 "Price": [200, 300, 40, 250]
    //             };

    //             const df = new DataFrame(data);
    //             const name_sf = df['Name'];
    //             assert.deepEqual(name_sf.str.startsWith("App").values, [true, false, true, false]);
    //         });
    //         it("Str (toLowerCase) works for columns selected from a DF", function () {
    //             const data = {
    //                 "Name": ["Apples", "Bake", "Application", undefined],
    //                 "Count": [2, 5, 4, 10],
    //                 "Price": [200, 300, 40, 250]
    //             };

    //             const df = new DataFrame(data);
    //             const name_sf = df['Name'];
    //             assert.deepEqual(name_sf.str.toLowerCase().values, ["apples", "bake", "application", NaN]);
    //         });
    //     });

});

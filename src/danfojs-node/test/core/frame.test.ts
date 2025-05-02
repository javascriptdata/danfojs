import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { DataFrame, Series } from '../../dist/danfojs-node/src';


describe("DataFrame", function () {

        describe("Subsetting by column names", function () {
            it("retrieves the col data created from an df with two columns", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4] };
                let df = new DataFrame(data);
                assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
            });
            it("retrieves the column data from an df with three columns", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
                assert.deepEqual(df["val_sum"].values, [20.3, 30.456, 40.90, 90.1]);
            });

            it("Set column count by subseting", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                df["alpha"] = ["E", "F", "G", "H"]
                assert.deepEqual(df["alpha"].values, ["E", "F", "G", "H"]);
                assert.deepEqual(df.values[0], ['E', 1, 20.3]);
                assert.deepEqual(df.dtypes, ["string", "int32", "float32",]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
                assert.deepEqual(df["val_sum"].values, [20.3, 30.456, 40.90, 90.1]);
            });

            it("Correct dtype is set after setting a column by subseting", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                df["alpha"] = [2.4, 5.6, 32.5, 1]

                assert.deepEqual(df["alpha"].values, [2.4, 5.6, 32.5, 1]);
                assert.deepEqual(df.values[0], [2.4, 1, 20.3]);
                assert.deepEqual(df.values[1], [5.6, 2, 30.456]);
                assert.deepEqual(df.values[2], [32.5, 3, 40.90]);
                assert.deepEqual(df.values[3], [1, 4, 90.1]);

                df["val_count"] = ["A", "B", "C", "D"]
                assert.deepEqual(df["val_count"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df.dtypes, ["float32", "string", "float32",]);
            });

            it("retrieves the col data created from an df with two columns in low memory mode", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4] };
                let df = new DataFrame(data, { config: { lowMemoryMode: true } });
                assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
            });
            it("retrieves the column data from an df with threee columns in low memory mode", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data, { config: { lowMemoryMode: true } });
                assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
                assert.deepEqual(df["val_sum"].values, [20.3, 30.456, 40.90, 90.1]);
            });

            it("Set column count by subseting (low memory mode) ", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data, { config: { lowMemoryMode: true } });
                df["alpha"] = ["E", "F", "G", "H"]
                assert.deepEqual(df["alpha"].values, ["E", "F", "G", "H"]);
                assert.deepEqual(df.values[0], ['E', 1, 20.3]);
                assert.deepEqual(df.dtypes, ["string", "int32", "float32",]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
                assert.deepEqual(df["val_sum"].values, [20.3, 30.456, 40.90, 90.1]);
            });

            it("Correct dtype is set after setting a column by subseting (low memory mode) ", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data, { config: { lowMemoryMode: true } });
                df["alpha"] = [2.4, 5.6, 32.5, 1]
                assert.deepEqual(df["alpha"].values, [2.4, 5.6, 32.5, 1]);
                assert.deepEqual(df.values[0], [2.4, 1, 20.3]);
                assert.deepEqual(df.values[1], [5.6, 2, 30.456]);
                assert.deepEqual(df.values[2], [32.5, 3, 40.90]);
                assert.deepEqual(df.values[3], [1, 4, 90.1]);
                assert.deepEqual(df.dtypes, ["float32", "int32", "float32",]);
            });

            it("correctly converts to column-oriented JSON", function () {
                const jsonData = [
                    { campaignId: "toyota", agentId: "bob", metricValue: 1, metricId: "callCount" },
                    { campaignId: "toyota", agentId: "jim", metricValue: 2, metricId: "callCount" },
                    { campaignId: "sony", agentId: "ben", metricValue: 3, metricId: "callCount" },
                    { campaignId: "sony", agentId: "karl", metricId: "callCount", metricValue: 4 },
                ];

                const df = new DataFrame(jsonData);
                const columnJSON = df.toJSON({ format: "column" });

                assert.deepEqual(columnJSON, jsonData);
            });
        })

        describe("addColumn", function () {
            it("Add new array values to DataFrame works", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                const newdf = df.addColumn("new_column", ["a", "b", "c", "d"]) as DataFrame;
                assert.deepEqual(newdf["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(newdf.columns, ["alpha", "val_count", "val_sum", "new_column"]);
                assert.deepEqual(newdf.dtypes, ["string", "int32", "float32", "string"]);
                assert.deepEqual(newdf.index, [0, 1, 2, 3]);
            });
            it("Add new array values to DataFrame inplace works", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                df.addColumn("new_column", ["a", "b", "c", "d"], { inplace: true });
                assert.deepEqual(df["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(df.columns, ["alpha", "val_count", "val_sum", "new_column"]);
                assert.deepEqual(df.dtypes, ["string", "int32", "float32", "string"]);
                assert.deepEqual(df.index, [0, 1, 2, 3]);
            });
            it("Add new Series to DataFrame works", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                const newdf = df.addColumn("new_column", new Series(["a", "b", "c", "d"])) as DataFrame;
                assert.deepEqual(newdf["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(newdf.columns, ["alpha", "val_count", "val_sum", "new_column"]);
                assert.deepEqual(newdf.dtypes, ["string", "int32", "float32", "string"]);
                assert.deepEqual(newdf.index, [0, 1, 2, 3]);
            });
            it("Correct column data is set", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                df.addColumn("new_column", ["a", "b", "c", "d"], { inplace: true });
                assert.deepEqual(df["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
                assert.deepEqual(df["val_sum"].values, [20.3, 30.456, 40.90, 90.1]);
            });
            it("throw error for wrong column length", function () {
                const data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                const df = new DataFrame(data);

                assert.throws(
                    () => df.addColumn("new_column", new Series(["a", "b", "c"])), Error,
                    'ParamError: Column data length mismatch. You provided data with length 3 but Ndframe has column of length 4');

            });
            it("Ensure add column does not mutate parent when not in place", function () {
                const data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                const df = new DataFrame(data);
                const dfNew = df.addColumn("new_column", ["a", "b", "c", "d"]) as DataFrame
                assert.notDeepEqual(df, dfNew)
                assert.deepEqual(dfNew["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(df["alpha"].values, ["A", "B", "C", "D"]);
                assert.deepEqual(df["val_count"].values, [1, 2, 3, 4]);
                assert.deepEqual(df["val_sum"].values, [20.3, 30.456, 40.90, 90.1]);
            });
            it("Add new array values to DataFrame works", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                const newdf = df.addColumn("new_column", ["a", "b", "c", "d"], { atIndex: 0 }) as DataFrame;
                assert.deepEqual(newdf["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(newdf.columns, ["new_column", "alpha", "val_count", "val_sum"]);
                assert.deepEqual(newdf.dtypes, ["string", "int32", "float32", "string"]);
                assert.deepEqual(newdf.index, [0, 1, 2, 3]);
            });

            it("Add new array values to specific column index", function () {
                let data = { alpha: ["A", "B", "C", "D"], val_count: [1, 2, 3, 4], val_sum: [20.3, 30.456, 40.90, 90.1] };
                let df = new DataFrame(data);
                const newdf = df.addColumn("new_column", ["a", "b", "c", "d"], { atIndex: 'alpha' }) as DataFrame;
                assert.deepEqual(newdf["new_column"].values, ["a", "b", "c", "d"]);
                assert.deepEqual(newdf.columns, ["new_column", "alpha", "val_count", "val_sum"]);
                assert.deepEqual(newdf.dtypes, ["string", "int32", "float32", "string"]);
                assert.deepEqual(newdf.index, [0, 1, 2, 3]);
            });
        })

        describe("drop", function () {
            it("throw error for wrong column name", function () {
                const data = [[1, 2, 3], [4, 5, 6]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                assert.throws(function () {
                    df.drop({ columns: ["3"] });
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
                df.drop({ columns: ["C"], inplace: true });
                const new_data = [[1, 2], [4, 5]];
                assert.deepEqual(df.values, new_data);
                assert.deepEqual(df.dtypes.length, 2);

            });

            it("check if data is updated after row is dropped", function () {
                const data = [[1, 2, 3], [4, 5, 6]];
                const cols = ["A", "B", "C"];
                const dfNew = new DataFrame(data, { columns: cols });
                const df = dfNew.drop({ index: [0] }) as DataFrame;
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
                const df_drop = df.drop({ columns: ["C"], inplace: false }) as DataFrame;

                const expected_data = [[1, 2], [4, 5]];
                const expected_cols = ["A", "B"];
                const expected_df = new DataFrame(expected_data, { columns: expected_cols });
                assert.deepEqual(df_drop.values, expected_df.values);
            });
            it("check that the dtype is updated after column drop", function () {
                const data = [[1, 2, 3], [4, 5, 6]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                df.drop({ columns: ["A"], inplace: true });
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
            it("Throws error if row specified is less than 0", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                assert.throws(() => df.head(-1), Error,
                    "ParamError: Number of rows cannot be less than 1");
            });
            it("Returns all rows when size of DataFrame is less than default (5)", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                assert.deepEqual(df.head().values, data);
            });

        });

        describe("tail", function () {
            it("Prints the last n rows of a DataFrame", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                assert.deepEqual(df.tail(2).values, [[20, 30, 40], [39, 89, 78]]);
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
            it("Returns all rows when size of DataFrame is less than default (5)", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                assert.deepEqual(df.tail().values, data);
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
            it("Throw error if n is greater than length of Dataframe", async function () {
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
                const df = new DataFrame(data)
                assert.deepEqual(df.add(2).values, [[2, 4, 6], [362, 182, 362]]);
            });
            it("Return addition of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.add(sf) as DataFrame).values, [[1, 4, 5], [361, 182, 361]]);
            });
            it("Return addition of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = [1, 2, 1]
                const df = new DataFrame(data);
                assert.deepEqual((df.add(sf) as DataFrame).values, [[1, 4, 5], [361, 182, 361]]);
            });
            it("Return addition of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4],
                [360, 180, 360]];
                const sf = new Series([1, 2]);
                const df = new DataFrame(data);
                assert.deepEqual((df.add(sf, { axis: 0 }) as DataFrame).values, [[1, 3, 5], [362, 182, 362]]);
            });
            it("Return addition of a DataFrame with a Array along axis 0", function () {
                const data = [[0, 2, 4],
                [360, 180, 360]];
                const sf = [1, 2]
                const df = new DataFrame(data);
                assert.deepEqual((df.add(sf, { axis: 0 }) as DataFrame).values, [[1, 3, 5], [362, 182, 362]]);
            });
            it("Return addition of a DataFrame with a DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.add(df2) as DataFrame).values, [[1, 4, 8], [370, 185, 360]]);
            });
            it("Return addition of a DataFrame with a DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.add(df2) as DataFrame).values, [[1, 4, 8], [370, 185, 360]]);
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
                assert.deepEqual((df.sub(2) as DataFrame).values, [[-2, 0, 2], [358, 178, 358]]);
            });
            it("Return subtraction of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.sub(sf) as DataFrame).values, [[-1, 0, 3], [359, 178, 359]]);
            });
            it("Return subtraction of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2]);
                const df = new DataFrame(data);
                assert.deepEqual((df.sub(sf, { axis: 0 }) as DataFrame).values, [[-1, 1, 3], [358, 178, 358]]);
            });
            it("Return subtraction of a DataFrame with a DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.sub(df2) as DataFrame).values, [[-1, 0, 0], [350, 175, 360]]);
            });
            it("Return subtraction of a DataFrame with a DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.sub(df2) as DataFrame).values, [[-1, 0, 0], [350, 175, 360]]);
            });

        });

        describe("mul", function () {
            it("Return multiplication of DataFrame with a single Number", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.deepEqual((df.mul(2) as DataFrame).values, [[0, 4, 8], [720, 360, 720]]);
            });
            it("Return multiplication of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.mul(sf) as DataFrame).values, [[0, 4, 4], [360, 360, 360]]);
            });
            it("Return multiplication of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2]);
                const df = new DataFrame(data);
                assert.deepEqual((df.mul(sf, { axis: 0 }) as DataFrame).values, [[0, 2, 4], [720, 360, 720]]);
            });
            it("Return multiplication of a DataFrame with a DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.mul(df2) as DataFrame).values, [[0, 4, 16], [3600, 900, 0]]);
            });
            it("Return multiplication of a DataFrame with a DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.mul(df2, { axis: 0 }) as DataFrame).values, [[0, 4, 16], [3600, 900, 0]]);
            });

        });

        describe("div", function () {
            it("Return division of DataFrame with a single Number", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.deepEqual((df.div(2) as DataFrame).values, [[0, 1, 2], [180, 90, 180]]);
            });
            it("Return division of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.div(sf) as DataFrame).values, [[0, 1, 4], [360, 90, 360]]);
            });
            it("Return division of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2]);
                const df = new DataFrame(data);
                assert.deepEqual((df.div(sf, { axis: 0 }) as DataFrame).values, [[0, 2, 4], [180, 90, 180]]);
            });
            it("Return division of a DataFrame with a DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.div(df2) as DataFrame).values, [[0, 1, 1], [36, 36, Infinity]]);
            });
            it("Return division of same DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                assert.deepEqual((df1.div(df1) as DataFrame).values, [[NaN, 1, 1], [1, 1, 1]]);
            });
            it("Return division of a DataFrame with a DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.div(df2) as DataFrame).values, [[0, 1, 1], [36, 36, Infinity]]);
            });

        });

        describe("pow", function () {
            it("Return exponential of DataFrame with a single Number", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.deepEqual((df.pow(2) as DataFrame).values, [[0, 4, 16], [129600, 32400, 129600]]);
            });
            it("Return exponential of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.pow(sf) as DataFrame).values, [[0, 4, 4], [360, 32400, 360]]);
            });
            it("Return exponential of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const sf = new Series([1, 2]);
                const df = new DataFrame(data);
                assert.deepEqual((df.pow(sf, { axis: 0 }) as DataFrame).values, [[0, 2, 4], [129600, 32400, 129600]]);
            });
            it("Return exponential of a DataFrame with another DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [3, 10, 4]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.pow(df2) as DataFrame).values, [[0, 4, 256], [59049, 100000, 1]]);
            });
            it("Return exponential of a DataFrame with another DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [3, 10, 4]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.pow(df2, { axis: 0 }) as DataFrame).values, [[0, 4, 256], [59049, 100000, 1]]);
            });

        });

        describe("diff", function () {
            it("Return same DataFrame if other === 0", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(0) as DataFrame).values, [[0, 2, 4], [10, 10, 10], [1, 2, 3]]);
            });
            it("Return difference of DataFrame with previous row", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(1) as DataFrame).values, [[NaN, NaN, NaN], [10, 8, 6], [-9, -8, -7]]);
            });
            it("Return difference of DataFrame with following row", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(-1) as DataFrame).values, [[-10, -8, -6], [9, 8, 7], [NaN, NaN, NaN]]);
            });
            it("Return difference of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(sf) as DataFrame).values, [[-1, 0, 3], [9, 8, 9], [0, 0, 2]]);
            });
            it("Return difference of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(sf, {axis: 0}) as DataFrame).values, [[-1, 1, 3], [8, 8, 8], [0, 1, 2]]);
            });
            it("Return difference of a DataFrame with along axis 0 (column-wise), previous column", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(1, { axis: 0 }) as DataFrame).values, [[NaN, 2, 2], [NaN, 0, 0], [NaN, 1, 1]]);
            });
            it("Return difference of a DataFrame with along axis 0 (column-wise), following column", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.diff(-1, { axis: 0 }) as DataFrame).values, [[-2, -2, NaN], [0, 0, NaN], [-1, -1, NaN]]);
            });
            it("Return difference of a DataFrame with another DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [3, 10, 4]]);
                const df2 = new DataFrame([[-1, -2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.diff(df2) as DataFrame).values, [[1, 4, 0], [-7, 5, 4]]);
            });
            it("Throw error if DataFrame for diff contains string", function () {
                const df = new DataFrame([["words", "words", "words"], ["words", "words", "words"]]);
                assert.throws(() => {
                    df.diff(1);
                }, Error, "TypeError: diff operation is not supported for string dtypes");
            });
        });

        describe("pctChange", function () {
            it("Return same DataFrame if other === 0", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(0) as DataFrame).values, [[0, 2, 4], [10, 10, 10], [1, 2, 3]]);
            });
            it("Return difference in percentage of DataFrame with previous row", function () {
                const data = [[90], [900], [900]];
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(1) as DataFrame).values, [[NaN], [9], [0]]);
            });
            it("Return difference in percentage of DataFrame with following row", function () {
                const data = [[0, 5, 15], [10, 10, 10], [1, 2, 5]];
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(-1) as DataFrame).values, [[-1, -0.5, 0.5], [9, 4, 1], [NaN, NaN, NaN]]);
            });
            it("Return difference in percentage of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(sf) as DataFrame).values, [[-1, 0, 3], [9, 4, 9], [0, 0, 2]]);
            });
            it("Return difference in percentage of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(sf, {axis: 0})).values, [[-1, 1, 3], [4, 4, 4], [0, 1, 2]]);
              });
            it("Return difference in percentage of a DataFrame with along axis 0 (column-wise), previous column", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 3]];
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(1, { axis: 0 }) as DataFrame).values, [[NaN, -1, 1], [NaN, 0, 0], [NaN, 1, 0.5]]);
            });
            it("Return difference in percentage of a DataFrame with along axis 0 (column-wise), following column", function () {
                const data = [[0, 2, 4], [10, 10, 10], [1, 2, 8]];
                const df = new DataFrame(data);
                assert.deepEqual((df.pctChange(-1, { axis: 0 }) as DataFrame).values, [[-1, -0.5, NaN], [0, 0, NaN], [-0.5, -0.75, NaN]]);
            });
            it("Return difference in percentage of a DataFrame with another DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [3, 10, 4]]);
                const df2 = new DataFrame([[-1, -2, 4], [6, 5, 0]]);
                assert.deepEqual((df1.pctChange(df2) as DataFrame).values, [[-1, -2, 0], [-0.5, 1, -1]]);
            });
            it("Throw error if DataFrame for pctChange contains string", function () {
                const df = new DataFrame([["words", "words", "words"], ["words", "words", "words"]]);
                assert.throws(() => {
                    df.pctChange(1);
                }, Error, "TypeError: pctChange operation is not supported for string dtypes");
            });
        });

        describe("mod", function () {
            it("Return modulus of DataFrame with a single Number", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.deepEqual((df.mod(2) as DataFrame).values, [[0, 0, 0], [0, 0, 0]]);
            });
            it("Return modulus of a DataFrame with a Series along default axis 1", function () {
                const data = [[0, 2, 4], [31, 15, 360]];
                const sf = new Series([1, 2, 1]);
                const df = new DataFrame(data);
                assert.deepEqual((df.mod(sf) as DataFrame).values, [[0, 0, 0], [0, 1, 0]]);
            });
            it("Return modulus of a DataFrame with a Series along axis 0", function () {
                const data = [[0, 2, 4], [31, 15, 360]];
                const sf = new Series([1, 2]);
                const df = new DataFrame(data);
                assert.deepEqual((df.mod(sf, { axis: 0 }) as DataFrame).values, [[0, 0, 0], [1, 1, 0]]);
            });
            it("Return modulus of a DataFrame with a DataFrame along default axis 1", function () {
                const df1 = new DataFrame([[0, 2, 4], [31, 15, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.mod(df2) as DataFrame).values, [[0, 0, 0], [1, 0, NaN]]);
            });
            it("Return modulus of a DataFrame with a DataFrame along axis 0", function () {
                const df1 = new DataFrame([[0, 2, 4], [360, 180, 360]]);
                const df2 = new DataFrame([[1, 2, 4], [10, 5, 0]]);
                assert.deepEqual((df1.mod(df2) as DataFrame).values, [[0, 0, 0], [0, 0, NaN]]);
            });

        });

        describe("mean", function () {
            it("Returns the mean of a DataFrame (Default axis is [1:column])", function () {
                const data = [[0, 2, 4],
                [360, 180, 360]];
                const df = new DataFrame(data, { columns: ["col1", "col2", "col3"], index: ["row1", "row2"] });
                assert.deepEqual(df.mean().values, [2, 300]);
                assert.deepEqual(df.mean().index, ["row1", "row2"]);
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
                const df = new DataFrame(data, { columns: ["col1", "col2", "col3"] });
                assert.deepEqual(df.mean({ "axis": 0 }).values, [180, 91, 182]);
                assert.deepEqual(df.mean({ "axis": 0 }).index, ["col1", "col2", "col3"]);

            });
            it("Removes NaN before calculating mean of a DataFrame along axis 0 (column)", function () {
                const data = [[11, 20, 3],
                [NaN, 15, 6],
                [2, 30, 40],
                [2, 89, 78]];
                const df = new DataFrame(data);
                assert.deepEqual(df.mean({ "axis": 0 }).values, [5, 38.5, 31.75]);
            });
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
            it("Returns the minimum values of a DataFrame along axis 0 (row)", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.deepEqual(df.min({ "axis": 0 }).values, [0, 2, 4]);
            });
            it("Returns the minimum values in a DataFrame-Default axis 1", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
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
                assert.deepEqual((df.round(3) as DataFrame).values as number[][], expected);
            });
            it("Rounds values in a DataFrame to 1dp, inplace", function () {
                const data = [[10.1, 2.092, 4.23], [360.232244, 180.0190290, 36.902612]];
                const df = new DataFrame(data);
                const expected = [[10.1, 2.1, 4.2], [360.2, 180.0, 36.9]];
                df.round(1, { inplace: true }) as DataFrame
                assert.deepEqual(df.values as number[][], expected);
            });
            it("Rounds values in a DataFrame to 3dp with missing values", function () {
                const data = [[10.1, 2.092, null], [360.232244, null, 36.902612]];
                const df = new DataFrame(data);
                const expected = [[10.1, 2.092, null], [360.232, null, 36.903]];
                assert.deepEqual((df.round(3) as DataFrame).values as number[][], expected);
            });

        });

        describe("sortValues", function () {
            it("Sort values in DataFrame by specified column in ascending order (Default)", function () {
                const data = [[0, 2, 4, "a"],
                [360, 180, 360, "b"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"], index: ["a", 1, "c"] });
                df.sortValues("col1", { inplace: true });
                const expected = [[0, 2, 4, "a"], [2, 4, 6, "c"], [360, 180, 360, "b"]];
                assert.deepEqual(df.values, expected);
                assert.deepEqual(df.index, ["a", "c", 1]);

            });

            it("Sort values in DataFrame by specified column in ascending order (Default)", function () {
                const data = [[0, 2, 4, "a"],
                [360, 180, 1, "b"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
                const df_sort = df.sortValues("col3")
                const expected = [[360, 180, 1, "b"], [0, 2, 4, "a"], [2, 4, 6, "c"]];
                assert.deepEqual(df_sort.values, expected);
                assert.deepEqual(df_sort.index, [1, 0, 2]);

            });
            it("Sort values in DataFrame by specified column in descending order", function () {
                const data = [[0, 2, 4, "a"],
                [360, 180, 360, "b"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
                const expected = [[360, 180, 360, "b"], [2, 4, 6, "c"], [0, 2, 4, "a"]];
                assert.deepEqual((df.sortValues("col1", { "ascending": false }) as DataFrame).values, expected);
            });

            it("Sort values in DataFrame by specified column in descending order (second col)", function () {
                const data = [[0, 2, 4, "a"],
                [360, 180, 1, "b"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
                const expected = [[2, 4, 6, "c"], [0, 2, 4, "a"], [360, 180, 1, "b"]];
                assert.deepEqual((df.sortValues("col3", { "ascending": false }) as DataFrame).values, expected);
            });
            it("Sort values in DataFrame by specified column containing alpha(numeric) values", function () {
                const data = [[0, 2, 4, "a"],
                [360, 180, 1, "b"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
                const expected = [[2, 4, 6, "c"], [360, 180, 1, "b"], [0, 2, 4, "a"]]
                assert.deepEqual(df.sortValues("col4", { "ascending": false }).values, expected);
            });

            it("sort works for Date string", function () {
                const data = {
                    date: ['1974-02-19', '1955-12-06', '1963-11-18']
                };
                const df = new DataFrame(data);
                const expected1 = [['1974-02-19'], ['1963-11-18'], ['1955-12-06']]
                const expected2 = [['1955-12-06'], ['1963-11-18'], ['1974-02-19']]
                assert.deepEqual(df.sortValues("date", { "ascending": false }).values, expected1);
                assert.deepEqual(df.sortValues("date", { "ascending": true }).values, expected2);
            });

            it("Sort duplicate DataFrame with duplicate columns", function () {

                const data = {
                    "A": [1, 2, 3, 4, 5, 3, 5, 6, 4, 5, 3, 4],
                    "B": [2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4]
                };

                const df = new DataFrame(data);
                const expected = [[1, 2],
                [2, 3],
                [3, 4],
                [3, 7],
                [3, 3],
                [4, 5],
                [4, 1],
                [4, 4],
                [5, 6],
                [5, 8],
                [5, 2],
                [6, 9]];
                assert.deepEqual(df.sortValues("A", { "ascending": true }).values, expected);
            });
            it("sort index in descending order and retains index", function () {
                let data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                let df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"], index: ["b", "a", "c"] });
                let df2 = df.sortIndex({ ascending: false });
                let rslt = ["c", "b", "a"];
                assert.deepEqual(df2.index, rslt);
            });

        });

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
                df_copy.addColumn("col_new", ["boy", "girl"], { inplace: true });
                assert.notDeepEqual(df_copy.values, df.values);
                assert.notDeepEqual(df_copy, df);
            });

        });


        describe("setIndex", function () {
            it("Sets the index of a DataFrame created from an Object inplace", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data);
                df.setIndex({ index: ["one", "two", "three"], inplace: true })
                assert.deepEqual(df.index, ["one", "two", "three"]);
            });
            it("Sets the index of a DataFrame from column name", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data);
                const df_new = df.setIndex({ column: "alpha" }) as DataFrame
                assert.deepEqual(df_new.index, ["A", "B", "C"]);
            });
            it("Sets the index of a DataFrame from column name", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data);
                const df_new = df.setIndex({ column: "alpha" }) as DataFrame
                assert.deepEqual(df_new.index, ["A", "B", "C"]);
            });
            it("Sets the index of a DataFrame from column name and drop column data (inplace)", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data);
                df.setIndex({ column: "alpha", drop: true, inplace: true });
                assert.deepEqual(df.index, ["A", "B", "C"]);
                assert.deepEqual(df.columns, ["val_count"]);
                assert.deepEqual(df.values, [[1], [2], [3]]);
                assert.throws(() => df["alpha"], Error,
                    "ParamError: Column not found!. Column name must be one of val_count"
                );
            });
            it("Throw error if index and column not passed", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data);
                assert.throws(() => df.setIndex({ drop: true, inplace: true }), Error,
                    "ParamError: must specify either index or column"
                );
            });

            it("Sets the index of a DataFrame from column name and drop column data", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data);
                const df_new = df.setIndex({ column: "alpha", drop: true }) as DataFrame
                assert.deepEqual(df_new.index, ["A", "B", "C"]);
                assert.deepEqual(df_new.columns, ["val_count"]);
                assert.deepEqual(df_new.values, [[1], [2], [3]]);
                assert.deepEqual(df_new["alpha"], undefined);
            });
            it("Sets the index of a DataFrame created from an Array inplace", function () {
                const data = [[0, 2, 4], [360, 180, 360], [0, 2, 4], [360, 180, 360], [0, 2, 4]];
                const df = new DataFrame(data);
                df.setIndex({ index: ["one", "two", "three", "four", "five"], "inplace": true });
                assert.deepEqual(df.index, ["one", "two", "three", "four", "five"]);
            });
            it("Throws error on wrong row length", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.throws(() => df.setIndex({ index: ["one", "two", "three", "four", "five"], "inplace": true }), Error,
                    "ParamError: index must be the same length as the number of rows"
                );
            })
            it("Throws error on column not found", function () {
                const data = [[0, 2, 4], [360, 180, 360]];
                const df = new DataFrame(data);
                assert.throws(() => df.setIndex({ column: "alpha", inplace: true }), Error,
                    "ParamError: column not found in column names"
                );
            })

        });

        describe("resetIndex", function () {
            it("Resets the index of a DataFrame created from an Object", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const df = new DataFrame(data, { index: ["one", "two", "three"] });
                const df_reset = df.resetIndex() as DataFrame
                assert.deepEqual(df_reset.index, [0, 1, 2]);
            });
            it("Resets the index of a DataFrame created from an Array inplace", function () {
                const data = [[0, 2, 4], [360, 180, 360], [0, 2, 4], [360, 180, 360], [0, 2, 4]];
                const df = new DataFrame(data, { index: ["one", "two", "three", "four", "five"] });
                df.resetIndex({ inplace: true });
                assert.deepEqual(df.index, [0, 1, 2, 3, 4]);
            });
        });


        describe("apply", function () {

            it("Apply an aggregation function to a DataFrame axis = 1", function () {
                const data = [[0, 2, 4],
                [3, 2, 2],
                [0, 2, 1]]
                const df = new DataFrame(data)

                const sum = (x: any) => {
                    return x.reduce((a: any, b: any) => a + b, 0)
                }
                const expected = [6, 7, 3]
                const dfApply = df.apply(sum, { axis: 1 })
                assert.deepEqual(dfApply.values, expected)
                assert.deepEqual(dfApply.index, [0, 1, 2])

            });
            it("Apply an aggregation function to a DataFrame axis = 0", function () {
                const data = [[0, 2, 4],
                [3, 2, 2],
                [0, 2, 1]]
                const df = new DataFrame(data, { columns: ["col1", "col2", "col3"] })

                const sum = (x: any) => {
                    return x.reduce((a: any, b: any) => a + b, 0)
                }
                const expected = [3, 6, 7]
                const dfApply = df.apply(sum, { axis: 0 })
                assert.deepEqual(dfApply.values, expected)
                assert.deepEqual(dfApply.index, ["col1", "col2", "col3"])
            });

        });

        describe("applyMap", function () {
            it("Apply an element-wise function to a DataFrame", function () {
                const data = [[0, 2, 4],
                [360, 180, 360],
                [0, 2, 4]]
                const df = new DataFrame(data)

                const add = (x: any) => {
                    return x + 1000
                }
                const expected = [[1000, 1002, 1004], [1360, 1180, 1360], [1000, 1002, 1004]]
                const dfApply = df.applyMap(add) as DataFrame
                assert.deepEqual(dfApply.values, expected)
            });

            it("Apply an element-wise function to a DataFrame", function () {
                const data = [[0, 2, 4],
                [360, 180, 360],
                [0, 2, 4],
                [0, 2, 4]]
                const df = new DataFrame(data)

                const add = (x: any) => {
                    return x + 1000
                }
                const expected = [[1000, 1002, 1004], [1360, 1180, 1360], [1000, 1002, 1004], [1000, 1002, 1004]]
                const dfApply = df.applyMap(add) as DataFrame
                assert.deepEqual(dfApply.values, expected)
            });

            it("Apply an element-wise function to a DataFrame inplace", function () {
                const data = [[0, 2, 4],
                [360, 180, 360],
                [0, 2, 4]]
                const df = new DataFrame(data)

                const add = (x: any) => {
                    return x + 1000
                }
                const expected = [[1000, 1002, 1004], [1360, 1180, 1360], [1000, 1002, 1004]]
                df.applyMap(add, { inplace: true })
                assert.deepEqual(df.values, expected)
            });

            it("Apply an element-wise function to a DataFrame inplace", function () {
                const data = [[0, 2, 4],
                [360, 180, 360],
                [0, 2, 4],
                [0, 2, 4]]
                const df = new DataFrame(data)

                const add = (x: any) => {
                    return x + 1000
                }
                const expected = [[1000, 1002, 1004], [1360, 1180, 1360], [1000, 1002, 1004], [1000, 1002, 1004]]
                df.applyMap(add, { inplace: true })
                assert.deepEqual(df.values, expected)
            });
        });

        describe("column", function () {
            it("Obtain a column from a dataframe created from object", function () {
                const data = [{ alpha: "A", val_count: 1 }, { alpha: "B", val_count: 2 }, { alpha: "C", val_count: 3 }];
                const options = { columns: ["Gender", "count"] };
                const df = new DataFrame(data, options);
                const expected = df.column("count");
                const rslt_data = [1, 2, 3];
                assert.deepEqual(expected.values, rslt_data);
            });
            it("Obtain a column from a dataframe", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                const expected = df.column("C");
                const rslt_data = [3, 6, 40, 78];
                assert.deepEqual(expected.values, rslt_data);
            });
            it("Throw Error for wrong column", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                assert.throws(() => { df.column("D"); }, Error, "ParamError: Column not found!. Column name must be one of A,B,C");

            });
        });


        describe("dropNa", function () {
            it("drop NaNs along axis 0", function () {
                const data = [[0, 2, 4],
                [360, 180, 360],
                [NaN, 180, 360]]
                const column = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: column });
                const df_val = [[2, 4],
                [180, 360],
                [180, 360]]
                assert.deepEqual((df.dropNa({ axis: 0 }) as DataFrame).values, df_val);

            });
            it("drop NaNs along axis 1", function () {
                const data = [[0, 2, 4],
                [360, 180, 360],
                [NaN, 180, 360]]
                const column = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: column });
                const df_val = [[0, 2, 4],
                [360, 180, 360]]
                assert.deepEqual((df.dropNa({ axis: 1 }) as DataFrame).values, df_val);

            });
            it("drop NaNs along axis 1", function () {
                const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const df_val = [[5, 6, 7, 8]];
                assert.deepEqual((df.dropNa({ axis: 1 }) as DataFrame).values, df_val);

            });
            it("drop inplace at axis 0, inplace false ", function () {
                const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });

                const df_val = [[1, 3], [4, 9], [6, 8]];

                assert.deepEqual((df.dropNa({ axis: 0 }) as DataFrame).values, df_val);

            });
            it("drop inplace at axis 0, inplace true ", function () {
                const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });

                const df_val = [[1, 3], [4, 9], [6, 8]];
                df.dropNa({ axis: 0, inplace: true });
                assert.deepEqual(df.values, df_val);

            });
            it("drop inplace at axis 1 at inplace true", function () {
                const data = [[NaN, 1, 2, 3], [3, 4, NaN, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });

                const df_val = [[5, 6, 7, 8]];

                df.dropNa({ axis: 1, inplace: true });
                assert.deepEqual(df.values, df_val);

            });
            it("drop works for undefined values", function () {
                let data = [[null, 1, 2, 3], [3, 4, undefined, 9], [5, 6, 7, 8]];
                let column = ["A", "B", "C", "D"];
                let df = new DataFrame(data, { columns: column });

                let df_val = [[5, 6, 7, 8]];

                df.dropNa({ axis: 1, inplace: true });
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
                df.fillNa(-999, { inplace: true });
                assert.deepEqual(df.values, expected);
            });
            it("replace all undefined value", function () {
                const data = [[undefined, 1, 2, 3], [3, 4, null, 9], [5, 6, 7, 8]];
                const columns = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: columns });

                const expected = [[-999, 1, 2, 3], [3, 4, -999, 9], [5, 6, 7, 8]];

                const df_filled = df.fillNa(-999) as DataFrame
                assert.deepEqual(df_filled.values, expected);
            });
            it("replace all undefined value with 0 works", function () {
                const data = [[undefined, 1, 2, 3], [3, 4, null, 9], [5, NaN, 7, 8]];
                const columns = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: columns });

                const expected = [[0, 1, 2, 3], [3, 4, 0, 9], [5, 0, 7, 8]];

                const df_filled = df.fillNa(0) as DataFrame
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
                const df_filled = df.fillNa([2], { columns: ["B"] }) as DataFrame;

                assert.deepEqual(df_filled.values, expected);
            });
            it("Fills column with specified values not in place", function () {
                const data = [[1, 2, 3], [4, 5, 6], [NaN, 20, 40], [NaN, -1, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                const new_vals = [[1, 2, 3], [4, 5, 6], [-2, 20, 40], [-2, -1, 78]];
                const df_filled = df.fillNa([-2], { columns: ["A"] }) as DataFrame

                assert.deepEqual(df_filled.values, new_vals);
            });

            it("Fills a list of columns with specified values", function () {
                const data = [[1, undefined, 3], [4, undefined, 6], [NaN, "boy", 40], [NaN, "girl", NaN]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                const new_vals = [[1, "girl", 3], [4, "girl", 6], [200, "boy", 40], [200, "girl", NaN]];
                const df_filled = df.fillNa([200, "girl"], { columns: ["A", "B"] }) as DataFrame
                assert.deepEqual(df_filled.values, new_vals);
            });
            it("Fills a list of columns with specified values inplace", function () {
                const data = [[1, undefined, 3], [4, undefined, 6], [NaN, "boy", 40], [NaN, "girl", 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                const new_vals = [[1, "girl", 3], [4, "girl", 6], [200, "boy", 40], [200, "girl", 78]];
                df.fillNa([200, "girl"], { columns: ["A", "B"], inplace: true });
                assert.deepEqual(df.values, new_vals);
            });
        });

        describe("selectDtypes", function () {

            it("Returns float columns in a DataFrame", function () {
                const data = [[30, 1, 2, "boy"], [3.2, 4, 30, "girl"], [5.09, 6, 7, "cat"]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const df_sub = df.selectDtypes(['float32']);
                assert.deepEqual(df_sub.values, [[30], [3.2], [5.09]]);
            });

            it("Returns int columns in a DataFrame", function () {
                const data = [[30, 1, 2, "boy"],
                [3.2, 4, 30, "girl"],
                [5.09, 6, 7, "cat"]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const df_sub = df.selectDtypes(['int32']);
                assert.deepEqual(df_sub.values, [[1, 2], [4, 30], [6, 7]]);
            });

            it("Returns string columns in a DataFrame", function () {
                const data = [[30, 1, 2, "boy"],
                [3.2, 4, 30, "girl"],
                [5.09, 6, 7, "cat"]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const df_sub = df.selectDtypes(['string']);
                assert.deepEqual(df_sub.values, [["boy"], ["girl"], ["cat"]]);
            });

            it("Returns string and float columns in a DataFrame", function () {
                const data = [[30, 1, 2, "boy"],
                [3.2, 4, 30, "girl"],
                [5.09, 6, 7, "cat"]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const df_sub = df.selectDtypes(['string', 'float32']);
                assert.deepEqual(df_sub.values, [[30, "boy"], [3.2, "girl"], [5.09, "cat"]]);
            });

            it("Returns int and float columns in a DataFrame", function () {
                const data = [[30, 1, 2, "boy"],
                [3.2, 4, 30, "girl"],
                [5.09, 6, 7, "cat"]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const df_sub = df.selectDtypes(['int32', 'float32']);
                assert.deepEqual(df_sub.values, [[30, 1, 2], [3.2, 4, 30], [5.09, 6, 7]]);
            });
        });


        describe("lt", function () {
            it("Returns Less than of DataFrame and other DataFrame (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

                const df = new DataFrame(data1);
                const df2 = new DataFrame(data2);
                const expected = [[true, true, true, false],
                [false, false, false, false]];
                assert.deepEqual(df.lt(df2).values, expected);
            });

            it("Return Less than of series and scalar (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const sf = new DataFrame(data1);
                const expected = [[true, false, false, true],
                [true, true, true, true]];
                assert.deepEqual(sf.lt(30).values, expected);
            });
            it("Return Less than of series and DataFrame along axis 1", function () {
                const data1 = [[10, 45, 56, 10],
                [23, 20, 10, 10]];
                const sf = new Series([10, 23, 56, 100]);
                const df = new DataFrame(data1);
                const expected = [[false, false, false, true], [false, true, true, true]];
                assert.deepEqual(df.lt(sf, { axis: 1 }).values, expected);
            });

            it("Return Less than of Array and DataFrame along axis 1", function () {
                const data1 = [[10, 45, 56, 10], [23, 20, 10, 10]];
                const sf = [10, 23, 56, 100];
                const df = new DataFrame(data1);
                const expected = [[false, false, false, true], [false, true, true, true]];
                assert.deepEqual(df.lt(sf, { axis: 1 }).values, expected);
            });
            it("Return Less than of series and DataFrame along axis 0", function () {
                const data1 = [[10, 45, 56, 10],
                [23, 20, 10, 10]];
                const sf = new Series([10, 23]);
                const df = new DataFrame(data1);
                const expected = [[false, false, false, false], [false, true, true, true]];
                const result = df.lt(sf, { axis: 0 })
                assert.deepEqual(result.values, expected);
            });

            it("Return Less than of Array and DataFrame along axis 0", function () {
                const data1 = [[10, 45, 56, 10], [23, 20, 10, 10]];
                const sf = [10, 23];
                const df = new DataFrame(data1);
                const expected = [[false, false, false, false], [false, true, true, true]];
                const result = df.lt(sf, { axis: 0 })
                assert.deepEqual(result.values, expected);
            });

        });

        describe("gt", function () {
            it("Return Greater than of series and other series (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

                const df = new DataFrame(data1);
                const df2 = new DataFrame(data2);
                const expected = [[false, false, false, true], [false, true, true, false]];
                assert.deepEqual(df.gt(df2).values, expected);
            });

            it("Return Greater than of series scalar (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const sf = new DataFrame(data1);
                const expected = [[false, true, true, false], [false, false, false, false]];
                assert.deepEqual(sf.gt(30).values, expected);
            });

            it("Return Less than of Array and DataFrame scalar along axis 1", function () {
                const data1 = [[10, 45, 56, 10], [23, 20, 10, 10]];
                const sf = [10, 23, 56, 100];
                const df = new DataFrame(data1);
                const expected = [[false, true, false, false], [true, false, false, false]];
                assert.deepEqual(df.gt(sf, { axis: 1 }).values, expected);
            });
            it("Return Less than of Array and DataFrame scalar along axis 0", function () {
                const data1 = [[10, 45, 56, 10], [23, 20, 10, 10]];
                const sf = [10, 23];
                const df = new DataFrame(data1);
                const expected = [[false, true, true, false], [false, false, false, false]];
                assert.deepEqual(df.gt(sf, { axis: 0 }).values, expected);
            });

        });

        describe("le", function () {
            it("Return Less than or Equal to of series and other series (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

                const df = new DataFrame(data1);
                const df2 = new DataFrame(data2);
                const expected = [[true, true, true, false], [true, false, false, true]];
                assert.deepEqual(df.le(df2).values, expected);
            });

            it("Return Less than or Equal to of series scalar (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
                const sf = new DataFrame(data1);
                const expected = [[true, false, false, true], [true, true, true, true]];
                assert.deepEqual(sf.le(30).values, expected);
            });

        });

        describe("ge", function () {
            it("Return Greater than or Equal to of series and other series (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

                const df = new DataFrame(data1);
                const df2 = new DataFrame(data2);
                const expected = [[false, false, false, true], [true, true, true, true]];
                assert.deepEqual(df.ge(df2).values, expected);
            });

            it("Return Greater than or Equal to of series scalar (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
                const sf = new DataFrame(data1);
                const expected = [[false, true, true, false], [false, false, true, false]];
                assert.deepEqual(sf.ge(30).values, expected);
            });

        });

        describe("ne", function () {
            it("Return Not Equal to of series and other series (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

                const df = new DataFrame(data1);
                const df2 = new DataFrame(data2);
                const expected = [[true, true, true, true], [false, true, true, false]];
                assert.deepEqual(df.ne(df2).values, expected);
            });

            it("Return Not Equal to of series scalar (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
                const sf = new DataFrame(data1);
                const expected = [[true, true, true, true], [true, true, false, true]];
                assert.deepEqual(sf.ne(30).values, expected);
            });
            it("Return Less than of Array and DataFrame along axis 1 (column)", function () {
                const data = {
                    'cost': [250, 150, 100],
                    'revenue': [100, 250, 300]
                }
                const sf = [100, 300]
                const df = new DataFrame(data, { index: ['A', 'B', 'C'] })
                const expected = [[true, true], [true, true], [false, false]];
                const result = df.ne(sf, { axis: 1 })
                assert.deepEqual(result.values, expected);
            });

        });

        describe("eq", function () {
            it("Return Equal to of DataFrame and other DataFrame (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 20, 10]];
                const data2 = [[100, 450, 590, 5], [25, 2, 0, 10]];

                const df = new DataFrame(data1);
                const df2 = new DataFrame(data2);
                const expected = [[false, false, false, false], [true, false, false, true]];
                assert.deepEqual(df.eq(df2).values, expected);
            });

            it("Return Equal to of DataFrame with scalar (element-wise)", function () {
                const data1 = [[10, 45, 56, 10], [25, 23, 30, 10]];
                const sf = new DataFrame(data1);
                const expected = [[false, false, false, false], [false, false, true, false]];
                assert.deepEqual(sf.eq(30).values, expected);
            });
            it("Return Equal to of series and DataFrame scalar along axis 1", function () {
                const data1 = { "Col1": [10, 45, 56, 10], "Col2": [23, 20, 10, 10] };
                const sf = new Series([10, 23]);
                const df = new DataFrame(data1);
                const expected = [[true, true], [false, false], [false, false], [true, false]];
                assert.deepEqual(df.eq(sf, { axis: 1 }).values, expected);
            });
            it("Return Less than of Array and DataFrame along axis 0", function () {
                const data = {
                    'cost': [250, 150, 100],
                    'revenue': [100, 250, 300]
                }
                const sf = [250, 250, 100]
                const df = new DataFrame(data, { index: ['A', 'B', 'C'] })
                const expected = [[true, false], [false, true], [true, false]];
                const result = df.eq(sf, { axis: 0 })
                assert.deepEqual(result.values, expected);
            });

        });

        describe("replace", function () {
            it("Replace across all columns", function () {
                const data1 = [[10, 45, 56, 25], [23, 20, 10, 24]];
                const df = new DataFrame(data1);
                const expected = [[-999, 45, 56, 25], [23, 20, -999, 24]];
                const df_rep = df.replace(10, -999) as DataFrame
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace accross all columns inplace", function () {
                const data1 = [["A", "A", "A", "B"], ["B", "C", "C", "D"]];
                const df = new DataFrame(data1);
                const expected = [["boy", "boy", "boy", "B"], ["B", "C", "C", "D"]];
                df.replace("A", "boy", { inplace: true });
                assert.deepEqual(df.values, expected);
            });
            it("Replace values in specified two column(s)", function () {
                const data1 = [["A", "A", 1, "girl"],
                ["B", "A", 2, "woman"],
                ["A", "B", 3, "man"]];
                const df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] });
                const expected = [["boy", "boy", 1, "girl"],
                ["B", "boy", 2, "woman"],
                ["boy", "B", 3, "man"]];
                const df_rep = df.replace("A", "boy", { columns: ["col1", "col2"] }) as DataFrame
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace values in specified single column(s)", function () {
                const data1 = [[2, "A", 1, "girl"],
                [3, "A", 2, "woman"],
                [4, "B", 3, "man"]];
                const df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] });
                const expected = [[2, "A", 1, "girl"],
                [100, "A", 2, "woman"],
                [4, "B", 3, "man"]];
                const df_rep = df.replace(3, 100, { columns: ["col1"] }) as DataFrame
                assert.deepEqual(df_rep.values, expected);
                assert.notDeepEqual(df_rep, df);
                assert.notDeepEqual(df_rep.values, df.values);
            });

            it("Replace values in specified two column(s) inplace", function () {
                const data1 = [["A", "A", 1, "girl"],
                ["B", "A", 2, "woman"],
                ["A", "B", 3, "man"]];
                const df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] });
                const expected = [["boy", "boy", 1, "girl"],
                ["B", "boy", 2, "woman"],
                ["boy", "B", 3, "man"]];
                df.replace("A", "boy", { columns: ["col1", "col2"], inplace: true });
                assert.deepEqual(df.values, expected);
            });

            it("Replace values in specified single column(s) inplace", function () {
                const data1 = [[2, "A", 1, "girl"],
                [3, "A", 2, "woman"],
                [4, "B", 3, "man"]];
                const df = new DataFrame(data1, { columns: ["col1", "col2", "col3", "col4"] });
                const expected = [[2, "A", 1, "girl"],
                [100, "A", 2, "woman"],
                [4, "B", 3, "man"]];
                df.replace(3, 100, { columns: ["col1"], inplace: true });
                assert.deepEqual(df.values, expected);
            });

            it("Replace oldValue supports falsy numbers (0)", function () {
                const data1 = [[0, 19, 84, 0], [65, 0, 0, 37]];
                const df = new DataFrame(data1);
                const expected = [[1, 19, 84, 1], [65, 1, 1, 37]];
                const df_rep = df.replace(0, 1) as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace oldValue does not support NaN", function () {
                const data1 = [[NaN, 19, 84, NaN], [65, NaN, NaN, 37]];
                const df = new DataFrame(data1);
                assert.throws(() => df.replace(NaN, 1), Error, "Params Error: Param 'oldValue' does not support NaN. Use DataFrame.fillNa() instead.");
            });

            it("Replace oldValue supports falsy strings", function () {
                const data1 = [['', 'hello', 'world', ''], ['foo', '', '', 'bar']];
                const df = new DataFrame(data1);
                const expected = [['danfo', 'hello', 'world', 'danfo'], ['foo', 'danfo', 'danfo', 'bar']];
                const df_rep = df.replace('', 'danfo') as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace oldValue supports falsy booleans", function () {
                const data1 = [[false, 'hello', 'world', false], ['foo', false, false, 'bar']];
                const df = new DataFrame(data1);
                const expected = [[true, 'hello', 'world', true], ['foo', true, true, 'bar']];
                const df_rep = df.replace(false, true) as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace newValue supports falsy numbers (0)", function () {
                const data1 = [[1, 19, 84, 1], [65, 1, 1, 37]];
                const df = new DataFrame(data1);
                const expected = [[0, 19, 84, 0], [65, 0, 0, 37]];
                const df_rep = df.replace(1, 0) as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace newValue supports falsy numbers (NaN)", function () {
                const data1 = [[1, 19, 84, 1], [65, 1, 1, 37]];
                const df = new DataFrame(data1);
                const expected = [[NaN, 19, 84, NaN], [65, NaN, NaN, 37]];
                const df_rep = df.replace(1, NaN) as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace newValue supports falsy strings", function () {
                const data1 = [['danfo', 'hello', 'world', 'danfo'], ['foo', 'danfo', 'danfo', 'bar']];
                const df = new DataFrame(data1);
                const expected = [['', 'hello', 'world', ''], ['foo', '', '', 'bar']];
                const df_rep = df.replace('danfo', '') as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

            it("Replace newValue supports falsy booleans", function () {
                const data1 = [[true, 'hello', 'world', true],  ['foo', true, true, 'bar']];
                const df = new DataFrame(data1);
                const expected = [[false, 'hello', 'world', false], ['foo', false, false, 'bar']];
                const df_rep = df.replace(true, false) as DataFrame;
                assert.deepEqual(df_rep.values, expected);
            });

        });

        describe("sum", function () {
            it("Sum values of a DataFrame by Default axis column (axis=1)", function () {
                const data1 = [[30, 40, 3.1],
                [5, 5, 5.1],
                [5, 5, 3.2]];
                const sf = new DataFrame(data1);
                const res = [73.1, 15.1, 13.2];
                assert.deepEqual(sf.sum().values, res);
            });
            it("Sum values of a DataFrame along row axis (axis=0)", function () {
                const data1 = [[30, 40, 3.1],
                [5, 5, 5.1],
                [5, 5, 3.2]];
                const df = new DataFrame(data1);
                const res = [40, 50, 11.399999999999999];
                assert.deepEqual(df.sum({ axis: 0 }).values, res);
            });
            it("Sum values of a mixed DataFrame along row axis (axis=0)", function () {
                const data1 = [[30, 40, 3.1, true],
                [5, 5, 5.1, true],
                [5, 5, 3.2, true]];
                const df = new DataFrame(data1);
                const res = [40, 50, 11.399999999999999, 3];
                assert.deepEqual(df.sum({ axis: 0 }).values, res);
            });
            it("Sum values of a boolean DataFrame along row axis (axis=0)", function () {
                const data1 = [[true, true, false, true],
                [false, false, false, false],
                [false, true, true, false]];
                const df = new DataFrame(data1);
                const res = [1, 2, 1, 1];
                assert.deepEqual(df.sum({ axis: 0 }).values, res);
            });
            it("Sum values of a boolean DataFrame along default column axis (axis=1)", function () {
                const data1 = [[true, true, false, true],
                [false, false, false, false],
                [false, true, true, false]];
                const df = new DataFrame(data1);
                const res = [3, 0, 2];
                assert.deepEqual(df.sum().values, res);
            });
            it("Sum values of a df with missing values", function () {
                const data1 = [[11, 20, 3], [null, 15, 6], [2, 30, 40], [2, 89, 78]];
                const df = new DataFrame(data1);
                const res = [34, 21, 72, 169]
                assert.deepEqual(df.sum({ axis: 1 }).values, res);
            });

        });

        describe("abs", function () {
            it("Returns the absolute values in DataFrame of ints", function () {
                const data1 = [[-10, 45, 56, 10], [-25, 23, 20, -10]];
                const df = new DataFrame(data1);
                const expected = [[10, 45, 56, 10], [25, 23, 20, 10]];
                assert.deepEqual((df.abs() as DataFrame).values, expected);
            });

            it("Returns the absolute values in mixed DataFrame", function () {
                const data1 = [[-10, -45.1, 56, 10], [-25, -23.2, 20, -10]];
                const df = new DataFrame(data1);
                const expected = [[10, 45.1, 56, 10], [25, 23.2, 20, 10]];
                assert.deepEqual((df.abs() as DataFrame).values, expected);
            });
        });

        describe("T", function () {
            it("Return the Transpose of a DataFrame", function () {
                const data1 = [[10, 45, 56, 10],
                [25, 23, 20, 10]];

                const cols = ["a", "b", "c", "d"];
                const df = new DataFrame(data1, { columns: cols });
                const df_trans = df.T;
                const expected_vals = [[10, 25], [45, 23], [56, 20], [10, 10]];
                const expected_index = cols;
                const expected_col_names = ["0", "1"];
                assert.deepEqual(df_trans.index, expected_index);
                assert.deepEqual(df_trans.values, expected_vals);
                assert.deepEqual(df_trans.columns, expected_col_names);

            });
        });

        describe("transpose", function () {
            it("Return the Transpose of a DataFrame", function () {
                const data1 = [[10, 45, 56, 10],
                [25, 23, 20, 10]];

                const cols = ["a", "b", "c", "d"];
                const df = new DataFrame(data1, { columns: cols });
                const df_trans = df.T;
                const expected_vals = [[10, 25], [45, 23], [56, 20], [10, 10]];
                const expected_index = cols;
                const expected_col_names = ["0", "1"];
                assert.deepEqual(df_trans.index, expected_index);
                assert.deepEqual(df_trans.values, expected_vals);
                assert.deepEqual(df_trans.columns, expected_col_names);

            });
            it("Transpose a DataFrame inplace", function () {
                const data1 = [[10, 45, 56, 10],
                [25, 23, 20, 10]];

                const cols = ["a", "b", "c", "d"];
                const df = new DataFrame(data1, { columns: cols });
                df.transpose({ inplace: true });
                const expected_vals = [[10, 25], [45, 23], [56, 20], [10, 10]];
                const expected_index = cols;
                const expected_col_names = ["0", "1"];
                assert.deepEqual(df.index, expected_index);
                assert.deepEqual(df.values, expected_vals);
                assert.deepEqual(df.columns, expected_col_names);

            });
        });


        describe("asType", function () {
            it("set type of float column to int", function () {
                const data = {
                    "A": [-20.1, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20.1, -20.23, 30.3, 40.11],
                    "D": ["a", "b", "c", "c"]
                };
                const df = new DataFrame(data);
                const dfNew = df.asType("A", "int32") as DataFrame
                dfNew["D"] = ["a", "b", "c", "F"];
                assert.deepEqual(dfNew.dtypes, ['int32', 'int32', 'float32', 'string']);
                assert.deepEqual(dfNew['A'].values, [-20, 30, 47, -20]);
                assert.notDeepEqual(dfNew["D"].values, df["D"].values);

            });
            it("set type of int column to float", function () {
                const data = {
                    "A": [-20.1, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20.1, -20.23, 30.3, 40.11],
                    "D": ["a", "b", "c", "c"]
                };
                const df = new DataFrame(data);
                const dfNew = df.asType("B", "float32") as DataFrame

                assert.deepEqual(dfNew.dtypes, ['float32', 'float32', 'float32', 'string']);
                assert.deepEqual(dfNew['B'].values, [34, -4, 5, 6]);

            });
            it("set type of string column to int", function () {
                const data = {
                    "A": [-20.1, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20.1, -20.23, 30.3, 40.11],
                    "D": ["20.1", "21", "23.4", "50.78"]
                };
                const df = new DataFrame(data);
                const dfNew = df.asType("D", "int32") as DataFrame

                assert.deepEqual(dfNew.dtypes, ['float32', 'int32', 'float32', 'int32']);
                assert.deepEqual(dfNew['D'].values, [20, 21, 23, 50]);

            });
            it("set type of string column to float", function () {
                const data = {
                    "A": [-20.1, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20.1, -20.23, 30.3, 40.11],
                    "D": ["20.1", "21", "23.4", "50.78"]
                };
                const df = new DataFrame(data);
                const dfNew = df.asType("D", "float32") as DataFrame

                assert.deepEqual(dfNew.dtypes, ['float32', 'int32', 'float32', 'float32']);
                assert.deepEqual(dfNew['D'].values, [20.1, 21, 23.4, 50.78]);

            });
        });

        describe("nUnique", function () {
            it("Returns the number of unique elements along axis 1", function () {
                const data = {
                    "A": [-20, 30, 47.3, -20, 2],
                    "B": [34, -4, 5, 6, 2],
                    "C": [20, 20, 30, 30, 2],
                    "D": ["a", "b", "c", "c", "d"]
                };

                const df = new DataFrame(data);
                const res = [4, 4, 4, 4, 2];
                assert.deepEqual(df.nUnique(1).values, res);

            });
            it("Returns the number of unique elements along axis 0", function () {
                const data = {
                    "A": [20, 30, 47.3, 30],
                    "B": [34, -4, 5, 30],
                    "C": [20, 20, 30, 30],
                    "D": ["a", "b", "c", "c"]
                };

                const df = new DataFrame(data);
                const res = [3, 4, 2, 3];
                assert.deepEqual(df.nUnique(0).values, res);

            });

        });


        describe("rename", function () {
            it("Rename columns along axis 1", function () {
                const data = {
                    "A": [-20, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20, 20, 30, 30],
                };

                const df = new DataFrame(data);
                const dfNew = df.rename({ "A": "a1", "B": "b1" }) as DataFrame
                const res = ["a1", "b1", "C",];
                assert.deepEqual(dfNew.columns, res);

            });
            it("confirms original column name is not modified along axis 1", function () {
                const data = {
                    "A": [-20, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "D": ["a", "b", "c", "c"]
                };

                const df = new DataFrame(data);
                const dfNew = df.rename({ "A": "a1", "B": "b1" }, { axis: 1 })
                const res = ["A", "B", "D"];
                assert.deepEqual(df.columns, res);

            });
            it("Rename columns along axis 1 inplace", function () {
                const data = {
                    "A": [-20, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20, 20, 30, 30],
                };

                const df = new DataFrame(data);
                df.rename({ "A": "a1", "B": "b1" }, { inplace: true });
                const res = ["a1", "b1", "C"];
                assert.deepEqual(df.columns, res);

            });
            it("Rename string index along axis 0", function () {
                const data = {
                    "A": [-20, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20, 20, 30, 30],
                };

                const df = new DataFrame(data, { index: ["a", "b", "c", "d"] });
                const dfNew = df.rename({ "a": 0, "b": 1 }, { axis: 0 }) as DataFrame
                const res = [0, 1, "c", "d"];
                assert.deepEqual(dfNew.index, res);

            });
            it("Rename string index along axis 0 inplace", function () {
                const data = {
                    "A": [-20, 30, 47.3, -20],
                    "B": [34, -4, 5, 6],
                    "C": [20, 20, 30, 30],
                };

                const df = new DataFrame(data, { index: ["a", "b", "c", "d"] });
                df.rename({ "a": 0, "b": 1 }, { axis: 0, inplace: true });
                const res = [0, 1, "c", "d"];
                assert.deepEqual(df.index, res);

            });
            it("Get new column via subseting works after rename (inplace)", function () {
                let data = {
                    "A": [-20, 30, 47.3],
                    "B": [34, -4, 5],
                    "C": [20, 2, 30]
                };
                let df = new DataFrame(data);
                df.rename({ "A": "new_name" }, { inplace: true });
                df["new_name"].print();
                assert.deepEqual(df["new_name"].values, data["A"]);
            });

            it("Get new column via subseting works after rename (not-inplace)", function () {
                let data = {
                    "A": [-20, 30, 47.3],
                    "B": [34, -4, 5],
                    "C": [20, 2, 30]
                };
                let df = new DataFrame(data);
                let new_df = df.rename({ "A": "new_name" });
                assert.deepEqual(new_df["new_name"].values, data["A"]);
            });
        });

        describe("sortIndex", function () {

            it("sort index in ascending order", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"], index: ["b", "a", "c"] });
                const df2 = df.sortIndex() as DataFrame
                const rslt = [[360, 180, 360, 'a'], [0, 2, 4, 'b'], [2, 4, 6, 'c']];

                assert.deepEqual(df2.values, rslt);
            });
            it("sort index in ascending order - inplace", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"], index: ["b", "a", "c"] });
                df.sortIndex({ inplace: true });
                const rslt = [[360, 180, 360, 'a'], [0, 2, 4, 'b'], [2, 4, 6, 'c']];
                assert.deepEqual(df.values, rslt);
            });
            it("sort index in descending order", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"], index: ["b", "a", "c"] });
                const df2 = df.sortIndex({ ascending: false }) as DataFrame
                const rslt = [[2, 4, 6, 'c'], [0, 2, 4, 'b'], [360, 180, 360, 'a']];

                assert.deepEqual(df2.values, rslt);
            });
            it("sort index in descending order with inplace set to true", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"], index: [4, 2, 5] });
                df.sortIndex({ ascending: false, inplace: true });
                const rslt = [[2, 4, 6, 'c'], [0, 2, 4, 'b'], [360, 180, 360, 'a']];
                assert.deepEqual(df.values, rslt);
            });
        });

        describe("append", function () {

            it("Append works for an array", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data);
                const expected_val = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"],
                [20, 40, 60, "d"]];

                const newDf = df.append([20, 40, 60, "d"], ["n1"]) as DataFrame
                assert.deepEqual(newDf.values, expected_val);
                assert.deepEqual(newDf.index, [0, 1, 2, "n1"]);
            });
            it("Append works for an array of arrays", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data);
                const expected_val = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"],
                [20, 40, 60, "d"],
                [21, 42, 61, "y"]];

                const newDf = df.append([[20, 40, 60, "d"], [21, 42, 61, "y"]], ["n1", "n2"]) as DataFrame
                assert.deepEqual(newDf.values, expected_val);
                assert.deepEqual(newDf.index, [0, 1, 2, "n1", "n2"]);
            });

            it("Append works for DataFrame", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
                const df2 = new DataFrame([[20, 40, 60, "d"]], { "columns": ["col1", "col2", "col3", "col4"] });

                const expected_val = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"],
                [20, 40, 60, "d"]];

                const newDf = df.append(df2, ["n1"]) as DataFrame
                assert.deepEqual(newDf.values, expected_val);

            });
            it("Append works for Series", function () {
                const data = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"]];

                const df = new DataFrame(data, { "columns": ["col1", "col2", "col3", "col4"] });
                const sf = new Series([20, 40, 60, "d"]);

                const expected_val = [[0, 2, 4, "b"],
                [360, 180, 360, "a"],
                [2, 4, 6, "c"],
                [20, 40, 60, "d"]];

                const newDf = df.append(sf, ["n1"]) as DataFrame
                assert.deepEqual(newDf.values, expected_val);

            });
        });

        describe("cumProd", function () {

            it("cumProd works for axis 1", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 2, 4, 12],
                [3, 12, 132, 1188],
                [5, 30, 210, 1680]]

                const newDf = df.cumProd() as DataFrame
                assert.deepEqual(newDf.values, rslt);
            });
            it("cumProd axis 0 works", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [6, 4, 22, 27],
                [30, 24, 154, 216]]

                assert.deepEqual((df.cumProd({ axis: 0 }) as DataFrame).values, rslt);
            });

            it("cumProd works for axis 1 inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 2, 4, 12],
                [3, 12, 132, 1188],
                [5, 30, 210, 1680]]

                df.cumProd({ inplace: true })
                assert.deepEqual(df.values, rslt);
            });
            it("cumProd axis 0 works inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [6, 4, 22, 27],
                [30, 24, 154, 216]]
                df.cumProd({ axis: 0, inplace: true })
                assert.deepEqual(df.values, rslt);
            });
        });

        describe("cumSum", function () {

            it("cumSum works for axis 1", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 3, 5, 8],
                [3, 7, 18, 27],
                [5, 11, 18, 26]]

                const newDf = df.cumSum() as DataFrame
                assert.deepEqual(newDf.values, rslt);
            });
            it("cumSum axis 0 works", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [5, 5, 13, 12],
                [10, 11, 20, 20]]

                assert.deepEqual((df.cumSum({ axis: 0 }) as DataFrame).values, rslt);
            });

            it("cumSum works for axis 1 inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 3, 5, 8],
                [3, 7, 18, 27],
                [5, 11, 18, 26]]

                df.cumSum({ inplace: true })
                assert.deepEqual(df.values, rslt);
            });
            it("cumSum axis 0 works inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [5, 5, 13, 12],
                [10, 11, 20, 20]]
                df.cumSum({ axis: 0, inplace: true })
                assert.deepEqual(df.values, rslt);
            });
        });

        describe("cumMin", function () {

            it("cumMin works for axis 1", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 1, 1],
                [3, 3, 3, 3],
                [5, 5, 5, 5]]

                const newDf = df.cumMin() as DataFrame
                assert.deepEqual(newDf.values, rslt);
            });
            it("cumMin axis 0 works", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [2, 1, 2, 3],
                [2, 1, 2, 3]]

                assert.deepEqual((df.cumMin({ axis: 0 }) as DataFrame).values, rslt);
            });

            it("cumMin works for axis 1 inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 1, 1],
                [3, 3, 3, 3],
                [5, 5, 5, 5]]

                df.cumMin({ inplace: true })
                assert.deepEqual(df.values, rslt);
            });
            it("cumMin axis 0 works inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [2, 1, 2, 3],
                [2, 1, 2, 3]]
                df.cumMin({ axis: 0, inplace: true })
                assert.deepEqual(df.values, rslt);
            });
        });

        describe("cumMax", function () {

            it("cumMax works for axis 1", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 2, 2, 3],
                [3, 4, 11, 11],
                [5, 6, 7, 8]]

                const newDf = df.cumMax() as DataFrame
                assert.deepEqual(newDf.values, rslt);
            });
            it("cumMax axis 0 works", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [3, 4, 11, 9],
                [5, 6, 11, 9]]

                assert.deepEqual((df.cumMax({ axis: 0 }) as DataFrame).values, rslt);
            });

            it("cumMax works for axis 1 inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 2, 2, 3],
                [3, 4, 11, 11],
                [5, 6, 7, 8]]

                df.cumMax({ inplace: true })
                assert.deepEqual(df.values, rslt);
            });
            it("cumMax axis 0 works inplace", function () {
                const data = [[2, 1, 2, 3], [3, 4, 11, 9], [5, 6, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = [[2, 1, 2, 3],
                [3, 4, 11, 9],
                [5, 6, 11, 9]]
                df.cumMax({ axis: 0, inplace: true })
                assert.deepEqual(df.values, rslt);
            });
        });


        describe("query", function () {

            it("Get the DataFrame containing rows with the filtered column", function () {
                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                const query_df = df.query(df["B"].ge(5)) as DataFrame
                const query_data = [[4, 5, 6], [20, 30, 40], [39, 89, 78]]
                assert.deepEqual(query_df.values, query_data);
            });
            it("Get the Dataframe containing rows with the filtered column in String values", function () {
                const data = { "Abs": [20, 30, 47], "Count": [34, 4, 5], "country code": ["NG", "FR", "GH"] };
                const cols = ["Abs", "Count", "country code"];
                const df = new DataFrame(data, { columns: cols });
                const query_df = df.query(df["country code"].str.includes("NG")) as DataFrame

                const query_data = [[20, 34, "NG"]];
                assert.deepEqual(query_df.values, query_data);
            });
            it("Get the Dataframe containing rows with the filtered column in String values inplace", function () {
                const data = { "Abs": [20, 30, 47], "Count": [34, 4, 5], "country code": ["NG", "FR", "GH"] };
                const cols = ["Abs", "Count", "country code"];
                const df = new DataFrame(data, { columns: cols });
                df.query(df["country code"].eq("NG"), { inplace: true });
                const query_data = [[20, 34, "NG"]];
                assert.deepEqual(df.values, query_data);
            });
            it("Confirms that query index are updated", function () {

                const data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });
                const query_df = df.query(df["B"].ge(5)) as DataFrame
                assert.deepEqual(query_df.index, [1, 2, 3]);
            });

            it("Confirms chaining boolean queries work", function () {

                const data = [[1, 2, 3],
                [4, 5, 60],
                [20, 30, 4],
                [39, 89, 7]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });

                const query_df = df.query(
                    df["B"].ge(5).and(df["C"].lt(10))
                ) as DataFrame
                const query_data = [[20, 30, 4], [39, 89, 7]];
                assert.deepEqual(query_df.values, query_data)
                assert.deepEqual(query_df.index, [2, 3]);
            });

            it("Confirms chaining boolean queries work and returns empty DF", function () {

                const data = [[1, 2, 3],
                [4, 5, 60],
                [20, 30, 40],
                [39, 89, 70]];
                const cols = ["A", "B", "C"];
                const df = new DataFrame(data, { columns: cols });

                const query_df = df.query(
                    df["B"].ge(5).and(df["C"].lt(10))
                ) as DataFrame
                assert.deepEqual(query_df.values, []);
                assert.deepEqual(query_df.index, []);
            });

            it("Confirms that column names are not changed", function () {

                let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]];
                let cols = ["A", "B", "C"];
                let df = new DataFrame(data, { columns: cols });
                let df_query = df.query(df["B"].ge(5));
                assert.deepEqual(df_query.index, [1, 2, 3]);
                assert.deepEqual(df_query.columns, ["A", "B", "C"]);
            });

        });

        describe("cTypes", function () {

            it("Returns the correct dtype in a DataFrame", function () {
                const data = [["boy", 1.2, 2, 3], ["girl", 4.32, 11, 9], ['4', 6.1, 7, 8]];
                const column = ["A", "B", "C", "D"];
                const df = new DataFrame(data, { columns: column });
                const rslt = ["string", "float32", "int32", "int32"]
                assert.deepEqual(df.ctypes.values, rslt);
            });
        });

        describe("getDummies", function () {
            it("getDummies works on DataFrame", function () {

                const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
                const columns = ["A", "B", "C", "d"];
                const df = new DataFrame(data, { columns: columns });

                const df1 = df.getDummies({ prefixSeparator: ["_", "#"], columns: ["A", "d"], prefix: "test" }) as DataFrame
                const expectedColumns = ['B', 'C', 'test_1', 'test_3', 'test_4', 'test#fat', 'test#good', 'test#best']
                const expected = [['dog', 1.0, 1, 0, 0, 1, 0, 0],
                ['fog', 2.0, 0, 1, 0, 0, 1, 0],
                ['gof', 3.0, 0, 0, 1, 0, 0, 1]]
                assert.deepEqual(df1.values, expected);
                assert.deepEqual(df1.columns, expectedColumns);

            });
            it("Throw error if the prefix specified is not equal to the column specified", function () {

                const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
                const columns = ["A", "B", "C", "d"];
                const df = new DataFrame(data, { columns: columns });

                assert.throws(function () { df.getDummies({ prefix: ["fg"], prefixSeparator: "_", columns: ["A", "d"] }); }, Error,
                    `ParamError: prefix and data array must be of the same length. If you need to use the same prefix, then pass a string param instead. e.g {prefix: "fg"}`);

            });
            it("replace column sepecified with prefix", function () {

                const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
                const columns = ["A", "B", "C", "d"];
                const df = new DataFrame(data, { columns: columns });

                const df1 = df.getDummies({ prefix: ["F", "G"], prefixSeparator: "_", columns: ["A", "d"] }) as DataFrame
                const expectedColumns = [
                    'B', 'C',
                    'F_1', 'F_3',
                    'F_4', 'G_fat',
                    'G_good', 'G_best'
                ];

                const expected = [['dog', 1.0, 1, 0, 0, 1, 0, 0],
                ['fog', 2.0, 0, 1, 0, 0, 1, 0],
                ['gof', 3.0, 0, 0, 1, 0, 0, 1]]

                assert.deepEqual(df1.values, expected);
                assert.deepEqual(df1.columns, expectedColumns);

            });

            it("getDummies auto infers and encode columns with string dtype", function () {

                const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
                const columns = ["A", "B", "C", "d"];
                const df = new DataFrame(data, { columns: columns });

                const df1 = df.getDummies({ prefixSeparator: "_" }) as DataFrame
                const expectedColumns = [
                    'A', 'C',
                    'B_dog', 'B_fog',
                    'B_gof', 'd_fat',
                    'd_good', 'd_best'
                ];
                const expected = [
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
                assert.deepEqual(df1.values, expected);
                assert.deepEqual(df1.columns, expectedColumns);

            });

            it("should one hot encode all other columns", function () {

                const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
                const columns = ["A", "B", "C", "d"];
                const df = new DataFrame(data, { columns: columns })
                const rslt = [
                    [1, 'dog', 1, 1, 0, 0],
                    [3, 'fog', 2, 0, 1, 0],
                    [4, 'gof', 3, 0, 0, 1]
                ]

                assert.deepEqual((df.getDummies({ columns: ["d"] }) as DataFrame).values, rslt)

            });
        });

        describe("iat", function () {
            it("iat works on DataFrame", function () {
                const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
                const columns = ["a", "b", "c", "d"];
                const df = new DataFrame(data, { columns });
                assert.equal(df.iat(0, 0), 1);
                assert.equal(df.iat(1, 1), 6);
                assert.equal(df.iat(2, 3), 12);
            });
            it("throws error on string indices", function () {
                const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
                const columns = ["a", "b", "c", "d"];
                const index = ["A", "B", "C"];
                const df = new DataFrame(data, { columns, index });
                /* @ts-ignore */
                assert.throws(function () { df.iat("A", 0); }, Error, "ParamError: row and column index must be an integer. Use .at to get a row or column by label.");
                /* @ts-ignore */
                assert.throws(function () { df.iat(0, "A"); }, Error, "ParamError: row and column index must be an integer. Use .at to get a row or column by label.");
            });
        })

        describe("at", function () {
            it("at works on DataFrame", function () {
                const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
                const columns = ["a", "b", "c", "d"];
                const index = ["A", "B", "C"]
                const df = new DataFrame(data, { columns, index });
                assert.equal(df.at("A", "a"), 1);
                assert.equal(df.at("B", "b"), 6);
                assert.equal(df.at("C", "c"), 11);

            });
            it("throws error on numeric column index", function () {
                const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
                const columns = ["a", "b", "c", "d"];
                const index = [0, "B", "C"]
                const df = new DataFrame(data, { columns, index });

                assert.equal(df.at(0, "b"), 2);
                /* @ts-ignore */
                assert.throws(function () { df.at(0, 1); }, Error, "ParamError: column index must be a string. Use .iat to get a row or column by index.");
                /* @ts-ignore */
                assert.throws(function () { df.at("B", 0); }, Error, "ParamError: column index must be a string. Use .iat to get a row or column by index.");

            });

        });

    describe("DateTime datetime is supported", function () {
        it("DateTime datetime is supported", function () {
            let data = [["Alice", 2, new Date(2029, 1, 1)],
            ["Bob", 5, new Date(2019, 1, 2)],
            ["Charlie", 30, new Date(2019, 1, 3)],
            ["Dennis", 89, new Date(2019, 1, 4)]];

            let columns = ["Name", "Count", "Date"];

            let df = new DataFrame(data, { columns: columns });
            assert.deepEqual(df.dtypes, ["string", "int32", "datetime"]);

            const dateValues = [new Date(2029, 1, 1), new Date(2019, 1, 2), new Date(2019, 1, 3), new Date(2019, 1, 4)]
            assert.deepEqual(df["Date"].values, dateValues);
        });

        it("datetime column properties can be accessed", function () {
            let data = [["Alice", 2, new Date("2029-01-01 01:00:00")],
            ["Bob", 5, new Date("2019-01-02")],
            ["Charlie", 30, new Date("2020-01-03 01:00:20")],
            ["Dennis", 89, new Date("2022-02-04 02:16:00")]];

            let columns = ["Name", "Count", "Date"];

            let df = new DataFrame(data, { columns: columns });

            assert.deepEqual(df["Date"].dt.year().values, [2029, 2019, 2020, 2022]);
            assert.deepEqual(df["Date"].dt.month().values, [0, 0, 0, 1]);
            assert.deepEqual(df["Date"].dt.dayOfMonth().values, [1, 2, 3, 4]);
            assert.deepEqual(df["Date"].dt.hours().values, [1, 0, 1, 2]);
            assert.deepEqual(df["Date"].dt.minutes().values, [0, 0, 0, 16]);
            assert.deepEqual(df["Date"].dt.seconds().values, [0, 0, 20, 0]);

        })

        it("datetime column created from dtype passed", function () {
            let data = [["Alice", 2, "2029-01-01 01:00:00"],
            ["Bob", 5, "2019-01-02"],
            ["Charlie", 30, "2020-01-03 01:00:20"],
            ["Dennis", 89, "2022-02-04 02:16:00"]];

            let columns = ["Name", "Count", "Date"];
            let dtypes = ["string", "int32", "datetime"]

            let df = new DataFrame(data, { columns, dtypes });

            assert.deepEqual(df["Date"].dt.year().values, [2029, 2019, 2020, 2022]);
            assert.deepEqual(df["Date"].dt.month().values, [0, 0, 0, 1]);
            assert.deepEqual(df["Date"].dt.dayOfMonth().values, [1, 2, 3, 4]);
            assert.deepEqual(df["Date"].dt.hours().values, [1, 0, 1, 2]);
            assert.deepEqual(df["Date"].dt.minutes().values, [0, 0, 0, 16]);
            assert.deepEqual(df["Date"].dt.seconds().values, [0, 0, 20, 0]);

        });
    });
});

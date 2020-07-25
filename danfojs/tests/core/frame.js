import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'
import { Series } from "../../src/core/series";
// import {to_date_time} from '../../src/core/timeseries'

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
            assert.throws(function () { df.drop("D", { axis: 1, inplace: false }) }, Error, 'column "D" does not exist');
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
        it("throw error for wrong row index", function () {
            let data = [[1, 2, 3], [4, 5, 6]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            assert.throws(function () { df.loc({ "rows": [0, 8], "columns": ["B", "C"] }) }, Error, "Specified row index 8 is bigger than maximum row index of 1");
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
            let col_data = [[2, 3], [5, 6], [30, 40]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": ["0:2"], "columns": ["B", "C"] })
            let col_data = [[2, 3], [5, 6], [30, 40]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": [0, 1], "columns": ["A:C"] })
            let col_data = [[1, 2, 3], [4, 5, 6]]
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
            let col_data = [[2, 3], [5, 6], [30, 40]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": ["0:2"], "columns": [1, 2] })
            let col_data = [[2, 3], [5, 6], [30, 40]]

            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": [0, 1, 2], "columns": ["1:2"] })
            let col_data = [[2, 3], [5, 6], [30, 40]]
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
            let data = [[0, 2, 4],[360, 180, 360]]
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

    describe("query", function () {

        it("Get the DataFrame containing rows with the filtered column", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let query_df = df.query({ "column": "B", "operator": ">=", "value": 5 })
            let query_data = [[4, 5, 6], [20, 30, 40], [39, 89, 78]]
            assert.deepEqual(query_df.values, query_data)
        });
        it("Print Error for value key not specified", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "column": "B", "operator": ">=" }) }, Error, "specify value");
        });
        it("Print Error for operator key not specified", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "column": "B", "value": 5 }) }, Error, "specify operator");
        });

        it("Print Error for column key not specified", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "operator": ">=", "value": 5 }) }, Error, "specify the column");
        });
        it("Print Error for column name not in dataframe", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            assert.throws(function () { df.query({ "column": "D", "operator": ">=", "value": 5 }) }, Error, "column D does not exist");
        });

    });

    describe("addColumn", function () {
        it("Print the data, after a new column is added ", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let new_col = [1, 2, 3, 4]

            df.addColumn({ "column": "D", "value": new_col });

            let new_data = [[1, 2, 3, 1], [4, 5, 6, 2], [20, 30, 40, 3], [39, 89, 78, 4]];

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
    });

    describe("groupby", function () {
        it("Check group by One column data", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A"]);

            let group_dict = {
                '1': [[1, 2, 3]],
                '4': [[4, 5, 6]],
                '20': [[20, 30, 40]],
                '39': [[39, 89, 78]]
            }

            assert.deepEqual(group_df.col_dict, group_dict);
        });
        it("Obtain the DataFrame of one of the group", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A"]);
            let new_data = [[1, 2, 3]]

            assert.deepEqual(group_df.get_groups([1]).values, new_data);
        });
        it("Check group by Two column data", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A", "B"]);
            let new_data = {
                '1': { '2': [[1, 2, 3]] },
                '4': { '5': [[4, 5, 6]] },
                '20': { '30': [[20, 30, 40]] },
                '39': { '89': [[39, 89, 78]] }
            }

            assert.deepEqual(group_df.col_dict, new_data);
        });

        it("Obtain the DataFrame of one of the group, grouped by two column", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A", "B"]);
            let new_data = [[1, 2, 3]]

            assert.deepEqual(group_df.get_groups([1, 2]).values, new_data);
        });

        it("Count column in group", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A", "B"]);
            let new_data = {
                '1': { '2': [1] },
                '4': { '5': [1] },
                '20': { '30': [1] },
                '39': { '89': [1] }
            }

            assert.deepEqual(group_df.col(["C"]).count(), new_data);
        });
        it("sum column element in group", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A", "B"]);
            let new_data = {
                '1': { '2': [3] },
                '4': { '5': [6] },
                '20': { '30': [40] },
                '39': { '89': [78] }
            }

            assert.deepEqual(group_df.col(["C"]).sum(), new_data);
        });

        it("sum column element group by one column", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A"]);

            let new_data = { '1': [2, 3], '4': [5, 6], '20': [30, 40], '39': [89, 78] }

            assert.deepEqual(group_df.col(["B", "C"]).sum(), new_data);
        });


    });

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

    describe("Concatenate", function () {

        it("Check the axis 0 concatenation", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let data1 = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols1 = ["A", "B", "C"]
            let df1 = new DataFrame(data1, { columns: cols1 })

            let data2 = [[1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]
            let cols2 = ["A", "B", "C", "D"]
            let df2 = new DataFrame(data2, { columns: cols2 })

            let new_df = DataFrame.concat({ "df_list": [df, df1, df2], "axis": 0 })

            let data_values = [[1, 2, 3, "NaN"], [4, 5, 6, "NaN"], [20, 30, 40, "NaN"], [39, 89, 78, "NaN"],
            [1, 2, 3, "NaN"], [4, 5, 6, "NaN"], [20, 30, 40, "NaN"], [39, 89, 78, "NaN"],
            [1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]

            assert.deepEqual(new_df.values, data_values);
        });

        it("Check the axis 1 concatenation", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let data1 = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols1 = ["A", "B", "C"]
            let df1 = new DataFrame(data1, { columns: cols1 })

            let data2 = [[1, 2, 3, 5], [4, 5, 6, 8], [20, 30, 40, 10]]
            let cols2 = ["A", "B", "C", "D"]
            let df2 = new DataFrame(data2, { columns: cols2 })

            let new_df = DataFrame.concat({ "df_list": [df, df1, df2], "axis": 1 })

            let data_values = [[1, 2, 3, 1, 2, 3, 1, 2, 3, 5], [4, 5, 6, 4, 5, 6, 4, 5, 6, 8],
            [20, 30, 40, 20, 30, 40, 20, 30, 40, 10], [39, 89, 78, 39, 89, 78, "NaN",
                "NaN", "NaN", "NaN"]]
            assert.deepEqual(new_df.values, data_values);
        });
    });

    describe("Merge", function () {

        it("test outer merge", function () {
            let data = [['K0', 'k0', 'A0', 'B0'], ['k0', 'K1', 'A1', 'B1'],
            ['K1', 'K0', 'A2', 'B2'], ['K2', 'K2', 'A3', 'B3']]

            let data2 = [['K0', 'k0', 'C0', 'D0'], ['K1', 'K0', 'C1', 'D1'],
            ['K1', 'K0', 'C2', 'D2'], ['K2', 'K0', 'C3', 'D3']]

            let colum1 = ['Key1', 'Key2', 'A', 'B']
            let colum2 = ['Key1', 'Key2', 'A', 'D']

            let df1 = new DataFrame(data, { columns: colum1 })
            let df2 = new DataFrame(data2, { columns: colum2 })
            let merge_df = DataFrame.merge({ "left": df1, "right": df2, "on": ["Key1", "Key2"], "how": "outer" })

            let output_data = [
                ['K0', 'k0', 'A0', 'B0', 'C0', 'D0'],
                ['k0', 'K1', 'A1', 'B1', 'NaN', 'NaN'],
                ['K1', 'K0', 'A2', 'B2', 'C1', 'D1'],
                ['K1', 'K0', 'A2', 'B2', 'C2', 'D2'],
                ['K2', 'K2', 'A3', 'B3', 'NaN', 'NaN'],
                ['K2', 'K0', 'NaN', 'NaN', 'C3', 'D3']
            ];


            assert.deepEqual(merge_df.values, output_data);
        })

        it("test inner merge", function () {
            let data = [['K0', 'k0', 'A0', 'B0'], ['k0', 'K1', 'A1', 'B1'],
            ['K1', 'K0', 'A2', 'B2'], ['K2', 'K2', 'A3', 'B3']]

            let data2 = [['K0', 'k0', 'C0', 'D0'], ['K1', 'K0', 'C1', 'D1'],
            ['K1', 'K0', 'C2', 'D2'], ['K2', 'K0', 'C3', 'D3']]

            let colum1 = ['Key1', 'Key2', 'A', 'B']
            let colum2 = ['Key1', 'Key2', 'A', 'D']

            let df1 = new DataFrame(data, { columns: colum1 })
            let df2 = new DataFrame(data2, { columns: colum2 })
            let merge_df = DataFrame.merge({ "left": df1, "right": df2, "on": ["Key1", "Key2"], "how": "inner" })

            let output_data = [
                ['K0', 'k0', 'A0', 'B0', 'C0', 'D0'],
                ['K1', 'K0', 'A2', 'B2', 'C1', 'D1'],
                ['K1', 'K0', 'A2', 'B2', 'C2', 'D2']
            ];

            assert.deepEqual(merge_df.values, output_data);
        })

        it("test left merge", function () {
            let data = [['K0', 'k0', 'A0', 'B0'], ['k0', 'K1', 'A1', 'B1'],
            ['K1', 'K0', 'A2', 'B2'], ['K2', 'K2', 'A3', 'B3']]

            let data2 = [['K0', 'k0', 'C0', 'D0'], ['K1', 'K0', 'C1', 'D1'],
            ['K1', 'K0', 'C2', 'D2'], ['K2', 'K0', 'C3', 'D3']]

            let colum1 = ['Key1', 'Key2', 'A', 'B']
            let colum2 = ['Key1', 'Key2', 'A', 'D']

            let df1 = new DataFrame(data, { columns: colum1 })
            let df2 = new DataFrame(data2, { columns: colum2 })
            let merge_df = DataFrame.merge({ "left": df1, "right": df2, "on": ["Key1", "Key2"], "how": "left" })

            let output_data = [
                ['K0', 'k0', 'A0', 'B0', 'C0', 'D0'],
                ['k0', 'K1', 'A1', 'B1', 'NaN', 'NaN'],
                ['K1', 'K0', 'A2', 'B2', 'C1', 'D1'],
                ['K1', 'K0', 'A2', 'B2', 'C2', 'D2'],
                ['K2', 'K2', 'A3', 'B3', 'NaN', 'NaN']
            ];

            assert.deepEqual(merge_df.values, output_data);
        })

        it("test right merge", function () {
            let data = [['K0', 'k0', 'A0', 'B0'], ['k0', 'K1', 'A1', 'B1'],
            ['K1', 'K0', 'A2', 'B2'], ['K2', 'K2', 'A3', 'B3']]

            let data2 = [['K0', 'k0', 'C0', 'D0'], ['K1', 'K0', 'C1', 'D1'],
            ['K1', 'K0', 'C2', 'D2'], ['K2', 'K0', 'C3', 'D3']]

            let colum1 = ['Key1', 'Key2', 'A', 'B']
            let colum2 = ['Key1', 'Key2', 'A', 'D']

            let df1 = new DataFrame(data, { columns: colum1 })
            let df2 = new DataFrame(data2, { columns: colum2 })
            let merge_df = DataFrame.merge({ "left": df1, "right": df2, "on": ["Key1", "Key2"], "how": "right" })

            let output_data = [
                ['K0', 'k0', 'A0', 'B0', 'C0', 'D0'],
                ['K1', 'K0', 'A2', 'B2', 'C1', 'D1'],
                ['K1', 'K0', 'A2', 'B2', 'C2', 'D2'],
                ['K2', 'K0', 'NaN', 'NaN', 'C3', 'D3']
            ];

            assert.deepEqual(merge_df.values, output_data);
        })
    });

    describe("Apply", function () {

        it("Apply math operation on dataframe at axis 1", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let rslt = [6, 15, 90, 206]

            let apply_rslt = df.apply({
                axis: 1, callable: (x) => {
                    return x.sum()
                }
            })

            assert.deepEqual(apply_rslt, rslt)
        });

        it("Apply tensor operation on dataframe at axis 0", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let rslt = [64, 126, 127]

            let apply_rslt = df.apply({
                axis: 0, callable: (x) => {
                    return x.sum()
                }
            })

            assert.deepEqual(apply_rslt, rslt)

        })
    });
});

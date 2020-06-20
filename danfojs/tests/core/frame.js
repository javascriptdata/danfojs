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

        });
        it("check data after row and column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": ["0:2"], "columns": ["B:C"] })
            let col_data = [[2, 3],[5,6],[30,40]]
            
            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": ["0:2"], "columns": ["B","C"] })
            let col_data = [[2, 3],[5,6],[30,40]]
            
            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.loc({ "rows": [0,1], "columns": ["A:C"] })
            let col_data = [[1,2,3],[4,5,6]]
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
        it("check data after row and column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": ["0:2"], "columns": ["1:2"] })
            let col_data = [[2, 3],[5,6],[30,40]]
            
            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after row slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": ["0:2"], "columns": [1,2] })
            let col_data = [[2, 3],[5,6],[30,40]]
            
            assert.deepEqual(col_df.values, col_data)

        })
        it("check data after column slice", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let col_df = df.iloc({ "rows": [0,1,2], "columns": ["1:2"] })
            let col_data = [[2, 3],[5,6],[30,40]]
            assert.deepEqual(col_df.values, col_data)

        })

    });

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

    describe("addColumn",function(){
        it("Print the data, after a new column is added ",function(){
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let new_col = [1,2,3,4]

            df.addColumn({"column":"D","value":new_col});

            let new_data = [[1, 2, 3, 1], [4, 5, 6, 2], [20, 30, 40, 3], [39, 89, 78, 4]];

            assert.deepEqual(df.values, new_data);
        });
        it("Print the Dataframe column names, after a new column is added ",function(){
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })

            let new_col = [1,2,3,4]

            df.addColumn({"column":"D","value":new_col});

            let new_column = ["A","B","C","D"]

            assert.deepEqual(df.column_names, new_column);
        });
        it("Print Error for column name not in keyword passed", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_col = [1,2,3,4]

            assert.throws(function () { df.addColumn({"value":new_col}); }, Error, "column name not specified");
        });
        it("Check if new column value length is the same with Dataframe length", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let new_col = [1,2,3]

            assert.throws(function () { df.addColumn({"column":"D","value":new_col}); }, Error, "Array length 3 not equal to 4");
        });
    });

    describe("groupby",function(){
        it("Check group by One column data", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A"]);

            let group_dict = {
                '1': [ [ 1, 2, 3 ]],
                '4': [ [ 4, 5, 6 ] ],
                '20': [ [ 20, 30, 40 ] ],
                '39': [ [ 39, 89, 78 ] ]
              }

            assert.deepEqual(group_df.col_dict,group_dict);
        });
        it("Obtain the DataFrame of one of the group", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A"]);
            let new_data =  [ [ 1, 2, 3 ]]

            assert.deepEqual(group_df.get_groups([1]).values,new_data);
        });
        it("Check group by Two column data", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A","B"]);
            let new_data =  {
                '1': { '2': [ [ 1, 2, 3 ] ] },
                '4': { '5': [ [4, 5, 6] ]},
                '20': {'30': [ [20, 30, 40] ]},
                '39': { '89': [ [39, 89, 78] ] }
              }

            assert.deepEqual(group_df.col_dict,new_data);
        });

        it("Obtain the DataFrame of one of the group, grouped by two column", function () {

            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let group_df = df.groupby(["A","B"]);
            let new_data =  [ [ 1, 2, 3 ]]

            assert.deepEqual(group_df.get_groups([1,2]).values,new_data);
        });

    });

    describe("column", function(){

        it("Obtain a column from a dataframe",function(){
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
            let cols = ["A", "B", "C"]
            let df = new DataFrame(data, { columns: cols })
            let col_data = df.column("A")

            let rslt_data = [ 1, 4, 20, 39]

            assert.deepEqual(col_data.arraySync(), rslt_data);
        })
    });

});

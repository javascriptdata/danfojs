// import { assert } from "chai"
// import {DataFrame} from '../../src/core/frame'

// describe("DataFrame",function (){

//     it("throw error for wrong row index", function(){
//         let data=[[1,2,3],[4,5,6]]
//         let cols=["A","B","C"]
//         let df = new DataFrame(data,cols)
//         assert.throws(function (){df.drop(3,axis=0,inplace=false)},Error, "Index does not exist");
//     })
//     it("throw error for wrong row index", function(){
//         let data=[[1,2,3],[4,5,6]]
//         let cols=["A","B","C"]
//         let df = new DataFrame(data,cols)
//         assert.throws(function (){df.drop("D",axis=1,inplace=false)},Error, "column D does not exist");
//     })

//     it("drop a column inplace", function(){
//         let data=[[1,2,3],[4,5,6]]
//         let cols=["A","B","C"]
//         let df = new DataFrame(data,cols)
//         df.drop("C",axis=1,inplace=true);
//         let column = ["A","B"]
//         assert.deepEqual(df.columns, column);
//     })
//     it("check if data is updated after column is dropped", function(){
//         let data=[[1,2,3],[4,5,6]]
//         let cols=["A","B","C"]
//         let df = new DataFrame(data,cols)
//         df.drop("C",axis=1,inplace=true);
//         let new_data = [[1,2],[4,5]] 
//         assert.deepEqual(df.values, new_data);
//     })

//     it("check if data is updated after row is dropped", function(){
//         let data=[[1,2,3],[4,5,6]]
//         let cols=["A","B","C"]
//         let df = new DataFrame(data,cols)
//         df.drop(0,axis=0,inplace=true);
//         let new_data = [[4,5,6],] 
//         assert.deepEqual(df.values, new_data);
//     })
//     it("check if new dataframe is properly created after column is dropped (not-in-inplace)", function(){
//         let data=[[1,2,3],[4,5,6]]
//         let cols=["A","B","C"]
//         let df = new DataFrame(data,cols)
//         let df_drop = df.drop("C",axis=1,inplace=false);

//         let expected_data =[[1,2],[4,5]]
//         let expected_cols =["A","B"]
//         let expected_df = new DataFrame(expected_data,expected_cols)
//         assert.deepEqual(df_drop, expected_df);
//     })

// });

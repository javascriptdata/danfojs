import { assert } from "chai"
import DataFrame from '../../src/core/frame'
import * as tf from '@tensorflow/tfjs'

describe("DataFrame",function (){

    it("throw error for wrong row index", function(){
        data=[[1,2,3],[4,5,6]]
        cols=["A","B","C"]
        let df = new DataFrame(data,cols)
        assert.deepEqual(df.values, data)
        // assert.throws(function (){df.drop(3,axis=0,inplace=false)},Error, "Index does not exist");
    })
    // it("throw error for wrong row index", function(){
    //     let df = new DataFrame(data=[[1,2,3],[4,5,6]],columns=["A","B","C"])
    //     assert.throws(function (){df.drop("D",axis=1,inplace=false)},Error, "column D does not exist");
    // })

    // it("drop a column", function(){
    //     let df = new DataFrame(data=[[1,2,3],[4,5,6]],columns=["A","B","C"])
    //     df.drop("C",axis=1,inplace=true);
    //     let column = ["A","B"]
    //     assert.deepEqual(df.columns, column);
    // })
    // it("check if data is updated after column is droped", function(){
    //     let df = new DataFrame(data=[[1,2,3],[4,5,6]],columns=["A","B","C"])
    //     df.drop("C",axis=1,inplace=true);
    //     let data = [[1,2],[4,5]] 
    //     assert.deepEqual(df.values, data);
    // })

    // it("check if data is updated after row is droped", function(){
    //     let df = new DataFrame(data=[[1,2,3],[4,5,6]],columns=["A","B","C"])
    //     df.drop(0,axis=0,inplace=true);
    //     let data = [[4,5,6],] 
    //     assert.deepEqual(df.values, data);
    // })
    // it("check if new dataframe is properly created after column is droped", function(){
    //     let df = new DataFrame(data=[[1,2,3],[4,5,6]],columns=["A","B","C"])
    //     let df2 = df.drop("C",axis=1,inplace=false);
    //     let df3 = new DataFrame(data=[[1,2],[4,5]], columns=["A","B"]) 
    //     assert.deepEqual(df2, df3);
    // })

});

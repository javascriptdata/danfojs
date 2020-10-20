import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'
import {concat} from '../../src/core/concat'
import { Series } from "../../src/core/series";



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

        let new_df = concat({ "df_list": [df, df1, df2], "axis": 0 })

        let data_values = [[1, 2, 3, NaN], [4, 5, 6, NaN], [20, 30, 40, NaN], [39, 89, 78, NaN],
        [1, 2, 3, NaN], [4, 5, 6, NaN], [20, 30, 40, NaN], [39, 89, 78, NaN],
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

        let new_df = concat({ "df_list": [df, df1, df2], "axis": 1 })

        let data_values = [[1, 2, 3, 1, 2, 3, 1, 2, 3, 5], [4, 5, 6, 4, 5, 6, 4, 5, 6, 8],
        [20, 30, 40, 20, 30, 40, 20, 30, 40, 10], [39, 89, 78, 39, 89, 78, NaN,
            NaN, NaN, NaN]]
        assert.deepEqual(new_df.values, data_values);
    });

    it("concatenate dataframe and series along 0 axis",function(){

        let data1 = [1,2,3,4]
        let data2 = [3,4,5,6]

        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
        let cols = ["A", "B", "C"]
        let df = new DataFrame(data, { columns: cols })

        let s1 = new Series(data1)
        let s2 = new Series(data2)
        let rslt = [
            [ 1, 2, 3, NaN ],
            [ 4, 5, 6, NaN ],
            [ 20, 30, 40, NaN ],
            [ 39, 89, 78, NaN ],
            [ NaN, NaN, NaN, 1 ],
            [ NaN, NaN, NaN, 2 ],
            [ NaN, NaN, NaN, 3 ],
            [ NaN, NaN, NaN, 4 ]
          ]
           

        let con = concat({ "df_list": [df,s1], "axis": 0 })

        assert.deepEqual(con.values, rslt)

    })

    it("concatenate dataframe and series along axis 1",function(){

        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
        let cols = ["A", "B", "C"]
        let df = new DataFrame(data, { columns: cols })

        let data1 = [1,2,3,4]
        let s1 = new Series(data1)
        let rslt = [
            [ 1, 2, 3, 1 ],
            [ 4, 5, 6, 2 ],
            [ 20, 30, 40, 3 ],
            [ 39, 89, 78, 4 ]
          ]
           

        let con = concat({ "df_list": [df,s1], "axis": 1 })

        assert.deepEqual(con.values, rslt)

    })
    it("concatenate series along axis 1",function(){

        let data1 = [1,2,3,4]
        let data2 = [3,4,5,6]

        let s1 = new Series(data1)
        let s2 = new Series(data2)
        let rslt = [ [ 1, 3 ], [ 2, 4 ], [ 3, 5 ], [ 4, 6 ] ]
           

        let con = concat({ "df_list": [s1,s2], "axis": 1 })

        assert.deepEqual(con.values, rslt)

    })
    it("concatenate series along axis 0",function(){

        let data1 = [1,2,3,4]
        let data2 = [3,4,5,6]

        let s1 = new Series(data1)
        let s2 = new Series(data2)
        let rslt = [
            1, 2, 3, 4,
            3, 4, 5, 6
          ]
           
        let con = concat({ "df_list": [s1,s2], "axis": 0 })

        assert.deepEqual(con.values, rslt)

    })

    it("test if df_list is an array", function(){

        assert.throws(function () { concat({"df_list":23,"axis":0}) }, Error, 'df_list must be an Array of dataFrames/Series');

    })
    it("assign default axis for concating", function(){
        let data1 = [1,2,3,4]
        let data2 = [3,4,5,6]

        let s1 = new Series(data1)
        let s2 = new Series(data2)
        let rslt = [ [ 1, 3 ], [ 2, 4 ], [ 3, 5 ], [ 4, 6 ] ]
           

        let con = concat({ "df_list": [s1,s2], "axis": 12 })

        assert.deepEqual(con.values, rslt)
    });
    it("ensure axis is a number", function(){
        let data1 = [1,2,3,4]
        let data2 = [3,4,5,6]

        let s1 = new Series(data1)
        let s2 = new Series(data2)

        assert.throws(function () { concat({"df_list":[s1,s2],"axis":"r"}) }, Error, 'axis must be a number');
    });

});

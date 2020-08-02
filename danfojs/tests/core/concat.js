import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'
import {concat} from '../../src/core/concat'



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
});

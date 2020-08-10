import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'

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
        let new_data = [
            [ '1', '2', 1 ],
            [ '4', '5', 1 ],
            [ '20', '30', 1 ],
            [ '39', '89', 1 ]
          ]

        assert.deepEqual(group_df.col(["C"]).count().values, new_data);
    });
    it("sum column element in group", function () {

        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
        let cols = ["A", "B", "C"]
        let df = new DataFrame(data, { columns: cols })
        let group_df = df.groupby(["A", "B"]);
        let new_data = [
            [ '1', '2', 3 ],
            [ '4', '5', 6 ],
            [ '20', '30', 40 ],
            [ '39', '89', 78 ]
          ]
        assert.deepEqual(group_df.col(["C"]).sum().values, new_data);
    });

    it("sum column element group by one column", function () {

        let data = [[1, 2, 3], [1, 5, 6], [20, 30, 40], [39, 89, 78]]
        let cols = ["A", "B", "C"]
        let df = new DataFrame(data, { columns: cols })
        let group_df = df.groupby(["A","B"]);

        let new_data = [
            [ '1', '2', 2, 3 ],
            [ '1', '5', 5, 6 ],
            [ '20', '30', 30, 40 ],
            [ '39', '89', 89, 78 ]
          ]

        assert.deepEqual(group_df.col(["B", "C"]).sum().values, new_data);
    });

    it("Perform aggregate on column for groupby", function () {

        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78]]
        let cols = ["A", "B", "C"]
        let df = new DataFrame(data, { columns: cols })
        let group_df = df.groupby(["A", "B"]);
        let new_data = [
            [ '1', '2', 2, 1 ],
            [ '4', '5', 5, 1 ],
            [ '20', '30', 30, 1 ],
            [ '39', '89', 89, 1 ]
          ]

        assert.deepEqual(group_df.agg({ "B": "mean", "C": "count" }).values, new_data);
    });


});

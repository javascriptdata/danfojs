import { assert } from "chai";
import { DataFrame, Series, getDummies } from "../../dist/danfojs-node/src";

describe("DummyEncoder", function () {
    it("getDummies works on Series", function () {

        const data = ["dog", "male", "female", "male", "female", "male", "dog"];
        const series = new Series(data);
        const df = getDummies(series, { prefix: "test", prefixSeparator: "/" });

        const dfValues = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0]
        ];
        const dfColumns = ['test/dog', 'test/male', 'test/female'];
        assert.deepEqual(df.values, dfValues);
        assert.deepEqual(df.columns, dfColumns);
    });
    it("getDummies works on Series with default prefix and prefixSeperator", function () {

        const data = ["dog", "male", "female", "male", "female", "male", "dog"];
        const series = new Series(data);
        const df = getDummies(series);

        const dfValues = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0]
        ];
        const dfColumns = ['0_dog', '1_male', '2_female'];
        assert.deepEqual(df.values, dfValues);
        assert.deepEqual(df.columns, dfColumns);
    });

    it("getDummies works on DataFrame", function () {

        const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
        const columns = ["A", "B", "C", "d"];
        const df = new DataFrame(data, { columns: columns });

        const df1 = getDummies(df, { prefixSeparator: ["_", "#"], columns: ["A", "d"], prefix: "test" });
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

        assert.throws(function () { getDummies(df, { prefix: ["fg"], prefixSeparator: "_", columns: ["A", "d"] }); }, Error,
            `ParamError: prefix and data array must be of the same length. If you need to use the same prefix, then pass a string param instead. e.g {prefix: "fg"}`);

    });
    it("replace column sepecified with prefix", function () {

        const data = [[1, "dog", 1.0, "fat"], [3, "fog", 2.0, "good"], [4, "gof", 3.0, "best"]];
        const columns = ["A", "B", "C", "d"];
        const df = new DataFrame(data, { columns: columns });

        const df1 = getDummies(df, { prefix: ["F", "G"], prefixSeparator: "_", columns: ["A", "d"] });
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

        const df1 = getDummies(df, { prefixSeparator: "_" });
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
        const df = new DataFrame(data, { columns: columns });
        const rslt = [
            [1, 'dog', 1, 1, 0, 0],
            [3, 'fog', 2, 0, 1, 0],
            [4, 'gof', 3, 0, 0, 1]
        ]

        assert.deepEqual(getDummies(df, { columns: ["d"] }).values, rslt)

    });


    it("Dummification works for object DF", function () {

        let data = {
            fruits: ['pear', 'mango', "pawpaw", "mango", "bean"],
            Count: [20, 30, 89, 12, 30],
            Country: ["NG", "NG", "GH", "RU", "RU"]
        };

        let df = new DataFrame(data);
        const expected = [
            [
                20, 1, 0, 0,
                0, 1, 0, 0
            ],
            [
                30, 0, 1, 0,
                0, 1, 0, 0
            ],
            [
                89, 0, 0, 1,
                0, 0, 1, 0
            ],
            [
                12, 0, 1, 0,
                0, 0, 0, 1
            ],
            [
                30, 0, 0, 0,
                1, 0, 0, 1
            ]
        ];

        let dum_df = getDummies(df, { prefixSeparator: "_" });
        assert.deepEqual(dum_df.values, expected);

    });
});

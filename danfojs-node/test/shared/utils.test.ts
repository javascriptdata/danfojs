import { assert } from "chai";
import { Utils } from "../../build";

const utils = new Utils();

describe("Utils", function () {
    it("removes an element from an array", function () {
        let arr = [1, 2, 3, 4];
        assert.deepEqual(utils.removeElementFromArray(arr, 2), [1, 2, 4]);
    });

    it("Checks if variable is a string", function () {
        let arr = ["1", "2"];
        assert.isTrue(utils.isString(arr[0]));
    });

    it("Checks if variable is a number", function () {
        let arr = [1, 2, 3, 4];
        assert.isTrue(utils.isNumber(arr[0]));
    });

    it("Checks if value is null", function () {
        let val = null;
        let val2 = 1;
        assert.isTrue(utils.isNull(val));
        assert.isFalse(utils.isNull(val2));
    });

    it("Checks if value is undefined", function () {
        let arr;
        assert.isTrue(utils.isUndefined(arr));
    });

    it("Generate number betwee two set of values", function () {
        let start = 0;
        let end = 5;
        let data = [0, 1, 2, 3, 4, 5];
        assert.deepEqual(utils.range(start, end), data);
    });

    it("transposes an array", function () {
        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40]];
        let result = [[1, 4, 20], [2, 5, 30], [3, 6, 40]];
        assert.deepEqual(utils.transposeArray(data), result);
    });

    describe("inferDtype", function () {
        it("Returns string type present in an 1D array", function () {
            let data = ['Alice', 'Boy', 'Girl', "39"];
            let result = ['string'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns float type present in an 1D array", function () {
            let data = [1.1, 2.1, 3.2, 4.4];
            let result = ['float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns int type present in an 1D array", function () {
            let data = [1, 2, 3, 45];
            let result = ['int32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });
        it("Returns float when there's a mixture of int and float in a 1D array", function () {
            let data = [1, 2.1, 3, 45];
            let result = ['float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns float type when NaN is present in an 1D array", function () {
            let data = [1, 2, 3, 45, NaN];
            let result = ['float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns correct dtype if NaN present in data", function () {
            let data = utils.transposeArray([
                [18.7, 17.4, 18, NaN, 19.3],
                [20, NaN, 19, 18, 20]])
            let result = ['float32', 'float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns the data type present in an 2D array", function () {
            let data = utils.transposeArray([['Alice', 'Boy', 'Girl', "39"], [2, 5, 30, 89], [3.1, 6.1, 40.1, 78.2]])
            let result = ['string', 'int32', 'float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns the string dtype when there's a mixture of dtypes in a 2D array", function () {
            let data = utils.transposeArray([['Alice', 'Boy', 'Girl', 21], [2, 5, 30, "hey"], [3, 6, 40.1, 78.2]])
            let result = ['string', 'string', 'float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns bool type in a 1D array", function () {
            let data = [true, true, false, false, false, true];
            let result = ['boolean'];
            assert.deepEqual(utils.inferDtype(data), result);
        });
        it("Returns bool type in a 2D array", function () {
            let data = utils.transposeArray([[true, false, true], ["boy", "girl", "man"], [20, 30, 24]])
            let result = ['boolean', 'string', 'int32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

        it("Returns string type if values are all NaN", function () {
            let data = utils.transposeArray([[true, false, true], ["boy", "girl", "boy"], [NaN, NaN, NaN]])
            let result = ['boolean', 'string', 'float32'];
            assert.deepEqual(utils.inferDtype(data), result);
        });

    });

    describe("mapIntegersToBooleans", function () {
        it("map ints to bools in array of arrays", function () {
            let data = [[1, 0, 1], [1, 1, 0]];
            assert.deepEqual(utils.mapIntegersToBooleans(data, 2), [[true, false, true], [true, true, false]]);
        });

        it("map ints to bools in array", function () {
            let data = [1, 0, 0, 1, 1];
            assert.deepEqual(utils.mapIntegersToBooleans(data, 1), [true, false, false, true, true]);
        });
    });

    describe("round", function () {
        it("round elements in array to 1 dp", function () {
            let data = [10.01, 2.2, 3.11, 20.505, 20.22, 40.0909];
            assert.deepEqual(utils.round(data, 1, true), [10.0, 2.2, 3.1, 20.5, 20.2, 40.1]);
        });

        it("round elements in array to 2 dp", function () {
            let data = [10.019, 2.2099, 3.1145, 20.506, 20.22, 40.0909];
            assert.deepEqual(utils.round(data, 2, true), [10.02, 2.21, 3.11, 20.51, 20.22, 40.09]);
        });
    });

    describe("replaceUndefinedWithNaN", function () {
        it("replace undefined in Series with NaN", function () {
            let data = [10.01, 2.2, undefined, 20.505, 20.22, undefined];
            assert.deepEqual(utils.replaceUndefinedWithNaN(data, true), [10.01, 2.2, NaN, 20.505, 20.22, NaN]);
        });

        it("replace undefined in DataFrame with NaN", function () {
            let data = [[10.01, 2.2, undefined, 20.505, 20.22, undefined],
            [10.01, undefined, undefined, 20.505, 20, undefined]];

            let result = [[10.01, 2.2, NaN, 20.505, 20.22, NaN],
            [10.01, NaN, NaN, 20.505, 20, NaN]];
            assert.deepEqual(utils.replaceUndefinedWithNaN(data, false), result);
        });

        it("replace null in Series with NaN", function () {
            let data = [10.01, 2.2, null, 20.505, 20.22, null];
            assert.deepEqual(utils.replaceUndefinedWithNaN(data, true), [10.01, 2.2, NaN, 20.505, 20.22, NaN]);
        });

        it("replace null in DataFrame with NaN", function () {
            let data = [[10.01, 2.2, null, 20.505, 20.22, null],
            [10.01, null, null, 20.505, 20, null]];

            let result = [[10.01, 2.2, NaN, 20.505, 20.22, NaN],
            [10.01, NaN, NaN, 20.505, 20, NaN]];
            assert.deepEqual(utils.replaceUndefinedWithNaN(data, false), result);
        });
    });

    describe("convert2DArrayToSeriesArray", function () {
        it("convert 2D array of array to 1D of string values", function () {
            let data = [[10.01, 2.2, "a"], [20.505, 20.22, "boy"]];
            assert.deepEqual(utils.convert2DArrayToSeriesArray(data), ["10.01,2.2,a", "20.505,20.22,boy"]);
        });

    });

    describe("throwErrorOnWrongParams", function () {
        it("check if the right params are passed to a function", function () {
            let paramsNeeded = ["replace", "with", "inplace"]
            let kwargs = { "replae": 2, "with": 12, "inplace": true }

            assert.throws(() => {
                utils.throwErrorOnWrongParams(kwargs, paramsNeeded)
            }, Error, `Params Error: Required parameter not found. Your params must be any of the following [${paramsNeeded}]`);
        })

        it("check if the right params are passed to a function 2", function () {
            let paramsNeeded = ["replace", "with", "inplace"]
            let kwargs = { "replace": 2, "with": 12, "inplace": true }
            utils.throwErrorOnWrongParams(kwargs, paramsNeeded)
        })

    })

    describe("getRowAndColValues", function () {
        it("retreive rows and labels from column object", function () {
            let data = { "Alpha": ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let res = [["A", 1, 20.3], ["B", 2, 30.456], ["C", 3, 40.90], ["D", 4, 90.1]];
            assert.deepEqual(utils.getRowAndColValues(data)[0], res as any);
            assert.deepEqual(utils.getRowAndColValues(data)[1], ["Alpha", "count", "sum"]);
        });

    });


    describe("getDuplicate", function () {
        it("obtain duplicates and their index", function () {
            let data = [1, 2, 3, 4, 5, 3, 4, 6, 4, 5];
            let res = {
                '3': { count: 2, index: [2, 5] },
                '4': { count: 3, index: [3, 6, 8] },
                '5': { count: 2, index: [4, 9] }
            };
            assert.deepEqual(utils.getDuplicate(data), res);
        });
    });

});

import { assert } from "chai";
import { Utils } from '../../src/core/utils';
const utils = new Utils


describe("Utils Functions", function () {
    it("removes an element from an array", function () {
        let arr = [1, 2, 3, 4]
        assert.deepEqual(utils.remove(arr, 2), [1, 2, 4])
    })
    it("Checks if variable is a string", function () {
        let arr = ["1", "2"]
        assert.isTrue(utils.__is_string(arr[0]))
    })
    it("Checks if variable is a number", function () {
        let arr = [1, 2, 3, 4]
        assert.isTrue(utils.__is_number(arr[0]))
    })
    it("Checks if value is null", function () {
        let val = null
        let val2 = 1
        assert.isTrue(utils.__is_null(val))
        assert.isFalse(utils.__is_null(val2))
    })

    it("Checks if value is undefined", function () {
        let arr;
        assert.isTrue(utils.__is_undefined(arr))
    })
    it("random sample n elements from array", function () {
        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]]
        assert.isFalse(utils.__sample_from_iter(data, 2) == utils.__sample_from_iter(data, 2))
        assert.isFalse(utils.__sample_from_iter(data, 3) === utils.__sample_from_iter(data, 3))

    })
    it("Generate number betwee two set of values", function () {

        let start = 0;
        let end = 5;
        let data = [0, 1, 2, 3, 4, 5]
        assert.deepEqual(utils.__range(start, end), data);
    })

    describe("__get_col_values", function () {
        it("converts an array of rows to array of columns", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40]]
            let result = [[1, 4, 20], [2, 5, 30], [3, 6, 40]]
            assert.deepEqual(utils.__get_col_values(data), result)
        })
    })

    describe("__get_t", function () {
        it("Returns string type present in an 1D array", function () {
            let data = ['Alice', 'Boy', 'Girl', "39"]
            let result = ['string']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns float type present in an 1D array", function () {
            let data = [1.1, 2.1, 3.2, 4.4]
            let result = ['float32']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns int type present in an 1D array", function () {
            let data = [1, 2, 3, 45]
            let result = ['int32']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns float when there's a mixture of int and float in a 1D array", function () {
            let data = [1, 2.1, 3, 45]
            let result = ['float32']
            assert.deepEqual(utils.__get_t(data), result)
        })

        it("Returns the data type present in an 2D array", function () {
            let data = [['Alice', 'Boy', 'Girl', "39"], [2, 5, 30, 89], [3.1, 6.1, 40.1, 78.2]]
            let result = ['string', 'int32', 'float32']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns the string dtype when there's a mixture of dtyoes in a 2D array", function () {
            let data = [['Alice', 'Boy', 'Girl', 21], [2, 5, 30, "hey"], [3, 6, 40.1, 78.2]]
            let result = ['string', 'string', 'float32']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns bool type in a 1D array", function () {
            let data = [true, true, false, false, false, true]
            let result = ['boolean']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns bool type in a 2D array", function () {
            let data = [[true, false, true], ["boy", "girl", "man"], [20, 30, 24]]
            let result = ['boolean', 'string', 'int32']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns string type if values are NaN", function () {
            let data = [[true, false, true], ["boy", "girl", "boy"], [NaN, undefined, NaN]]
            let result = ['boolean', 'string', 'string']
            assert.deepEqual(utils.__get_t(data), result)
        })
    })

    describe("__map_int_to_bool", function () {
        it("map ints to bools in array of arrays", function () {
            let data = [[1, 0, 1], [1, 1, 0]]
            assert.deepEqual(utils.__map_int_to_bool(data, 2), [[true, false, true], [true, true, false]])
        })
        it("map ints to bools in array", function () {
            let data = [1, 0, 0, 1, 1]
            assert.deepEqual(utils.__map_int_to_bool(data, 1), [true, false, false, true, true])
        })
    })


    describe("__median", function () {
        it("Gets the median value of an even array", function () {
            let data = [100, 2, 3, 20, 30, 40]
            assert.deepEqual(utils.__median(data, true), 25)
        })
        it("Gets the median value of an odd array", function () {
            let data = [1, 30, 20, 50, 40]
            assert.deepEqual(utils.__median(data, true), 30)
        })
    })

    describe("__mode", function () {
        it("Gets the modal value(s) of an array", function () {
            let data = [100, 2, 3, 20, 20, 40]
            assert.deepEqual(utils.__mode(data), [20])
        })
        it("Returns the multi-modal values of an array", function () {
            let data = [100, 2, 3, 20, 20, 40, 4, 4, 4, 20]
            assert.deepEqual(utils.__mode(data), [4, 20])
        })
    })

    describe("__round", function () {
        it("round elements in array to 1 dp", function () {
            let data = [10.01, 2.2, 3.11, 20.505, 20.22, 40.0909]
            assert.deepEqual(utils.__round(data, 1, true), [10.0, 2.2, 3.1, 20.5, 20.2, 40.1])
        })
        it("round elements in array to 2 dp", function () {
            let data = [10.019, 2.2099, 3.1145, 20.506, 20.22, 40.0909]
            assert.deepEqual(utils.__round(data, 2, true), [10.02, 2.21, 3.11, 20.51, 20.22, 40.09])
        })
    })

    describe("__replace_undefined_with_NaN", function () {
        it("replace undefined in Series with NaN", function () {
            let data = [10.01, 2.2, undefined, 20.505, 20.22, undefined]
            assert.deepEqual(utils.__replace_undefined_with_NaN(data, true), [10.01, 2.2, NaN, 20.505, 20.22, NaN])
        })
        it("replace undefined in DataFrame with NaN", function () {
            let data = [[10.01, 2.2, undefined, 20.505, 20.22, undefined],
            [10.01, undefined, undefined, 20.505, 20, undefined]]

            let result = [[10.01, 2.2, NaN, 20.505, 20.22, NaN],
            [10.01, NaN, NaN, 20.505, 20, NaN]]
            assert.deepEqual(utils.__replace_undefined_with_NaN(data, false), result)
        })
        it("replace null in Series with NaN", function () {
            let data = [10.01, 2.2, null, 20.505, 20.22, null]
            assert.deepEqual(utils.__replace_undefined_with_NaN(data, true), [10.01, 2.2, NaN, 20.505, 20.22, NaN])
        })
        it("replace null in DataFrame with NaN", function () {
            let data = [[10.01, 2.2, null, 20.505, 20.22, null],
            [10.01, null, null, 20.505, 20, null]]

            let result = [[10.01, 2.2, NaN, 20.505, 20.22, NaN],
            [10.01, NaN, NaN, 20.505, 20, NaN]]
            assert.deepEqual(utils.__replace_undefined_with_NaN(data, false), result)
        })
    })

    describe("__convert_2D_to_1D", function () {
        it("convert 2D array of array to 1D of string values", function () {
            let data = [[10.01, 2.2, "a"], [20.505, 20.22, "boy"]]
            assert.deepEqual(utils.__convert_2D_to_1D(data), ["10.01,2.2,a", "20.505,20.22,boy"])
        })

    })

    describe("__wrong_params_are_passed", function () {
        it("check if the right params are passed to a function", function () {
            let params_needed = ["replace", "with", "inplace"]
            let kwargs = { "replae": 2, "with": 12, "inplace": true }
            assert.equal(utils.__right_params_are_passed(kwargs, params_needed), false)
        })
        it("check if the right params are passed to a function 2", function () {
            let params_needed = ["replace", "with", "inplace"]
            let kwargs = { "replace": 2, "with": 12, "inplace": true }
            assert.equal(utils.__right_params_are_passed(kwargs, params_needed), true)
        })

    })

    describe("__get_row_values", function () {
        it("retreive rows and labels from column object", function () {
            let data = { "Alpha": ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] }
            let res = [["A", 1, 20.3], ["B", 2, 30.456], ["C", 3, 40.90], ["D", 4, 90.1]]
            assert.deepEqual(utils.__get_row_values(data)[0], res)
            assert.deepEqual(utils.__get_row_values(data)[1], ["Alpha", "count", "sum"])

        })


    })




})
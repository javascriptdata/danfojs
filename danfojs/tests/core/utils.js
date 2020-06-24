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

    describe("get_col_values", function () {
        it("converts an array of rows to array of columns", function () {
            let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40]]
            let result = [[1, 4, 20], [2, 5, 30], [3, 6, 40]]
            assert.deepEqual(utils.__get_col_values(data), result)
        })
    })

    describe("get_t", function () {
        it("Returns string type present in an 1D array", function () {
            let data = ['Alice', 'Boy', 'Girl', "39"]
            let result = ['string']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns float type present in an 1D array", function () {
            let data = [1.1, 2.1, 3.2, 4.4]
            let result = ['float']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns int type present in an 1D array", function () {
            let data = [1, 2, 3, 45]
            let result = ['int']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns string when there's a mixture of int and float in a 1D array", function () {
            let data = [1, 2.1, 3, 45]
            let result = ['string']
            assert.deepEqual(utils.__get_t(data), result)
        })

        it("Returns the data type present in an 2D array", function () {
            let data = [['Alice', 'Boy', 'Girl', "39"], [2, 5, 30, 89], [3.1, 6.1, 40.1, 78.2]]
            let result = ['string', 'int', 'float']
            assert.deepEqual(utils.__get_t(data), result)
        })
        it("Returns the string dtype when there's a mixture of dtyoes in a 2D array", function () {
            let data = [['Alice', 'Boy', 'Girl', 21], [2, 5, 30, "hey"], [3, 6, 40.1, 78.2]]
            let result = ['string', 'string', 'string']
            assert.deepEqual(utils.__get_t(data), result)
        })
    })

})
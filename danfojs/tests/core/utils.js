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
        assert.isTrue(utils.isString(arr[0]))
    })
    it("Checks if variable is a number", function () {
        let arr = [1, 2, 3, 4]
        assert.isTrue(utils.isNumber(arr[0]))
    })
    it("Checks if value is null", function () {
        let val = null
        let val2 = 1
        assert.isTrue(utils.isNull(val))
        assert.isFalse(utils.isNull(val2))
    })

    it("Checks if value is undefined", function () {
        let arr;
        assert.isTrue(utils.isUndefined(arr))
    })
    it("random sample n elements from array", function () {
        let data = [[1, 2, 3], [4, 5, 6], [20, 30, 40], [39, 89, 78], [100, 200, 300]]
        assert.isFalse(utils.sample_from_iter(data, 2) == utils.sample_from_iter(data, 2))
        assert.isFalse(utils.sample_from_iter(data, 3) === utils.sample_from_iter(data, 3))

    })
    it("Generate number betwee two set of values", function () {
        
        let start = 0;
        let end = 5;
        let data = [0,1,2,3,4,5]
        assert.deepEqual(utils.range(0,5),data);
    })


})
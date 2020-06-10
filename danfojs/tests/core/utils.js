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
    it("Checks if variable is an object", function () {
        let arr = [{ "name": "John", "age": 28 },
                    { "name": "Mark", "age": 12 }]
        assert.isTrue(utils.isObject(arr[0]))
    })

})
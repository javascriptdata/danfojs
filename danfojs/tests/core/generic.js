import { assert } from "chai";
import NDframe from '../../src/core/generic';


describe("NDframe", function () {
    it("prints the shape of a 1D array", function () {
        let data = [1, 2, 3, "Boy", "Girl"]
        let ndframe = new NDframe(data)
        assert.equal(ndframe.shape, 1)
    })
    it("prints the default assigned column name in a series", function () {
        let data = ["Boy", 20, 25]
        let ndframe = new NDframe(data)
        assert.deepEqual(ndframe.column_names, "0")
    })
    it("prints the assigned column name in a series", function () {
        let data = ["Boy", 20, 25]
        let options = { columns: 'Records' }
        let ndframe = new NDframe(data, options)
        assert.deepEqual(ndframe.column_names, "Records")
    })
    it("prints the shape of a 2D array", function () {
        let data = [["Boy", 20], ["Girl", 25]]
        let ndframe = new NDframe(data)
        assert.deepEqual(ndframe.shape, [2, 2])
    })
    it("prints the default assigned column names in 2D frame", function () {
        let data = [["Boy", 20], ["Girl", 25]]
        let ndframe = new NDframe(data)
        assert.deepEqual(ndframe.column_names, [0, 1])
    })
    it("prints the assigned column names", function () {
        let data = [["Boy", 20], ["Girl", 25]]
        let options = { columns: ["Gender", "Age"] }
        let ndframe = new NDframe(data, options)
        assert.deepEqual(ndframe.column_names, ["Gender", "Age"])
    })
    it("prints the size of a frame", function () {
        let data = [["Boy", 20, 1], ["Girl", 25, 3]]
        let options = { columns: ["Gender", "Age", "count"] }
        let ndframe = new NDframe(data, options)
        assert.deepEqual(ndframe.size, 6)
    })
    it("prints the dimension of a frame", function () {
        let data = [["Boy", 20, 1], ["Girl", 25, 3]]
        let options = { columns: ["Gender", "Age", "count"] }
        let ndframe = new NDframe(data,options)
        assert.deepEqual(ndframe.ndim, 2)
    })
    it("prints the values of a frame", function () {
        let data = [[21, 20, 1], [20, 25, 3]]
        let ndframe = new NDframe(data)
        assert.deepEqual(ndframe.values, data)
    })
    it("prints the values of a frame", function () {
        let data = [[21, 20, 1], [20, 25, 3]]
        let ndframe = new NDframe(data)
        assert.deepEqual(ndframe.values, data)
    })
})
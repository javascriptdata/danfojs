import { assert } from "chai";
import NDframe from '../../src/core/generic';


describe("NDframe", function () {
    describe("NDframe Created from Array", function () {
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
            let options = { "columns": 'Records' }
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
            let options = { "columns": ["Gender", "Age"] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.column_names, ["Gender", "Age"])
        })
        it("prints the size of a frame", function () {
            let data = [["Boy", 20, 1], ["Girl", 25, 3]]
            let options = { "columns": ["Gender", "Age", "count"] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.size, 6)
        })
        it("prints the dimension of a frame", function () {
            let data = [["Boy", 20, 1], ["Girl", 25, 3]]
            let options = { "columns": ["Gender", "Age", "count"] }
            let ndframe = new NDframe(data, options)
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

    describe("NDframe Created from JavaScript Object", function () {
        it("prints the shape of a 2D frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let ndframe = new NDframe(data)
            assert.deepEqual(ndframe.shape, [3, 2])
        })
        it("prints the column names of frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let ndframe = new NDframe(data)
            assert.deepEqual(ndframe.column_names, ["alpha", "count"])
        })
        it("prints the shape of a 1D frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }]
            let ndframe = new NDframe(data)
            assert.deepEqual(ndframe.shape, [1, 2])
        })

        it("prints the size of a frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let options = { columns: ["Gender", "Age", "count"] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.size, 6)
        })
        it("prints the dimension of a frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }]
            let options = { columns: ["Gender", "Age", "count"] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.ndim, 2)
        })
        it("prints the values of a frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }]
            let ndframe = new NDframe(data)
            assert.deepEqual(ndframe.values, [["A", "1"], ["B", "2"]])
        })
    })

    describe("to_string", function () {
        it("Print data as string in console", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let ndframe = new NDframe(data)
            assert.isString(ndframe.to_string)
        })
    })
    describe("to_string", function () {
        it("Print data in streaming pattern to console", function () {
            let data = [{ alpha: "A", count: 1}, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }
                , { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 },
            { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 },
            { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 },
            { alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let ndframe = new NDframe(data)
            assert.isString(ndframe.to_string)
        })
    })
})
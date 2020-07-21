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
            assert.deepEqual(ndframe.column_names, ["0"])
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
            assert.deepEqual(ndframe.values, [["A", 1], ["B", 2]])
        })
    })

    describe("index", function () {
        it("Returns the index of an NDframe", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new NDframe(data)
            assert.deepEqual(df.index, [0, 1, 2])
        })
        it("Returns the index of an NDframe created from an Array", function () {
            let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70], [9, 10, 19]]
            let df = new NDframe(data)
            assert.deepEqual(df.index, [0, 1, 2, 3])
        })
    })

    describe("set_index", function () {
        it("sets the index of an NDframe", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new NDframe(data)
            df.set_index(["A", "B", "C"])
            assert.deepEqual(df.index, ["A", "B", "C"])
        })
        it("Returns the index of an NDframe created from an Array", function () {
            let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70], [9, 10, 19]]
            let df = new NDframe(data)
            df.set_index([10, 20, 30, 40])
            assert.deepEqual(df.index, [10, 20, 30, 40])
        })
    })

    describe("dtype", function () {
        it("Returns int dtype set during creation of 1DFrame (Series) from an Object", function () {
            let data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            let options = { dtypes: ['int32'] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ['int32'])
        })

        it("Returns string dtype set during creation of 1DFrame (Series) from an Array", function () {
            let data = ["Alice", "Yemi", "Rising", "Mark"]
            let options = { dtypes: ['string'] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ["string"])
        })

        it("Returns string dtype automatically inferred from 1DFrame (Series)", function () {
            let data = ["Alice", "Yemi", "Rising", "Mark"]
            let options = { columns: 'Names' }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ["string"])
        })

        it("Returns int dtype automatically inferred from 1DFrame (Series)", function () {
            let data = [20, 30, 20, 20]
            let options = { columns: 'Size' }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ["int32"])
        })
        it("Returns float dtype automatically inferred from 1DFrame (Series)", function () {
            let data = [20.1, 30.4, 20.2, 4.23, 20.1]
            let options = { columns: 'Size' }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ["float32"])
        })

        it("Sets the dtype of an 1DFrame (Series)", function () {
            let data = [20, 30, 20, 20]
            let cols = ["Score"]
            let options = { columns: cols }
            let ndframe = new NDframe(data, options)
            ndframe.astype(["int32"])
            assert.deepEqual(ndframe.dtypes, ["int32"])
        })

        it("Returns dtype set during creation of 2DFrame from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }]
            let options = { dtypes: ['string', 'int32'] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ['string', 'int32'])
        })
        it("Returns dtype set during creation of 2DFrame from an Array", function () {
            let data = [["Alice", 2, 3.0], ["Boy", 5, 6.1], ["Girl", 30, 40], [39, 89, 78.2]]
            let cols = ["Name", "Count", "Score"]
            let options = { columns: cols, dtypes: ['string', 'int32', 'float32'] }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32"])
        })

        it("Returns dtype automatically inferred from 2DFrame", function () {
            let data = [["Alice", 2, 3.1], ["Boy", 5, 6.1], ["Girl", 30, 40.2], [39, 89, 78.2]]
            let cols = ["Name", "Count", "Score"]
            let options = { columns: cols }
            let ndframe = new NDframe(data, options)
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32"])
        })

        it("Sets the dtype of an 2DFrame", function () {
            let data = [["Alice", 2, 3.0], ["Boy", 5, 6.1], ["Girl", 30, 40], [39, 89, 78.2]]
            let cols = ["Name", "Count", "Score"]
            let options = { columns: cols }
            let ndframe = new NDframe(data, options)
            ndframe.astype(["string", "int32", "float32"])
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32"])
        })
    })
})
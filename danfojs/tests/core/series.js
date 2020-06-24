import { assert } from "chai"
import { Series } from '../../src/core/series'

describe("Series", function () {
    describe("head", function () {
        it("Gets the first n rows in a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let cols = ["A"]
            let sf = new Series(data, { columns: cols })
            assert.deepEqual(sf.head(2).values, [1, 2])
        })
        it("Return all rows in a Series if row specified is greater than values", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"]
            let cols = ["Items"]
            let sf = new Series(data, { columns: cols })
            assert.deepEqual(sf.head(10).values, data)
        })
        it("Return all rows in a Series if row specified is less than 0", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.head(-1).values, data)
        })
    })

    describe("tail", function () {
        it("Prints the last n rows of a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.tail(2).values, [89, 78])
        })
        it("Return all rows in a Series if row specified is greater than values", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.tail(15).values, data)
        })
        it("Return all rows in a Series if row specified is less than 0", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"]
            let cols = ["Items"]
            let sf = new Series(data, { columns: cols })
            assert.deepEqual(sf.tail(-1).values, data)
        })
    })

    describe("sample", function () {
        it("Samples n number of random elements from a DataFrame", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.sample(2).values.length, 2)
        })
        it("Return all values if n of sample is greater than lenght of Dataframe", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.sample(21).values.length, data.length)
        })
        it("Return all values if n of sample is less than 1", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.sample(-2).values.length, data.length)
        })
    })

    describe("add", function () {
        it("Return Addition of series with another series", function () {
            let data = [1, 2, 3, 4, 5, 6]
            let data2 = [30, 40, 39, 1, 2, 1]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.deepEqual(sf.add(sf2).values, [31, 42, 42, 5, 7, 7])
        })
        it("Return Addition of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.add(1).values, [2, 3, 4, 5, 6])
        })
        it("Throws type error on addition of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.add(sf2) }, Error, "Argument 'x' passed to 'cast' must be numeric tensor, but got string tensor")
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.add(sf2) }, Error, " Incompatible shapes: [4] vs. [6]")
        })

    })

    describe("sub", function () {
        it("Return Subtraction of series with another series", function () {
            let data1 = [30, 40, 39, 1, 2, 1]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.sub(sf2).values, [29, 38, 36, -3, -3, -5])
        })
        it("Return Subtraction of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.sub(1).values, [0, 1, 2, 3, 4])
        })
        it("Throws type error on Subtraction of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.sub(sf2) }, Error, "Argument 'x' passed to 'cast' must be numeric tensor, but got string tensor")
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.sub(sf2) }, Error, " Incompatible shapes: [4] vs. [6]")
        })

    })


    describe("mul", function () {
        it("Return multiplication of series with another series", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [1, 2, 3, 4]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.mul(sf2).values, [30, 80, 9, 20])
        })
        it("Return multiplication of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.mul(1).values, [1, 2, 3, 4, 5])
        })
        it("Throws type error on multiplication of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "Argument 'x' passed to 'cast' must be numeric tensor, but got string tensor")
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "Operands could not be broadcast together with shapes 4 and 6")
        })

    })

    describe("mul", function () {
        it("Return multiplication of series with another series", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [1, 2, 3, 4]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.mul(sf2).values, [30, 80, 9, 20])
        })
        it("Return multiplication of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.mul(1).values, [1, 2, 3, 4, 5])
        })
        it("Throws type error on multiplication of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "Argument 'x' passed to 'cast' must be numeric tensor, but got string tensor")
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "Operands could not be broadcast together with shapes 4 and 6")
        })

    })

})

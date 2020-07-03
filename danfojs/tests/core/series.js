import { assert } from "chai"
import { Series } from '../../src/core/series'
import * as tf from '@tensorflow/tfjs-node'


describe("Series", function () {

    describe("tensor", function () {
        it("Returns the tensor object of a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.tensor().dtype, 'int32')
        })
        it("Returns the float dtype of a tensor object", function () {
            let data = [1.1, 2.2, 3, 4.1, 5, 620, 30.1, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.tensor().dtype, 'float32')
        })
        it("Compares a tensor returned from a Series to Tensorflow's tensor", function () {
            let data = [1.1, 2.2, 3, 4.1, 5, 620, 30.1, 40, 39, 89, 78]
            let sf = new Series(data)
            let tf_data = tf.tensor(data)
            assert.deepEqual(sf.tensor().arraySync(), tf_data.arraySync())
        })
    })

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

    describe("div", function () {
        it("Return float division of series with another series", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [1, 2, 3, 4]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.div(sf2).values, [30, 20, 1, 1.25])
        })
        it("Return integer division of series with another series", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [1, 2, 3, 4]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.div(sf2, false).values, [30, 20, 1, 1])
        })
        it("Return division of series with a single value (Broadcasting)", function () {
            let data = [10, 2, 3, 90]
            let sf = new Series(data)
            assert.deepEqual(sf.div(2).values, [5, 1, 1.5, 45])
        })
        it("Throws type error on division of string type", function () {
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

    describe("pow", function () {
        it("Return Exponetial power of series with another series", function () {
            let data1 = [2, 3, 4, 5]
            let data2 = [1, 2, 3, 0]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.pow(sf2).values, [2, 9, 64, 1])
        })
        it("Return Exponetial power of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.pow(2).values, [1, 4, 9, 16, 25])
        })

    })

    describe("mod", function () {
        it("Return modulo of series with another float series", function () {
            let data1 = [2, 30, 4, 5]
            let data2 = [1.1, 2.2, 3.3, 2.4]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [0.8999999761581421, 1.3999993801116943, 0.7000000476837158, 0.19999980926513672]
            assert.deepEqual(sf1.mod(sf2).values, expected)
        })
        it("Return modulo of series with another int series", function () {
            let data1 = [2, 30, 4, 5]
            let data2 = [1, 2, 3, 1]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.mod(sf2).values, [0, 0, 1, 0])
        })
        it("Return modulo power of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.mod(2).values, [1, 0, 1, 0, 1])
        })

    })

    describe("mean", function () {
        it("Computes the mean of elements in a int series", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.mean(), 19.5)
        })
        it("Computes the mean of elements in a float series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.mean(), 19.625)
        })
        it("Throws error if dtype is string", function () {
            let data1 = ["boy", "girl", "Man"]
            let sf = new Series(data1)
            assert.throws(() => { sf.mean() }, Error, "dtype error: String data type does not support mean operation")
        })

    })

    describe("median", function () {
        it("Computes the median value of elements across int Series", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.median(), 17.5)
        })
        it("Computes the median value of elements across float Series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.median(), 17.6)
        })

    })

    describe("mode", function () {
        it("Computes the multi-modal values of a Series", function () {
            let data1 = [30, 40, 3, 5, 5, 5, 5, 5, 3, 3, 3, 21, 3]
            let sf = new Series(data1)
            assert.deepEqual(sf.mode(), [3, 5])
        })
        it("Computes the modal value of a Series", function () {
            let data1 = [30.1, 3.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.mode(), [3.1])
        })

    })

    describe("min", function () {
        it("Returns the single smallest elementin a Series", function () {
            let data = [30, 40, 3, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.min(), 3)
        })
        it("Computes the minimum of elements across an float Series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.min(), 3.1)
        })

    })

    describe("max", function () {
        it("Computes the maximum of elements across dimensions of a Series", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.max(), 78)
        })
        it("Return sum of float values in a series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.max(), 78.5)
        })
        it("Throws error on addition of string Series", function () {
            let data1 = ["boy", "gitl", "woman", "man"]
            let sf = new Series(data1)
            assert.throws(() => { sf.max() }, Error, "dtype error: String data type does not support sum operation")
        })
    })

    describe("maximum", function () {
        it("Returns the max of a and b (a > b ? a : b) element-wise. Supports broadcasting.", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.maximum(), 78)
        })
        it("Return sum of float values in a series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.maximum(), 78.5)
        })
        it("Throws error on addition of string Series", function () {
            let data1 = ["boy", "gitl", "woman", "man"]
            let sf = new Series(data1)
            assert.throws(() => { sf.maximum() }, Error, "dtype error: String data type does not support sum operation")
        })
    })

    describe("minimum", function () {
        it("Returns the min of a and b (a < b ? a : b) element-wise. Supports broadcasting.", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.minimum(), 78)
        })
        it("Return sum of float values in a series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.minimum(), 78.5)
        })
        it("Throws error on addition of string Series", function () {
            let data1 = ["boy", "gitl", "woman", "man"]
            let sf = new Series(data1)
            assert.throws(() => { sf.minimum() }, Error, "dtype error: String data type does not support sum operation")
        })
    })

    describe("count", function () {
        it("Returns the count of non NaN values in a string Series", function () {
            let data = ["boy", "gitl", "woman", NaN]
            let sf = new Series(data)
            assert.deepEqual(sf.count(), 3)
        })
        it("Returns the count of non NaN values in a string Series", function () {
            let data = ["boy", "gitl", "woman", "Man"]
            let sf = new Series(data)
            assert.deepEqual(sf.count(), 4)
        })
        it("Returns the count of non NaN values in a int Series", function () {
            let data = [20, 30, NaN, 2, NaN, 30, 21]
            let sf = new Series(data)
            assert.deepEqual(sf.count(), 5)
        })
        it("Returns the count of non NaN values in a float Series", function () {
            let data = [20.1, 30.4, NaN, 2.1, NaN, 30.0, 21.3]
            let sf = new Series(data)
            assert.deepEqual(sf.count(), 5)
        })
    })



})

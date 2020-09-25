import { assert } from "chai"
import { Series } from '../../src/core/series'
// import * as tf from '@tensorflow/tfjs-node'
import * as tf from '@tensorflow/tfjs'



describe("Series", function () {

    describe("tensor", function () {
        it("Returns the tensor object of a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.tensor.dtype, 'int32')
        })
        it("Returns the float dtype of a tensor object", function () {
            let data = [1.1, 2.2, 3, 4.1, 5, 620, 30.1, 40, 39, 89, 78]
            let sf = new Series(data)
            assert.deepEqual(sf.tensor.dtype, 'float32')
        })
        it("Compares a tensor returned from a Series to Tensorflow's tensor", function () {
            let data = [1.1, 2.2, 3, 4.1, 5, 620, 30.1, 40, 39, 89, 78]
            let sf = new Series(data)
            let tf_data = tf.tensor(data)
            assert.deepEqual(sf.tensor.arraySync(), tf_data.arraySync())
        })
    })
    describe("tensor", function () {
        it("Returns the dtype string Series", function () {
            let data = ["b", "c", "d"]
            let sf = new Series(data)
            assert.deepEqual(sf.dtype, 'string')
        })
        it("Returns the dtype int Series", function () {
            let data = [1, 2, 3, 4, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.dtype, 'int32')
        })
        it("Returns the dtype int Series", function () {
            let data = [1.1, 2.2, 3.3, 4.5, 5]
            let sf = new Series(data)
            assert.deepEqual(sf.dtype, 'float32')
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
            assert.deepEqual(sf.sample(7).values.length, 7)
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
        // it("Throws length error if series lenght mixmatch", function () {
        //     let data = [1, 2, 3, 4]
        //     let data2 = [1, 2, 3, 4, 5, 6]
        //     let sf = new Series(data)
        //     let sf2 = new Series(data2)
        //     assert.throws(() => { sf.add(sf2) }, Error, "Incompatible shapes: [4] vs. [6]")
        // })

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
        // it("Throws length error if series lenght mixmatch", function () {
        //     let data = [1, 2, 3, 4]
        //     let data2 = [1, 2, 3, 4, 5, 6]
        //     let sf = new Series(data)
        //     let sf2 = new Series(data2)
        //     assert.throws(() => { sf.sub(sf2) }, Error, "Incompatible shapes: [4] vs. [6]")
        // })

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
        // it("Throws type error on multiplication of string type", function () {
        //     let data = [1, 2, 3, 4]
        //     let data2 = ["A", "B", "C", "d"]
        //     let sf = new Series(data)
        //     let sf2 = new Series(data2)
        //     assert.throws(() => { sf.mul(sf2) }, Error, "Argument 'x' passed to 'cast' must be numeric tensor, but got string tensor")
        // })
        // it("Throws length error if series lenght mixmatch", function () {
        //     let data = [1, 2, 3, 4]
        //     let data2 = [1, 2, 3, 4, 5, 6]
        //     let sf = new Series(data)
        //     let sf2 = new Series(data2)
        //     assert.throws(() => { sf.mul(sf2) }, Error, "Operands could not be broadcast together with shapes 4 and 6")
        // })

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
        // it("Throws type error on division of string type", function () {
        //     let data = [1, 2, 3, 4]
        //     let data2 = ["A", "B", "C", "d"]
        //     let sf = new Series(data)
        //     let sf2 = new Series(data2)
        //     assert.throws(() => { sf.mul(sf2) }, Error, "Argument 'x' passed to 'cast' must be numeric tensor, but got string tensor")
        // })
        // it("Throws length error if series lenght mixmatch", function () {
        //     let data = [1, 2, 3, 4]
        //     let data2 = [1, 2, 3, 4, 5, 6]
        //     let sf = new Series(data)
        //     let sf2 = new Series(data2)
        //     assert.throws(() => { sf.mul(sf2) }, Error, "Operands could not be broadcast together with shapes 4 and 6")
        // })

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

    describe("sum", function () {
        it("Sum values of a Int Series", function () {
            let data1 = [30, 40, 3, 5, 5, 5, 5, 5, 3, 3, 3, 21, 3]
            let sf = new Series(data1)
            assert.deepEqual(sf.sum(), 131)
        })
        it("Sum values of a Float Series", function () {
            let data1 = [30.1, 3.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.sum(), 81.6)
        })
        it("Sum values of a bool Series", function () {
            let data1 = [true, true, false, false, false]
            let sf = new Series(data1)
            assert.deepEqual(sf.sum(), 2)
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
            let data1 = [30.1, 40.2, 3.12, 5.1]
            let sf = new Series(data1, { dtypes: ['float32'] })
            assert.deepEqual(Number((sf.min()).toFixed(2)), 3.12)
        })

    })

    describe("max", function () {
        it("Computes the maximum of elements across dimensions of a Series", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.max(), 40)
        })
        it("Return sum of float values in a series", function () {
            let data1 = [30.1, 40.21, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(Number((sf.max()).toFixed(2)), 40.21)
        })
        it("Throws error on addition of string Series", function () {
            let data1 = ["boy", "gitl", "woman", "man"]
            let sf = new Series(data1)
            assert.throws(() => { sf.max() }, Error, "dtype error: String data type does not support max operation")
        })
    })

    describe("std", function () {
        it("Computes the standard of elements in a int series", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.std(), 18.375708603116962)
        })
        it("Computes the standard deviation of elements in a float series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.std(), 18.412925713566906)
        })
        it("Computes the standard deviation of elements in a float series with missing values", function () {
            let data1 = [30, 40, 3, 5, undefined]
            let sf = new Series(data1)
            assert.deepEqual(sf.std(), 18.375708603116962)
        })

    })

    describe("var", function () {
        it("Computes the variance of elements in a int series", function () {
            let data1 = [30, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.var(), 337.6666666666667)
        })
        it("Computes the variance of elements in a float series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.var(), 339.03583333333336)
        })
        it("Computes the variance of elements in a int series with missing values", function () {
            let data1 = [30, undefined, 40, 3, 5]
            let sf = new Series(data1)
            assert.deepEqual(sf.var(), 337.6666666666667)
        })

    })

    describe("describe", function () {
        it("Computes the descriptive statistics on an int Series", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            assert.deepEqual(sf.describe().round().values, [7, 27, 17, 10, 23, 56, 302])
        })
        it("Computes the descriptive statistics on a float Series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.describe().round().values, [4, 20, 18, 3, 18, 40, 339])
        })
        it("Computes the descriptive statistics on a float Series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.describe().index, ['count', 'mean', 'std', 'min', 'median', 'max', 'variance'])
        })

    })



    describe("maximum", function () {
        it("Returns the max of a and b (a > b ? a : b) element-wise. Supports broadcasting.", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [10, 41, 2, 0]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.maximum(sf2).values, [30, 41, 3, 5])
        })
        it("Throws error on checking maximum of incompatible Series", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [10, 41, 2]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.throws(() => { sf1.maximum(sf2) }, Error, "Operands could not be broadcast together with shapes 4 and 3")
        })
    })

    describe("minimum", function () {
        it("Returns the min of a and b (a < b ? a : b) element-wise. Supports broadcasting.", function () {
            let data1 = [30, 40, 3, 5]
            let data2 = [10, 41, 2, 0]
            let sf1 = new Series(data1)
            let sf2 = new Series(data2)
            assert.deepEqual(sf1.minimum(sf2).values, [10, 40, 2, 0])

        })
        // it("Return sum of float values in a series", function () {
        //     let data1 = [30.1, 40.9, 3, 5]
        //     let data2 = [10.2, 41, 2, 0]
        //     let sf1 = new Series(data1)
        //     let sf2 = new Series(data2)
        //     assert.deepEqual(sf1.minimum(sf2).values, [30, 41, 3, 5])

        // })
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

    describe("round", function () {
        it("Rounds elements in a Series to nearest whole number", function () {
            let data1 = [30.21091, 40.190901, 3.564, 5.0212]
            let sf = new Series(data1)
            assert.deepEqual(sf.round().values, [30, 40, 4, 5])
        })
        it("Rounds elements in a Series to 1dp", function () {
            let data1 = [30.21091, 40.190901, 3.564, 5.0212]
            let sf = new Series(data1)
            assert.deepEqual(sf.round(1).values, [30.2, 40.2, 3.6, 5.0])
        })
        it("Rounds elements in a Series to 2dp", function () {
            let data1 = [30.2191, 40.190901, 3.564, 5.0212]
            let sf = new Series(data1)
            assert.deepEqual(sf.round(2).values, [30.22, 40.19, 3.56, 5.02])
        })
    })

    describe("isna", function () {
        it("Return a boolean same-sized object indicating if string Series contain NaN", function () {
            let data1 = [NaN, undefined, "girl", "Man"]
            let sf = new Series(data1)
            assert.deepEqual(sf.isna().values, [true, true, false, false])
        })
        it("Return a boolean same-sized object indicating if float Series values are NaN", function () {
            let data1 = [30.21091, NaN, 3.564, undefined]
            let sf = new Series(data1)
            assert.deepEqual(sf.isna().values, [false, true, false, true])
        })
        it("Return a boolean same-sized object indicating if int Series values are NaN", function () {
            let data1 = [30, 40, 3, 5, undefined, undefined]
            let sf = new Series(data1)
            assert.deepEqual(sf.isna().values, [false, false, false, false, true, true])
        })
    })

    describe("sort_values", function () {
        it("Sort values in a Series in ascending order (not inplace)", function () {
            let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4])
            let result = [0, 1, 2, 4, 4, 20, 30, 57, 89]
            let sorted_sf = sf.sort_values()
            assert.deepEqual(sorted_sf.values, result)
        })
        it("confirms that sort_values in ascending order does not happen inplace", function () {
            let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4])
            let result = [0, 1, 2, 4, 4, 20, 30, 57, 89]
            let expected_index = [7, 2, 3, 8, 4, 0, 1, 5, 6]
            sf.sort_values({ "inplace": true })
            assert.deepEqual(sf.values, result)
            assert.deepEqual(sf.index, expected_index)

        })
        it("Sort values in a Series in Descending order", function () {
            let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4])
            let result = [89, 57, 30, 20, 4, 4, 2, 1, 0]
            let sorted_sf = sf.sort_values({ "ascending": false })
            assert.deepEqual(sorted_sf.values, result)
        })
        it("confirms that sort_values in descending order happens inplace", function () {
            let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4])
            let result = [89, 57, 30, 20, 4, 4, 2, 1, 0]
            sf.sort_values({ "ascending": false, "inplace": true })
            assert.deepEqual(sf.values, result)
        })
        it("Confirms that series index is sorted in ascending order (not in inplace)", function () {
            let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4])
            let result = [7, 2, 3, 8, 4, 0, 1, 5, 6]
            let sorted_sf = sf.sort_values()
            assert.deepEqual(sorted_sf.index, result)
        })
        it("Confirms that series index is sorted in descending order (not in inplace)", function () {
            let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4])
            let result = [6, 5, 1, 0, 4, 8, 3, 2, 7]
            let sorted_sf = sf.sort_values({ "ascending": false })
            assert.deepEqual(sorted_sf.index, result)
        })
        it("Throws error on sorting of string", function () {
            let sf = new Series(["boy", "man", "girl"])
            assert.throws(() => { sf.sort_values() }, Error, "Dtype Error: cannot sort Series of type string")
        })
    })

    describe("copy", function () {
        it("Checks if copied values are the same as the first one", function () {
            let sf = new Series([30.21091, 40.190901, 3.564, 5.0212])
            let sf_copy = sf.copy()
            assert.deepEqual(sf.values, sf_copy.values)
        })
        it("Checks if copied index are the same", function () {
            let sf = new Series([30.21091, 40.190901, 3.564, 5.0212])
            sf = sf.set_index({ "index": ["a", "b", "c", "d"] })
            let sf_copy = sf.copy()
            assert.deepEqual(sf.index, sf_copy.index)
        })
        // it("Checks if copied dtype is the same", function () {
        //     let sf = new Series([30.21091, 40.190901, 3.564, 5.0212])
        //     sf.round()
        //     sf.astype(['int32'])
        //     let sf_copy = sf.copy()
        //     assert.deepEqual(sf.dtypes[0], sf_copy.dtypes[0])
        //     assert.deepEqual(sf.values, sf_copy.values)

        // })
    })

    describe("reset_index", function () {
        it("resets the index of a Series", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new Series(data)
            let df_new = df.set_index({ "index": ["one", "two", "three"] })
            let df_reset = df_new.reset_index()
            assert.deepEqual(df_reset.index, [0, 1, 2])
        })
        it("Reset the index of a Series created from an Array", function () {
            let data = [1, 2, 3, 4, 5, 6]
            let df = new Series(data)
            df.set_index({ "index": ["one", "two", "three", "four", "five", "six"], "inplace": true })
            let df_new = df.reset_index()
            assert.deepEqual(df_new.index, [0, 1, 2, 3, 4, 5])
        })
        it("checks that the original series changed after reseting new index inplace", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new Series(data)
            df.reset_index({ "inplace": true })
            assert.deepEqual(df.index, [0, 1, 2])
        })
    })

    describe("set_index", function () {
        it("sets the index of an Series", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new Series(data)
            let df_new = df.set_index({ "index": ["one", "two", "three"] })
            assert.deepEqual(df_new.index, ["one", "two", "three"])
            assert.notDeepEqual(df.index, df_new.index)
        })
        it("checks that the original series is not modified after setting new index not-inplace", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]
            let df = new Series(data)
            let df_new = df.set_index({ "index": ["one", "two", "three"] })
            assert.notDeepEqual(df.index, df_new.index)
        })
        it("sets the index of an Series inplace", function () {
            let data = [12, 2, 20, 50]
            let df = new Series(data)
            df.set_index({ "index": ["one", "two", "three", "four"], "inplace": true })
            assert.deepEqual(df.index, ["one", "two", "three", "four"])
        })
    })

    describe("Map", function () {

        it("map series element to object keys", function () {
            let sf = new Series([1, 2, 3, 4])
            let map = { 1: "ok", 2: "okie", 3: "frit", 4: "gop" }

            let rslt = ["ok", "okie", "frit", "gop"]

            assert.deepEqual(sf.map(map).values, rslt)
        });

        it("map series element to a function statement", function () {
            let sf = new Series([1, 2, 3, 4])
            let func_map = (x) => {
                return x + 1
            }

            let rslt = [2, 3, 4, 5]

            assert.deepEqual(sf.map(func_map).values, rslt)
        });
    });

    describe("Apply", function () {

        it("apply a function to a series element", function () {
            let sf = new Series([1, 2, 3, 4, 5, 6, 7, 8])

            let apply_func = (x) => {
                return x + x
            }

            let rslt = [2, 4, 6, 8, 10, 12, 14, 16]
            assert.deepEqual(sf.apply(apply_func).values, rslt)
        });
    });

    describe("unique", function () {

        it("returns the unique values in a Series of type int", function () {
            let sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 22, 8, 5, 5, 5])
            let expected = [1, 2, 3, 4, 5, 6, 7, 8, 22]
            assert.deepEqual(sf.unique().values, expected)
        });
        it("returns the unique values in a Series of type string", function () {
            let sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"])
            let expected = ["a", "b", "c", "d", "e"]
            assert.deepEqual(sf.unique().values, expected)
        });
        it("returns the unique values in a Series of type string", function () {
            let sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"])
            let expected = ["a", "b", "c", "d", "e"]
            assert.deepEqual(sf.unique().values, expected)
        });
        it("returns the nunique values in a Series of type string", function () {
            let sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"])
            let expected = 5
            assert.deepEqual(sf.nunique(), expected)
        });
    });

    describe("value_counts", function () {

        it("returns the unique values and their counts in a Series of type int", function () {
            let sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 22, 8, 5, 5, 5])
            let expected_index = [1, 2, 3, 4, 5, 6, 7, 8, 22]
            let expected_vals = [3, 1, 1, 1, 4, 1, 1, 2, 1]
            assert.deepEqual(sf.value_counts().values, expected_vals)
            assert.deepEqual(sf.value_counts().index, expected_index)

        });
        it("returns the unique values and their counts in a Series of type string", function () {
            let sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"])
            let expected_vals = [2, 1, 2, 3, 2]
            let expected_index = ["a", "b", "c", "d", "e"]
            assert.deepEqual(sf.value_counts().values, expected_vals)
            assert.deepEqual(sf.value_counts().index, expected_index)

        });
    });

    describe("abs", function () {
        it("Returns the absolute values in Series", function () {
            let data1 = [-10, 45, 56, -25, 23, -20, 10]
            let sf = new Series(data1)
            assert.deepEqual(sf.abs().values, [10, 45, 56, 25, 23, 20, 10])
        })
        it("Computes the descriptive statistics on a float Series", function () {
            let data1 = [-30.1, -40.2, -3.1, -5.1]
            let sf = new Series(data1)
            assert.deepEqual(sf.abs().values, [30.1, 40.2, 3.1, 5.1])
        })

    })

    describe("fillna", function () {
        it("replace all NaN value with specified value", function () {
            let data = [NaN, 1, 2, 33, 4, NaN, 5, 6, 7, 8]
            let sf = new Series(data)
            let sf_val = [-999, 1, 2, 33, 4, -999, 5, 6, 7, 8]
            sf.fillna({ value: -999, inplace: true })
            assert.deepEqual(sf.values, sf_val)
        })
        it("replace all NaN value in string Series with specified value", function () {
            let data = [NaN, "boy", NaN, "hey", "Man", undefined]
            let sf = new Series(data)
            let sf_val = ["filled", "boy", "filled", "hey", "Man", "filled"]
            let sf_fill = sf.fillna({ value: "filled" })
            assert.deepEqual(sf_fill.values, sf_val)
        });
    })


    describe("cumsum", function () {
        it("Return cumulative sum over a Series", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            assert.deepEqual(sf.cumsum().values, [10, 55, 111, 136, 159, 179, 189])
        })

    })

    describe("cummax", function () {
        it("Return cumulative maximum over a Series", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            assert.deepEqual(sf.cummax().values, [10, 45, 56, 56, 56, 56, 56])
        })

    })

    describe("cummin", function () {
        it("Return cumulative minimum over a Series", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            assert.deepEqual(sf.cummin().values, [10, 10, 10, 10, 10, 10, 10])
        })

    })

    describe("cumprod", function () {
        it("Return cumulative product over a Series", function () {
            let data1 = [1, 2, 10, 3, 12, 14, 1]
            let sf = new Series(data1)
            let rslt = [
                1, 2, 20,
                60, 720, 10080,
                10080
            ]
            assert.deepEqual(sf.cumprod().values, rslt)
        })

    })

    describe("lt", function () {
        it("Return Less than of series and other series (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let data2 = [100, 450, 590, 5, 25, 2, 0]

            let sf = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [true, true, true, false, true, false, false]
            assert.deepEqual(sf.lt(sf2).values, expected)
        })

        it("Return Less than of series scalar (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            let expected = [true, false, false, true, true, true, true]
            assert.deepEqual(sf.lt(30).values, expected)
        })

    })

    describe("gt", function () {
        it("Return Greater than of series and other series (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let data2 = [100, 450, 590, 5, 25, 2, 0]

            let sf = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [false, false, false, true, false, true, true]
            assert.deepEqual(sf.gt(sf2).values, expected)
        })

        it("Return Greater than of series scalar (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            let expected = [false, true, true, false, false, false, false]
            assert.deepEqual(sf.gt(30).values, expected)
        })

    })

    describe("le", function () {
        it("Return Less than or Equal to of series and other series (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let data2 = [100, 450, 590, 5, 25, 2, 0]

            let sf = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [true, true, true, false, true, false, false]
            assert.deepEqual(sf.le(sf2).values, expected)
        })

        it("Return Less than or Equal to of series scalar (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            let expected = [true, false, false, true, true, true, true]
            assert.deepEqual(sf.le(30).values, expected)
        })

    })

    describe("ge", function () {
        it("Return Greater than or Equal to of series and other series (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let data2 = [100, 450, 56, 5, 25, 20, 0]

            let sf = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [false, false, true, true, false, true, true]
            assert.deepEqual(sf.ge(sf2).values, expected)
        })

        it("Return Greater than or Equal to of series scalar (element-wise)", function () {
            let data1 = [30, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            let expected = [true, true, true, false, false, false, false]
            assert.deepEqual(sf.ge(30).values, expected)
        })

    })

    describe("ne", function () {
        it("Return Not Equal to of series and other series (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let data2 = [10, 450, 56, 5, 25, 2, 0]

            let sf = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [false, true, false, true, true, true, true]
            assert.deepEqual(sf.ne(sf2).values, expected)
        })

        it("Return Not Equal to of series scalar (element-wise)", function () {
            let data1 = [10, 30, 56, 30, 23, 20, 10]
            let sf = new Series(data1)
            let expected = [true, false, true, false, true, true, true]
            assert.deepEqual(sf.ne(30).values, expected)
        })

    })

    describe("eq", function () {
        it("Return Equal to of series and other series (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let data2 = [100, 450, 590, 25, 25, 2, 0]

            let sf = new Series(data1)
            let sf2 = new Series(data2)
            let expected = [false, false, false, true, false, false, false]
            assert.deepEqual(sf.eq(sf2).values, expected)
        })

        it("Return Equal to of series scalar (element-wise)", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 30]
            let sf = new Series(data1)
            let expected = [false, false, false, false, false, false, true]
            assert.deepEqual(sf.eq(30).values, expected)
        })

    })

    describe("replace", function () {
        it("Replace values given in replace param with value", function () {
            let data1 = [10, 45, 56, 25, 23, 20, 10]
            let sf = new Series(data1)
            let expected = [-50, 45, 56, 25, 23, 20, -50]
            let df_rep = sf.replace({ replace: 10, with: -50 })
            assert.deepEqual(df_rep.values, expected)
        })

        it("Replace values given in replace param with value (String type)", function () {
            let data1 = ["A", "A", "A", "B", "B", "C", "C", "D"]
            let sf = new Series(data1)
            let expected = ["boy", "boy", "boy", "B", "B", "C", "C", "D"]
            sf.replace({ replace: "A", with: "boy", inplace: true })
            assert.deepEqual(sf.values, expected)
        })
        it("Throw error on wrong param passed", function () {
            let data1 = ["A", "A", "A", "B", "B", "C", "C", "D"]
            let sf = new Series(data1)
            let expected = `Params Error: A specified parameter is not supported. Your params must be any of the following [replace,with,inplace]`
            assert.throws(() => { sf.replace({ replce: "A", with: "boy", inplace: true }) }, Error, expected)
        })

    })

    describe("drop_duplicates", function () {
        it("Return Series with duplicate values removed (Default, first values kept)", function () {
            let data1 = [10, 45, 56, 10, 23, 20, 10, 10]
            let sf = new Series(data1)
            let expected = [10, 45, 56, 23, 20]
            let expected_index = [0, 1, 2, 4, 5]
            let df_drop = sf.drop_duplicates()
            assert.deepEqual(df_drop.values, expected)
            assert.deepEqual(df_drop.index, expected_index)

        })

        it("Return Series with duplicate values removed (last values kept)", function () {
            let data1 = [10, 45, 56, 10, 23, 20, 10, 10]
            let sf = new Series(data1)
            let expected = [45, 56, 23, 20, 10]
            let expected_index = [1, 2, 4, 5, 7]
            let df_drop = sf.drop_duplicates({ keep: "last" })
            assert.deepEqual(df_drop.values, expected)
            assert.deepEqual(df_drop.index, expected_index)

        })

        it("Return Series with duplicate values removed (String)", function () {
            let data1 = ["A", "A", "A", "B", "B", "C", "C", "D"]
            let sf = new Series(data1)
            let expected = ["A", "B", "C", "D"]
            let expected_index = [0, 3, 5, 7]
            sf.drop_duplicates({ inplace: true })
            assert.deepEqual(sf.values, expected)
            assert.deepEqual(sf.index, expected_index)

        })

    })

    describe("dropna", function () {
        it("Return a new Series with missing values removed (Int)", function () {
            let data1 = [10, 45, undefined, 10, 23, 20, undefined, 10]
            let sf = new Series(data1)
            let expected = [10, 45, 10, 23, 20, 10]
            let expected_index = [0, 1, 3, 4, 5, 7]
            let sf_drop = sf.dropna()
            assert.deepEqual(sf_drop.values, expected)
            assert.deepEqual(sf_drop.index, expected_index)

        })

        it("Return a new Series with missing values removed (String)", function () {
            let data1 = ["A", NaN, "A", "B", "B", NaN, "C", undefined]
            let sf = new Series(data1)
            let expected = ["A", "A", "B", "B", "C"]
            let expected_index = [0, 2, 3, 4, 6]

            sf.dropna({ inplace: true })
            assert.deepEqual(sf.values, expected)
            assert.deepEqual(sf.index, expected_index)

        })

    })

    describe("argsort", function () {
        it("Return the integer indices that would sort the Series values", function () {
            let data1 = [10, 45, 20, 10, 23, 20, 30, 11]
            let sf = new Series(data1)
            let expected = [3, 0, 7, 5, 2, 4, 6, 1]
            let sf_sort = sf.argsort()
            assert.deepEqual(sf_sort.values, expected)
        })

        it("Return the integer indices that would sort the Series values", function () {
            let data1 = [10.22, 4.5, 2.0, 10, 23.23, 20.1, 30, 11]
            let sf = new Series(data1)
            let expected = [6, 4, 5, 7, 0, 3, 1, 2]
            let sf_sort = sf.argsort(false)
            assert.deepEqual(sf_sort.values, expected)
        })

    })

    describe("argmax", function () {
        it("Return int position of the largest value in the Series.", function () {
            let data1 = [10, 45, 20, 10, 23, 20, 30, 11]
            let sf = new Series(data1)
            let expected = 1
            let argmax = sf.argmax()
            assert.deepEqual(argmax, expected)
        })

        it("Return int position of the largest value in the Float Series.", function () {
            let data1 = [10.22, 4.5, 2.0, 10, 23.23, 20.1, 30, 11]
            let sf = new Series(data1)
            let expected = 6
            let argmax = sf.argmax()
            assert.deepEqual(argmax, expected)
        })

    })

    describe("argmin", function () {
        it("Return int position of the smallest value in the Series", function () {
            let data1 = [10, 45, 20, 122, 23, 20, 30, 11]
            let sf = new Series(data1)
            let expected = 0
            let argmin = sf.argmin()
            assert.deepEqual(argmin, expected)
        })

        it("Return int position of the smallest value in a Float Series", function () {
            let data1 = [10.22, 4.5, 2.0, 10, 23.23, 20.1, 30, 11]
            let sf = new Series(data1)
            let expected = 2
            let argmin = sf.argmin()
            assert.deepEqual(argmin, expected)
        })

    })

    describe("Str", function () {
        it("Converts all characters to lowercase.", function () {
            let data = ['lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe']
            let res = ['lower', 'capitals', 'this is a sentence', 'swapcase']
            let sf = new Series(data)
            assert.deepEqual(sf.str.toLowerCase().values, res)
        })
        it("Converts all characters to uppercase.", function () {
            let data = ['lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe']
            let res = ['LOWER', 'CAPITALS', 'THIS IS A SENTENCE', 'SWAPCASE']
            let sf = new Series(data)
            assert.deepEqual(sf.str.toUpperCase().values, res)
        })
        it("Converts all characters to capital case.", function () {
            let data = ['lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe']
            let res = ['Lower', 'Capitals', 'This is a sentence', 'Swapcase']
            let sf = new Series(data)
            assert.deepEqual(sf.str.capitalize().values, res)
        })

        it("Returns the character at the specified index (position)", function () {
            let data = ['lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe']
            let res = ["w", "P", "i", "A"]
            let sf = new Series(data)
            assert.deepEqual(sf.str.charAt(2).values, res)
        })

        it("Returns the concat of numeric series", function () {
            let data = [1, 2, 3, 4, 5, 6]
            let res = ["120", "220", "320", "420", "520", "620"]
            let sf = new Series(data)
            assert.deepEqual(sf.str.concat("20", 1).values, res)
        })
    })

    describe("dt", function () {
        it("check month generated", function () {

            let data = ["02Sep2019", "03Dec2019", "04Jan2019"]
            let sf = new Series(data)
            let new_data = [8, 11, 0]
            assert.deepEqual(sf.dt.month().values, new_data);
        });

        it("check month Name generated", function () {
            let data = ["06-30-02019", "07-29-2019", "08-28-2019"]
            let sf = new Series(data)
            let new_data = ["Jun", "Jul", "Aug"]
            assert.deepEqual(sf.dt.month_name().values, new_data);
        });

        it("check days of the weeks generated", function () {
            let data = ["06-30-02019", "07-29-2019", "08-28-2019"]
            let sf = new Series(data)
            let new_data = ["Sun", "Mon", "Wed"]
            assert.deepEqual(sf.dt.weekdays().values, new_data);
        });

        it("check day of the month generated", function () {
            let data = ["06-30-02019", "07-29-2019", "08-28-2019"]
            let sf = new Series(data)
            let new_data = [30, 29, 28]
            assert.deepEqual(sf.dt.monthday().values, new_data);
        });
    })


    describe("astype", function () {
        it("set type of float column to int", function () {
            let data = [-20.1, 30, 47.3, -20]
            let ndframe = new Series(data)
            let df = ndframe.astype("int32")

            assert.deepEqual(df.dtypes, 'int32')
            assert.deepEqual(df.values, [-20, 30, 47, -20])

        })
        it("set type of int column to float", function () {
            let data = [34, -4, 5, 6]
            let ndframe = new Series(data)
            let df = ndframe.astype("float32")
            assert.deepEqual(df.dtypes, 'float32')
            assert.deepEqual(df.values, [34, -4, 5, 6])

        })
        it("set type of string column to int", function () {
            let data = ["20.1", "21", "23.4", "50.78"]
            let ndframe = new Series(data)
            let df = ndframe.astype("int32")

            assert.deepEqual(df.dtypes, 'int32')
            assert.deepEqual(df.values, [20, 21, 23, 51])

        })
        it("set type of string column to float", function () {
            let data = ["20.1", "21", "23.4", "50.78"]
            let ndframe = new Series(data)
            let df = ndframe.astype("float32")

            assert.deepEqual(df.dtypes, 'float32')
            assert.deepEqual(df.values, [20.1, 21, 23.4, 50.78])

        })


    })

    describe("iloc", function () {

        it("indexing by list of index", function () {
            let data = [1, 2, 3, 4, "a", "b", "c"]
            let sf = new Series(data)

            let expected_val = [2, 'a', 3, 4, 'b']

            assert.deepEqual(sf.iloc([1, 4, 2, 3, 5]).values, expected_val)

        });
        it("indexing by slicing", function () {

            let data = [1, 2, 3, 4, "a", "b", "c"]
            let sf = new Series(data)

            let expected_val = [2, 3, 4]

            assert.deepEqual(sf.iloc(["1:4"]).values, expected_val)

        });
    });

    describe("append", function () {

        it("Add a new single value to the end of a Series", function () {
            let data = [1, 2, 3, 4, "a", "b", "c"]
            let sf = new Series(data)
            let expected_val = [1, 2, 3, 4, "a", "b", "c", "d"]
            sf.append("d", true)
            assert.deepEqual(sf.values, expected_val)

        });
        it("Add a new array of values to the end of a Series", function () {
            let data = [1, 2, 3, 4]
            let to_add = ["a", "b", "c"]
            let sf = new Series(data)
            let expected_val = [1, 2, 3, 4, "a", "b", "c"]
            sf.append(to_add, true)
            assert.deepEqual(sf.values, expected_val)

        });
        it("Add a Series to the end of another Series", function () {
            let sf1 = new Series([1, 2, 3, 4])
            let sf2 = new Series(["a", "b", "c"])
            let expected_val = [1, 2, 3, 4, "a", "b", "c"]
            sf1.append(sf2, true)
            assert.deepEqual(sf1.values, expected_val)

        });
        it("Add a new single value to the end of a Series", function () {
            let data = [1, 2, 3, 4, "a", "b", "c"]
            let sf = new Series(data)
            let expected_val = [1, 2, 3, 4, "a", "b", "c", "d"]
            sf = sf.append("d")
            assert.deepEqual(sf.values, expected_val)

        });
        it("Add a new array of values to the end of a Series", function () {
            let data = [1, 2, 3, 4]
            let to_add = ["a", "b", "c"]
            let sf = new Series(data)
            let expected_val = [1, 2, 3, 4, "a", "b", "c"]
            sf = sf.append(to_add)
            assert.deepEqual(sf.values, expected_val)

        });
        it("Add a Series to the end of another Series", function () {
            let sf1 = new Series([1, 2, 3, 4])
            let sf2 = new Series(["a", "b", "c"])
            let expected_val = [1, 2, 3, 4, "a", "b", "c"]
            sf1 = sf1.append(sf2)
            assert.deepEqual(sf1.values, expected_val)

        });
        it("Confirm index Change after append", function () {
            let sf1 = new Series([1, 2, 3, 4])
            let sf2 = new Series(["a", "b", "c"])
            sf1 = sf1.append(sf2)
            assert.deepEqual(sf1.index, [0,1,2,3,0,1,2])

        });
        it("Confirm index Change after append inplace", function () {
            let sf1 = new Series([1, 2, 3, 4])
            let sf2 = new Series(["a", "b", "c"])
            sf1.append(sf2, true)
            assert.deepEqual(sf1.index, [0,1,2,3,0,1,2])

        });
    });
})

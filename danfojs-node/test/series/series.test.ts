import { assert, expect } from "chai";
import { Series } from "../../build";

describe("Series Functions", () => {

    describe("head", function () {
        it("Gets the first 2 rows in a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let cols = ["A"];
            let sf = new Series(data, { columnNames: cols });
            assert.deepEqual(sf.head(2).values, [1, 2]);
            assert.deepEqual(sf.head(5).values, [1, 2, 3, 4, 5]);
        });
        it("throw error when row specified is greater than values", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            let cols = ["Items"];
            let sf = new Series(data, { columnNames: cols });
            assert.throws(function () { assert.deepEqual(sf.head(10).values, data) }, Error, `row slice [end] index cannot be less than 5`);
        });

        it("throw error when row specified is less than 0", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series(data);
            assert.throws(function () { assert.deepEqual(sf.head(-1).values, data) }, Error, `The number of values should be positive`);
        });
    });


    describe("tail", function () {
        it("Prints the last n rows of a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series(data);
            assert.deepEqual(sf.tail(2).values, [89, 78]);
            assert.deepEqual(sf.tail(4).values, [40, 39, 89, 78]);

        });
        it("throw error when row specified is greater than values", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            let cols = ["Items"];
            let sf = new Series(data, { columnNames: cols });
            assert.throws(function () { assert.deepEqual(sf.tail(15).values, data) }, Error, `row slice [start] index cannot be less than 0`);
        });

        it("throw error when row specified is less than 0", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            let cols = ["Items"];
            let sf = new Series(data, { columnNames: cols });
            assert.throws(function () { assert.deepEqual(sf.tail(-1).values, data) }, Error, `The number of values should be positive`);
        });
    });

    describe("sample", function () {
        it("Samples n number of random elements from a DataFrame", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series(data);
            assert.deepEqual((await sf.sample(7)).values.length, 7);
        });
        it("Return all values if n of sample -1", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series(data);
            assert.deepEqual((await sf.sample(-1)).values.length, data.length);
        });

        it("Throw error if n is greater than lenght of Series", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series(data);
            try {
                await sf.sample(100);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.eql('Sample size n cannot be bigger than size of dataset');
            }
        });
    });

    describe("add", function () {
        it("Return Addition of series with another series", function () {
            let data = [1, 2, 3, 4, 5, 6];
            let data2 = [30, 40, 39, 1, 2, 1];
            let sf = new Series(data);
            let sf2 = new Series(data2);
            assert.deepEqual(sf.add(sf2).values, [31, 42, 42, 5, 7, 7]);
        });
        it("Return Addition of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            assert.deepEqual(sf.add(1).values, [2, 3, 4, 5, 6]);
        });
        it("Return Addition of series with another series inplace", function () {
            let data = [1, 2, 3, 4, 5, 6];
            let data2 = [30, 40, 39, 1, 2, 1];
            let sf = new Series(data);
            let sf2 = new Series(data2);
            sf.add(sf2, { inplace: true })
            assert.deepEqual(sf.values, [31, 42, 42, 5, 7, 7]);
        });
        it("Return Addition of series with a single value (Broadcasting) inplace", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            sf.add(1, { inplace: true })
            assert.deepEqual(sf.values, [2, 3, 4, 5, 6]);
        });
        it("Dtype is properly updated on addition of series with a single float value inplace", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            sf.add(1.23, { inplace: true })
            assert.deepEqual(sf.dtypes[0], "float32");
            assert.deepEqual(sf.values, [2.23, 3.23, 4.23, 5.23, 6.23]);
        });
        it("Add works properly when using tfjs add function", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data, { config: { useTfjsMathFunctions: true } });
            sf.add(1.23, { inplace: true })
            assert.deepEqual(sf.dtypes[0], "float32");
            assert.deepEqual(sf.values, [2.2300000190734863, 3.2300000190734863, 4.230000019073486, 5.230000019073486, 6.230000019073486]);
        });
        it("Add works properly when using tfjs add function on Series", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data, { config: { useTfjsMathFunctions: true } });
            let sf2 = new Series([1.23, 1.23, 1.23, 1.23, 1.23]);
            sf.add(sf2, { inplace: true })
            console.log(sf);
            assert.deepEqual(sf.values, [2.2300000190734863, 3.2300000190734863, 4.230000019073486, 5.230000019073486, 6.230000019073486]);
        });
        it("Throws type error on addition of string type", function () {
            let data = [1, 2, 3, 4];
            let data2 = ["A", "B", "C", "d"];
            let sf = new Series(data);
            let sf2 = new Series(data2);
            assert.throws(
                () => {
                    sf.add(sf2);
                },
                Error,
                "dtype error: String data type does not support add operation"
            );
        });
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.add(sf2) }, Error, "Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });

    describe("sub", function () {
        it("Return Subtraction of series with another series", function () {
            let data1 = [30, 40, 39, 1, 2, 1];
            let data2 = [1, 2, 3, 4, 5, 6];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.sub(sf2).values, [29, 38, 36, -3, -3, -5]);
        });
        it("Return Subtraction of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            assert.deepEqual(sf.sub(1).values, [0, 1, 2, 3, 4]);
        });
        it("Throws type error on Subtraction of string type", function () {
            let data = [1, 2, 3, 4];
            let data2 = ["A", "B", "C", "d"];
            let sf = new Series(data);
            let sf2 = new Series(data2);
            assert.throws(
                () => {
                    sf.sub(sf2);
                },
                Error,
                "dtype error: String data type does not support sub operation"
            );
        });
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.sub(sf2) }, Error, "Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });

    describe("mul", function () {
        it("Return multiplication of series with another series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [1, 2, 3, 4];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.mul(sf2).values, [30, 80, 9, 20]);
        });
        it("Return multiplication of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            assert.deepEqual(sf.mul(1).values, [1, 2, 3, 4, 5]);
        });
        it("Throws type error on multiplication of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "dtype error: String data type does not support mul operation")
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });


    describe("div", function () {
        it("Return float division of series with another series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [1, 2, 3, 4];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.div(sf2).values, [30, 20, 1, 1.25]);
        });
        it("Return integer division of series with another series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [1, 2, 3, 4];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.div(sf2, false).values, [30, 20, 1, 1.25]);
        });
        it("Return division of series with a single value (Broadcasting)", function () {
            let data = [10, 2, 3, 90];
            let sf = new Series(data);
            assert.deepEqual(sf.div(2).values, [5, 1, 1.5, 45]);
        });
        it("Throws type error on division of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.div(sf2) }, Error, `dtype error: String data type does not support div operation`)
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series(data)
            let sf2 = new Series(data2)
            assert.throws(() => { sf.div(sf2) }, Error, "Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });

    describe("pow", function () {
        it("Return Exponetial power of series with another series", function () {
            let data1 = [2, 3, 4, 5];
            let data2 = [1, 2, 3, 0];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.pow(sf2).values, [2, 9, 64, 1]);
        });
        it("Return Exponetial power of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            assert.deepEqual(sf.pow(2).values, [1, 4, 9, 16, 25]);
        });
    });

    describe("mod", function () {
        it("Return modulo of series with another float series", function () {
            let data1 = [2, 30, 4, 5];
            let data2 = [1.1, 2.2, 3.3, 2.4];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            let expected = [
                0.8999999999999999,
                1.3999999999999977,
                0.7000000000000002,
                0.20000000000000018
            ];
            assert.deepEqual(sf1.mod(sf2).values, expected);
        });
        it("Return modulo of series with another int series", function () {
            let data1 = [2, 30, 4, 5];
            let data2 = [1, 2, 3, 1];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.mod(sf2).values, [0, 0, 1, 0]);
        });
        it("Return modulo power of series with a single value (Broadcasting)", function () {
            let data = [1, 2, 3, 4, 5];
            let sf = new Series(data);
            assert.deepEqual(sf.mod(2).values, [1, 0, 1, 0, 1]);
        });
    });

    describe("toString", function () {
        it("Prints a series to the console", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series(data);
            sf.print()
        });
        it("Prints a series to the console", async function () {
            let data = ["This is a long text group and I want it to print in full",
                "This is a long text group and I want it to print in full"];
            let sf = new Series(data);
            sf.print()
        });
    });

    describe("Empty Series", function () {
        it("Can successfully create an empty Series from empty array", function () {
            let data: any = [];
            let sf = new Series(data);
            assert.deepEqual(sf.shape, [0, 0]);
            assert.deepEqual(sf.columnNames, []);
            assert.deepEqual(sf.dtypes, []);
            assert.deepEqual(sf.values, []);
        });

        it("Can successfully create an empty Series", function () {
            let sf = new Series();
            assert.deepEqual(sf.shape, [0, 0]);
            assert.deepEqual(sf.columnNames, []);
            assert.deepEqual(sf.dtypes, []);
            assert.deepEqual(sf.values, []);
        });
    });

    describe("mean", function () {
        it("Computes the mean of elements in a int series", function () {
            let data1 = [30, 40, 3, 5, NaN];
            let sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.5);
        });
        it("Computes the mean of elements in a int series using TFJS", function () {
            let data1 = [30, 40, 3, 5, NaN];
            let sf = new Series(data1, { config: { useTfjsMathFunctions: true } });
            assert.deepEqual(sf.mean(), 19.5);
        });
        it("Computes the mean of elements in a float series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1];
            let sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.625);
        });
        it("Computes the mean of elements in a float series with NaN", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1, NaN];
            let sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.625);
        });
        it("Computes the mean of a boolean series", function () {
            let data1 = [true, false, false, false, true, true, false, true];
            let sf = new Series(data1);
            assert.deepEqual(sf.mean(), 0.5);
        });
        it("Throws error if dtype is string", function () {
            let data1 = ["boy", "girl", "Man"];
            let sf = new Series(data1);
            assert.throws(
                () => {
                    sf.mean();
                },
                Error,
                "dtype error: String data type does not support mean operation"
            );
        });
    });

    describe("median", function () {
        it("Computes the median value of elements across int Series", function () {
            let data1 = [30, 40, 3, 5];
            let sf = new Series(data1);
            assert.deepEqual(sf.median(), 17.5);
        });
        it("Computes the median value of elements across float Series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1, NaN];
            let sf = new Series(data1);
            assert.deepEqual(sf.median(), 17.6);
        });
    });

    describe("sum", function () {
        it("Sum values of a Int Series", function () {
            let data1 = [30, 40, 3, 5, 5, 5, 5, 5, 3, 3, 3, 21, 3];
            let sf = new Series(data1);
            assert.deepEqual(sf.sum(), 131);
        });
        it("Sum values of a Float Series", function () {
            let data1 = [30.1, 3.1, 40.2, 3.1, 5.1];
            let sf = new Series(data1);
            assert.deepEqual(sf.sum(), 81.6);
        });
        it("Sum values of a bool Series", function () {
            let data1 = [true, true, false, false, false];
            let sf = new Series(data1);
            assert.deepEqual(sf.sum(), 2);
        });
        it("Sum values a Series with missing values", function () {
            let data1 = [11, NaN, 2, 2];
            let sf = new Series(data1);
            assert.deepEqual(sf.sum(), 15);
        });
    });

    describe("mode", function () {
        it("Computes the multi-modal values of a Series", function () {
            let data1 = [30, 40, 3, 5, 5, 5, 5, 5, 3, 3, 3, 21, 3];
            let sf = new Series(data1);
            assert.deepEqual(sf.mode(), [5, 3]);
        });
        it("Computes the modal value of a Series", function () {
            let data1 = [30.1, 3.1, 40.2, 3.1, 5.1];
            let sf = new Series(data1);
            assert.deepEqual(sf.mode(), [3.1]);
        });
    });

    describe("min", function () {
        it("Returns the single smallest elementin a Series", function () {
            let data = [30, 40, 3, 5];
            let sf = new Series(data);
            assert.deepEqual(sf.min(), 3);
        });
        it("Computes the minimum of elements across an float Series", function () {
            let data1 = [30.1, 40.2, 3.12, 5.1];
            let sf = new Series(data1, { dtypes: ["float32"] });
            assert.deepEqual(Number(sf.min().toFixed(2)), 3.12);
        });
    });

    describe("max", function () {
        it("Computes the maximum of elements across dimensions of a Series", function () {
            let data1 = [30, 40, 3, 5];
            let sf = new Series(data1);
            assert.deepEqual(sf.max(), 40);
        });
        it("Return sum of float values in a series", function () {
            let data1 = [30.1, 40.21, 3.1, 5.1];
            let sf = new Series(data1);
            assert.deepEqual(Number(sf.max().toFixed(2)), 40.21);
        });
        it("Throws error on addition of string Series", function () {
            let data1 = ["boy", "gitl", "woman", "man"];
            let sf = new Series(data1);
            assert.throws(
                () => {
                    sf.max();
                },
                Error,
                "dtype error: String data type does not support max operation"
            );
        });
    });

    describe("count", function () {
        it("Returns the count of non NaN values in a string Series", function () {
            let data = ["boy", "gitl", "woman", NaN];
            let sf = new Series(data);
            assert.deepEqual(sf.count(), 3);
        });
        it("Returns the count of values in a string Series without NaN", function () {
            let data = ["boy", "gitl", "woman", "Man"];
            let sf = new Series(data);
            assert.deepEqual(sf.count(), 4);
        });
        it("Returns the count of non NaN values in a int Series", function () {
            let data = [20, 30, NaN, 2, NaN, 30, 21];
            let sf = new Series(data);
            assert.deepEqual(sf.count(), 5);
        });
        it("Returns the count of non NaN values in a float Series", function () {
            let data = [20.1, 30.4, NaN, 2.1, NaN, 30.0, 21.3];
            let sf = new Series(data);
            assert.deepEqual(sf.count(), 5);
        });
    });

    describe("std", function () {
        it("Computes the standard of elements in a int series", function () {
            let data1 = [30, 40, 3, 5];
            let sf = new Series(data1);
            assert.deepEqual(sf.std(), 18.375708603116962);
        });
        it("Computes the standard deviation of elements in a float series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1];
            let sf = new Series(data1);
            assert.deepEqual(sf.std(), 18.412925713566906);
        });
        it("Computes the standard deviation of elements in a float series with missing values", function () {
            let data1 = [30, 40, 3, 5, undefined];
            let sf = new Series(data1);
            assert.deepEqual(sf.std(), 18.375708603116962);
        });
    });

    describe("var", function () {
        it("Computes the variance of elements in a int series", function () {
            let data1 = [30, 40, 3, 5];
            let sf = new Series(data1);
            assert.deepEqual(sf.var(), 337.6666666666667);
        });
        it("Computes the variance of elements in a float series", function () {
            let data1 = [30.1, 40.2, 3.1, 5.1];
            let sf = new Series(data1);
            assert.deepEqual(sf.var(), 339.03583333333336);
        });
        it("Computes the variance of elements in a int series with missing values", function () {
            let data1 = [30, undefined, 40, 3, 5];
            let sf = new Series(data1);
            assert.deepEqual(sf.var(), 337.6666666666667);
        });
    });

    describe("round", function () {
        it("Rounds elements in a Series to nearest whole number", function () {
            let data1 = [30.21091, 40.190901, 3.564, 5.0212];
            let sf = new Series(data1);
            assert.deepEqual(sf.round().values, [30.2, 40.2, 3.6, 5]);
        });
        it("Rounds elements in a Series to 1dp", function () {
            let data1 = [30.21091, 40.190901, 3.564, 5.0212];
            let sf = new Series(data1);
            assert.deepEqual(sf.round(1).values, [30.2, 40.2, 3.6, 5.0]);
        });
        it("Rounds elements in a Series to 2dp", function () {
            let data1 = [30.2191, 40.190901, 3.564, 5.0212];
            let sf = new Series(data1);
            assert.deepEqual(sf.round(2).values, [30.22, 40.19, 3.56, 5.02]);
        });

        it("Rounds elements in a Series to 2dp inplace", function () {
            let data1 = [30.2191, 40.190901, 3.564, 5.0212];
            let sf = new Series(data1);
            sf.round(2, { inplace: true })
            assert.deepEqual(sf.values, [30.22, 40.19, 3.56, 5.02]);
        });

    });

    describe("maximum", function () {
        it("Returns the maximum of two series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [10, 41, 2, 0];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.maximum(sf2).values, [30, 41, 3, 5]);
        });
        it("Throws error on checking maximum of incompatible Series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [10, 41, 2];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.throws(
                () => {
                    sf1.maximum(sf2);
                },
                Error,
                "Row length mismatch. Length of other (3), must be the same as Ndframe (4)"
            );
        });
    });

    describe("minimum", function () {
        it("Returns the minimum of two series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [10, 41, 2, 0];
            let sf1 = new Series(data1);
            let sf2 = new Series(data2);
            assert.deepEqual(sf1.minimum(sf2).values, [10, 40, 2, 0]);
        });
    });

    describe("isNa", function () {
        it("Return a boolean same-sized object indicating if string Series contain NaN", function () {
            let data1 = [NaN, undefined, "girl", "Man"];
            let sf = new Series(data1);
            assert.deepEqual(sf.isNa().values, [true, true, false, false]);
        });
        it("Return a boolean same-sized object indicating if float Series values are NaN", function () {
            let data1 = [30.21091, NaN, 3.564, undefined];
            let sf = new Series(data1);
            assert.deepEqual(sf.isNa().values, [false, true, false, true]);
        });
        it("Return a boolean same-sized object indicating if int Series values are NaN", function () {
            let data1 = [30, 40, 3, 5, undefined, undefined];
            let sf = new Series(data1);
            assert.deepEqual(sf.isNa().values, [
                false,
                false,
                false,
                false,
                true,
                true
            ]);
        });
    });

    describe("fillNa", function () {
        it("replace all NaN value with specified value", function () {
            let data = [NaN, 1, 2, 33, 4, NaN, 5, 6, 7, 8];
            let sf = new Series(data);
            let sfVal = [-999, 1, 2, 33, 4, -999, 5, 6, 7, 8];
            sf.fillNa(-999, { inplace: true });
            assert.deepEqual(sf.values, sfVal);
        });
        it("replace all NaN value in string Series with specified value", function () {
            let data = [NaN, "boy", NaN, "hey", "Man", undefined];
            let sf = new Series(data);
            let sfVal = ["filled", "boy", "filled", "hey", "Man", "filled"];
            let sfFill = sf.fillNa("filled");
            assert.deepEqual(sfFill.values, sfVal);
        });
        it("Data is in right format after filling", function () {
            let data = [NaN, "boy", NaN, "hey", "Man", undefined];
            let sf = new Series(data);
            let sfVal = ["filled", "boy", "filled", "hey", "Man", "filled"];
            let sfFill = sf.fillNa("filled");
            assert.deepEqual(sfFill.values, sfVal);
            assert.deepEqual(sfFill.$dataIncolumnFormat, sfVal);

        });
    });

    // describe("sortValues", function () {
    //     it("Sort values in a Series in ascending order (not inplace)", function () {
    //         let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
    //         let result = [0, 1, 2, 4, 4, 20, 30, 57, 89];
    //         let sorted_sf = sf.sortValues();
    //         assert.deepEqual(sorted_sf.values, result);
    //     });
    //     it("confirms that sortValues in ascending order does not happen inplace", function () {
    //         let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
    //         let result = [0, 1, 2, 4, 4, 20, 30, 57, 89];
    //         let expected_index = [7, 2, 3, 8, 4, 0, 1, 5, 6];
    //         sf.sortValues({ inplace: true });
    //         assert.deepEqual(sf.values, result);
    //         assert.deepEqual(sf.index, expected_index);
    //     });
    //     it("Sort values in a Series in Descending order", function () {
    //         let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
    //         let result = [89, 57, 30, 20, 4, 4, 2, 1, 0];
    //         let sorted_sf = sf.sortValues({ ascending: false });
    //         assert.deepEqual(sorted_sf.values, result);
    //     });
    //     it("confirms that sortValues in descending order happens inplace", function () {
    //         let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
    //         let result = [89, 57, 30, 20, 4, 4, 2, 1, 0];
    //         sf.sortValues({ ascending: false, inplace: true });
    //         assert.deepEqual(sf.values, result);
    //     });
    //     it("Confirms that series index is sorted in ascending order (not in inplace)", function () {
    //         let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
    //         let result = [7, 2, 3, 8, 4, 0, 1, 5, 6];
    //         let sorted_sf = sf.sortValues();
    //         assert.deepEqual(sorted_sf.index, result);
    //     });
    //     it("Confirms that series index is sorted in descending order (not in inplace)", function () {
    //         let sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
    //         let result = [6, 5, 1, 0, 4, 8, 3, 2, 7];
    //         let sorted_sf = sf.sortValues({ ascending: false });
    //         assert.deepEqual(sorted_sf.index, result);
    //     });
    //     it("Sort string values in a Series", function () {
    //         let sf = new Series(["boy", "zebra", "girl", "man"]);
    //         let result = ["boy", "girl", "man", "zebra"];
    //         let sorted_sf = sf.sortValues({ ascending: false });
    //         assert.deepEqual(sorted_sf.values, result);
    //     });
    //     it("Throws error on sorting of string", function () {
    //         let sf = new Series(["boy", "man", "girl"])
    //         assert.throws(() => { sf.sortValues() }, Error, "Dtype Error: cannot sort Series of type string")
    //     })
    // });
})
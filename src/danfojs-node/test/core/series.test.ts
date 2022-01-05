import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { Series } from "../../dist/danfojs-node/src";

describe("Series Functions", () => {

    describe("head", function () {
        it("Gets the first 2 rows in a Series", function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const cols = ["A"];
            const sf = new Series(data, { columns: cols });
            assert.deepEqual(sf.head(2).values, [1, 2]);
            assert.deepEqual(sf.head(5).values, [1, 2, 3, 4, 5]);
        });
        it("throw error when row specified is greater than values", function () {
            const data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            const cols = ["Items"];
            const sf = new Series(data, { columns: cols });
            assert.throws(function () { assert.deepEqual(sf.head(10).values, data) }, Error, `row slice [end] index cannot be bigger than 5`);
        });

        it("throw error when row specified is less than 0", function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const sf = new Series(data);
            assert.throws(function () { assert.deepEqual(sf.head(-1).values, data) }, Error, `ParamError: end must be greater than start`);
        });
    });


    describe("tail", function () {
        it("Prints the last n rows of a Series", function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const sf = new Series(data);
            assert.deepEqual(sf.tail(2).values, [89, 78]);
            assert.deepEqual(sf.tail(4).values, [40, 39, 89, 78]);

        });
        it("throw error when row specified is greater than values", function () {
            const data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            const cols = ["Items"];
            const sf = new Series(data, { columns: cols });
            assert.throws(function () { assert.deepEqual(sf.tail(15).values, data) }, Error, `row slice [start] index cannot be less than 0`);
        });

        it("throw error when row specified is less than 0", function () {
            const data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            const cols = ["Items"];
            const sf = new Series(data, { columns: cols });
            assert.throws(function () { assert.deepEqual(sf.tail(-1).values, data) }, Error, `ParamError: end must be greater than start`);
        });
    });

    describe("sample", function () {
        it("Samples n number of random elements from a DataFrame", async function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const sf = new Series(data);
            assert.deepEqual((await sf.sample(7)).values.length, 7);
        });
        it("Return all values if n of sample -1", async function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const sf = new Series(data);
            assert.deepEqual((await sf.sample(-1)).values.length, data.length);
        });

        it("Throw error if n is greater than lenght of Series", async function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const sf = new Series(data);
            try {
                await sf.sample(100);
            } catch (e: any) {
                expect(e.message).to.eql('Sample size n cannot be bigger than size of dataset');
            }
        });
    });

    describe("add", function () {
        it("Return Addition of series with another series", function () {
            const data = [1, 2, 3, 4, 5, 6];
            const data2 = [30, 40, 39, 1, 2, 1];
            const sf = new Series(data);
            const sf2 = new Series(data2);
            assert.deepEqual((sf.add(sf2) as Series).values, [31, 42, 42, 5, 7, 7]);
        });
        it("Return Addition of series with a single value (Broadcasting)", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            assert.deepEqual((sf.add(1) as Series).values, [2, 3, 4, 5, 6]);
        });
        it("Return Addition of series with another series inplace", function () {
            const data = [1, 2, 3, 4, 5, 6];
            const data2 = [30, 40, 39, 1, 2, 1];
            const sf = new Series(data);
            const sf2 = new Series(data2);
            sf.add(sf2, { inplace: true })
            assert.deepEqual(sf.values, [31, 42, 42, 5, 7, 7]);
        });
        it("Return Addition of series with a single value (Broadcasting) inplace", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            sf.add(1, { inplace: true })
            assert.deepEqual(sf.values, [2, 3, 4, 5, 6]);
        });
        it("Dtype is properly updated on addition of series with a single float value inplace", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            sf.add(1.23, { inplace: true })
            assert.deepEqual(sf.dtypes[0], "float32");
            assert.deepEqual(sf.values, [2.23, 3.23, 4.23, 5.23, 6.23]);
        });
        it("Add works properly when using tfjs add function", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            sf.add(1.23, { inplace: true })
            assert.deepEqual(sf.dtypes[0], "float32");
            assert.deepEqual(sf.values, [2.23, 3.23, 4.23, 5.23, 6.23]);
        });
        it("Add works properly when using tfjs add function on Series", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            const sf2 = new Series([1.23, 1.23, 1.23, 1.23, 1.23]);
            sf.add(sf2, { inplace: true })
            assert.deepEqual(sf.values, [2.23, 3.23, 4.23, 5.23, 6.23]);
        });
        it("Throws type error on addition of string type", function () {
            const data = [1, 2, 3, 4];
            const data2 = ["A", "B", "C", "d"];
            const sf = new Series(data);
            const sf2 = new Series(data2);
            assert.throws(
                () => {
                    sf.add(sf2);
                },
                Error,
                "DtypeError: String data type does not support add operation"
            );
        });
        it("Throws length error if series lenght mixmatch", function () {
            const data = [1, 2, 3, 4]
            const data2 = [1, 2, 3, 4, 5, 6]
            const sf = new Series(data)
            const sf2 = new Series(data2)
            assert.throws(() => { sf.add(sf2) }, Error, "Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });

    describe("sub", function () {
        it("Return Subtraction of series with another series", function () {
            const data1 = [30, 40, 39, 1, 2, 1];
            const data2 = [1, 2, 3, 4, 5, 6];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual((sf1.sub(sf2) as Series).values, [29, 38, 36, -3, -3, -5]);
        });
        it("Return Subtraction of series with a single value (Broadcasting)", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            assert.deepEqual((sf.sub(1) as Series).values, [0, 1, 2, 3, 4]);
        });
        it("Throws type error on Subtraction of string type", function () {
            const data = [1, 2, 3, 4];
            const data2 = ["A", "B", "C", "d"];
            const sf = new Series(data);
            const sf2 = new Series(data2);
            assert.throws(
                () => {
                    sf.sub(sf2);
                },
                Error,
                "DtypeError: String data type does not support sub operation"
            );
        });
        it("Throws length error if series lenght mixmatch", function () {
            const data = [1, 2, 3, 4]
            const data2 = [1, 2, 3, 4, 5, 6]
            const sf = new Series(data)
            const sf2 = new Series(data2)
            assert.throws(() => { sf.sub(sf2) }, Error, "Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });

    describe("mul", function () {
        it("Return multiplication of series with another series", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [1, 2, 3, 4];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual((sf1.mul(sf2) as Series).values, [30, 80, 9, 20]);
        });
        it("Return multiplication of series with a single value (Broadcasting)", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            assert.deepEqual((sf.mul(1) as Series).values, [1, 2, 3, 4, 5]);
        });
        it("Throws type error on multiplication of string type", function () {
            const data = [1, 2, 3, 4]
            const data2 = ["A", "B", "C", "d"]
            const sf = new Series(data)
            const sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "DtypeError: String data type does not support mul operation")
        })
        it("Throws length error if series lenght mixmatch", function () {
            const data = [1, 2, 3, 4]
            const data2 = [1, 2, 3, 4, 5, 6]
            const sf = new Series(data)
            const sf2 = new Series(data2)
            assert.throws(() => { sf.mul(sf2) }, Error, "ParamError: Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });


    describe("div", function () {
        it("Return float division of series with another series", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [1, 2, 3, 4];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual((sf1.div(sf2) as Series).values, [30, 20, 1, 1.25]);
        });
        it("Return integer division of series with another series", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [1, 2, 3, 4];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual((sf1.div(sf2) as Series).values, [30, 20, 1, 1.25]);
        });
        it("Return division of series with a single value (Broadcasting)", function () {
            const data = [10, 2, 3, 90];
            const sf = new Series(data);
            assert.deepEqual((sf.div(2) as Series).values, [5, 1, 1.5, 45]);
        });
        it("Throws type error on division of string type", function () {
            const data = [1, 2, 3, 4]
            const data2 = ["A", "B", "C", "d"]
            const sf = new Series(data)
            const sf2 = new Series(data2)
            assert.throws(() => { sf.div(sf2) }, Error, `DtypeError: String data type does not support div operation`)
        })
        it("Throws length error if series lenght mixmatch", function () {
            const data = [1, 2, 3, 4]
            const data2 = [1, 2, 3, 4, 5, 6]
            const sf = new Series(data)
            const sf2 = new Series(data2)
            assert.throws(() => { sf.div(sf2) }, Error, "ParamError: Row length mismatch. Length of other (6), must be the same as Ndframe (4)")
        })
    });

    describe("pow", function () {
        it("Return Exponetial power of series with another series", function () {
            const data1 = [2, 3, 4, 5];
            const data2 = [1, 2, 3, 0];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual((sf1.pow(sf2) as Series).values, [2, 9, 64, 1]);
        });
        it("Return Exponetial power of series with a single value (Broadcasting)", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            assert.deepEqual((sf.pow(2) as Series).values, [1, 4, 9, 16, 25]);
        });
    });

    describe("mod", function () {
        it("Return modulo of series with another float series", function () {
            const data1 = [2, 30, 4, 5];
            const data2 = [1.1, 2.2, 3.3, 2.4];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [
                0.8999999999999999,
                1.3999999999999977,
                0.7000000000000002,
                0.20000000000000018
            ];
            assert.deepEqual((sf1.mod(sf2) as Series).values, expected);
        });
        it("Return modulo of series with another int series", function () {
            const data1 = [2, 30, 4, 5];
            const data2 = [1, 2, 3, 1];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual((sf1.mod(sf2) as Series).values, [0, 0, 1, 0]);
        });
        it("Return modulo power of series with a single value (Broadcasting)", function () {
            const data = [1, 2, 3, 4, 5];
            const sf = new Series(data);
            assert.deepEqual((sf.mod(2) as Series).values, [1, 0, 1, 0, 1]);
        });
    });

    describe("toString", function () {
        it("Prints a series to the console", async function () {
            const data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            const sf = new Series(data);
            sf.print()
        });
        it("Prints a series to the console", async function () {
            const data = ["This is a long text group and I want it to print in full",
                "This is a long text group and I want it to print in full"];
            const sf = new Series(data);
            sf.print()
        });
    });

    describe("Empty Series", function () {
        it("Can successfully create an empty Series from empty array", function () {
            const data: any = [];
            const sf = new Series(data);
            assert.deepEqual(sf.shape, [0, 0]);
            assert.deepEqual(sf.columns, []);
            assert.deepEqual(sf.dtypes, []);
            assert.deepEqual(sf.values, []);
        });

        it("Can successfully create an empty Series", function () {
            const sf = new Series();
            assert.deepEqual(sf.shape, [0, 0]);
            assert.deepEqual(sf.columns, []);
            assert.deepEqual(sf.dtypes, []);
            assert.deepEqual(sf.values, []);
        });
    });

    describe("mean", function () {
        it("Computes the mean of elements in a int series", function () {
            const data1 = [30, 40, 3, 5, NaN];
            const sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.5);
        });
        it("Computes the mean of elements in a int series", function () {
            const data1 = [30, 40, 3, 5, NaN];
            const sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.5);
        });
        it("Computes the mean of elements in a float series", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.625);
        });
        it("Computes the mean of elements in a float series with NaN", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1, NaN];
            const sf = new Series(data1);
            assert.deepEqual(sf.mean(), 19.625);
        });
        it("Computes the mean of a boolean series", function () {
            const data1 = [true, false, false, false, true, true, false, true];
            const sf = new Series(data1);
            assert.deepEqual(sf.mean(), 0.5);
        });
        it("Throws error if dtype is string", function () {
            const data1 = ["boy", "girl", "Man"];
            const sf = new Series(data1);
            assert.throws(
                () => {
                    sf.mean();
                },
                Error,
                "DtypeError: String data type does not support mean operation"
            );
        });
    });

    describe("median", function () {
        it("Computes the median value of elements across int Series", function () {
            const data1 = [30, 40, 3, 5];
            const sf = new Series(data1);
            assert.deepEqual(sf.median(), 17.5);
        });
        it("Computes the median value of elements across float Series", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1, NaN];
            const sf = new Series(data1);
            assert.deepEqual(sf.median(), 17.6);
        });
    });

    describe("sum", function () {
        it("Sum values of a Int Series", function () {
            const data1 = [30, 40, 3, 5, 5, 5, 5, 5, 3, 3, 3, 21, 3];
            const sf = new Series(data1);
            assert.deepEqual(sf.sum(), 131);
        });
        it("Sum values of a Float Series", function () {
            const data1 = [30.1, 3.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(sf.sum(), 81.6);
        });
        it("Sum values of a bool Series", function () {
            const data1 = [true, true, false, false, false];
            const sf = new Series(data1);
            assert.deepEqual(sf.sum(), 2);
        });
        it("Sum values a Series with missing values", function () {
            const data1 = [11, NaN, 2, 2];
            const sf = new Series(data1);
            assert.deepEqual(sf.sum(), 15);
        });
    });

    describe("mode", function () {
        it("Computes the multi-modal values of a Series", function () {
            const data1 = [30, 40, 3, 5, 5, 5, 5, 5, 3, 3, 3, 21, 3];
            const sf = new Series(data1);
            assert.deepEqual(sf.mode(), [5, 3]);
        });
        it("Computes the modal value of a Series", function () {
            const data1 = [30.1, 3.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(sf.mode(), [3.1]);
        });
    });

    describe("min", function () {
        it("Returns the single smallest elementin a Series", function () {
            const data = [30, 40, 3, 5];
            const sf = new Series(data);
            assert.deepEqual(sf.min(), 3);
        });
        it("Computes the minimum of elements across an float Series", function () {
            const data1 = [30.1, 40.2, 3.12, 5.1];
            const sf = new Series(data1, { dtypes: ["float32"] });
            assert.deepEqual(Number(sf.min().toFixed(2)), 3.12);
        });
    });

    describe("max", function () {
        it("Computes the maximum of elements across dimensions of a Series", function () {
            const data1 = [30, 40, 3, 5];
            const sf = new Series(data1);
            assert.deepEqual(sf.max(), 40);
        });
        it("Return sum of float values in a series", function () {
            const data1 = [30.1, 40.21, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(Number(sf.max().toFixed(2)), 40.21);
        });
        it("Throws error on addition of string Series", function () {
            const data1 = ["boy", "gitl", "woman", "man"];
            const sf = new Series(data1);
            assert.throws(
                () => {
                    sf.max();
                },
                Error,
                "DtypeError: String data type does not support max operation"
            );
        });
    });

    describe("count", function () {
        it("Returns the count of non NaN values in a string Series", function () {
            const data = ["boy", "gitl", "woman", NaN];
            const sf = new Series(data);
            assert.deepEqual(sf.count(), 3);
        });
        it("Returns the count of values in a string Series without NaN", function () {
            const data = ["boy", "gitl", "woman", "Man"];
            const sf = new Series(data);
            assert.deepEqual(sf.count(), 4);
        });
        it("Returns the count of non NaN values in a int Series", function () {
            const data = [20, 30, NaN, 2, NaN, 30, 21];
            const sf = new Series(data);
            assert.deepEqual(sf.count(), 5);
        });
        it("Returns the count of non NaN values in a float Series", function () {
            const data = [20.1, 30.4, NaN, 2.1, NaN, 30.0, 21.3];
            const sf = new Series(data);
            assert.deepEqual(sf.count(), 5);
        });
    });

    describe("std", function () {
        it("Computes the standard of elements in a int series", function () {
            const data1 = [30, 40, 3, 5];
            const sf = new Series(data1);
            assert.deepEqual(sf.std(), 18.375708603116962);
        });
        it("Computes the standard deviation of elements in a float series", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(sf.std(), 18.412925713566906);
        });
        it("Computes the standard deviation of elements in a float series with missing values", function () {
            const data1 = [30, 40, 3, 5, undefined];
            const sf = new Series(data1);
            assert.deepEqual(sf.std(), 18.375708603116962);
        });
    });

    describe("var", function () {
        it("Computes the variance of elements in a int series", function () {
            const data1 = [30, 40, 3, 5];
            const sf = new Series(data1);
            assert.deepEqual(sf.var(), 337.6666666666667);
        });
        it("Computes the variance of elements in a float series", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(sf.var(), 339.03583333333336);
        });
        it("Computes the variance of elements in a int series with missing values", function () {
            const data1 = [30, undefined, 40, 3, 5];
            const sf = new Series(data1);
            assert.deepEqual(sf.var(), 337.6666666666667);
        });
    });

    describe("round", function () {
        it("Rounds elements in a Series to nearest whole number", function () {
            const data1 = [30.21091, 40.190901, 3.564, 5.0212];
            const sf = new Series(data1);
            assert.deepEqual((sf.round() as Series).values, [30.2, 40.2, 3.6, 5]);
        });
        it("Rounds elements in a Series to 1dp", function () {
            const data1 = [30.21091, 40.190901, 3.564, 5.0212];
            const sf = new Series(data1);
            assert.deepEqual((sf.round(1) as Series).values, [30.2, 40.2, 3.6, 5.0]);
        });
        it("Rounds elements in a Series to 2dp", function () {
            const data1 = [30.2191, 40.190901, 3.564, 5.0212];
            const sf = new Series(data1);
            assert.deepEqual((sf.round(2) as Series).values, [30.22, 40.19, 3.56, 5.02]);
        });

        it("Rounds elements in a Series to 2dp inplace", function () {
            const data1 = [30.2191, 40.190901, 3.564, 5.0212];
            const sf = new Series(data1);
            sf.round(2, { inplace: true })
            assert.deepEqual(sf.values, [30.22, 40.19, 3.56, 5.02]);
        });

        it("Rounds elements in a Series with missing values to 2dp", function () {
            const data1 = [30.2191, undefined, 3.564, NaN];
            const sf = new Series(data1);
            sf.round(2, { inplace: true })
            assert.deepEqual(sf.values as number[], [30.22, undefined, 3.56, NaN]);
        });

    });

    describe("maximum", function () {
        it("Returns the maximum of two series", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [10, 41, 2, 0];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual(sf1.maximum(sf2).values, [30, 41, 3, 5]);
        });
        it("Returns the maximum of series and Array", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [10, 41, 2, 0];
            const sf1 = new Series(data1);
            assert.deepEqual(sf1.maximum([10, 41, 2, 0]).values, [30, 41, 3, 5]);
        });
        it("Returns the maximum of series and scalar", function () {
            const data1 = [30, 40, 3, 5];
            const sf1 = new Series(data1);
            assert.deepEqual(sf1.maximum(10).values, [30, 40, 10, 10]);
        });
        it("Throws error on checking maximum of incompatible Series", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [10, 41, 2];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.throws(
                () => {
                    sf1.maximum(sf2);
                },
                Error,
                "ParamError: Row length mismatch. Length of other (3), must be the same as Ndframe (4)"
            );
        });
    });

    describe("minimum", function () {
        it("Returns the minimum of two series", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [10, 41, 2, 0];
            const sf1 = new Series(data1);
            const sf2 = new Series(data2);
            assert.deepEqual(sf1.minimum(sf2).values, [10, 40, 2, 0]);
        });
        it("Returns the minimum of series and array", function () {
            const data1 = [30, 40, 3, 5];
            const data2 = [10, 41, 2, 0];
            const sf1 = new Series(data1);
            assert.deepEqual(sf1.minimum(data2).values, [10, 40, 2, 0]);
        });
        it("Returns the minimum of two series", function () {
            const data1 = [30, 40, 3, 5];
            const sf1 = new Series(data1);
            assert.deepEqual(sf1.minimum(10).values, [10, 10, 3, 5]);
        });
    });

    describe("isNa", function () {
        it("Return a boolean same-sized object indicating if string Series contain NaN", function () {
            const data1 = [NaN, undefined, "girl", "Man"];
            const sf = new Series(data1);
            assert.deepEqual(sf.isNa().values, [true, true, false, false]);
        });
        it("Return a boolean same-sized object indicating if float Series values are NaN", function () {
            const data1 = [30.21091, NaN, 3.564, undefined];
            const sf = new Series(data1);
            assert.deepEqual(sf.isNa().values, [false, true, false, true]);
        });
        it("Return a boolean same-sized object indicating if int Series values are NaN", function () {
            const data1 = [30, 40, 3, 5, undefined, undefined];
            const sf = new Series(data1);
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
            const data = [NaN, 1, 2, 33, 4, NaN, 5, 6, 7, 8];
            const sf = new Series(data);
            const sfVal = [-999, 1, 2, 33, 4, -999, 5, 6, 7, 8];
            sf.fillNa(-999, { inplace: true });
            assert.deepEqual(sf.values, sfVal);
        });
        it("replace all NaN value in string Series with specified value", function () {
            const data = [NaN, "boy", NaN, "hey", "Man", undefined];
            const sf = new Series(data);
            const sfVal = ["filled", "boy", "filled", "hey", "Man", "filled"];
            const sfFill = sf.fillNa("filled");
            assert.deepEqual((sfFill as Series).values, sfVal);
        });
        it("Data is in right format after filling", function () {
            const data = [NaN, "boy", NaN, "hey", "Man", undefined];
            const sf = new Series(data);
            const sfVal = ["filled", "boy", "filled", "hey", "Man", "filled"];
            const sfFill = sf.fillNa("filled");
            assert.deepEqual((sfFill as Series).values, sfVal);
        });
    });

    describe("sortValues", function () {
        it("Sort values in a Series in ascending order (not inplace)", function () {
            const sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
            const result = [0, 1, 2, 4, 4, 20, 30, 57, 89];
            const sortedSf = sf.sortValues();
            assert.deepEqual((sortedSf as Series).values, result);

        });
        it("confirms that sortValues in ascending order does not happen inplace", function () {
            const sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
            const result = [0, 1, 2, 4, 4, 20, 30, 57, 89];
            const expectedIndex = [7, 2, 3, 8, 4, 0, 1, 5, 6];
            sf.sortValues(true, { inplace: true });
            assert.deepEqual(sf.values, result);
            assert.deepEqual(sf.index, expectedIndex);
        });
        it("Sort values in a Series in Descending order", function () {
            const sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
            const result = [89, 57, 30, 20, 4, 4, 2, 1, 0];
            const sortedSf = sf.sortValues(false);
            assert.deepEqual((sortedSf as Series).values, result);
        });
        it("confirms that sortValues in descending order happens inplace", function () {
            const sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
            const result = [89, 57, 30, 20, 4, 4, 2, 1, 0];
            sf.sortValues(false, { inplace: true });
            assert.deepEqual(sf.values, result);
        });
        it("Confirms that series index is sorted in ascending order (not in inplace)", function () {
            const sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
            const result = [7, 2, 3, 8, 4, 0, 1, 5, 6];
            const sortedSf = sf.sortValues() as Series
            assert.deepEqual(sortedSf.index, result);
        });
        it("Confirms that series index is sorted in descending order (not in inplace)", function () {
            const sf = new Series([20, 30, 1, 2, 4, 57, 89, 0, 4]);
            const result = [6, 5, 1, 0, 4, 8, 3, 2, 7];
            const sortedSf = sf.sortValues(false) as Series
            assert.deepEqual(sortedSf.index, result);
        });
        it("Sort string values in a Series", function () {
            const sf = new Series(["boy", "zebra", "girl", "man"]);
            const result = ["boy", "girl", "man", "zebra"];
            const sortedSf = sf.sortValues(false) as Series
            assert.deepEqual(sortedSf.values, result);
        });
    });

    describe("describe", function () {
        it("Computes the descriptive statistics on an int Series", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1)
            assert.deepEqual((sf.describe().round() as Series).values, [
                7,
                27,
                17.4,
                10,
                23,
                56,
                302
            ]);
        });
        it("Computes the descriptive statistics on a float Series", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual((sf.describe().round() as Series).values, [
                4,
                19.6,
                18.4,
                3.1,
                17.6,
                40.2,
                339
            ]);
        });
        it("Computes the descriptive statistics on a float Series", function () {
            const data1 = [30.1, 40.2, 3.1, 5.1];
            const sf = new Series(data1);
            assert.deepEqual(sf.describe().index, [
                "count",
                "mean",
                "std",
                "min",
                "median",
                "max",
                "variance"
            ]);
        });
    });

    describe("resetIndex", function () {
        it("resets the index of a Series", function () {
            const data = [
                { alpha: "A", count: 1 },
                { alpha: "B", count: 2 },
                { alpha: "C", count: 3 }
            ];
            const df = new Series(data, { index: ["one", "two", "three"] });
            const dfReset = df.resetIndex() as Series
            assert.deepEqual(dfReset.index, [0, 1, 2]);
        });
        it("Reset the index of a Series created from an Array", function () {
            const data = [1, 2, 3, 4, 5, 6];
            const df = new Series(data, { index: ["one", "two", "three", "four", "five", "six"] });
            const dfNew = df.resetIndex() as Series
            assert.deepEqual(dfNew.index, [0, 1, 2, 3, 4, 5]);
        });
        it("checks that the original series changed after reseting new index inplace", function () {
            const data = [
                { index: "A", count: 1 },
                { index: "B", count: 2 },
                { index: "C", count: 3 }
            ];
            const df = new Series(data, { index: ["one", "two", "three"] });
            df.resetIndex({ inplace: true });
            assert.deepEqual(df.index, [0, 1, 2]);
        });
    });

    describe("setIndex", function () {
        it("sets the index of an Series", function () {
            const data = [
                { alpha: "A", count: 1 },
                { alpha: "B", count: 2 },
                { alpha: "C", count: 3 }
            ];
            const df = new Series(data);
            const dfNew = df.setIndex(["one", "two", "three"]) as Series
            assert.deepEqual(dfNew.index, ["one", "two", "three"]);
            assert.notDeepEqual(df.index, dfNew.index);
        });
        it("checks that the original series is not modified after setting new index not-inplace", function () {
            const data = [
                { alpha: "A", count: 1 },
                { alpha: "B", count: 2 },
                { alpha: "C", count: 3 }
            ];
            const df = new Series(data);
            const dfNew = df.setIndex(["one", "two", "three"]) as Series
            assert.notDeepEqual(df.index, dfNew.index);
        });
        it("sets the index of an Series inplace", function () {
            const data = [12, 2, 20, 50];
            const df = new Series(data);
            df.setIndex(["one", "two", "three", "four"], { inplace: true });
            assert.deepEqual(df.index, ["one", "two", "three", "four"]);
        });
        it("Throws index not found error", function () {
            const data = [12, 2, 20, 50];
            const df = new Series(data);
            assert.throws(() => {
                // @ts-ignore: 
                df.setIndex()
            }, Error,
                "Param Error: Must specify index array"
            )
        });
    });

    describe("Map", function () {
        it("map series element to object keys", function () {
            const sf = new Series([1, 2, 3, 4]);
            const map = { 1: "ok", 2: "okie", 3: "frit", 4: "gop" };
            const rslt = ["ok", "okie", "frit", "gop"];
            assert.deepEqual((sf.map(map) as Series).values, rslt);
        });
        it("map series element to object keys inplace", function () {
            const sf = new Series([1, 2, 3, 4]);
            const map = { 1: "ok", 2: "okie", 3: "frit", 4: "gop" };
            const rslt = ["ok", "okie", "frit", "gop"];
            sf.map(map, { inplace: true })
            assert.deepEqual(sf.values, rslt);
        });
        it("map series element to a function statement", function () {
            const sf = new Series([1, 2, 3, 4]);
            const func_map = (x: any) => {
                return x + 1;
            };
            const rslt = [2, 3, 4, 5];
            assert.deepEqual((sf.map(func_map) as Series).values, rslt);
        });

        it("map series element to a function statement inplace", function () {
            const sf = new Series([1, 2, 3, 4]);
            const func_map = (x: any) => {
                return x + 1;
            };
            const rslt = [2, 3, 4, 5];
            sf.map(func_map, { inplace: true })
            assert.deepEqual(sf.values, rslt);
        });
    });

    describe("Apply", function () {
        it("apply a function to a series element", function () {
            const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8]);
            const applyFunc = (x: any) => {
                return x + x;
            };

            const rslt = [2, 4, 6, 8, 10, 12, 14, 16];
            assert.deepEqual((sf.apply(applyFunc) as Series).values, rslt);
        });

        it("apply a function to a series element inplace", function () {
            const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8]);
            const applyFunc = (x: any) => {
                return x + x;
            };

            const rslt = [2, 4, 6, 8, 10, 12, 14, 16];
            sf.apply(applyFunc, { inplace: true })
            assert.deepEqual(sf.values, rslt);
        });
    });

    describe("unique", function () {
        it("returns the unique values in a Series of type int", function () {
            const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 22, 8, 5, 5, 5]);
            const expected = [1, 2, 3, 4, 5, 6, 7, 8, 22];
            assert.deepEqual(sf.unique().values, expected);
        });
        it("returns the unique values in a Series of type string", function () {
            const sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"]);
            const expected = ["a", "b", "c", "d", "e"];
            assert.deepEqual(sf.unique().values, expected);
        });
        it("returns the unique values in a Series of type string", function () {
            const sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"]);
            const expected = ["a", "b", "c", "d", "e"];
            assert.deepEqual(sf.unique().values, expected);
        });
    });

    describe("nUnique", function () {
        it("returns the number of unique values in a Series of type string", function () {
            const sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"]);
            assert.deepEqual(sf.nUnique(), 5);
        });
        it("returns the number of unique values in a Series of type int32", function () {
            const sf = new Series([1, 2, 3, 4, 3, 4, 3, 50, 4, 4, 4, 1]);
            assert.deepEqual(sf.nUnique(), 5);
        });
    });

    describe("valueCounts", function () {
        it("returns the unique values and their counts in a Series of type int", function () {
            const sf = new Series([1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 22, 8, 5, 5, 5]);
            const expectedIndex = [1, 2, 3, 4, 5, 6, 7, 8, 22];
            const expectedVals = [3, 1, 1, 1, 4, 1, 1, 2, 1];
            assert.deepEqual(sf.valueCounts().values, expectedVals);
            assert.deepEqual(sf.valueCounts().index, expectedIndex);
        });
        it("returns the unique values and their counts in a Series of type string", function () {
            const sf = new Series(["a", "a", "b", "c", "c", "d", "e", "d", "d", "e"]);
            const expectedVals = [2, 1, 2, 3, 2];
            const expectedIndex = ["a", "b", "c", "d", "e"];
            assert.deepEqual(sf.valueCounts().values, expectedVals);
            assert.deepEqual(sf.valueCounts().index, expectedIndex);
        });
        it("returns the unique values and their counts in a Series of type boolean", function () {
            const sf = new Series([true, false, false, true, true]);
            const expectedVals = [3, 2];
            const expectedIndex = ["true", "false"];
            assert.deepEqual(sf.valueCounts().values, expectedVals);
            assert.deepEqual(sf.valueCounts().index, expectedIndex);
        });
    });

    describe("abs", function () {
        it("Returns the absolute values in Series", function () {
            const data1 = [-10, 45, 56, -25, 23, -20, 10];
            const sf = new Series(data1);
            assert.deepEqual((sf.abs() as Series).values, [10, 45, 56, 25, 23, 20, 10]);
        });
        it("Computes the descriptive statistics on a float Series", function () {
            const data1 = [-30.1, -40.2, -3.1, -5.1];
            const sf = new Series(data1);
            assert.deepEqual((sf.abs() as Series).values, [30.1, 40.2, 3.1, 5.1]);
        });
    });

    describe("cumSum", function () {
        it("Return cumulative sum over a Series", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            assert.deepEqual((sf.cumSum() as Series).values, [10, 55, 111, 136, 159, 179, 189]);
        });
        it("Return cumulative sum over a Series inplace", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            sf.cumSum({ inplace: true });
            assert.deepEqual(sf.values, [10, 55, 111, 136, 159, 179, 189]);
        });
    });

    describe("cumMax", function () {
        it("Return cumulative maximum over a Series", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            assert.deepEqual((sf.cumMax() as Series).values, [10, 45, 56, 56, 56, 56, 56]);
        });
        it("Return cumulative maximum over a Series inplace", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            sf.cumMax({ inplace: true });
            assert.deepEqual(sf.values, [10, 45, 56, 56, 56, 56, 56]);
        });
    });

    describe("cumMin", function () {
        it("Return cumulative minimum over a Series", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            assert.deepEqual((sf.cumMin() as Series).values, [10, 10, 10, 10, 10, 10, 10]);
        });
    });

    describe("cumProd", function () {
        it("Return cumulative product over a Series", function () {
            const data1 = [1, 2, 10, 3, 12, 14, 1];
            const sf = new Series(data1);
            const rslt = [1, 2, 20, 60, 720, 10080, 10080];
            assert.deepEqual((sf.cumProd() as Series).values, rslt);
        });
    });

    describe("lt", function () {
        it("Return Less than of series and other series (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const data2 = [100, 450, 590, 5, 25, 2, 0];

            const sf = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [true, true, true, false, true, false, false];
            assert.deepEqual(sf.lt(sf2).values, expected);
        });

        it("Return Less than of series scalar (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            const expected = [true, false, false, true, true, true, true];
            assert.deepEqual(sf.lt(30).values, expected);
        });

        it("Correct index is returned after operation", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1, { index: ["one", "two", "three", "four", "five"] });

            const expected = ["one", "two", "three", "four", "five"];
            assert.deepEqual(sf.lt(data2).index, expected);
        });
    });

    describe("gt", function () {
        it("Return Greater than of series and other series (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const data2 = [100, 450, 590, 5, 25, 2, 0];

            const sf = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [false, false, false, true, false, true, true];
            assert.deepEqual(sf.gt(sf2).values, expected);
        });

        it("Return Greater than of series scalar (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            const expected = [false, true, true, false, false, false, false];
            assert.deepEqual(sf.gt(30).values, expected);
        });

        it("Correct index is returned after operation", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1, { index: ["one", "two", "three", "four", "five"] });

            const expected = ["one", "two", "three", "four", "five"];
            assert.deepEqual(sf.and(data2).index, expected);
        });
    });

    describe("le", function () {
        it("Return Less than or Equal to of series and other series (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const data2 = [100, 450, 590, 5, 25, 2, 0];

            const sf = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [true, true, true, false, true, false, false];
            assert.deepEqual(sf.le(sf2).values, expected);
        });

        it("Return Less than or Equal to of series scalar (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            const expected = [true, false, false, true, true, true, true];
            assert.deepEqual(sf.le(30).values, expected);
        });
    });

    describe("ge", function () {
        it("Return Greater than or Equal to of series and other series (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const data2 = [100, 450, 56, 5, 25, 20, 0];

            const sf = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [false, false, true, true, false, true, true];
            assert.deepEqual(sf.ge(sf2).values, expected);
        });

        it("Return Greater than or Equal to of series scalar (element-wise)", function () {
            const data1 = [30, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            const expected = [true, true, true, false, false, false, false];
            assert.deepEqual(sf.ge(30).values, expected);
        });
    });

    describe("ne", function () {
        it("Return Not Equal to of series and other series (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const data2 = [10, 450, 56, 5, 25, 2, 0];

            const sf = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [false, true, false, true, true, true, true];
            assert.deepEqual(sf.ne(sf2).values, expected);
        });

        it("Return Not Equal to of series scalar (element-wise)", function () {
            const data1 = [10, 30, 56, 30, 23, 20, 10];
            const sf = new Series(data1);
            const expected = [true, false, true, false, true, true, true];
            assert.deepEqual(sf.ne(30).values, expected);
        });
    });

    describe("eq", function () {
        it("Return Equal to of series and other series (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const data2 = [100, 450, 590, 25, 25, 2, 0];

            const sf = new Series(data1);
            const sf2 = new Series(data2);
            const expected = [false, false, false, true, false, false, false];
            assert.deepEqual(sf.eq(sf2).values, expected);
        });

        it("Return Equal to of series scalar (element-wise)", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 30];
            const sf = new Series(data1);
            const expected = [false, false, false, false, false, false, true];
            assert.deepEqual(sf.eq(30).values, expected);
        });
    });

    describe("replace", function () {
        it("Replace values with new value", function () {
            const data1 = [10, 45, 56, 25, 23, 20, 10];
            const sf = new Series(data1);
            const expected = [-50, 45, 56, 25, 23, 20, -50];
            const dfRep = sf.replace(10, -50) as Series
            assert.deepEqual(dfRep.values, expected);
        });

        it("Replace values given in replace param with value (String type)", function () {
            const data1 = ["A", "A", "A", "B", "B", "C", "C", "D"];
            const sf = new Series(data1);
            const expected = ["boy", "boy", "boy", "B", "B", "C", "C", "D"];
            sf.replace("A", "boy", { inplace: true });
            assert.deepEqual(sf.values, expected);
        });
        it("Replace values given in replace param with value (boolean type)", function () {
            const data1 = [true, true, false, false];
            const sf = new Series(data1);
            const expected = [false, false, false, false];
            sf.replace(true, false, { inplace: true });
            assert.deepEqual(sf.values, expected);
        });
        // it("Throw error on wrong param passed", function () {
        //     const data1 = ["A", "A", "A", "B", "B", "C", "C", "D"];
        //     const sf = new Series(data1);
        //     assert.throws(
        //         () => {
        //             sf.replace(null, "boy", { inplace: true });
        //         },
        //         Error,
        //         "Params Error: Must specify param 'oldValue' to replace"
        //     );
        // });
    });

    describe("dropDuplicates", function () {
        it("Return Series with duplicate values removed (Default, first values kept)", function () {
            const data1 = [10, 45, 56, 10, 23, 20, 10, 10];
            const sf = new Series(data1);
            const expected = [10, 45, 56, 23, 20];
            const expectedIndex = [0, 1, 2, 4, 5];
            const df_drop = sf.dropDuplicates() as Series
            assert.deepEqual(df_drop.values, expected);
            assert.deepEqual(df_drop.index, expectedIndex);
        });

        it("Return Series with duplicate values removed (last values kept)", function () {
            const data1 = [10, 45, 56, 10, 23, 20, 10, 10];
            const sf = new Series(data1);
            const expected = [45, 56, 23, 20, 10];
            const expectedIndex = [1, 2, 4, 5, 7];
            const df_drop = sf.dropDuplicates({ keep: "last" }) as Series
            assert.deepEqual(df_drop.values, expected);
            assert.deepEqual(df_drop.index, expectedIndex);
        });

        it("Return Series with duplicate values removed (String)", function () {
            const data1 = ["A", "A", "A", "B", "B", "C", "C", "D"];
            const sf = new Series(data1);
            const expected = ["A", "B", "C", "D"];
            const expectedIndex = [0, 3, 5, 7];
            sf.dropDuplicates({ keep: "first", inplace: true });
            assert.deepEqual(sf.values, expected);
            assert.deepEqual(sf.index, expectedIndex);
        });
    });

    describe("dropNa", function () {
        it("Return a new Series with missing values removed (Int)", function () {
            const data1 = [10, 45, undefined, 10, 23, 20, undefined, 10];
            const sf = new Series(data1);
            const expected = [10, 45, 10, 23, 20, 10];
            const expectedIndex = [0, 1, 3, 4, 5, 7];
            const sfDrop = sf.dropNa() as Series
            assert.deepEqual(sfDrop.values, expected);
            assert.deepEqual(sfDrop.index, expectedIndex);
            assert.deepEqual(sfDrop.shape, [6, 1]);
        });

        it("Return a new Series with missing values removed (String)", function () {
            const data1 = ["A", NaN, "A", "B", "B", NaN, "C", undefined];
            const sf = new Series(data1);
            const expected = ["A", "A", "B", "B", "C"];
            const expectedIndex = [0, 2, 3, 4, 6];

            sf.dropNa({ inplace: true }) as Series
            assert.deepEqual(sf.values, expected);
            assert.deepEqual(sf.index, expectedIndex);
            assert.deepEqual(sf.shape, [5, 1]);
        });
    });

    describe("argSort", function () {
        it("Return the integer indices that would sort the Series values", function () {
            const data1 = [10, 45, 20, 10, 23, 20, 30, 11];
            const sf = new Series(data1);
            const expected = [3, 0, 7, 5, 2, 4, 6, 1];
            const sf_sort = sf.argSort();
            assert.deepEqual(sf_sort.values, expected);
        });

        it("Return the integer indices that would sort the Series values", function () {
            const data1 = [10.22, 4.5, 2.0, 10, 23.23, 20.1, 30, 11];
            const sf = new Series(data1);
            const expected = [6, 4, 5, 7, 0, 3, 1, 2];
            const sf_sort = sf.argSort(false);
            assert.deepEqual(sf_sort.values, expected);
        });
    });

    describe("argMax", function () {
        it("Return int position of the largest value in the Series.", function () {
            const data1 = [10, 45, 20, 10, 23, 20, 30, 11];
            const sf = new Series(data1);
            const expected = 1;
            const argMax = sf.argMax();
            assert.deepEqual(argMax, expected);
        });

        it("Return int position of the largest value in the Float Series.", function () {
            const data1 = [10.22, 4.5, 2.0, 10, 23.23, 20.1, 30, 11];
            const sf = new Series(data1);
            const expected = 6;
            const argMax = sf.argMax();
            assert.deepEqual(argMax, expected);
        });
    });

    describe("argMin", function () {
        it("Return int position of the smallest value in the Series", function () {
            const data1 = [10, 45, 20, 122, 23, 20, 30, 11];
            const sf = new Series(data1);
            const expected = 0;
            const argMin = sf.argMin();
            assert.deepEqual(argMin, expected);
        });

        it("Return int position of the smallest value in a Float Series", function () {
            const data1 = [10.22, 4.5, 2.0, 10, 23.23, 20.1, 30, 11];
            const sf = new Series(data1);
            const expected = 2;
            const argMin = sf.argMin();
            assert.deepEqual(argMin, expected);
        });
    });

    describe("Str", function () {
        it("Converts all characters to lowercase inplace", function () {
            const data = ["lower", "CAPITALS", "this is a sentence", "SwApCaSe"];
            const res = ["lower", "capitals", "this is a sentence", "swapcase"];
            const sf = new Series(data);
            sf.str.toLowerCase({ inplace: true })
            assert.deepEqual(sf.values, res);
        });
        it("Converts all characters to lowercase", function () {
            const data = ["lower", "CAPITALS", "this is a sentence", "SwApCaSe"];
            const res = ["lower", "capitals", "this is a sentence", "swapcase"];
            const sf = new Series(data);
            assert.deepEqual((sf.str.toLowerCase() as Series).values, res);
        });
        it("Converts all characters to capital case.", function () {
            const data = ["lower", "CAPITALS", "this is a sentence", "SwApCaSe"];
            const res = ["Lower", "Capitals", "This is a sentence", "Swapcase"];
            const sf = new Series(data);
            assert.deepEqual((sf.str.capitalize() as Series).values, res);
        });

        it("Returns the character at the specified index (position)", function () {
            const data = ["lower", "CAPITALS", "this is a sentence", "SwApCaSe"];
            const res = ["w", "P", "i", "A"];
            const sf = new Series(data);
            assert.deepEqual((sf.str.charAt(2) as Series).values, res);
        });

        it("Throws error on concat of numeric series", function () {
            const data = [1, 2, 3, 4, 5, 6];
            const sf = new Series(data);
            assert.throws(
                () => {
                    sf.str.concat("20", 1);
                },
                Error,
                "Cannot call accessor str on non-string type"
            );

        });
    });

    describe("dt", function () {
        it("check month generated", function () {
            const data = ["02Sep2019", "03Dec2019", "04Jan2019"];
            const sf = new Series(data);
            const expected = [8, 11, 0];
            assert.deepEqual(sf.dt.month().values, expected);
        });

        it("check month Name generated", function () {
            const data = ["06-30-2019", "07-29-2019", "08-28-2019"];
            const sf = new Series(data);
            const expected = ["June", "July", "August"];
            assert.deepEqual(sf.dt.monthName().values, expected);
        });

        it("check days of the weeks generated", function () {
            const data = ["06-30-2019", "07-29-2019", "08-28-2019"];
            const sf = new Series(data);
            const expected = ["Sunday", "Monday", "Wednesday"];
            assert.deepEqual(sf.dt.dayOfWeekName().values, expected);
        });

        it("check day of the month generated", function () {
            const data = ["06-30-2019", "07-29-2019", "08-28-2019"];
            const sf = new Series(data);
            const expected = [30, 29, 28];
            assert.deepEqual(sf.dt.dayOfMonth().values, expected);
        });
    });

    describe("astype", function () {
        it("set type of float column to int", function () {
            const data = [-20.1, 30, 47.3, -20];
            const ndframe = new Series(data);
            const df = ndframe.asType("int32") as Series

            assert.deepEqual(df.dtypes[0], "int32");
            assert.deepEqual(df.values, [-20, 30, 47, -20]);
        });
        it("set type of int column to float", function () {
            const data = [34, -4, 5, 6];
            const ndframe = new Series(data);
            const df = ndframe.asType("float32") as Series
            assert.deepEqual(df.dtypes[0], "float32");
            assert.deepEqual(df.values, [34, -4, 5, 6]);
        });
        it("set type of string column to int", function () {
            const data = ["20.1", "21", "23.4", "50.78"];
            const ndframe = new Series(data);
            const df = ndframe.asType("int32") as Series

            assert.deepEqual(df.dtypes[0], "int32");
            assert.deepEqual(df.values, [20, 21, 23, 50]);
        });
        it("set type of string column to float", function () {
            const data = ["20.1", "21", "23.4", "50.78"];
            const ndframe = new Series(data);
            const df = ndframe.asType("float32") as Series

            assert.deepEqual(df.dtypes[0], "float32");
            assert.deepEqual(df.values, [20.1, 21, 23.4, 50.78]);
        });
        it("set type of float column to string", function () {
            const data = [-20.1, 30, 47.3, -20];
            const ndframe = new Series(data);
            const df = ndframe.asType("string") as Series
            assert.deepEqual(df.dtypes[0], "string");
            assert.deepEqual(df.values, ["-20.1", "30", "47.3", "-20"]);
        });
        it("set type of int column to string", function () {
            const data = [34, -4, 5, 6];
            const ndframe = new Series(data);
            const df = ndframe.asType("string") as Series
            assert.deepEqual(df.dtypes[0], "string");
            assert.deepEqual(df.values, ["34", "-4", "5", "6"]);
        });
        it("set type of int column to string inplace", function () {
            const data = [34, -4, 5, 6];
            const ndframe = new Series(data);
            ndframe.asType("string", { inplace: true });
            assert.deepEqual(ndframe.dtypes[0], "string");
            assert.deepEqual(ndframe.values, ["34", "-4", "5", "6"]);
        });
    });

    describe("append", function () {
        it("Add a new single value to the end of a Series inplace", function () {
            const data = [1, 2, 3, 4, "a", "b", "c"];
            const sf = new Series(data);
            const expected_val = [1, 2, 3, 4, "a", "b", "c", "d"];
            sf.append("d", 7, { inplace: true });
            assert.deepEqual(sf.values, expected_val);
        });
        it("Add a new array of values to the end of a Series inplace", function () {
            const data = [1, 2, 3, 4];
            const to_add = ["a", "b", "c"];
            const index = [4, 5, 6];
            const sf = new Series(data);
            const expected_val = [1, 2, 3, 4, "a", "b", "c"];
            sf.append(to_add, index, { inplace: true });
            assert.deepEqual(sf.values, expected_val);
        });
        it("Add a Series to the end of another Series inplace", function () {
            const sf1 = new Series([1, 2, 3, 4]);
            const sf2 = new Series(["a", "b", "c"]);
            const index = [4, 5, 6];
            const expected_val = [1, 2, 3, 4, "a", "b", "c"];
            sf1.append(sf2, index, { inplace: true });
            assert.deepEqual(sf1.values, expected_val);
        });
        it("Add a new single value to the end of a Series", function () {
            const data = [1, 2, 3, 4, "a", "b", "c"];
            const sf = new Series(data);
            const expected_val = [1, 2, 3, 4, "a", "b", "c", "d"];
            const sf2 = sf.append("d", 7) as Series
            assert.deepEqual(sf2.values, expected_val);
        });
        it("Add a new array of values to the end of a Series", function () {
            const data = [1, 2, 3, 4];
            const to_add = ["a", "b", "c"];
            const index = [4, 5, 6];
            const sf = new Series(data);
            const expected_val = [1, 2, 3, 4, "a", "b", "c"];
            const sf2 = sf.append(to_add, index) as Series;
            assert.deepEqual(sf2.values, expected_val);
        });
        it("Add a Series to the end of another Series", function () {
            const sf1 = new Series([1, 2, 3, 4]);
            const sf2 = new Series(["a", "b", "c"]);
            const index = [4, 5, 6];
            const expected_val = [1, 2, 3, 4, "a", "b", "c"];
            const sf3 = sf1.append(sf2, index) as Series;
            assert.deepEqual(sf3.values, expected_val);
        });
        it("Confirm index Change after append", function () {
            const sf1 = new Series([1, 2, 3, 4]);
            const sf2 = new Series(["a", "b", "c"]);
            const index = [4, 5, 6];
            const sf3 = sf1.append(sf2, index) as Series;
            assert.deepEqual(sf3.index, [0, 1, 2, 3, 4, 5, 6]);
        });
        it("Confirm index Change after append inplace", function () {
            const sf1 = new Series([1, 2, 3, 4]);
            const sf2 = new Series(["a", "b", "c"]);
            const index = [4, 5, 6];
            sf1.append(sf2, index, { inplace: true });
            assert.deepEqual(sf1.index, [0, 1, 2, 3, 4, 5, 6]);
        });
    });

    describe("and", function () {
        it("Return logical AND of series and other series (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1);
            const sf2 = new Series(data2);

            const expected = [true, false, true, false, false];
            assert.deepEqual(sf.and(sf2).values, expected);
        });

        it("Return logical AND of series and other scalar", function () {
            const data1 = [true, true, true, false, false];
            const sf = new Series(data1);

            const expected = [true, true, true, false, false];
            assert.deepEqual(sf.and(true).values, expected);
        });

        it("Return logical AND of series and other array (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1);

            const expected = [true, false, true, false, false];
            assert.deepEqual(sf.and(data2).values, expected);
        });

        it("Chaining works for logical AND of series and other array (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const data3 = [true, false, false, true, false];

            const sf = new Series(data1);
            const expected = [true, false, false, false, false];
            assert.deepEqual(sf.and(data2).and(data3).values, expected);
        });

        it("Chaining works for logical AND and OR combined", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const data3 = [true, false, false, true, false];

            const sf = new Series(data1);
            const expected = [true, false, true, true, false];
            assert.deepEqual(sf.and(data2).or(data3).values, expected);
        });
    });

    describe("or", function () {
        it("Return logical OR of series and other series (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1);
            const sf2 = new Series(data2);

            const expected = [true, true, true, true, false];
            assert.deepEqual(sf.or(sf2).values, expected);
        });

        it("Return logical OR of series and other scalar", function () {
            const data1 = [true, true, true, false, false];
            const sf = new Series(data1);

            const expected = [true, true, true, true, true];
            assert.deepEqual(sf.or(true).values, expected);
        });

        it("Return logical OR of series and other array (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1);

            const expected = [true, true, true, true, false];
            assert.deepEqual(sf.or(data2).values, expected);
        });
    });

    describe("and", function () {
        it("Return logical AND of series and other series (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1);
            const sf2 = new Series(data2);

            const expected = [true, false, true, false, false];
            assert.deepEqual(sf.and(sf2).values, expected);
        });

        it("Return logical AND of series and other scalar", function () {
            const data1 = [true, true, true, false, false];
            const sf = new Series(data1);

            const expected = [true, true, true, false, false];
            assert.deepEqual(sf.and(true).values, expected);
        });

        it("Return logical AND of series and other array (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1);

            const expected = [true, false, true, false, false];
            assert.deepEqual(sf.and(data2).values, expected);
        });

        it("Chaining works for logical AND of series and other array (element-wise)", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const data3 = [true, false, false, true, false];

            const sf = new Series(data1);
            const expected = [true, false, false, false, false];
            assert.deepEqual(sf.and(data2).and(data3).values, expected);
        });

        it("Chaining works for logical AND and OR combined", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const data3 = [true, false, false, true, false];

            const sf = new Series(data1);
            const expected = [true, false, true, true, false];
            assert.deepEqual(sf.and(data2).or(data3).values, expected);
        });

        it("Correct index is returned after operation", function () {
            const data1 = [true, true, true, false, false];
            const data2 = [true, false, true, true, false];
            const sf = new Series(data1, { index: ["one", "two", "three", "four", "five"] });

            const expected = ["one", "two", "three", "four", "five"];
            assert.deepEqual(sf.and(data2).index, expected);
        });
    });
})
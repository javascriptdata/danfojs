import { assert, expect } from "chai";
import { Series } from "../../build";

describe("Series Functions", () => {

    describe("head", function () {
        it("Gets the first 2 rows in a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let cols = ["A"];
            let sf = new Series({ data, columnNames: cols });
            assert.deepEqual(sf.head(2).values, [1, 2]);
            assert.deepEqual(sf.head(5).values, [1, 2, 3, 4, 5]);
        });
        it("throw error when row specified is greater than values", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            let cols = ["Items"];
            let sf = new Series({ data, columnNames: cols });
            assert.throws(function () { assert.deepEqual(sf.head(10).values, data) }, Error, `row slice [end] index cannot be less than 5`);
        });

        it("throw error when row specified is less than 0", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series({ data });
            assert.throws(function () { assert.deepEqual(sf.head(-1).values, data) }, Error, `The number of values should be positive`);
        });
    });


    describe("tail", function () {
        it("Prints the last n rows of a Series", function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series({ data });
            assert.deepEqual(sf.tail(2).values, [89, 78]);
            assert.deepEqual(sf.tail(4).values, [40, 39, 89, 78]);

        });
        it("throw error when row specified is greater than values", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            let cols = ["Items"];
            let sf = new Series({ data, columnNames: cols });
            assert.throws(function () { assert.deepEqual(sf.tail(15).values, data) }, Error, `row slice [start] index cannot be less than 0`);
        });

        it("throw error when row specified is less than 0", function () {
            let data = ["Boy", "Girl", "Man", "Woman", "Tall"];
            let cols = ["Items"];
            let sf = new Series({ data, columnNames: cols });
            assert.throws(function () { assert.deepEqual(sf.tail(-1).values, data) }, Error, `The number of values should be positive`);
        });
    });

    describe("sample", function () {
        it("Samples n number of random elements from a DataFrame", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series({ data });
            assert.deepEqual((await sf.sample(7)).values.length, 7);
        });
        it("Return all values if n of sample -1", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series({ data });
            assert.deepEqual((await sf.sample(-1)).values.length, data.length);
        });

        it("Throw error if n is greater than lenght of Series", async function () {
            let data = [1, 2, 3, 4, 5, 620, 30, 40, 39, 89, 78];
            let sf = new Series({ data });
            try {
                await sf.sample(100);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.eql('Sample size n cannot be bigger than size of dataset');
            }
        });
    });

    describe("div", function () {
        it("Return float division of series with another series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [1, 2, 3, 4];
            let sf1 = new Series({ data: data1 });
            let sf2 = new Series({ data: data2 });
            assert.deepEqual(sf1.div(sf2).values, [30, 20, 1, 1.25]);
        });
        it("Return integer division of series with another series", function () {
            let data1 = [30, 40, 3, 5];
            let data2 = [1, 2, 3, 4];
            let sf1 = new Series({ data: data1 });
            let sf2 = new Series({ data: data2 });
            assert.deepEqual(sf1.div(sf2, false).values, [30, 20, 1, 1]);
        });
        it("Return division of series with a single value (Broadcasting)", function () {
            let data = [10, 2, 3, 90];
            let sf = new Series({ data });
            assert.deepEqual(sf.div(2).values, [5, 1, 1.5, 45]);
        });
        it("Throws type error on division of string type", function () {
            let data = [1, 2, 3, 4]
            let data2 = ["A", "B", "C", "d"]
            let sf = new Series({ data })
            let sf2 = new Series({ data: data2 })
            assert.throws(() => { sf.div(sf2) }, Error, `dtype Error: Cannot perform operation "div" on Series with dtype string`)
        })
        it("Throws length error if series lenght mixmatch", function () {
            let data = [1, 2, 3, 4]
            let data2 = [1, 2, 3, 4, 5, 6]
            let sf = new Series({ data })
            let sf2 = new Series({ data: data2 })
            assert.throws(() => { sf.div(sf2) }, Error, "Shape Error: Series shape do not match")
        })
    });
})
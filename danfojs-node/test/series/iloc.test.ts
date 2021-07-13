import { assert } from "chai";
import { Series } from "../../build";

describe("Series iloc", function () {

    it("throw error for wrong row index value", function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        /* @ts-ignore */
        assert.throws(function () { df.iloc(0) }, Error, `rows parameter must be an Array. For example: rows: [1,2] or rows: ["0:10"]`);
    });

    it("throw error for wrong string split parameter", function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        /* @ts-ignore */
        assert.throws(function () { df.iloc(["0;1"]); }, Error, `Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
    });

    it("throw error for wrong string split value", function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        /* @ts-ignore */
        assert.throws(function () { df.iloc(["0:a"]); }, Error, `Invalid row split parameter. Split parameter must be a number`);
    });

    it("throw error for string split values greater than 2", function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        /* @ts-ignore */
        assert.throws(function () { df.iloc(["0:4:2"]); }, Error, `Invalid row split parameter: If using row split string, it must be of the form; rows: ["start:end"]`);
    });

    it("throw error for row index larger than series length", function () {
        let data = [1, 2, 34, 5, 6];

        let df = new Series({ data });
        assert.throws(function () { df.iloc([0, 8]); }, Error, "Invalid row parameter: row index 8 cannot be bigger than Series length 5");
    });

    it("throw error for non-numeric row index", function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        assert.throws(function () { df.iloc([0, "4"]); }, Error, "Invalid row parameter: row index 4 must be a number");
    });


    it("df.iloc works for rows:[0,1]", function () {
        let data = [1, 2, 34, 5, 6];

        let df = new Series({ data });

        let sf = df.iloc([0, 1]);
        let expected = [1, 2];

        assert.deepEqual(sf.values, expected);
    });

    it("df.iloc works for rows:[1]", function () {
        let data = [1, 2, 34, 5, 6];

        let df = new Series({ data });

        let sf = df.iloc([1]);
        let expected = [2];

        assert.deepEqual(sf.values, expected);
    });

    it("correct index is returned for df.iloc rows:[1, 2]", function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data, index: ["a", "b", "c", "d", "e"] });

        let sf = df.iloc([1, 4]);
        let expected = ["b", "e"];

        assert.deepEqual(sf.index, expected);
    });


    it("row slice with string param works [0:2]", function () {
        let data = [1, 2, 4, 5, 6, 20, 30, 40, 39, 89, 78];
        let df = new Series({ data });

        let sf = df.iloc(["0:2"]);
        let expected = [1, 2];

        assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [1:]", function () {
        let data = [1, 2, 34, 5, 620, 30, 409, 89, 78];
        let df = new Series({ data });

        let sf = df.iloc(["1:"]);
        let expected = [2, 34, 5, 620, 30, 409, 89, 78];

        assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [:2]", function () {
        let data = [1, 2, 34, 5, 6, 20, 30, 40, 39, 89, 78];
        let df = new Series({ data });
        let sf = df.iloc([":2"]);
        let expected = [1, 2];

        assert.deepEqual(sf.values, expected);

    });
    it("row slice with string param works [:]", function () {
        let data = [1, 2, 3, 5, 20, 30, 4039, 89, 78];
        let df = new Series({ data });
        let expected = [1, 2, 3, 5, 20, 30, 4039, 89, 78];

        let sf = df.iloc([":"]);
        assert.deepEqual(sf.values, expected);

    });

    it(`throw error for wrong start index size ["0:20"]`, function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        /* @ts-ignore */
        assert.throws(function () { df.iloc(["0:20"]); }, Error, `row slice [end] index cannot be less than 5`);
    });

    it(`throw error for wrong start index size ["-1:2"]`, function () {
        let data = [1, 2, 34, 5, 6];
        let df = new Series({ data });
        /* @ts-ignore */
        assert.throws(function () { df.iloc(["-1:2"]); }, Error, `row slice [start] index cannot be less than 0`);
    });

    it("check data after column slice", function () {
        let data = [1, 2, 34, 5, 620, 30, 4039, 89, 78];
        let df = new Series({ data });

        let sf = df.iloc([0, 1, 6]);
        let expected = [1, 2, 4039];
        assert.deepEqual(sf.values, expected);

    });

});
import { assert } from "chai";
import { describe, it } from "mocha";
import { Series, OneHotEncoder, DataFrame } from "../../dist/danfojs-node/src";

describe("OneHotEncoder", function () {
    it("OneHotEncoder works on array", function () {
        const data = ["dog", "cat", "man", "dog", "cat", "man", "man", "cat"];
        const encode = new OneHotEncoder();
        encode.fit(data)

        const expected = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 0]
        ];
        assert.deepEqual(encode.transform(data), expected);
        assert.deepEqual(encode.transform(["man", "cat"]), [[0, 0, 1], [0, 1, 0]]);
    });
    it("OneHotEncoder works on Series", function () {
        const data = ["dog", "cat", "man", "dog", "cat", "man", "man", "cat"];
        const series = new Series(data);
        const encoder = new OneHotEncoder();
        encoder.fit(series);

        const expected = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 0]
        ];
        assert.deepEqual((encoder.transform(series) as DataFrame).values, expected);
    });

    it("fitTransform works on OneHotEncoder", function () {
        const data = ["dog", "cat", "man", "dog", "cat", "man", "man", "cat"];
        const series = new Series(data);
        const encoder = new OneHotEncoder();
        const result = encoder.fitTransform(series) as DataFrame

        const expected = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 0]
        ];
        assert.deepEqual(result.values, expected);
    });

    it("Correct index is returned after transformation", function () {
        const data = ["dog", "cat", "man", "dog", "cat", "man", "man", "cat"];
        const series = new Series(data, 
            { index: ["a", "b", "c", "d", "e", "f", "g", "h"],
        });
        const encoder = new OneHotEncoder();
        const result = encoder.fitTransform(series) as DataFrame

        const expected = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 0]
        ];
        assert.deepEqual(result.values, expected);
        assert.deepEqual(result.index, ["a", "b", "c", "d", "e", "f", "g", "h"]);
        assert.deepEqual(result.columns, ["0", "1", "2"]);
    });
});

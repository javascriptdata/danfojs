import { assert } from "chai";
import { DataFrame, Series, StandardScaler } from "../../build";


describe("StandardScaler", function () {

    it("StandardScaler works for DataFrame", function () {
        const data = [[0, 0], [0, 0], [1, 1], [1, 1]];

        const scaler = new StandardScaler();
        scaler.fit(new DataFrame(data))

        const expected = [[-1, -1], [-1, -1], [1, 1], [1, 1]];
        const resultDf = scaler.transform(new DataFrame(data));
        assert.deepEqual(resultDf.values, expected);
        assert.deepEqual(scaler.transform([[2, 2]]), [[3, 3]]);
    });
    it("StandardScaler works for Array", function () {
        const data = [[0, 0], [0, 0], [1, 1], [1, 1]];

        const scaler = new StandardScaler();
        scaler.fit(data)
        const expected = [[-1, -1], [-1, -1], [1, 1], [1, 1]];

        assert.deepEqual(scaler.transform(data), expected);
        assert.deepEqual(scaler.transform([[2, 2]]), [[3, 3]]);
    });

    it("StandardScaler works for Series", function () {
        const data = [0, 0, 0, 0, 1, 1, 1, 1]

        const scaler = new StandardScaler();
        scaler.fit(new Series(data))
        const expected = [-1, -1, -1, -1, 1, 1, 1, 1]

        assert.deepEqual(scaler.transform(new Series(data)).values, expected);
        assert.deepEqual(scaler.transform([2, 2]), [3, 3]);
    });
});

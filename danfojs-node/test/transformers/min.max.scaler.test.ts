import { assert } from "chai";
import { DataFrame, Series, MinMaxScaler } from "../../build";

describe("MinMaxscaler", function () {

    it("Standardize values in a DataFrame using a MinMaxScaler", function () {
        const data = [[-1, 2], [-0.5, 6], [0, 10], [1, 18]];
        const scaler = new MinMaxScaler();

        const expected = [[0, 0], [0.25, 0.25], [0.5, 0.5], [1, 1]];
        const transformedData = [[1.5, 0.]];

        scaler.fit(new DataFrame(data));
        const resultDf = scaler.transform(new DataFrame(data));
        assert.deepEqual(resultDf.values, expected);
        assert.deepEqual(scaler.transform([[2, 2]]), transformedData);
    });
    it("fitTransform using a MinMaxScaler", function () {
        const data = [[-1, 2], [-0.5, 6], [0, 10], [1, 18]];
        const scaler = new MinMaxScaler();
        const resultDf =  scaler.fitTransform(new DataFrame(data));
        
        const expected = [[0, 0], [0.25, 0.25], [0.5, 0.5], [1, 1]];
        assert.deepEqual(resultDf.values, expected);
    });
    it("InverseTransform with MinMaxScaler", function () {
        const scaler = new MinMaxScaler();
        scaler.fit([1, 2, 3, 4, 5])
        const resultTransform = scaler.transform([1, 2, 3, 4, 5])
        const resultInverse = scaler.inverseTransform([0, 0.25, 0.5, 0.75, 1])

        assert.deepEqual(resultTransform, [0, 0.25, 0.5, 0.75, 1]);
        assert.deepEqual([1, 2, 3, 4, 5], resultInverse);
    });
    it("Index and columns are kept after transformation", function () {
        const data = [[-1, 2], [-0.5, 6], [0, 10], [1, 18]];
        const df = new DataFrame(data, { index: [1, 2, 3, 4], columns: ["a", "b"] });

        const scaler = new MinMaxScaler();
        scaler.fit(df);
        const resultDf = scaler.transform(df);

        assert.deepEqual(resultDf.index, [1, 2, 3, 4]);
        assert.deepEqual(resultDf.columns, ["a", "b"]);
    });
    it("Standardize values in a Series using a MinMaxScaler", function () {
        const data = [-1, 2, -0.5, 60, 101, 18];
        const scaler = new MinMaxScaler();
        const result = [0, 0.029411764815449715, 0.0049019609577953815, 0.5980392098426819, 1, 0.18627451360225677];
        const transformedData = [0.029411764815449715, 0.029411764815449715];
        scaler.fit(new Series(data));
        assert.deepEqual(scaler.transform(new Series(data)).values, result);
        assert.deepEqual(scaler.transform([2, 2]), transformedData);
    });
});

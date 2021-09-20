import { assert } from "chai";
import fs from "fs";
import { DataFrame, readExcel, Series, toExcel } from "../build";

describe("readExcel", function () {
    this.timeout(10000);
    it("Read local excel file works", async function () {
        const filePath = "test/fixtures/sample.xlsx"
        let df: any = await readExcel(filePath, {});
        assert.deepEqual(df.columns, [
            'Year',
            'Stocks',
            'T.Bills',
            'T.Bonds',
        ]);
        assert.deepEqual(df.dtypes, [
            'int32', 'float32',
            'float32', 'float32',
        ]);
        assert.deepEqual(df.shape, [82, 4])
    });
    it("Read local excel file works for selected sheet", async function () {
        const filePath = "test/fixtures/sample.xlsx"
        let df: any = await readExcel(filePath, { sheet: 1 });
        assert.deepEqual(df.columns, []);
        assert.deepEqual(df.shape, [0, 0])
    });

    it("Read remote csv file works", async function () {
        const remoteFile = "https://github.com/opensource9ja/danfojs/raw/dev/danfojs-browser/tests/samples/SampleData.xlsx"
        let df: any = await readExcel(remoteFile, {});
        assert.deepEqual(df.columns, [
            'Year',
            'Stocks',
            'T.Bills',
            'T.Bonds',
        ]);
        assert.deepEqual(df.dtypes, [
            'int32', 'float32',
            'float32', 'float32',
        ]);
        assert.deepEqual(df.shape, [82, 4])
    });
});


describe("toExcel", function () {
    it("toExcel works", async function () {
        const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        const df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });

        toExcel(df, { fileName: "test/fixtures/test" })

        const savedfilePath = "test/fixtures/test.xlsx"
        const dfNew: any = await readExcel(savedfilePath, {});

        assert.equal(fs.existsSync("test/fixtures/testSeries.xlsx"), true)
        assert.deepEqual(dfNew.columns, [
            'a',
            'b',
            'c',
            'd',
        ]);
        assert.deepEqual(dfNew.dtypes, [
            'int32', 'int32',
            'int32', 'int32',
        ]);
        assert.deepEqual(dfNew.shape, [3, 4])
    });
    it("toExcel works for series", async function () {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const df: any = new Series(data);
        const fileName = "test/fixtures/testSeries.xlsx"
        toExcel(df, { fileName })
        assert.equal(fs.existsSync(fileName), true)
    });

})

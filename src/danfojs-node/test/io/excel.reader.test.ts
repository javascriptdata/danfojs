import fs from "fs";
import path from "path"
import { assert } from "chai";
import { DataFrame, readExcel, Series, toExcel } from "../../dist";

describe("readExcel", function () {
    this.timeout(100000);
    it("Read local excel file works", async function () {
        const filePath = path.join(process.cwd(), "test", "samples", "sample.xlsx");
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
        const filePath = path.join(process.cwd(), "test", "samples", "sample.xlsx");
        let df: any = await readExcel(filePath, { sheet: 1 });
        assert.deepEqual(df.columns, []);
        assert.deepEqual(df.shape, [0, 0])
    });

    it("Read remote excel file works", async function () {
        const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/SampleData.xlsx"
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
        const filePath = path.join(process.cwd(), "test", "samples", "sampleOut.xlsx");
        toExcel(df, { filePath })

        const dfNew: any = await readExcel(filePath, {});

        assert.equal(fs.existsSync(filePath), true)
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
        const filePath = path.join(process.cwd(), "test", "samples", "testSeries.xlsx");
        toExcel(df, { filePath })
        assert.equal(fs.existsSync(filePath), true)
    });

})

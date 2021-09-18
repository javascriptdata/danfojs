import { assert } from "chai";
import { readCSV, streamCSV } from "../build";

describe("readCSV", function () {
    this.timeout(10000);
    it("Read local csv file works", async function () {
        const filePath = "test/fixtures/titanic.csv"
        let df: any = await readCSV(filePath, { header: true, preview: 5 });
        assert.deepEqual(df.shape, [5, 8]);
        assert.deepEqual(df.columns, [
            'Survived',
            'Pclass',
            'Name',
            'Sex',
            'Age',
            'Siblings/Spouses Aboard',
            'Parents/Children Aboard',
            'Fare'
        ]);
        assert.deepEqual(df.dtypes, [
            'int32', 'int32',
            'string', 'string',
            'int32', 'int32',
            'int32', 'float32'
        ]);
    });

    it("Read remote csv file works", async function () {
        const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
        let df: any = await readCSV(remoteFile, { header: true, preview: 5 });
        assert.deepEqual(df.shape, [5, 8]);
        assert.deepEqual(df.columns, [
            'Survived',
            'Pclass',
            'Name',
            'Sex',
            'Age',
            'Siblings/Spouses Aboard',
            'Parents/Children Aboard',
            'Fare'
        ]);
        assert.deepEqual(df.dtypes, [
            'int32', 'int32',
            'string', 'string',
            'int32', 'int32',
            'int32', 'float32'
        ]);
    });

})

describe("streamCSV", function () {
    this.timeout(100000);
    it("Streaming local csv file with callback works", async function () {
        const filePath = "test/fixtures/titanic.csv"
        await streamCSV(filePath, { header: true, nRows: 100 }, (df: any) => {
            if (df) {
                assert.deepEqual(df.shape, [100, 8])
                assert.deepEqual(df.columns, [
                    'Survived',
                    'Pclass',
                    'Name',
                    'Sex',
                    'Age',
                    'Siblings/Spouses Aboard',
                    'Parents/Children Aboard',
                    'Fare'
                ]);
            } else {
                assert.deepEqual(df, null);
            }
        });

    });

    it("Streaming remote csv file with callback works", async function () {
        const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
        await streamCSV(remoteFile, { header: true, nRows: 100 }, (df: any) => {
            if (df) {
                assert.deepEqual(df.shape, [100, 8])
                assert.deepEqual(df.columns, [
                    'Survived',
                    'Pclass',
                    'Name',
                    'Sex',
                    'Age',
                    'Siblings/Spouses Aboard',
                    'Parents/Children Aboard',
                    'Fare'
                ]);
            } else {
                assert.deepEqual(df, null);
            }
        });

    });

})
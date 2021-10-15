import path from "path"
import { assert } from "chai";
import { DataFrame, readCSV, Series, streamCSV, toCSV } from "../../dist";

describe("readCSV", function () {
    this.timeout(10000);
    it("Read local csv file works", async function () {
        const filePath = path.join(process.cwd(), "test", "samples", "titanic.csv");
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

    // it("Read remote csv file works", async function () {
    //     const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
    //     let df: any = await readCSV(remoteFile, { header: true, preview: 5 });
    //     assert.deepEqual(df.shape, [5, 8]);
    //     assert.deepEqual(df.columns, [
    //         'Survived',
    //         'Pclass',
    //         'Name',
    //         'Sex',
    //         'Age',
    //         'Siblings/Spouses Aboard',
    //         'Parents/Children Aboard',
    //         'Fare'
    //     ]);
    //     assert.deepEqual(df.dtypes, [
    //         'int32', 'int32',
    //         'string', 'string',
    //         'int32', 'int32',
    //         'int32', 'float32'
    //     ]);
    // });

})

describe("streamCSV", function () {
    this.timeout(100000);
    it("Streaming local csv file with callback works", async function () {
        const filePath = path.join(process.cwd(), "test", "samples", "titanic.csv");
        await streamCSV(filePath, (df: any) => {
            if (df) {
                assert.deepEqual(df.shape, [1, 8])
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
        }, { header: true });

    });

    // it("Streaming remote csv file with callback works", async function () {
    //     const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
    //     await streamCSV(remoteFile, { header: true }, (df: any) => {
    //         if (df) {
    //             assert.deepEqual(df.shape, [1, 8])
    //             assert.deepEqual(df.columns, [
    //                 'Survived',
    //                 'Pclass',
    //                 'Name',
    //                 'Sex',
    //                 'Age',
    //                 'Siblings/Spouses Aboard',
    //                 'Parents/Children Aboard',
    //                 'Fare'
    //             ]);
    //         } else {
    //             assert.deepEqual(df, null);
    //         }
    //     });

    // });

})


describe("toCSV", function () {
    it("toCSV works", async function () {
        const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        let df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
        assert.deepEqual(toCSV(df, {}), `a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
    });
    it("toCSV works for specified seperator", async function () {
        const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        let df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
        assert.deepEqual(toCSV(df, { sep: "+" }), `a+b+c+d\n1+2+3+4\n5+6+7+8\n9+10+11+12\n`);
    });
    it("toCSV write to local file works", async function () {
        const data = [[1, 2, 3, "4"], [5, 6, 7, "8"], [9, 10, 11, "12"]]
        let df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
        const filePath = path.join(process.cwd(), "test", "samples", "test_write.csv");
        toCSV(df, { sep: ",", filePath });
    });
    it("toCSV works for series", async function () {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        let df: any = new Series(data);
        assert.deepEqual(toCSV(df, { sep: "+" }), `1+2+3+4+5+6+7+8+9+10+11+12`);
    });

})
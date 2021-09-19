import { assert } from "chai";
import { DataFrame, Series, readJSON } from "../build";

describe("readJSON", function () {
    this.timeout(10000);
    it("Read local json file works", async function () {
        const filePath = "test/fixtures/book.json"
        let df: any = await readJSON(filePath, {});
        assert.deepEqual(df.columns, [
            'book_id',
            'title',
            'image_url',
            'authors',
        ]);
        assert.deepEqual(df.dtypes, [
            'int32', 'string',
            'string', 'string',
        ]);
    });

    it("Read remote csv file works", async function () {
        const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/book.json"
        let df: any = await readJSON(remoteFile, {});
        assert.deepEqual(df.columns, [
            'book_id',
            'title',
            'image_url',
            'authors',
        ]);
        assert.deepEqual(df.dtypes, [
            'int32', 'string',
            'string', 'string',
        ]);
    });


    // describe("streamCSV", function () {
    //     this.timeout(100000);
    //     it("Streaming local csv file with callback works", async function () {
    //         const filePath = "test/fixtures/titanic.csv"
    //         await streamCSV(filePath, { header: true }, (df: any) => {
    //             if (df) {
    //                 assert.deepEqual(df.shape, [1, 8])
    //                 assert.deepEqual(df.columns, [
    //                     'Survived',
    //                     'Pclass',
    //                     'Name',
    //                     'Sex',
    //                     'Age',
    //                     'Siblings/Spouses Aboard',
    //                     'Parents/Children Aboard',
    //                     'Fare'
    //                 ]);
    //             } else {
    //                 assert.deepEqual(df, null);
    //             }
    //         });

    //     });

    //     it("Streaming remote csv file with callback works", async function () {
    //         const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
    //         await streamCSV(remoteFile, { header: true }, (df: any) => {
    //             if (df) {
    //                 assert.deepEqual(df.shape, [1, 8])
    //                 assert.deepEqual(df.columns, [
    //                     'Survived',
    //                     'Pclass',
    //                     'Name',
    //                     'Sex',
    //                     'Age',
    //                     'Siblings/Spouses Aboard',
    //                     'Parents/Children Aboard',
    //                     'Fare'
    //                 ]);
    //             } else {
    //                 assert.deepEqual(df, null);
    //             }
    //         });

    //     });

    // })


    // describe("toCSV", function () {
    //     it("toCSV works", async function () {
    //         const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
    //         let df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    //         assert.deepEqual(toCSV(df, {}), `a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
    //     });
    //     it("toCSV works for specified seperator", async function () {
    //         const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
    //         let df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    //         assert.deepEqual(toCSV(df, { sep: "+" }), `a+b+c+d\n1+2+3+4\n5+6+7+8\n9+10+11+12\n`);
    //     });
    //     it("toCSV works for series", async function () {
    //         const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    //         let df: any = new Series(data);
    //         assert.deepEqual(toCSV(df, { sep: "+" }), `1+2+3+4+5+6+7+8+9+10+11+12`);
    //     });

})
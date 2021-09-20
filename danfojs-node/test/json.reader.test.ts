import { assert } from "chai";
import fs from "fs";
import { DataFrame, Series, readJSON, toJSON, streamJSON } from "../build";

describe("readJSON", function () {
    this.timeout(10000);
    it("Read local json file works", async function () {
        const filePath = "test/fixtures/book.json"
        const df: any = await readJSON(filePath, {});
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
        const df: any = await readJSON(remoteFile, {});
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
});


describe("streamJSON", function () {
    this.timeout(100000);
    it("Streaming local csv file with callback works", async function () {
        const filePath = "test/fixtures/book_small.json"
        await streamJSON(filePath, {}, (df: any) => {
            if (df) {
                df.print();
                assert.deepEqual(df.shape, [1, 4])
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
            } else {
                assert.deepEqual(df, null);
            }
        });

    });

    // it("Streaming remote csv file with callback works", async function () {
    //     const remoteFile = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/book.json"
    //     await streamJSON(remoteFile, { header: true }, (df: any) => {
    //         if (df) {
    //             df.print();
    //             assert.deepEqual(df.shape, [1, 4])
    //             assert.deepEqual(df.columns, [
    //                 'book_id',
    //                 'title',
    //                 'image_url',
    //                 'authors',
    //             ]);
    //         } else {
    //             assert.deepEqual(df, null);
    //         }
    //     });

    // });

})


describe("toJSON", function () {
    it("toJSON works", async function () {
        const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        const df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
        const expected: any = [
            { "a": 1, "b": 2, "c": 3, "d": 4 },
            { "a": 5, "b": 6, "c": 7, "d": 8 },
            { "a": 9, "b": 10, "c": 11, "d": 12 },
        ]
        const json = toJSON(df, {})
        assert.deepEqual(json, expected);
    });
    it("toJSON works for row format", async function () {
        const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        const df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
        const expected: any = {
            "a": [1, 5, 9],
            "b": [2, 6, 10],
            "c": [3, 7, 11],
            "d": [4, 8, 12],
        }
        const json = toJSON(df, { format: "row" })
        assert.deepEqual(json, expected);
    });
    it("toJSON writes file to local path", async function () {
        const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        const df: any = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
        toJSON(df, { format: "row", filePath: "test/fixtures/test_row_write.json" })
        toJSON(df, { format: "column", filePath: "test/fixtures/test_col_write.json" })
        assert.equal(fs.existsSync("test/fixtures/test_row_write.json"), true);
        assert.equal(fs.existsSync("test/fixtures/test_col_write.json"), true);
    });
    it("toJSON works for series", async function () {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const df: any = new Series(data);
        assert.deepEqual(toJSON(df, {}), { "0": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });
    });

})

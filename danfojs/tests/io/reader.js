import { assert } from "chai";
import { read_csv, read_json } from '../../src/io/reader';


// describe("read_csv", async function () {

//     it("reads a csv file from source over the internet", async function () {
//         const csvUrl =
//             'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

//         const df = await read_csv(csvUrl, {}, 10)
//         const num_of_columns = (df.column_names).length
//         assert.equal(num_of_columns, 13)
//     })

//     it("reads a csv file from source from local disk", async function () {
//         const csvUrl =
//             'file:///home/dsn/personal/opensource/danfojs/danfojs/data/all_brand_df.csv';

//         read_csv(csvUrl).then((df) => {
//             const num_of_columns = (df.column_names).length
//             console.log(df.head() + "")
//             assert.equal(num_of_columns, 12)
//         })

//     })
// })

// describe("read_json", async function () {
//     it("reads a json file from local file path", async function () {
//         const json_path = '/Users/mac/Documents/Opensource/web_book_data.json'

//         read_json(json_path).then((df) => {
//             const columns = df.column_names
//             assert.deepEqual(columns, ["book_id", "title", "image_url", "authors"])
//             assert.equal(df.shape[1], 4)
//         }).catch((err) => {
//             console.log(err);
//         })
//     })

    // it("reads a json file over the internet", async function () {
    //     const jsonUrl =
    //         'https://raw.githubusercontent.com/risenW/Tensorflowjs_Projects/master/recommender-sys/Python-Model/web_book_data.json';

    //     read_json(jsonUrl).then((df) => {
    //         const columns = df.column_names
    //         assert.deepEqual(columns, ["book_id", "title", "image_url", "authors"])
    //         assert.equal(df.shape[1], 4)
    //     }).catch((err) => {
    //         console.log(err);
    //     })

    // })
// })



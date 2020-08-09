// import { assert } from "chai";
// import { read_csv } from '../../src/io/reader';


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


import { assert } from "chai";
import { read_csv, read_json, read_excel } from '../../src/io/reader';


describe("read_csv", async function () {

    it("reads a csv file from source over the internet", async function () {
        const csvUrl =
            'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

        read_csv(csvUrl).then((df) => {
            const num_of_columns = (df.column_names).length
            assert.equal(num_of_columns, 13)
        })
        // const df = await read_csv(csvUrl)
        // const num_of_columns = (df.column_names).length
        // assert.equal(num_of_columns, 13)
    })

    it("reads a csv file from source from local disk", async function () {
        const csvUrl = 'danfojs/tests/samples/titanic.csv';

        read_csv(csvUrl).then((df) => {
            const num_of_columns = (df.column_names).length
            assert.equal(num_of_columns, 8)
        })

    })
})



describe("read_json", async function () {

    it("reads a json file from source over the internet", async function () {
        const jUrl =
            'https://raw.githubusercontent.com/risenW/Tensorflowjs_Projects/master/recommender-sys/Python-Model/web_book_data.json';

        read_json(jUrl).then((df) => {
            const num_of_columns = df.columns.length
            assert.equal(num_of_columns, 4)
        })
    })

    // it("reads a json file from source from local disk", async function () {
    //     const jUrl = 'danfojs/tests/samples/book.json';

    //     read_json(jUrl).then((df) => {
    //         const num_of_columns = (df.column_names).length
    //         assert.equal(num_of_columns, 4)
    //     })

    // })
})

describe("read_excel", async function () {

    it("reads an excel file from source over the internet", async function () {
        const remote_url = 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_100.xls';
        read_excel({ source: remote_url }).then(df => {
            assert(df.columns.length, 8);
        })
    })

    it("reads an excel file from source from local disk", async function () {
        const file_url = 'danfojs/tests/samples/SampleData.xlsx';
        read_excel({ source: file_url, header_index: 7, data_index: 8 }).then(df => {
            assert(df.columns.length, 4);
        })
    })
})

import { assert } from "chai";
import { read_csv } from '../../src/io/reader';


describe("read_csv", async function () {

    it("reads a csv file from source over the internet", async function () {
        const csvUrl =
            'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

        const df = await read_csv(csvUrl)
        const num_of_columns = (df.column_names).length
        assert.equal(num_of_columns, 13)
    })
})


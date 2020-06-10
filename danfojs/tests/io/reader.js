import * as tf from '@tensorflow/tfjs-node';
import { assert } from "chai";
import { read_csv } from '../../src/io/reader';


describe("read_csv", async function () {

    it("reads a csv file from source", async function () {
        const csvUrl =
            'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';
        const tf_csv_dataset = tf.data.csv(csvUrl)
        const csv_dataset = read_csv(csvUrl)
        const tf_num_of_columns = (await tf_csv_dataset.columnNames()).length
        const num_of_columns = (await csv_dataset.columnNames()).length
        assert.equal(tf_num_of_columns, num_of_columns)
    })
})


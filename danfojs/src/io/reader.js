import { DataFrame } from '../core/frame'
import * as tf from '@tensorflow/tfjs-node'
import fetch from "node-fetch"
import fs from 'fs'


// import * as tf from '@tensorflow/tfjs'



/**
 * Reads a CSV file from local or remote storage
 * 
 * @param {source} URL or local file path to retreive CSV file. If it's a local path, it
 * must have prefix `file://` and it only works in node environment.
 * @param {config} (Optional). A CSV Config object that contains configurations
 *     for reading and decoding from CSV file(s).
 * 
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_csv = async (source, config = {}) => {
    let data = []
    const csvDataset = tf.data.csv(source, config);
    const column_names = await csvDataset.columnNames()
    await csvDataset.forEachAsync(row => data.push(Object.values(row)));
    return new DataFrame(data, { columns: column_names })
}


/**
 * Reads a JSON file from local or remote address
 * 
 * @param {source} URL or local file path to retreive JSON file.
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_json = async (source) => {
    if (source.startsWith("http")) {
        //reading from the internet
        fetch(source, { method: "Get" })
            .then(res => res.json())
            .then((json) => {
                let df = new DataFrame(json)
                return df
            }).catch((err) => {
                throw Error(err)
            })
    } else {
        //reading from local path
        fs.readFile(source, (err, fileData) => {
            if (err) {
                throw Error(err)
            }
            try {
                const object = JSON.parse(fileData)
                let df = new DataFrame(object)
                return df
            } catch (err) {
                throw Error(err)
            }
        })


    }

}


// /**
//  * Reads a Excel file from local or remote address
//  * 
//  * @param {source} URL or local file path to retreive JSON file.
//  * @returns {Promise} DataFrame structure of parsed CSV data
//  */
// export const read_excel = async (source) => {

//     xlsxFile('./Data.xlsx').then((rows) => {
//         console.log(rows);
//         console.table(rows);
//        })
// }



// /**
//  * Reads a SQL Database into DataFrame
//  * 
//  * @param {source} URL or local file path to retreive JSON file.
//  * @returns {Promise} DataFrame structure of parsed CSV data
//  */
// export const read_sql = async (source) => {

//     return "TODO"
// }
import { DataFrame } from '../core/frame'
import * as tf from '@tensorflow/tfjs-node'
// import * as tf from '@tensorflow/tfjs'
import { Utils } from '../core/utils'

//used in reading JSON file in nodejs env
import fs from 'fs'
import fetch from 'node-fetch'

const utils = new Utils()



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
export const read_csv = async (source, chunk) => {
    let data = []
    const csvDataset = tf.data.csv(source)
    const column_names = await csvDataset.columnNames()
    const sample = await csvDataset.take(chunk)
    await sample.forEachAsync(row => data.push(Object.values(row)))
    let df = new DataFrame(data, { columns: column_names })
    return df
}


/**
 * Reads a JSON file from local or remote address
 * 
 * @param {source} URL or local file path to retreive JSON file.
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_json = async (source) => {
    if (utils.__is_node_env()) {
        // inside Node Env
        if (source.startsWith("https://")) {
            //read from URL
            let res = await fetch(source, { method: "Get" })
            let json = await res.json()
            let df = new DataFrame(json)
            return df

        } else {
            //read locally
            fs.readFile(source, (err, data) => {
                if (err) throw err;
                let df = new DataFrame(JSON.parse(data))
                return df

            })
        }
    } else {
        
        let res = await fetch(source, { method: "Get" })
        let json = await res.json()
        let df = new DataFrame(json)
        return df
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
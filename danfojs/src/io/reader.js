import { DataFrame } from '../core/frame'
import * as tf from '@tensorflow/tfjs-node'
// import * as tf from '@tensorflow/tfjs'
import { Utils } from '../core/utils'

//used in reading JSON file in nodejs env
import fs from 'fs'
import fetch from 'node-fetch'

import XLSX from 'xlsx';
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


/**
 * Reads an Excel file from local or remote address
 *
 * @param {source} URL or local file path to retreive Excel file.
 * @param {sheetName} (Optional) Name of the sheet which u want to parse. Default will be the first sheet.
 * @description Assume following format: First non empty row represents column and next rows represents data until the next empty row.
 * @returns {Promise} DataFrame structure of parsed Excel data
*/
export const read_excel = async (source, sheetName) => {
    var isAUrl = source.match(/(http(s?)):\/\//g);
    var workbook;
    try {
        if (utils.__is_node_env()) {
            // inside Node Env
            if (isAUrl) {
                let res = await fetch(source, { method: "Get" })
                res = await res.arrayBuffer();
                res = new Uint8Array(res);
                workbook = XLSX.read(res, {type:"array"});
            }
        }
        if(!isAUrl) {
            workbook = XLSX.readFile(source);
        }
        // convert from workbook to array of arrays
        const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

        //sheet_to_json returns array of arrays
        var data = XLSX.utils.sheet_to_json(worksheet, {header:1});
        const columnNames = data[0];
        data = [].concat(data.slice(1));
        let df = new DataFrame(data, {columns : columnNames});
        return df;
    } catch (err) {
        console.error(err);
    }
}

// /**
//  * Reads a SQL Database into DataFrame
//  * 
//  * @param {source} URL or local file path to retreive JSON file.
//  * @returns {Promise} DataFrame structure of parsed CSV data
//  */
// export const read_sql = async (source) => {

//     return "TODO"
// }
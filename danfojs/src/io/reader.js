import { DataFrame } from '../core/frame'
// import * as tf from '@tensorflow/tfjs-node'
import * as tf from '@tensorflow/tfjs'
import { Utils } from '../core/utils'
import fetch from 'node-fetch'
import XLSX from 'xlsx';
import { open, Dataset, isDataset } from 'data.js'
import toArray from 'stream-to-array'

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
    if (!(utils.__is_browser_env() || source.startsWith("file://") || source.startsWith("http"))) {
        //probabily a relative path, append file:// to it
        source = `file://${process.cwd()}/${source}`
    }

    let data = []
    const csvDataset = tf.data.csv(source)
    const column_names = await csvDataset.columnNames()
    const sample = csvDataset.take(chunk)
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
        if (source.startsWith("https://") || source.startsWith("http://") || source.startsWith("file://")) {
            //read from URL
            let res = await fetch(source, { method: "Get" })
            let json = await res.json()
            let df = new DataFrame(json)
            return df

        } else {
            //Try reading file from local env
            let fs = await import('fs')
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
 *  * @param {kwargs} kwargs --> {
 *                        source       : string, URL or local file path to retreive Excel file.
 *                        sheet_name   : string, (Optional) Name of the sheet which u want to parse. Default will be the first sheet.
 *                        header_index : int, (Optional) Index of the row which represents the header(columns) of the data. Default will be the first non empty row.
 *                        data_index   : int, (Optional)Index of the row from which actual data(content) starts. Default will be the next row of `header_index`
 *                    }
 * @returns {Promise} DataFrame structure of parsed Excel data
*/
export const read_excel = async (kwargs) => {
    var { source, sheet_name, header_index, data_index } = kwargs;
    var is_a_url = source.match(/(http(s?)):\/\//g);
    var workbook;
    if (!header_index) {
        //default header_index
        header_index = 1;
    }
    if (!data_index) {
        //default data_index
        data_index = header_index + 1;
    }
    try {
        if (utils.__is_node_env()) {
            // inside Node Env
            if (is_a_url) {
                let res = await fetch(source, { method: "Get" })
                res = await res.arrayBuffer();
                res = new Uint8Array(res);
                workbook = XLSX.read(res, { type: "array" });
            } else {
                workbook = XLSX.readFile(source);
            }
        } else {
            let res = await fetch(source, { method: "Get" })
            res = await res.arrayBuffer();
            res = new Uint8Array(res);
            workbook = XLSX.read(res, { type: "array" });
        }

        // Parse worksheet from workbook
        const worksheet = workbook.Sheets[sheet_name || workbook.SheetNames[0]];
        var range = XLSX.utils.decode_range(worksheet['!ref']);
        var column_names = [], data = [];
        for (var R = header_index - 1; R <= range.e.r; ++R) {
            var row_data = [];
            for (var C = range.s.c; C <= range.e.c; ++C) {
                var cell_ref;

                //Populate column_names
                if (R == header_index - 1) {
                    cell_ref = XLSX.utils.encode_cell({ c: C, r: header_index - 1 });
                    if (worksheet[cell_ref]) {
                        column_names.push(worksheet[cell_ref].v);
                    }
                }

                //Populate corresponding data row
                if (R >= data_index - 1) {
                    cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
                    if (worksheet[cell_ref]) {
                        row_data.push(worksheet[cell_ref].v);
                    }
                }
            }
            if (R >= data_index - 1) {
                data.push(row_data);
            }
        }
        let df = new DataFrame(data, { columns: column_names });
        return df;
    } catch (err) {
        throw new Error(err)
    }
}


/**
 * Opens a file using Data.js specification. 
 * @param {string} pathOrDescriptor A path to the file/resources. It can be a local file,
 * a URL to a tabular data (CSV, EXCEL) or Datahub.io Data Resource. 
 * Data comes with extra properties and specification conforming to the Frictionless Data standards.
 * @param {object} configs { data_num (Defaults => 0): The specific dataset to load, when reading data from a datapackage.json, 
 *                          header (Defaults => true): Whether the dataset contains header or not.
 *                          }
 * @returns {DataFrame} Danfo DataFrame/Series
 */
export const read = async (path_or_descriptor, configs = { data_num: 0, header: true }) => {
    let data_num = configs['data_num']
    let header = configs['header']
    let rows, file;

    if (isDataset(path_or_descriptor)) {
        console.log("datapackage.json found. Loading Dataset package from Datahub.io");
        const dataset = await Dataset.load(path_or_descriptor)
        file = dataset.resources[data_num]
        //TODO: toArray does not work in browser env, so this feature breaks when build for the web.
        // To fix this, we need a function to convert stream into text
        rows = await toArray(await file.rows()) 
    } else {
        try {
            file = open(path_or_descriptor)
            rows = await toArray(await file.rows())
            
        } catch (error) {
            console.log(error);
        }
    }

    if (['csv', 'xls', 'xlsx'].includes(await file.descriptor.format)) {
        if (header){
            let df = new DataFrame(rows.slice(1), { columns: rows[0] })
            return df
        }else{
            let df = new DataFrame(rows)
            return df
        }
    }else{
        let df = new DataFrame(rows)
        return df
    }

}




// /**
//  * Reads a Database into DataFrame
//  * 
//  * @param {source} URL or local file path to retreive JSON file.
//  * @returns {Promise} DataFrame structure of parsed CSV data
//  */
// export const read_sql = async (source) => {

//     return "TODO"
// }
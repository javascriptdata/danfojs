import {DataFrame} from '../core/frame'
import * as tf from '@tensorflow/tfjs-node'
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
export const read_csv = async (source, config={})=>{
    let data = []
    const csvDataset = tf.data.csv(source, config);
    const column_names = await csvDataset.columnNames()
    await csvDataset.forEachAsync(row => data.push(Object.values(row)));
    return new DataFrame(data,{columns: column_names})
}

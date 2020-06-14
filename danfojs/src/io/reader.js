/**
 * Reads data file from different format and convert to DataFrame object
 */
// import {DataFrame} from '../core/frame'
import * as tf from '@tensorflow/tfjs-node'

/**
 * Reads a CSV file from local or remote storage
 * 
 * @param source URL or local file path to retreive CSV file. If it's a local path, it
 * must have prefix `file://` and it only works in node environment.
 * @param config (Optional). A CSV Config object that contains configurations
 *     for reading and decoding from CSV file(s).
 */
export const read_csv = (source, config={})=>{
    const csvFile = tf.data.csv(source, config)
    return csvFile
}

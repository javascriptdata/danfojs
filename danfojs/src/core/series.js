import Ndframe from "./generic"
import * as tf from '@tensorflow/tfjs-node'
import { Utils } from "./utils"
const utils = new Utils
// const config = new Configs()



/**
 * One-dimensional ndarray with axis labels (including time series).
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values– they need not be the same length. 
 * @param {data} data Array, JSON of 1D values
 * @param {kwargs} Object {columns: column names, dtypes : data type of values}
 * 
 * @returns DataFrame data structure
 */
export class Series {
    constructor(data, kwargs){ 
        super(data, kwargs)
    }
   
}
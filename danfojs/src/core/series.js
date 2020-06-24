import * as tf from '@tensorflow/tfjs-node'
import { Utils } from "./utils"
import NDframe from "./generic"
const utils = new Utils
// const config = new Configs()



/**
 * One-dimensional ndarray with axis labels (including time series).
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values– they need not be the same length. 
 * @param {data} data Array, JSON of 1D values
 * @param {kwargs} Object {columns: column names, dtypes : data type of values}
 * 
 * @returns Series data structure
 */
export class Series extends NDframe {
    constructor(data, kwargs) {
        super(data, kwargs)
    }

    /**
    * Prints the first n values in a Series
    * @param {rows}  
    */
    head(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            //Creates a new Series with first [rows]
            let config = { columns: this.column_names }
            let data = this.values.slice(0, rows)
            return new Series(data, config)
        }

    }


    /**
    * Prints the last n values in a Series
    * @param {rows}  
    */
    tail(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            //Creates a new Series with last [rows]
            let config = { columns: this.column_names }
            let data = this.values.slice(this.values.length - rows)
            return new Series(data, config)
        }

    }

    /**
    * Gets [num] number of random rows in a Series
    * @param {rows}  
    */
    sample(num = 1) {
        if (num > this.values.length || num < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new Series(this.values, config)
        } else {
            //Creates a new dataframe with last [rows]
            let config = { columns: this.column_names }
            let sampled_arr = utils.__sample_from_iter(this.values, num)
            return new Series(sampled_arr, config)

        }
    }

    /**
    * Return Addition of series and other, element-wise (binary operator add).
    * Equivalent to series + other
    * @param {rows}  
    */
    add(other) {
        if (utils.__is_number(other)) {
            //broadcast addition
            let dtype = this.dtypes[0]
            let tensor1 = tf.tensor(this.values).asType(dtype)
            let sum = tensor1.add(other).arraySync()
            return new Series(sum, { columns: this.column_names, dtypes: dtype })
        } else {
            if (this.__check_series_op_compactibility) {
                let dtype = this.dtypes[0]
                let tensor1 = tf.tensor(this.values).asType(dtype)
                let tensor2 = tf.tensor(other.values).asType(dtype)
                let sum = tensor1.add(tensor2).arraySync()
                return new Series(sum, { columns: this.column_names, dtypes: dtype })
            }
        }
    }

    //check two series is compatible for an mathematical operation
    __check_series_op_compactibility(other) {
        if (utils.__is_undefined(other.series)) {
            throw Error("param [other] must be a Series or a single value that can be broadcasted")
        }
        if (other.values.length != this.values.length) {
            throw Error("Length Error: Cannot add Series with different lenghts")
        }
        if (this.dtypes[0] != 'float' || this.dtypes[0] != 'int') {
            throw Error(`dtype Error: Cannot add ${this.dtypes[0]} type to ${other.dtypes[0]}`)
        }
        if (other.dtypes[0] != 'float' || other.dtypes[0] != 'int') {
            throw Error(`dtype Error: Cannot add ${other.dtypes[0]} type to ${this.dtypes[0]}`)
        }

        return true
    }



}
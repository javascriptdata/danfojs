import * as tf from '@tensorflow/tfjs-node'
import { Utils } from './utils'
const utils = new Utils()

export default class NDframe {
    /**
     * N-Dimensiona data structure. Stores multi-dimensional 
     * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame. 
     * 
     * @param data JSON, Array, Tensor. Block of data.
     * @param kwargs Object,(Optional Configuration Object)
     *                 columns: Array of column names. If not specified and data is an array of array, use range index.
     *      
     * @returns NDframe
     */

    constructor(data, kwargs = {}) {
        this.kwargs = kwargs
        if (utils.isObject(data[0])) { //check the type of the first object in the data
            this.__read_object(data)
        } else if (Array.isArray(data[0]) || utils.isNumber(data[0]) || utils.isString(data[0])) {
            this.__read_array(data)
        } else {
            throw "File format not supported for now"
        }
    }



    __read_array(data) {
        this.data = tf.tensor(data)
        if (this.ndim == 1) {
            //series array
            if (this.kwargs['columns'] == undefined) {
                this.columns = "0"
            } else {
                this.columns = this.kwargs['columns']
            }

        } else {
            //2D or more array
            //check if columns lenght matches the shape of the data
            if (this.kwargs['columns'] == undefined) {
                //asign integer numbers
                this.columns = [...Array(this.data.shape[0]).keys()]
            } else {
                if (this.kwargs['columns'].length == this.data.shape[1]) {
                    this.columns = this.kwargs['columns']
                } else {
                    throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has lenght of ${this.data.shape[1]}`
                }
            }

        }
    }


    //Reads a Javascript Object of arrays of data points
    __read_object(data) {
        let data_arr = []
        data.forEach((item) => {
            data_arr.push(Object.values(item))

        });
        this.data = tf.tensor(data_arr)
        this.kwargs['columns'] = Object.keys(Object.values(data)[0]) //get names of the column from the first entry

        if (this.ndim == 1) {
            //series array
            if (this.kwargs['columns'] == undefined) {
                this.columns = "0"
            } else {
                this.columns = this.kwargs['columns']
            }

        } else {
            //2D or more array
            //check if columns lenght matches the shape of the data
            if (this.kwargs['columns'] == undefined) {
                //asign integer numbers
                this.columns = [...Array(this.data.shape[0]).keys()] //use 0 because we are testing lenght from an Object
            } else {
                if (this.kwargs['columns'].length == this.data.shape[1]) {
                    this.columns = this.kwargs['columns']
                } else {
                    throw `Column lenght mismatch. You provided a column of lenght ${this.kwargs['columns'].length} but data has column length of ${this.data.shape[1]}`
                }
            }

        }
    }



    /**
     * Return dimension of the tensor object
     * @returns Integer
     */
    get ndim() {
        return this.data.shape.length
    }



    /**
    * returns an object of index and columns
    * @return object
    */
    get axes() {
        let axes = {
            "index": [...Array(this.data.shape[0]).keys()],
            "columns": this.columns
        }
        return axes
    }



    /**
     * Return a sequence of axis dimension along row and columns
     * @returns Array list
     */
    get shape() {
        if (this.ndim == 1) {
            return 1
        } else {
            return this.data.shape
        }
    }



    /**
     * Return a values in the data as arrays
     * @returns Array
     */
    get values() {
        return this.data.arraySync()
    }



    /**
     * Return the column names of the data
     * @returns Array of strings
     */
    get column_names() {
        return this.columns
    }


    /**
     * Return binary size of the data
     * @returns String
     */
    get size() {
        return this.data.size
    }


}
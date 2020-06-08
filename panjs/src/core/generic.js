// import * as tf from '@tensorflow/tfjs'



/**
 * N-Dimensiona data structure. Stores multi-dimensional 
 * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame. 
 * 
 * @param data JSON, Array, Tensor. Block of data.
 * @param values ND-Array of values in the data. Specify if data is an array of arrays.
 * @param columns (Optional) Array of column names. If not specified and data is an array of array, use range index.
 * @param axes Array of data labels for both rows and columns.
 * @param name String (Optional). Name of the data object.
 * 
 * @returns NDframe
 */
export default class  NDframe {
    constructor(data, values = null, columns = null, axes = null, name = '') {
        this.data = data;
        this.values = values
        this.columns = columns
        this.axes = axes
        this.name = name
    }

    /**
         * Return a sequence of axis dimension along row and columns
         * @returns Array list
         */
    get shape() {
        return null
    }


    /**
         * Return a values in the data in tensor format
         * @returns Tensor Arrays
         */
    get values() {
        return null
    }


    /**
     * Sets the value of the data
     * @param values Array, Object to assign to the data
     */
    set values(values) {

    }


    /**
         * Return binary size of the data
         * @returns String
         */
    get size() {
        return null
    }


}
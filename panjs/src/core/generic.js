import * as tf from '@tensorflow/tfjs'


export default class NDframe {
    /**
     * N-Dimensiona data structure. Stores multi-dimensional 
     * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame. 
     * 
     * @param data JSON, Array, Tensor. Block of data.
     * @param columns (Optional) Array of column names. If not specified and data is an array of array, use range index.
     * @param axes Array of data labels for both rows and columns.
     * @param name String (Optional). Name of the data object.
     * 
     * @returns NDframe
     */

    constructor(data, columns, name) {
        this.name = name
        if (Array.isArray(data)) {
            this.data = tf.tensor(data)

            if (this.ndim == 1) {
                //series array
                if (columns == undefined) {
                    this.columns = "0"
                } else {
                    this.columns = columns
                }

                this.axes = {
                    "index": [...Array(this.data.arraySync().length).keys()],
                    "columns": this.columns
                }

            } else {
                //2D or more array
                //check if columns lenght matches the shape of the data
                if (columns == undefined) {
                    //asign integer numbers
                    this.columns = [...Array(this.data.shape[1]).keys()]
                } else {
                    if (columns.length == this.data.shape[1]) {
                        this.columns = columns
                    } else {
                        throw `Column lenght mismatch. You provided a column of lenght ${this.columns.length} but data has lenght of ${this.data.shape}`
                    }
                }

                this.axes = {
                    "index": [...Array(this.data.shape[0]).keys()],
                    "columns": this.columns
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
    get column_names(){
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
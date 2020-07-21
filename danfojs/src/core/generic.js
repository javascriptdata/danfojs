import * as tf from '@tensorflow/tfjs-node'
import { table } from 'table'
import { Utils } from './utils'
import { Configs } from '../config/config'

const utils = new Utils()
const config = new Configs()  //package wide configuration object




export default class NDframe {
    /**
     * N-Dimensiona data structure. Stores multi-dimensional 
     * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame. 
     * 
     * @param {data} Array, JSON, Tensor. Block of data.
     * @param {kwargs} Object,(Optional Configuration Object)
     *                 {columns: Array of column names. If not specified and data is an array of array, use range index.
 *                      dtypes: Data types of the columns }
     *      
     * @returns NDframe
     */

    constructor(data, kwargs = {}) {
        this.kwargs = kwargs

        if (utils.__is_1D_array(data)) {
            this.series = true
            this.__read_array(data)
        } else {
            this.series = false
            if (utils.__is_object(data[0])) { //check the type of the first object in the data
                this.__read_object(data)
            } else if (Array.isArray(data[0]) || utils.__is_number(data[0]) || utils.__is_string(data[0])) {
                this.__read_array(data)
            } else {
                throw "File format not supported for now"
            }
        }

    }


    __read_array(data) {
        this.data = data //Defualt array data in row format
        this.data_tensor = tf.tensor(data) //data saved as tensors TODO: INfer type before saving as tensor
        this.index_arr = [...Array(this.data_tensor.shape[0]).keys()]   //set index


        if (this.ndim == 1) {
            //series array
            if (!utils.__key_in_object(this.kwargs, 'columns')) {
                this.columns = ["0"]
            } else {
                this.columns = this.kwargs['columns']
            }

            if (utils.__key_in_object(this.kwargs, 'dtypes')) {
                this.__set_col_types(this.kwargs['dtypes'], false)
            } else {
                //infer dtypes
                this.__set_col_types(null, true)
            }

        } else {
            //2D or more array
            if (!utils.__key_in_object(this.kwargs, 'columns')) {
                //asign integer numbers
                this.columns = [...Array(this.data_tensor.shape[0]).keys()]
            } else {
                if (this.kwargs['columns'].length == Number(this.data_tensor.shape[1])) {
                    this.columns = this.kwargs['columns']
                } else {
                    throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has lenght of ${this.data_tensor.shape[1]}`
                }
            }

            if (utils.__key_in_object(this.kwargs, 'dtypes')) {
                this.__set_col_types(this.kwargs['dtypes'], false)
            } else {
                //infer dtypes
                this.__set_col_types(null, true)
            }
        }
    }


    //Reads a Javascript Object of arrays of data points
    __read_object(data) {
        let data_arr = []
        data.forEach((item) => {
            data_arr.push(Object.values(item))

        });
        this.data = data_arr //default array data in row format
        this.data_tensor = tf.tensor(data_arr) //data saved as tensors
        this.kwargs['columns'] = Object.keys(Object.values(data)[0]) //get names of the column from the first entry
        this.index_arr = [...Array(this.data_tensor.shape[0]).keys()]     //set index


        if (this.ndim == 1) {
            //series array
            if (this.kwargs['columns'] == undefined) {
                this.columns = ["0"]
            } else {
                this.columns = this.kwargs['columns']
            }

        } else {
            //2D or more array
            if (!utils.__key_in_object(this.kwargs, 'columns')) {
                //asign integer numbers
                this.columns = [...Array(this.data_tensor.shape[0]).keys()] //use 0 because we are testing lenght from an Object
            } else {
                if (this.kwargs['columns'].length == Number(this.data_tensor.shape[1])) {
                    this.columns = this.kwargs['columns']
                } else {
                    throw `Column lenght mismatch. You provided a column of lenght ${this.kwargs['columns'].length} but data has column length of ${this.data_tensor.shape[1]}`
                }
            }

            //saves array data in column form for easy access
            if (utils.__key_in_object(this.kwargs, 'dtypes')) {
                this.__set_col_types(this.kwargs['dtypes'], false)
            } else {
                //infer dtypes
                this.__set_col_types(null, true)
            }

            //set index
            this.index_arr = [...Array(this.data_tensor.shape[0]).keys()]
        }
    }


    __set_col_types(dtypes, infer) {
        //set data type for each column in an NDFrame
        const __supported_dtypes = ['float32', "int32", 'string', 'datetime']

        if (infer) {
            //saves array data in column form for easy access
            if (this.series) {
                this.col_types = utils.__get_t(this.values)
            } else {
                this.col_data = utils.__get_col_values(this.data)
                this.col_types = utils.__get_t(this.col_data)
            }
        } else {
            if (Array.isArray(dtypes) && dtypes.length == this.columns.length) {
                dtypes.map((type, indx) => {
                    if (!__supported_dtypes.includes(type)) {
                        throw new Error(`dtype error: dtype specified at index ${indx} is not supported`)
                    }
                })
                this.col_data = utils.__get_col_values(this.data)
                this.col_types = dtypes
            }
        }
    }

    /**
        * Returns the data types in the DataFrame 
        * @return {Array} list of data types for each column
        */
    get dtypes() {
        // let col_data = utils.get_col_values(this.data)
        // this.col_types = utils.__get_t(col_data)
        return this.col_types
    }


    /**
     * Returns the data types in the DataFrame 
     * @return {Array} list of data types for each column
     */
    astype(dtype) {
        this.__set_col_types(dtype, false)
    }



    /**
     * Gets dimension of the NDFrame
     * @returns {Integer} dimension of NDFrame
     */
    get ndim() {
        if (this.series) {
            return 1
        } else {
            return this.data_tensor.shape.length
        }
    }


    /**
    * Gets values for index and columns
    * @return {Object} axes configuration for index and columns of NDFrame
    */
    get axes() {
        let axes = {
            "index": [...Array(this.data.length - 1).keys()],
            "columns": this.columns
        }
        return axes
    }

    /**
    * Gets values for index and columns
    * @return {Object} axes configuration for index and columns of NDFrame
    */
    get index() {
        return this.index_arr
    }

    /**
    * Gets values for index and columns
    * @return {Object} axes configuration for index and columns of NDFrame
    */
    set_index(labels) {
        if (!Array.isArray(labels)){
            throw Error("Value Error: index must be an array")
        }
        if (labels.length > this.index.length || labels.length < this.index.length){
            throw Error("Value Error: length of labels must match row shape of data")
        }
        this.index_arr = labels
    }



    /**
     * Gets a sequence of axis dimension along row and columns
     * @returns {Array} the shape of the NDFrame
     */
    get shape() {
        if (this.series) {
            return [1]
        } else {
            return this.data_tensor.shape
        }
    }


    /**
     * Gets the values in the NDFrame in JS array
     * @returns {Array} Arrays of arrays of data instances
     */
    get values() {
        return this.data
    }



    /**
     * Gets the column names of the data
     * @returns {Array} strings of column names
     */
    get column_names() {
        return this.columns
    }


    /*
     * Gets binary size of the NDFrame
     * @returns {String} size of the NDFrame
     */
    get size() {
        return this.data_tensor.size
    }


    /**
    * Overrides default string representation of NDFrame
    */
    toString() {
        let table_width = config.get_width
        let table_truncate = config.get_truncate
        let max_row = config.get_max_row
        let data;
        let data_arr = []
        let header = [""].concat(this.columns)
        let table_config = {}
        let idx = this.index

        if (this.values.length > max_row) {
            data = this.values.slice(0, max_row)
        }else{
            data = this.values
        }

        for (let index = 0; index < this.columns.length; index++) {
            table_config[index] = { width: table_width, truncate: table_truncate }
        }

        data.map((val, i) => {
            data_arr.push([idx[i]].concat(val))
        })
        data_arr.unshift(header) //Adds the column names to values before printing
        return table(data_arr, { columns: table_config })
    }


}
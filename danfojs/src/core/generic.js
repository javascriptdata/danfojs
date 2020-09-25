/**
* Copyright 2020, JsData.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 *
*/

// import * as tf from '@tensorflow/tfjs-node' //Use this import when building optimized version for danfojs-node
import * as tf from '@tensorflow/tfjs' //Use this import when building optimized version for danfojs browser side
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
     * @param {data} Array JSON, Tensor. Block of data.
     * @param {kwargs} Object Optional Configuration Object
     *                 {columns: Array of column names. If not specified and data is an array of array, use range index.
     *                  dtypes: Data types of the columns }
     *      
     * @returns NDframe
     */

    constructor(data, kwargs = {}) {
        this.kwargs = kwargs

        if (data instanceof tf.Tensor) {
            data = data.arraySync()
        }

        if (utils.__is_1D_array(data)) {
            this.series = true
            this._read_array(data)
        } else {
            this.series = false
            if (utils.__is_object(data[0])) { //check the type of the first object in the data
                this._read_object(data, 1) //type 1 object are of JSON form [{a: 1, b: 2}, {a: 30, b: 20}]
            } else if (utils.__is_object(data)) {
                this._read_object(data, 2)  //type 2 object are of the form {a: [1,2,3,4], b: [30,20, 30, 20}]
            } else if (Array.isArray(data[0]) || utils.__is_number(data[0]) || utils.__is_string(data[0])) {
                this._read_array(data)
            } else {
                throw new Error("File format not supported")
            }
        }

    }

    /**
     * 
     * @param {Array} data 
     * Read array of data into NDFrame
     */
    _read_array(data) {
        this.data = utils.__replace_undefined_with_NaN(data, this.series)
        this.row_data_tensor = tf.tensor(this.data)

        if (this.series) {
            this.col_data = [this.values]
        } else {
            this.col_data = utils.__get_col_values(this.data)
        }

        this.col_data_tensor = tf.tensor(this.col_data) //data saved as 2D column tensors

        if ('index' in this.kwargs) {
            this.__set_index(this.kwargs['index'])
        } else {
            this.index_arr = [...Array(this.row_data_tensor.shape[0]).keys()]
        }

        if (this.ndim == 1) {
            //series array
            if ('columns' in this.kwargs) {
                this.columns = this.kwargs['columns']
            } else {
                this.columns = ["0"]
            }

        } else {
            //2D Array
            if ('columns' in this.kwargs) {
                if (this.kwargs['columns'].length == Number(this.row_data_tensor.shape[1])) {
                    this.columns = this.kwargs['columns']
                } else {
                    throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has lenght of ${this.row_data_tensor.shape[1]}`
                }
            } else {
                this.columns = [...Array(this.row_data_tensor.shape[1]).keys()]
            }
        }

        if ('dtypes' in this.kwargs) {
            this._set_col_types(this.kwargs['dtypes'], false)
        } else {
            this._set_col_types(null, true) //infer dtypes
        }
    }


    /**
     *  Convert Javascript Object of arrays into NDFrame
     * @param {*} data Object of Arrays
     * @param {*} type type 1 object are of JSON form [{a: 1, b: 2}, {a: 30, b: 20}], 
     *                 type 2 object are of the form {a: [1,2,3,4], b: [30,20, 30, 20}]
     */
    _read_object(data, type) {
        if (type == 2) {
            let [row_arr, col_names] = utils._get_row_and_col_values(data)
            this.kwargs['columns'] = col_names
            this._read_array(row_arr)

        } else {
            let data_arr = data.map((item) => {
                return Object.values(item)
            });

            this.data = utils.__replace_undefined_with_NaN(data_arr, this.series) //Defualt array data in row format
            this.row_data_tensor = tf.tensor(this.data) //data saved as row tensors
            this.kwargs['columns'] = Object.keys(Object.values(data)[0]) //get names of the column from the first entry

            if (this.series) {
                this.col_data = [this.values] //data saved as 1D column tensors
            } else {
                this.col_data = utils.__get_col_values(this.data)  
            }

            this.col_data_tensor = tf.tensor(this.col_data) //data saved as 2D column tensors

            if ('index' in this.kwargs) {
                this.__set_index(this.kwargs['index'])
            } else {
                this.index_arr = [...Array(this.row_data_tensor.shape[0]).keys()]
            }

            if (this.ndim == 1) {
                //series array
                if (!this.kwargs['columns']) {
                    this.columns = ["0"]
                } else {
                    this.columns = this.kwargs['columns']
                }

            } else {
                //2D Array
                if ('columns' in this.kwargs) {
                    if (this.kwargs['columns'].length == Number(this.row_data_tensor.shape[1])) {
                        this.columns = this.kwargs['columns']
                    } else {
                        throw `Column length mismatch. You provided a column of length ${this.kwargs['columns'].length} but data has column length of ${this.row_data_tensor.shape[1]}`
                    }
                } else {
                    this.columns = [...Array(this.row_data_tensor.shape[1]).keys()]

                }
            }

            if ('dtypes' in this.kwargs) {
                this._set_col_types(this.kwargs['dtypes'], false)
            } else {
                this._set_col_types(null, true) //infer dtypes
            }
        }
    }


    /**
     * Sets the data type of the NDFrame. Supported types are ['float32', "int32", 'string', 'boolean']
     * @param {Array<String>} dtypes Array of data types. 
     * @param {Boolean} infer Whether to automatically infer the dtypes from the Object
     */
    _set_col_types(dtypes, infer) {
        const __supported_dtypes = ['float32', "int32", 'string', 'boolean']

        if (infer) {
            if (this.series) {
                this.col_types = utils.__get_t(this.values)
            } else {
                this.col_types = utils.__get_t(this.col_data)
            }
        } else {

            if (this.series) {
                this.col_types = dtypes
            } else {
                if (dtypes.length != this.columns.length){
                    throw new Error(`length Mixmatch: Length of specified dtypes is ${dtypes.length}, but length of columns is ${this.columns.length}`)
                }
                if (Array.isArray(dtypes)) {
                    dtypes.forEach((type, indx) => {
                        if (!__supported_dtypes.includes(type)) {
                            throw new Error(`dtype error: dtype specified at index ${indx} is not supported`)
                        }
                    })
                    this.col_types = dtypes
                } else {
                    throw new Error(`dtypes must be an Array of types`)
                }
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
        // let sf = new Series({dtypes: this.col_types, index: this.column_names})
        return this.col_types
    }


    /**
     * Gets dimension of the NDFrame
     * @returns {Integer} dimension of NDFrame
     */
    get ndim() {
        if (this.series) {
            return 1
        } else {
            return this.row_data_tensor.shape.length
        }
    }


    /**
    * Gets values for index and columns
    * @return {Object} axes configuration for index and columns of NDFrame
    */
    get axes() {
        let axes = {
            "index": this.index,
            "columns": this.columns
        }
        return axes
    }

    /**
    * Gets index of the NDframe
    * @return {Array} array of index from series
    */
    get index() {
        return this.index_arr
    }

    /**
    * Sets index of the NDFrame
    */
    __set_index(labels) {
        if (!Array.isArray(labels)) {
            throw Error("Value Error: index must be an array")
        }
        if (labels.length > this.shape[0] || labels.length < this.shape[0]) {
            throw Error("Value Error: length of labels must match row shape of data")
        }
        this.index_arr = labels

    }

    /**
    * Generate a new index for NDFrame.
    */
    __reset_index() {
        let new_idx = [...Array(this.values.length).keys()]
        this.index_arr = new_idx
    }



    /**
     * Gets a sequence of axis dimension along row and columns
     * @returns {Array} the shape of the NDFrame
     */
    get shape() {
        if (this.series) {
            return [this.values.length, 1]
        } else {
            return this.row_data_tensor.shape
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

    /**
    * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values
    *  gets mapped to True values. Everything else gets mapped to False values. 
    * @return {Array}
    */
    __isna() {
        let new_arr = []
        if (this.series) {
            this.values.map(val => {
                // eslint-disable-next-line use-isnan
                if (val == NaN) {
                    new_arr.push(true)
                } else if (isNaN(val) && typeof val != "string") {
                    new_arr.push(true)
                } else {
                    new_arr.push(false)
                }
            })
        } else {
            let row_data = this.values;
            row_data.map(arr => {
                let temp_arr = []
                arr.map(val => {
                    // eslint-disable-next-line use-isnan
                    if (val == NaN) {
                        temp_arr.push(true)
                    } else if (isNaN(val) && typeof val != "string") {
                        temp_arr.push(true)
                    } else {
                        temp_arr.push(false)
                    }
                })
                new_arr.push(temp_arr)
            })
        }
        return new_arr
    }

    /*
     * Gets binary size of the NDFrame
     * @returns {String} size of the NDFrame
     */
    get size() {
        return this.row_data_tensor.size
    }

    /**
    * Return object data as comma-separated values (csv).
     * @returns {Promise<String>} CSV representation of Object data
     */
    async to_csv() {
        if (this.series) {
            let csv = this.values.join(",")
            return csv
        } else {
            let records = this.values
            let header = this.column_names.join(",")

            let csv_str = `${header}\n`
            records.forEach(val => {
                let row = `${val.join(",")}\n`
                csv_str += row
            })
            return csv_str
        }


    }


    /**
    * Return object as JSON string.
    * @returns {Promise <JSON>} JSON representation of Object data
    */
    async to_json() {
        if (this.series) {
            let obj = {}
            obj[this.column_names[0]] = this.values
            let json = JSON.stringify(obj)
            return json
        } else {
            let values = this.values
            let header = this.column_names
            let json_arr = []
            values.forEach(val => {
                let obj = {}
                header.forEach((h, i) => {
                    obj[h] = val[i]
                })
                json_arr.push(obj)

            })
            return JSON.stringify(json_arr)
        }
    }


    /**
    * Prints the data in a Series as a grid of row and columns
    */
    toString() {
        let table_width = config.get_width
        let table_truncate = config.get_truncate
        let max_row = config.get_max_row
        let max_col_in_console = config.get_max_col_in_console

        // let data;
        let data_arr = []
        let table_config = {}
        // let idx = this.index
        let col_len = this.columns.length
        // let row_len = this.values.length - 1
        let header = []

        if (col_len > max_col_in_console) {
            //truncate displayed columns to fit in the console
            let first_4_cols = this.columns.slice(0, 4)
            let last_3_cols = this.columns.slice(col_len - 4)
            //join columns with truncate ellipse in the middle
            header = [""].concat(first_4_cols).concat(["..."]).concat(last_3_cols)

            let sub_idx, values_1, value_2

            if (this.values.length > max_row) {
                //slice Object to show [max_rows]
                let df_subset_1 = this.iloc({ rows: [`0:${max_row}`], columns: ["0:4"] })
                let df_subset_2 = this.iloc({ rows: [`0:${max_row}`], columns: [`${col_len - 4}:`] })
                sub_idx = this.index.slice(0, max_row)
                values_1 = df_subset_1.values
                value_2 = df_subset_2.values
            } else {
                let df_subset_1 = this.iloc({ rows: ["0:"], columns: ["0:4"] })
                let df_subset_2 = this.iloc({ rows: ["0:"], columns: [`${col_len - 4}:`] })
                sub_idx = this.index.slice(0, max_row)
                values_1 = df_subset_1.values
                value_2 = df_subset_2.values
            }

            // merge dfs
            sub_idx.map((val, i) => {
                let row = [val].concat(values_1[i]).concat(["..."]).concat(value_2[i])
                data_arr.push(row)
            })


        } else {
            //display all columns
            header = [""].concat(this.columns)
            let idx, values;
            if (this.values.length > max_row) {
                //slice Object to show a max of [max_rows]
                let data = this.loc({ rows: [`0:${max_row}`], columns: this.columns })
                idx = data.index
                values = data.values
            } else {
                values = this.values
                idx = this.index

            }

            // merge cols
            idx.forEach((val, i) => {
                let row = [val].concat(values[i])
                data_arr.push(row)
            })


        }

        //set column width of all columns
        table_config[0] = 10
        for (let index = 1; index < header.length; index++) {
            table_config[index] = { width: table_width, truncate: table_truncate }
        }
    
        let table_data = [header].concat(data_arr) //Adds the column names to values before printing
        console.log(`\n Shape: (${this.shape}) \n`);
        return table(table_data, { columns: table_config })
    }


    /**
    * Pretty prints n number of rows in a DataFrame or Series in the console
    * @param {rows} Number of rows to print
    */
    print() {
        console.log(this + "")
    }

}
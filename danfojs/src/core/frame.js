import Ndframe from "./generic"
import * as tf from '@tensorflow/tfjs-node'
import { Utils } from "./utils"
const utils = new Utils


/**
 * DataFrame object. A 2D frame object that stores data in structured tabular format
 * @param {kwargs} Object,(Optional Configuration Object)
  *              columns: Array of column names. If not specified and data is an array of array, use range index.
  * @returns DataFrame data structure
 */
export class DataFrame extends Ndframe {
    constructor(data, kwargs) {
        super(data, kwargs);
    }

    /**
     * Drop a row or a column base on the axis specified
     * @param {val} String name of row or column to drop
     * @param {kwargs} Object (Optional configuration object
     *             axis: row=0, columns=1
     *             inplace: specify whether to drop the row/column with/without creating a new DataFrame
     */
    drop(val, kwargs = { axis: 0, inplace: false }) {

        if (kwargs['axis'] == 1) {
            const index = this.columns.indexOf(val);
            const values = this.values

            if (index == -1) {
                throw new Error(`column ${val} does not exist`)
            }

            let new_data = values.map(function (element) {
                let new_arr = utils.remove(element, index);
                return new_arr;
            });

            if (!kwargs['inplace']) {
                let columns = utils.remove(this.columns, index);
                return new DataFrame(new_data, { columns: columns })
            } else {
                this.columns = utils.remove(this.columns, index);
                this.data = tf.tensor(new_data);
            }

        } else {

            const axes = this.axes
            const isIndex = axes["index"].includes(val);
            const values = this.values

            if (isIndex) {
                var index = val;
            } else {
                throw new Error("Index does not exist")
            }

            let new_data = utils.remove(values, index);

            if (!kwargs['inplace']) {
                return new DataFrame(new_data, { columns: this.columns })
            } else {
                this.data = tf.tensor(new_data);
            }
        }
    }


    /**
     * Obtain the defined the set of row and column index to obtain
     * @param {} kwargs object {rows:Array, columns:Array of column name} 
     * @return DataFrame data stucture
     */
    loc(kwargs) {

        if (Object.prototype.hasOwnProperty.call(kwargs, "rows")) {
            if (Array.isArray(kwargs["rows"])) {
                var rows = kwargs["rows"];
            } else {
                throw new Error("rows must be a list")
            }
        } else {
            throw new Error("Kwargs keywords are {rows, columns}")
        }

        if (Object.prototype.hasOwnProperty.call(kwargs, "columns")) {
            if (Array.isArray(kwargs["columns"])) {
                var columns = kwargs["columns"];
            } else {
                throw new Error("columns must be a list")
            }
        } else {
            throw new Error("Kwargs keywords are {rows, columns}")
        }

        let data_values = this.values;
        let axes = this.axes
        let new_data = [];

        for (var index = 0; index < rows.length; index++) {
            let row_val = rows[index]
            let max_rowIndex = data_values.length - 1

            if (row_val > max_rowIndex) {
                throw new Error(`row index ${row_val} is bigger than ${max_rowIndex}`);
            }

            let value = data_values[row_val]
            let row_data = []

            for (var i in columns) {

                let col_index = axes["columns"].indexOf(columns[i]);

                if (col_index == -1) {
                    throw new Error(`Column ${columns[i]} does not exist`);
                }

                let val_tensor = tf.tensor(value);
                let tensor_elem = val_tensor.slice([col_index], [1]).arraySync()[0]

                row_data.push(tensor_elem);
            }

            new_data.push(row_data);

        }

        let df_columns = { "columns": columns }
        let df = new DataFrame(new_data, df_columns);

        return df;

    }


    /**
     * Access a dataframe element using row and column index
     * @param {*} kwargs object {rows:Array, columns:Array of column index} 
     * @return DataFrame data stucture
     */
    iloc(kwargs) {

        if (Object.prototype.hasOwnProperty.call(kwargs, "rows")) {
            if (Array.isArray(kwargs["rows"])) {

                var rows = kwargs["rows"];
                console.log(rows);
            } else {
                throw new Error("rows must be a list")
            }
        } else {
            throw new Error("Kwargs keywords are {rows, columns}")
        }

        if (Object.prototype.hasOwnProperty.call(kwargs, "columns")) {
            if (Array.isArray(kwargs["columns"])) {
                var columns = kwargs["columns"];
            } else {
                throw new Error("columns must be a list")
            }
        } else {
            throw new Error("Kwargs keywords are {rows, columns}")
        }

        let data_values = this.values;

        let axes = this.axes

        let new_data = [];

        for (var index = 0; index < rows.length; index++) {
            let row_val = rows[index]
            let max_rowIndex = data_values.length - 1

            if (row_val > max_rowIndex) {
                throw new Error(`row index ${row_val} is bigger than ${max_rowIndex}`);
            }


            let value = data_values[row_val]


            let row_data = []

            for (var i in columns) {


                let col_index = columns[i];

                let max_colIndex = axes["columns"].length - 1

                if (col_index > max_colIndex) {
                    throw new Error(`column index ${col_index} is bigger than ${max_colIndex}`);
                }

                let val_tensor = tf.tensor(value);
                let tensor_elem = val_tensor.slice([col_index], [1]).arraySync()[0]

                row_data.push(tensor_elem);
            }

            new_data.push(row_data);

        }

        let column_name = []
        columns.map((col) => {
            column_name.push(axes["columns"][col]);
        })
        let df_columns = { "columns": column_name }
        let df = new DataFrame(new_data, df_columns);
        return df;

    }
    

    /**
    * Prints the first n values in a dataframe
    * @param {rows}  
    */
    head(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            rows = this.values.length
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            //Creates a new dataframe with first [rows]
            let config = { columns: this.column_names }
            let data = this.values.slice(0, rows)
            return new DataFrame(data, config)
        }

    }

    /**
    * Prints the last n values in a dataframe
    * @param {rows}  
    */
    tail(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            rows = this.values.length
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            //Creates a new dataframe with last [rows]
            let config = { columns: this.column_names }
            let data = this.values.slice(this.values.length - rows)
            return new DataFrame(data, config)
        }

    }

    /**
    * Prints the last n values in a dataframe
    * @param {rows}  
    */
    sample(rows = 5) {

    }


    /**
     * Add a column to the dataframe
     * @param col 
     * @param value
     * 
     */
    addColum(col, value) { }

    /**
     * check if each row,col contains NaN
     * @return Array list (bool)
     */
    isnan() { }

    /**
     * Obtain index containing nan values
     * @return Array list (int)
     */
    nanIndex() { }

    /**
     * Group a col inrespect to another column
     * @param {group} col1 
     * @param {*} col2 
     * @param {*} aggregate 
     */
    groupby(col1, col2, aggregate) {

    }

    /**
     * Join two or more dataframe together base on their
     * axis
     * @param {*} df_list
     * @param {*} axis 
     * @return dataframe object
     */
    static concatenate(df_list, axis) { }

    /**
     * Query a dataframe base on the column and filter
     * @param {*} column 
     * @param {*} operator 
     * @param {*} value 
     * @return Dataframe
     */
    static query(column, operator, value) { }

    /**
     * Merge two or more dataframe base on keys
     */
    static merge() { }

    /**
     * create a one-hot encoder
     * @param {*} series a dataframe column
     * @return DataFrame
     */
    static dummy(series) { }

}
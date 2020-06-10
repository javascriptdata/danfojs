import Ndframe from "./generic"
import * as tf from '@tensorflow/tfjs'
import { remove } from "./utils"



/**
 * DataFrame object. A 2D frame object that stores data in structured tabular format
 * @param kwargs Object,(Optional Configuration Object)
  *              columns: Array of column names. If not specified and data is an array of array, use range index.
  * @returns DataFrame data structure
 */
export class DataFrame extends Ndframe {
    constructor(data, kwargs) {
        super(data, kwargs);
    }


    /**
         * Prints data to formatted table in console or a specified div container in the browser
         * @param data Data to format in console
         * @param container HTML Div id to plot table
         */
    get to_string() {
        return null
    }

    // /**
    //  * Return a sequence of axis dimension along row and columns
    //  * @returns Array list
    //  */
    // get columns() {
    //     return null
    // }

    // /**
    //      * Return a sequence of axis dimension along row and columns
    //      * @returns Array list
    //      */
    // set columns(cols) {

    // }

    /**
     * Drop a row or a column base on the axis specified
     * @param {*} val 
     * @param {*} axis 
     * @param {*} inplace 
     */
    drop(val, kwargs = { axis: 0, inplace: false }) {

        if (kwargs['axis'] == 1) {
            const index = this.columns.indexOf(val);
            const values = this.values

            if (index == -1) {
                throw new Error(`column ${val} does not exist`)
            }

            let new_data = values.map(function (element) {
                let new_arr = remove(element, index);
                return new_arr;
            });

            if (!kwargs['inplace']) {
                let columns = remove(this.columns, index);
                return new DataFrame(new_data, { columns: columns })
            } else {
                this.columns = remove(this.columns, index);
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

            let new_data = remove(values, index);

            if (!kwargs['inplace']) {
                return new DataFrame(new_data, { columns: this.columns })
            } else {
                this.data = tf.tensor(new_data);
            }
        }
    }


    /**
     * Access a dataframe element using the columns name
     * @param row_list 
     * @param column_list
     * @return Array list
     */
    loc(row_list, colum_list) { }

    /**
     * Access a dataframe element using row and column index
     * @param row_indexes 
     * @param colum_indexes
     * @return Array_list
     */
    iloc(row_indexes, colum_indexes) { }

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
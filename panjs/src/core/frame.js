import Ndframe from "./generic"
// import * as tf from '@tensorflow/tfjs'



/**
 * DataFrame object. A 2D frame object that stores data in structured tabular format
 */
export class DataFrame extends Ndframe {
    constructor(data, columns, name) {
        super(data, columns, name);
    }


    /**
         * Prints data to formatted table in console or a specified div container in the browser
         * @param data Data to format in console
         * @param container HTML Div id to plot table
         */
    get to_string() {
        return null
    }

    /**
     * Return a sequence of axis dimension along row and columns
     * @returns Array list
     */
    get columns() {
        return null
    }

    /**
         * Return a sequence of axis dimension along row and columns
         * @returns Array list
         */
    set columns(cols) {

    }

    /**
     * Drop column or index base on the one specified
     * @param prop can either be an index or a column to dorp
     * @return Array list
     */
    drop(prop){}

    /**
     * Access a dataframe element using the columns name
     * @param row_list 
     * @param column_list
     * @return Array list
     */
    loc(row_list,colum_list){}

    /**
     * Access a dataframe element using row and column index
     * @param row_indexes 
     * @param colum_indexes
     * @return Array_list
     */
    iloc(row_indexes, colum_indexes){}

    /**
     * Add a column to the dataframe
     * @param col 
     * @param value
     * 
     */
    addColum(col,value){}

    /**
     * check if each row,col contains NaN
     * @return Array list (bool)
     */
    isnan(){}

    /**
     * Obtain index containing nan values
     * @return Array list (int)
     */
    nanIndex(){}

    /**
     * Group a col inrespect to another column
     * @param {group} col1 
     * @param {*} col2 
     * @param {*} aggregate 
     */
    groupby(col1,col2,aggregate){

    }

    /**
     * Join two or more dataframe together base on their
     * axis
     * @param {*} df_list
     * @param {*} axis 
     * @return dataframe object
     */
    static concatenate(df_list,axis){}

    /**
     * Query a dataframe base on the column and filter
     * @param {*} column 
     * @param {*} operator 
     * @param {*} value 
     * @return Dataframe
     */
    static query(column, operator,value){}

    /**
     * Merge two or more dataframe base on keys
     */
    static merge(){}

    /**
     * create a one-hot encoder
     * @param {*} series a dataframe column
     * @return DataFrame
     */
    static dummy(series){}

}
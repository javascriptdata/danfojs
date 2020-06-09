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

    // /**
    //      * Return a sequence of axis dimension along row and columns
    //      * @returns Array list
    //      */
    // set columns(cols) {

    // }
}
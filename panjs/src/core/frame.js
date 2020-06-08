import Ndframe from "./generic"

export class DataFrame extends Ndframe {

    /**
         * Prints data to formatted table in console or a specified div container in the browser
         * @param data Data to format in console
         * @param container HTML Div id to plot table
         */
    to_string() {
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
}
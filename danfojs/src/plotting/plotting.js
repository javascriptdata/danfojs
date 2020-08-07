//perform plotting
import * as Plotly from 'plotly.js/dist/plotly'


/**
 * Plotting methods and Functions performed on Series and DataFrames
 */
export class Plot {
    constructor() {
        //pass
    }

    scatter(div_name) {

        let trace1 = {
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            mode: 'markers',
            type: 'scatter'
        }

        let data = [trace1]

        Plotly.newPlot(div_name, data);

    }

}
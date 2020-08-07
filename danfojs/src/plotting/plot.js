//perform plotting
import * as Plotly from 'plotly.js/dist/plotly'
import { Utils } from "../core/utils"
const utils = new Utils()



/**
 * Plotting methods and Functions performed on Series and DataFrames
 */
export class Plot {
    constructor() {}

    plot(ndframe, div, config) {
        let params = Object.keys(config)
        let this_config = {}

        params.forEach(param => {
            this_config[param] = config[param]
        })

        if (ndframe.series) {
            let x = ndframe.values
            let trace = {
                x: x,
                type: this_config["kind"],
                mode: this_config["mode"]
            }
            Plotly.newPlot(div, [trace], this_config['layout']);

        } else {
            //DataFrame
            if (utils.__key_in_object(this_config, 'x') && utils.__key_in_object(this_config, 'y')) {
                let x = ndframe[this_config['x']].values
                let y = ndframe[this_config['y']].values

                let trace = {
                    x: x,
                    y: y,
                    type: config["kind"],
                    mode: config["mode"]
                }
                Plotly.newPlot(div, [trace], this_config['layout']);

            } else {
                //plot all
                let y = ndframe.index
                let data = []
                ndframe.column_names.forEach(c_name => {
                    let trace = {
                        x: ndframe[c_name].values,
                        y: y,
                        type: this_config["kind"],
                        mode: this_config["mode"],
                        name: c_name
                    };
                    data.push(trace)

                })
                Plotly.newPlot(div, data, this_config['layout']);
            }


        }
    }

}
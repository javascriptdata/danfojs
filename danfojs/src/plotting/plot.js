//perform plotting
import { newPlot } from 'plotly.js/dist/plotly'
import { Utils } from "../core/utils"
import { Series } from "../core/series"

const utils = new Utils()



/**
 * Plotting methods and Functions performed on Series and DataFrames
 */
export class Plot {
    constructor() { }

    plot(ndframe, div, config) {
        let params = Object.keys(config)
        let this_config = {}

        params.forEach(param => {
            this_config[param] = config[param]
        })

        if (!utils.__key_in_object(config, "layout")) {
            this_config['layout'] = {}
        }

        if (ndframe instanceof Series) {
            let trace = {}

            if (this_config['type'] == 'histogram') {
                let x = ndframe.values
                trace["x"] = x
            } else {
                let y = ndframe.values
                trace["y"] = y
            }

            params.forEach(param => {
                trace[param] = config[param]
            })
            newPlot(div, [trace], this_config['layout']);

        } else {

            //DataFrame
            if (utils.__key_in_object(this_config, 'x') && utils.__key_in_object(this_config, 'y')) {
                if (!ndframe.column_names.includes(this_config['x'])) {
                    throw Error(`Column Error: ${this_config['x']} not found in columns`)
                }
                if (!ndframe.column_names.includes(this_config['y'])) {
                    throw Error(`Column Error: ${this_config['y']} not found in columns`)
                }


                let x = ndframe[this_config['x']].values
                let y = ndframe[this_config['y']].values

                let trace = {
                    x: x,
                    y: y,
                    type: config["type"],
                    mode: config["mode"],
                }

                let xaxis = {}; let yaxis = {}
                xaxis['title'] = this_config['x']
                yaxis['title'] = this_config['y']

                this_config['layout']['xaxis'] = xaxis
                this_config['layout']['yaxis'] = yaxis


                newPlot(div, [trace], this_config['layout']);


            } else if (this_config['type'] == 'pie') {
                if (!ndframe.column_names.includes(this_config['values'])) {
                    throw Error(`Column Error: ${this_config['values']} not found in columns`)
                }
                if (!ndframe.column_names.includes(this_config['labels'])) {
                    throw Error(`Column Error: ${this_config['labels']} not found in columns`)
                }
                let data = [{
                    values: ndframe[this_config['values']].values,
                    labels: ndframe[this_config['labels']].values,
                    type: 'pie'
                }];

                newPlot(div, data, this_config['layout'])

            } else if (this_config['type'] == 'table') {
                let header = {}
                let cells = {}

                header['values'] = ndframe.column_names
                cells['values'] = ndframe.col_data

                if (this_config['header_style']) {
                    Object.keys(this_config['header_style']).forEach(param => {
                        header[param] = this_config['header_style'][param]
                    })
                }

                if (this_config['cell_style']) {
                    Object.keys(this_config['cell_style']).forEach(param => {
                        header[param] = this_config['cell_style'][param]
                    })
                }
                var data = [{
                    type: 'table',
                    header: header,
                    cells: cells
                }]
                newPlot(div, data, this_config['layout']);

            } else if (this_config['type'] == 'box') {
                let cols_2_show = []
                let data = []

                if (this_config['columns'] != undefined) {
                    cols_2_show = this_config['columns']
                    cols_2_show.forEach(col => {
                        if (!ndframe.column_names.includes(col)) {
                            throw Error(`Column Error: ${this_config['labels']} not found in columns`)
                        }
                    })
                } else {
                    cols_2_show = ndframe.column_names
                }


                cols_2_show.forEach(col => {
                    let col_idx = ndframe.column_names.indexOf(col)
                    let trace = []
                    trace['y'] = ndframe.col_data[col_idx]
                    trace["type"] = 'box'
                    trace["name"] = col

                    data.push(trace)
                })
                newPlot(div, data, this_config['layout']);

            } else {
                //plot all
                let x = ndframe.index
                let data = []
                ndframe.column_names.forEach(c_name => {
                    let trace = {}
                    trace["x"] = x
                    trace["y"] = ndframe[c_name].values
                    trace['name'] = c_name
                    params.forEach(param => {
                        trace[param] = config[param]
                    })
                    data.push(trace)

                })
                newPlot(div, data, this_config['layout']);
            }


        }
    }

}
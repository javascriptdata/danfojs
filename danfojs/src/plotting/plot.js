//perform plotting
import { newPlot } from 'plotly.js/dist/plotly'
import { Utils } from "../core/utils"
import { Series } from "../core/series"

const utils = new Utils()



/**
 * Plotting methods and Functions performed on Series and DataFrames
 */
export class Plot {
    constructor(ndframe, div) {
        this.div = div
        this.ndframe = ndframe
    }

    plot(config) {
        let params = Object.keys(config)
        let this_config = {}

        params.forEach(param => {
            this_config[param] = config[param]
        })

        if (!utils.__key_in_object(config, "layout")) {
            this_config['layout'] = {}
        }

        if (this.ndframe instanceof Series) {
            let trace = {}

            if (this_config['type'] == 'histogram') {
                let x = this.ndframe.values
                trace["x"] = x
            } else {
                let y = this.ndframe.values
                trace["y"] = y
            }

            params.forEach(param => {
                trace[param] = config[param]
            })
            newPlot(this.div, [trace], this_config['layout']);

        } else {

            //DataFrame
            if (utils.__key_in_object(this_config, 'x') && utils.__key_in_object(this_config, 'y')) {
                if (!this.ndframe.column_names.includes(this_config['x'])) {
                    throw Error(`Column Error: ${this_config['x']} not found in columns`)
                }
                if (!this.ndframe.column_names.includes(this_config['y'])) {
                    throw Error(`Column Error: ${this_config['y']} not found in columns`)
                }


                let x = this.ndframe[this_config['x']].values
                let y = this.ndframe[this_config['y']].values

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


                newPlot(this.div, [trace], this_config['layout']);


            } else if (this_config['type'] == 'pie') {
                if (!this.ndframe.column_names.includes(this_config['values'])) {
                    throw Error(`Column Error: ${this_config['values']} not found in columns`)
                }
                if (!this.ndframe.column_names.includes(this_config['labels'])) {
                    throw Error(`Column Error: ${this_config['labels']} not found in columns`)
                }
                let data = [{
                    values: this.ndframe[this_config['values']].values,
                    labels: this.ndframe[this_config['labels']].values,
                    type: 'pie'
                }];

                newPlot(this.div, data, this_config['layout'])

            } else if (this_config['type'] == 'table') {
                let header = {}
                let cells = {}

                header['values'] = this.ndframe.column_names
                cells['values'] = this.ndframe.col_data

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
                newPlot(this.div, data, this_config['layout']);

            } else if (this_config['type'] == 'box') {
                let cols_2_show = []
                let data = []

                if (this_config['columns'] != undefined) {
                    cols_2_show = this_config['columns']
                    cols_2_show.forEach(col => {
                        if (!this.ndframe.column_names.includes(col)) {
                            throw Error(`Column Error: ${this_config['labels']} not found in columns`)
                        }
                    })
                } else {
                    cols_2_show = this.ndframe.column_names
                }


                cols_2_show.forEach(col => {
                    let col_idx = this.ndframe.column_names.indexOf(col)
                    let trace = []
                    trace['y'] = this.ndframe.col_data[col_idx]
                    trace["type"] = 'box'
                    trace["name"] = col

                    data.push(trace)
                })
                newPlot(this.div, data, this_config['layout']);

            } else {
                //plot all
                let x = this.ndframe.index
                let data = []
                this.ndframe.column_names.forEach(c_name => {
                    let trace = {}
                    trace["x"] = x
                    trace["y"] = this.ndframe[c_name].values
                    trace['name'] = c_name
                    params.forEach(param => {
                        trace[param] = config[param]
                    })
                    data.push(trace)

                })
                newPlot(this.div, data, this_config['layout']);
            }


        }
    }



    /**
     * Plot Series or DataFrame as lines. This function is useful to plot lines using DataFrame’s values as coordinates.
    * Make plots of Series or DataFrame.
    * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
    * @param {string} div Name of the div to show the plot
    * @param {Object} config configuration options for making Plots, supports Plotly parameters
     */
    line(config = {}) {

        let ret_params = this.__get_plot_params(config)
        let this_config = ret_params[0]
        let params = ret_params[1]

        if (this.ndframe instanceof Series) {
            let trace = {}
            let y = this.ndframe.values

            params.forEach(param => {
                if (!param == "layout") {
                    trace[param] = config[param]
                }
            })

            trace["y"] = y
            trace['type'] = "line"

            newPlot(this.div, [trace], this_config['layout']);

        } else {
            //check if plotting two columns against each other
            if (utils.__key_in_object(this_config, 'x') && utils.__key_in_object(this_config, 'y')) {
                if (!this.ndframe.column_names.includes(this_config['x'])) {
                    throw Error(`Column Error: ${this_config['x']} not found in columns`)
                }
                if (!this.ndframe.column_names.includes(this_config['y'])) {
                    throw Error(`Column Error: ${this_config['y']} not found in columns`)
                }


                let x = this.ndframe[this_config['x']].values
                let y = this.ndframe[this_config['y']].values

                let trace = {}
                trace["x"] = x
                trace['y'] = y


                let xaxis = {}; let yaxis = {}
                xaxis['title'] = this_config['x']
                yaxis['title'] = this_config['y']

                this_config['layout']['xaxis'] = xaxis
                this_config['layout']['yaxis'] = yaxis

                newPlot(this.div, [trace], this_config['layout']);

            } else if (utils.__key_in_object(this_config, 'x') || utils.__key_in_object(this_config, 'y')) {
                //plot single column specified in either of param [x | y] against index
                let trace = {}

                params.forEach(param => {
                    if (!param == "layout") {
                        trace[param] = config[param]
                    }
                })

                if (utils.__key_in_object(this_config, 'x')) {
                    trace['x'] = this.ndframe[this_config['x']].values
                    trace['y'] = this.ndframe.index
                } else {
                    trace['x'] = this.ndframe.index
                    trace['y'] = this_config['y']
                }

                newPlot(this.div, [trace], this_config['layout']);

            } else {
                //plot columns against index
                let data = []
                let cols_to_plot;

                if (utils.__key_in_object(this_config, "columns")) {
                    cols_to_plot = this.____check_if_cols_exist(this_config['columns'])
                } else {
                    cols_to_plot = this.ndframe.column_names
                }

                cols_to_plot.forEach(c_name => {
                    let trace = {}

                    params.forEach(param => { //TODO accept individual configuration for traces
                        trace[param] = config[param]
                    })
                    trace["x"] = this.ndframe.index
                    trace["y"] = this.ndframe[c_name].values
                    trace['name'] = c_name

                    data.push(trace)

                })
                newPlot(this.div, data, this_config['layout']);

            }

        }


    }


    /**
    * Plot Series or DataFrame as Bars.
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    bar(config = {}) {

        let ret_params = this.__get_plot_params(config)
        let this_config = ret_params[0]
        let params = ret_params[1]

        if (this.ndframe instanceof Series) {
            let trace = {}
            let y = this.ndframe.values

            params.forEach(param => {
                if (!param == "layout") {
                    trace[param] = config[param]
                }
            })

            trace["y"] = y
            trace['type'] = "bar"

            newPlot(this.div, [trace], this_config['layout']);

        } else {
            //check if plotting two columns against each other
            if (utils.__key_in_object(this_config, 'x') && utils.__key_in_object(this_config, 'y')) {
                if (!this.ndframe.column_names.includes(this_config['x'])) {
                    throw Error(`Column Error: ${this_config['x']} not found in columns`)
                }
                if (!this.ndframe.column_names.includes(this_config['y'])) {
                    throw Error(`Column Error: ${this_config['y']} not found in columns`)
                }


                let x = this.ndframe[this_config['x']].values
                let y = this.ndframe[this_config['y']].values

                let trace = {}
                trace["x"] = x
                trace['y'] = y
                trace['type'] = "bar"


                let xaxis = {}; let yaxis = {}
                xaxis['title'] = this_config['x']
                yaxis['title'] = this_config['y']

                this_config['layout']['xaxis'] = xaxis
                this_config['layout']['yaxis'] = yaxis

                newPlot(this.div, [trace], this_config['layout']);

            } else if (utils.__key_in_object(this_config, 'x') || utils.__key_in_object(this_config, 'y')) {
                //plot single column specified in either of param [x | y] against index
                let trace = {}

                params.forEach(param => {
                    if (!param == "layout") {
                        trace[param] = config[param]
                    }
                })

                if (utils.__key_in_object(this_config, 'x')) {
                    trace['y'] = this.ndframe[this_config['x']].values
                } else {
                    trace['y'] = this.ndframe[this_config['y']].values
                }
                trace['type'] = "bar"

                newPlot(this.div, [trace], this_config['layout']);

            } else {
                //plot columns against index
                let data = []
                let cols_to_plot;

                if (utils.__key_in_object(this_config, "columns")) {
                    cols_to_plot = this.____check_if_cols_exist(this_config['columns'])
                } else {
                    cols_to_plot = this.ndframe.column_names
                }

                cols_to_plot.forEach(c_name => {
                    let trace = {}

                    // params.forEach(param => { //TODO accept individual configuration for traces
                    //     trace[param] = config[param]
                    // })
                    trace['x'] = this.ndframe.index
                    trace["y"] = this.ndframe[c_name].values
                    trace['name'] = c_name
                    trace['type'] = "bar"

                    data.push(trace)

                })
                newPlot(this.div, data, this_config['layout']);

            }

        }


    }


    /**
    * Plot two or more columns in a DataFrame as scatter points. If Series, plot against its index
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    scatter(config = {}) {

        let ret_params = this.__get_plot_params(config)
        let this_config = ret_params[0]
        let params = ret_params[1]

        if (this.ndframe instanceof Series) {
            let trace = {}

            params.forEach(param => {
                if (!param == "layout") {
                    trace[param] = config[param]
                }
            })

            trace["x"] = this.ndframe.values
            trace['y'] = this.ndframe.index
            trace['type'] = "scatter"
            trace['mode'] = "markers"

            newPlot(this.div, [trace], this_config['layout']);

        } else {
            //check if plotting two columns against each other
            if (utils.__key_in_object(this_config, 'x') && utils.__key_in_object(this_config, 'y')) {
                if (!this.ndframe.column_names.includes(this_config['x'])) {
                    throw Error(`Column Error: ${this_config['x']} not found in columns`)
                }
                if (!this.ndframe.column_names.includes(this_config['y'])) {
                    throw Error(`Column Error: ${this_config['y']} not found in columns`)
                }


                let x = this.ndframe[this_config['x']].values
                let y = this.ndframe[this_config['y']].values

                let trace = {}
                trace["x"] = x
                trace['y'] = y
                trace['type'] = "scatter"
                trace['mode'] = "markers"

                let xaxis = {}; let yaxis = {}
                xaxis['title'] = this_config['x']
                yaxis['title'] = this_config['y']

                this_config['layout']['xaxis'] = xaxis
                this_config['layout']['yaxis'] = yaxis

                newPlot(this.div, [trace], this_config['layout']);

            } else if (utils.__key_in_object(this_config, 'x') || utils.__key_in_object(this_config, 'y')) {
                //plot single column specified in either of param [x | y] against index
                let trace = {}

                params.forEach(param => {
                    if (!param == "layout") {
                        trace[param] = config[param]
                    }
                })

                if (utils.__key_in_object(this_config, 'x')) {
                    trace['y'] = this.ndframe.index
                    trace['x'] = this.ndframe[this_config['x']].values

                } else {
                    trace['x'] = this.ndframe.index
                    trace['y'] = this.ndframe[this_config['y']].values

                }
                trace['type'] = "scatter"
                trace['mode'] = "markers"

                newPlot(this.div, [trace], this_config['layout']);

            } else {
                //plot columns against index
                let data = []
                let cols_to_plot;

                if (utils.__key_in_object(this_config, "columns")) {
                    cols_to_plot = this.____check_if_cols_exist(this_config['columns'])
                } else {
                    cols_to_plot = this.ndframe.column_names
                }

                cols_to_plot.forEach(c_name => {
                    let trace = {}

                    // params.forEach(param => { //TODO accept individual configuration for traces
                    //     trace[param] = config[param]
                    // })
                    trace['x'] = this.ndframe.index
                    trace["x"] = this.ndframe[c_name].values
                    trace['name'] = c_name
                    trace['type'] = "scatter"
                    trace['mode'] = "markers"
                    data.push(trace)

                })
                newPlot(this.div, data, this_config['layout']);

            }

        }


    }




    __get_plot_params(config) {
        let params = Object.keys(config)
        let this_config = {}

        params.forEach(param => {
            this_config[param] = config[param]
        })

        if (!utils.__key_in_object(config, "layout")) {
            this_config['layout'] = {}
        }


        return [this_config, params]

    }

    ____check_if_cols_exist(cols) {
        cols.forEach(col => {
            if (!this.ndframe.column_names.includes(col)) {
                throw Error(`Column Error: ${col} not found in columns. Columns should be one of [ ${this.ndframe.column_names} ]`)
            }
        })
        return cols
    }

}
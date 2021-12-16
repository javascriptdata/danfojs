/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/
import Series from "../core/series";
import DataFrame from "../core/frame";
import Utils from "../shared/utils"
import Plotly, { Config, Data, Layout } from "plotly.js-dist-min"

const utils = new Utils();

type PlotConfigObject = {
    config?: Partial<Config>;
    layout?: Partial<Layout>;
}

try {
    // @ts-ignore
    const version = Plotly.version;
    console.info(`Using Plotly version ${version}`);
} catch (error) {
    console.info(`Plotly CDN not found. If you need to make Plots, then add the Plotly CDN to your script`);
}


export default class Plot {
    divId: string;
    ndframe: DataFrame | Series;

    constructor(ndframe: DataFrame | Series, divId: string) {
        this.ndframe = ndframe;
        this.divId = divId;
    }

    /**
    * Plot Series or DataFrame as lines.
    * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
    * @param config configuration options for making Plots, supports Plotly.js parameters.
   */
    line(configSettings: PlotConfigObject = {}) {
        const newConfig = this.$getPlotParams(configSettings);

        if (this.ndframe instanceof Series) {
            const y = this.ndframe.values as any[]
            let trace: Data = {
                x: this.ndframe.index,
                y,
                type: 'scatter',
                mode: 'lines',
                ...configSettings.config,
            };

            //ts-ignore
            Plotly.newPlot(this.divId, [trace], newConfig.layout, newConfig.config);

            // } else {
            //     //check if plotting two columns against each other
            //     if (utils.keyInObject(newConfig, 'x') && utils.keyInObject(newConfig, 'y')) {
            //         if (!this.ndframe.columns.includes(newConfig['x'])) {
            //             throw Error(`Column Error: ${newConfig['x']} not found in columns`);
            //         }
            //         if (!this.ndframe.columns.includes(newConfig['y'])) {
            //             throw Error(`Column Error: ${newConfig['y']} not found in columns`);
            //         }


            //         let x = this.ndframe[newConfig['x']].values;
            //         let y = this.ndframe[newConfig['y']].values;

            //         let trace = {};
            //         trace["x"] = x;
            //         trace['y'] = y;


            //         let xaxis = {}; let yaxis = {};
            //         xaxis['title'] = newConfig['x'];
            //         yaxis['title'] = newConfig['y'];

            //         newConfig['layout']['xaxis'] = xaxis;
            //         newConfig['layout']['yaxis'] = yaxis;

            //         Plotly.newPlot(this.divId, [trace], newConfig['layout'], newConfig);

            //     } else if (utils.keyInObject(newConfig, 'x') || utils.keyInObject(newConfig, 'y')) {
            //         //plot single column specified in either of param [x | y] against index
            //         //plot columns against index
            //         let data = [];
            //         let cols_to_plot;

            //         if (utils.keyInObject(newConfig, "columns")) {
            //             cols_to_plot = this.$checkIfColsExist(newConfig['columns']);
            //         } else {
            //             cols_to_plot = this.ndframe.columns;
            //         }

            //         cols_to_plot.forEach((c_name) => {
            //             let trace = {};

            //             params.forEach((param) => { //TODO accept indivIdidual configuration for traces
            //                 trace[param] = config[param];
            //             });
            //             if (utils.keyInObject(newConfig, 'x')) {
            //                 trace["x"] = this.ndframe[newConfig['x']].values;
            //                 trace["y"] = this.ndframe[c_name].values;
            //                 trace['name'] = c_name;
            //             } else {
            //                 trace["y"] = this.ndframe[newConfig['y']].values;
            //                 trace["x"] = this.ndframe[c_name].values;
            //                 trace['name'] = c_name;
            //             }

            //             data.push(trace);

            //         });
            //         Plotly.newPlot(this.divId, data, newConfig['layout'], newConfig);

            //     } else {
            //         //plot columns against index
            //         let data = [];
            //         let cols_to_plot;

            //         if (utils.keyInObject(newConfig, "columns")) {
            //             cols_to_plot = this.$checkIfColsExist(newConfig['columns']);
            //         } else {
            //             cols_to_plot = this.ndframe.columns;
            //         }

            //         cols_to_plot.forEach((c_name) => {
            //             let trace = {};

            //             params.forEach((param) => { //TODO accept indivIdidual configuration for traces
            //                 trace[param] = config[param];
            //             });
            //             trace["x"] = this.ndframe.index;
            //             trace["y"] = this.ndframe[c_name].values;
            //             trace['name'] = c_name;

            //             data.push(trace);

            //         });
            //         Plotly.newPlot(this.divId, data, newConfig['layout'], newConfig);

            //     }

        }


    }


    private $getPlotParams(config: PlotConfigObject) {
        const newConfig: PlotConfigObject = {
            config: config.config || {},
            layout: config['layout'] ? config['layout'] : {}
        };
        return newConfig
    }

    private $checkIfColsExist(cols: string[]) {
        cols.forEach((col) => {
            if (!this.ndframe.columns.includes(col)) {
                throw Error(`Column Error: ${col} not found in columns. Columns should be one of [ ${this.ndframe.columns} ]`);
            }
        });
        return cols;
    }


}

// @ts-nocheck

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
import Series from "../../../../danfojs-base/core/series";
import DataFrame from "../../../../danfojs-base/core/frame";
import { Data } from "plotly.js-dist-min"
import { PlotConfigObject } from "../../types"
import { checkIfColsExist } from "./utils"


/**
* Plot Series or DataFrame as pie chart.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* Line plot supports different types of parameters, and the behavior will depend on data specified.
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
export const piePlot = (ndframe: DataFrame | Series, divId: string, plotConfig: PlotConfigObject, Plotly: any) => {
    const config = plotConfig["config"]
    const layout = plotConfig["layout"]

    if (ndframe instanceof Series) {
        let trace: Data = {
            values: ndframe.values as any,
            labels: config["labels"] || ndframe.index as any,
            type: 'pie',
            name: config.labels,
            hoverinfo: 'label+percent+name',
            automargin: true
        };

        Plotly.newPlot(divId, [trace], layout, config);

    } else {
        if (config["labels"]) {

            if (!ndframe.columns.includes(config['labels'])) {
                throw Error(`Column Error: ${config['labels']} not found in columns. Param "labels" name must be one of [ ${ndframe.columns}]`);
            }

            if (config["values"]) {

                if (!ndframe.columns.includes(config['values'])) {
                    throw Error(`Column Error: ${config['values']} not found in columns. Param "values" name must be one of [ ${ndframe.columns}]`);
                }

                let trace: Data = {
                    values: ndframe[config['values']].values as any,
                    labels: ndframe[config["labels"]].values as any,
                    type: 'pie',
                    name: config.labels,
                    hoverinfo: 'label+percent+name',
                    automargin: true
                };

                Plotly.newPlot(divId, [trace], layout, config);

            } else {
                // if columns is not specified in config, then plot all columns
                const cols = config["columns"] ? checkIfColsExist(ndframe, config['columns']) : ndframe.columns;

                if (config['rowPositions']) {
                    if (config['rowPositions'].length != cols.length - 1) {
                        throw Error(`Lenght of rowPositions array must be equal to number of columns. Got ${config['rowPositions'].length}, expected ${cols.length - 1}`);
                    }
                } else {
                    let tempArr = [];
                    for (let i = 0; i < cols.length - 1; i++) {
                        tempArr.push(0);
                    }
                    config['rowPositions'] = tempArr;

                }

                if (config['columnPositions']) {
                    if (config['columnPositions'].length != cols.length - 1) {
                        throw Error(`Lenght of columnPositions array must be equal to number of columns. Got ${config['columnPositions'].length}, expected ${cols.length - 1}`);
                    }
                } else {
                    let tempArr = [];
                    for (let i = 0; i < cols.length - 1; i++) {
                        tempArr.push(i);
                    }
                    config['columnPositions'] = tempArr;

                }

                const traces: Data[] = [];
                cols.forEach((col, i) => {
                    const labels = (ndframe as DataFrame)[config["labels"]].values;
                    const values = (ndframe as DataFrame)[col].values;

                    const trace: Data = {
                        labels,
                        values,
                        name: col,
                        type: 'pie',
                        domain: {
                            row: config['rowPositions'][i],
                            column: config['columnPositions'][i]
                        },
                        hoverinfo: 'label+percent+name',
                        automargin: true,
                        textposition: 'outside'
                    };
                    traces.push(trace);
                });

                const _layout = {
                    ...layout,
                }

                if (!config["grid"]) {
                    //set default grid
                    let size = Number((ndframe.shape[1] / 2).toFixed()) + 1;
                    _layout["grid"] = { rows: size, columns: size };
                }else{
                    _layout["grid"] = config["grid"];
                }
               
                Plotly.newPlot(divId, traces, _layout, config);

            }
        } else {
            throw new Error(`Param Error: Please provide a column name for "labels" param`)
        }

    }

}

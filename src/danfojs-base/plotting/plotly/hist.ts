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
import Series from "../../core/series";
import DataFrame from "../../core/frame";
import { Data } from "plotly.js-dist-min"
import { PlotConfigObject } from "../../shared/types"
import { checkIfColsExist, throwErrorOnWrongColName } from "./utils"


/**
* Plot Series or DataFrame as histogram.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* Line plot supports different types of parameters, and the behavior will depend on data specified.
* The precedence of columns to plot is: (x and y => x => y => columns). 
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
export const histPlot = (ndframe: DataFrame | Series, divId: string, plotConfig: PlotConfigObject, Plotly: any) => {
    const config = plotConfig["config"]
    const layout = plotConfig["layout"]

    if (ndframe instanceof Series) {
        let trace: Data = {
            x: ndframe.values as any,
            type: 'histogram',
        };

        Plotly.newPlot(divId, [trace], layout, config);

    } else {

       if (config["x"] || config["y"]) {
            //plot single column specified in either of param [x | y] against index
            if (config["x"]) {
                throwErrorOnWrongColName(ndframe, config.x);

                const x = ndframe[config.x].values;

                const trace: Data = {
                    x,
                    type: 'histogram',
                };

                const _layout = {
                    xaxis: {
                        title: config.x,
                    },
                    ...layout,
                };

                Plotly.newPlot(divId, [trace], _layout, config);
            }

            if (config["y"]) {
                throwErrorOnWrongColName(ndframe, config.y);

                const y = ndframe[config.y].values;

                const trace: Data = {
                    y,
                    type: 'histogram',
                };
                const _layout = {
                    yaxis: {
                        title: config.y,
                    },
                    ...layout,
                };

                Plotly.newPlot(divId, [trace], _layout, config);
            }

        } else {
            //plot specified columns in config param against index
            // if columns is not specified in config, then plot all columns
            const cols = config["columns"] ? checkIfColsExist(ndframe, config['columns']) : ndframe.columns;

            const traces: Data[] = [];
            cols.forEach((col) => {
                const y = ndframe.index;
                const x = (ndframe as DataFrame)[col].values;

                const trace: Data = { x, y, name: col, type: 'histogram' };
                traces.push(trace);
            });

            Plotly.newPlot(divId, traces, layout, config);

        }

    }

}

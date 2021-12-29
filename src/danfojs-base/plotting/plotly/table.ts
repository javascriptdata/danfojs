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
import { PlotConfigObject } from "../../shared/types"


/**
* Display Series or DataFrame as table.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
export const tablePlot = (ndframe: DataFrame | Series, divId: string, plotConfig: PlotConfigObject, Plotly: any) => {
    const config = plotConfig["config"]
    const layout = plotConfig["layout"]
    let header: any = {};
    let cells: any = {};
    let colsData: any[] = [];
    let cols2Show: any[] = []

    if (config['columns']) {

        config['columns'].forEach((cname) => {
            if (!ndframe.columns.includes(cname)) {
                throw Error(`Column Error: ${cname} not found in columns. Columns should be one of [ ${ndframe.columns} ]`);
            }

            let idx = ndframe.columns.indexOf(cname);
            colsData.push(ndframe.getColumnData[idx]);
        });

        cols2Show = config['columns'];
    } else {

        cols2Show = ndframe.columns;
        colsData = ndframe.getColumnData;

    }

    header['values'] = cols2Show.map((col) => [col]);
    cells['values'] = colsData;

    if (config['tableHeaderStyle']) {
        Object.keys(config['tableHeaderStyle']).forEach((param) => {
            header[param] = config['tableHeaderStyle'][param];
        });
    }

    if (config['tableCellStyle']) {
        Object.keys(config['tableCellStyle']).forEach((param) => {
            cells[param] = config['tableCellStyle'][param];
        });
    }
    const trace = {
        type: 'table',
        header,
        cells
    };
    /* @ts-ignore */
    Plotly.newPlot(divId, [trace], layout, config);

}

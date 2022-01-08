/**
*  @license
* Copyright 2022 JsData. All rights reserved.
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
import {
    linePlot,
    barPlot,
    scatterPlot,
    histPlot,
    piePlot,
    boxPlot,
    violinPlot,
    tablePlot,
} from "./plotly/index";
import Series from "../core/series";
import DataFrame from "../core/frame";
import { PlotConfigObject, IPlotlyLib } from "../shared/types"

let Plotly: IPlotlyLib;

if (typeof window !== "undefined") {
    //check if in browser environment and require "plotly.js-dist-min" module
    Plotly = require("plotly.js-dist-min") as IPlotlyLib;

}

class PlotlyLib implements IPlotlyLib {
    divId: string;
    ndframe: DataFrame | Series;

    constructor(ndframe: DataFrame | Series, divId: string) {
        this.ndframe = ndframe;
        this.divId = divId;
    }

    /**
     * Plot Series or DataFrame as lines.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    line(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        linePlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as bars.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    bar(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        barPlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as scatter.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    scatter(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        scatterPlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as histogram.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    hist(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        histPlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as pie.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    pie(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        piePlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as boxplot.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    box(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        boxPlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as violinplot.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
     */
    violin(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        violinPlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

    /**
     * Plot Series or DataFrame as table.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
     */
    table(plotConfig?: PlotConfigObject) {
        const _plotConfig = plotConfig || {
            config: {},
            layout: {}
        };
        tablePlot(this.ndframe, this.divId, _plotConfig, Plotly);
    }

}

// class Vega {
//     //TODO: Add support for vega library
// }

export {
    PlotlyLib
}

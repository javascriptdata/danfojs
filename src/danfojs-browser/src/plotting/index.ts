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
import Series from "../../../danfojs-base/core/series";
import DataFrame from "../../../danfojs-base/core/frame";
import { PlotConfigObject } from "../types";
import Plotly from "plotly.js-dist-min"


try {
    // @ts-ignore
    const version = Plotly.version;
    console.info(`Using Plotly version ${version}`);
} catch (error) {
    console.info(`Plotly CDN not found. If you need to make Plots, then add the Plotly CDN to your script`);
}

class PlotlyLib {
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
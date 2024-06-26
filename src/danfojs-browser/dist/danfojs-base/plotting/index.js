"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotlyLib = void 0;
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
var index_1 = require("./plotly/index");
var Plotly;
if (typeof window !== "undefined") {
    //check if in browser environment and require "plotly.js-dist-min" module
    Plotly = require("plotly.js-dist-min");
}
var PlotlyLib = /** @class */ (function () {
    function PlotlyLib(ndframe, divId) {
        this.ndframe = ndframe;
        this.divId = divId;
    }
    PlotlyLib.prototype.getPlotConfig = function (plotConfig) {
        var _plotConfig = {
            config: plotConfig && plotConfig.config ? plotConfig.config : {},
            layout: plotConfig && plotConfig.layout ? plotConfig.layout : {}
        };
        return _plotConfig;
    };
    /**
     * Plot Series or DataFrame as lines.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    PlotlyLib.prototype.line = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.linePlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as bars.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    PlotlyLib.prototype.bar = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.barPlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as scatter.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    PlotlyLib.prototype.scatter = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.scatterPlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as histogram.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    PlotlyLib.prototype.hist = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.histPlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as pie.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    PlotlyLib.prototype.pie = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.piePlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as boxplot.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
    */
    PlotlyLib.prototype.box = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.boxPlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as violinplot.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
     */
    PlotlyLib.prototype.violin = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.violinPlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    /**
     * Plot Series or DataFrame as table.
     * Uses Plotly library as backend, so supports Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
     */
    PlotlyLib.prototype.table = function (plotConfig) {
        var _plotConfig = this.getPlotConfig(plotConfig);
        (0, index_1.tablePlot)(this.ndframe, this.divId, _plotConfig, Plotly);
    };
    return PlotlyLib;
}());
exports.PlotlyLib = PlotlyLib;

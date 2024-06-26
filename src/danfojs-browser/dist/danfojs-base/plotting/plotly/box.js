"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxPlot = void 0;
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
var series_1 = __importDefault(require("../../core/series"));
var utils_1 = require("./utils");
/**
* Plot Series or DataFrame as box chart.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* Line plot supports different types of parameters, and the behavior will depend on data specified.
* The precedence of columns to plot is: (x and y => x => y => columns).
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
var boxPlot = function (ndframe, divId, plotConfig, Plotly) {
    var config = plotConfig["config"];
    var layout = plotConfig["layout"];
    if (ndframe instanceof series_1.default) {
        var trace = {
            y: ndframe.values,
            type: 'box',
        };
        Plotly.newPlot(divId, [trace], layout, config);
    }
    else {
        if (config["x"] && config["y"]) {
            //Plotting two columns against each other, when user specifies x and y column names in configuration
            (0, utils_1.throwErrorOnWrongColName)(ndframe, config["x"]);
            (0, utils_1.throwErrorOnWrongColName)(ndframe, config["y"]);
            var x = ndframe[config.x].values;
            var y = ndframe[config.y].values;
            var trace = {
                x: x,
                y: y,
                type: 'box',
            };
            var _layout = __assign({ xaxis: {
                    title: config.x,
                }, yaxis: {
                    title: config.y,
                } }, layout);
            Plotly.newPlot(divId, [trace], _layout, config);
        }
        else if (config["x"] || config["y"]) {
            //plot single column specified in either of param [x | y] against index
            if (config["x"]) {
                (0, utils_1.throwErrorOnWrongColName)(ndframe, config.x);
                var x = ndframe[config.x].values;
                var y = ndframe.index;
                var trace = {
                    x: x,
                    y: y,
                    type: 'box',
                };
                var _layout = __assign({ xaxis: {
                        title: config.x,
                    }, yaxis: {
                        title: "Index",
                    } }, layout);
                Plotly.newPlot(divId, [trace], _layout, config);
            }
            if (config["y"]) {
                (0, utils_1.throwErrorOnWrongColName)(ndframe, config.y);
                var x = ndframe.index;
                var y = ndframe[config.y].values;
                var trace = {
                    x: x,
                    y: y,
                    type: 'box',
                };
                var _layout = __assign({ xaxis: {
                        title: "Index",
                    }, yaxis: {
                        title: config.y,
                    } }, layout);
                Plotly.newPlot(divId, [trace], _layout, config);
            }
        }
        else {
            //plot specified columns in config param against index
            // if columns is not specified in config, then plot all columns
            var cols = config["columns"] ? (0, utils_1.checkIfColsExist)(ndframe, config['columns']) : ndframe.columns;
            var traces_1 = [];
            cols.forEach(function (col) {
                var y = ndframe[col].values;
                var trace = {
                    y: y,
                    name: col,
                    type: 'box',
                };
                traces_1.push(trace);
            });
            Plotly.newPlot(divId, traces_1, layout, config);
        }
    }
};
exports.boxPlot = boxPlot;

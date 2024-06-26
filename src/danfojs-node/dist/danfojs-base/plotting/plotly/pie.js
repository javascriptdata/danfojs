"use strict";
// @ts-nocheck
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
exports.piePlot = void 0;
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
* Plot Series or DataFrame as pie chart.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* Line plot supports different types of parameters, and the behavior will depend on data specified.
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
var piePlot = function (ndframe, divId, plotConfig, Plotly) {
    var config = plotConfig["config"];
    var layout = plotConfig["layout"];
    if (ndframe instanceof series_1.default) {
        var trace = {
            values: ndframe.values,
            labels: config["labels"] || ndframe.index,
            type: 'pie',
            name: config.labels,
            hoverinfo: 'label+percent+name',
            automargin: true
        };
        Plotly.newPlot(divId, [trace], layout, config);
    }
    else {
        if (config["labels"]) {
            if (!ndframe.columns.includes(config['labels'])) {
                throw Error("Column Error: " + config['labels'] + " not found in columns. Param \"labels\" name must be one of [ " + ndframe.columns + "]");
            }
            if (config["values"]) {
                if (!ndframe.columns.includes(config['values'])) {
                    throw Error("Column Error: " + config['values'] + " not found in columns. Param \"values\" name must be one of [ " + ndframe.columns + "]");
                }
                var trace = {
                    values: ndframe[config['values']].values,
                    labels: ndframe[config["labels"]].values,
                    type: 'pie',
                    name: config.labels,
                    hoverinfo: 'label+percent+name',
                    automargin: true
                };
                Plotly.newPlot(divId, [trace], layout, config);
            }
            else {
                // if columns is not specified in config, then plot all columns
                var cols = config["columns"] ? (0, utils_1.checkIfColsExist)(ndframe, config['columns']) : ndframe.columns;
                if (config['rowPositions']) {
                    if (config['rowPositions'].length != cols.length) {
                        throw Error("length of rowPositions array must be equal to number of columns. Got " + config['rowPositions'].length + ", expected " + (cols.length - 1));
                    }
                }
                else {
                    var tempArr = [];
                    for (var i = 0; i < cols.length - 1; i++) {
                        tempArr.push(0);
                    }
                    config['rowPositions'] = tempArr;
                }
                if (config['columnPositions']) {
                    if (config['columnPositions'].length != cols.length) {
                        throw Error("length of columnPositions array must be equal to number of columns. Got " + config['columnPositions'].length + ", expected " + (cols.length - 1));
                    }
                }
                else {
                    var tempArr = [];
                    for (var i = 0; i < cols.length - 1; i++) {
                        tempArr.push(i);
                    }
                    config['columnPositions'] = tempArr;
                }
                var traces_1 = [];
                cols.forEach(function (col, i) {
                    var labels = ndframe[config["labels"]].values;
                    var values = ndframe[col].values;
                    var trace = {
                        labels: labels,
                        values: values,
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
                    traces_1.push(trace);
                });
                var _layout = __assign({}, layout);
                if (!config["grid"]) {
                    //set default grid
                    var size = Number((ndframe.shape[1] / 2).toFixed()) + 1;
                    _layout["grid"] = { rows: size, columns: size };
                }
                else {
                    _layout["grid"] = config["grid"];
                }
                Plotly.newPlot(divId, traces_1, _layout, config);
            }
        }
        else {
            throw new Error("Param Error: Please provide a column name for \"labels\" param");
        }
    }
};
exports.piePlot = piePlot;

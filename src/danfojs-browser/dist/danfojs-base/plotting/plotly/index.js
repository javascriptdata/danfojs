"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tablePlot = exports.violinPlot = exports.boxPlot = exports.piePlot = exports.histPlot = exports.scatterPlot = exports.barPlot = exports.linePlot = void 0;
var line_1 = require("./line");
Object.defineProperty(exports, "linePlot", { enumerable: true, get: function () { return line_1.linePlot; } });
var bar_1 = require("./bar");
Object.defineProperty(exports, "barPlot", { enumerable: true, get: function () { return bar_1.barPlot; } });
var scatter_1 = require("./scatter");
Object.defineProperty(exports, "scatterPlot", { enumerable: true, get: function () { return scatter_1.scatterPlot; } });
var hist_1 = require("./hist");
Object.defineProperty(exports, "histPlot", { enumerable: true, get: function () { return hist_1.histPlot; } });
var pie_1 = require("./pie");
Object.defineProperty(exports, "piePlot", { enumerable: true, get: function () { return pie_1.piePlot; } });
var box_1 = require("./box");
Object.defineProperty(exports, "boxPlot", { enumerable: true, get: function () { return box_1.boxPlot; } });
var violin_1 = require("./violin");
Object.defineProperty(exports, "violinPlot", { enumerable: true, get: function () { return violin_1.violinPlot; } });
var table_1 = require("./table");
Object.defineProperty(exports, "tablePlot", { enumerable: true, get: function () { return table_1.tablePlot; } });

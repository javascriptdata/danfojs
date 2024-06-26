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
import Series from "../../core/series";
import DataFrame from "../../core/frame";
import { InternalPlotConfigObject } from "../../shared/types";
/**
* Plot Series or DataFrame as scatter points.
* Uses the Plotly as backend, so supoorts Plotly's configuration parameters,
* Line plot supports different types of parameters, and the behavior will depend on data specified.
* The precedence of columns to plot is: (x and y => x => y => columns).
* @param ndframe Series or DataFrame to plot
* @param divId HTML div id to plot in.
* @param plotConfig configuration options for making Plots, supports Plotly.js Config and Layout parameters.
*/
export declare const scatterPlot: (ndframe: DataFrame | Series, divId: string, plotConfig: InternalPlotConfigObject, Plotly: any) => void;

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
import { linePlot } from "./plotly/index";
import Series from "../core/series";
import DataFrame from "../core/frame";
import { PlotConfigObject } from "../shared/types";

class Plotly {
    divId: string;
    ndframe: DataFrame | Series;

    constructor(ndframe: DataFrame | Series, divId: string) {
        this.ndframe = ndframe;
        this.divId = divId;
    }

    /**
     * Plot Series or DataFrame as lines.
     * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
     * @param plotConfig configuration options for making Plots, supports Plotly.js parameters.
    */
    line(plotConfig: PlotConfigObject) {
        linePlot(this.ndframe, this.divId, plotConfig);
    }


}

export {
    Plotly
}

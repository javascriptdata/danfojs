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
import Series from "./series";
import DataFrame from "./frame";
import { NDframeInterface } from "../shared/types";
/**
* Internal function to slice a Series/DataFrame by index based labels
* @param Object
*/
export declare function _iloc({ ndFrame, rows, columns }: {
    ndFrame: NDframeInterface;
    rows?: Array<string | number | boolean> | Series;
    columns?: Array<string | number>;
}): Series | DataFrame;
/**
* Internal function to slice a Series/DataFrame by specified string location based labels
* @param Object
*/
export declare function _loc({ ndFrame, rows, columns }: {
    ndFrame: NDframeInterface;
    rows?: Array<string | number | boolean> | Series;
    columns?: Array<string>;
}): Series | DataFrame;

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
import Series from "../core/series";
import DataFrame from "../core/frame";
/**
* Concatenate pandas objects along a particular axis.
* @param object
* dfList: Array of DataFrame or Series
* axis: axis of concatenation 1 or 0
* @returns {DataFrame}
* @example
* concat({dfList: [df1, df2, df3], axis: 1})
*/
declare function concat({ dfList, axis }: {
    dfList: Array<DataFrame | Series>;
    axis: 1 | 0;
}): DataFrame | Series;
export default concat;

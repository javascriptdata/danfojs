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
import DataFrame from "../../core/frame";
import tensorflow from '../../shared/tensorflowlib';
import Series from "../../core/series";
/**
 * Fits a OneHotEncoder to the data.
 * @example
 * ```js
 * const encoder = new OneHotEncoder()
 * encoder.fit(["a", "b", "c"])
 * ```
*/
export default class OneHotEncoder {
    private $labels;
    constructor();
    private $getData;
    /**
     * Fits a OneHotEncoder to the data.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @returns OneHotEncoder
     * @example
     * ```js
     * const encoder = new OneHotEncoder()
     * encoder.fit(["a", "b", "c"])
     * ```
    */
    fit(data: Array<string | number> | typeof tensorflow.Tensor | Series): this;
    /**
     * Encodes the data using the fitted OneHotEncoder.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @example
     * ```js
     * const encoder = new OneHotEncoder()
     * encoder.fit(["a", "b", "c"])
     * encoder.transform(["a", "b", "c"])
     * ```
     */
    transform(data: Array<string | number> | typeof tensorflow.Tensor | Series): DataFrame | typeof tensorflow.Tensor | number[][];
    /**
     * Fit and transform the data using the fitted OneHotEncoder.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @example
     * ```js
     * const encoder = new OneHotEncoder()
     * encoder.fitTransform(["a", "b", "c"])
     * ```
     */
    fitTransform(data: Array<string | number> | typeof tensorflow.Tensor | Series): DataFrame | typeof tensorflow.Tensor | number[][];
}

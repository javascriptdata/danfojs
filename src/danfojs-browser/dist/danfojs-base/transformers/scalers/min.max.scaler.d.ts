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
import tensorflow from '../../shared/tensorflowlib';
/**
 * Transform features by scaling each feature to a given range.
 * This estimator scales and translates each feature individually such
 * that it is in the given range on the training set, e.g. between the maximum and minimum value.
*/
export default class MinMaxScaler {
    private $max;
    private $min;
    constructor();
    private $getTensor;
    /**
     * Fits a MinMaxScaler to the data
     * @param data Array, Tensor, DataFrame or Series object
     * @returns MinMaxScaler
     * @example
     * const scaler = new MinMaxScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * // MinMaxScaler {
     * //   $max: [5],
     * //   $min: [1]
     * // }
     *
     */
    fit(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): this;
    /**
     * Transform the data using the fitted scaler
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new MinMaxScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * scaler.transform([1, 2, 3, 4, 5])
     * // [0, 0.25, 0.5, 0.75, 1]
     * */
    transform(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): any;
    /**
     * Fit the data and transform it
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new MinMaxScaler()
     * scaler.fitTransform([1, 2, 3, 4, 5])
     * // [0, 0.25, 0.5, 0.75, 1]
     * */
    fitTransform(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): any;
    /**
     * Inverse transform the data using the fitted scaler
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new MinMaxScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * scaler.inverseTransform([0, 0.25, 0.5, 0.75, 1])
     * // [1, 2, 3, 4, 5]
     * */
    inverseTransform(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): any;
}

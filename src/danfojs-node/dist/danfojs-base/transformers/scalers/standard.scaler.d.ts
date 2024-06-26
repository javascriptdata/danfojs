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
import tensorflow from '../../shared/tensorflowlib';
import Series from "../../core/series";
import DataFrame from "../../core/frame";
/**
 * Standardize features by removing the mean and scaling to unit variance.
 * The standard score of a sample x is calculated as: `z = (x - u) / s`,
 * where `u` is the mean of the training samples, and `s` is the standard deviation of the training samples.
 */
export default class StandardScaler {
    private $std;
    private $mean;
    constructor();
    private $getTensor;
    /**
     * Fit a StandardScaler to the data.
     * @param data Array, Tensor, DataFrame or Series object
     * @returns StandardScaler
     * @example
     * const scaler = new StandardScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     */
    fit(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): this;
    /**
     * Transform the data using the fitted scaler
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new StandardScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * scaler.transform([1, 2, 3, 4, 5])
     * // [0.0, 0.0, 0.0, 0.0, 0.0]
     * */
    transform(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): any;
    /**
     * Fit and transform the data using the fitted scaler
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new StandardScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * scaler.fitTransform([1, 2, 3, 4, 5])
     * // [0.0, 0.0, 0.0, 0.0, 0.0]
     * */
    fitTransform(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): any;
    /**
     * Inverse transform the data using the fitted scaler
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new StandardScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * scaler.transform([1, 2, 3, 4, 5])
     * // [0.0, 0.0, 0.0, 0.0, 0.0]
     * scaler.inverseTransform([0.0, 0.0, 0.0, 0.0, 0.0])
     * // [1, 2, 3, 4, 5]
     * */
    inverseTransform(data: number[] | number[][] | typeof tensorflow.Tensor | DataFrame | Series): any;
}

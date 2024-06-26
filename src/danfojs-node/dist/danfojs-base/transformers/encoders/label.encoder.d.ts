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
/**
 * Encode target labels with value between 0 and n_classes-1.
 */
export default class LabelEncoder {
    private $labels;
    constructor();
    private $getData;
    /**
     * Maps values to unique integer labels between 0 and n_classes-1.
     * @param data 1d array of labels, Tensor, or  Series to fit.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * ```
    */
    fit(data: Array<string | number> | typeof tensorflow.Tensor | Series): this;
    /**
     * Encode labels with value between 0 and n_classes-1.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * console.log(encoder.transform(["a", "b", "c", "d"]))
     * // [0, 1, 2, 3]
     * ```
    */
    transform(data: Array<string | number> | typeof tensorflow.Tensor | Series): any;
    /**
     * Fit and transform data in one step.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fitTransform(["a", "b", "c", "d"])
     * // [0, 1, 2, 3]
     * ```
     */
    fitTransform(data: Array<string | number> | typeof tensorflow.Tensor | Series): any;
    /**
     * Inverse transform values back to original values.
     * @param data 1d array of labels, Tensor, or  Series to be decoded.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * console.log(encoder.inverseTransform([0, 1, 2, 3]))
     * // ["a", "b", "c", "d"]
     * ```
    */
    inverseTransform(data: Array<number> | typeof tensorflow.Tensor | Series): any;
    /**
     * Get the number of classes.
     * @returns number of classes.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * console.log(encoder.nClasses)
     * // 4
     * ```
     */
    get nClasses(): number;
    /**
     * Get the mapping of classes to integers.
     * @returns mapping of classes to integers.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * console.log(encoder.classes)
     * // {a: 0, b: 1, c: 2, d: 3}
     * ```
    */
    get classes(): {
        [key: string]: number;
    };
}

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
import { Tensor, tensor1d } from "@tensorflow/tfjs-node"
import Series from "../../core/series"
import Utils from "../../shared/utils"

const utils = new Utils()

/**
 * Encode target labels with value between 0 and n_classes-1.
 */
export default class LabelEncoder {
    private $labels: { [key: string]: number }

    constructor() {
        this.$labels = {}
    }

    private $getData(data: Array<string | number> | Tensor | Series) {
        let $data: Array<string | number>

        if (data instanceof Array) {
            if (utils.is1DArray(data)) {
                $data = data
            } else {
                throw new Error("ValueError: data must be a 1D array.")
            }
        } else if (data instanceof Series) {
            $data = data.values as Array<string | number>
        } else if (data instanceof Tensor) {
            $data = data.arraySync() as Array<string | number>
        } else {
            throw new Error("ParamError: data must be one of Array, 1d Tensor or Series.")
        }
        return $data
    }

    /**
     * Maps values to unique integer labels between 0 and n_classes-1.
     * @param data 1d array of labels, Tensor, or  Series to fit.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * ```
    */
    fit(data: Array<string | number> | Tensor | Series) {
        const $data = this.$getData(data)
        const dataSet = Array.from(new Set($data))
        const tempObj: { [key: string | number]: number } = {}
        dataSet.forEach((value, index) => {
            tempObj[value] = index
        })
        this.$labels = tempObj

    }

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
    transform(data: Array<string | number> | Tensor | Series) {
        const $data = this.$getData(data)
        const encodedData: Array<number> = $data.map(value => {
            return this.$labels[value]
        })

        if (data instanceof Array) {
            return encodedData
        } else if (data instanceof Series) {
            return new Series(encodedData)
        } else if (data instanceof Tensor) {
            return tensor1d(encodedData)
        }
    }

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
    fitTransform(data: Array<string | number> | Tensor | Series) {
        this.fit(data)
        return this.transform(data)
    }

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
    inverseTransform(data: Array<number> | Tensor | Series) {
        const $data = this.$getData(data)
        const tempData = $data.map(value => {
            return Object.keys(this.$labels).find(key => this.$labels[key] === value)
        })

        const decodedData = tempData.map(value => {
            if (isNaN(parseInt(value as any))) {
                return value
            } else {
                return Number(value)
            }
        })

        if (data instanceof Array) {
            return decodedData
        } else if (data instanceof Series) {
            return new Series(decodedData)
        } else if (data instanceof Tensor) {
            return tensor1d(decodedData as any)
        }
    }

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
    get nClasses(): number {
        return Object.keys(this.$labels).length
    }

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
    get classes(): { [key: string]: number } {
        return this.$labels
    }
}
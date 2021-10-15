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

import DataFrame from "../../core/frame";
import { Tensor, tensor1d } from "@tensorflow/tfjs-node"
import Series from "../../core/series"
import Utils from "../../shared/utils"

const utils = new Utils()

/**
 * Fits a OneHotEncoder to the data.
 * @example
 * ```js
 * const encoder = new OneHotEncoder()
 * encoder.fit(["a", "b", "c"])
 * ```
*/
export default class OneHotEncoder {
    private $labels: Array<string | number | boolean>

    constructor() {
        this.$labels = []
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
     * Fits a OneHotEncoder to the data.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @returns OneHotEncoder
     * @example
     * ```js
     * const encoder = new OneHotEncoder()
     * encoder.fit(["a", "b", "c"])
     * ```
    */
    public fit(data: Array<string | number> | Tensor | Series) {
        const $data = this.$getData(data)
        const dataSet = Array.from(new Set($data))
        this.$labels = dataSet
        return this
    }

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
    public transform(data: Array<string | number> | Tensor | Series): DataFrame | Tensor | number[][] {
        const $data = this.$getData(data)
        const oneHotArr: any = utils.zeros($data.length, this.$labels.length)

        for (let i = 0; i < $data.length; i++) {
            const index = this.$labels.indexOf($data[i])
            oneHotArr[i][index] = 1
        }

        if (data instanceof Array) {
            return oneHotArr
        } else if (data instanceof Series) {
            return new DataFrame(oneHotArr, {
                index: data.index,
            })
        } else {
            return tensor1d(oneHotArr)
        }
    }

    /**
     * Fit and transform the data using the fitted OneHotEncoder.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @example
     * ```js
     * const encoder = new OneHotEncoder()
     * encoder.fitTransform(["a", "b", "c"])
     * ```
     */
    public fitTransform(data: Array<string | number> | Tensor | Series): DataFrame | Tensor | number[][] {
        this.fit(data)
        return this.transform(data)
    }
}
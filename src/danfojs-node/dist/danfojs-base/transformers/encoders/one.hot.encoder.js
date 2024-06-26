"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = __importDefault(require("../../core/frame"));
var tensorflowlib_1 = __importDefault(require("../../shared/tensorflowlib"));
var series_1 = __importDefault(require("../../core/series"));
var utils_1 = __importDefault(require("../../shared/utils"));
var utils = new utils_1.default();
/**
 * Fits a OneHotEncoder to the data.
 * @example
 * ```js
 * const encoder = new OneHotEncoder()
 * encoder.fit(["a", "b", "c"])
 * ```
*/
var OneHotEncoder = /** @class */ (function () {
    function OneHotEncoder() {
        this.$labels = [];
    }
    OneHotEncoder.prototype.$getData = function (data) {
        var $data;
        if (data instanceof Array) {
            if (utils.is1DArray(data)) {
                $data = data;
            }
            else {
                throw new Error("ValueError: data must be a 1D array.");
            }
        }
        else if (data instanceof series_1.default) {
            $data = data.values;
        }
        else if (data instanceof tensorflowlib_1.default.Tensor) {
            $data = data.arraySync();
        }
        else {
            throw new Error("ParamError: data must be one of Array, 1d Tensor or Series.");
        }
        return $data;
    };
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
    OneHotEncoder.prototype.fit = function (data) {
        var $data = this.$getData(data);
        var dataSet = Array.from(new Set($data));
        this.$labels = dataSet;
        return this;
    };
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
    OneHotEncoder.prototype.transform = function (data) {
        var $data = this.$getData(data);
        var oneHotArr = utils.zeros($data.length, this.$labels.length);
        for (var i = 0; i < $data.length; i++) {
            var index = this.$labels.indexOf($data[i]);
            oneHotArr[i][index] = 1;
        }
        if (data instanceof Array) {
            return oneHotArr;
        }
        else if (data instanceof series_1.default) {
            return new frame_1.default(oneHotArr, {
                index: data.index,
            });
        }
        else {
            return tensorflowlib_1.default.tensor1d(oneHotArr);
        }
    };
    /**
     * Fit and transform the data using the fitted OneHotEncoder.
     * @param data 1d array of labels, Tensor, or  Series to be encoded.
     * @example
     * ```js
     * const encoder = new OneHotEncoder()
     * encoder.fitTransform(["a", "b", "c"])
     * ```
     */
    OneHotEncoder.prototype.fitTransform = function (data) {
        this.fit(data);
        return this.transform(data);
    };
    return OneHotEncoder;
}());
exports.default = OneHotEncoder;

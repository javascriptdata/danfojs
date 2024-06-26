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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tensorflowlib_1 = __importDefault(require("../../shared/tensorflowlib"));
var series_1 = __importDefault(require("../../core/series"));
var frame_1 = __importDefault(require("../../core/frame"));
var utils_1 = __importDefault(require("../../shared/utils"));
var utils = new utils_1.default();
/**
 * Standardize features by removing the mean and scaling to unit variance.
 * The standard score of a sample x is calculated as: `z = (x - u) / s`,
 * where `u` is the mean of the training samples, and `s` is the standard deviation of the training samples.
 */
var StandardScaler = /** @class */ (function () {
    function StandardScaler() {
        this.$std = tensorflowlib_1.default.tensor1d([]);
        this.$mean = tensorflowlib_1.default.tensor1d([]);
    }
    StandardScaler.prototype.$getTensor = function (data) {
        var $tensorArray;
        if (data instanceof Array) {
            if (utils.is1DArray(data)) {
                $tensorArray = tensorflowlib_1.default.tensor1d(data);
            }
            else {
                $tensorArray = tensorflowlib_1.default.tensor2d(data);
            }
        }
        else if (data instanceof frame_1.default || data instanceof series_1.default) {
            $tensorArray = data.tensor;
        }
        else if (data instanceof tensorflowlib_1.default.Tensor) {
            $tensorArray = data;
        }
        else {
            throw new Error("ParamError: data must be one of Array, DataFrame or Series");
        }
        return $tensorArray;
    };
    /**
     * Fit a StandardScaler to the data.
     * @param data Array, Tensor, DataFrame or Series object
     * @returns StandardScaler
     * @example
     * const scaler = new StandardScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     */
    StandardScaler.prototype.fit = function (data) {
        var tensorArray = this.$getTensor(data);
        this.$std = tensorflowlib_1.default.moments(tensorArray, 0).variance.sqrt();
        this.$mean = tensorArray.mean(0);
        return this;
    };
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
    StandardScaler.prototype.transform = function (data) {
        var tensorArray = this.$getTensor(data);
        var outputData = tensorArray.sub(this.$mean).div(this.$std);
        if (Array.isArray(data)) {
            return outputData.arraySync();
        }
        else if (data instanceof series_1.default) {
            return new series_1.default(outputData, {
                index: data.index,
            });
        }
        else if (data instanceof frame_1.default) {
            return new frame_1.default(outputData, {
                index: data.index,
                columns: data.columns,
                config: __assign({}, data.config),
            });
        }
        else {
            return outputData;
        }
    };
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
    StandardScaler.prototype.fitTransform = function (data) {
        this.fit(data);
        return this.transform(data);
    };
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
    StandardScaler.prototype.inverseTransform = function (data) {
        var tensorArray = this.$getTensor(data);
        var outputData = tensorArray.mul(this.$std).add(this.$mean);
        if (Array.isArray(data)) {
            return outputData.arraySync();
        }
        else if (data instanceof series_1.default) {
            return new series_1.default(outputData, {
                index: data.index,
            });
        }
        else if (data instanceof frame_1.default) {
            return new frame_1.default(outputData, {
                index: data.index,
                columns: data.columns,
                config: __assign({}, data.config),
            });
        }
        else {
            return outputData;
        }
    };
    return StandardScaler;
}());
exports.default = StandardScaler;

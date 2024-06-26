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
var tensorflowlib_1 = __importDefault(require("../../shared/tensorflowlib"));
var series_1 = __importDefault(require("../../core/series"));
var utils_1 = __importDefault(require("../../shared/utils"));
var utils = new utils_1.default();
/**
 * Encode target labels with value between 0 and n_classes-1.
 */
var LabelEncoder = /** @class */ (function () {
    function LabelEncoder() {
        this.$labels = {};
    }
    LabelEncoder.prototype.$getData = function (data) {
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
     * Maps values to unique integer labels between 0 and n_classes-1.
     * @param data 1d array of labels, Tensor, or  Series to fit.
     * @example
     * ```
     * const encoder = new LabelEncoder()
     * encoder.fit(["a", "b", "c", "d"])
     * ```
    */
    LabelEncoder.prototype.fit = function (data) {
        var $data = this.$getData(data);
        var dataSet = Array.from(new Set($data));
        var tempObj = {};
        dataSet.forEach(function (value, index) {
            tempObj[value] = index;
        });
        this.$labels = tempObj;
        return this;
    };
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
    LabelEncoder.prototype.transform = function (data) {
        var _this = this;
        var $data = this.$getData(data);
        var encodedData = $data.map(function (value) {
            var label = _this.$labels[value] !== undefined ? _this.$labels[value] : -1;
            return label;
        });
        if (data instanceof Array) {
            return encodedData;
        }
        else if (data instanceof series_1.default) {
            return new series_1.default(encodedData);
        }
        else {
            return tensorflowlib_1.default.tensor1d(encodedData);
        }
    };
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
    LabelEncoder.prototype.fitTransform = function (data) {
        this.fit(data);
        return this.transform(data);
    };
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
    LabelEncoder.prototype.inverseTransform = function (data) {
        var _this = this;
        var $data = this.$getData(data);
        var tempData = $data.map(function (value) {
            return Object.keys(_this.$labels).find(function (key) { return _this.$labels[key] === value; });
        });
        var decodedData = tempData.map(function (value) {
            if (isNaN(parseInt(value))) {
                return value;
            }
            else {
                return Number(value);
            }
        });
        if (data instanceof Array) {
            return decodedData;
        }
        else if (data instanceof series_1.default) {
            return new series_1.default(decodedData);
        }
        else {
            return tensorflowlib_1.default.tensor1d(decodedData);
        }
    };
    Object.defineProperty(LabelEncoder.prototype, "nClasses", {
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
        get: function () {
            return Object.keys(this.$labels).length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LabelEncoder.prototype, "classes", {
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
        get: function () {
            return this.$labels;
        },
        enumerable: false,
        configurable: true
    });
    return LabelEncoder;
}());
exports.default = LabelEncoder;

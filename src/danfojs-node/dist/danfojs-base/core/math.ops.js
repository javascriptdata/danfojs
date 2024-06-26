"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._genericMathOp = void 0;
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
var series_1 = __importDefault(require("./series"));
var utils_1 = __importDefault(require("../shared/utils"));
var utils = new utils_1.default();
/**
 * Generic function for performing math operations on a series
 * @param object
 *
 * ndframe ==> The current Series
 *
 * other ==> The Series or number to perform math operation with
 *
 * operation ==> The type of operation to perform
*/
function _genericMathOp(_a) {
    var ndFrame = _a.ndFrame, other = _a.other, operation = _a.operation;
    if (typeof other === 'number') {
        //broadcast operation
        var newData = void 0;
        switch (operation) {
            case 'add':
                newData = ndFrame.values.map((function (ele) { return ele + other; }));
                return newData;
            case 'sub':
                newData = ndFrame.values.map((function (ele) { return ele - other; }));
                return newData;
            case 'mul':
                newData = ndFrame.values.map((function (ele) { return ele * other; }));
                return newData;
            case 'div':
                newData = ndFrame.values.map((function (ele) { return ele / other; }));
                return newData;
            case 'mod':
                newData = ndFrame.values.map((function (ele) { return ele % other; }));
                return newData;
            case 'pow':
                newData = ndFrame.values.map((function (ele) { return Math.pow(ele, other); }));
                return newData;
            case 'minimum':
                newData = ndFrame.values.map((function (ele) { return Math.min(ele, other); }));
                return newData;
            case 'maximum':
                newData = ndFrame.values.map((function (ele) { return Math.max(ele, other); }));
                return newData;
            default:
                throw new Error(operation + " is not implemented");
        }
    }
    else if (other instanceof series_1.default) {
        utils.checkSeriesOpCompactibility({ firstSeries: ndFrame, secondSeries: other, operation: operation });
        var newData = void 0;
        switch (operation) {
            case 'add':
                newData = ndFrame.values.map(function (ele, index) { return ele + other.values[index]; });
                return newData;
            case 'sub':
                newData = ndFrame.values.map(function (ele, index) { return ele - other.values[index]; });
                return newData;
            case 'mul':
                newData = ndFrame.values.map(function (ele, index) { return ele * other.values[index]; });
                return newData;
            case 'div':
                newData = ndFrame.values.map(function (ele, index) { return ele / other.values[index]; });
                return newData;
            case 'mod':
                newData = ndFrame.values.map(function (ele, index) { return ele % other.values[index]; });
                return newData;
            case 'pow':
                newData = ndFrame.values.map(function (ele, index) { return Math.pow(ele, other.values[index]); });
                return newData;
            case 'minimum':
                newData = ndFrame.values.map(function (ele, index) { return Math.min(ele, other.values[index]); });
                return newData;
            case 'maximum':
                newData = ndFrame.values.map(function (ele, index) { return Math.max(ele, other.values[index]); });
                return newData;
            default:
                throw new Error(operation + " is not implemented");
        }
    }
    else if (Array.isArray(other)) {
        if (other.length !== ndFrame.values.length) {
            throw new Error("ParamError: Length of array must be equal to length of Series");
        }
        var newData = void 0;
        switch (operation) {
            case 'add':
                newData = ndFrame.values.map(function (ele, index) { return ele + other[index]; });
                return newData;
            case 'sub':
                newData = ndFrame.values.map(function (ele, index) { return ele - other[index]; });
                return newData;
            case 'mul':
                newData = ndFrame.values.map(function (ele, index) { return ele * other[index]; });
                return newData;
            case 'div':
                newData = ndFrame.values.map(function (ele, index) { return ele / other[index]; });
                return newData;
            case 'mod':
                newData = ndFrame.values.map(function (ele, index) { return ele % other[index]; });
                return newData;
            case 'pow':
                newData = ndFrame.values.map(function (ele, index) { return Math.pow(ele, other[index]); });
                return newData;
            case 'minimum':
                newData = ndFrame.values.map(function (ele, index) { return Math.min(ele, other[index]); });
                return newData;
            case 'maximum':
                newData = ndFrame.values.map(function (ele, index) { return Math.max(ele, other[index]); });
                return newData;
        }
    }
    else {
        throw new Error("ParamError: value for other not supported. It must be either a scalar, Array or Series");
    }
}
exports._genericMathOp = _genericMathOp;

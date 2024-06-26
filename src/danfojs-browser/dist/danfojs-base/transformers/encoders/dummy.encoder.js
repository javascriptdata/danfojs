"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var frame_1 = __importDefault(require("../../core/frame"));
var series_1 = __importDefault(require("../../core/series"));
var utils_1 = __importDefault(require("../../shared/utils"));
var utils = new utils_1.default();
/**
 * Generate one-hot encoding for categorical columns in an Array, Series or Dataframe.
 * @param data Series or Dataframe
 * @param columns Columns to encode
 * @param prefix Prefix for the new columns
 * @param prefixSeparator Separator for the prefix and the column name
 * @returns Encoded Dataframe
 * @example
 * import { DataFrame, DummyEncoder }from 'danfojs';
 * const df = new DataFrame([[1,2,3], [4,5,6]], { columns: ['a', 'b', 'c'] });
 * const df2 = new DummyEncoder({data: df, columns: ['a', 'b'], prefix: 'enc', prefixSeparator: '#'}).encode();
 * df2.print();
 */
function dummyEncode(data, options) {
    var _a = __assign({ columns: null, prefix: null, prefixSeparator: "_" }, options), columns = _a.columns, prefix = _a.prefix, prefixSeparator = _a.prefixSeparator;
    if (!data) {
        throw new Error('ParamError: data must be one of Array, Series or DataFrame');
    }
    if (data instanceof series_1.default || data instanceof frame_1.default) {
        if (!columns) {
            var colsWithStringDtype_1 = [];
            data.dtypes.forEach(function (dtype, index) {
                if (dtype === "string") {
                    colsWithStringDtype_1.push(data.columns[index]);
                }
            });
            columns = colsWithStringDtype_1;
        }
    }
    else {
        throw new Error('ParamError: data must be one of Array, Series or DataFrame');
    }
    if (typeof columns === "string") {
        columns = [columns];
        if (Array.isArray(prefix) && prefix.length === 1) {
            prefix = prefix;
        }
        else if (typeof prefix === "string") {
            prefix = [prefix];
        }
        else {
            throw new Error('ParamError: prefix must be a string, or an array of same length as columns');
        }
        if (Array.isArray(prefixSeparator) && prefixSeparator.length === 1) {
            prefixSeparator = prefixSeparator;
        }
        else if (typeof prefixSeparator === "string") {
            prefixSeparator = [prefixSeparator];
        }
        else {
            throw new Error('ParamError: prefix must be a string, or an array of same length as columns');
        }
    }
    else if (Array.isArray(columns)) {
        if (prefix) {
            if (Array.isArray(prefix) && prefix.length !== columns.length) {
                throw new Error("ParamError: prefix and data array must be of the same length. If you need to use the same prefix, then pass a string param instead. e.g {prefix: \"" + prefix + "\"}");
            }
            if (typeof prefix === "string") {
                prefix = columns.map(function (_) { return prefix; });
            }
        }
        if (prefixSeparator) {
            if (Array.isArray(prefixSeparator) && prefixSeparator.length !== columns.length) {
                throw new Error("ParamError: prefixSeparator and data array must be of the same length. If you need to use the same prefix separator, then pass a string param instead. e.g {prefixSeparator: \"" + prefixSeparator + "\"}");
            }
            if (typeof prefixSeparator === "string") {
                prefixSeparator = columns.map(function (_) { return prefixSeparator; });
            }
        }
    }
    else {
        throw new Error('ParamError: columns must be a string or an array of strings');
    }
    if (data instanceof series_1.default) {
        var colData = data.values;
        var newColumnNames = [];
        var uniqueValues = Array.from(new Set(colData));
        var oneHotArr = utils.zeros(colData.length, uniqueValues.length);
        for (var i = 0; i < colData.length; i++) {
            var index = uniqueValues.indexOf(colData[i]);
            oneHotArr[i][index] = 1;
        }
        for (var i = 0; i < uniqueValues.length; i++) {
            var prefixToAdd = prefix ? prefix[0] : i;
            newColumnNames.push("" + prefixToAdd + prefixSeparator[0] + uniqueValues[i]);
        }
        return new frame_1.default(oneHotArr, { columns: newColumnNames });
    }
    else {
        var dfWithSelectedColumnsDropped = data.drop({ columns: columns });
        var newData = dfWithSelectedColumnsDropped === null || dfWithSelectedColumnsDropped === void 0 ? void 0 : dfWithSelectedColumnsDropped.values;
        var newColumnNames = dfWithSelectedColumnsDropped === null || dfWithSelectedColumnsDropped === void 0 ? void 0 : dfWithSelectedColumnsDropped.columns;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var colData = data.column(column).values;
            var uniqueValues = Array.from(new Set(colData));
            var oneHotArr = utils.zeros(colData.length, uniqueValues.length);
            for (var j = 0; j < colData.length; j++) {
                var index = uniqueValues.indexOf(colData[j]);
                oneHotArr[j][index] = 1;
                var prefixToAdd = prefix ? prefix[i] : column;
                var newColName = "" + prefixToAdd + prefixSeparator[i] + colData[j];
                if (!newColumnNames.includes(newColName)) {
                    newColumnNames.push(newColName);
                }
            }
            for (var k = 0; k < newData.length; k++) {
                newData[k] = __spreadArray(__spreadArray([], newData[k], true), oneHotArr[k], true);
            }
        }
        return new frame_1.default(newData, { columns: newColumnNames });
    }
}
exports.default = dummyEncode;

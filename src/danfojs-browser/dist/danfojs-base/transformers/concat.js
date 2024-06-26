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
var series_1 = __importDefault(require("../core/series"));
var frame_1 = __importDefault(require("../core/frame"));
/**
 *
 * @param dfList Array<DataFrame | Series>
 * @param axis number
 * @returns DataFrame
 */
function processColumn(dfList, axis) {
    var allDf = {};
    var dublicateColumns = {};
    var maxLen = 0;
    for (var i = 0; i < dfList.length; i++) {
        var df = dfList[i];
        var columnData = void 0;
        if (df instanceof frame_1.default) {
            columnData = df.getColumnData;
        }
        else {
            columnData = [df.values];
        }
        var columns = df.columns;
        for (var j = 0; j < columns.length; j++) {
            var column = columns[j];
            var colData = columnData[j];
            if (colData.length > maxLen) {
                maxLen = colData.length;
            }
            if (!(column in allDf)) {
                allDf[column] = colData;
                dublicateColumns[column] = 0;
            }
            else {
                dublicateColumns[column] += 1;
                column += dublicateColumns[column];
                allDf[column] = colData;
            }
        }
    }
    Object.keys(allDf).forEach(function (value) {
        var _a;
        var colLength = allDf[value].length;
        if (colLength < maxLen) {
            var residualLen = maxLen - colLength;
            var nanList = new Array(residualLen).fill(NaN);
            (_a = allDf[value]).push.apply(_a, nanList);
        }
    });
    return new frame_1.default(allDf);
}
/**
 * Concat data along rows
 * @param dfList Array<DataFrame | Series>
 * @param axis  Array<DataFrame | Series>
 * @returns DataFrame
 */
function processRow(dfList, axis) {
    var allDf = {};
    var maxLen = 0;
    var _loop_1 = function (i) {
        var _a, _b;
        var df = dfList[i];
        var columns = df.columns;
        var columnData = void 0;
        if (df instanceof frame_1.default) {
            columnData = df.getColumnData;
        }
        else {
            columnData = [df.values];
        }
        if (i === 0) {
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                var colData = columnData[j];
                allDf[column] = colData;
            }
        }
        else {
            var nonColumn = Object.keys(allDf).filter(function (key) {
                return !columns.includes(key);
            });
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                var colData = columnData[j];
                if (Object.keys(allDf).includes(column)) {
                    (_a = allDf[column]).push.apply(_a, colData);
                }
                else {
                    var residualArray = new Array(maxLen).fill(NaN);
                    residualArray.push.apply(residualArray, colData);
                    allDf[column] = residualArray;
                }
            }
            if (nonColumn.length > 0) {
                var currentDfLen = columnData[0].length;
                for (var j = 0; j < nonColumn.length; j++) {
                    var column = nonColumn[j];
                    var residualArray = new Array(currentDfLen).fill(NaN);
                    (_b = allDf[column]).push.apply(_b, residualArray);
                }
            }
        }
        maxLen += columnData[0].length;
    };
    for (var i = 0; i < dfList.length; i++) {
        _loop_1(i);
    }
    if (Object.keys(allDf).length === 1) {
        return new series_1.default(Object.values(allDf)[0]);
    }
    return new frame_1.default(allDf);
}
/**
* Concatenate pandas objects along a particular axis.
* @param object
* dfList: Array of DataFrame or Series
* axis: axis of concatenation 1 or 0
* @returns {DataFrame}
* @example
* concat({dfList: [df1, df2, df3], axis: 1})
*/
function concat(_a) {
    var dfList = _a.dfList, axis = _a.axis;
    if (axis === 1) {
        return processColumn(dfList, axis);
    }
    return processRow(dfList, 0);
}
exports.default = concat;

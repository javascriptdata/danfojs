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
var frame_1 = __importDefault(require("../core/frame"));
var utils_1 = __importDefault(require("../shared/utils"));
var utils = new utils_1.default();
var Merge = /** @class */ (function () {
    function Merge(_a) {
        var left = _a.left, right = _a.right, on = _a.on, how = _a.how;
        this.leftColIndex = [];
        this.rightColIndex = [];
        this.left = left;
        this.right = right;
        this.on = on;
        this.how = how;
        //Obtain the column index of the column will
        //want to merge on for both left and right dataframe
        for (var i = 0; i < this.on.length; i++) {
            var key = this.on[i];
            if (this.left.columns.includes(key) && this.right.columns.includes(key)) {
                var leftIndex = this.left.columns.indexOf(key);
                var rightIndex = this.right.columns.indexOf(key);
                this.leftColIndex.push(leftIndex);
                this.rightColIndex.push(rightIndex);
            }
        }
    }
    /**
     * Generate key combination base on the columns we want to merge on
     * e.g  df = {
     *  key1: ["KO", "K0", "K3", "K4"],
     *  Key2: ["K1", "K1", "K3", "K5"],
     *  A: [1,2,3,4]
     *  B: [3,4,5,6]
     * }
     * keycomb = generateKeyCombination(df.values, [0,1])
     * This should output
     * {
     *  'k0_k1': {
     *      filters: [[1,3], [2,4]], # the value of other columns in thesame row with the combination keys
     *      combValues: ["KO", "k1"] # the combination key from column Key1 (index 2) and key2 (index 1)
     *  },
     *  'K3_K3 : {
     *      filters: [[3,5]],
     *      combValues: ['K3', 'k3']
     *  },
     *  'k4_k5' : {
     *      filters: [[4,6]]
     *      combValues: ['K4', 'K5']
     *  }
     * }
     * This key combination will be generated for both left and right dataframe
     * @param values
     * @param colIndex
     */
    Merge.prototype.generateKeyCombination = function (values, colIndex) {
        var colKeyComb = {};
        for (var i = 0; i < values.length; i++) {
            var rowValues = values[i];
            var rowKeyCombValues = [];
            for (var j = 0; j < colIndex.length; j++) {
                var index = colIndex[j];
                rowKeyCombValues.push(rowValues[index]);
            }
            var rowKeyComb = rowKeyCombValues.join('_');
            var otherValues = rowValues.filter(function (val, index) {
                return !colIndex.includes(index);
            });
            if (utils.keyInObject(colKeyComb, rowKeyComb)) {
                colKeyComb[rowKeyComb].filters.push(otherValues);
            }
            else {
                colKeyComb[rowKeyComb] = {
                    filters: [otherValues],
                    combValues: rowKeyCombValues
                };
            }
        }
        return colKeyComb;
    };
    /**
     * Generate columns for the newly generated merged DataFrame
     * e.g df = {
     *  key1: ["KO", "K0", "K3", "K4"],
     *  Key2: ["K1", "K1", "K3", "K5"],
     *  A: [1,2,3,4]
     *  B: [3,4,5,6]
     * }
     * df2 = {
     *  key1: ["KO", "K0", "K3", "K4"],
     *  Key2: ["K1", "K1", "K3", "K5"],
     *  A: [1,2,3,4]
     *  c: [3,4,5,6]
     * }
     * And both dataframe are to be merged on `key1` and `key2`
     * the newly generated column will be of the form
     * columns = ['key1', 'Key2', 'A', 'A_1', 'B', 'C']
     * Notice 'A_1' , this because both DataFrame as column A and 1 is the
     * number of duplicate of that column
     */
    Merge.prototype.createColumns = function () {
        var self = this;
        this.leftCol = self.left.columns.filter(function (_, index) {
            return !self.leftColIndex.includes(index);
        });
        this.rightCol = self.right.columns.filter(function (_, index) {
            return !self.rightColIndex.includes(index);
        });
        this.columns = __spreadArray([], this.on, true);
        var duplicateColumn = {};
        var tempColumn = __spreadArray([], this.leftCol, true);
        tempColumn.push.apply(tempColumn, this.rightCol);
        for (var i = 0; i < tempColumn.length; i++) {
            var col = tempColumn[i];
            if (utils.keyInObject(duplicateColumn, col)) {
                var columnName = col + "_" + duplicateColumn[col];
                this.columns.push(columnName);
                duplicateColumn[col] += 1;
            }
            else {
                this.columns.push(col);
                duplicateColumn[col] = 1;
            }
        }
    };
    /**
     * The basic methos perform the underneath operation of generating
     * the merge dataframe; using the combination keys generated from
     * bothe left and right DataFrame
     * e.g df = {
     *  key1: ["KO", "K0", "K3", "K4"],
     *  Key2: ["K1", "K1", "K3", "K5"],
     *  A: [1,2,3,4]
     *  B: [3,4,5,6]
     * }
     * df2 = {
     *  key1: ["KO", "K0", "K3", "K4"],
     *  Key2: ["K1", "K2", "K4", "K5"],
     *  A: [3,6,8,9]
     *  c: [2,4,6,8]
     * }
     * Running generatekeyCombination on both left and right data frame
     * we should have
     * leftKeyDict = {
     *  'k0_k1': {
     *      filters: [[1,3], [2,4]],
     *      combValues: ["KO", "k1"]
     *  },
     *  'K3_K3' : {
     *      filters: [[3,5]],
     *      combValues: ['K3', 'k3']
     *  },
     *  'k4_k5' : {
     *      filters: [[4,6]]
     *      combValues: ['K4', 'K5']
     *  }
     * }
     * rightKeyDict = {
     *  'k0_k1': {
     *      filters: [[3,2]],
     *      combValues: ["KO", "k1"]
     *  },
     *  'K0_K2': {
     *      filters: [[6,4]],
     *      combValues: ['K0', 'K2']
     *  },
     *  'K3_K4' : {
     *      filters: [[8,9]],
     *      combValues: ['K3', 'k4']
     *  },
     *  'k4_k5' : {
     *      filters: [[9,8]]
     *      combValues: ['K4', 'K5']
     *  }
     * }
     * The `keys` is generated base on the type of merge operation we want to
     * perform. If we assume we are performing `outer` merge (which is a set of the
     * key combination from both leftKeyDict and rightKeyDict) then Keys should be
     * this
     * keys = ['K0_K1', 'K3_K3', 'k4_k5', 'K0_K2', 'k3_k4']
     * The Keys, leftKeyDict and rightKeyDict are used to generated DataFrame data,
     * by looping through the Keys and checking if leftKeyDict and rightKeyDict as the
     * key if one of them does not the column in that row will be NaN
     * e.g Data for each row base on keys
     * COLUMNS = ['key1', 'Key2', 'A', 'B', 'A_1', 'C']
     * 'K0_K1':  ['K0',   'K1',   1,    3 ,   3,   2 ]
     * 'K0_K1':  ['K0',   'K1',   2,    4,   NaN, NaN]
     * 'K3_K3':  ['k3',   'K3',   3,    5,  NaN,  NaN]
     * 'K4_K5':  ['K4',   'K5',   4,    6,  9,    8]
     * 'k0_K2':  ['k0',   'K2'    NaN,  NaN, 6,   4]
     * 'k3_k4':  ['K3',   'K4',   NaN,  NaN, 8, 6]
     *
     * @param keys
     * @param leftKeyDict
     * @param rightKeyDict
     */
    Merge.prototype.basic = function (keys, leftKeyDict, rightKeyDict) {
        var _a, _b;
        var data = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (utils.keyInObject(leftKeyDict, key)) {
                var leftRows = leftKeyDict[key].filters;
                var leftCombValues = leftKeyDict[key].combValues;
                for (var lIndex = 0; lIndex < leftRows.length; lIndex++) {
                    var leftRow = leftRows[lIndex];
                    if (utils.keyInObject(rightKeyDict, key)) {
                        var rightRows = rightKeyDict[key].filters;
                        for (var rIndex = 0; rIndex < rightRows.length; rIndex++) {
                            var rightRow = rightRows[rIndex];
                            var combineData = leftCombValues.slice(0);
                            combineData.push.apply(combineData, leftRow);
                            combineData.push.apply(combineData, rightRow);
                            data.push(combineData);
                        }
                    }
                    else {
                        var nanArray = Array((_a = this.rightCol) === null || _a === void 0 ? void 0 : _a.length).fill(NaN);
                        var combineData = leftCombValues.slice(0);
                        combineData.push.apply(combineData, leftRow);
                        combineData.push.apply(combineData, nanArray);
                        data.push(combineData);
                    }
                }
            }
            else {
                var rightRows = rightKeyDict[key].filters;
                var rightCombValues = rightKeyDict[key].combValues;
                for (var i_1 = 0; i_1 < rightRows.length; i_1++) {
                    var rightRow = rightRows[i_1];
                    var nanArray = Array((_b = this.leftCol) === null || _b === void 0 ? void 0 : _b.length).fill(NaN);
                    var combineData = rightCombValues.slice(0);
                    combineData.push.apply(combineData, nanArray);
                    combineData.push.apply(combineData, rightRow);
                    data.push(combineData);
                }
            }
        }
        return data;
    };
    /**
     * Generate outer key from leftKeyDict and rightKeyDict
     * The Key pass into basic method is the union of
     * leftKeyDict and rightKeyDict
     * @param leftKeyDict
     * @param rightKeyDict
     */
    Merge.prototype.outer = function (leftKeyDict, rightKeyDict) {
        var keys = Object.keys(leftKeyDict);
        keys.push.apply(keys, Object.keys(rightKeyDict));
        var UniqueKeys = Array.from(new Set(keys));
        var data = this.basic(UniqueKeys, leftKeyDict, rightKeyDict);
        return data;
    };
    /**
     * Generate Key for basic method,
     * the key geneerated is the intersection of
     * leftKeyDict and rightKeyDict
     * @param leftKeyDict
     * @param rightKeyDict
     */
    Merge.prototype.inner = function (leftKeyDict, rightKeyDict) {
        var leftKey = Object.keys(leftKeyDict);
        var rightKey = Object.keys(rightKeyDict);
        var keys = leftKey.filter(function (val) { return rightKey.includes(val); });
        var data = this.basic(keys, leftKeyDict, rightKeyDict);
        return data;
    };
    /**
     * The key is the leftKeyDict
     * @param leftKeyDict
     * @param rightKeyDict
     */
    Merge.prototype.leftMerge = function (leftKeyDict, rightKeyDict) {
        var keys = Object.keys(leftKeyDict);
        var data = this.basic(keys, leftKeyDict, rightKeyDict);
        return data;
    };
    /**
     * The key is the rightKeyDict
     * @param leftKeyDict
     * @param rightKeyDict
     */
    Merge.prototype.rightMerge = function (leftKeyDict, rightKeyDict) {
        var keys = Object.keys(rightKeyDict);
        var data = this.basic(keys, leftKeyDict, rightKeyDict);
        return data;
    };
    /**
     * Perform the merge operation
     * 1) Obtain both left and right dataframe values
     * 2) Generate the leftkeyDict and rightKeyDict
     * 3) Generate new merge columns
     * 4) check how merge is to be done and apply the
     * right methods
     */
    Merge.prototype.operation = function () {
        var leftValues = this.left.values;
        var rightValues = this.right.values;
        var leftKeyDict = this.generateKeyCombination(leftValues, this.leftColIndex);
        var rightKeyDict = this.generateKeyCombination(rightValues, this.rightColIndex);
        this.createColumns();
        var data = [];
        switch (this.how) {
            case "outer":
                data = this.outer(leftKeyDict, rightKeyDict);
                break;
            case "inner":
                data = this.inner(leftKeyDict, rightKeyDict);
                break;
            case "left":
                data = this.leftMerge(leftKeyDict, rightKeyDict);
                break;
            case "right":
                data = this.rightMerge(leftKeyDict, rightKeyDict);
                break;
        }
        var columns = this.columns;
        return new frame_1.default(data, { columns: __spreadArray([], columns, true) });
    };
    return Merge;
}());
/**
 * Perform merge operation between two DataFrame
 * @param params : {
 * left: DataFrame
 * right: DataFrame
 * on: Array<string>
 * how: "outer" | "inner" | "left" | "right"
 * }
 */
function merge(params) {
    var mergeClass = new Merge(params);
    return mergeClass.operation();
}
exports.default = merge;

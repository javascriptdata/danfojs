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
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErrorOnWrongColName = exports.checkIfColsExist = void 0;
var checkIfColsExist = function (ndframe, cols) {
    cols.forEach(function (col) {
        if (!ndframe.columns.includes(col)) {
            throw Error("Column Error: " + col + " not found in columns. Columns should be one of [ " + ndframe.columns + " ]");
        }
    });
    return cols;
};
exports.checkIfColsExist = checkIfColsExist;
var throwErrorOnWrongColName = function (ndframe, colName) {
    if (!ndframe.columns.includes(colName)) {
        throw Error("ParamError: specified column " + colName + " not found in columns");
    }
};
exports.throwErrorOnWrongColName = throwErrorOnWrongColName;

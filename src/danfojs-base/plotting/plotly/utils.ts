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

export const checkIfColsExist = (ndframe: DataFrame, cols: string[]) => {
    cols.forEach((col) => {
        if (!ndframe.columns.includes(col)) {
            throw Error(`Column Error: ${col} not found in columns. Columns should be one of [ ${ndframe.columns} ]`);
        }
    });
    return cols;
}

export const throwErrorOnWrongColName = (ndframe: DataFrame, colName: string): void => {
    if (!ndframe.columns.includes(colName)) {
        throw Error(`ParamError: specified column ${colName} not found in columns`);
    }
}

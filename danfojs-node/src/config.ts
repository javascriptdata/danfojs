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
import { baseConfig } from './defaults'

type ConfigsConstructorType = {
    tableWidth: number;
    tableTruncate: number;
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;
}

/**
 * Package wide configuration class
 */
class Configs {
    tableWidth: number;
    tableTruncate: number;
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;

    constructor({
        tableWidth,
        tableTruncate,
        tableMaxRow,
        tableMaxColInConsole,
        dtypeTestLim,
    }: ConfigsConstructorType) {
        this.tableWidth = tableWidth || 17; //The width of each column printed in console
        this.tableTruncate = tableTruncate || 16; //The maximum number of string before text is truncated in console
        this.tableMaxRow = tableMaxRow || 10; // The maximum number of rows to display in console
        this.tableMaxColInConsole = tableMaxColInConsole || 21; // The maximum number of columns to display in console
        this.dtypeTestLim = dtypeTestLim || 7; // The number of rows to use when inferring data type
    }

    set setTableWidth(val: number) {
        this.tableWidth = val;
    }

    get getTableWidth(): number {
        return this.tableWidth;
    }

    set setTableMaxColInConsole(val: number) {
        this.tableMaxColInConsole = val;
    }

    get getTableMaxColInConsole(): number {
        return this.tableMaxColInConsole;
    }

    set setMaxRow(val: number) {
        this.tableMaxRow = val;
    }

    get getMaxRow(): number {
        return this.tableMaxRow;
    }

    get getTableTruncate(): number {
        return this.tableTruncate;
    }

    set setTableTruncate(val: number) {
        this.tableTruncate = val;
    }

    get getDtypeTestLim(): number {
        return this.dtypeTestLim;
    }

    set setDtypeTestLim(val: number) {
        this.dtypeTestLim = val;
    }
}

export default new Configs(baseConfig);

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
import { ConfigsType } from './types'

/**
 * Package wide configuration class
 */
export default class Configs {
    tableWidth: number;
    tableTruncate: number;
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;
    lowMemoryMode: boolean;

    constructor({
        tableWidth,
        tableTruncate,
        tableMaxRow,
        tableMaxColInConsole,
        dtypeTestLim,
        lowMemoryMode
    }: ConfigsType) {
        this.tableWidth = tableWidth || 17; //The width of each column printed in console
        this.tableTruncate = tableTruncate || 16; //The maximum number of string before text is truncated in console
        this.tableMaxRow = tableMaxRow || 10; // The maximum number of rows to display in console
        this.tableMaxColInConsole = tableMaxColInConsole || 21; // The maximum number of columns to display in console
        this.dtypeTestLim = dtypeTestLim || 10; // The number of rows to use when inferring data type
        this.lowMemoryMode = lowMemoryMode // Whether to use minimal memory or not.
    }

    setTableWidth(val: number) {
        this.tableWidth = val;
    }

    get getTableWidth(): number {
        return this.tableWidth;
    }

    setTableMaxColInConsole(val: number) {
        this.tableMaxColInConsole = val;
    }

    get getTableMaxColInConsole(): number {
        return this.tableMaxColInConsole;
    }

    setMaxRow(val: number) {
        this.tableMaxRow = val;
    }

    get getMaxRow(): number {
        return this.tableMaxRow;
    }

    get getTableTruncate(): number {
        return this.tableTruncate;
    }

    setTableTruncate(val: number) {
        this.tableTruncate = val;
    }

    get getDtypeTestLim(): number {
        return this.dtypeTestLim;
    }

    setDtypeTestLim(val: number) {
        this.dtypeTestLim = val;
    }

    get isLowMemoryMode(): boolean {
        return this.lowMemoryMode;
    }

    setIsLowMemoryMode(val: boolean) {
        this.lowMemoryMode = val;
    }
}


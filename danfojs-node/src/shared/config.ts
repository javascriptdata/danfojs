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
import { BaseUserConfig } from 'table';
import { ConfigsType } from './types'

/**
 * Package wide configuration class
 */
export default class Configs {
    tableDisplayConfig: BaseUserConfig
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;
    lowMemoryMode: boolean;
    useTfjsMathFunctions: boolean;

    constructor(options: ConfigsType) {
        const {
            tableDisplayConfig,
            tableMaxRow,
            tableMaxColInConsole,
            dtypeTestLim,
            lowMemoryMode,
            useTfjsMathFunctions,
        } = options
        this.tableDisplayConfig = tableDisplayConfig || {}
        this.tableMaxRow = tableMaxRow || 10; // The maximum number of rows to display in console
        this.tableMaxColInConsole = tableMaxColInConsole || 21; // The maximum number of columns to display in console
        this.dtypeTestLim = dtypeTestLim || 10; // The number of rows to use when inferring data type
        this.lowMemoryMode = lowMemoryMode || false // Whether to use minimal memory or not.
        this.useTfjsMathFunctions = useTfjsMathFunctions || false //whether to use tfjs lib for performing math operations
    }

    setTableDisplayConfig(config: BaseUserConfig) {
        this.tableDisplayConfig = config;
    }

    get getTableDisplayConfig(): BaseUserConfig {
        return this.tableDisplayConfig;
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

    get toUseTfjsMathFunctions(): boolean {
        return this.useTfjsMathFunctions;
    }

    setUseTfjsMathFunctions(val: boolean) {
        this.useTfjsMathFunctions = val;
    }
}

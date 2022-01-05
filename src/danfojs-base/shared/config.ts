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
import { BaseUserConfig, TableUserConfig } from 'table';
import { ConfigsType } from './types'

/**
 * Package wide configuration class
 */
export default class Configs {
    tableDisplayConfig: BaseUserConfig & TableUserConfig
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;
    lowMemoryMode: boolean;

    constructor(options: ConfigsType) {
        const {
            tableDisplayConfig,
            tableMaxRow,
            tableMaxColInConsole,
            dtypeTestLim,
            lowMemoryMode,
        } = {
            tableDisplayConfig: {},
            tableMaxRow: 10,
            tableMaxColInConsole: 10,
            dtypeTestLim: 10,
            lowMemoryMode: false,
            ...options
        }
        this.tableDisplayConfig = tableDisplayConfig
        this.tableMaxRow = tableMaxRow  // The maximum number of rows to display in console
        this.tableMaxColInConsole = tableMaxColInConsole  // The maximum number of columns to display in console
        this.dtypeTestLim = dtypeTestLim  // The number of rows to use when inferring data type
        this.lowMemoryMode = lowMemoryMode  // Whether to use minimal memory or not.
    }

    setTableDisplayConfig(config: BaseUserConfig & TableUserConfig) {
        this.tableDisplayConfig = config;
    }

    get getTableDisplayConfig(): BaseUserConfig & TableUserConfig {
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
}


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
import { BaseUserConfig, TableUserConfig } from 'table';
import { ConfigsType } from './types';
/**
 * Package wide configuration class
 */
export default class Configs {
    tableDisplayConfig: BaseUserConfig & TableUserConfig;
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;
    lowMemoryMode: boolean;
    constructor(options: ConfigsType);
    setTableDisplayConfig(config: BaseUserConfig & TableUserConfig): void;
    get getTableDisplayConfig(): BaseUserConfig & TableUserConfig;
    setTableMaxColInConsole(val: number): void;
    get getTableMaxColInConsole(): number;
    setMaxRow(val: number): void;
    get getMaxRow(): number;
    get getDtypeTestLim(): number;
    setDtypeTestLim(val: number): void;
    get isLowMemoryMode(): boolean;
    setIsLowMemoryMode(val: boolean): void;
}

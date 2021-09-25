"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
class Configs {
  constructor(options) {
    const {
      tableDisplayConfig,
      tableMaxRow,
      tableMaxColInConsole,
      dtypeTestLim,
      lowMemoryMode
    } = {
      tableDisplayConfig: {},
      tableMaxRow: 10,
      tableMaxColInConsole: 21,
      dtypeTestLim: 10,
      lowMemoryMode: false,
      ...options
    };
    this.tableDisplayConfig = tableDisplayConfig;
    this.tableMaxRow = tableMaxRow;
    this.tableMaxColInConsole = tableMaxColInConsole;
    this.dtypeTestLim = dtypeTestLim;
    this.lowMemoryMode = lowMemoryMode;
  }

  setTableDisplayConfig(config) {
    this.tableDisplayConfig = config;
  }

  get getTableDisplayConfig() {
    return this.tableDisplayConfig;
  }

  setTableMaxColInConsole(val) {
    this.tableMaxColInConsole = val;
  }

  get getTableMaxColInConsole() {
    return this.tableMaxColInConsole;
  }

  setMaxRow(val) {
    this.tableMaxRow = val;
  }

  get getMaxRow() {
    return this.tableMaxRow;
  }

  get getDtypeTestLim() {
    return this.dtypeTestLim;
  }

  setDtypeTestLim(val) {
    this.dtypeTestLim = val;
  }

  get isLowMemoryMode() {
    return this.lowMemoryMode;
  }

  setIsLowMemoryMode(val) {
    this.lowMemoryMode = val;
  }

}

exports.default = Configs;
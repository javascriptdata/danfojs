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
exports.DATA_TYPES = exports.BASE_CONFIG = void 0;
/**
 * Default config object
 */
exports.BASE_CONFIG = {
    tableMaxRow: 10,
    tableMaxColInConsole: 10,
    dtypeTestLim: 20,
    lowMemoryMode: false,
};
exports.DATA_TYPES = ["float32", "int32", "string", "boolean", "datetime", 'undefined'];

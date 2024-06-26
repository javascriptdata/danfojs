"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toExcelBrowser = exports.readExcelBrowser = exports.toJSONBrowser = exports.readJSONBrowser = exports.toCSVBrowser = exports.streamCSVBrowser = exports.readCSVBrowser = void 0;
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
var io_csv_1 = require("./io.csv");
Object.defineProperty(exports, "readCSVBrowser", { enumerable: true, get: function () { return io_csv_1.$readCSV; } });
Object.defineProperty(exports, "streamCSVBrowser", { enumerable: true, get: function () { return io_csv_1.$streamCSV; } });
Object.defineProperty(exports, "toCSVBrowser", { enumerable: true, get: function () { return io_csv_1.$toCSV; } });
var io_json_1 = require("./io.json");
Object.defineProperty(exports, "readJSONBrowser", { enumerable: true, get: function () { return io_json_1.$readJSON; } });
Object.defineProperty(exports, "toJSONBrowser", { enumerable: true, get: function () { return io_json_1.$toJSON; } });
var io_excel_1 = require("./io.excel");
Object.defineProperty(exports, "readExcelBrowser", { enumerable: true, get: function () { return io_excel_1.$readExcel; } });
Object.defineProperty(exports, "toExcelBrowser", { enumerable: true, get: function () { return io_excel_1.$toExcel; } });

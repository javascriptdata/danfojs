"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var frame_1 = __importDefault(require("../../../danfojs-base/core/frame"));
var node_1 = require("../../../danfojs-base/io/node");
/**
 * Two-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indices are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.
 */
var DataFrame = /** @class */ (function (_super) {
    __extends(DataFrame, _super);
    function DataFrame(data, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, data, options) || this;
    }
    DataFrame.prototype.toCSV = function (options) {
        return (0, node_1.toCSVNode)(this, options);
    };
    DataFrame.prototype.toJSON = function (options) {
        return (0, node_1.toJSONNode)(this, options);
    };
    /**
     * Converts a DataFrame to Excel file format.
     * @param options Configuration object. Supported options:
     * - `sheetName`: The sheet name to be written to. Defaults to `'Sheet1'`.
     * - `filePath`: The filePath to be written to. Defaults to `'./output.xlsx'`. Option is only available in NodeJs
     * - `fileName`: The fileName to be written to. Defaults to `'output.xlsx'`. Option is only available in Browser
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toExcel({ filePath: './output.xlsx' }) // writes to local file system as output.xlsx in NodeJS
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toExcel({ fileName: 'output.xlsx', download: true }) // downloads file browser
     * ```
     *
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toExcel({ sheetName: 'Sheet2' }) // writes to Sheet2 in Excel
     * ```
     *
     */
    DataFrame.prototype.toExcel = function (options) {
        return (0, node_1.toExcelNode)(this, options);
    };
    return DataFrame;
}(frame_1.default));
exports.default = DataFrame;

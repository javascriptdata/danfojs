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
import BaseSeries from "../../../danfojs-base/core/series";
import { BaseDataOptionType, SeriesInterface, CsvOutputOptionsNode, JsonOutputOptionsNode, ExcelOutputOptionsNode } from "../../../danfojs-base/shared/types";
declare type ExtendedSeriesInterface = SeriesInterface & {
    toCSV(options?: CsvOutputOptionsNode): string | void;
    toJSON(options?: JsonOutputOptionsNode): object | void;
    toExcel(options?: ExcelOutputOptionsNode): void;
};
/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values – they need not be the same length.
 * @param data 1D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string index for subseting array. If not specified, indices are auto generated.
 * @param options.columns Column name. This is like the name of the Series. If not specified, column name is set to 0.
 * @param options.dtypes Data types of the Series data. If not specified, dtypes is inferred.
 * @param options.config General configuration object for extending or setting Series behavior.
 */
export default class Series extends BaseSeries implements ExtendedSeriesInterface {
    [key: string]: any;
    constructor(data?: any, options?: BaseDataOptionType);
    /**
    * Converts a Series to CSV.
    * @param options Configuration object. Supports the following options:
    * - `filePath`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string. Option is only available in NodeJS.
    * - `fileName`: Name of the CSV file. Defaults to `data.csv`. Option is only available in Browser.
    * - `download`: If true, the CSV will be downloaded. Defaults to false. Option is only available in Browser.
    * - `header`: Boolean indicating whether to include a header row in the CSV file.
    * - `sep`: Character to be used as a separator in the CSV file.
    *
    * @example
    * ```
    * const df = new Series([1, 2, 3, 4])
    * const csv = df.toCSV()
    * ```
    *
    * @example
    * ```
    * const df = new Series([1, 2, 3, 4])
    * const csv = df.toCSV({ header: false })
    * ```
    *
    * @example
    * ```
    * const df = new Series([1, 2, 3, 4])
    * const csv = df.toCSV({ sep: ';' })
    * ```
    *
    * @example
    * ```
    * const df = new Series([1, 2, 3, 4])
    * df.toCSV({ filePath: './data.csv' }) //write to local file in NodeJS
    * ```
    */
    toCSV(options?: CsvOutputOptionsNode): string;
    /**
     * Converts a Series to JSON.
     * @param options Configuration object. Supported options:
     * - `filePath`: The file path to write the JSON to. If not specified, the JSON object is returned. Option is only available in NodeJS.
     * - `fileName`: The name of the JSON file. Defaults to `data.json`. Option is only available in Browser.
     * - `download`: If true, the JSON will be downloaded. Defaults to false. Option is only available in Browser.
     * - `format`: The format of the JSON. Supported values are `'column'` and `'row'`. Defaults to `'column'`.
     *
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * const json = df.toJSON()
     * ```
     *
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * const json = df.toJSON({ format: 'row' })
     * ```
     *
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * const json = df.toJSON({ format: "column" })
     * ```
     *
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * df.toJSON({ filePath: './data.json' }) // downloads to local file system as data.json in NodeJS
     * ```
     */
    toJSON(options?: JsonOutputOptionsNode): object;
    /**
     * Converts a Series to Excel file format.
     * @param options Configuration object. Supported options:
     * - `sheetName`: The sheet name to be written to. Defaults to `'Sheet1'`.
     * - `filePath`: The filePath to be written to. Defaults to `'./output.xlsx'`. Option is only available in NodeJs
     * - `fileName`: The fileName to be written to. Defaults to `'output.xlsx'`. Option is only available in Browser
     *
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * df.toExcel({ filePath: './output.xlsx' }) // writes to local file system as output.xlsx in NodeJS
     * ```
     *
     * @example
     * ```
     * const df = new Series([1, 2, 3, 4])
     * df.toExcel({ sheetName: 'Sheet2' }) // writes to Sheet2 in Excel
     * ```
     *
     */
    toExcel(options?: ExcelOutputOptionsNode): void;
}
export {};

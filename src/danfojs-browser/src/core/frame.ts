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
import { toCSV, toExcel, toJSON } from "../io";
import BaseDataFrame from "../../../danfojs-base/core/frame"
import { BaseDataOptionType } from "../../../danfojs-base/shared/types";
import { CsvOutputOptionsBrowser, ExcelOutputOptionsBrowser, JsonOutputOptionsBrowser } from "types";
import { PlotlyLib } from "../plotting";


/**
 * Two-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.      
 */
/* @ts-ignore */ //COMMENT OUT WHEN METHODS HAVE BEEN IMPLEMENTED
export default class DataFrame extends BaseDataFrame {
    [key: string]: any
    constructor(data?: any, options: BaseDataOptionType = {}) {
        super(data, options)
    }

    /**
     * Make plots of Series or DataFrame.
     * Uses the Plotly as backend, so supports Plotly's configuration parameters
     * @param divId Name of the div to show the plot
     * @returns Plotly class that expoese different plot type
    */
    plot(divId: string) {
        //TODO: Add support for check plot library to use
        // So we can support other plot library like d3, vega, etc
        const plt = new PlotlyLib(this, divId);
        return plt;
    }

    /**
     * Converts a DataFrame or Series to CSV. 
     * @param options Configuration object. Supports the following options:
     * - `filePath`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string.
     * - `header`: Boolean indicating whether to include a header row in the CSV file.
     * - `sep`: Character to be used as a separator in the CSV file.
     */
    toCSV(options?: CsvOutputOptionsBrowser): string
    toCSV(options?: CsvOutputOptionsBrowser): string | void {
        return toCSV(this, options);
    }

    /**
     * Converts a DataFrame or Series to JSON. 
     * @param options Configuration object. Supported options:
     * - `filePath`: The file path to write the JSON to. If not specified, the JSON object is returned.
     * - `format`: The format of the JSON. Defaults to `'column'`. E.g for using `column` format:
     * ```
     * [{ "a": 1, "b": 2, "c": 3, "d": 4 },
     *  { "a": 5, "b": 6, "c": 7, "d": 8 }]
     * ```
     * and `row` format:
     * ```
     * { "a": [1, 5, 9],
     *  "b": [2, 6, 10]
     * }
     * ```
     */
    toJSON(options?: JsonOutputOptionsBrowser): object
    toJSON(options?: JsonOutputOptionsBrowser): object | void {
        return toJSON(this, options);
    }


    /**
     * Converts a DataFrame or Series to Excel Sheet. 
     * @param options Configuration object. Supported options:
     * - `sheetName`: The sheet name to be written to. Defaults to `'Sheet1'`.
     * - `filePath`: The filePath to be written to. Defaults to `'./output.xlsx'`.
     */
    toExcel(options?: ExcelOutputOptionsBrowser): void {
        return toExcel(this, options);
    }
}
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
import Configs from "../shared/config";
import { NDframeInterface, NdframeInputDataType, AxisType, ArrayType1D, ArrayType2D } from '../shared/types';
/**
 * N-Dimension data structure. Stores multi-dimensional
 * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame.
 *
 * @param  Object
 *
 *  data:  1D or 2D Array, JSON, Tensor, Block of data.
 *
 *  index: Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 *
 *  columns: Array of column names. If not specified, column names are auto generated.
 *
 *  dtypes: Array of data types for each the column. If not specified, dtypes inferred.
 *
 *  config: General configuration object for NDframe
 *
 * @returns NDframe
 */
export default class NDframe implements NDframeInterface {
    $isSeries: boolean;
    protected $data: any;
    protected $dataIncolumnFormat: ArrayType1D | ArrayType2D;
    protected $index: Array<string | number>;
    protected $columns: string[];
    protected $dtypes: Array<string>;
    protected $config: Configs;
    constructor({ data, index, columns, dtypes, config, isSeries }: NdframeInputDataType);
    /**
     * Internal function to load array of data into NDFrame
     * @param data The array of data to load into NDFrame
     * @param index Array of numeric or string names for subsetting array.
     * @param columns Array of column names.
     * @param dtypes Array of data types for each the column.
    */
    private loadArrayIntoNdframe;
    /**
     * Internal function to format and load a Javascript object or object of arrays into NDFrame.
     * @param data Object or object of arrays.
     * @param type The type of the object. There are two recognized types:
     *
     * - type 1 object are in JSON format `[{a: 1, b: 2}, {a: 30, b: 20}]`.
     *
     * - type 2 object are of the form `{a: [1,2,3,4], b: [30,20, 30, 20}]}`
     * @param index Array of numeric or string names for subsetting array.
     * @param columns Array of column names.
     * @param dtypes Array of data types for each the column.
    */
    private loadObjectIntoNdframe;
    /**
     * Converts and returns the data in the NDframe as a Tensorflow.js Tensor.
    */
    get tensor(): any;
    /**
     * Returns the dtypes of the columns
    */
    get dtypes(): Array<string>;
    /**
     * Internal function to set the Dtypes of the NDFrame from an array. This function
     * performs the necessary checks.
    */
    $setDtypes(dtypes: Array<string> | undefined): void;
    /**
     * Returns the dimension of the data. Series have a dimension of 1,
     * while DataFrames have a dimension of 2.
    */
    get ndim(): number;
    /**
     * Returns the axis labels of the NDFrame.
    */
    get axis(): AxisType;
    /**
     * Returns the configuration object of the NDFrame.
    */
    get config(): Configs;
    /**
     * Internal function to set the configuration of the ndframe
    */
    $setConfig(config: Configs): void;
    /**
     * Returns the indices of the NDFrame
    */
    get index(): Array<string | number>;
    /**
     * Internal function to set the index of the NDFrame with the specified
     * array of indices. Performs all necessary checks to ensure that the
     * index is valid.
    */
    $setIndex(index: Array<string | number> | undefined): void;
    /**
     * Internal function to reset the index of the NDFrame using a range of indices.
    */
    $resetIndex(): void;
    /**
     * Returns the column names of the NDFrame
    */
    get columns(): string[];
    /**
     * Internal function to set the column names for the NDFrame. This function
     * performs a check to ensure that the column names are unique, and same length as the
     * number of columns in the data.
    */
    $setColumnNames(columns?: string[]): void;
    /**
     * Returns the shape of the NDFrame. Shape is determined by [row length, column length]
    */
    get shape(): Array<number>;
    /**
     * Returns the underlying data in Array format.
    */
    get values(): ArrayType1D | ArrayType2D;
    /**
     * Updates the internal $data property to the specified value
     * @param values An array of values to set
     * @param checkLength Whether to check the length of the new values and the existing row length
     * @param checkColumnLength Whether to check the length of the new values and the existing column length
     * */
    $setValues(values: ArrayType1D | ArrayType2D, checkLength?: boolean, checkColumnLength?: boolean): void;
    /**
      * Returns the underlying data in Array column format.
      * Similar to this.values, but in column format.
    */
    get getColumnData(): ArrayType1D | ArrayType2D;
    /**
     * Returns the size of the NDFrame object
     *
    */
    get size(): number;
    /**
     * Converts a DataFrame or Series to CSV.
     * @deprecated Use `toCSV` function directly instead.
    * @example
    * ```
    * import * as dfd from "danfojs"
    * const df = new dfd.DataFrame([[1, 2, 3], [4, 5, 6]])
    * const csv = dfd.toCSV(df)
    * ```
    * @example
    * ```
    * import { toCSV } from "danfojs-node"
    * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
    * toCSV(df, {
    *     filePath: "./data/sample.csv",
    *     header: true,
    *     sep: "+"
    *   })
     */
    toCSV(options?: any): string | void;
    /**
     * Converts a DataFrame or Series to JSON.
     * @deprecated Use `toJSON` function directly instead.
    * @example
    * ```
    * import * as dfd from "danfojs-node"
    * const df = new dfd.DataFrame([[1, 2, 3], [4, 5, 6]])
    * const json = dfd.toJSON(df)
    * ```
    * @example
    * ```
    * import { toJSON } from "danfojs-node"
    * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
    * toJSON(df, {
    *     filePath: "./data/sample.json",
    *     format: "row"
    *   })
    * ```
    */
    toJSON(options?: any): object | void;
    /**
     * Converts a DataFrame or Series to Excel.
     * @deprecated Use `toExcel` function directly instead.
     * @example
     * ```
     * import * as dfd from "danfojs"
     * const df = new dfd.DataFrame([[1, 2, 3], [4, 5, 6]])
     * dfd.toExcel(df, {
     *     filePath: "./data/sample.xlsx",
     *     sheetName: "MySheet",
     *   })
     * ```
     *
     * @example
     * ```
     * import { toExcel } from "danfojs-node"
     * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
     * toExcel(df, {
     *     filePath: "./data/sample.xlsx",
     *     sheetName: "MySheet",
     *   })
     * ```
     */
    toExcel(options?: any): void;
    /**
     * Pretty prints a DataFrame or Series to the console
     */
    print(): void;
}

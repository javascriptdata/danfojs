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

import Utils from "../shared/utils";
import Configs from "../shared/config";
import { _iloc } from "./indexing"
import {
    NDframeInterface,
    NdframeInputDataType,
    LoadArrayDataType,
    LoadObjectDataType,
    AxisType,
    ArrayType1D,
    ArrayType2D,
    CsvOutputOptionsNode,
} from '../shared/types'
import ErrorThrower from '../shared/errors';
import { BASE_CONFIG, DATA_TYPES } from '../shared/defaults';
// import { toCSV, toJSON, toExcel } from "../io"

const utils = new Utils();

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
    protected $data: any
    protected $dataIncolumnFormat: ArrayType1D | ArrayType2D = []
    protected $index: Array<string | number> = []
    protected $columns: string[] = []
    protected $dtypes: Array<string> = []
    protected $config: Configs
    $tf: any

    constructor({ data, index, columns, dtypes, config, isSeries }: NdframeInputDataType) {
        this.$isSeries = isSeries
        if (config) {
            this.$config = new Configs({ ...BASE_CONFIG, ...config });
        } else {
            this.$config = new Configs(BASE_CONFIG);
        }

        this.$tf = this.$config.getTfInstance;

        if (data instanceof this.$tf.Tensor) {
            data = data.arraySync();
        }

        if (data === undefined || (Array.isArray(data) && data.length === 0)) {
            this.loadArrayIntoNdframe({ data: [], index: [], columns: [], dtypes: [] });
        } else if (utils.is1DArray(data)) {
            this.loadArrayIntoNdframe({ data, index, columns, dtypes });
        } else {

            if (Array.isArray(data) && utils.isObject(data[0])) {
                this.loadObjectIntoNdframe({ data, type: 1, index, columns, dtypes });

            } else if (utils.isObject(data)) {
                this.loadObjectIntoNdframe({ data, type: 2, index, columns, dtypes });

            } else if (
                Array.isArray((data)[0]) ||
                utils.isNumber((data)[0]) ||
                utils.isString((data)[0])
            ) {
                this.loadArrayIntoNdframe({ data, index, columns, dtypes });
            } else {
                throw new Error("File format not supported!");
            }
        }
    }

    /**
     * Internal function to load array of data into NDFrame
     * @param data The array of data to load into NDFrame
     * @param index Array of numeric or string names for subsetting array.
     * @param columns Array of column names.
     * @param dtypes Array of data types for each the column.
    */
    private loadArrayIntoNdframe({ data, index, columns, dtypes }: LoadArrayDataType): void {
        // this.$data = utils.replaceUndefinedWithNaN(data, this.$isSeries);
        this.$data = data
        if (!this.$config.isLowMemoryMode) {
            //In NOT low memory mode, we transpose the array and save in column format.
            //This makes column data retrieval run in constant time
            this.$dataIncolumnFormat = utils.transposeArray(data)
        }
        this.$setIndex(index);
        this.$setDtypes(dtypes);
        this.$setColumnNames(columns);
    }

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
    private loadObjectIntoNdframe({ data, type, index, columns, dtypes }: LoadObjectDataType): void {
        if (type === 1 && Array.isArray(data)) {
            const _data = (data).map((item) => {
                return Object.values(item);
            });

            let _columnNames;

            if (columns) {
                _columnNames = columns
            } else {
                _columnNames = Object.keys((data)[0]);
            }

            this.loadArrayIntoNdframe({ data: _data, index, columns: _columnNames, dtypes });

        } else {
            const [_data, _colNames] = utils.getRowAndColValues(data);
            let _columnNames;

            if (columns) {
                _columnNames = columns
            } else {
                _columnNames = _colNames
            }
            this.loadArrayIntoNdframe({ data: _data, index, columns: _columnNames, dtypes });
        }
    }

    /**
     * Converts and returns the data in the NDframe as a Tensorflow.js Tensor.
    */
    get tensor() {
        if (this.$isSeries) {
            return this.$tf.tensor1d(this.$data)
        } else {
            return this.$tf.tensor2d(this.$data)
        }
    }

    /**
     * Returns the dtypes of the columns
    */
    get dtypes(): Array<string> {
        return this.$dtypes
    }

    /**
     * Internal function to set the Dtypes of the NDFrame from an array. This function
     * performs the necessary checks.
    */
    $setDtypes(dtypes: Array<string> | undefined): void {
        if (this.$isSeries) {
            if (dtypes) {
                if (this.$data.length != 0 && dtypes.length != 1) {
                    ErrorThrower.throwDtypesLengthError(this, dtypes)
                }

                if (!(DATA_TYPES.includes(`${dtypes[0]}`))) {
                    ErrorThrower.throwDtypeNotSupportedError(dtypes[0])
                }

                this.$dtypes = dtypes
            } else {
                this.$dtypes = utils.inferDtype(this.$data)
            }

        } else {
            if (dtypes) {
                if (this.$data.length != 0 && dtypes.length != this.shape[1]) {
                    ErrorThrower.throwDtypesLengthError(this, dtypes)
                }

                if (this.$data.length == 0 && dtypes.length == 0) {
                    this.$dtypes = dtypes
                } else {
                    dtypes.forEach((dtype) => {
                        if (!(DATA_TYPES.includes(dtype))) {
                            ErrorThrower.throwDtypeNotSupportedError(dtype)
                        }
                    })

                    this.$dtypes = dtypes

                }

            } else {
                this.$dtypes = utils.inferDtype(this.$data)
            }
        }
    }

    /**
     * Returns the dimension of the data. Series have a dimension of 1,
     * while DataFrames have a dimension of 2.
    */
    get ndim(): number {
        if (this.$isSeries) {
            return 1;
        } else {
            return 2
        }
    }

    /**
     * Returns the axis labels of the NDFrame. 
    */
    get axis(): AxisType {
        return {
            index: this.$index,
            columns: this.$columns
        };
    }

    /**
     * Returns the configuration object of the NDFrame.
    */
    get config(): Configs {
        return this.$config

    }

    /**
     * Internal function to set the configuration of the ndframe
    */
    $setConfig(config: Configs): void {
        this.$config = config
    }

    /**
     * Returns the indices of the NDFrame
    */
    get index(): Array<string | number> {
        return this.$index

    }

    /**
     * Internal function to set the index of the NDFrame with the specified
     * array of indices. Performs all necessary checks to ensure that the
     * index is valid.
    */
    $setIndex(index: Array<string | number> | undefined): void {
        if (index) {

            if (this.$data.length != 0 && index.length != this.shape[0]) {
                ErrorThrower.throwIndexLengthError(this, index)
            }
            if (Array.from(new Set(index)).length !== this.shape[0]) {
                ErrorThrower.throwIndexDuplicateError()
            }

            this.$index = index
        } else {
            this.$index = utils.range(0, this.shape[0] - 1) //generate index
        }
    }

    /**
     * Internal function to reset the index of the NDFrame using a range of indices.
    */
    $resetIndex(): void {
        this.$index = utils.range(0, this.shape[0] - 1)
    }

    /**
     * Returns the column names of the NDFrame
    */
    get columns(): string[] {
        return this.$columns
    }

    /**
     * Internal function to set the column names for the NDFrame. This function
     * performs a check to ensure that the column names are unique, and same length as the
     * number of columns in the data.
    */
    $setColumnNames(columns?: string[]) {

        if (this.$isSeries) {
            if (columns) {
                if (this.$data.length != 0 && columns.length != 1 && typeof columns != 'string') {
                    ErrorThrower.throwColumnNamesLengthError(this, columns)
                }
                this.$columns = columns
            } else {
                this.$columns = ["0"]
            }
        } else {
            if (columns) {

                if (this.$data.length != 0 && columns.length != this.shape[1]) {

                    ErrorThrower.throwColumnNamesLengthError(this, columns)
                }
                if (Array.from(new Set(columns)).length !== this.shape[1]) {
                    ErrorThrower.throwColumnDuplicateError()
                }

                this.$columns = columns
            } else {
                this.$columns = (utils.range(0, this.shape[1] - 1)).map((val) => `${val}`) //generate columns
            }
        }
    }

    /**
     * Returns the shape of the NDFrame. Shape is determined by [row lenght, column length]
    */
    get shape(): Array<number> {
        if (this.$data.length === 0) return [0, 0]
        if (this.$isSeries) {
            return [this.$data.length, 1];
        } else {
            const rowLen = (this.$data).length
            const colLen = (this.$data[0] as []).length
            return [rowLen, colLen]
        }

    }

    /**
     * Returns the underlying data in Array format.
    */
    get values(): ArrayType1D | ArrayType2D {
        return this.$data;
    }

    /**
     * Updates the internal $data property to the specified value
     * @param values An array of values to set
     * @param checkLength Whether to check the length of the new values and the existing row length
     * @param checkColumnLength Whether to check the length of the new values and the existing column length
     * */
    $setValues(values: ArrayType1D | ArrayType2D, checkLength: boolean = true, checkColumnLength: boolean = true): void {
        if (this.$isSeries) {
            if (checkLength && values.length != this.shape[0]) {
                ErrorThrower.throwRowLengthError(this, values.length)
            }

            this.$data = values
            this.$dtypes = utils.inferDtype(values) //Dtype may change depeneding on the value set

            if (!this.$config.isLowMemoryMode) {
                this.$dataIncolumnFormat = values
            }

        } else {
            if (checkLength && values.length != this.shape[0]) {
                ErrorThrower.throwRowLengthError(this, values.length)
            }

            if (checkColumnLength) {
                values.forEach(value => {
                    if ((value as ArrayType1D).length != this.shape[1]) {
                        ErrorThrower.throwColumnLengthError(this, values.length)
                    }
                })
            }

            this.$data = values
            this.$dtypes = utils.inferDtype(values)

            if (!this.$config.isLowMemoryMode) {
                this.$dataIncolumnFormat = utils.transposeArray(values)
            }

        }

    }

    /**
     * Returns the size of the NDFrame object
     * 
    */
    get size(): number {
        return this.shape[0] * this.shape[1]
    }

    // /**
    //  * Converts a DataFrame or Series to CSV. 
    //  * @param options Configuration object. Supports the following options:
    //  * - `filePath`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string.
    //  * - `header`: Boolean indicating whether to include a header row in the CSV file.
    //  * - `sep`: Character to be used as a separator in the CSV file.
    //  */
    // toCSV(options?: CsvOutputOptionsNode): string | void {
    //     return toCSV(this, options);
    // }

    // /**
    //  * Converts a DataFrame or Series to JSON. 
    //  * @param options Configuration object. Supported options:
    //  * - `filePath`: The file path to write the JSON to. If not specified, the JSON object is returned.
    //  * - `format`: The format of the JSON. Defaults to `'column'`. E.g for using `column` format:
    //  * ```
    //  * [{ "a": 1, "b": 2, "c": 3, "d": 4 },
    //  *  { "a": 5, "b": 6, "c": 7, "d": 8 }]
    //  * ```
    //  * and `row` format:
    //  * ```
    //  * { "a": [1, 5, 9],
    //  *  "b": [2, 6, 10]
    //  * }
    //  * ```
    //  */
    // toJSON(options?: { format?: "row" | "column", filePath?: string }): object | void {
    //     return toJSON(this, options);
    // }


    // /**
    //  * Converts a DataFrame or Series to Excel Sheet. 
    //  * @param options Configuration object. Supported options:
    //  * - `sheetName`: The sheet name to be written to. Defaults to `'Sheet1'`.
    //  * - `filePath`: The filePath to be written to. Defaults to `'./output.xlsx'`.
    //  */
    // toExcel(options?: { filePath?: string, sheetName?: string }): void {
    //     return toExcel(this, options);
    // }

    /**
     * Pretty prints a DataFrame or Series to the console
     */
    print() {
        console.log(this + "");
    }
}
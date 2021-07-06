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

import * as tf from '@tensorflow/tfjs-node';
// import { table } from "table";
import Utils from "../utils";
import Configs from "../config";
import { BASE_CONFIG, DATA_TYPES } from '../defaults';
import { NDframeInterface, NdframeInputDataType, LoadArrayDataType, LoadObjectDataType, ArrayType, AxisType } from '../types'
import ErrorThrower from '../errors';

const utils = new Utils();

/**
 * N-Dimension data structure. Stores multi-dimensional
 * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame.
 *
 * @param {data} Array JSON, Tensor. Block of data.
 * @param {kwargs} Object Optional Configuration Object
 *                 {columns: Array of column names. If not specified and data is an array of array, use range index.
 *                  dtypes: Data types of the columns,
 *                  index: row index for subseting array }
 *
 * @returns NDframe
 */
export default class NDframe implements NDframeInterface {
    $isSeries: boolean
    $data: ArrayType = []
    $index: Array<string | number> = []
    $columnNames: string[] | number[] = []
    $dtypes: Array<string> = []
    $config: Configs

    constructor({ data, index, columnNames, dtypes, config }: NdframeInputDataType) {
        if (config) {
            this.$config = new Configs(config);
        } else {
            this.$config = new Configs(BASE_CONFIG);
        }

        if (data instanceof tf.Tensor) {
            data = data.arraySync();
        }

        if (utils.is1DArray(data)) {
            this.$isSeries = true;
            this.loadArray({ data, index, columnNames, dtypes });
        } else {
            this.$isSeries = false;

            if (utils.isObject((data)[0])) {
                this.loadObject({ data, type: 1, index, columnNames, dtypes });

            } else if (utils.isObject(data)) {
                this.loadObject({ data, type: 2, index, columnNames, dtypes });

            } else if (
                Array.isArray((data)[0]) ||
                utils.isNumber((data)[0]) ||
                utils.isString((data)[0])
            ) {
                this.loadArray({ data, index, columnNames, dtypes });
            } else {
                throw new Error("File format not supported!");
            }
        }
    }

    /**
     * Load array of data into NDFrame
     * @param data The array of data to load into NDFrame
     * 
    */
    loadArray({ data, index, columnNames, dtypes }: LoadArrayDataType): void {
        this.$data = utils.replaceUndefinedWithNaN(data, this.$isSeries);
        this.setIndex(index);
        this.setColumnNames(columnNames);
        this.setDtypes(dtypes);
    }

    /**
     * Load Javascript objects or object of arrays into NDFrame
     * @param data Object or object of arrays.
     * @param type The type of the object. There are two recognized types:
     * 
     * type 1 object are in JSON format [{a: 1, b: 2}, {a: 30, b: 20}].
     * 
     * type 2 object are of the form {a: [1,2,3,4], b: [30,20, 30, 20}]}
    */
    loadObject({ data, type, index, columnNames, dtypes }: LoadObjectDataType): void {
        if (type === 1 && Array.isArray(data)) {
            const _data = (data).map((item) => {
                return Object.values(item);
            });
            
            let _columnNames;

            if (columnNames) {
                _columnNames = columnNames
            } else {
                _columnNames = Object.keys((data)[0]);
            }

            this.loadArray({ data: _data, index, columnNames: _columnNames, dtypes });

        } else {
            const [_data, _colNames] = utils.getRowAndColValues(data);
            let _columnNames;

            if (columnNames) {
                _columnNames = columnNames
            } else {
                _columnNames = _colNames
            }
            this.loadArray({ data: _data, index, columnNames: _columnNames, dtypes });
        }
    }



    get tensor(): tf.Tensor {
        return tf.tensor(this.$data as any)
    }

    get dtypes(): Array<string> {
        return this.$dtypes
    }

    setDtypes(dtypes: Array<string> | undefined): void {
        if (this.$isSeries) {
            if (dtypes) {
                if (dtypes.length != 1) {
                    ErrorThrower.throwDtypesLengthError(this, dtypes)
                }

                if (!(DATA_TYPES.includes(dtypes[0]))) {
                    ErrorThrower.throwDtypeNotSupportedError(dtypes[0])
                }

                this.$dtypes = dtypes
            } else {
                this.$dtypes = utils.inferDtype(this.$data)
            }

        } else {
            if (dtypes) {
                if (dtypes.length != this.shape[1]) {
                    ErrorThrower.throwDtypesLengthError(this, dtypes)
                }

                dtypes.forEach((dtype) => {
                    if (!(DATA_TYPES.includes(dtype))) {
                        ErrorThrower.throwDtypeNotSupportedError(dtype)
                    }
                })

                this.$dtypes = dtypes

            } else {
                this.$dtypes = utils.inferDtype(this.$data)
            }
        }
    }

    get ndim(): number {
        if (this.$isSeries) {
            return 1;
        } else {
            return this.tensor.shape.length;
        }
    }

    get axis(): AxisType {
        return {
            index: this.$index,
            columns: this.$columnNames
        };
    }

    get index(): Array<string | number> {
        return this.$index

    }

    setIndex(index: Array<string | number> | undefined): void {
        if (this.$isSeries) {
            if (index) {
                if (index.length != this.shape[0]) {
                    ErrorThrower.throwIndexLengthError(this, index)
                }
                this.$index = index
            } else {
                this.$index = utils.range(0, this.shape[0] - 1) //generate index
            }
        } else {
            if (index) {
                if (index.length != this.shape[0]) {
                    ErrorThrower.throwIndexLengthError(this, index)
                }
                this.$index = index
            } else {
                this.$index = utils.range(0, this.shape[0] - 1)
            }
        }
    }

    resetIndex(): void {
        this.$index = utils.range(0, this.shape[0])
    }

    get columnNames() {
        return this.$columnNames
    }

    setColumnNames(columnNames: string[] | number[] | undefined) {
        if (this.$isSeries) {
            if (columnNames) {
                if (columnNames.length != 1) {
                    ErrorThrower.throwColumnNamesLengthError(this, columnNames)
                }
                this.$columnNames = columnNames
            } else {
                this.$columnNames = ["0"]
            }
        } else {   
            if (columnNames) {
                if (columnNames.length != this.shape[1]  ) {                    
                    ErrorThrower.throwColumnNamesLengthError(this, columnNames)
                }
                this.$columnNames = columnNames
            } else {
                this.$columnNames = utils.range(0, this.shape[1]   - 1) //generate columns
            }
        }
    }


    get shape(): Array<number> {
        if (this.$isSeries) {
            return [this.$data.length, 1];
        } else {
            return this.tensor.shape
        }

    }

    get values(): ArrayType {
        return this.$data;
    }

    get size(): number {
        return this.tensor.size
    }

    // isNaN(): Array<string | string[] | number | number[]> {

    // }

    // toCsv(): Array<string | string[]> {

    // }

    // toJson(): string {

    // }

    /**
     * Prints NDframe to console as a grid of row and columns.
    */
    // toString(): string {
    //     const tableWidth = this.$config.getTableWidth
    //     const tableTruncateLen = this.$config.getTableTruncate;
    //     const maxRow = this.$config.getMaxRow;
    //     const maxColInConsole = this.$config.getTableMaxColInConsole;
    //     const columnLen = this.$columnNames.length

    //     let dataArr: any;
    //     let tableConfig: any
    //     let header = [];

    //     if (columnLen > maxColInConsole) {
    //         //truncate displayed columns to fit in the console
    //         let firstFourCols = this.$columnNames.slice(0, 4);
    //         let lastThreeCols = this.$columnNames.slice(columnLen - 4);
    //         //join columns with ellipse in the middle
    //         header = ["", ...firstFourCols, "...", ...lastThreeCols]

    //         let subIdx = []
    //         let values1: any
    //         let values2: any

    //         if (this.values.length > maxRow) {
    //             //slice Object to show [max_rows]
    //             let dfSubsetOne = indexLoc({
    //                 ndframe: this,
    //                 rows: [`0:${maxRow}`],
    //                 columns: ["0:4"]
    //             });

    //             let dfSubsetTwo = indexLoc({
    //                 ndframe: this,
    //                 rows: [`0:${maxRow}`],
    //                 columns: [`${columnLen - 4}:`]
    //             });

    //             subIdx = this.index.slice(0, maxRow);
    //             values1 = dfSubsetOne.values;
    //             values2 = dfSubsetTwo.values;

    //         } else {
    //             let dfSubsetOne = indexLoc({
    //                 ndframe: this,
    //                 rows: ["0:"],
    //                 columns: ["0:4"]
    //             });

    //             let dfSubsetTwo = indexLoc({
    //                 ndframe: this,
    //                 rows: ["0:"],
    //                 columns: [`${columnLen - 4}:`]
    //             });

    //             subIdx = this.index.slice(0, maxRow);
    //             values1 = dfSubsetOne.values;
    //             values2 = dfSubsetTwo.values;
    //         }

    //         // merge dfs
    //         subIdx.map((val, i) => {
    //             let row = [val].concat(values1[i]).concat(["..."]).concat(values2[i]);
    //             dataArr.push(row);
    //         });
    //     } else {
    //         //display all columns
    //         header = ["", ...this.$columnNames]
    //         let idx: Array<string | number> = []
    //         let values: any

    //         if (this.values.length > maxRow) {
    //             //slice Object to show a max of [max_rows]
    //             let [data, _, index] = indexLoc({
    //                 ndframe: this,
    //                 rows: [`0:${maxRow}`],
    //                 columns: this.$columnNames
    //             });

    //             idx = index
    //             values = data.values;
    //         } else {
    //             values = this.values;
    //             idx = this.index;
    //         }

    //         // merge cols
    //         idx.forEach((val, i) => {
    //             let row = [val, ...values[i]];
    //             dataArr.push(row);
    //         });
    //     }

    //     //set column width of all columns
    //     tableConfig[0] = 10;
    //     for (let index = 1; index < header.length; index++) {
    //         tableConfig[index] = { width: tableWidth, truncate: tableTruncateLen };
    //     }

    //     let tabledata = [header, ...dataArr]; //Add the column names to values before printing
    //     return table(tabledata, { columns: tableConfig });
    // }

    /**
     * Pretty prints n number of rows in a DataFrame or isSeries in the console
     * @param {rows} Number of rows to print
     */
    print() {
        console.log(this + "");
    }
}
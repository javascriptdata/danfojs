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
import Utils from "../shared/utils";
import Configs from "../shared/config";
import { _iloc } from "./iloc"
import { BASE_CONFIG, DATA_TYPES } from '../shared/defaults';
import {
    NDframeInterface,
    NdframeInputDataType,
    LoadArrayDataType,
    LoadObjectDataType,
    AxisType,
    ArrayType1D,
    ArrayType2D,
} from '../shared/types'
import ErrorThrower from '../shared/errors';

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
 *  columnNames: Array of column names. If not specified, column names are auto generated.
 * 
 *  dtypes: Array of data types for each the column. If not specified, dtypes inferred.
 * 
 *  config: General configuration object for NDframe      
 *
 * @returns NDframe
 */
export default class NDframe implements NDframeInterface {
    protected $isSeries: boolean;
    protected $data: any
    protected $dataIncolumnFormat: ArrayType1D | ArrayType2D = []
    protected $index: Array<string | number> = []
    protected $columnNames: string[] = []
    protected $dtypes: Array<string> = []
    protected $config: Configs

    constructor({ data, index, columnNames, dtypes, config, isSeries }: NdframeInputDataType) {
        this.$isSeries = isSeries
        if (config) {
            this.$config = new Configs(config);
        } else {
            this.$config = new Configs(BASE_CONFIG);
        }

        if (data instanceof tf.Tensor) {
            data = data.arraySync();
        }

        if (data === undefined || (Array.isArray(data) && data.length === 0)) {
            this.loadArrayIntoNdframe({ data: [], index: [], columnNames: [], dtypes: [] });
        } else if (utils.is1DArray(data)) {
            this.loadArrayIntoNdframe({ data, index, columnNames, dtypes });
        } else {

            if (Array.isArray(data) && utils.isObject(data[0])) {
                this.loadObjectIntoNdframe({ data, type: 1, index, columnNames, dtypes });

            } else if (utils.isObject(data)) {
                this.loadObjectIntoNdframe({ data, type: 2, index, columnNames, dtypes });

            } else if (
                Array.isArray((data)[0]) ||
                utils.isNumber((data)[0]) ||
                utils.isString((data)[0])
            ) {
                this.loadArrayIntoNdframe({ data, index, columnNames, dtypes });
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
    private loadArrayIntoNdframe({ data, index, columnNames, dtypes }: LoadArrayDataType): void {
        this.$data = utils.replaceUndefinedWithNaN(data, this.$isSeries);
        if (!this.$config.isLowMemoryMode) {
            //In NOT low memory mode, we transpose the array and save in column format.
            //This makes column data retrieval run in constant time
            this.$dataIncolumnFormat = utils.transposeArray(data)
        }
        this.$setIndex(index);
        this.$setDtypes(dtypes);
        this.$setColumnNames(columnNames);

        // this.$setInternalColumnDataProperty()
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
    private loadObjectIntoNdframe({ data, type, index, columnNames, dtypes }: LoadObjectDataType): void {
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

            this.loadArrayIntoNdframe({ data: _data, index, columnNames: _columnNames, dtypes });

        } else {
            const [_data, _colNames] = utils.getRowAndColValues(data);
            let _columnNames;

            if (columnNames) {
                _columnNames = columnNames
            } else {
                _columnNames = _colNames
            }
            this.loadArrayIntoNdframe({ data: _data, index, columnNames: _columnNames, dtypes });
        }
    }



    get tensor(): tf.Tensor {
        return tf.tensor(this.$data as any)
    }

    get dtypes(): Array<string> {
        return this.$dtypes
    }

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

    get config(): Configs {
        return this.$config

    }

    get index(): Array<string | number> {
        return this.$index

    }

    $setIndex(index: Array<string | number> | undefined): void {
        if (index) {

            if (this.$data.length != 0 && index.length != this.shape[0]) {
                ErrorThrower.throwIndexLengthError(this, index)
            }
            this.$index = index
        } else {
            this.$index = utils.range(0, this.shape[0] - 1) //generate index
        }
    }

    $resetIndex(): void {
        this.$index = utils.range(0, this.shape[0] - 1)
    }

    get columnNames(): string[] {
        return this.$columnNames
    }

    $setColumnNames(columnNames?: string[]) {

        if (this.$isSeries) {
            if (columnNames) {
                if (this.$data.length != 0 && columnNames.length != 1 && typeof columnNames != 'string') {
                    ErrorThrower.throwColumnNamesLengthError(this, columnNames)
                }
                this.$columnNames = columnNames
            } else {
                this.$columnNames = ["0"]
            }
        } else {
            if (columnNames) {

                if (this.$data.length != 0 && columnNames.length != this.shape[1]) {
                    ErrorThrower.throwColumnNamesLengthError(this, columnNames)
                }
                this.$columnNames = columnNames
            } else {
                this.$columnNames = (utils.range(0, this.shape[1] - 1)).map((val) => `${val}`) //generate columns
            }
        }
    }


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

    get values(): ArrayType1D | ArrayType2D {
        return this.$data;
    }

    $setValues(values: ArrayType1D | ArrayType2D, checkLength: boolean = true): void {
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

            values.forEach(value => {
                if ((value as ArrayType1D).length != this.shape[1]) {
                    ErrorThrower.throwColumnLengthError(this, values.length)
                }
            })

            this.$data = values
            this.$dtypes = utils.inferDtype(values)

            if (!this.$config.isLowMemoryMode) {
                this.$dataIncolumnFormat = utils.transposeArray(values)
            }

        }

    }

    get size(): number {
        return this.tensor.size
    }

    async toCsv(): Promise<String> {
        ErrorThrower.throwNotImplementedError()
        return ""
    }

    async toJson(): Promise<String> {
        ErrorThrower.throwNotImplementedError()
        return ""
    }

    /**
     * Pretty prints n number of rows in a DataFrame or isSeries in the console
     * @param {rows} Number of rows to print
     */
    print() {
        console.log(this + "");
    }
}
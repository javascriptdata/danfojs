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
import NDframe from "../../core/generic";
import { table } from "table";
import { _iloc, _loc } from "../indexing";
import { _genericMathOp } from "../generic.math.ops";
import Utils from "../../shared/utils"
import { ArrayType1D, ArrayType2D, NdframeInputDataType, DataFrameInterface, BaseDataOptionType } from "../../shared/types";
import Series from '../series';
import ErrorThrower from '../../shared/errors';
import { Tensor } from '@tensorflow/tfjs-node';

const utils = new Utils();

/**
 * Two-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * @param options.columnNames Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.      
 */
/* @ts-ignore */ //COMMENT OUT WHEN METHODS HAVE BEEN IMPLEMENTED
export default class DataFrame extends NDframe implements DataFrameInterface {

    constructor(data: any, options: BaseDataOptionType = {}) {
        const { index, columnNames, dtypes, config } = options;
        super({ data, index, columnNames, dtypes, config, isSeries: false });
        this.$setInternalColumnDataProperty();
    }

    private $setInternalColumnDataProperty() {
        const self = this;
        const columnNames = this.columnNames;
        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            Object.defineProperty(this, columnName, {
                get() {
                    return self.$getColumnData(columnName)
                },
                set(arr: ArrayType1D | ArrayType2D) {
                    self.$setColumnData(columnName, arr);
                }
            })
        }

    }

    private $getColumnData(columnName: string) {
        const columnIndex = this.columnNames.indexOf(columnName)

        if (columnIndex == -1) {
            ErrorThrower.throwColumnNotFoundError(this)
        }

        const dtypes = [this.$dtypes[columnIndex]]
        const index = this.$index
        const columnNames = [columnName]
        const config = this.$config

        if (this.$config.isLowMemoryMode) {
            const data = []
            for (let i = 0; i < this.values.length; i++) {
                const row: any = this.values[i];
                data.push(row[columnIndex])
            }
            return new Series(data, {
                dtypes,
                index,
                columnNames,
                config
            })
        } else {
            const data = this.$dataIncolumnFormat[columnIndex]
            return new Series(data, {
                dtypes,
                index,
                columnNames,
                config
            })
        }

    }

    private $setColumnData(columnName: string, arr: ArrayType1D | ArrayType2D): void {

        const columnIndex = this.$columnNames.indexOf(columnName)
        if (columnIndex == -1) {
            ErrorThrower.throwColumnNotFoundError(this)
        }

        if (!(arr.length !== this.shape[1])) {
            ErrorThrower.throwColumnLengthError(this, this.shape[1])
        }

        if (this.$config.isLowMemoryMode) {
            //Update row ($data) array
            for (let i = 0; i < this.$data.length; i++) {
                (this.$data as any)[i][columnIndex] = arr[i]
            }
            //Update the dtypes
            this.$dtypes[columnIndex] = utils.inferDtype(arr)[0]
        } else {
            //Update row ($data) array
            for (let i = 0; i < this.values.length; i++) {
                (this.$data as any)[i][columnIndex] = arr[i]
            }
            //Update column ($dataIncolumnFormat) array since it's available in object
            (this.$dataIncolumnFormat as any)[columnIndex] = arr

            //Update the dtypes
            this.$dtypes[columnIndex] = utils.inferDtype(arr)[0]
        }

    }

    /**
    * Purely integer-location based indexing for selection by position.
    * ``.iloc`` is primarily integer position based (from ``0`` to
    * ``length-1`` of the axis), but may also be used with a boolean array.
    * 
    * @param rows Array of row indexes
    * @param columns Array of column indexes
    *  
    * Allowed inputs are in rows and columns params are:
    * 
    * - An array of single integer, e.g. ``[5]``.
    * - A list or array of integers, e.g. ``[4, 3, 0]``.
    * - A slice array string with ints, e.g. ``["1:7"]``.
    * - A boolean array.
    * - A ``callable`` function with one argument (the calling Series or
    * DataFrame) and that returns valid output for indexing (one of the above).
    * This is useful in method chains, when you don't have a reference to the
    * calling object, but would like to base your selection on some value.
    * 
    * ``.iloc`` will raise ``IndexError`` if a requested indexer is
    * out-of-bounds.
    */
    iloc({ rows, columns }: {
        rows?: Array<string | number | boolean> | Series,
        columns?: Array<string | number>
    }): DataFrame {
        return _iloc({ ndFrame: this, rows, columns }) as DataFrame;
    }


    /**
     * Access a group of rows and columns by label(s) or a boolean array.
     * ``loc`` is primarily label based, but may also be used with a boolean array.
     * 
     * @param rows Array of row indexes
     * @param columns Array of column indexes
     * 
     * Allowed inputs are:
     * 
     * - A single label, e.g. ``["5"]`` or ``['a']``, (note that ``5`` is interpreted as a 
     *   *label* of the index, and **never** as an integer position along the index).
     * 
     * - A list or array of labels, e.g. ``['a', 'b', 'c']``.
     * 
     * - A slice object with labels, e.g. ``["a:f"]``. Note that start and the stop are included
     * 
     * - A boolean array of the same length as the axis being sliced,
     * e.g. ``[True, False, True]``.
     * 
     * - A ``callable`` function with one argument (the calling Series or
     * DataFrame) and that returns valid output for indexing (one of the above)
    */
    loc({ rows, columns }: {
        rows?: Array<string | number | boolean> | Series,
        columns?: Array<string>
    }): DataFrame {
        return _loc({ ndFrame: this, rows, columns }) as DataFrame
    }

    /**
     * Prints DataFrame to console as a grid of row and columns.
    */
    toString(): string {
        const maxRow = this.config.getMaxRow;
        const maxColToDisplayInConsole = this.config.getTableMaxColInConsole;

        // let data;
        const dataArr: ArrayType2D = [];
        const colLen = this.columnNames.length;

        let header = [];

        if (colLen > maxColToDisplayInConsole) {
            //truncate displayed columns to fit in the console
            let firstFourcolNames = this.columnNames.slice(0, 4);
            let lastThreecolNames = this.columnNames.slice(colLen - 4);
            //join columns with truncate ellipse in the middle
            header = ["", ...firstFourcolNames, "...", ...lastThreecolNames];

            let subIdx: Array<number | string>
            let firstHalfValues: ArrayType2D
            let lastHalfValueS: ArrayType2D

            if (this.values.length > maxRow) {
                //slice Object to show [max_rows]
                let dfSubset1 = this.iloc({
                    rows: [`0:${maxRow}`],
                    columns: ["0:4"]
                });

                let dfSubset2 = this.iloc({
                    rows: [`0:${maxRow}`],
                    columns: [`${colLen - 4}:`]
                });

                subIdx = this.index.slice(0, maxRow);
                firstHalfValues = dfSubset1.values as ArrayType2D
                lastHalfValueS = dfSubset2.values as ArrayType2D

            } else {
                let dfSubset1 = this.iloc({ columns: ["0:4"] });
                let dfSubset2 = this.iloc({ columns: [`${colLen - 4}:`] });

                subIdx = this.index.slice(0, maxRow);
                firstHalfValues = dfSubset1.values as ArrayType2D
                lastHalfValueS = dfSubset2.values as ArrayType2D
            }

            // merge subset 
            for (let i = 0; i < subIdx.length; i++) {
                const idx = subIdx[i];
                const row = [idx, ...firstHalfValues[i], "...", ...lastHalfValueS[i]]
                dataArr.push(row);
            }

        } else {
            //display all columns
            header = ["", ...this.columnNames]
            let subIdx
            let values: ArrayType2D
            if (this.values.length > maxRow) {
                //slice Object to show a max of [max_rows]
                let data = this.iloc({ rows: [`0:${maxRow}`] });
                subIdx = data.index;
                values = data.values as ArrayType2D
            } else {
                values = this.values as ArrayType2D
                subIdx = this.index;
            }

            // merge subset 
            for (let i = 0; i < subIdx.length; i++) {
                const idx = subIdx[i];
                const row = [idx, ...values[i]];
                dataArr.push(row);
            }
        }


        const columnsConfig: any = {};
        columnsConfig[0] = { width: 5 }; //set column width for index column

        for (let index = 1; index < header.length; index++) {
            columnsConfig[index] = { width: 17, truncate: 16 };
        }

        const tableData: any = [header, ...dataArr]; //Adds the column names to values before printing

        return table(tableData, { columns: columnsConfig, ...this.config.getTableDisplayConfig });
    }

    /**
      * Returns the first n values in a DataFrame
      * @param rows The number of rows to return
    */
    head(rows: number = 5): DataFrame {
        if (rows > this.shape[0]) {
            throw new Error("ParamError: Number of rows cannot be greater than available rows in data")
        }
        if (rows <= 0) {
            throw new Error("ParamError: Number of rows cannot be less than 1")
        }

        return this.iloc({ rows: [`0:${rows}`] })
    }

    /**
      * Returns the last n values in a DataFrame
      * @param rows The number of rows to return
    */
    tail(rows: number = 5): any {
        if (rows > this.shape[0]) {
            throw new Error("ParamError: Number of rows cannot be greater than available rows in data")
        }
        if (rows <= 0) {
            throw new Error("ParamError: Number of rows cannot be less than 1")
        }
        rows = this.shape[0] - rows
        return this.iloc({ rows: [`${rows}:`] })
    }

    /**
     * Gets n number of random rows in a dataframe. Sample is reproducible if seed is provided.
     * @param num The number of rows to return. Default to 5.
     * @param seed An integer specifying the random seed that will be used to create the distribution.
    */
    async sample(num = 5, seed = 1): Promise<DataFrame> {
        if (num > this.shape[0]) {
            throw new Error("ParamError: Sample size cannot be bigger than number of rows");
        }
        if (num <= 0) {
            throw new Error("ParamError: Sample size cannot be less than 1");
        }

        const shuffledIndex = await tf.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
        const sf = this.iloc({ rows: shuffledIndex });
        return sf;
    }

    /* 
    * checks if DataFrame is compactible for arithmetic operation
    * compatible Dataframe must have only numerical dtypes
    **/
    private $frameIsNotCompactibleForArithmeticOperation() {
        const dtypes = this.dtypes;
        const str = (element: any) => element == "string";
        return dtypes.some(str)
    }

    private $getTensorsForArithmeticOperation(
        thisDataFrame: DataFrame,
        other: DataFrame | Series | number | Array<number>,
        axis: 0 | 1
    ): [Tensor, Tensor] {
        if (typeof other === "number") {
            return [thisDataFrame.tensor, tf.scalar(other)];
        } else if (other instanceof DataFrame) {
            return [thisDataFrame.tensor, other.tensor];
        } else if (other instanceof Series) {
            if (axis === 0) {
                return [thisDataFrame.tensor, tf.tensor2d(other.values as Array<number>, [other.shape[0], 1])];
            } else {
                return [thisDataFrame.tensor, tf.tensor2d(other.values as Array<number>, [other.shape[0], 1]).transpose()];
            }
        } else if (Array.isArray(other)) {
            if (axis === 0) {
                return [thisDataFrame.tensor, tf.tensor2d(other, [other.length, 1])];
            } else {
                return [thisDataFrame.tensor, tf.tensor2d(other, [other.length, 1]).transpose()];
            }
        } else {
            throw new Error("ParamError: Invalid type for other parameter. other must be one of Series, DataFrame or number.")
        }

    }

    /**
     * Return Addition of DataFrame and other, element-wise (binary operator add).
     * @param other DataFrame, Series, Array or Scalar number to add
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    add(other: DataFrame | Series | number, axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Add operation is not supported for string dtypes");
        }

        const tensors: [Tensor, Tensor] = this.$getTensorsForArithmeticOperation(this, other, axis);
        const newData = (tensors[0].add(tensors[1])).arraySync()

        if (inplace) {
            this.$setValues(newData as ArrayType2D)
        } else {
            return new DataFrame(
                newData,
                {
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

        }

    }
    /**
     * Return substraction between DataFrame and other.
     * @param other DataFrame, Series, Array or Scalar number to substract from DataFrame
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    sub(other: DataFrame | Series | number, axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Sub operation is not supported for string dtypes");
        }

        const tensors: [Tensor, Tensor] = this.$getTensorsForArithmeticOperation(this, other, axis);
        const newData = (tensors[0].sub(tensors[1])).arraySync()

        if (inplace) {
            this.$setValues(newData as ArrayType2D)
        } else {
            return new DataFrame(
                newData,
                {
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

        }

    }
    /**
     * Return multiplciation between DataFrame and other.
     * @param other DataFrame, Series, Array or Scalar number to multiply with.
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    mul(other: DataFrame | Series | number, axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Mul operation is not supported for string dtypes");
        }

        const tensors: [Tensor, Tensor] = this.$getTensorsForArithmeticOperation(this, other, axis);
        const newData = (tensors[0].mul(tensors[1])).arraySync()

        if (inplace) {
            this.$setValues(newData as ArrayType2D)
        } else {
            return new DataFrame(
                newData,
                {
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

        }

    }

    /**
     * Return division of DataFrame with other.
     * @param other DataFrame, Series, Array or Scalar number to divide with.
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    div(other: DataFrame | Series | number, axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Div operation is not supported for string dtypes");
        }

        const tensors: [Tensor, Tensor] = this.$getTensorsForArithmeticOperation(this, other, axis);
        const newData = (tensors[0].div(tensors[1])).arraySync()

        if (inplace) {
            this.$setValues(newData as ArrayType2D)
        } else {
            return new DataFrame(
                newData,
                {
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

        }

    }

    /**
     * Return DataFrame raised to the power of other.
     * @param other DataFrame, Series, Array or Scalar number to to raise to.
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    pow(other: DataFrame | Series | number, axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Pow operation is not supported for string dtypes");
        }

        const tensors: [Tensor, Tensor] = this.$getTensorsForArithmeticOperation(this, other, axis);
        const newData = (tensors[0].pow(tensors[1])).arraySync()

        if (inplace) {
            this.$setValues(newData as ArrayType2D)
        } else {
            return new DataFrame(
                newData,
                {
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

        }

    }

    /**
     * Return modulus between DataFrame and other.
     * @param other DataFrame, Series, Array or Scalar number to modulus with.
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    mod(other: DataFrame | Series | number, axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Mod operation is not supported for string dtypes");
        }

        const tensors: [Tensor, Tensor] = this.$getTensorsForArithmeticOperation(this, other, axis);
        const newData = (tensors[0].mod(tensors[1])).arraySync()

        if (inplace) {
            this.$setValues(newData as ArrayType2D)
        } else {
            return new DataFrame(
                newData,
                {
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: this.dtypes,
                    config: this.config
                })

        }

    }

    /**
     * Return mean of DataFrame across specified axis.
     * @param axis 0 or 1. If 0, add row-wise, if 1, add column-wise
    */
    mean(axis?: 0 | 1): Series {
        axis = (!axis && axis !== 0) ? 1 : axis

        if (this.$frameIsNotCompactibleForArithmeticOperation()) {
            throw Error("TypeError: Mean operation is not supported for string dtypes");
        }

        if (this.config.toUseTfjsMathFunctions) {
            //Note: Tensorflow does not remove NaNs before performing math operations.
            const newData = (tf.tensor2d(this.values as any).mean(axis)).arraySync()
            return new Series(newData)

        } else {

            if (axis === 1) {
                const cleanValues: Array<number[]> = [];
                const dfValues = this.values

                for (let i = 0; i < dfValues.length; i++) {
                    const values = dfValues[i] as number[]
                    if (values.includes(NaN)) {
                        cleanValues.push(utils.removeNansFromArray(values) as number[]);
                    } else {
                        cleanValues.push(values);
                    }
                }

                const newData = cleanValues.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length)
                return new Series(newData)
            } else {
                const cleanValues: Array<number[]> = [];
                let dfValues;

                if (this.config.isLowMemoryMode) {
                    dfValues = utils.transposeArray(this.values) as ArrayType2D
                } else {
                    dfValues = this.$dataIncolumnFormat as ArrayType2D
                }

                for (let i = 0; i < dfValues.length; i++) {
                    const values = dfValues[i] as number[]
                    if (values.includes(NaN)) {
                        cleanValues.push(utils.removeNansFromArray(values) as number[]);
                    } else {
                        cleanValues.push(values);
                    }
                }

                const newData = cleanValues.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length)
                return new Series(newData)
            }
        }
    }


    /**
     * Drops all rows or columns with missing values (NaN)
     * @param axis 0 or 1. If 0, drop rows with NaNs, if 1, drop columns with NaNs
     * @param options.inplace Boolean indicating whether to perform the operation inplace or not. Defaults to false
    */
    dropNa(axis?: 0 | 1, options?: { inplace: boolean }): DataFrame | void {
        const { inplace = false } = options || {};
        axis = (!axis && axis !== 0) ? 1 : axis

        const newIndex: Array<number | string> = [];

        if (axis == 0) {
            const newData = [];

            const dfValues = this.values as ArrayType2D;
            for (let i = 0; i < dfValues.length; i++) {
                const values: ArrayType1D = dfValues[i];
                if (!values.includes(NaN)) {
                    newData.push(values);
                    newIndex.push(this.index[i])
                }
            }

            if (inplace) {
                this.$setValues(newData, false)
                this.$setIndex(newIndex)
            } else {
                return new DataFrame(
                    newData,
                    {
                        index: newIndex,
                        columnNames: this.columnNames,
                        dtypes: this.dtypes,
                        config: this.config
                    })
            }

        } else {
            const newColumnNames = []
            const newDtypes = []
            let dfValues: ArrayType2D = []

            if (this.config.isLowMemoryMode) {
                dfValues = utils.transposeArray(this.values) as ArrayType2D
            } else {
                dfValues = this.$dataIncolumnFormat as ArrayType2D
            }
            const tempColArr = []

            for (let i = 0; i < dfValues.length; i++) {
                const values: ArrayType1D = dfValues[i];
                if (!values.includes(NaN)) {
                    tempColArr.push(values);
                    newColumnNames.push(this.columnNames[i])
                    newDtypes.push(this.dtypes[i])
                }
            }

            const newData = utils.transposeArray(tempColArr) as ArrayType2D

            if (inplace) {
                this.$setValues(newData, false, false)
                this.$setColumnNames(newColumnNames)
                this.$setDtypes(newDtypes)
            } else {
                return new DataFrame(
                    newData,
                    {
                        index: this.index,
                        columnNames: newColumnNames,
                        dtypes: newDtypes,
                        config: this.config
                    })
            }
        }

    }



}
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
import DataFrame from '@base/core/frame';
import { Tensor } from '@tensorflow/tfjs-node';
import Series from '../core/series';
import { BaseUserConfig } from "table"
import Str from '@base/core/strings';
import { Dt } from '..';
import { ParseConfig } from 'papaparse';

export type DTYPES = "float32" | "int32" | "string" | "boolean" | "undefined"

export type ArrayType2D = Array<
    number[]
    | string[]
    | boolean[]
    | (number | string | boolean)[]>

export type ArrayType1D = Array<
    number
    | string
    | boolean
    | (number | string | boolean)>

//Start of Config class types

export type ConfigsType = {
    tableDisplayConfig?: BaseUserConfig
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim?: number;
    lowMemoryMode?: boolean
    tfInstance?: any
}
//End of Config class types

//Start of Generic class types
export interface BaseDataOptionType {
    type?: number;
    index?: Array<string | number>
    columns?: string[]
    dtypes?: Array<string>
    config?: ConfigsType;
}
export interface NdframeInputDataType {
    data: any
    type?: number;
    index?: Array<string | number>
    columns?: string[]
    dtypes?: Array<string>
    config?: ConfigsType;
    isSeries: boolean;
}
export interface LoadArrayDataType {
    data: ArrayType1D | ArrayType2D
    index?: Array<string | number>
    columns?: string[]
    dtypes?: Array<string>
}

export interface LoadObjectDataType {
    data: object | Array<object>
    type?: number;
    index?: Array<string | number>
    columns?: string[]
    dtypes?: Array<string>
}

export type AxisType = {
    index: Array<string | number>
    columns: Array<string | number>
}

export interface NDframeInterface {
    config: ConfigsType;
    $setDtypes(dtypes: Array<string>, infer: boolean): void;
    $setIndex(index: Array<string | number>): void;
    $resetIndex(): void;
    $setColumnNames(columns: string[]): void

    get dtypes(): Array<string>;
    get ndim(): number;
    get axis(): AxisType;
    get index(): Array<string | number>;
    get columns(): string[]
    get shape(): Array<number>;
    get values(): ArrayType1D | ArrayType2D
    get tensor(): Tensor;
    get size(): number;
    toCSV(options?: CsvOutputOptions): string | void
    toJSON(options?: { format?: "row" | "column", filePath?: string }): object | void
    toExcel(options?: { filePath?: string, sheetName?: string }): void
    print(): void;
}
//End of Generic class types


export type CsvOutputOptions = { filePath?: string, sep?: string, header?: boolean }
export interface CsvInputOptions extends ParseConfig { }


//Start of Series class types
export interface SeriesInterface extends NDframeInterface {
    iloc(rows: Array<string | number>): Series;
    head(rows: number): Series
    tail(rows: number): Series
    sample(num: number, options?: { seed?: number }): Promise<Series>;
    add(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void;
    sub(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void;
    mul(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void;
    div(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void;
    pow(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void;
    mod(other: Series | number | Array<number>, options?: { inplace?: boolean }): Series | void;
    mean(): number
    median(): number
    mode(): number
    min(): number
    max(): number
    sum(): number
    count(): number
    maximum(other: Series | number | Array<number>): Series
    minimum(other: Series | number | Array<number>): Series
    round(dp: number, options?: { inplace?: boolean }): Series | void
    std(): number
    var(): number
    isNa(): Series
    fillNa(value: number | string | boolean, options?: { inplace?: boolean }): Series | void
    sortValues(ascending: boolean, options?: { inplace?: boolean }): Series | void
    copy(): Series
    describe(): Series
    resetIndex(options?: { inplace?: boolean }): Series | void
    setIndex(index: Array<number | string | (number | string)>, options?: { inplace?: boolean }): Series | void
    map(
        callable: any,
        options?: { inplace?: boolean })
        : Series | void
    apply(
        callable: any,
        options?: { inplace?: boolean }): Series | void
    unique(): Series
    nUnique(): number
    valueCounts(): Series
    abs(options?: { inplace?: boolean }): Series | void
    cumSum(options?: { inplace?: boolean }): Series | void
    cumMin(options?: { inplace?: boolean }): Series | void
    cumMax(options?: { inplace?: boolean }): Series | void
    cumProd(options?: { inplace?: boolean }): Series | void
    lt(other: Series | number | Array<number>): Series
    gt(other: Series | number | Array<number>): Series
    le(other: Series | number | Array<number>): Series
    ge(other: Series | number | Array<number>): Series
    ne(other: Series | number | Array<number>): Series
    eq(other: Series | number | Array<number>): Series
    replace(oldValue: string | number | boolean, newValue: string | number | boolean, options?: { inplace?: boolean }): Series | void
    dropNa(options?: { inplace?: boolean }): Series | void
    argSort(): Series
    argMax(): number
    argMin(): number
    get dtype(): string
    dropDuplicates(options?: { keep?: "first" | "last", inplace?: boolean }): Series | void
    asType(dtype: "float32" | "int32" | "string" | "boolean", options?: { inplace?: boolean }): Series | void
    get str(): Str
    get dt(): Dt
    append(values: Series | Array<number | string | boolean> | number | string | boolean,
        index: Array<number | string> | number | string,
        options?: { inplace?: boolean }): Series | void
    toString(): string;
    and(other: any): Series
    or(other: any): Series
    getDummies(options?: {
        columns?: string | Array<string>,
        prefix?: string | Array<string>,
        prefixSeparator?: string,
        inplace?: boolean
    }): DataFrame

}

//Start of Series class types
export interface DataFrameInterface extends NDframeInterface {
    drop(
        options:
            {
                columns?: Array<string>,
                index?: Array<string | number>,
                inplace?: boolean
            }
    ): DataFrame | void
    loc(options:
        {
            rows?: Array<string | number>,
            columns?: Array<string>
        }): DataFrame;
    iloc(options:
        {
            rows?: Array<string | number>,
            columns?: Array<string | number>
        }): DataFrame;
    head(rows?: number): DataFrame
    tail(rows?: number): DataFrame
    sample(num: number, options?: { seed?: number }): Promise<DataFrame>;
    add(other: DataFrame | Series | number, options?: { axis?: 0 | 1, inplace?: boolean }): DataFrame | void
    sub(other: DataFrame | Series | number, options?: { axis?: 0 | 1, inplace?: boolean }): DataFrame | void
    mul(other: DataFrame | Series | number, options?: { axis?: 0 | 1, inplace?: boolean }): DataFrame | void
    div(other: DataFrame | Series | number, options?: { axis?: 0 | 1, inplace?: boolean }): DataFrame | void
    pow(other: DataFrame | Series | number, options?: { axis?: 0 | 1, inplace?: boolean }): DataFrame | void
    mod(other: DataFrame | Series | number, options?: { axis?: 0 | 1, inplace?: boolean }): DataFrame | void
    mean(options?: { axis?: 0 | 1 }): Series
    median(options?: { axis?: 0 | 1 }): Series
    mode(options?: { axis?: 0 | 1, keep?: number }): Series
    min(options?: { axis?: 0 | 1 }): Series
    max(options?: { axis?: 0 | 1 }): Series
    std(options?: { axis?: 0 | 1 }): Series
    var(options?: { axis?: 0 | 1 }): Series
    sum(options?: { axis?: 0 | 1 }): Series
    count(options?: { axis?: 0 | 1 }): Series
    round(dp?: number, options?: { inplace: boolean }): DataFrame | void
    cumSum(options?: { axis?: 0 | 1 }): DataFrame | void
    cumMin(options?: { axis?: 0 | 1 }): DataFrame | void
    cumMax(options?: { axis?: 0 | 1 }): DataFrame | void
    cumProd(options?: { axis?: 0 | 1 }): DataFrame | void
    copy(): DataFrame
    resetIndex(options: { inplace?: boolean }): DataFrame | void
    setIndex(
        options:
            {
                index: Array<number | string | (number | string)>,
                column?: string,
                drop?: boolean,
                inplace?: boolean
            }
    ): DataFrame | void
    describe(): DataFrame
    selectDtypes(include: Array<string>): DataFrame
    abs(options?: { inplace?: boolean }): DataFrame | void
    query(condition: Series | Array<boolean>, options?: { inplace?: boolean }): DataFrame | void
    addColumn(
        column: string,
        values: Series | ArrayType1D,
        options?: {
            inplace?: boolean
        }
    ): DataFrame | void
    groupby(column: [string, string]): any //Update to GroupBy class later
    column(column: string): Series
    fillNa(value: ArrayType1D,
        options:
            {
                columns?: Array<string>,
                inplace?: boolean
            }): DataFrame | void
    isNa(): DataFrame
    dropNa(axis?: 0 | 1, options?: { inplace?: boolean }): DataFrame | void
    apply(callable: any, options?: { axis?: 0 | 1 }): DataFrame | Series
    applyMap(callable: any, options?: { inplace?: boolean }): DataFrame | void
    lt(other: DataFrame | Series | number, options?: { axis?: 0 | 1 }): DataFrame
    gt(other: DataFrame | Series | number, options?: { axis?: 0 | 1 }): DataFrame
    le(other: DataFrame | Series | number, options?: { axis?: 0 | 1 }): DataFrame
    ge(other: DataFrame | Series | number, options?: { axis?: 0 | 1 }): DataFrame
    ne(other: DataFrame | Series | number, options?: { axis?: 0 | 1 }): DataFrame
    eq(other: DataFrame | Series | number, options?: { axis?: 0 | 1 }): DataFrame
    replace(
        oldValue: number | string | boolean,
        newValue: number | string | boolean,
        options?: {
            columns?: Array<string>
            inplace?: boolean
        }
    ): DataFrame | void
    transpose(options?: { inplace?: boolean }): DataFrame | void
    get T(): DataFrame
    get ctypes(): Series
    asType(
        column: string,
        dtype: "float32" | "int32" | "string" | "boolean",
        options?: { inplace?: boolean }
    ): DataFrame | void
    nUnique(axis: 0 | 1): Series
    rename(
        mapper: object,
        options?: {
            axis?: 0 | 1
            inplace?: boolean
        }
    ): DataFrame | void
    sortIndex(options?:
        {
            inplace?: boolean
            ascending?: boolean
        }
    ): DataFrame | void
    sortValues(
        column: string,
        options?:
            {
                inplace?: boolean
                ascending?: boolean
            }
    ): DataFrame | void
    append(
        newValues: ArrayType1D | Series | DataFrame,
        index: Array<number | string> | number | string,
        options?: {
            inplace?: boolean,
        }
    ): DataFrame | void
    toString(): string;
    getDummies(options?: {
        columns?: string | Array<string>,
        prefix?: string | Array<string>,
        prefixSeparator?: string,
        inplace?: boolean
    }): DataFrame | void

}

export interface DateTime {
    month(): Series
    day(): Series
    year(): Series
    monthName(): Series
    dayOfMonth(): Series
    hours(): Series
    seconds(): Series
    minutes(): Series
}
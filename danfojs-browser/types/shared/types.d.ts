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
import { DataFrame } from '../core/frame';
import { Tensor } from '@tensorflow/tfjs-node';
import Series from '../core/series';
import { BaseUserConfig, TableUserConfig } from "table";
import Str from '../core/strings';
import Dt from '../core/datetime';
import { ParseConfig } from 'papaparse';
import { GroupBy } from '../core/groupby';
import { Plot } from "../plotting/plot";

export declare type DTYPES = "float32" | "int32" | "string" | "boolean" | "undefined";
export declare type ArrayType2D = Array<number[] | string[] | boolean[] | (number | string | boolean)[]>;
export declare type ArrayType1D = Array<number | string | boolean | (number | string | boolean)>;
export declare type ConfigsType = {
    tableDisplayConfig?: BaseUserConfig & TableUserConfig;
    tableMaxRow?: number;
    tableMaxColInConsole?: number;
    dtypeTestLim?: number;
    lowMemoryMode?: boolean;
    tfInstance?: any;
};
export interface BaseDataOptionType {
    type?: number;
    index?: Array<string | number>;
    columns?: string[];
    dtypes?: Array<string>;
    config?: ConfigsType;
}
export interface NdframeInputDataType {
    data: any;
    type?: number;
    index?: Array<string | number>;
    columns?: string[];
    dtypes?: Array<string>;
    config?: ConfigsType;
    isSeries: boolean;
}
export interface LoadArrayDataType {
    data: ArrayType1D | ArrayType2D;
    index?: Array<string | number>;
    columns?: string[];
    dtypes?: Array<string>;
}
export interface LoadObjectDataType {
    data: object | Array<object>;
    type?: number;
    index?: Array<string | number>;
    columns?: string[];
    dtypes?: Array<string>;
}
export declare type AxisType = {
    index: Array<string | number>;
    columns: Array<string | number>;
};
export interface NDframeInterface {
    config?: ConfigsType;
    $setDtypes(dtypes: Array<string>, infer: boolean): void;
    $setIndex(index: Array<string | number>): void;
    $resetIndex(): void;
    $setColumnNames(columns: string[]): void;
    get dtypes(): Array<string>;
    get ndim(): number;
    get axis(): AxisType;
    get index(): Array<string | number>;
    get columns(): string[];
    get shape(): Array<number>;
    get values(): ArrayType1D | ArrayType2D;
    get tensor(): Tensor;
    get size(): number;
    to_csv(options?: CsvOutputOptionsNode): string | void;
    to_json(options?: {
        format?: "row" | "column";
        filePath?: string;
    }): object | void;
    to_excel(options?: {
        filePath?: string;
        sheetName?: string;
    }): void;
    print(): void;
}
export declare type CsvOutputOptionsNode = {
    filePath?: string;
    sep?: string;
    header?: boolean;
};
export type CsvOutputOptionsBrowser = { fileName?: string, sep?: string, header?: boolean, download?: boolean }
export interface CsvInputOptions extends ParseConfig {
}
export interface SeriesInterface extends NDframeInterface {
    iloc(rows: Array<string | number>): Series;
    head(rows: number): Series;
    tail(rows: number): Series;
    sample(num: number, options?: {
        seed?: number;
    }): Promise<Series>;
    add(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series | void;
    sub(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series | void;
    mul(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series | void;
    div(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series | void;
    pow(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series | void;
    mod(other: Series | number | Array<number>, options?: {
        inplace?: boolean;
    }): Series | void;
    mean(): number;
    median(): number;
    mode(): any;
    min(): number;
    max(): number;
    sum(): number;
    count(): number;
    maximum(other: Series | number | Array<number>): Series;
    minimum(other: Series | number | Array<number>): Series;
    round(dp: number, options?: {
        inplace?: boolean;
    }): Series | void;
    std(): number;
    var(): number;
    isna(): Series;
    fillna(options?: {
        value: number | string | boolean,
        inplace?: boolean;
    }): Series | void;
    sort_values(options?: {
        ascending?: boolean,
        inplace?: boolean;
    }): Series | void;
    copy(): Series;
    describe(): Series;
    reset_index(options?: {
        inplace?: boolean;
    }): Series | void;
    set_index(options?: {
        index: Array<number | string | (number | string)>,
        inplace?: boolean;
    }): Series | void;
    map(callable: any, options?: {
        inplace?: boolean;
    }): Series | void;
    apply(callable: any, options?: {
        inplace?: boolean;
    }): Series | void;
    unique(): Series;
    nunique(): number;
    value_counts(): Series;
    abs(options?: {
        inplace?: boolean;
    }): Series | void;
    cumsum(options?: {
        inplace?: boolean;
    }): Series | void;
    cummin(options?: {
        inplace?: boolean;
    }): Series | void;
    cummax(options?: {
        inplace?: boolean;
    }): Series | void;
    cumprod(options?: {
        inplace?: boolean;
    }): Series | void;
    lt(other: Series | number | Array<number>): Series;
    gt(other: Series | number | Array<number>): Series;
    le(other: Series | number | Array<number>): Series;
    ge(other: Series | number | Array<number>): Series;
    ne(other: Series | number | Array<number>): Series;
    eq(other: Series | number | Array<number>): Series;
    replace(options?: {
        oldValue: string | number | boolean,
        newValue: string | number | boolean,
        inplace?: boolean;
    }): Series | void;
    dropna(options?: {
        inplace?: boolean;
    }): Series | void;
    argsort(): Series;
    argmax(): number;
    argmin(): number;
    get dtype(): string;
    drop_duplicates(options?: {
        keep?: "first" | "last";
        inplace?: boolean;
    }): Series | void;
    astype(dtype: "float32" | "int32" | "string" | "boolean", options?: {
        inplace?: boolean;
    }): Series | void;
    get str(): Str;
    get dt(): Dt;
    append(values: string | number | boolean | Series | ArrayType1D, index: Array<number | string> | number | string, options?: {
        inplace?: boolean;
    }): Series | void;
    toString(): string;
    and(other: any): Series;
    or(other: any): Series;
    get_dummies(options?: {
        prefix?: string | Array<string>;
        prefixSeparator?: string | Array<string>;
        inplace?: boolean;
    }): DataFrame;
    plot(div: string): Plot
}
export interface DataFrameInterface extends NDframeInterface {
    [key: string]: any;
    drop(options: {
        columns?: string | Array<string>;
        index?: Array<string | number>;
        inplace?: boolean;
    }): DataFrame | void;
    loc(options: {
        rows?: Array<string | number>;
        columns?: Array<string>;
    }): DataFrame;
    iloc(options: {
        rows?: Array<string | number>;
        columns?: Array<string | number>;
    }): DataFrame;
    head(rows?: number): DataFrame;
    tail(rows?: number): DataFrame;
    sample(num: number, options?: {
        seed?: number;
    }): Promise<DataFrame>;
    add(other: DataFrame | Series | number | number[], options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    sub(other: DataFrame | Series | number | number[], options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    mul(other: DataFrame | Series | number | number[], options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    div(other: DataFrame | Series | number | number[], options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    pow(other: DataFrame | Series | number | number[], options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    mod(other: DataFrame | Series | number | number[], options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    mean(options?: {
        axis?: 0 | 1;
    }): Series;
    median(options?: {
        axis?: 0 | 1;
    }): Series;
    mode(options?: {
        axis?: 0 | 1;
        keep?: number;
    }): Series;
    min(options?: {
        axis?: 0 | 1;
    }): Series;
    max(options?: {
        axis?: 0 | 1;
    }): Series;
    std(options?: {
        axis?: 0 | 1;
    }): Series;
    var(options?: {
        axis?: 0 | 1;
    }): Series;
    sum(options?: {
        axis?: 0 | 1;
    }): Series;
    count(options?: {
        axis?: 0 | 1;
    }): Series;
    round(dp?: number, options?: {
        inplace: boolean;
    }): DataFrame | void;
    cumsum(options?: {
        axis?: 0 | 1;
    }): DataFrame | void;
    cummin(options?: {
        axis?: 0 | 1;
    }): DataFrame | void;
    cummax(options?: {
        axis?: 0 | 1;
    }): DataFrame | void;
    cumprod(options?: {
        axis?: 0 | 1;
    }): DataFrame | void;
    copy(): DataFrame;
    reset_index(options: {
        inplace?: boolean;
    }): DataFrame | void;
    set_index(options: {
        index: Array<number | string | (number | string)>;
        column?: string;
        drop?: boolean;
        inplace?: boolean;
    }): DataFrame | void;
    describe(): DataFrame;
    select_dtypes(include: Array<string>): DataFrame;
    abs(options?: {
        inplace?: boolean;
    }): DataFrame | void;
    query(options: {
        column?: string,
        is?: string,
        to?: any,
        condition?: Series | Array<boolean>,
        inplace?: boolean
    }): DataFrame | void
    addColumn(options: {
        column: string,
        values: Series | ArrayType1D,
        inplace?: boolean;
    }): DataFrame | void;
    column(column: string): Series;
    fillna(value: ArrayType1D, options?: {
        columns?: Array<string>;
        inplace?: boolean;
    }): DataFrame | void;
    isna(): DataFrame;
    dropna(axis?: 0 | 1, options?: {
        inplace?: boolean;
    }): DataFrame | void;
    apply(callable: any, options?: {
        axis?: 0 | 1;
    }): DataFrame | Series;
    apply_map(callable: any, options?: {
        inplace?: boolean;
    }): DataFrame | void;
    lt(other: DataFrame | Series | number, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    gt(other: DataFrame | Series | number, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    le(other: DataFrame | Series | number, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    ge(other: DataFrame | Series | number, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    ne(other: DataFrame | Series | number, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    eq(other: DataFrame | Series | number, options?: {
        axis?: 0 | 1;
    }): DataFrame;
    replace(oldValue: number | string | boolean, newValue: number | string | boolean, options?: {
        columns?: Array<string>;
        inplace?: boolean;
    }): DataFrame | void;
    transpose(options?: {
        inplace?: boolean;
    }): DataFrame | void;
    get T(): DataFrame;
    get ctypes(): Series;
    astype(options?: {
        column: string,
        dtype: "float32" | "int32" | "string" | "boolean",
        inplace?: boolean;
    }): DataFrame | void;
    nunique(axis: 0 | 1): Series;
    rename(mapper: object, options?: {
        axis?: 0 | 1;
        inplace?: boolean;
    }): DataFrame | void;
    sort_index(options?: {
        inplace?: boolean;
        ascending?: boolean;
    }): DataFrame | void;
    sort_values(options?: {
        by: string,
        ascending?: boolean;
        inplace?: boolean;
    }): DataFrame | void;
    append(newValues: ArrayType1D | ArrayType2D | Series | DataFrame, index: Array<number | string> | number | string, options?: {
        inplace?: boolean;
    }): DataFrame | void;
    toString(): string;
    get_dummies(options?: {
        columns?: string | Array<string>;
        prefix?: string | Array<string>;
        prefixSeparator?: string | Array<string>;
        inplace?: boolean;
    }): DataFrame | void;
    groupby(column: string): GroupBy;
    plot(div: string): Plot

}
export interface DateTime {
    month(): Series;
    day(): Series;
    year(): Series;
    month_name(): Series;
    monthday(): Series;
    weekdays(): Series;
    hours(): Series;
    seconds(): Series;
    minutes(): Series;
}

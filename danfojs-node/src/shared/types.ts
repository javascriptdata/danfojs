import DataFrame from '@base/core/frame';
import { Tensor } from '@tensorflow/tfjs-node';
import Series from '../core/series';
import { BaseUserConfig } from "table"

export enum DTYPES {
    float32,
    int32,
    string,
    boolean,
    undefined
}

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
    useTfjsMathFunctions?: boolean
}
//End of Config class types

//Start of Generic class types
export interface BaseDataOptionType {
    type?: number;
    index?: Array<string | number>
    columnNames?: string[]
    dtypes?: Array<string>
    config?: ConfigsType;
}
export interface NdframeInputDataType {
    data: any
    type?: number;
    index?: Array<string | number>
    columnNames?: string[]
    dtypes?: Array<string>
    config?: ConfigsType;
    isSeries: boolean;
}
export interface LoadArrayDataType {
    data: ArrayType1D | ArrayType2D
    index?: Array<string | number>
    columnNames?: string[]
    dtypes?: Array<string>
}

export interface LoadObjectDataType {
    data: object | Array<object>
    type?: number;
    index?: Array<string | number>
    columnNames?: string[]
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
    $setColumnNames(columnNames: string[]): void

    get dtypes(): Array<string>;
    get ndim(): number;
    get axis(): AxisType;
    get index(): Array<string | number>;
    get columnNames(): string[]
    get shape(): Array<number>;
    get values(): ArrayType1D | ArrayType2D
    get tensor(): Tensor;
    get size(): number;
    toCsv(): Promise<String>;
    toJson(): Promise<String>;
    print(): void;
}
//End of Generic class types

//Start of Series class types
export interface SeriesInterface extends NDframeInterface {
    iloc(rows: Array<string | number>): Series;
    head(rows?: number): Series
    tail(rows?: number): Series
    sample(num: number, options: { seed: number }): Promise<Series>;
    add(other: Series | number, options: { inplace: boolean }): Series | void;
    sub(other: Series | number, options: { inplace: boolean }): Series | void;
    mul(other: Series | number, options: { inplace: boolean }): Series | void;
    div(other: Series | number, options: { inplace: boolean }): Series | void;
    pow(other: Series | number, options: { inplace: boolean }): Series | void;
    mod(other: Series | number, options: { inplace: boolean }): Series | void;
    mean(): number
    median(): number
    mode(): number
    min(): number
    max(): number
    sum(): number
    count(): number
    maximum(other: Series | number): Series
    minimum(other: Series | number): Series
    round(dp: number, options: { inplace: boolean }): Series | void
    std(): number
    var(): number
    isNa(): Series
    fillNa(value: number | string | boolean, options: { inplace: boolean }): Series | void
    sortValues(ascending: boolean, options: { inplace: boolean }): Series | void
    copy(): Series
    describe(): Series
    resetIndex(options: { inplace: boolean }): Series | void
    setIndex(index: Array<number | string | (number | string)>, options: { inplace: boolean }): Series | void
    map(
        callable: any,
        options: { inplace: boolean })
        : Series | void
    apply(callable: any): Series | void
    unique(): Series
    nUnique(): number
    valueCounts(): Series
    abs(options: { inplace: boolean }): Series | void
    cumSum(options: { inplace: boolean }): Series | void
    cumMin(options: { inplace: boolean }): Series | void
    cumMax(options: { inplace: boolean }): Series | void
    cumProd(options: { inplace: boolean }): Series | void
    lt(other: Series | number): Series
    gt(other: Series | number): Series
    le(other: Series | number): Series
    ge(other: Series | number): Series
    ne(other: Series | number): Series
    eq(other: Series | number): Series
    replace(oldValue: string | number | boolean, newValue: string | number | boolean, options: { inplace: boolean }): Series | void
    dropNa(options: { inplace: boolean }): Series | void
    argSort(): Series
    argMax(): number
    argMin(): number
    get dtype(): string
    dropDuplicates(keep: "first" | "last", options: { inplace: boolean }): Series | void
    asType(dtype: "float32" | "int32" | "string" | "boolean" | "undefined", options: { inplace: boolean }): Series | void
    get str(): any //Change to STR class type later
    get dt(): any //Change to DT class type later
    append(newValues: Series | Array<number | string | boolean> | number | string | boolean,
        index: Array<number | string> | number | string,
        options: { inplace: boolean }): Series | void
    toString(): string;

}

//Start of Series class types
export interface DataFrameInterface extends NDframeInterface {
    drop(args:
        {
            columns: Array<string>,
            index?: Array<string | number>,
            inplace?: boolean,
            axis?: 0 | 1,
        }
    ): DataFrame
    loc(args:
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
    sample(num: number, options: { seed: number }): Promise<DataFrame>;
    add(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    sub(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    mul(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    div(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    pow(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    mod(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    mean(axis?: 0 | 1): Series
    median(axis?: 0 | 1): Series
    mode(axis?: 0 | 1): Series
    min(axis?: 0 | 1): Series
    max(axis?: 0 | 1): Series
    std(axis?: 0 | 1): Series
    var(axis?: 0 | 1): Series
    sum(axis?: 0 | 1): Series
    count(axis?: 0 | 1): Series
    round(dp: number): DataFrame
    cumSum(axis?: 0 | 1): DataFrame
    cumMin(axis?: 0 | 1): DataFrame
    cumMax(axis?: 0 | 1): DataFrame
    cumProd(axis?: 0 | 1): DataFrame
    copy(): DataFrame
    resetIndex(args: { inplace?: boolean }): DataFrame
    setIndex(args:
        {
            index: Array<number | string | (number | string)>,
            inplace?: boolean
        }
    ): DataFrame
    describe(): DataFrame
    selectDtypes(include: DTYPES): DataFrame
    abs(): DataFrame
    query(args: { column: string, is: string, to: string, inplace?: boolean }): DataFrame
    addColumn(args:
        {
            column: string,
            value: Series | ArrayType1D,
            inplace?: boolean
        }
    ): DataFrame
    groupby(column: [string, string]): any //Update to GroupBy class later
    column(columnName: string): Series
    fillNa(args:
        {
            columns: Array<string>,
            values: ArrayType2D,
            inplace?: boolean
        }
    ): DataFrame
    isNa(): DataFrame
    nanIndex(): Array<number>
    dropNa(args: { axis?: 0 | 1, inplace?: boolean }): DataFrame
    apply(args:
        {
            axis?: 0 | 1,
            callable: (val: number | string | boolean) => number | string | boolean
        }
    ): DataFrame
    lt(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    gt(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    le(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    ge(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    ne(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    eq(args: { other: DataFrame | number, axis?: 0 | 1 }): DataFrame
    replace(args:
        {
            replace: number | string | boolean,
            with: number | string | boolean,
            columns?: Array<string>
            inplace?: boolean
        }
    ): DataFrame
    transpose(): DataFrame
    get T(): DataFrame
    get ctypes(): Series
    asType(args:
        {
            column: string
            dtype: string,
            inplace?: boolean
        }
    ): DataFrame
    unique(axis: 0 | 1): Series
    nUnique(): Series
    rename(args:
        {
            mapper: number | string | boolean,
            inplace?: boolean
            axis?: 0 | 1
        }
    ): DataFrame
    sortIndex(args:
        {
            inplace?: boolean
            ascending?: boolean
        }
    ): DataFrame
    sortValues(args:
        {
            by: string,
            inplace?: boolean
            ascending?: boolean
        }
    ): DataFrame
    append(args:
        {
            value: ArrayType1D
            inplace?: boolean,
        }
    ): DataFrame
    toString(): string;

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
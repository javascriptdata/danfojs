import DataFrame from '@base/core/frame';
import { Tensor } from '@tensorflow/tfjs-node';
import Series from '../core/series';

export enum DTYPES {
    float32,
    int32,
    string,
    boolean,
    undefined
}
export enum KEEP {
    first,
    last
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
    tableWidth?: number;
    tableTruncate?: number;
    tableMaxRow?: number;
    tableMaxColInConsole?: number;
    dtypeTestLim?: number;
    lowMemoryMode: boolean
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
export interface NdframeInputDataType extends BaseDataOptionType {
    data: any
}

export interface LoadArrayDataType extends BaseDataOptionType {
    data: ArrayType1D | ArrayType2D
}

export interface LoadObjectDataType extends BaseDataOptionType {
    data: object | Array<object>
}

export type AxisType = {
    index: Array<string | number>
    columns: Array<string | number>
}

export interface NDframeInterface {
    $setDtypes(dtypes: Array<string>, infer: boolean): void;
    $setIndex(index: Array<string | number>): void;
    $resetIndex(): void;
    $setColumnNames(columnNames: string[]): void
    get dtypes(): Array<string>;
    get ndim(): number;
    get axis(): AxisType;
    get index(): Array<string | number>;
    get columnNames(): string[] | number[]
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
    iloc(args:
        {
            rows?: Array<string | number>,
        }): Series;
    head(rows?: number): Series
    tail(rows?: number): Series
    sample(num?: number, seed?: number): Promise<Series>;
    add(other: Series | number): Series
    sub(other: Series | number): Series
    mul(other: Series | number): Series
    div(other: Series | number, round?: boolean): Series
    pow(other: Series | number): Series
    mod(other: Series | number): Series
    mean(): number
    median(): number
    mode(): number
    min(): number
    max(): number
    sum(): number
    count(): number
    maximum(other: Series | number): Series
    minimum(other: Series | number): Series
    round(dp: number): Series
    std(): number
    var(): number
    isNa(): Series
    fillNa(args:
        {
            value: number | string | boolean,
            inplace?: boolean
        }
    ): Series
    sortValues(args:
        {
            inplace?: boolean
            ascending?: boolean
        }
    ): Series
    copy(): Series
    describe(): Series
    resetIndex(args: { inplace?: boolean }): Series
    setIndex(args:
        {
            index: Array<number | string | (number | string)>,
            inplace?: boolean
        }
    ): Series
    map(callable:
        object |
        ((val: number | string | boolean) => number | string | boolean))
        : Series
    apply(callable: (val: number | string | boolean) => number | string | boolean)
        : Series
    unique(): Series
    nUnique(): number
    valueCounts(): Series
    abs(): Series
    cumSum(): Series
    cumMin(): Series
    cumMax(): Series
    cumProd(): Series
    lt(other: Series | number): Series
    gt(other: Series | number): Series
    le(other: Series | number): Series
    ge(other: Series | number): Series
    ne(other: Series | number): Series
    eq(other: Series | number): Series
    replace(args:
        {
            replace: number | string | boolean,
            with: number | string | boolean,
            inplace?: boolean
        }
    ): Series
    dropNa(args: { inplace?: boolean }): Series
    argSort(): Series
    argMax(): Series
    argMin(): Series
    get dtype(): string
    dropDuplicates(args:
        {
            inplace: boolean,
            keep?: KEEP
        }): Series
    asType(dtype: DTYPES): Series
    get str(): any //Change to STR class type later
    get dt(): any //Change to DT class type later
    append(args:
        {
            value: Series | ArrayType1D | number | string | boolean
            inplace?: boolean,
        }): Series

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
            columns?: Array<string | number>
        }): DataFrame;
    iloc(args:
        {
            rows?: Array<string | number>,
            columns?: Array<string | number>
        }): DataFrame;
    head(rows?: number): DataFrame
    tail(rows?: number): DataFrame
    sample(num?: number, seed?: number): Promise<DataFrame>;
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

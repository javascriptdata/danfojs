import { Tensor } from '@tensorflow/tfjs-node';
import Series from '../series';

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
export type ArrayType = Array<
    number
    | number[]
    | string
    | string[]
    | boolean
    | boolean[]
    | (number | string | boolean)[]>

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
    data: ArrayType
}

export interface LoadObjectDataType extends BaseDataOptionType {
    data: object | Array<object>
}

export type AxisType = {
    index: Array<string | number>
    columns: Array<string | number>
}

export interface NDframeInterface {
    setDtypes(dtypes: Array<string>, infer: boolean): void;
    setIndex(index: Array<string | number>): void;
    resetIndex(): void;
    setColumnNames(columnNames: string[]): void
    get dtypes(): Array<string>;
    get ndim(): number;
    get axis(): AxisType;
    get index(): Array<string | number>;
    get columnNames(): string[] | number[]
    get shape(): Array<number>;
    get values(): ArrayType
    get tensor(): Tensor;
    get size(): number;
    toCsv(): Array<string | string[]>;
    toJson(): string;
    print(): void;
}

//End of Generic class types

//Start of Series class types

export type SeriesIlocType = {
    ndFrame: Series
    rows: Array<string | number>
}

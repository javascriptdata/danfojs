import { Tensor } from '@tensorflow/tfjs-node';


//Start of Config class types
export type ConfigsType = {
    tableWidth: number;
    tableTruncate: number;
    tableMaxRow: number;
    tableMaxColInConsole: number;
    dtypeTestLim: number;
}
//End of Config class types

//Start of Generic class types
export type ArrayType = Array<
    | number
    | number[]
    | string
    | string[]
    | boolean
    | boolean[]
    | (number | string | boolean)[]>

export interface BaseDataOptionType {
    type?: number;
    index?: Array<string | number>
    columnNames?: string[] | number[]
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
    loadArray({ data, index, columnNames, dtypes }: LoadArrayDataType): void;
    loadObject({ data, index, columnNames, dtypes }: LoadObjectDataType): void;
    setDtypes(dtypes: Array<string>, infer: boolean): void;
    get dtypes(): Array<string>;
    get ndim(): number;
    get axis(): AxisType;
    get index(): Array<string | number>;
    setIndex(index: Array<string | number>): void;
    resetIndex(): void;
    get columnNames(): string[] | number[]
    setColumnNames(columnNames: string[] | number[]): void
    get shape(): Array<number>;
    get values(): ArrayType
    get tensor(): Tensor;
    // isNaN(): Array<string | string[] | number | number[]>;
    get size(): number;
    // toCsv(): Array<string | string[]>;
    // toJson(): string;
    // toString(): string;
    print(): void;

}
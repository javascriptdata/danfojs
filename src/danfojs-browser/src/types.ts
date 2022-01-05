import { ParseConfig } from 'papaparse';
import { Config, Layout  } from "plotly.js-dist-min"


interface CustomConfig extends Config {
    x: string
    y: string,
    values: string,
    labels: string,
    rowPositions: number[],
    columnPositions: number[],
    grid: { rows: number, columns: number },
    tableHeaderStyle: any,
    tableCellStyle: any,
    columns: string[];
}

export type PlotConfigObject = {
    config: Partial<CustomConfig>
    layout: Partial<Layout>
}

export interface CsvInputOptions extends ParseConfig { }
export type ExcelInputOptions = { sheet?: number, method?: string, headers?: HeadersInit }
export type JsonInputOptions = { method?: string, headers?: HeadersInit }

export type CsvOutputOptionsBrowser = { fileName?: string, sep?: string, header?: boolean, download?: boolean };
export type ExcelOutputOptionsBrowser = { fileName?: string, sheetName?: string };
export type JsonOutputOptionsBrowser = { fileName?: string, format?: "row" | "column", download?: boolean };

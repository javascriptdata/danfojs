import { ParseConfig } from 'papaparse';

export interface CsvInputOptions extends ParseConfig { }
export type ExcelInputOptions = { sheet?: number, method?: string, headers?: HeadersInit }
export type JsonInputOptions = { method?: string, headers?: HeadersInit }

export type CsvOutputOptionsBrowser = { fileName?: string, sep?: string, header?: boolean, download?: boolean };
export type ExcelOutputOptionsBrowser = { fileName?: string, sheetName?: string };
export type JsonOutputOptionsBrowser = { fileName?: string, format?: "row" | "column", download?: boolean };

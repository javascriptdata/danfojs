import { ParseConfig } from 'papaparse';
export interface CsvInputOptions extends ParseConfig { }
export type CsvOutputOptionsNode = { filePath?: string, sep?: string, header?: boolean }
export type JsonOutputOptionsNode = { format?: "row" | "column", filePath?: string }
export type ExcelOutputOptionsNode = { filePath?: string, sheetName?: string }

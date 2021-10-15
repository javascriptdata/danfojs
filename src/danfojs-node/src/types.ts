import { ParseConfig } from 'papaparse';
export interface CsvInputOptions extends ParseConfig { }
export type CsvOutputOptionsNode = { filePath?: string, sep?: string, header?: boolean }

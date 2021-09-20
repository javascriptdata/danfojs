import fetch, { HeadersInit } from "node-fetch";
import { DataFrame, NDframe, Series } from '../index'
import XLSX from 'xlsx';
import { ArrayType1D, ArrayType2D } from '../shared/types';

/**
 * Reads a JSON file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to JSON file.
 * @param options Configuration object. Supported options:
 * - `method`: The HTTP method to use. Defaults to `'GET'`.
 * - `headers`: Additional headers to send with the request. Supports the `node-fetch` [HeadersInit]
 */
const $readExcel = async (filePath: string, options: { sheet?: number, method?: string, headers?: HeadersInit } = {}) => {
    const { sheet, method, headers } = { sheet: 0, method: "GET", headers: {}, ...options }

    if (filePath.startsWith("http") || filePath.startsWith("https")) {

        return new Promise(resolve => {
            fetch(filePath, { method, headers }).then(response => {
                if (response.status !== 200) {
                    throw new Error(`Failed to load ${filePath}`)
                }
                response.arrayBuffer().then(arrBuf => {
                    const arrBufInt8 = new Uint8Array(arrBuf);
                    const workbook = XLSX.read(arrBufInt8, { type: "array" })
                    const worksheet = workbook.Sheets[workbook.SheetNames[sheet]];
                    const data = XLSX.utils.sheet_to_json(worksheet);
                    const df = new DataFrame(data);
                    resolve(df);
                });
            }).catch((err) => {
                throw new Error(err)
            })
        })

    } else {
        return new Promise(resolve => {
            const workbook = XLSX.readFile(filePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[sheet]];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const df = new DataFrame(data);
            resolve(df);
        });
    }
};

/**
 * Converts a DataFrame or Series to Excel Sheet. 
 * @param df DataFrame or Series to be converted to JSON.
 * @param options Configuration object. Supported options:
 * - `sheetName`: The sheet name to be written to. Defaults to `'Sheet1'`.
 * - `filePath`: The filePath to be written to. Defaults to `'./output.xlsx'`.
 */
const $toExcel = (df: NDframe | DataFrame | Series, options?: { filePath?: string, sheetName?: string }) => {
    let { filePath, sheetName } = { filePath: "./output.xlsx", sheetName: "Sheet1", ...options }

    if (!(filePath.endsWith(".xlsx"))) {
        filePath = filePath + ".xlsx"
    }
    let data;

    if (df.$isSeries) {
        const row = df.values as ArrayType1D
        const col = df.columns
        data = [col, ...(row.map(x => [x]))]
    } else {
        const row = df.values as ArrayType2D
        const cols = df.columns
        data = [cols, ...row]
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, sheetName);
    XLSX.writeFile(wb, `${filePath}`)
};

export {
    $readExcel,
    $toExcel
}
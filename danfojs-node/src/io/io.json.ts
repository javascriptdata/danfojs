import { ArrayType1D, ArrayType2D, CsvInputOptions } from '../shared/types';
import fs from 'fs'
import { request } from 'http';
import fetch, { HeadersInit } from "node-fetch";
import Papa from 'papaparse';
import { DataFrame, Series } from '../index'


/**
 * Reads a JSON file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to JSON file.
 * @param options Configuration object. Supported options:
 * - `method`: The HTTP method to use. Defaults to `'GET'`.
 * - `headers`: Additional headers to send with the request. Supports the `node-fetch` [HeadersInit]
 */
const $readJSON = async (filePath: string, options: { method?: string, headers?: HeadersInit } = {}) => {
    const { method, headers } = { method: "GET", headers: {}, ...options }

    if (filePath.startsWith("http") || filePath.startsWith("https")) {

        return new Promise(resolve => {
            fetch(filePath, { method, headers }).then(response => {
                if (response.status !== 200) {
                    throw new Error(`Failed to load ${filePath}`)
                }
                response.json().then(json => {
                    resolve(new DataFrame(json));
                });
            }).catch((err) => {
                throw new Error(err)
            })
        })

    } else {
        return new Promise(resolve => {
            const file = fs.readFileSync(filePath, "utf8")
            const df = new DataFrame(JSON.parse(file));
            resolve(df);
        });
    }
};

/**
 * Streams a CSV file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param options Configuration object. Supports all Papaparse parse config options.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 */
// const $streamCSV = async (filePath: string, options: CsvInputOptions, callback: (df: DataFrame) => void): Promise<null> => {

//     if (filePath.startsWith("http") || filePath.startsWith("https")) {
//         return new Promise(resolve => {
//             const dataStream = request.get(filePath);
//             const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, options);
//             dataStream.pipe(parseStream);

//             parseStream.on("data", (chunk: any) => {
//                 const df = new DataFrame([chunk]);
//                 callback(df);
//             });

//             parseStream.on("finish", () => {
//                 resolve(null);
//             });

//         });
//     } else {
//         const fileStream = fs.createReadStream(filePath)

//         return new Promise(resolve => {
//             Papa.parse(fileStream, {
//                 ...options,
//                 step: results => {
//                     const df = new DataFrame([results.data]);
//                     callback(df);
//                 },
//                 complete: () => resolve(null)
//             });
//         });
//     }
// };


/**
 * Converts a DataFrame or Series to JSON. 
 * @param df DataFrame or Series to be converted to JSON.
 * @param options Configuration object. Supported options:
 * - `format`: The format of the JSON. Defaults to `'column'`. E.g for using `column` format:
 * ```
 * [{ "a": 1, "b": 2, "c": 3, "d": 4 },
 *  { "a": 5, "b": 6, "c": 7, "d": 8 }]
 * ```
 * and `row` format:
 * ```
 * { "a": [1, 5, 9],
 *  "b": [2, 6, 10]
 * }
 * ```
 */
const $toJSON = (df: DataFrame | Series, options?: { format?: "row" | "column" }): object => {
    const { format } = { format: "column", ...options }

    if (df.$isSeries) {
        const obj: { [key: string]: ArrayType1D } = {};
        obj[df.columns[0]] = df.values as ArrayType1D;
        return obj
    } else {
        const values = df.values as ArrayType2D
        const header = df.columns
        const jsonArr: any = [];

        if (format === "row") {
            const obj: { [key: string]: ArrayType1D } = {};
            for (let i = 0; i < df.columns.length; i++) {
                obj[df.columns[i]] = (df as DataFrame).column(df.columns[i]).values as ArrayType1D;
            }
            return obj
        } else {
            values.forEach((val) => {
                const obj: any = {};
                header.forEach((h, i) => {
                    obj[h] = val[i]
                });
                jsonArr.push(obj);
            });
            return jsonArr
        }
    }
};


export {
    $readJSON,
    $toJSON
}
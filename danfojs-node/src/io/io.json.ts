import fs from 'fs'
import request from "request"
import { parser } from "stream-json"
import fetch, { HeadersInit } from "node-fetch";
import { DataFrame, NDframe, Series } from '../index'
import { streamArray } from "stream-json/streamers/StreamArray"
import { ArrayType1D, ArrayType2D } from '../shared/types';

/**
 * Reads a JSON file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to JSON file.
 * @param options Configuration object. Supported options:
 * - `method`: The HTTP method to use. Defaults to `'GET'`.
 * - `headers`: Additional headers to send with the request. Supports the `node-fetch` [HeadersInit]
 * @example
 * ```
 * import { readJSON } from "danfojs-node"
 * const df = await readJSON("https://raw.githubusercontent.com/test.json")
 * ```
 * @example
 * ```
 * import { readJSON } from "danfojs-node"
 * const df = await readJSON("https://raw.githubusercontent.com/test.json", {
 *    headers: {
 *      Accept: "text/json",
 *      Authorization: "Bearer YWRtaW46YWRtaW4="
 *    }
 * })
 * ```
 * @example
 * ```
 * import { readJSON } from "danfojs-node"
 * const df = await readJSON("./data/sample.json")
 * ```
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
 * Streams a JSON file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file.
 * @param options Configuration object. We use the `request` library for reading remote json files,
 * Hence all `request` parameters such as `method`, `headers`, are supported.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 * @example
 * ```
 * import { streamJSON } from "danfojs-node"
 * streamJSON("https://raw.githubusercontent.com/test.json", {}, (dfRow) => {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * })
 * ```
 */
const $streamJSON = async (
    filePath: string,
    callback: (df: DataFrame) => void,
    options?: request.RequiredUriUrl & request.CoreOptions,
) => {
    const { method, headers } = { method: "GET", headers: {}, ...options }
    if (filePath.startsWith("http") || filePath.startsWith("https")) {
        return new Promise(resolve => {
            let count = -1
            const dataStream = request({ url: filePath, method, headers })
            const pipeline = dataStream.pipe(parser()).pipe(streamArray());
            pipeline.on('data', ({ value }) => {
                const df = new DataFrame([value], { index: [count++] });
                callback(df);
            });
            pipeline.on('end', () => resolve(null));

        });
    } else {
        return new Promise(resolve => {
            let count = -1
            const fileStream = fs.createReadStream(filePath)
            const pipeline = fileStream.pipe(parser()).pipe(streamArray());
            pipeline.on('data', ({ value }) => {
                const df = new DataFrame([value], { index: [count++] });
                callback(df);
            });
            pipeline.on('end', () => resolve(null));
        })
    }
};


/**
 * Converts a DataFrame or Series to JSON. 
 * @param df DataFrame or Series to be converted to JSON.
 * @param options Configuration object. Supported options:
 * - `filePath`: The file path to write the JSON to. If not specified, the JSON object is returned.
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
 * @example
 * ```
 * import { toJSON } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * const json = toJSON(df)
 * ```
 * @example
 * ```
 * import { toJSON } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * toJSON(df, {
 *     filePath: "./data/sample.json",
 *     format: "row"
 *   })
 * ```
 */
const $toJSON = (df: NDframe | DataFrame | Series, options?: { format?: "row" | "column", filePath?: string }): object | void => {
    let { filePath, format } = { filePath: undefined, format: "column", ...options }

    if (df.$isSeries) {
        const obj: { [key: string]: ArrayType1D } = {};
        obj[df.columns[0]] = df.values as ArrayType1D;
        if (filePath) {
            if (!filePath.endsWith(".json")) {
                filePath = filePath + ".json"
            }
            fs.writeFileSync(filePath, JSON.stringify(obj))
        } else {
            return obj
        }
    } else {
        const values = df.values as ArrayType2D
        const header = df.columns
        const jsonArr: any = [];

        if (format === "row") {
            const obj: { [key: string]: ArrayType1D } = {};
            for (let i = 0; i < df.columns.length; i++) {
                obj[df.columns[i]] = (df as DataFrame).column(df.columns[i]).values as ArrayType1D;
            }
            if (filePath !== undefined) {
                if (!(filePath.endsWith(".json"))) {
                    filePath = filePath + ".json"
                }

                fs.writeFileSync(filePath, JSON.stringify(obj), "utf8")
            } else {
                return obj
            }
        } else {
            values.forEach((val) => {
                const obj: any = {};
                header.forEach((h, i) => {
                    obj[h] = val[i]
                });
                jsonArr.push(obj);
            });
            if (filePath) {
                if (!filePath.endsWith(".json")) {
                    filePath = filePath + ".json"
                }
                fs.writeFileSync(filePath, JSON.stringify(jsonArr))
            } else {
                return jsonArr
            }
        }
    }
};


export {
    $readJSON,
    $toJSON,
    $streamJSON
}
import { JsonInputOptionsNode, JsonOutputOptionsNode } from '../../shared/types';
import { DataFrame, NDframe, Series } from '../../';
import request from "request";
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
declare const $readJSON: (filePath: string, options?: JsonInputOptionsNode) => Promise<unknown>;
/**
 * Streams a JSON file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 * @param options Configuration object. We use the `request` library for reading remote json files,
 * Hence all `request` parameters such as `method`, `headers`, are supported.
 * @example
 * ```
 * import { streamJSON } from "danfojs-node"
 * streamJSON("https://raw.githubusercontent.com/test.json", {}, (dfRow) => {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * })
 * ```
 */
declare const $streamJSON: (filePath: string, callback: (df: DataFrame) => void, options?: (request.RequiredUriUrl & request.CoreOptions) | undefined) => Promise<unknown>;
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
declare const $toJSON: (df: NDframe | DataFrame | Series, options?: JsonOutputOptionsNode | undefined) => object | void;
export { $readJSON, $toJSON, $streamJSON };

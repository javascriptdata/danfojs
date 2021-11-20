/// <reference types="node" />
import stream from "stream";
import { DataFrame, NDframe, Series } from '../index';
import { CsvInputOptions, CsvOutputOptionsNode } from "../shared/types";
/**
 * Reads a CSV file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param options Configuration object. Supports all Papaparse parse config options.
 * @returns DataFrame containing the parsed CSV file.
 * @example
 * ```
 * import { readCSV } from "danfojs-node"
 * const df = await readCSV("https://raw.githubusercontent.com/test.csv")
 * ```
 * @example
 * ```
 * import { readCSV } from "danfojs-node"
 * const df = await readCSV("https://raw.githubusercontent.com/test.csv", {
 *    delimiter: ",",
 *    headers: {
 *      Accept: "text/csv",
 *      Authorization: "Bearer YWRtaW46YWRtaW4="
 *    }
 * })
 * ```
 * @example
 * ```
 * import { readCSV } from "danfojs-node"
 * const df = await readCSV("./data/sample.csv")
 * ```
 */
declare const $readCSV: (filePath: string, options: CsvInputOptions) => Promise<DataFrame>;
/**
 * Streams a CSV file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param options Configuration object. Supports all Papaparse parse config options.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 * @example
 * ```
 * import { streamCSV } from "danfojs-node"
 * streamCSV("https://raw.githubusercontent.com/test.csv", (dfRow) => {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * })
 * ```
 */
declare const $streamCSV: (filePath: string, callback: (df: DataFrame) => void, options?: CsvInputOptions | undefined) => Promise<null>;
/**
 * Converts a DataFrame or Series to CSV.
 * @param df DataFrame or Series to be converted to CSV.
 * @param options Configuration object. Supports the following options:
 * - `filePath`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string.
 * - `header`: Boolean indicating whether to include a header row in the CSV file.
 * - `sep`: Character to be used as a separator in the CSV file.
 * @example
 * ```
 * import { toCSV } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * const csv = toCSV(df)
 * ```
 * @example
 * ```
 * import { toCSV } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * toCSV(df, {
 *     filePath: "./data/sample.csv",
 *     header: true,
 *     sep: "+"
 *   })
 * ```
 */
declare const $toCSV: (df: NDframe | DataFrame | Series, options?: CsvOutputOptionsNode | undefined) => string | void;
/**
 * Opens a CSV file from local or remote location as a Stream. Intermediate row is returned as a DataFrame object.
 * @param filePath URL or local file path to CSV file.
 * @param options Configuration object. Supports all Papaparse config options.
 * @example
 * ```
 * import { openCsvInputStream } from "danfojs-node"
 * const csvStream = openCsvInputStream("./data/sample.csv")
 * ```
 */
declare const $openCsvInputStream: (filePath: string, options: CsvInputOptions) => stream.Readable;
/**
 * Writes a file stream to local storage. Stream objects must be a Series or DataFrame.
 * @param filePath URL or local file path to write to.
 * @param options Configuration object. Supports all `toCSV` options.
 * @example
 * ```
 * import { openCsvInputStream,
 *         writeCsvOutputStream,
 *         convertFunctionTotransformer } from "danfojs-node"
 *
 * const csvStream = openCsvInputStream("./data/sample.csv")
 * const outStream = writeCsvOutputStream("./data/sampleOut.csv")
 *
 * const transformer = (dfRow) =>  {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * }
 * csvStream.pipe(convertFunctionTotransformer(transformer)).pipe(outStream)
 * ```
 */
declare const $writeCsvOutputStream: (filePath: string, options: CsvInputOptions) => stream.Writable;
export { $readCSV, $streamCSV, $toCSV, $writeCsvOutputStream, $openCsvInputStream, };

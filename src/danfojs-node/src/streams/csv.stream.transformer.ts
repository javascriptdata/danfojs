/**
*  @license
* Copyright 2022 JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/
import { CsvInputOptionsNode, CsvOutputOptionsNode } from "../../../danfojs-base/shared/types"
import { writeCsvOutputStreamNode, openCsvInputStreamNode } from "../../../danfojs-base/io/node"
import DataFrame from "../core/frame"
import stream from "stream"

/**
 * Converts a function to a pipe transformer. 
 * @param func The function to convert to a pipe transformer.
 * @returns A pipe transformer that applies the function to each row of object.
 * @example
 * ```
 * import { convertFunctionTotransformer } from "danfojs-node"
 * 
 * const renamer = (dfRow) => {
 *    const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *    return dfModified
 * }
 * const transformer = convertFunctionTotransformer(renamer)
 * ```
 * 
*/
const convertFunctionTotransformer = (func: (df: DataFrame) => DataFrame) => {
    const transformStream = new stream.Transform({ objectMode: true })
    transformStream._transform = (chunk: any, encoding, callback) => {
        const outputChunk = func(chunk)
        transformStream.push(outputChunk)
        callback()
    }
    return transformStream
}


/**
 * A pipeline transformer to stream a CSV file from local storage,
 *  transform it with custom transformer, and write to the output stream.
 * @param inputFilePath The path to the CSV file to stream from.
 * @param transformer The transformer function to apply to each row. Note that each row
 * of the CSV file is passed as a DataFrame with a single row to the transformer function, and 
 * the transformer function is expected to return a transformed DataFrame.
 * @param options Configuration options for the pipeline. Includes:
 * - `outputFilePath` The local file path to write the transformed CSV file to.
 * - `customCSVStreamWriter` A custom CSV stream writer function. This is applied at the end of each transform.
 * If not provided, the default CSV stream writer is used, and this writes to local storage.
 * - `inputStreamOptions` Configuration options for the input stream. Supports all Papaparse csv reader config options.
 * - `outputStreamOptions` Configuration options for the output stream. This only applies when
 * using the default CSV stream writer. Supports all `toCSV` options.
 * @returns A promise that resolves when the pipeline is complete.
 * @example
 * ```
 * import { streamCsvTransformer } from "danfojs-node"
 * 
 * const transformer = (dfRow) => {
 *   const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *  return dfModified
 * }
 * const inputFilePath = "./data/input.csv"
 * const outputFilePath = "./data/output.csv"
 * 
 * streamCsvTransformer(inputFilePath, transformer, { outputFilePath })
 * ```
*/
const streamCsvTransformer = (
    inputFilePath: string,
    transformer: (df: DataFrame) => DataFrame,
    options: {
        outputFilePath?: string,
        customCSVStreamWriter?: any,
        inputStreamOptions?: CsvInputOptionsNode,
        outputStreamOptions?: CsvOutputOptionsNode
    }) => {
    const { outputFilePath, customCSVStreamWriter, inputStreamOptions, outputStreamOptions } = {
        outputFilePath: "./",
        inputStreamOptions: {},
        outputStreamOptions: {},
        ...options
    }

    if (customCSVStreamWriter) {
        // @ts-ignore
        openCsvInputStreamNode(inputFilePath, inputStreamOptions)
            .pipe(convertFunctionTotransformer(transformer))
            .pipe(customCSVStreamWriter())
            .on("error", (err: any) => {
                console.error("An error occurred while transforming the CSV file")
                console.error(err)
            })
    } else {
        // @ts-ignore
        openCsvInputStreamNode(inputFilePath, inputStreamOptions)
            .pipe(convertFunctionTotransformer(transformer))
            // @ts-ignore
            .pipe(writeCsvOutputStreamNode(outputFilePath, outputStreamOptions))
            .on("error", (err: any) => {
                console.error("An error occurred while transforming the CSV file")
                console.error(err)
            })
    }
}

export {
    streamCsvTransformer,
    convertFunctionTotransformer
}

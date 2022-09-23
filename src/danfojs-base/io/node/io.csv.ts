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
import { CsvInputOptionsNode, CsvOutputOptionsNode, ArrayType2D } from "../../shared/types"
import { DataFrame, NDframe, Series } from '../../'
import request from "request"
import Papa from 'papaparse'
import stream from "stream"
import fs from 'fs'

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
const $readCSV = async (filePath: string, options?: CsvInputOptionsNode): Promise<DataFrame> => {
  const frameConfig = options?.frameConfig || {}

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise((resolve, reject) => {
      const optionsWithDefaults = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        ...options,
      }

      const dataStream = request.get(filePath);
      // reject any non-2xx status codes
      dataStream.on('response', (response: any) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });

      const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, optionsWithDefaults as any);
      dataStream.pipe(parseStream);

      const data: any = [];
      parseStream.on("data", (chunk: any) => {
        data.push(chunk);
      });

      parseStream.on("finish", () => {
        resolve(new DataFrame(data, frameConfig));
      });
    });

  } else {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject("ENOENT: no such file or directory");
        }

        const fileStream = fs.createReadStream(filePath)

        Papa.parse(fileStream, {
          header: true,
          dynamicTyping: true,
          ...options,
          complete: results => {
            const df = new DataFrame(results.data, frameConfig);
            resolve(df);
          }
        });
      })
    });
  }
};

/**
 * Streams a CSV file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 * @param options Configuration object. Supports all Papaparse parse config options.
 * @example
 * ```
 * import { streamCSV } from "danfojs-node"
 * streamCSV("https://raw.githubusercontent.com/test.csv", (dfRow) => {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * })
 * ```
 */
const $streamCSV = async (filePath: string, callback: (df: DataFrame) => void, options?: CsvInputOptionsNode): Promise<null> => {
  const frameConfig = options?.frameConfig || {}

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    const optionsWithDefaults = {
      header: true,
      dynamicTyping: true,
      ...options,
    }
    return new Promise((resolve, reject) => {
      let count = -1
      const dataStream = request.get(filePath);

      // reject any non-2xx status codes
      dataStream.on('response', (response: any) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });

      const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, optionsWithDefaults);
      dataStream.pipe(parseStream);

      parseStream.on("data", (chunk: any) => {
        const df = new DataFrame([chunk], { ...frameConfig, index: [count++], });
        callback(df);
      });

      parseStream.on("finish", () => {
        resolve(null);
      });

    });
  } else {

    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject("ENOENT: no such file or directory");
        }

        const fileStream = fs.createReadStream(filePath)

        let count = -1
        Papa.parse(fileStream, {
          header: true,
          dynamicTyping: true,
          ...options,
          step: results => {
            const df = new DataFrame([results.data], { ...frameConfig, index: [count++] });
            callback(df);
          },
          complete: () => resolve(null)
        });
      });
    });
  }
};


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
const $toCSV = (df: NDframe | DataFrame | Series, options?: CsvOutputOptionsNode): string | void => {
  let { filePath, sep, header } = { sep: ",", header: true, filePath: undefined, ...options }

  if (df.$isSeries) {
    const csv = df.values.join(sep);

    if (filePath !== undefined) {
      if (!(filePath.endsWith(".csv"))) {
        filePath = filePath + ".csv"
      }
      fs.writeFileSync(filePath, csv, "utf8")
    } else {
      return csv;
    }
  } else {
    const rows = df.values as ArrayType2D
    let csvStr = header === true ? `${df.columns.join(sep)}\n` : ""

    for (let i = 0; i < rows.length; i++) {
      const row = `${rows[i].join(sep)}\n`;
      csvStr += row;
    }

    if (filePath !== undefined) {
      if (!(filePath.endsWith(".csv"))) {
        filePath = filePath + ".csv"
      }
      fs.writeFileSync(filePath, csvStr, "utf8")
    } else {
      return csvStr;
    }
  }
};


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
const $openCsvInputStream = (filePath: string, options: CsvInputOptionsNode) => {
  const { header } = { header: true, ...options }
  let isFirstChunk = true
  let ndFrameColumnNames: any = []

  const csvInputStream = new stream.Readable({ objectMode: true });
  csvInputStream._read = () => { };

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    const dataStream = request.get(filePath);

    // reject any non-2xx status codes
    dataStream.on('response', (response: any) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`);
      }
    });

    const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, { header, dynamicTyping: true, ...options });
    dataStream.pipe(parseStream);
    let count = -1

    parseStream.on("data", (chunk: any) => {
      if (isFirstChunk) {
        if (header === true) {
          ndFrameColumnNames = Object.keys(chunk)
        } else {
          ndFrameColumnNames = chunk
        }
        isFirstChunk = false
        return
      }

      const df = new DataFrame([Object.values(chunk)], {
        columns: ndFrameColumnNames,
        index: [count++]
      })
      csvInputStream.push(df);
    });

    parseStream.on("finish", () => {
      csvInputStream.push(null);
      return (null);
    });

    return csvInputStream;
  } else {
    const fileStream = fs.createReadStream(filePath)

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        throw new Error("ENOENT: no such file or directory");
      }

      let count = -1
      Papa.parse(fileStream, {
        ...{ header, dynamicTyping: true, ...options },
        step: results => {
          if (isFirstChunk) {
            if (header === true) {
              ndFrameColumnNames = results.meta.fields || []
            } else {
              ndFrameColumnNames = results.data
            }
            isFirstChunk = false
            return
          }

          const df = new DataFrame([results.data], {
            columns: ndFrameColumnNames,
            index: [count++]
          })

          csvInputStream.push(df);
        },
        complete: (result: any) => {
          csvInputStream.push(null);
          return null
        },
        error: (err) => {
          csvInputStream.emit("error", err);
        }
      });

      return csvInputStream;
    });
  }
};


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
const $writeCsvOutputStream = (filePath: string, options: CsvInputOptionsNode) => {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      throw new Error("ENOENT: no such file or directory");
    }

    let isFirstRow = true
    const fileOutputStream = fs.createWriteStream(filePath)
    const csvOutputStream = new stream.Writable({ objectMode: true })

    csvOutputStream._write = (chunk: DataFrame | Series, encoding, callback) => {

      if (chunk instanceof DataFrame) {

        if (isFirstRow) {
          isFirstRow = false
          fileOutputStream.write($toCSV(chunk, { header: true, ...options }));
          callback();
        } else {
          fileOutputStream.write($toCSV(chunk, { header: false, ...options }));
          callback();
        }

      } else if (chunk instanceof Series) {

        fileOutputStream.write($toCSV(chunk));
        callback();

      } else {
        csvOutputStream.emit("error", new Error("ValueError: Intermediate chunk must be either a Series or DataFrame"))
      }

    }

    csvOutputStream.on("finish", () => {
      fileOutputStream.end()
    })

    return csvOutputStream
  });
}




export {
  $readCSV,
  $streamCSV,
  $toCSV,
  $writeCsvOutputStream,
  $openCsvInputStream,
}

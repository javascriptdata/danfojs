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
import { CsvInputOptionsBrowser, CsvOutputOptionsBrowser, ArrayType2D } from "../../shared/types"
import { DataFrame, NDframe, Series } from '../../'
import Papa from 'papaparse'


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
const $readCSV = async (file: any, options?: CsvInputOptionsBrowser): Promise<DataFrame> => {
  const frameConfig = options?.frameConfig || {}

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      ...options,
      error: (error, file) => reject(error,file),
      download: true,
      complete: results => {
        const df = new DataFrame(results.data, frameConfig);
        resolve(df);
      }
    });
  });
};

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
const $streamCSV = async (file: string, callback: (df: DataFrame) => void, options: CsvInputOptionsBrowser,): Promise<null> => {
  const frameConfig = options?.frameConfig || {}

  return new Promise((resolve, reject) => {
    let count = 0
    Papa.parse(file, {
      ...options,
      dynamicTyping: true,
      header: true,
      download: true,
      step: results => {
        const df = new DataFrame([results.data], { ...frameConfig, index: [count++] });
        callback(df);
      },
      complete: () => resolve(null),
      error: (error, file) => reject(error,file)
    });
  });
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
const $toCSV = (df: NDframe | DataFrame | Series, options?: CsvOutputOptionsBrowser): string | void => {
  let { fileName, download, sep, header } = { fileName: "output.csv", sep: ",", header: true, download: false, ...options }

  if (df.$isSeries) {
    const csv = df.values.join(sep);

    if (download) {
      if (!(fileName.endsWith(".csv"))) {
        fileName = fileName + ".csv"
      }
      $downloadFileInBrowser(csv, fileName);
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

    if (download) {
      if (!(fileName.endsWith(".csv"))) {
        fileName = fileName + ".csv"
      }
      $downloadFileInBrowser(csvStr, fileName);
    } else {
      return csvStr;
    }
  }
};

/**
 * Internal function to download a CSV file in the browser.
 * @param content A string of CSV file contents
 * @param fileName  The name of the file to be downloaded
 */
const $downloadFileInBrowser = (content: any, fileName: string) => {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName;
  hiddenElement.click();
}


export {
  $readCSV,
  $streamCSV,
  $toCSV,
}

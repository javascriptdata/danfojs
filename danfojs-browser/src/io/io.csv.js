/**
*  @license
* Copyright 2021, JsData. All rights reserved.
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
import Papa from 'papaparse';
import { DataFrame } from '../index';


/**
 * Reads a CSV file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param options Configuration object. Supports all Papaparse parse config options. See https://papaparse.com/docs#config.
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
const $readCSV = async (filePath, options) => {
  options = { header: true, dynamicTyping: true, ...options };
  return new Promise((resolve) => {
    Papa.parse(filePath, {
      ...options,
      download: true,
      complete: (results) => {
        const df = new DataFrame(results.data);
        resolve(df);
      }
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
const $toCSV = (df, options) => {
  let { fileName, download, sep, header } = { fileName: "output.csv", sep: ",", header: true, download: true, ...options };

  if (df.$isSeries) {
    const csv = df.values.join(sep);

    if (download) {
      if (!(fileName.endsWith(".csv"))) {
        fileName = fileName + ".csv";
      }
      $downloadFileInBrowser(csv, fileName);
    } else {
      return csv;
    }
  } else {
    const rows = df.values;
    let csvStr = header === true ? `${df.columns.join(sep)}\n` : "";

    for (let i = 0; i < rows.length; i++) {
      const row = `${rows[i].join(sep)}\n`;
      csvStr += row;
    }

    if (download) {
      if (!(fileName.endsWith(".csv"))) {
        fileName = fileName + ".csv";
      }
      $downloadFileInBrowser(csvStr, fileName);
    } else {
      return csvStr;
    }
  }
};

/**
 * Function to download a CSV file in the browser.
 * @param content A string of CSV file contents
 * @param fileName  The name of the file to be downloaded
 */
const $downloadFileInBrowser = (content, fileName) => {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(content);
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName;
  hiddenElement.click();
};


export {
  $readCSV,
  $toCSV
};

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
import fs from 'fs';
import Papa from 'papaparse';
import request from "request";
import { DataFrame } from '../index';


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
const $readCSV = async (filePath, options) => {
  options = { header: true, dynamicTyping: true, ...options };
  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise((resolve) => {
      const dataStream = request.get(filePath);
      const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, options);
      dataStream.pipe(parseStream);

      const data = [];
      parseStream.on("data", (chunk) => {
        data.push(chunk);
      });

      parseStream.on("finish", () => {
        resolve(new DataFrame(data));
      });
    });

  } else {
    return new Promise((resolve) => {
      const fileStream = fs.createReadStream(filePath);
      Papa.parse(fileStream, {
        ...options,
        complete: (results) => {
          const df = new DataFrame(results.data);
          resolve(df);
        }
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
const $toCSV = (df, options) => {
  let { filePath, sep, header } = { sep: ",", header: true, filePath: undefined, ...options };

  if (df.$isSeries) {
    const csv = df.values.join(sep);

    if (filePath !== undefined) {
      if (!(filePath.endsWith(".csv"))) {
        filePath = filePath + ".csv";
      }
      fs.writeFileSync(filePath, csv, "utf8");
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

    if (filePath !== undefined) {
      if (!(filePath.endsWith(".csv"))) {
        filePath = filePath + ".csv";
      }
      fs.writeFileSync(filePath, csvStr, "utf8");
    } else {
      return csvStr;
    }
  }
};

export {
  $readCSV,
  $toCSV
};

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$toCSV = exports.$readCSV = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _papaparse = _interopRequireDefault(require("papaparse"));

var _request = _interopRequireDefault(require("request"));

var _index = require("../index");

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
const $readCSV = async (filePath, options) => {
  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      const dataStream = _request.default.get(filePath);

      const parseStream = _papaparse.default.parse(_papaparse.default.NODE_STREAM_INPUT, options);

      dataStream.pipe(parseStream);
      const data = [];
      parseStream.on("data", chunk => {
        data.push(chunk);
      });
      parseStream.on("finish", () => {
        resolve(new _index.DataFrame(data));
      });
    });
  } else {
    return new Promise(resolve => {
      const fileStream = _fs.default.createReadStream(filePath);

      _papaparse.default.parse(fileStream, { ...options,
        complete: results => {
          const df = new _index.DataFrame(results.data);
          resolve(df);
        }
      });
    });
  }
};

exports.$readCSV = $readCSV;

const $toCSV = (df, options) => {
  let {
    filePath,
    sep,
    header
  } = {
    sep: ",",
    header: true,
    filePath: undefined,
    ...options
  };

  if (df.$isSeries) {
    const csv = df.values.join(sep);

    if (filePath !== undefined) {
      if (!filePath.endsWith(".csv")) {
        filePath = filePath + ".csv";
      }

      _fs.default.writeFileSync(filePath, csv, "utf8");
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
      if (!filePath.endsWith(".csv")) {
        filePath = filePath + ".csv";
      }

      _fs.default.writeFileSync(filePath, csvStr, "utf8");
    } else {
      return csvStr;
    }
  }
};

exports.$toCSV = $toCSV;
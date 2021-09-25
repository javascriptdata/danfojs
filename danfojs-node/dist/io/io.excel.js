"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$toExcel = exports.$readExcel = void 0;

var _nodeFetch = _interopRequireWildcard(require("node-fetch"));

var _index = require("../index");

var _xlsx = _interopRequireDefault(require("xlsx"));

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
const $readExcel = async (filePath, options) => {
  const {
    sheet,
    method,
    headers
  } = {
    sheet: 0,
    method: "GET",
    headers: {},
    ...options
  };

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      (0, _nodeFetch.default)(filePath, {
        method,
        headers
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(`Failed to load ${filePath}`);
        }

        response.arrayBuffer().then(arrBuf => {
          const arrBufInt8 = new Uint8Array(arrBuf);

          const workbook = _xlsx.default.read(arrBufInt8, {
            type: "array"
          });

          const worksheet = workbook.Sheets[workbook.SheetNames[sheet]];

          const data = _xlsx.default.utils.sheet_to_json(worksheet);

          const df = new _index.DataFrame(data);
          resolve(df);
        });
      }).catch(err => {
        throw new Error(err);
      });
    });
  } else {
    return new Promise(resolve => {
      const workbook = _xlsx.default.readFile(filePath);

      const worksheet = workbook.Sheets[workbook.SheetNames[sheet]];

      const data = _xlsx.default.utils.sheet_to_json(worksheet);

      const df = new _index.DataFrame(data);
      resolve(df);
    });
  }
};

exports.$readExcel = $readExcel;

const $toExcel = (df, options) => {
  let {
    filePath,
    sheetName
  } = {
    filePath: "./output.xlsx",
    sheetName: "Sheet1",
    ...options
  };

  if (!filePath.endsWith(".xlsx")) {
    filePath = filePath + ".xlsx";
  }

  let data;

  if (df.$isSeries) {
    const row = df.values;
    const col = df.columns;
    data = [col, ...row.map(x => [x])];
  } else {
    const row = df.values;
    const cols = df.columns;
    data = [cols, ...row];
  }

  const worksheet = _xlsx.default.utils.aoa_to_sheet(data);

  const wb = _xlsx.default.utils.book_new();

  _xlsx.default.utils.book_append_sheet(wb, worksheet, sheetName);

  _xlsx.default.writeFile(wb, `${filePath}`);
};

exports.$toExcel = $toExcel;
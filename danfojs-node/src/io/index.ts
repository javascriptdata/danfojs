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
import {
    $readCSV,
    $streamCSV,
    $toCSV,
    $openCsvInputStream,
    $writeCsvOutputStream,
} from "./io.csv"
import {
    $readJSON,
    $toJSON,
    $streamJSON
} from "./io.json"
import { $readExcel,$toExcel } from "./io.excel"

const toCSV = $toCSV
const readCSV = $readCSV
const streamCSV = $streamCSV
const openCsvInputStream = $openCsvInputStream
const writeCsvOutputStream = $writeCsvOutputStream

const toJSON = $toJSON
const readJSON = $readJSON
const streamJSON = $streamJSON

const readExcel = $readExcel
const toExcel = $toExcel


export {
    readCSV,
    streamCSV,
    toCSV,
    openCsvInputStream,
    writeCsvOutputStream,
    readJSON,
    toJSON,
    streamJSON,
    readExcel,
    toExcel,
}
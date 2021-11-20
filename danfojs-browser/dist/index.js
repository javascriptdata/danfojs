"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.getDummies = exports.OneHotEncoder = exports.LabelEncoder = exports.StandardScaler = exports.MinMaxScaler = exports.toExcel = exports.readExcel = exports.toJSON = exports.readJSON = exports.toCSV = exports.streamCSV = exports.readCSV = exports.DataFrame = exports.Series = exports.toDateTime = exports.Dt = exports.Str = exports.Utils = exports.Config = exports.NDframe = void 0;
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
var generic_1 = __importDefault(require("./core/generic"));
exports.NDframe = generic_1.default;
var config_1 = __importDefault(require("./shared/config"));
exports.Config = config_1.default;
var utils_1 = __importDefault(require("./shared/utils"));
exports.Utils = utils_1.default;
var series_1 = __importDefault(require("./core/series"));
exports.Series = series_1.default;
var frame_1 = __importDefault(require("./core/frame"));
exports.DataFrame = frame_1.default;
var strings_1 = __importDefault(require("./core/strings"));
exports.Str = strings_1.default;
var datetime_1 = __importStar(require("./core/datetime"));
exports.Dt = datetime_1.default;
Object.defineProperty(exports, "toDateTime", { enumerable: true, get: function () { return datetime_1.toDateTime; } });
var io_1 = require("./io");
Object.defineProperty(exports, "readCSV", { enumerable: true, get: function () { return io_1.readCSV; } });
Object.defineProperty(exports, "toCSV", { enumerable: true, get: function () { return io_1.toCSV; } });
Object.defineProperty(exports, "streamCSV", { enumerable: true, get: function () { return io_1.streamCSV; } });
Object.defineProperty(exports, "readExcel", { enumerable: true, get: function () { return io_1.readExcel; } });
Object.defineProperty(exports, "toExcel", { enumerable: true, get: function () { return io_1.toExcel; } });
Object.defineProperty(exports, "readJSON", { enumerable: true, get: function () { return io_1.readJSON; } });
Object.defineProperty(exports, "toJSON", { enumerable: true, get: function () { return io_1.toJSON; } });
// import { streamCsvTransformer, convertFunctionTotransformer } from "./transformers/streams/csv.stream.transformer"
var min_max_scaler_1 = __importDefault(require("./transformers/scalers/min.max.scaler"));
exports.MinMaxScaler = min_max_scaler_1.default;
var standard_scaler_1 = __importDefault(require("./transformers/scalers/standard.scaler"));
exports.StandardScaler = standard_scaler_1.default;
var label_encoder_1 = __importDefault(require("./transformers/encoders/label.encoder"));
exports.LabelEncoder = label_encoder_1.default;
var one_hot_encoder_1 = __importDefault(require("./transformers/encoders/one.hot.encoder"));
exports.OneHotEncoder = one_hot_encoder_1.default;
var dummy_encoder_1 = __importDefault(require("./transformers/encoders/dummy.encoder"));
exports.getDummies = dummy_encoder_1.default;
var concat_1 = __importDefault(require("./transformers/concat"));
exports.concat = concat_1.default;

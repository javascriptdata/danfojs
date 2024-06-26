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
import NDframe from "./core/generic";
import Config from './shared/config';
import Utils from './shared/utils';
import Series from "./core/series";
import DataFrame from "./core/frame";
import Str from "./core/strings";
import Dt, { toDateTime } from "./core/datetime";
import MinMaxScaler from "./transformers/scalers/min.max.scaler";
import StandardScaler from "./transformers/scalers/standard.scaler";
import LabelEncoder from "./transformers/encoders/label.encoder";
import OneHotEncoder from "./transformers/encoders/one.hot.encoder";
import getDummies from "./transformers/encoders/dummy.encoder";
import concat from "./transformers/concat";
import merge from "./transformers/merge";
import dateRange from "./core/daterange";
import tensorflow from "./shared/tensorflowlib";
declare const __version = "1.1.2";
export { NDframe, Config, Utils, Str, Dt, toDateTime, Series, DataFrame, MinMaxScaler, StandardScaler, LabelEncoder, OneHotEncoder, getDummies, concat, merge, dateRange, tensorflow, __version, };

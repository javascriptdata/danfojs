"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDateTime = exports.default = void 0;

var _series = _interopRequireDefault(require("./series"));

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
const MONTH_NAME = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEK_NAME = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

class TimeSeries {
  constructor(data) {
    if (data instanceof _series.default) {
      this.$dateObjectArray = this.processData(data.values);
    } else {
      this.$dateObjectArray = this.processData(data);
    }
  }

  processData(dateArray) {
    const values = dateArray.map(dateString => new Date(`${dateString}`));
    return values;
  }

  month() {
    const newValues = this.$dateObjectArray.map(date => date.getMonth());
    return new _series.default(newValues);
  }

  day() {
    const newValues = this.$dateObjectArray.map(date => date.getDay());
    return new _series.default(newValues);
  }

  year() {
    const newValues = this.$dateObjectArray.map(date => date.getFullYear());
    return new _series.default(newValues);
  }

  month_name() {
    const newValues = this.$dateObjectArray.map(date => MONTH_NAME[date.getMonth()]);
    return new _series.default(newValues);
  }

  weekdays() {
    const newValues = this.$dateObjectArray.map(date => WEEK_NAME[date.getDay()]);
    return new _series.default(newValues);
  }

  monthday() {
    const newValues = this.$dateObjectArray.map(date => date.getDate());
    return new _series.default(newValues);
  }

  hours() {
    const newValues = this.$dateObjectArray.map(date => date.getHours());
    return new _series.default(newValues);
  }

  seconds() {
    const newValues = this.$dateObjectArray.map(date => date.getSeconds());
    return new _series.default(newValues);
  }

  minutes() {
    const newValues = this.$dateObjectArray.map(date => date.getMinutes());
    return new _series.default(newValues);
  }

}

exports.default = TimeSeries;

const toDateTime = data => {
  return new TimeSeries(data);
};

exports.toDateTime = toDateTime;
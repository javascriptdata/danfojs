"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._genericMathOp = _genericMathOp;

var _series = _interopRequireDefault(require("./series"));

var _utils = require("../shared/utils");

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
function _genericMathOp({
  ndFrame,
  other,
  operation
}) {
  if (typeof other === 'number') {
    let newData;

    switch (operation) {
      case 'add':
        newData = ndFrame.values.map(ele => ele + other);
        return newData;

      case 'sub':
        newData = ndFrame.values.map(ele => ele - other);
        return newData;

      case 'mul':
        newData = ndFrame.values.map(ele => ele * other);
        return newData;

      case 'div':
        newData = ndFrame.values.map(ele => ele / other);
        return newData;

      case 'mod':
        newData = ndFrame.values.map(ele => ele % other);
        return newData;

      case 'pow':
        newData = ndFrame.values.map(ele => ele ** other);
        return newData;

      case 'minimum':
        newData = ndFrame.values.map(ele => Math.min(ele, other));
        return newData;

      case 'maximum':
        newData = ndFrame.values.map(ele => Math.max(ele, other));
        return newData;

      default:
        throw new Error(`${operation} is not implemented`);
    }
  } else if (other instanceof _series.default) {
    _utils.utils.checkSeriesOpCompactibility({
      firstSeries: ndFrame,
      secondSeries: other,
      operation
    });

    let newData;

    switch (operation) {
      case 'add':
        newData = ndFrame.values.map((ele, index) => {
          return ele + other.values[index];
        });
        return newData;

      case 'sub':
        newData = ndFrame.values.map((ele, index) => {
          return ele - other.values[index];
        });
        return newData;

      case 'mul':
        newData = ndFrame.values.map((ele, index) => {
          return ele * other.values[index];
        });
        return newData;

      case 'div':
        newData = ndFrame.values.map((ele, index) => {
          return ele / other.values[index];
        });
        return newData;

      case 'mod':
        newData = ndFrame.values.map((ele, index) => {
          return ele % other.values[index];
        });
        return newData;

      case 'pow':
        newData = ndFrame.values.map((ele, index) => {
          return ele ** other.values[index];
        });
        return newData;

      case 'minimum':
        newData = ndFrame.values.map((ele, index) => {
          return Math.min(ele, other.values[index]);
        });
        return newData;

      case 'maximum':
        newData = ndFrame.values.map((ele, index) => {
          return Math.max(ele, other.values[index]);
        });
        return newData;

      default:
        throw new Error(`${operation} is not implemented`);
    }
  } else if (Array.isArray(other)) {
    if (other.length !== ndFrame.values.length) {
      throw new Error(`ParamError: Length of array must be equal to length of Series`);
    }

    let newData;

    switch (operation) {
      case 'add':
        newData = ndFrame.values.map((ele, index) => {
          return ele + other[index];
        });
        return newData;

      case 'sub':
        newData = ndFrame.values.map((ele, index) => {
          return ele - other[index];
        });
        return newData;

      case 'mul':
        newData = ndFrame.values.map((ele, index) => {
          return ele * other[index];
        });
        return newData;

      case 'div':
        newData = ndFrame.values.map((ele, index) => {
          return ele / other[index];
        });
        return newData;

      case 'mod':
        newData = ndFrame.values.map((ele, index) => {
          return ele % other[index];
        });
        return newData;

      case 'pow':
        newData = ndFrame.values.map((ele, index) => {
          return ele ** other[index];
        });
        return newData;

      case 'minimum':
        newData = ndFrame.values.map((ele, index) => {
          return Math.min(ele, other[index]);
        });
        return newData;

      case 'maximum':
        newData = ndFrame.values.map((ele, index) => {
          return Math.max(ele, other[index]);
        });
        return newData;
    }
  } else {
    throw new Error("ParamError: value for other not supported. It must be either a scalar, Array or Series");
  }
}
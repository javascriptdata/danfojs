"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = void 0;

var _defaults = require("./defaults");

var _config = _interopRequireDefault(require("./config"));

var _2 = require("..");

var _errors = _interopRequireDefault(require("./errors"));

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
const config = new _config.default(_defaults.BASE_CONFIG);

class Utils {
  removeElementFromArray(arr, index) {
    const newArr = arr.filter((_, i) => i != index);
    return newArr;
  }

  isString(value) {
    return typeof value === "string";
  }

  isNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  isObject(value) {
    return typeof value === "object" && value.constructor && value.constructor.name === "Object";
  }

  isNull(value) {
    return value === null;
  }

  isUndefined(value) {
    return typeof value === "undefined";
  }

  isEmpty(value) {
    return value === undefined || value === null || isNaN(value) && typeof value !== "string";
  }

  range(start, end) {
    if (end < start) {
      throw new Error("ParamError: end must be greater than start");
    }

    if (start === end) {
      return [start];
    }

    const arr = [];

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  }

  keyInObject(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  transposeArray(arr) {
    if (arr.length === 0) return arr;
    const rowLen = arr.length;

    if (Array.isArray(arr[0])) {
      const colLen = arr[0].length;
      const newArr = [];

      for (let i = 0; i <= colLen - 1; i++) {
        const temp = [];

        for (let j = 0; j < rowLen; j++) {
          const _elem = arr[j][i];
          temp.push(_elem);
        }

        newArr.push(temp);
      }

      return newArr;
    } else {
      return arr;
    }
  }

  getRowAndColValues(obj) {
    const colNames = Object.keys(obj);
    const colData = Object.values(obj);
    const firstColLen = colData[0].length;
    colData.forEach(cdata => {
      if (cdata.length != firstColLen) {
        throw Error("Length Error: Length of columns must be the same!");
      }
    });
    const rowsArr = this.transposeArray(colData);
    return [rowsArr, colNames];
  }

  convert2DArrayToSeriesArray(arr) {
    const newArr = arr.map(val => {
      if (this.isObject(val)) {
        return JSON.stringify(val);
      } else {
        return `${val}`;
      }
    });
    return newArr;
  }

  replaceUndefinedWithNaN(arr, isSeries) {
    if (arr.length === 0) return arr;

    if (isSeries && Array.isArray(arr)) {
      const newArr = arr.map(ele => {
        if (typeof ele === "undefined") {
          return NaN;
        }

        if (typeof ele === "number" && (isNaN(ele) || ele == Infinity)) {
          return NaN;
        }

        if (ele == null) {
          return NaN;
        }

        return ele;
      });
      return newArr;
    } else {
      const newArr = [];

      if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
          const innerArr = arr[i];
          const temp = innerArr.map(ele => {
            if (typeof ele === "undefined") {
              return NaN;
            }

            if (typeof ele === "number" && (isNaN(ele) || ele == Infinity)) {
              return NaN;
            }

            if (ele == null) {
              return NaN;
            }

            return ele;
          });
          newArr.push(temp);
        }
      }

      return newArr;
    }
  }

  inferDtype(arr) {
    const self = this;

    if (this.is1DArray(arr)) {
      return [this.$typeChecker(arr)];
    } else {
      const arrSlice = this.transposeArray(arr.slice(0, config.getDtypeTestLim));
      const dtypes = arrSlice.map(innerArr => {
        return self.$typeChecker(innerArr);
      });
      return dtypes;
    }
  }

  $typeChecker(arr) {
    let dtypes;
    let lim;
    let intTracker = [];
    let floatTracker = [];
    let stringTracker = [];
    let boolTracker = [];

    if (arr.length < config.getDtypeTestLim) {
      lim = arr.length;
    } else {
      lim = config.getDtypeTestLim;
    }

    const arrSlice = arr.slice(0, lim);

    for (let i = 0; i < lim; i++) {
      const ele = arrSlice[i];

      if (typeof ele == "boolean") {
        floatTracker.push(false);
        intTracker.push(false);
        stringTracker.push(false);
        boolTracker.push(true);
      } else if (this.isEmpty(ele)) {
        floatTracker.push(true);
        intTracker.push(false);
        stringTracker.push(false);
        boolTracker.push(false);
      } else if (!isNaN(Number(ele))) {
        if (ele.toString().includes(".")) {
          floatTracker.push(true);
          intTracker.push(false);
          stringTracker.push(false);
          boolTracker.push(false);
        } else {
          floatTracker.push(false);
          intTracker.push(true);
          stringTracker.push(false);
          boolTracker.push(false);
        }
      } else {
        floatTracker.push(false);
        intTracker.push(false);
        stringTracker.push(true);
        boolTracker.push(false);
      }
    }

    const even = ele => ele == true;

    if (stringTracker.some(even)) {
      dtypes = "string";
    } else if (floatTracker.some(even)) {
      dtypes = "float32";
    } else if (intTracker.some(even)) {
      dtypes = "int32";
    } else if (boolTracker.some(even)) {
      dtypes = "boolean";
    } else {
      dtypes = "undefined";
    }

    return dtypes;
  }

  unique(arr) {
    const uniqueArr = new Set(arr);
    return Array.from(uniqueArr);
  }

  is1DArray(arr) {
    if (typeof arr[0] == "number" || typeof arr[0] == "string" || typeof arr[0] == "boolean") {
      return true;
    } else {
      return false;
    }
  }

  convertArrayToObject(arr) {
    const arrObj = {};

    for (let i = 0; i < arr.length; i++) {
      arrObj[i] = arr[i];
    }

    return arrObj;
  }

  countNaNs(arr, returnVal = true, isSeries) {
    if (isSeries) {
      let nullCount = 0;
      let valCount = 0;

      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];

        if (Number.isNaN(ele)) {
          nullCount = nullCount + 1;
        } else {
          valCount = valCount + 1;
        }
      }

      if (returnVal) {
        return valCount;
      } else {
        return nullCount;
      }
    } else {
      const resultArr = [];

      for (let i = 0; i < arr.length; i++) {
        const innerArr = arr[i];
        let nullCount = 0;
        let valCount = 0;

        for (let i = 0; i < innerArr.length; i++) {
          const ele = innerArr[i];

          if (Number.isNaN(ele)) {
            nullCount = nullCount + 1;
          } else {
            valCount = valCount + 1;
          }
        }

        if (returnVal) {
          resultArr.push(valCount);
        } else {
          resultArr.push(nullCount);
        }
      }

      return resultArr;
    }
  }

  round(arr, dp = 1, isSeries) {
    if (dp < 0) {
      dp = 1;
    }

    if (isSeries) {
      const newArr = [];

      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];

        if (typeof ele == "number" && !isNaN(ele) && ele !== undefined && ele !== null) {
          newArr.push(Number(ele.toFixed(dp)));
        } else {
          newArr.push(ele);
        }
      }

      return newArr;
    } else {
      const resultArr = [];

      for (let i = 0; i < arr.length; i++) {
        const innerVal = arr[i];
        const newArr = [];

        if (Array.isArray(innerVal)) {
          for (let i = 0; i < innerVal.length; i++) {
            const ele = innerVal[i];

            if (typeof ele == "number" && !isNaN(ele) && ele !== undefined && ele !== null) {
              newArr.push(Number(ele.toFixed(dp)));
            } else {
              newArr.push(ele);
            }
          }

          resultArr.push(newArr);
        } else {
          if (typeof innerVal == "number" && !isNaN(innerVal) && innerVal !== undefined && innerVal !== null) {
            newArr.push(Number(innerVal.toFixed(dp)));
          } else {
            newArr.push(innerVal);
          }
        }
      }

      return resultArr;
    }
  }

  isFunction(func) {
    return typeof func == "function";
  }

  randNumberGenerator(start, end, size) {
    let genNum = [];

    function randi(a, b) {
      return Math.floor(Math.random() * (b - a) + a);
    }

    function recursive(val, arr) {
      if (!arr.includes(val)) {
        return val;
      }

      val = randi(start, end);
      recursive(val, arr);
    }

    for (let i = 0; i < size; i++) {
      let genVal = randi(start, end);
      let recursiveVal = recursive(genVal, genNum);
      genNum.push(recursiveVal);
    }

    return genNum;
  }

  throwErrorOnWrongParams(paramsObject, paramsNeeded) {
    const keys = Object.keys(paramsObject);
    const bool = [];

    for (let i = 0; i < keys.length; i++) {
      if (paramsNeeded.includes(keys[i])) {
        bool.push(true);
      } else {
        bool.push(false);
      }
    }

    const truthy = element => element == false;

    if (bool.some(truthy)) {
      throw Error(`Params Error: Required parameter not found. Your params must include the following [${paramsNeeded}]`);
    }
  }

  mapIntegersToBooleans(arr, dim) {
    if (dim == 2) {
      const newArr = [];
      arr.map(innerArr => {
        const temp = [];
        innerArr.map(val => temp.push(val == 1));
        newArr.push(temp);
      });
      return newArr;
    } else {
      const newArr = [];
      arr.map(val => newArr.push(val == 1));
      return newArr;
    }
  }

  mapBooleansToIntegers(arr, dim) {
    if (dim == 2) {
      const newArr = [];
      arr.map(innerArr => {
        const temp = [];
        innerArr.map(val => temp.push(val ? 1 : 0));
        newArr.push(temp);
      });
      return newArr;
    } else {
      const newArr = [];
      arr.map(val => newArr.push(val ? 1 : 0));
      return newArr;
    }
  }

  zeros(row, column) {
    const zeroData = [];

    for (let i = 0; i < row; i++) {
      const colData = Array(column);

      for (let j = 0; j < column; j++) {
        colData[j] = 0;
      }

      zeroData.push(colData);
    }

    return zeroData;
  }

  shuffle(array, num) {
    let i = array.length;
    let j = 0;
    let temp;

    while (i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array.slice(0, num);
  }

  sort(arr, ascending = true) {
    const sorted = [...arr];
    return sorted.sort((a, b) => {
      if (ascending) {
        if (typeof a === "string" && typeof b === "string") {
          return a.charCodeAt(0) - b.charCodeAt(0);
        } else {
          return a - b;
        }
      } else {
        if (typeof a === "string" && typeof b === "string") {
          return b.charCodeAt(0) - a.charCodeAt(0);
        } else {
          return b - a;
        }
      }
    });
  }

  isBrowserEnv() {
    const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
    return isBrowser();
  }

  isNodeEnv() {
    const isNode = new Function("try {return this===global;}catch(e){return false;}");
    return isNode();
  }

  removeMissingValuesFromArray(arr) {
    const values = arr.filter(val => {
      return !this.isEmpty(val);
    });
    return values;
  }

  replaceNanWithNull(arr) {
    const values = arr.map(val => {
      if (isNaN(val)) {
        return null;
      } else {
        return val;
      }
    });
    return values;
  }

  getDuplicate(arr) {
    const tempObj = {};
    const resultObj = {};

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];

      if (this.keyInObject(tempObj, val)) {
        tempObj[val]["count"] += 1;
        tempObj[val]["index"].push(i);
      } else {
        tempObj[val] = {};
        tempObj[val]["count"] = 1;
        tempObj[val]["index"] = [i];
      }
    }

    for (let key in tempObj) {
      if (tempObj[key]["count"] >= 2) {
        resultObj[key] = {};
        resultObj[key]["count"] = tempObj[key]["count"];
        resultObj[key]["index"] = tempObj[key]["index"];
      }
    }

    return resultObj;
  }

  sortArrayByIndex(arr1, arr2, dtype) {
    const sortedIdx = arr1.map((item, index) => {
      return [arr2[index], item];
    });

    if (dtype == "string") {
      sortedIdx.sort();
    } else {
      sortedIdx.sort(([arg1], [arg2]) => arg2 - arg1);
    }

    return sortedIdx.map(([, item]) => item);
  }

  createNdframeFromNewDataWithOldProps({
    ndFrame,
    newData,
    isSeries
  }) {
    if (isSeries) {
      return new _2.Series(newData, {
        index: [...ndFrame.index],
        columns: [...ndFrame.columns],
        dtypes: [...ndFrame.dtypes],
        config: { ...ndFrame.config
        }
      });
    } else {
      return new _2.DataFrame(newData, {
        index: [...ndFrame.index],
        columns: [...ndFrame.columns],
        dtypes: [...ndFrame.dtypes],
        config: { ...ndFrame.config
        }
      });
    }
  }

  checkSeriesOpCompactibility({
    firstSeries,
    secondSeries,
    operation
  }) {
    if (firstSeries.shape[0] != secondSeries.shape[0]) {
      _errors.default.throwSeriesMathOpLengthError(firstSeries, secondSeries);
    }

    if (firstSeries.dtypes[0] == 'string' || secondSeries.dtypes[0] == 'string') {
      _errors.default.throwStringDtypeOperationError(operation);
    }
  }

  sortObj(arr, ascending) {
    return arr.sort((obj1, obj2) => {
      const a = obj2.value;
      const b = obj1.value;

      if (!ascending) {
        if (typeof a === "string" && typeof b === "string") {
          return a.charCodeAt(0) - b.charCodeAt(0);
        } else if (typeof a === "number" && typeof b === "number" || typeof a === "boolean" && typeof b === "boolean") {
          return Number(a) - Number(b);
        } else {
          throw Error('ParamError: column values must be either numbers or strings');
        }
      } else {
        if (typeof a === "string" && typeof b === "string") {
          return b.charCodeAt(0) - a.charCodeAt(0);
        } else if (typeof a === "number" && typeof b === "number" || typeof a === "boolean" && typeof b === "boolean") {
          return Number(b) - Number(a);
        } else {
          throw Error('ParamError: column values must be either numbers or strings');
        }
      }
    });
  }

}

const utils = new Utils();
exports.utils = utils;
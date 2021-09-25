"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mathjs = require("mathjs");

var _defaults = require("../shared/defaults");

var _tfjsNode = require("@tensorflow/tfjs-node");

var _math = require("./math.ops");

var _errors = _interopRequireDefault(require("../shared/errors"));

var _indexing = require("./indexing");

var _utils = require("../shared/utils");

var _generic = _interopRequireDefault(require("./generic"));

var _table = require("table");

var _series = _interopRequireDefault(require("./series"));

var _groupby = require("./groupby");

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
class DataFrame extends _generic.default {
  constructor(data, options) {
    const {
      index,
      columns,
      dtypes,
      config
    } = {
      index: undefined,
      columns: undefined,
      dtypes: undefined,
      config: undefined,
      ...options
    };
    super({
      data,
      index,
      columns,
      dtypes,
      config,
      isSeries: false
    });
    this.$setInternalColumnDataProperty();
  }

  $setInternalColumnDataProperty(column) {
    const self = this;

    if (column && typeof column === "string") {
      Object.defineProperty(self, column, {
        get() {
          return self.$getColumnData(column);
        },

        set(arr) {
          self.$setColumnData(column, arr);
        }

      });
    } else {
      const columns = this.columns;

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        Object.defineProperty(this, column, {
          get() {
            return self.$getColumnData(column);
          },

          set(arr) {
            self.$setColumnData(column, arr);
          }

        });
      }
    }
  }

  $getColumnData(column, returnSeries = true) {
    const columnIndex = this.columns.indexOf(column);

    if (columnIndex == -1) {
      _errors.default.throwColumnNotFoundError(this);
    }

    const dtypes = [this.$dtypes[columnIndex]];
    const index = [...this.$index];
    const columns = [column];
    const config = { ...this.$config
    };

    if (this.$config.isLowMemoryMode) {
      const data = [];

      for (let i = 0; i < this.values.length; i++) {
        const row = this.values[i];
        data.push(row[columnIndex]);
      }

      if (returnSeries) {
        return new _series.default(data, {
          dtypes,
          index,
          columns,
          config
        });
      } else {
        return data;
      }
    } else {
      const data = this.$dataIncolumnFormat[columnIndex];

      if (returnSeries) {
        return new _series.default(data, {
          dtypes,
          index,
          columns,
          config
        });
      } else {
        return data;
      }
    }
  }

  $setColumnData(column, arr) {
    const columnIndex = this.$columns.indexOf(column);

    if (columnIndex == -1) {
      throw new Error(`ParamError: column ${column} not found in ${this.$columns}. If you need to add a new column, use the df.addColumn method. `);
    }

    let colunmValuesToAdd;

    if (arr instanceof _series.default) {
      colunmValuesToAdd = arr.values;
    } else if (Array.isArray(arr)) {
      colunmValuesToAdd = arr;
    } else {
      throw new Error("ParamError: specified value not supported. It must either be an Array or a Series of the same length");
    }

    if (colunmValuesToAdd.length !== this.shape[0]) {
      _errors.default.throwColumnLengthError(this, colunmValuesToAdd.length);
    }

    if (this.$config.isLowMemoryMode) {
      for (let i = 0; i < this.$data.length; i++) {
        this.$data[i][columnIndex] = colunmValuesToAdd[i];
      }

      this.$dtypes[columnIndex] = _utils.utils.inferDtype(colunmValuesToAdd)[0];
    } else {
      for (let i = 0; i < this.values.length; i++) {
        this.$data[i][columnIndex] = colunmValuesToAdd[i];
      }

      this.$dataIncolumnFormat[columnIndex] = arr;
      this.$dtypes[columnIndex] = _utils.utils.inferDtype(colunmValuesToAdd)[0];
    }
  }

  $getDataByAxisWithMissingValuesRemoved(axis) {
    const oldValues = this.$getDataArraysByAxis(axis);
    const cleanValues = [];

    for (let i = 0; i < oldValues.length; i++) {
      const values = oldValues[i];
      cleanValues.push(_utils.utils.removeMissingValuesFromArray(values));
    }

    return cleanValues;
  }

  $getDataArraysByAxis(axis) {
    axis = axis === 0 ? 1 : 0;

    if (axis === 1) {
      return this.values;
    } else {
      let dfValues;

      if (this.config.isLowMemoryMode) {
        dfValues = _utils.utils.transposeArray(this.values);
      } else {
        dfValues = this.$dataIncolumnFormat;
      }

      return dfValues;
    }
  }

  $frameIsNotCompactibleForArithmeticOperation() {
    const dtypes = this.dtypes;

    const str = element => element == "string";

    return dtypes.some(str);
  }

  $getTensorsForArithmeticOperationByAxis(other, axis) {
    axis = axis === 0 ? 1 : 0;

    if (typeof other === "number") {
      return [this.tensor, (0, _tfjsNode.scalar)(other)];
    } else if (other instanceof DataFrame) {
      return [this.tensor, other.tensor];
    } else if (other instanceof _series.default) {
      if (axis === 1) {
        return [this.tensor, (0, _tfjsNode.tensor2d)(other.values, [other.shape[0], 1])];
      } else {
        return [this.tensor, (0, _tfjsNode.tensor2d)(other.values, [other.shape[0], 1]).transpose()];
      }
    } else if (Array.isArray(other)) {
      if (axis === 1) {
        return [this.tensor, (0, _tfjsNode.tensor2d)(other, [other.length, 1])];
      } else {
        return [this.tensor, (0, _tfjsNode.tensor2d)(other, [other.length, 1]).transpose()];
      }
    } else {
      throw new Error("ParamError: Invalid type for other parameter. other must be one of Series, DataFrame or number.");
    }
  }

  $getColumnDtype(column) {
    const columnIndex = this.columns.indexOf(column);

    if (columnIndex === -1) {
      throw Error(`ColumnNameError: Column "${column}" does not exist`);
    }

    return this.dtypes[columnIndex];
  }

  $logicalOps(tensors, operation) {
    let newValues = [];

    switch (operation) {
      case 'gt':
        newValues = tensors[0].greater(tensors[1]).arraySync();
        break;

      case 'lt':
        newValues = tensors[0].less(tensors[1]).arraySync();
        break;

      case 'ge':
        newValues = tensors[0].greaterEqual(tensors[1]).arraySync();
        break;

      case 'le':
        newValues = tensors[0].lessEqual(tensors[1]).arraySync();
        break;

      case 'eq':
        newValues = tensors[0].equal(tensors[1]).arraySync();
        break;

      case 'ne':
        newValues = tensors[0].notEqual(tensors[1]).arraySync();
        break;
    }

    const newData = _utils.utils.mapIntegersToBooleans(newValues, 2);

    return new DataFrame(newData, {
      index: [...this.index],
      columns: [...this.columns],
      dtypes: [...this.dtypes],
      config: { ...this.config
      }
    });
  }

  $MathOps(tensors, operation, inplace) {
    let tensorResult;

    switch (operation) {
      case 'add':
        tensorResult = tensors[0].add(tensors[1]);
        break;

      case 'sub':
        tensorResult = tensors[0].sub(tensors[1]);
        break;

      case 'pow':
        tensorResult = tensors[0].pow(tensors[1]);
        break;

      case 'div':
        tensorResult = tensors[0].div(tensors[1]);
        break;

      case 'mul':
        tensorResult = tensors[0].mul(tensors[1]);
        break;

      case 'mod':
        tensorResult = tensors[0].mod(tensors[1]);
        break;
    }

    if (inplace) {
      const newData = tensorResult?.arraySync();
      this.$setValues(newData);
    } else {
      return new DataFrame(tensorResult, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  iloc(args) {
    const {
      rows,
      columns
    } = {
      rows: undefined,
      columns: undefined,
      ...args
    };
    return (0, _indexing._iloc)({
      ndFrame: this,
      rows,
      columns
    });
  }

  loc(args) {
    const {
      rows,
      columns
    } = args;
    return (0, _indexing._loc)({
      ndFrame: this,
      rows,
      columns
    });
  }

  toString() {
    const maxRow = this.config.getMaxRow;
    const maxColToDisplayInConsole = this.config.getTableMaxColInConsole;
    const dataArr = [];
    const colLen = this.columns.length;
    let header = [];

    if (colLen > maxColToDisplayInConsole) {
      let firstFourcolNames = this.columns.slice(0, 4);
      let lastThreecolNames = this.columns.slice(colLen - 4);
      header = ["", ...firstFourcolNames, "...", ...lastThreecolNames];
      let subIdx;
      let firstHalfValues;
      let lastHalfValueS;

      if (this.values.length > maxRow) {
        let dfSubset1 = this.iloc({
          rows: [`0:${maxRow}`],
          columns: ["0:4"]
        });
        let dfSubset2 = this.iloc({
          rows: [`0:${maxRow}`],
          columns: [`${colLen - 4}:`]
        });
        subIdx = this.index.slice(0, maxRow);
        firstHalfValues = dfSubset1.values;
        lastHalfValueS = dfSubset2.values;
      } else {
        let dfSubset1 = this.iloc({
          columns: ["0:4"]
        });
        let dfSubset2 = this.iloc({
          columns: [`${colLen - 4}:`]
        });
        subIdx = this.index.slice(0, maxRow);
        firstHalfValues = dfSubset1.values;
        lastHalfValueS = dfSubset2.values;
      }

      for (let i = 0; i < subIdx.length; i++) {
        const idx = subIdx[i];
        const row = [idx, ...firstHalfValues[i], "...", ...lastHalfValueS[i]];
        dataArr.push(row);
      }
    } else {
      header = ["", ...this.columns];
      let subIdx;
      let values;

      if (this.values.length > maxRow) {
        let data = this.iloc({
          rows: [`0:${maxRow}`]
        });
        subIdx = data.index;
        values = data.values;
      } else {
        values = this.values;
        subIdx = this.index;
      }

      for (let i = 0; i < subIdx.length; i++) {
        const idx = subIdx[i];
        const row = [idx, ...values[i]];
        dataArr.push(row);
      }
    }

    const columnsConfig = {};
    columnsConfig[0] = {
      width: 10
    };

    for (let index = 1; index < header.length; index++) {
      columnsConfig[index] = {
        width: 17,
        truncate: 16
      };
    }

    const tableData = [header, ...dataArr];
    return (0, _table.table)(tableData, {
      columns: columnsConfig,
      ...this.config.getTableDisplayConfig
    });
  }

  head(rows = 5) {
    if (rows > this.shape[0]) {
      throw new Error("ParamError of rows cannot be greater than available rows in data");
    }

    if (rows <= 0) {
      throw new Error("ParamError of rows cannot be less than 1");
    }

    return this.iloc({
      rows: [`0:${rows}`]
    });
  }

  tail(rows = 5) {
    if (rows > this.shape[0]) {
      throw new Error("ParamError of rows cannot be greater than available rows in data");
    }

    if (rows <= 0) {
      throw new Error("ParamError of rows cannot be less than 1");
    }

    rows = this.shape[0] - rows;
    return this.iloc({
      rows: [`${rows}:`]
    });
  }

  async sample(num = 5, options) {
    const {
      seed
    } = {
      seed: 1,
      ...options
    };

    if (num > this.shape[0]) {
      throw new Error("ParamError: Sample size cannot be bigger than number of rows");
    }

    if (num <= 0) {
      throw new Error("ParamError: Sample size cannot be less than 1");
    }

    const shuffledIndex = await _tfjsNode.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
    const df = this.iloc({
      rows: shuffledIndex
    });
    return df;
  }

  add(other, options) {
    const {
      inplace,
      axis
    } = {
      inplace: false,
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: add operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$MathOps(tensors, "add", inplace);
  }

  sub(other, options) {
    const {
      inplace,
      axis
    } = {
      inplace: false,
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: sub operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$MathOps(tensors, "sub", inplace);
  }

  mul(other, options) {
    const {
      inplace,
      axis
    } = {
      inplace: false,
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: mul operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$MathOps(tensors, "mul", inplace);
  }

  div(other, options) {
    const {
      inplace,
      axis
    } = {
      inplace: false,
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: div operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$MathOps(tensors, "div", inplace);
  }

  pow(other, options) {
    const {
      inplace,
      axis
    } = {
      inplace: false,
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: pow operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$MathOps(tensors, "pow", inplace);
  }

  mod(other, options) {
    const {
      inplace,
      axis
    } = {
      inplace: false,
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: mod operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$MathOps(tensors, "mod", inplace);
  }

  mean(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: mean operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const meanArr = newData.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length);
    return new _series.default(meanArr);
  }

  median(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: median operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const meanArr = newData.map(arr => (0, _mathjs.median)(arr));
    return new _series.default(meanArr);
  }

  mode(options) {
    const {
      axis,
      keep
    } = {
      axis: 1,
      keep: 0,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: mode operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const meanArr = newData.map(arr => {
      const tempMode = (0, _mathjs.mode)(arr);

      if (tempMode.length === 1) {
        return tempMode[0];
      } else {
        return tempMode[keep];
      }
    });
    return new _series.default(meanArr);
  }

  min(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: min operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const minArr = newData.map(arr => {
      let smallestValue = arr[0];

      for (let i = 0; i < arr.length; i++) {
        smallestValue = smallestValue < arr[i] ? smallestValue : arr[i];
      }

      return smallestValue;
    });
    return new _series.default(minArr);
  }

  max(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: max operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const maxArr = newData.map(arr => {
      let biggestValue = arr[0];

      for (let i = 0; i < arr.length; i++) {
        biggestValue = biggestValue > arr[i] ? biggestValue : arr[i];
      }

      return biggestValue;
    });
    return new _series.default(maxArr);
  }

  std(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: std operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const stdArr = newData.map(arr => (0, _mathjs.std)(arr));
    return new _series.default(stdArr);
  }

  var(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: var operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const varArr = newData.map(arr => (0, _mathjs.variance)(arr));
    return new _series.default(varArr);
  }

  lt(other, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: lt operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$logicalOps(tensors, "lt");
  }

  gt(other, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: gt operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$logicalOps(tensors, "gt");
  }

  eq(other, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: eq operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$logicalOps(tensors, "eq");
  }

  ne(other, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: ne operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$logicalOps(tensors, "ne");
  }

  le(other, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: le operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$logicalOps(tensors, "le");
  }

  ge(other, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: ge operation is not supported for string dtypes");
    }

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const tensors = this.$getTensorsForArithmeticOperationByAxis(other, axis);
    return this.$logicalOps(tensors, "ge");
  }

  count(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newData = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const countArr = newData.map(arr => arr.length);
    return new _series.default(countArr);
  }

  sum(options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const result = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const sumArr = result.map(innerArr => {
      return innerArr.reduce((a, b) => Number(a) + Number(b), 0);
    });

    if (axis === 1) {
      return new _series.default(sumArr, {
        index: [...this.columns]
      });
    } else {
      return new _series.default(sumArr, {
        index: [...this.index]
      });
    }
  }

  abs(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newData = this.values.map(arr => arr.map(val => Math.abs(val)));

    if (inplace) {
      this.$setValues(newData);
    } else {
      return new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  round(dp = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (this.$frameIsNotCompactibleForArithmeticOperation()) {
      throw Error("TypeError: round operation is not supported for string dtypes");
    }

    if (typeof dp !== "number") {
      throw Error("ParamError: dp must be a number");
    }

    const newData = _utils.utils.round(this.values, dp, false);

    if (inplace) {
      this.$setValues(newData);
    } else {
      return new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        config: { ...this.config
        }
      });
    }
  }

  cumprod(options) {
    const {
      axis,
      inplace
    } = {
      axis: 1,
      inplace: false,
      ...options
    };
    return this.cumOps("prod", axis, inplace);
  }

  cumsum(options) {
    const {
      axis,
      inplace
    } = {
      axis: 1,
      inplace: false,
      ...options
    };
    return this.cumOps("sum", axis, inplace);
  }

  cummin(options) {
    const {
      axis,
      inplace
    } = {
      axis: 1,
      inplace: false,
      ...options
    };
    return this.cumOps("min", axis, inplace);
  }

  cummax(options) {
    const {
      axis,
      inplace
    } = {
      axis: 1,
      inplace: false,
      ...options
    };
    return this.cumOps("max", axis, inplace);
  }

  cumOps(ops, axis, inplace) {
    if (this.dtypes.includes("string")) _errors.default.throwStringDtypeOperationError(ops);
    const result = this.$getDataByAxisWithMissingValuesRemoved(axis);
    let newData = result.map(sData => {
      let tempval = sData[0];
      const data = [tempval];

      for (let i = 1; i < sData.length; i++) {
        let currVal = sData[i];

        switch (ops) {
          case "max":
            if (currVal > tempval) {
              data.push(currVal);
              tempval = currVal;
            } else {
              data.push(tempval);
            }

            break;

          case "min":
            if (currVal < tempval) {
              data.push(currVal);
              tempval = currVal;
            } else {
              data.push(tempval);
            }

            break;

          case "sum":
            tempval = tempval + currVal;
            data.push(tempval);
            break;

          case "prod":
            tempval = tempval * currVal;
            data.push(tempval);
            break;
        }
      }

      return data;
    });

    if (axis === 1) {
      newData = _utils.utils.transposeArray(newData);
    }

    if (inplace) {
      this.$setValues(newData);
    } else {
      return new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  describe() {
    const numericColumnNames = this.columns.filter(name => this.$getColumnDtype(name) !== "string");
    const index = ["count", "mean", "std", "min", "median", "max", "variance"];
    const statsObject = {};

    for (let i = 0; i < numericColumnNames.length; i++) {
      const colName = numericColumnNames[i];
      const $count = this.$getColumnData(colName).count();
      const $mean = (0, _mathjs.mean)(this.$getColumnData(colName, false));
      const $std = (0, _mathjs.std)(this.$getColumnData(colName, false));
      const $min = this.$getColumnData(colName).min();
      const $median = (0, _mathjs.median)(this.$getColumnData(colName, false));
      const $max = this.$getColumnData(colName).max();
      const $variance = (0, _mathjs.variance)(this.$getColumnData(colName, false));
      const stats = [$count, $mean, $std, $min, $median, $max, $variance];
      statsObject[colName] = stats;
    }

    const df = new DataFrame(statsObject, {
      index
    });
    return df;
  }

  dropna(axis = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if ([0, 1].indexOf(axis) === -1) {
      throw Error("ParamError: Axis must be 0 or 1");
    }

    const newIndex = [];

    if (axis == 0) {
      const newData = [];
      const dfValues = this.values;

      for (let i = 0; i < dfValues.length; i++) {
        const values = dfValues[i];

        if (!values.includes(NaN)) {
          newData.push(values);
          newIndex.push(this.index[i]);
        }
      }

      if (inplace) {
        this.$setValues(newData, false);
        this.$setIndex(newIndex);
      } else {
        return new DataFrame(newData, {
          index: newIndex,
          columns: [...this.columns],
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
      }
    } else {
      const newColumnNames = [];
      const newDtypes = [];
      let dfValues = [];

      if (this.config.isLowMemoryMode) {
        dfValues = _utils.utils.transposeArray(this.values);
      } else {
        dfValues = this.$dataIncolumnFormat;
      }

      const tempColArr = [];

      for (let i = 0; i < dfValues.length; i++) {
        const values = dfValues[i];

        if (!values.includes(NaN)) {
          tempColArr.push(values);
          newColumnNames.push(this.columns[i]);
          newDtypes.push(this.dtypes[i]);
        }
      }

      const newData = _utils.utils.transposeArray(tempColArr);

      if (inplace) {
        this.$setValues(newData, false, false);
        this.$setColumnNames(newColumnNames);
        this.$setDtypes(newDtypes);
      } else {
        return new DataFrame(newData, {
          index: [...this.index],
          columns: newColumnNames,
          dtypes: newDtypes,
          config: { ...this.config
          }
        });
      }
    }
  }

  addColumn(options) {
    const {
      column,
      values,
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!column) {
      throw new Error("ParamError: column must be specified");
    }

    if (!values) {
      throw new Error("ParamError: values must be specified");
    }

    const columnIndex = this.$columns.indexOf(column);

    if (columnIndex === -1) {
      let colunmValuesToAdd;

      if (values instanceof _series.default) {
        colunmValuesToAdd = values.values;
      } else if (Array.isArray(values)) {
        colunmValuesToAdd = values;
      } else {
        throw new Error("ParamError: specified value not supported. It must either be an Array or a Series of the same length");
      }

      if (colunmValuesToAdd.length !== this.shape[0]) {
        _errors.default.throwColumnLengthError(this, colunmValuesToAdd.length);
      }

      const newData = [];
      const oldValues = this.$data;

      for (let i = 0; i < oldValues.length; i++) {
        const innerArr = [...oldValues[i]];
        innerArr.push(colunmValuesToAdd[i]);
        newData.push(innerArr);
      }

      if (inplace) {
        this.$setValues(newData, true, false);
        this.$setColumnNames([...this.columns, column]);
        this.$setInternalColumnDataProperty(column);
      } else {
        const df = new DataFrame(newData, {
          index: [...this.index],
          columns: [...this.columns, column],
          dtypes: [...this.dtypes, _utils.utils.inferDtype(colunmValuesToAdd)[0]],
          config: { ...this.$config
          }
        });
        return df;
      }
    } else {
      this.$setColumnData(column, values);
    }
  }

  copy() {
    let df = new DataFrame([...this.$data], {
      columns: [...this.columns],
      index: [...this.index],
      dtypes: [...this.dtypes],
      config: { ...this.$config
      }
    });
    return df;
  }

  isna() {
    const newData = [];

    for (let i = 0; i < this.values.length; i++) {
      const valueArr = this.values[i];
      const tempData = valueArr.map(value => {
        if (_utils.utils.isEmpty(value)) {
          return true;
        } else {
          return false;
        }
      });
      newData.push(tempData);
    }

    const df = new DataFrame(newData, {
      index: [...this.index],
      columns: [...this.columns],
      config: { ...this.config
      }
    });
    return df;
  }

  fillna(values, options) {
    let {
      columns,
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!values && typeof values !== "boolean") {
      throw Error('ParamError: value must be specified');
    }

    if (Array.isArray(values)) {
      if (!Array.isArray(columns)) {
        throw Error('ParamError: value is an array, hence columns must also be an array of same length');
      }

      if (values.length !== columns.length) {
        throw Error('ParamError: specified column and values must have the same length');
      }

      columns.forEach(col => {
        if (!this.columns.includes(col)) {
          throw Error(`ValueError: Specified column "${col}" must be one of ${this.columns}`);
        }
      });
    }

    const newData = [];
    const oldValues = [...this.values];

    if (!columns) {
      for (let i = 0; i < oldValues.length; i++) {
        const valueArr = [...oldValues[i]];
        const tempArr = valueArr.map(innerVal => {
          if (_utils.utils.isEmpty(innerVal)) {
            const replaceWith = Array.isArray(values) ? values[i] : values;
            return replaceWith;
          } else {
            return innerVal;
          }
        });
        newData.push(tempArr);
      }
    } else {
      const tempData = [...this.values];

      for (let i = 0; i < tempData.length; i++) {
        const valueArr = tempData[i];

        for (let i = 0; i < columns.length; i++) {
          const columnIndex = this.columns.indexOf(columns[i]);
          const replaceWith = Array.isArray(values) ? values[i] : values;
          valueArr[columnIndex] = _utils.utils.isEmpty(valueArr[columnIndex]) ? replaceWith : valueArr[columnIndex];
        }

        newData.push(valueArr);
      }
    }

    if (inplace) {
      this.$setValues(newData);
    } else {
      const df = new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
      return df;
    }
  }

  drop(options) {
    let {
      columns,
      index,
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!columns && !index) {
      throw Error('ParamError: Must specify one of columns or index');
    }

    if (columns && index) {
      throw Error('ParamError: Can only specify one of columns or index');
    }

    if (columns) {
      const columnIndices = [];

      if (typeof columns === "string") {
        columnIndices.push(this.columns.indexOf(columns));
      } else if (Array.isArray(columns)) {
        for (let column of columns) {
          if (this.columns.indexOf(column) === -1) {
            throw Error(`ParamError: specified column "${column}" not found in columns`);
          }

          columnIndices.push(this.columns.indexOf(column));
        }
      } else {
        throw Error('ParamError: columns must be an array of column names or a string of column name');
      }

      let newRowData = [];
      let newColumnNames = [];
      let newDtypes = [];

      for (let i = 0; i < this.values.length; i++) {
        const tempInnerArr = [];
        const innerArr = this.values[i];

        for (let j = 0; j < innerArr.length; j++) {
          if (!columnIndices.includes(j)) {
            tempInnerArr.push(innerArr[j]);
          }
        }

        newRowData.push(tempInnerArr);
      }

      for (let i = 0; i < this.columns.length; i++) {
        const element = this.columns[i];

        if (!columns.includes(element)) {
          newColumnNames.push(element);
          newDtypes.push(this.dtypes[i]);
        }
      }

      if (inplace) {
        this.$setValues(newRowData, true, false);
        this.$setColumnNames(newColumnNames);
      } else {
        const df = new DataFrame(newRowData, {
          index: [...this.index],
          columns: newColumnNames,
          dtypes: newDtypes,
          config: { ...this.config
          }
        });
        return df;
      }
    }

    if (index) {
      const rowIndices = [];

      if (typeof index === "string" || typeof index === "number" || typeof index === "boolean") {
        rowIndices.push(this.index.indexOf(index));
      } else if (Array.isArray(index)) {
        for (let indx of index) {
          if (this.index.indexOf(indx) === -1) {
            throw Error(`ParamError: specified index "${indx}" not found in indices`);
          }

          rowIndices.push(this.index.indexOf(indx));
        }
      } else {
        throw Error('ParamError: index must be an array of indices or a scalar index');
      }

      let newRowData = [];
      let newIndex = [];

      for (let i = 0; i < this.values.length; i++) {
        const innerArr = this.values[i];

        if (!rowIndices.includes(i)) {
          newRowData.push(innerArr);
        }
      }

      for (let i = 0; i < this.index.length; i++) {
        const indx = this.index[i];

        if (!index.includes(indx)) {
          newIndex.push(indx);
        }
      }

      if (inplace) {
        this.$setValues(newRowData, false);
        this.$setIndex(newIndex);
      } else {
        const df = new DataFrame(newRowData, {
          index: newIndex,
          columns: [...this.columns],
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
        return df;
      }
    }
  }

  sort_values(options) {
    const {
      by,
      ascending,
      inplace
    } = {
      by: undefined,
      ascending: true,
      inplace: false,
      ...options
    };

    if (!by) {
      throw Error(`ParamError: must specify a column to sort by`);
    }

    if (this.columns.indexOf(by) === -1) {
      throw Error(`ParamError: specified column "${by}" not found in columns`);
    }

    const columnValues = this.$getColumnData(by, false);
    const index = [...this.index];
    const objToSort = columnValues.map((value, i) => {
      return {
        index: index[i],
        value
      };
    });

    const sortedObjectArr = _utils.utils.sortObj(objToSort, ascending);

    const sortedIndex = sortedObjectArr.map(obj => obj.index);
    const newDf = (0, _indexing._loc)({
      ndFrame: this,
      rows: sortedIndex
    });

    if (inplace) {
      this.$setValues(newDf.values);
      this.$setIndex(newDf.index);
    } else {
      return newDf;
    }
  }

  set_index(options) {
    const {
      index,
      column,
      drop,
      inplace
    } = {
      drop: false,
      inplace: false,
      ...options
    };

    if (!index && !column) {
      throw new Error("ParamError: must specify either index or column");
    }

    let newIndex = [];

    if (index) {
      if (!Array.isArray(index)) {
        throw Error(`ParamError: index must be an array`);
      }

      if (index.length !== this.values.length) {
        throw Error(`ParamError: index must be the same length as the number of rows`);
      }

      newIndex = index;
    }

    if (column) {
      if (this.columns.indexOf(column) === -1) {
        throw Error(`ParamError: column not found in column names`);
      }

      newIndex = this.$getColumnData(column, false);
    }

    if (drop) {
      const dfDropped = this.drop({
        columns: [column]
      });
      const newData = dfDropped?.values;
      const newColumns = dfDropped?.columns;
      const newDtypes = dfDropped?.dtypes;

      if (inplace) {
        this.$setValues(newData, true, false);
        this.$setIndex(newIndex);
        this.$setColumnNames(newColumns);
      } else {
        const df = new DataFrame(newData, {
          index: newIndex,
          columns: newColumns,
          dtypes: newDtypes,
          config: { ...this.config
          }
        });
        return df;
      }
    } else {
      if (inplace) {
        this.$setIndex(newIndex);
      } else {
        const df = new DataFrame(this.values, {
          index: newIndex,
          columns: [...this.columns],
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
        return df;
      }
    }
  }

  reset_index(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (inplace) {
      this.$resetIndex();
    } else {
      const df = new DataFrame(this.values, {
        index: this.index.map((_, i) => i),
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
      return df;
    }
  }

  apply(callable, options) {
    const {
      axis
    } = {
      axis: 1,
      ...options
    };

    if ([0, 1].indexOf(axis) === -1) {
      throw Error(`ParamError: axis must be 0 or 1`);
    }

    const valuesForFunc = this.$getDataByAxisWithMissingValuesRemoved(axis);
    const result = valuesForFunc.map(row => {
      return callable(row);
    });

    if (axis === 1) {
      if (_utils.utils.is1DArray(result)) {
        return new _series.default(result, {
          index: [...this.columns]
        });
      } else {
        return new DataFrame(result, {
          index: [...this.columns],
          columns: [...this.columns],
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
      }
    } else {
      if (_utils.utils.is1DArray(result)) {
        return new _series.default(result, {
          index: [...this.index]
        });
      } else {
        return new DataFrame(result, {
          index: [...this.index],
          columns: [...this.columns],
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
      }
    }
  }

  apply_map(callable, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newData = this.values.map(row => {
      const tempData = row.map(val => {
        return callable(val);
      });
      return tempData;
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      return new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  column(column) {
    return this.$getColumnData(column);
  }

  select_dtypes(include) {
    const supportedDtypes = ["float32", "int32", "string", "boolean", 'undefined'];

    if (Array.isArray(include) === false) {
      throw Error(`ParamError: include must be an array`);
    }

    include.forEach(dtype => {
      if (supportedDtypes.indexOf(dtype) === -1) {
        throw Error(`ParamError: include must be an array of valid dtypes`);
      }
    });
    const newColumnNames = [];

    for (let i = 0; i < this.dtypes.length; i++) {
      if (include.includes(this.dtypes[i])) {
        newColumnNames.push(this.columns[i]);
      }
    }

    return this.loc({
      columns: newColumnNames
    });
  }

  transpose(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    const newData = _utils.utils.transposeArray(this.values);

    const newColNames = [...this.index.map(i => i.toString())];

    if (inplace) {
      this.$setValues(newData, false, false);
      this.$setIndex([...this.columns]);
      this.$setColumnNames(newColNames);
    } else {
      return new DataFrame(newData, {
        index: [...this.columns],
        columns: newColNames,
        config: { ...this.config
        }
      });
    }
  }

  get T() {
    const newData = _utils.utils.transposeArray(this.values);

    return new DataFrame(newData, {
      index: [...this.columns],
      columns: [...this.index.map(i => i.toString())],
      config: { ...this.config
      }
    });
  }

  replace(oldValue, newValue, options) {
    const {
      columns,
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!oldValue && typeof oldValue !== 'boolean') {
      throw Error(`Params Error: Must specify param 'oldValue' to replace`);
    }

    if (!newValue && typeof newValue !== 'boolean') {
      throw Error(`Params Error: Must specify param 'newValue' to replace with`);
    }

    let newData = [];

    if (columns) {
      if (!Array.isArray(columns)) {
        throw Error(`Params Error: column must be an array of column(s)`);
      }

      const columnIndex = [];
      columns.forEach(column => {
        const _indx = this.columns.indexOf(column);

        if (_indx === -1) {
          throw Error(`Params Error: column not found in columns`);
        }

        columnIndex.push(_indx);
      });
      newData = this.values.map(([...row]) => {
        for (const colIndx of columnIndex) {
          if (row[colIndx] === oldValue) {
            row[colIndx] = newValue;
          }
        }

        return row;
      });
    } else {
      newData = this.values.map(([...row]) => {
        return row.map(cell => {
          if (cell === oldValue) {
            return newValue;
          } else {
            return cell;
          }
        });
      });
    }

    if (inplace) {
      this.$setValues(newData);
    } else {
      return new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  astype(options) {
    const {
      inplace,
      column,
      dtype
    } = {
      inplace: false,
      ...options
    };
    const columnIndex = this.columns.indexOf(column);

    if (columnIndex === -1) {
      throw Error(`Params Error: column not found in columns`);
    }

    if (!_defaults.DATA_TYPES.includes(dtype)) {
      throw Error(`dtype ${dtype} not supported. dtype must be one of ${_defaults.DATA_TYPES}`);
    }

    const data = this.values;
    const newData = data.map(row => {
      if (dtype === "float32") {
        row[columnIndex] = Number(row[columnIndex]);
        return row;
      } else if (dtype === "int32") {
        row[columnIndex] = parseInt(row[columnIndex]);
        return row;
      } else if (dtype === "string") {
        row[columnIndex] = row[columnIndex].toString();
        return row;
      } else if (dtype === "boolean") {
        row[columnIndex] = Boolean(row[columnIndex]);
        return row;
      }
    });

    if (inplace) {
      this.$setValues(newData);
    } else {
      const newDtypes = [...this.dtypes];
      newDtypes[columnIndex] = dtype;
      return new DataFrame(newData, {
        index: [...this.index],
        columns: [...this.columns],
        dtypes: newDtypes,
        config: { ...this.config
        }
      });
    }
  }

  nunique(axis = 1) {
    if ([0, 1].indexOf(axis) === -1) {
      throw Error(`ParamError: axis must be 0 or 1`);
    }

    const data = this.$getDataArraysByAxis(axis);
    const newData = data.map(row => new Set(row).size);

    if (axis === 0) {
      return new _series.default(newData, {
        index: [...this.columns],
        dtypes: ["int32"]
      });
    } else {
      return new _series.default(newData, {
        index: [...this.index],
        dtypes: ["int32"]
      });
    }
  }

  rename(options) {
    const {
      mapper,
      axis,
      inplace
    } = {
      axis: 1,
      inplace: false,
      ...options
    };

    if ([0, 1].indexOf(axis) === -1) {
      throw Error(`ParamError: axis must be 0 or 1`);
    }

    if (axis === 1) {
      const newColumns = this.columns.map(col => {
        if (mapper[col] !== undefined) {
          return mapper[col];
        } else {
          return col;
        }
      });

      if (inplace) {
        this.$setColumnNames(newColumns);
      } else {
        return new DataFrame([...this.values], {
          index: [...this.index],
          columns: newColumns,
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
      }
    } else {
      const newIndex = this.index.map(col => {
        if (mapper[col] !== undefined) {
          return mapper[col];
        } else {
          return col;
        }
      });

      if (inplace) {
        this.$setIndex(newIndex);
      } else {
        return new DataFrame([...this.values], {
          index: newIndex,
          columns: [...this.columns],
          dtypes: [...this.dtypes],
          config: { ...this.config
          }
        });
      }
    }
  }

  sort_index(options) {
    const {
      ascending,
      inplace
    } = {
      ascending: true,
      inplace: false,
      ...options
    };

    const indexPosition = _utils.utils.range(0, this.index.length - 1);

    const index = [...this.index];
    const objToSort = index.map((idx, i) => {
      return {
        index: indexPosition[i],
        value: idx
      };
    });

    const sortedObjectArr = _utils.utils.sortObj(objToSort, ascending);

    const sortedIndex = sortedObjectArr.map(obj => obj.index);
    const newData = sortedIndex.map(i => this.values[i]);

    if (inplace) {
      this.$setValues(newData);
      this.$setIndex(sortedIndex);
    } else {
      return new DataFrame(newData, {
        index: sortedIndex,
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  append(newValues, index, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!newValues) {
      throw Error(`ParamError: newValues must be a Series, DataFrame or Array`);
    }

    if (!index) {
      throw Error(`ParamError: index must be specified`);
    }

    let rowsToAdd = [];

    if (newValues instanceof _series.default) {
      if (newValues.values.length !== this.shape[1]) {
        throw Error(`ValueError: length of newValues must be the same as the number of columns.`);
      }

      rowsToAdd = [newValues.values];
    } else if (newValues instanceof DataFrame) {
      if (newValues.shape[1] !== this.shape[1]) {
        throw Error(`ValueError: length of newValues must be the same as the number of columns.`);
      }

      rowsToAdd = newValues.values;
    } else if (Array.isArray(newValues)) {
      if (_utils.utils.is1DArray(newValues)) {
        rowsToAdd = [newValues];
      } else {
        rowsToAdd = newValues;
      }

      if (rowsToAdd[0].length !== this.shape[1]) {
        throw Error(`ValueError: length of newValues must be the same as the number of columns.`);
      }
    } else {
      throw Error(`ValueError: newValues must be a Series, DataFrame or Array`);
    }

    let indexInArrFormat = [];

    if (!Array.isArray(index)) {
      indexInArrFormat = [index];
    } else {
      indexInArrFormat = index;
    }

    if (rowsToAdd.length !== indexInArrFormat.length) {
      throw Error(`ParamError: index must contain the same number of values as newValues`);
    }

    const newData = [...this.values];
    const newIndex = [...this.index];
    rowsToAdd.forEach((row, i) => {
      newData.push(row);
      newIndex.push(indexInArrFormat[i]);
    });

    if (inplace) {
      this.$setValues(newData);
      this.$setIndex(newIndex);
    } else {
      return new DataFrame(newData, {
        index: newIndex,
        columns: [...this.columns],
        dtypes: [...this.dtypes],
        config: { ...this.config
        }
      });
    }
  }

  query(condition, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };

    if (!condition) {
      throw new Error("ParamError: condition must be specified");
    }

    const result = (0, _indexing._iloc)({
      ndFrame: this,
      rows: condition
    });

    if (inplace) {
      this.$setValues(result.values, false, false);
      this.$setIndex(result.index);
    } else {
      return result;
    }
  }

  get ctypes() {
    return new _series.default(this.dtypes, {
      index: this.columns
    });
  }

  groupby(col) {
    const len = this.shape[0];
    const columns = this.columns;
    const col_index = col.map(val => columns.indexOf(val));
    const col_dtype = this.dtypes.filter((val, index) => {
      return col_index.includes(index);
    });
    const self = this;
    const data = col.map(column_name => {
      if (!columns.includes(column_name)) throw new Error(`column ${column_name} does not exist`);
      const column_data = self.column(column_name).values;
      return column_data;
    });
    const unique_columns = data.map(column_data => _utils.utils.unique(column_data));

    function getRecursiveDict(uniq_columns) {
      const first_uniq_columns = uniq_columns[0];
      const remaining_columns = uniq_columns.slice(1);
      const c_dict = {};
      if (!remaining_columns.length) first_uniq_columns.forEach(col_value => c_dict[col_value] = []);else first_uniq_columns.forEach(col_value => c_dict[col_value] = getRecursiveDict(remaining_columns));
      return c_dict;
    }

    const col_dict = getRecursiveDict(unique_columns);
    return new _groupby.GroupBy(col_dict, col, this.values, columns, col_dtype).group();
  }

}

exports.default = DataFrame;
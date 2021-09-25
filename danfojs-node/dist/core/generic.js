"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../shared/utils");

var _config = _interopRequireDefault(require("../shared/config"));

var _errors = _interopRequireDefault(require("../shared/errors"));

var _defaults = require("../shared/defaults");

var _tfjsNode = require("@tensorflow/tfjs-node");

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
class NDframe {
  constructor({
    data,
    index,
    columns,
    dtypes,
    config,
    isSeries
  }) {
    this.$isSeries = isSeries;

    if (config) {
      this.$config = new _config.default({ ..._defaults.BASE_CONFIG,
        ...config
      });
    } else {
      this.$config = new _config.default(_defaults.BASE_CONFIG);
    }

    if (data instanceof _tfjsNode.Tensor) {
      data = data.arraySync();
    }

    if (data === undefined || Array.isArray(data) && data.length === 0) {
      this.loadArrayIntoNdframe({
        data: [],
        index: [],
        columns: [],
        dtypes: []
      });
    } else if (_utils.utils.is1DArray(data)) {
      this.loadArrayIntoNdframe({
        data,
        index,
        columns,
        dtypes
      });
    } else {
      if (Array.isArray(data) && _utils.utils.isObject(data[0])) {
        this.loadObjectIntoNdframe({
          data,
          type: 1,
          index,
          columns,
          dtypes
        });
      } else if (_utils.utils.isObject(data)) {
        this.loadObjectIntoNdframe({
          data,
          type: 2,
          index,
          columns,
          dtypes
        });
      } else if (Array.isArray(data[0]) || _utils.utils.isNumber(data[0]) || _utils.utils.isString(data[0])) {
        this.loadArrayIntoNdframe({
          data,
          index,
          columns,
          dtypes
        });
      } else {
        throw new Error("File format not supported!");
      }
    }
  }

  loadArrayIntoNdframe({
    data,
    index,
    columns,
    dtypes
  }) {
    this.$data = data;

    if (!this.$config.isLowMemoryMode) {
      this.$dataIncolumnFormat = _utils.utils.transposeArray(data);
    }

    this.$setIndex(index);
    this.$setDtypes(dtypes);
    this.$setColumnNames(columns);
  }

  loadObjectIntoNdframe({
    data,
    type,
    index,
    columns,
    dtypes
  }) {
    if (type === 1 && Array.isArray(data)) {
      const _data = data.map(item => {
        return Object.values(item);
      });

      let _columnNames;

      if (columns) {
        _columnNames = columns;
      } else {
        _columnNames = Object.keys(data[0]);
      }

      this.loadArrayIntoNdframe({
        data: _data,
        index,
        columns: _columnNames,
        dtypes
      });
    } else {
      const [_data, _colNames] = _utils.utils.getRowAndColValues(data);

      let _columnNames;

      if (columns) {
        _columnNames = columns;
      } else {
        _columnNames = _colNames;
      }

      this.loadArrayIntoNdframe({
        data: _data,
        index,
        columns: _columnNames,
        dtypes
      });
    }
  }

  get tensor() {
    if (this.$isSeries) {
      return (0, _tfjsNode.tensor1d)(this.$data);
    } else {
      return (0, _tfjsNode.tensor2d)(this.$data);
    }
  }

  get dtypes() {
    return this.$dtypes;
  }

  $setDtypes(dtypes) {
    if (this.$isSeries) {
      if (dtypes) {
        if (this.$data.length != 0 && dtypes.length != 1) {
          _errors.default.throwDtypesLengthError(this, dtypes);
        }

        if (!_defaults.DATA_TYPES.includes(`${dtypes[0]}`)) {
          _errors.default.throwDtypeNotSupportedError(dtypes[0]);
        }

        this.$dtypes = dtypes;
      } else {
        this.$dtypes = _utils.utils.inferDtype(this.$data);
      }
    } else {
      if (dtypes) {
        if (this.$data.length != 0 && dtypes.length != this.shape[1]) {
          _errors.default.throwDtypesLengthError(this, dtypes);
        }

        if (this.$data.length == 0 && dtypes.length == 0) {
          this.$dtypes = dtypes;
        } else {
          dtypes.forEach(dtype => {
            if (!_defaults.DATA_TYPES.includes(dtype)) {
              _errors.default.throwDtypeNotSupportedError(dtype);
            }
          });
          this.$dtypes = dtypes;
        }
      } else {
        this.$dtypes = _utils.utils.inferDtype(this.$data);
      }
    }
  }

  get ndim() {
    if (this.$isSeries) {
      return 1;
    } else {
      return 2;
    }
  }

  get axis() {
    return {
      index: this.$index,
      columns: this.$columns
    };
  }

  get config() {
    return this.$config;
  }

  $setConfig(config) {
    this.$config = config;
  }

  get index() {
    return this.$index;
  }

  $setIndex(index) {
    if (index) {
      if (this.$data.length != 0 && index.length != this.shape[0]) {
        _errors.default.throwIndexLengthError(this, index);
      }

      if (Array.from(new Set(index)).length !== this.shape[0]) {
        _errors.default.throwIndexDuplicateError();
      }

      this.$index = index;
    } else {
      this.$index = _utils.utils.range(0, this.shape[0] - 1);
    }
  }

  $resetIndex() {
    this.$index = _utils.utils.range(0, this.shape[0] - 1);
  }

  get columns() {
    return this.$columns;
  }

  $setColumnNames(columns) {
    if (this.$isSeries) {
      if (columns) {
        if (this.$data.length != 0 && columns.length != 1 && typeof columns != 'string') {
          _errors.default.throwColumnNamesLengthError(this, columns);
        }

        this.$columns = columns;
      } else {
        this.$columns = ["0"];
      }
    } else {
      if (columns) {
        if (this.$data.length != 0 && columns.length != this.shape[1]) {
          _errors.default.throwColumnNamesLengthError(this, columns);
        }

        if (Array.from(new Set(columns)).length !== this.shape[1]) {
          _errors.default.throwColumnDuplicateError();
        }

        this.$columns = columns;
      } else {
        this.$columns = _utils.utils.range(0, this.shape[1] - 1).map(val => `${val}`);
      }
    }
  }

  get shape() {
    if (this.$data.length === 0) return [0, 0];

    if (this.$isSeries) {
      return [this.$data.length, 1];
    } else {
      const rowLen = this.$data.length;
      const colLen = this.$data[0].length;
      return [rowLen, colLen];
    }
  }

  get values() {
    return this.$data;
  }

  $setValues(values, checkLength = true, checkColumnLength = true) {
    if (this.$isSeries) {
      if (checkLength && values.length != this.shape[0]) {
        _errors.default.throwRowLengthError(this, values.length);
      }

      this.$data = values;
      this.$dtypes = _utils.utils.inferDtype(values);

      if (!this.$config.isLowMemoryMode) {
        this.$dataIncolumnFormat = values;
      }
    } else {
      if (checkLength && values.length != this.shape[0]) {
        _errors.default.throwRowLengthError(this, values.length);
      }

      if (checkColumnLength) {
        values.forEach(value => {
          if (value.length != this.shape[1]) {
            _errors.default.throwColumnLengthError(this, values.length);
          }
        });
      }

      this.$data = values;
      this.$dtypes = _utils.utils.inferDtype(values);

      if (!this.$config.isLowMemoryMode) {
        this.$dataIncolumnFormat = _utils.utils.transposeArray(values);
      }
    }
  }

  get size() {
    return this.shape[0] * this.shape[1];
  }

  toCSV(options) {
    return toCSV(this, options);
  }

  toJSON(options) {
    return toJSON(this, options);
  }

  toExcel(options) {
    return toExcel(this, options);
  }

  print() {
    console.log(this + "");
  }

}

exports.default = NDframe;
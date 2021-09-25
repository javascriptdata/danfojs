"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
class ErrorThrower {
  throwColumnNamesLengthError(ndframe, columns) {
    const msg = `ParamError: Column names length mismatch. You provided a column of length ${columns.length} but Ndframe columns has lenght of ${ndframe.shape[1]}`;
    throw new Error(msg);
  }

  throwIndexLengthError(ndframe, index) {
    const msg = `IndexError: You provided an index of length ${index.length} but Ndframe rows has lenght of ${ndframe.shape[0]}`;
    throw new Error(msg);
  }

  throwIndexDuplicateError() {
    const msg = `IndexError: Row index must contain unique values`;
    throw new Error(msg);
  }

  throwColumnDuplicateError() {
    const msg = `ColumnIndexError: Column index must contain unique values`;
    throw new Error(msg);
  }

  throwDtypesLengthError(ndframe, dtypes) {
    const msg = `DtypeError: You provided a dtype array of length ${dtypes.length} but Ndframe columns has lenght of ${ndframe.shape[1]}`;
    throw new Error(msg);
  }

  throwDtypeNotSupportedError(dtype) {
    const msg = `DtypeError: Dtype "${dtype}" not supported. dtype must be one of "${DATA_TYPES}"`;
    throw new Error(msg);
  }

  throwColumnLengthError(ndframe, arrLen) {
    const msg = `ParamError: Column data length mismatch. You provided data with length ${arrLen} but Ndframe has column of lenght ${ndframe.shape[1]}`;
    throw new Error(msg);
  }

  throwRowLengthError(ndframe, arrLen) {
    const msg = `ParamError: Row data length mismatch. You provided data with length ${arrLen} but Ndframe has row of lenght ${ndframe.shape[0]}`;
    throw new Error(msg);
  }

  throwColumnNotFoundError(ndframe) {
    const msg = `ParamError: Column not found!. Column name must be one of ${ndframe.columns}`;
    throw new Error(msg);
  }

  throwNotImplementedError() {
    const msg = `Method not implemented`;
    throw new Error(msg);
  }

  throwIlocRowIndexError() {
    const msg = `ParamError: rows parameter must be a Array. For example: rows: [1,2] or rows: ["0:10"]`;
    throw new Error(msg);
  }

  throwIlocColumnsIndexError() {
    const msg = `ParamError: columns parameter must be a Array. For example: columns: [1,2] or columns: ["0:10"]`;
    throw new Error(msg);
  }

  throwStringDtypeOperationError(operation) {
    const msg = `DtypeError: String data type does not support ${operation} operation`;
    throw new Error(msg);
  }

  throwSeriesMathOpLengthError(ndframe, other) {
    const msg = `ParamError: Row length mismatch. Length of other (${other.shape[0]}), must be the same as Ndframe (${ndframe.shape[0]})`;
    throw new Error(msg);
  }

}

var _default = new ErrorThrower();

exports.default = _default;
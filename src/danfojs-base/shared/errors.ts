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
import DataFrame from "../core/frame"
import NDframe from "../core/generic"
import { DATA_TYPES } from "./defaults"

/**
 * Package wide error throwing class
 */
class ErrorThrower {

    throwColumnNamesLengthError = (ndframe: NDframe, columns: Array<string>): void => {
        const msg = `ParamError: Column names length mismatch. You provided a column of length ${columns.length} but Ndframe columns has length of ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwIndexLengthError = (ndframe: NDframe, index: Array<string | number>): void => {
        const msg = `IndexError: You provided an index of length ${index.length} but Ndframe rows has length of ${ndframe.shape[0]}`
        throw new Error(msg)
    }

    throwIndexDuplicateError = (): void => {
        const msg = `IndexError: Row index must contain unique values`
        throw new Error(msg)
    }
    
    throwColumnDuplicateError = (): void => {
        const msg = `ColumnIndexError: Column index must contain unique values`
        throw new Error(msg)
    }

    throwDtypesLengthError = (ndframe: NDframe, dtypes: Array<string>): void => {
        const msg = `DtypeError: You provided a dtype array of length ${dtypes.length} but Ndframe columns has length of ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwDtypeNotSupportedError = (dtype: string): void => {
        const msg = `DtypeError: Dtype "${dtype}" not supported. dtype must be one of "${DATA_TYPES}"`
        throw new Error(msg)
    }

    throwColumnLengthError = (ndframe: NDframe | DataFrame, arrLen: number): void => {
        const msg = `ParamError: Column data length mismatch. You provided data with length ${arrLen} but Ndframe has column of length ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwRowLengthError = (ndframe: NDframe, arrLen: number): void => {
        const msg = `ParamError: Row data length mismatch. You provided data with length ${arrLen} but Ndframe has row of length ${ndframe.shape[0]}`
        throw new Error(msg)
    }

    throwColumnNotFoundError = (ndframe: DataFrame | NDframe): void => {
        const msg = `ParamError: Column not found!. Column name must be one of ${ndframe.columns}`
        throw new Error(msg)
    }

    throwNotImplementedError = (): void => {
        const msg = `Method not implemented`
        throw new Error(msg)
    }

    throwIlocRowIndexError = (): void => {
        const msg = `ParamError: rows parameter must be a Array. For example: rows: [1,2] or rows: ["0:10"]`
        throw new Error(msg)
    }

    throwIlocColumnsIndexError = (): void => {
        const msg = `ParamError: columns parameter must be a Array. For example: columns: [1,2] or columns: ["0:10"]`
        throw new Error(msg)
    }

    throwStringDtypeOperationError = (operation: string): void => {
        const msg = `DtypeError: String data type does not support ${operation} operation`
        throw new Error(msg)
    }

    throwSeriesMathOpLengthError = (ndframe: NDframe, other: NDframe): void => {
        const msg = `ParamError: Row length mismatch. Length of other (${other.shape[0]}), must be the same as Ndframe (${ndframe.shape[0]})`
        throw new Error(msg)
    }

}

export default new ErrorThrower()
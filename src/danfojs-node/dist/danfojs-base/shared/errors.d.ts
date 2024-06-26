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
import DataFrame from "../core/frame";
import NDframe from "../core/generic";
/**
 * Package wide error throwing class
 */
declare class ErrorThrower {
    throwColumnNamesLengthError: (ndframe: NDframe, columns: Array<string>) => void;
    throwIndexLengthError: (ndframe: NDframe, index: Array<string | number>) => void;
    throwIndexDuplicateError: () => void;
    throwColumnDuplicateError: () => void;
    throwDtypesLengthError: (ndframe: NDframe, dtypes: Array<string>) => void;
    throwDtypeNotSupportedError: (dtype: string) => void;
    throwDtypeWithoutColumnError: () => void;
    throwColumnLengthError: (ndframe: NDframe | DataFrame, arrLen: number) => void;
    throwRowLengthError: (ndframe: NDframe, arrLen: number) => void;
    throwColumnNotFoundError: (ndframe: DataFrame | NDframe) => void;
    throwNotImplementedError: () => void;
    throwIlocRowIndexError: () => void;
    throwIlocColumnsIndexError: () => void;
    throwStringDtypeOperationError: (operation: string) => void;
    throwSeriesMathOpLengthError: (ndframe: NDframe, other: NDframe) => void;
}
declare const _default: ErrorThrower;
export default _default;

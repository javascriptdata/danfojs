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
import Series from "./series";
import Utils from "../shared/utils"
import { ArrayType1D } from "@base/shared/types";

const utils = new Utils();

/**
 * Generic function for performing add, sub, pow, mul and mod operation on a series
 * @param object
 * 
 * ndframe ==> The current Series
 * 
 * other ==> The Series or number to perform math operation with
 * 
 * operation ==> The type of operation to perform
*/
export function _genericMathOp({ ndFrame, other, operation }: {
    ndFrame: Series
    other: Series | number
    operation: string
}): ArrayType1D {
    if (typeof other === 'number') {
        //broadcast operation
        let newData;
        switch (operation) {
            case 'add':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.add(other).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele => ele + other))
                    return newData
                }
            case 'sub':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.sub(other).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele => ele - other))
                    return newData
                }
            case 'mul':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.mul(other).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele => ele * other))
                    return newData
                }
            case 'div':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.div(other).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele => ele / other))
                    return newData
                }
            case 'mod':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.mod(other).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele => ele % other))
                    return newData
                }
            case 'pow':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.pow(other).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele => ele ** other))
                    return newData
                }
            default:
                throw new Error(`${operation} is not implemented`);

        }
    } else {
        utils.checkSeriesOpCompactibility({ firstSeries: ndFrame, secondSeries: other, operation })

        let newData;
        switch (operation) {
            case 'add':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.add(other.tensor).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele, index) => { return ele + (other.values as number[])[index] })
                    return newData
                }
            case 'sub':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.sub(other.tensor).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele, index) => { return ele - (other.values as number[])[index] })
                    return newData
                }
            case 'mul':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.mul(other.tensor).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele, index) => { return ele * (other.values as number[])[index] })
                    return newData
                }
            case 'div':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.div(other.tensor).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele, index) => { return ele / (other.values as number[])[index] })
                    return newData
                }
            case 'mod':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.mod(other.tensor).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele, index) => { return ele % (other.values as number[])[index] })
                    return newData
                }
            case 'pow':
                if (ndFrame.config.toUseTfjsMathFunctions) {
                    return ndFrame.tensor.pow(other.tensor).arraySync() as ArrayType1D
                } else {
                    newData = (ndFrame.values as number[]).map((ele, index) => { return ele ** (other.values as number[])[index] })
                    return newData
                }
            default:
                throw new Error(`${operation} is not implemented`);
        }
    }

}
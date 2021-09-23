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
    other: Series | number | Array<number>
    operation: string
}) {
    if (typeof other === 'number') {
        //broadcast operation
        let newData;
        switch (operation) {
            case 'add':
                newData = (ndFrame.values as number[]).map((ele => ele + other))
                return newData

            case 'sub':
                newData = (ndFrame.values as number[]).map((ele => ele - other))
                return newData

            case 'mul':
                newData = (ndFrame.values as number[]).map((ele => ele * other))
                return newData

            case 'div':
                newData = (ndFrame.values as number[]).map((ele => ele / other))
                return newData

            case 'mod':
                newData = (ndFrame.values as number[]).map((ele => ele % other))
                return newData

            case 'pow':
                newData = (ndFrame.values as number[]).map((ele => ele ** other))
                return newData

            case 'minimum':
                newData = (ndFrame.values as number[]).map((ele => Math.min(ele, other)))
                return newData

            case 'maximum':
                newData = (ndFrame.values as number[]).map((ele => Math.max(ele, other)))
                return newData

            default:
                throw new Error(`${operation} is not implemented`);

        }
    } else if (other instanceof Series) {
        utils.checkSeriesOpCompactibility({ firstSeries: ndFrame, secondSeries: other, operation })

        let newData;
        switch (operation) {
            case 'add':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele + (other.values as number[])[index] })
                return newData

            case 'sub':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele - (other.values as number[])[index] })
                return newData

            case 'mul':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele * (other.values as number[])[index] })
                return newData

            case 'div':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele / (other.values as number[])[index] })
                return newData

            case 'mod':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele % (other.values as number[])[index] })
                return newData

            case 'pow':
                newData = (ndFrame.values as number[]).map((ele, index) => { return ele ** (other.values as number[])[index] })
                return newData

            case 'minimum':
                newData = (ndFrame.values as number[]).map((ele, index) => { return Math.min(ele, (other.values as number[])[index]) })
                return newData

            case 'maximum':
                newData = (ndFrame.values as number[]).map((ele, index) => { return Math.max(ele, (other.values as number[])[index]) })
                return newData

            default:
                throw new Error(`${operation} is not implemented`);
        }
    } else if (Array.isArray(other)) {
        if(other.length !== ndFrame.values.length){
            throw new Error(`ParamError: Length of array must be equal to length of Series`)
        }
        let newData;
        switch (operation) {
            case 'add':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele + (other as number[])[index] })
                return newData

            case 'sub':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele - (other as number[])[index] })
                return newData

            case 'mul':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele * (other as number[])[index] })
                return newData

            case 'div':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele / (other as number[])[index] })
                return newData

            case 'mod':

                newData = (ndFrame.values as number[]).map((ele, index) => { return ele % (other as number[])[index] })
                return newData

            case 'pow':
                newData = (ndFrame.values as number[]).map((ele, index) => { return ele ** (other as number[])[index] })
                return newData

            case 'minimum':
                newData = (ndFrame.values as number[]).map((ele, index) => { return Math.min(ele, (other as number[])[index]) })
                return newData

            case 'maximum':
                newData = (ndFrame.values as number[]).map((ele, index) => { return Math.max(ele, (other as number[])[index]) })
                return newData

        }
    } else {
        throw new Error("ParamError: value for other not supported. It must be either a scalar, Array or Series");
    }
}
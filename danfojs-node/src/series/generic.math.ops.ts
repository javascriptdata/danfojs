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
import Series from "./";
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
    other: Series | number
    operation: string
}): Series {
    if (typeof other === 'number') {
        //broadcast operation
        let newData;
        switch (operation) {
            case 'add':
                newData = ndFrame.tensor.add(other).arraySync();
                return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
            case 'sub':
                newData = ndFrame.tensor.sub(other).arraySync();
                return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
            case 'mul':
                newData = ndFrame.tensor.mul(other).arraySync();
                return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
            case 'mod':
                newData = ndFrame.tensor.mod(other).arraySync();
                return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
            case 'pow':
                newData = ndFrame.tensor.pow(other).arraySync();
                return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
            default:
                throw new Error(`${operation} is not implemented`);

        }
    } else {
        const { status, message } = utils.checkSeriesOpCompactibility({ firstSeries: ndFrame, secondSeries: other, operation })

        if (status) {
            let newData;
            switch (operation) {
                case 'add':
                    newData = ndFrame.tensor.add(other.tensor).arraySync();
                    return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
                case 'sub':
                    newData = ndFrame.tensor.sub(other.tensor).arraySync();
                    return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
                case 'mul':
                    newData = ndFrame.tensor.mul(other.tensor).arraySync();
                    return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
                case 'mod':
                    newData = ndFrame.tensor.mod(other.tensor).arraySync();
                    return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
                case 'pow':
                    newData = ndFrame.tensor.pow(other.tensor).arraySync();
                    return utils.createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries: true });
                default:
                    throw new Error(`${operation} is not implemented`);

            }

        } else {
            throw new Error(message);
        }
    }

}
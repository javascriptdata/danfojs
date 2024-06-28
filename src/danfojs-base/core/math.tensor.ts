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
import tensorflow from '../shared/tensorflowlib'
import Series from "./series";


export function add(obj:Series, other: Series | Array<number> | number) {
    let objTensor = obj.tensor
    let otherTensor:any
    if(other instanceof Series){
        otherTensor = other.tensor
    }else if(Array.isArray(other)){
        otherTensor = tensorflow.tensor1d(other);
    }else{
        otherTensor = tensorflow.scalar(other)
    }
    return objTensor.add(otherTensor).arraySync()
}

export function sub(obj:Series, other: Series | Array<number> | number) {
    let objTensor = obj.tensor
    let otherTensor:any
    if(other instanceof Series){
        otherTensor = other.tensor
    }else if(Array.isArray(other)){
        otherTensor = tensorflow.tensor1d(other);
    }else{
        otherTensor = tensorflow.scalar(other)
    }
    return objTensor.sub(otherTensor).arraySync()
}
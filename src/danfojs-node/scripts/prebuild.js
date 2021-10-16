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

/**
 * Danfojs-node version uses Tensorflowjs-node package. Hence on bundling, we set the tensorflow lib
 * to use the Tensorflowjs-node package.
 * */

/* eslint-disable no-undef */
const fs = require('fs');

function updateTensorflowLib(tensorflowLibPath) {
  const importStatement = `const tf = require("@tensorflow/tfjs-node")\nexport default tf`;
  fs.writeFileSync(tensorflowLibPath, importStatement);
}

updateTensorflowLib('../danfojs-base/shared/tensorflowlib.ts');

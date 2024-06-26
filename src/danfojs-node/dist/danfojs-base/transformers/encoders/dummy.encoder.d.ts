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
import DataFrame from "../../core/frame";
import Series from "../../core/series";
/**
 * Generate one-hot encoding for categorical columns in an Array, Series or Dataframe.
 * @param data Series or Dataframe
 * @param columns Columns to encode
 * @param prefix Prefix for the new columns
 * @param prefixSeparator Separator for the prefix and the column name
 * @returns Encoded Dataframe
 * @example
 * import { DataFrame, DummyEncoder }from 'danfojs';
 * const df = new DataFrame([[1,2,3], [4,5,6]], { columns: ['a', 'b', 'c'] });
 * const df2 = new DummyEncoder({data: df, columns: ['a', 'b'], prefix: 'enc', prefixSeparator: '#'}).encode();
 * df2.print();
 */
declare function dummyEncode(data: Series | DataFrame, options?: {
    columns?: string | Array<string>;
    prefix?: string | Array<string>;
    prefixSeparator?: string | Array<string>;
}): DataFrame;
export default dummyEncode;

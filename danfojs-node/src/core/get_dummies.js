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
import DataFrame from "./frame";
import Series from "./series";
import { utils } from "../shared/utils";


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
function dummyEncode(data, options) {
  let { columns, prefix, prefixSeparator } = { prefixSeparator: "_", ...options };

  if (!data) {
    throw new Error('ParamError: data must be one of Array, Series or DataFrame');
  }

  if (data instanceof Series || data instanceof DataFrame) {
    if (!columns) {
      const colsWithStringDtype = [];
      data.dtypes.forEach((dtype, index) => {
        if (dtype === "string") {
          colsWithStringDtype.push(data.columns[index]);
        }
      });
      columns = colsWithStringDtype;
    }
  } else {
    throw new Error('ParamError: data must be one of Array, Series or DataFrame');
  }


  if (typeof columns === "string") {
    columns = [columns];
    if (Array.isArray(prefix) && prefix.length === 1) {
      prefix = prefix;
    } else if (typeof prefix === "string") {
      prefix = [prefix];
    } else {
      throw new Error('ParamError: prefix must be a string, or an array of same length as columns');
    }

    if (Array.isArray(prefixSeparator) && prefixSeparator.length === 1) {
      prefixSeparator = prefixSeparator;
    } else if (typeof prefixSeparator === "string") {
      prefixSeparator = [prefixSeparator];
    } else {
      throw new Error('ParamError: prefix must be a string, or an array of same length as columns');
    }
  } else if (Array.isArray(columns)) {
    if (prefix) {
      if (Array.isArray(prefix) && prefix.length !== columns.length) {
        throw new Error(`ParamError: prefix and data array must be of the same length. If you need to use the same prefix, then pass a string param instead. e.g {prefix: "${prefix}"}`);
      }

      if (typeof prefix === "string") {
        prefix = columns.map((_) => prefix);
      }
    }

    if (prefixSeparator) {
      if (Array.isArray(prefixSeparator) && prefixSeparator.length !== columns.length) {
        throw new Error(`ParamError: prefixSeparator and data array must be of the same length. If you need to use the same prefix separator, then pass a string param instead. e.g {prefixSeparator: "${prefixSeparator}"}`);
      }

      if (typeof prefixSeparator === "string") {
        prefixSeparator = columns.map((_) => prefixSeparator);
      }
    }

  } else {
    throw new Error('ParamError: columns must be a string or an array of strings');
  }

  if (data instanceof Series) {
    const colData = data.values;
    const newColumnNames = [];
    const uniqueValues = Array.from(new Set(colData));
    const oneHotArr = utils.zeros(colData.length, uniqueValues.length);

    for (let i = 0; i < colData.length; i++) {
      const index = uniqueValues.indexOf(colData[i]);
      oneHotArr[i][index] = 1;
    }

    for (let i = 0; i < uniqueValues.length; i++) {
      const prefixToAdd = prefix ? prefix[0] : i;
      newColumnNames.push(`${prefixToAdd}${prefixSeparator[0]}${uniqueValues[i]}`);

    }

    return new DataFrame(oneHotArr, { columns: newColumnNames });

  } else {

    const dfWithSelectedColumnsDropped = data.drop({ columns });
    let newData = dfWithSelectedColumnsDropped?.values;
    const newColumnNames = dfWithSelectedColumnsDropped?.columns;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const colData = data.column(column).values;

      const uniqueValues = Array.from(new Set(colData));
      const oneHotArr = utils.zeros(colData.length, uniqueValues.length);

      for (let j = 0; j < colData.length; j++) {
        const index = uniqueValues.indexOf(colData[j]);
        oneHotArr[j][index] = 1;
        const prefixToAdd = prefix ? prefix[i] : column;
        newColumnNames.push(`${prefixToAdd}${prefixSeparator[i]}${colData[j]}`);
      }

      for (let k = 0; k < newData.length; k++) {
        newData[k] = [...newData[k], ...oneHotArr[k]];

      }

    }

    return new DataFrame(newData, { columns: newColumnNames });
  }

}

export default dummyEncode;

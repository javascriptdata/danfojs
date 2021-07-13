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
import * as tf from '@tensorflow/tfjs-node';
import NDframe from "../core/generic";
import { _iloc } from "./iloc";
import { _genericMathOp } from "./generic.math.ops";
import Utils from "../shared/utils"
import { NdframeInputDataType } from "../shared/types";

const utils = new Utils();

/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between Series (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param  Object   
 * 
 *  data:  1D Array, JSON, Tensor, Block of data.
 * 
 *  index: Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * 
 *  columnNames: Array of column names. If not specified, column names are auto generated.
 * 
 *  dtypes: Array of data types for each the column. If not specified, dtypes inferred.
 * 
 *  config: General configuration object for NDframe      
 *
 */
export default class Series extends NDframe {

    constructor({ data, index, columnNames, dtypes, config }: NdframeInputDataType) {
        if (Array.isArray(data[0]) || utils.isObject(data[0])) {
            data = utils.convert2DArrayToSeriesArray(data);
            super({ data, index, columnNames, dtypes, config });
        } else {
            super({ data, index, columnNames, dtypes, config });
        }
    }

    /**
     * Purely integer-location based indexing for selection by position.
     * 
     * @param rows An array of input. iloc is integer position based (from 0 to length-1 of the axis).
     * 
     * Allowed inputs are:
     * 
     *    An integer, e.g. 5.
     * 
     *    A list or array of integers, e.g. [4, 3, 0]
     * 
     *    A slice object with ints, e.g. 1:7.
     * 
    */
    iloc(rows: Array<string | number>) {
        return _iloc({ ndFrame: this, rows })
    }

    /**
      * Returns the first n values in a Series
      * @param rows The number of rows to return
    */
    head(rows: number = 5): Series {
        return this.iloc([`0:${rows}`])
    }

    /**
      * Returns the last n values in a Series
      * @param rows The number of rows to return
    */
    tail(rows: number = 5): Series {
        const startIdx = this.shape[0] - rows
        return this.iloc([`${startIdx}:`])
    }

    /**
     * Gets [num] number of random rows in a dataframe
     * @param num The number of rows to return
     * @param seed (Optional) An integer specifying the random seed that will be used to create the distribution.
      */
    async sample(num = 5, seed = 1) {
        if (num > this.shape[0]) {
            throw new Error("Sample size n cannot be bigger than size of dataset");
        }
        if (num < -1 || num == 0) {
            throw new Error("Sample size cannot be less than -1 or be equal to 0");
        }
        num = num === -1 ? this.shape[0] : num;

        const shuffledIndex = await tf.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
        const sf = this.iloc(shuffledIndex);
        return sf;
    }

    /**
      * Return Addition of series and other, element-wise (binary operator add).
      * Equivalent to series + other
      * @param other Series or Number to add
      */
    add(other: Series | number): Series {
        return _genericMathOp({ ndFrame: this, other, operation: "add" })
    }

    /**
      * Returns the subtraction between a series and other, element-wise (binary operator subtraction).
      * Equivalent to series - other
      * @param other Number to subtract
      */
    sub(other: Series | number): Series {
        return _genericMathOp({ ndFrame: this, other, operation: "sub" })

    }

    /**
      * Return Multiplication of series and other, element-wise (binary operator mul).
      * Equivalent to series * other
      * @param other Number to multiply with.
    */
    mul(other: Series | number): Series {
        return _genericMathOp({ ndFrame: this, other, operation: "mul" })
    }

    /**
      * Return division of series and other, element-wise (binary operator div).
      * Equivalent to series / other
      * @param other Series or number to divide with.
      */
    div(other: Series | number, round = true): Series {
        if (typeof other == "number") {
            const divResult = this.tensor.div(other)
            return new Series({
                data: divResult.arraySync(),
                index: this.index,
                columnNames: this.columnNames,
                dtypes: [divResult.dtype],
                config: this.config
            })
        } else {
            const { status, message } = utils.checkSeriesOpCompactibility({ firstSeries: this, secondSeries: other, operation: "div" })
            if (status) {
                let dtype
                //Check if caller needs a float division
                if (round) {
                    dtype = "float32";
                } else {
                    dtype = "int32";
                }
                //dtype may change after division because of how TFJS works internally, so save dtypes first
                const tensor1 = this.tensor.asType(dtype as "float32" | "int32");
                const tensor2 = other.tensor.asType(dtype as "float32" | "int32");
                const divResult = tensor1.div(tensor2);
                return new Series({
                    data: divResult.arraySync(),
                    index: this.index,
                    columnNames: this.columnNames,
                    dtypes: [divResult.dtype],
                    config: this.config
                })
            } else {
                throw new Error(message);
            }
        }
    }

    /**
      * Return Exponential power of series and other, element-wise (binary operator pow).
      * Equivalent to series ** other
      *  @param other Number to multiply with.
      */
    pow(other: Series | number): Series {
        return _genericMathOp({ ndFrame: this, other, operation: "pow" })
    }

    /**
      * Return Modulo of series and other, element-wise (binary operator mod).
      * Equivalent to series % other
      *  @param other Number to modulo with
    */
    mod(other: Series | number): Series {
        return _genericMathOp({ ndFrame: this, other, operation: "mod" })
    }


}
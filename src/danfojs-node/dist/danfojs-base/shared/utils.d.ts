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
import { ArrayType1D, ArrayType2D } from './types';
import { Series } from '../';
import { DataFrame } from '../';
/**
 * General Utility class
 */
export default class Utils {
    /**
     * Removes an element from a 1D array
     *
     * ```js
     *
     * ```
     * @param arr The array to filter.
     * @param index The index to filter by.
     */
    removeElementFromArray(arr: ArrayType1D, index: number): ArrayType1D;
    /**
     * Check if value is a string.
     * @param value The value to check.
     * @returns
     */
    isString<T>(value: T): boolean;
    /**
     * Checks if value is a number.
     * @param value The value to check.
     * @returns
     */
    isNumber<T>(value: T): boolean;
    /**
     * Checks if value is an object.
     * @param value The value to check.
     * @returns
     */
    isObject(value: any): boolean;
    /**
     * Checks if a value is null
     * @param value The value to check.
     * @returns
     */
    isNull<T>(value: T): boolean;
    /**
     * Checks if a value is undefined
     * @param value The value to check.
     * @returns
     */
    isUndefined<T>(value: T): boolean;
    /**
     * Checks if a value is empty. Empty means it's either null, undefined or NaN
     * @param value The value to check.
     * @returns
     */
    isEmpty<T>(value: T): boolean;
    /**
     * Checks if a value is a date object
     * @param value A date object
     * @returns boolean
     */
    isDate(value: any): boolean;
    /**
     * Generates an array of integers between specified range
     * @param start The starting number.
     * @param end The ending number.
     */
    range(start: number, end: number): Array<number>;
    /**
     * Checks if object has the specified key
     * @param obj The object to check.
     * @param key The key to find.
     */
    keyInObject(obj: object, key: number | string): boolean;
    /**
     * Transposes an array of array
     * @param obj The object to check.
     * @param key The key to find.
     */
    transposeArray(arr: ArrayType1D | ArrayType2D): ArrayType1D | ArrayType2D;
    /**
     * Retrieve row array and column names from an object of the form {a: [1,2,3,4], b: [30,20, 30, 20]}
     * @param obj The object to retrieve rows and column names from.
     */
    getRowAndColValues(obj: object): [ArrayType1D | ArrayType2D, string[]];
    /**
     * Converts a 2D array of array to 1D array for Series Class
     * @param arr The array to convert.
     */
    convert2DArrayToSeriesArray(arr: ArrayType2D): Array<string>;
    /**
     * Replaces all missing values with NaN. Missing values are undefined, Null and Infinity
     * @param arr The array
     * @param isSeries Whether the arr is a series or not
     */
    replaceUndefinedWithNaN(arr: ArrayType1D | ArrayType2D, isSeries: boolean): ArrayType1D | ArrayType2D;
    /**
     * Infer data type from an array or array of arrays
     * @param arr An array or array of arrays
    */
    inferDtype(arr: ArrayType1D | ArrayType2D): string[];
    /**
     * Private type checker used by inferDtype function
     * @param arr The array
     */
    private $typeChecker;
    /**
     * Returns the unique values in an 1D array
     * @param arr The array
    */
    unique(arr: ArrayType1D): ArrayType1D;
    /**
     * Checks if array is 1D
     * @param arr The array
    */
    is1DArray(arr: ArrayType1D | ArrayType2D): boolean;
    /**
     * Converts an array to an object using array index as object keys
     * @param arr The array
    */
    convertArrayToObject(arr: ArrayType1D | ArrayType2D): any;
    /**
     * Count the NaN and non-NaN values present in an array
     * @param  arr Array object
     * @param val whether to return the value count instead of the null count
     * @param isSeries Whether the array is of type series or not
     */
    countNaNs(arr: ArrayType1D | ArrayType2D, returnVal: boolean | undefined, isSeries: boolean): number | Array<number>;
    /**
     * Round elements of an array or array of arrays to specified dp
     * @param arr The Array to round
     * @param dp The number of dp to round to
     * @param isSeries Whether the array is of type Series or not
     */
    round(arr: Array<number | number[]>, dp: number | undefined, isSeries: boolean): ArrayType1D | ArrayType2D;
    /**
     * Checks if a func is a function
     * @param func
     */
    isFunction(func: object): boolean;
    /**
     * Generates n random numbers between start and end.
     * @param start
     * @param end
     * @param size
     */
    randNumberGenerator(start: number, end: number, size: number): number[];
    /**
     * Throws error when a required parameter is missing.
     * @param paramsObject The parameters passed to the function
     * @param paramsNeeded The required parameters in the function
     */
    throwErrorOnWrongParams(paramsObject: object, paramsNeeded: Array<string>): void;
    /**
     * Maps integer values (0, 1) to boolean (false, true)
     * @param arr The array of integers
     * @param dim The dimension of the array
     */
    mapIntegersToBooleans(arr: Array<number | number[]>, dim: number): Array<boolean | boolean[]>;
    /**
     * Maps boolean values (false, true) to integer equivalent (0, 1)
     * @param arr The array of booleans
     * @param dim The dimension of the array
     */
    mapBooleansToIntegers(arr: Array<boolean | boolean[]>, dim: number): Array<number | number[]>;
    /**
     * Generates an array of dim (row x column) with inner values set to zero
     * @param row
     * @param column
     */
    zeros(row: number, column: number): ArrayType1D | ArrayType2D;
    /**
     * Shuffles and returns a random slice of an array
     * @param num
     * @param array
     */
    shuffle(array: ArrayType1D | ArrayType2D, num: number): ArrayType1D | ArrayType2D;
    /**
     * Sorts an array in specified order
     * @param arr
     * @param ascending
     * @returns
     */
    sort(arr: Array<number | string>, ascending?: boolean): Array<number | string>;
    /**
     * Checks if current environment is Browser
     */
    isBrowserEnv(): any;
    /**
     * Checks if current environment is Node
     */
    isNodeEnv(): any;
    /**
     * Remove NaN values from 1D array
     * @param arr
     */
    removeMissingValuesFromArray(arr: Array<number> | ArrayType1D): (string | number | boolean)[];
    /**
     * Replace NaN with null before tensor operations
     * @param arr
     */
    replaceNanWithNull(arr: ArrayType1D | ArrayType2D): (string | number | boolean | (string | number | boolean)[] | null)[];
    /**
     * Get duplicate values in a array
     * @param arr
     */
    getDuplicate<T>(arr: Array<T>): any;
    /**
     * Returns the index of a sorted array
     * @param arr1 The first array
     * @param arr2 The second array
     * @param dtype The data type of the arrays
     *
     * @returns sorted index
     */
    sortArrayByIndex(arr1: ArrayType1D | ArrayType2D, arr2: ArrayType1D | ArrayType2D, dtype: string): number[];
    /**
     * Returns a new series with properties of the old series
     *
     * @param series The series to copy
    */
    createNdframeFromNewDataWithOldProps({ ndFrame, newData, isSeries }: {
        ndFrame: Series;
        newData: any;
        isSeries: boolean;
    }): Series | DataFrame;
    /**
    * Checks if two series are compatible for a mathematical operation
    * @param object
    *
    *   firstSeries ==>  First Series object
    *
    *   secondSeries ==> Second Series object to comapre with
    *
    *   operation ==> The mathematical operation
    */
    checkSeriesOpCompactibility({ firstSeries, secondSeries, operation }: {
        firstSeries: Series;
        secondSeries: Series;
        operation: string;
    }): void;
    /**
    * Custom sort for an array of index and values
    * @param arr The array of objects to sort
    * @param ascending Whether to sort in ascending order or not
    */
    sortObj(arr: Array<{
        index: number | string;
        value: number | string | boolean;
    }>, ascending: boolean): {
        index: number | string;
        value: number | string | boolean;
    }[];
}

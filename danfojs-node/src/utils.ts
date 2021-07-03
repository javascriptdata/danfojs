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
import Configs from './config';

/**
 * Utility class for working with Frames and Series
 */
class Utils {
    /**
     * Removes an element from an array
     * 
     * ```js
     * 
     * ```
     * @param arr The array to filter.
     * @param index The index to filter by.
     */
    removeElementFromArray<T>(arr: Array<T>, index: number): Array<T> {
        const newArr = arr.filter((_: T, i: number) => i != index);
        return newArr;
    }

    /**
     * Checks if value is a string.
     * @param value The value to check.
     * @returns 
     */
    isString<T>(value: T): boolean {
        return typeof value === "string" && (value as any) instanceof String;
    }

    /**
     * Checks if value is a number.
     * @param value The value to check.
     * @returns 
     */
    isNumber<T>(value: T): boolean {
        return typeof value === "number" && isFinite(value);
    }

    /**
     * Checks if value is an object.
     * @param value The value to check.
     * @returns 
     */
    isObject(value: any): boolean {
        return typeof value === "object" && value.constructor && value.constructor.name === "Object";
    }

    /**
     * Checks if a value is null
     * @param value The value to check.
     * @returns 
     */
    isNull<T>(value: T): boolean {
        return value === null;
    }

    /**
     * Checks if a value is undefined
     * @param value The value to check.
     * @returns 
     */
    isUndefined<T>(value: T): boolean {
        return typeof value === "undefined";
    }

    /**
     * Generates an array of integers between specified range
     * @param start The starting number.
     * @param end The ending number.
     */
    range(start: number, end: number): Array<number> {
        const value = tf.linspace(start, end, end - start + 1).arraySync();
        return value;
    }

    /**
     * Checks if object has the specified key
     * @param obj The object to check.
     * @param key The key to find.
     */
    keyInObject<T>(obj: T, key: number | string): boolean {
        return Object.prototype.hasOwnProperty.call(obj, key)
    }

    /**
     * Transposes an array of array
     * @param obj The object to check.
     * @param key The key to find.
     */
    transposeArray<T>(arr: Array<T[]>): Array<T[]> { //old name: __get_col_values
        const rowLen: number = arr.length;
        const colLen: number = (arr[0] as Array<T>).length;
        const newArr: Array<T[]> = [];

        for (let i = 0; i <= colLen - 1; i++) {
            const temp = [];
            for (let j = 0; j < rowLen; j++) {
                const _elem = (arr as Array<T[]>)[j][i]
                temp.push(_elem);
            }
            newArr.push(temp);
        }
        return newArr;
    }

    /**
     * Retrieve row array and column names from an object of the form {a: [1,2,3,4], b: [30,20, 30, 20]}
     * @param obj The object to retrieve rows and column names from.
     */
    getRowAndColValues<T>(obj: T): [Array<T[]>, string[]] {
        const colNames = Object.keys(obj);
        const colData: Array<T[]> = Object.values(obj);
        const firstColLen = colData[0].length;

        colData.forEach((cdata) => {
            if (cdata.length != firstColLen) {
                throw Error("Length Error: Length of columns must be the same!");
            }
        });

        const rowsArr: Array<T[]> = this.transposeArray(colData)
        return [rowsArr, colNames];
    }

    /**
     * Converts a 2D array of array to 1D array for Series Class
     * @param arr The array to convert.
     */
    convert2DArrayToSeriesArray<T>(arr: Array<T>): Array<string> {
        const newArr: Array<string> = [];
        arr.map((val) => {
            if (this.isObject(val)) {
                newArr.push(JSON.stringify(val));
            } else {
                newArr.push(`${val}`);
            }
        });
        return newArr;
    }

    /**
     * Replaces all missing values with NaN
     * @param arr The array
     * @param isSeries Whether the arr is a series or not
     */
    replaceUndefinedWithNaN<T>(arr: Array<T | T[]>, isSeries: boolean) {
        if (isSeries) {
            const newArr = arr.map((ele) => {
                if (typeof ele === "undefined" || (ele as unknown as number) == Infinity || ele == null) {
                    return NaN
                } else {
                    return ele
                }
            });
            return newArr;
        } else {
            const newArr = []
            for (let i = 0; i < arr.length; i++) {
                const innerArr = arr[i] as Array<T>
                const temp = innerArr.map((ele: any) => {
                    if (typeof ele === "undefined" || ele == Infinity || ele == null) {
                        return NaN
                    } else {
                        return ele
                    }
                });
                newArr.push(temp);
            }
            return newArr;
        }
    }

    /**
     * Infer data type from an array
     * @param arr An array or array of arrays
    */
    inferDtype<T>(arr: Array<T>) {
        const self = this;
        if (this.is1DArray(arr)) {
            return [this._typeChecker(arr)];
        } else {
            const dtypes = arr.map((innerArr) => {
                return self._typeChecker(innerArr as unknown as Array<T>);
            });
            return dtypes;
        }
    }

    /**
     * Private type checker used by inferDtype function
     * @param arr The array
     */
    private _typeChecker<T>(arr: Array<T>) {
        let dtypes: string;
        let lim: number;
        let intTracker: Array<boolean> = [];
        let floatTracker: Array<boolean> = [];
        let stringTracker: Array<boolean> = [];
        let boolTracker: Array<boolean> = [];

        if (arr.length < Configs.getDtypeTestLim) {
            lim = arr.length - 1;
        } else {
            lim = Configs.getDtypeTestLim - 1;
        }

        const arrSlice = arr.slice(0, lim)

        for (let i = 0; i < lim; i++) {
            const ele = arrSlice[i];
            if (typeof ele == "boolean") {
                floatTracker.push(false);
                intTracker.push(false);
                stringTracker.push(false);
                boolTracker.push(true);
            } else if (isNaN(ele as unknown as number) && typeof ele != "string") {
                floatTracker.push(true);
                intTracker.push(false);
                stringTracker.push(false);
                boolTracker.push(false);
            } else if (!isNaN(Number(ele))) {
                if ((ele as unknown as string).toString().includes(".")) {
                    floatTracker.push(true);
                    intTracker.push(false);
                    stringTracker.push(false);
                    boolTracker.push(false);
                } else {
                    floatTracker.push(false);
                    intTracker.push(true);
                    stringTracker.push(false);
                    boolTracker.push(false);
                }
            } else {
                floatTracker.push(false);
                intTracker.push(false);
                stringTracker.push(true);
                boolTracker.push(false);
            }
        }

        const even = (ele: number | string | boolean) => ele == true;

        if (stringTracker.some(even)) {
            dtypes = "string";
        } else if (floatTracker.some(even)) {
            dtypes = "float32";
        } else if (intTracker.some(even)) {
            dtypes = "int32";
        } else if (boolTracker.some(even)) {
            dtypes = "boolean";
        } else {
            dtypes = "undefined";
        }

        return dtypes;
    }

    /**
     * Returns the unique values in an array
     * @param arr The array 
    */
    unique<T>(arr: Array<T>): Array<T> {
        const uniqueArr = new Set(arr);
        return Array.from(uniqueArr);
    }

    /**
     * Checks if array is 1D
     * @param arr The array 
    */
    is1DArray<T>(arr: Array<T>): boolean {
        if (
            typeof arr[0] == "number" ||
            typeof arr[0] == "string" ||
            typeof arr[0] == "boolean"
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Converts an array to an object using array index as object keys
     * @param arr The array 
    */
    convertArrayToObject<T>(arr: Array<T>) { //__arr_to_obj
        const arrObj: any = {};
        arr.forEach((ele, i) => {
            arrObj[ele] = i;
        });
        return arrObj;
    }

    /**
     * Count the NaN and non-NaN values present in an array
     * @param  arr Array object
     * @param val whether to return the value count instead of the null count
     * @param isSeries Whether the array is of type series or not
     */
    countNaNs<T>(arr: Array<T | T[]>, returnVal: boolean = true, isSeries: boolean): number | Array<number> {
        if (isSeries) {
            let nullCount = 0;
            let valCount = 0;
            arr.forEach((ele) => {
                if (Number.isNaN(ele)) {
                    nullCount = nullCount + 1;
                } else {
                    valCount = valCount + 1;
                }
            });
            if (returnVal) {
                return valCount;
            } else {
                return nullCount;
            }
        } else {
            const resultArr: Array<number> = [];
            arr.forEach((innerArr) => {
                let nullCount = 0;
                let valCount = 0;
                (innerArr as Array<T>).forEach((ele: any) => {
                    if (Number.isNaN(ele)) {
                        nullCount = nullCount + 1;
                    } else {
                        valCount = valCount + 1;
                    }
                });

                if (returnVal) {
                    resultArr.push(valCount);
                } else {
                    resultArr.push(nullCount);
                }
            });
            return resultArr;
        }
    }

    /**
     * Round elements of an array or array of arrays to specified dp
     * @param arr The Array to round
     * @param dp The number of dp to round to
     * @param isSeries Whether the array is of type Series or not
     */
    round(arr: Array<number | number[]>, dp: number = 2, isSeries: boolean) {
        if (dp < 0) {
            dp = 1;
        }
        if (isSeries) {
            const newArr: Array<number> = [];
            arr.map((val) => {
                newArr.push(Number((val as number).toFixed(dp)));
            });
            return newArr;
        } else {
            const resultArr: Array<number[]> = [];
            arr.forEach((inerArr) => {
                const newArr: Array<number> = [];
                (inerArr as Array<number>).forEach((val) => {
                    newArr.push(Number(val.toFixed(dp)));
                });
                resultArr.push(newArr);
            });
            return resultArr;
        }
    }

    /**
     * Checks if a func is a function
     * @param func 
     */
    isFunction<T>(func: T): boolean {
        return typeof func == "function";
    }

    /**
     * Generates n random numbers between start and end.
     * @param start 
     * @param end 
     * @param size 
     */
    randNumberGenerator(start: number, end: number, size: number) {
        let genNum: Array<number> = [];

        function randi(a: number, b: number) {
            return Math.floor(Math.random() * (b - a) + a);
        }

        function recursive(val: number, arr: Array<number>): any {
            if (!arr.includes(val)) {
                return val;
            }
            val = randi(start, end);
            recursive(val, arr);
        }

        for (let i = 0; i < size; i++) {
            let genVal = randi(start, end);
            let recursiveVal = recursive(genVal, genNum);
            genNum.push(recursiveVal);
        }
        return genNum;
    }

    /**
     * Throws error when a required parameter is missing.
     * @param paramsObject The parameters passed to the function
     * @param paramsNeeded The required parameters in the function
     */
    throwErrorOnWrongParams(paramsObject: Array<string>, paramsNeeded: Array<string>) {
        const keys = Object.keys(paramsObject);
        const bool = [];
        for (let i = 0; i < keys.length; i++) {
            if (paramsNeeded.includes(keys[i])) {
                bool.push(true);
            } else {
                bool.push(false);
            }
        }
        const truthy = (element: boolean) => element == false;
        if (bool.some(truthy)) {
            throw Error(
                `Params Error: Required parameter not found. Your params must be any of the following [${paramsNeeded}]`
            );
        }
    }

    /**
     * Maps integer values (0, 1) to boolean (false, true)
     * @param arr The array of integers
     * @param dim The dimension of the array
     */
    mapIntegersToBooleans(arr: Array<number | number[]>, dim: number): Array<boolean | boolean[]> {
        if (dim == 2) {
            const newArr: Array<boolean[]> = [];
            arr.map((innerArr) => {
                const temp: Array<boolean> = [];
                (innerArr as Array<number>).map((val) => temp.push(val == 1));
                newArr.push(temp);
            });
            return newArr;
        } else {
            const newArr: Array<boolean> = [];
            arr.map((val) => newArr.push(val == 1));
            return newArr;
        }
    }

    /**
     * Generates an array of dim (row x column) with inner values set to zero
     * @param row 
     * @param column 
     */
    zeros(row: number, column: number): Array<number[]> {
        const zeroData = [];
        for (let i = 0; i < row; i++) {
            const colData = Array(column);
            for (let j = 0; j < column; j++) {
                colData[j] = 0;
            }
            zeroData.push(colData);
        }
        return zeroData;
    }

    /**
     * Shuffles and returns a random slice of an array
     * @param num 
     * @param array 
     */
    shuffle<T>(array: Array<T>, num: number,) {
        let i = array.length;
        let j = 0;
        let temp;

        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array.slice(0, num);
    }

    /**
     * Sorts an array in specified order
     * @param arr 
     * @param ascending 
     * @returns 
     */
    sort<T>(arr: Array<T>, ascending: boolean = true): Array<T> {
        const sorted = [...arr]
        return sorted.sort((a, b) => {
            if (ascending) {
                if (typeof a === "string" && typeof b === "string") {
                    return a.charCodeAt(0) - b.charCodeAt(0);
                } else {
                    return (a as unknown as number) - (b as unknown as number)
                }
            } else {
                if (typeof a === "string" && typeof b === "string") {
                    return b.charCodeAt(0) - a.charCodeAt(0);
                } else {
                    return (b as unknown as number) - (a as unknown as number)
                }
            }
        });
    }

    /**
     * Checks if current environment is Browser
     */
    isBrowserEnv() {
        const isBrowser = new Function(
            "try {return this===window;}catch(e){ return false;}"
        );
        return isBrowser();
    }

    /**
     * Checks if current environment is Node
     */
    isNodeEnv() {
        const isNode = new Function(
            "try {return this===global;}catch(e){return false;}"
        );
        return isNode();
    }

    /**
     * Remove NaN values from an array
     * @param arr
     */
    removeNansFromArray<T>(arr: Array<T>) {
        const values = arr.filter((val) => !isNaN(val as unknown as number) && typeof val != "string");
        return values;
    }

    /**
     * Replace NaN with null before tensor operations
     * @param arr
     */
    replaceNanWithNull<T>(arr: Array<T>) {
        const values = arr.map((val) => {
            if (isNaN(val as unknown as number)) {
                return null;
            } else {
                return val;
            }
        });
        return values;
    }

    /**
     * Get duplicate values in a array
     * @param arr 
     */
    getDuplicate<T>(arr: Array<T>) {
        const tempObj: any = {};
        const resultObj: any = {};

        arr.forEach((val, index) => {
            if (this.keyInObject(tempObj, val as unknown as string | number)) {
                tempObj[val]["count"] += 1;
                tempObj[val]["index"].push(index);
            } else {
                tempObj[val] = {};
                tempObj[val]["count"] = 1;
                tempObj[val]["index"] = [index];
            }
        });

        for (let key in tempObj) {
            if (tempObj[key]["count"] >= 2) {
                resultObj[key] = {};
                resultObj[key]["count"] = tempObj[key]["count"];
                resultObj[key]["index"] = tempObj[key]["index"];
            }
        }

        return resultObj;
    }

    /**
     * Returns the index of a sorted array
     * @param arr1 The first array
     * @param arr2 The second array
     * @param dtype The data type of the arrays
     *
     * @returns sorted index
     */
    sortArrayByIndex<T>(arr1: Array<T>, arr2: Array<T>, dtype: string) {
        const sortedIdx = arr1.map((item, index) => {
            return [arr2[index], item];
        });
        if (dtype == "string") {
            sortedIdx.sort();
        } else {
            sortedIdx.sort(([arg1], [arg2]) => (arg2 as unknown as number) - (arg1 as unknown as number));
        }

        return sortedIdx.map(([, item]) => item);
    }
}

export default new Utils()
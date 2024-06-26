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
import { ArrayType1D, DateTime } from "../shared/types";
import Series from "./series";
/**
 * Format and handle all datetime operations on Series or Array of date strings
 * @param data Series or Array of date strings
 */
export default class TimeSeries implements DateTime {
    private $dateObjectArray;
    constructor(data: Series | ArrayType1D);
    /**
     * Processed the data values into internal structure for easy access
     * @param dateArray An array of date strings
    */
    private processData;
    /**
     *  Returns the month, in local time.
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-01",
     * "2019-03-01",
     * "2019-04-01",
     * ]
     * const df = new Series(data)
     * const dfNew = df.dt.month()
     * console.log(dfNew.values)
     * // [1, 2, 3, 4]
     * ```
    */
    month(): Series;
    /**
     * Returns the day of the week, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-01",
     * "2019-03-01",
     * "2019-04-01",
     * ]
     * const df = new Series(data)
     * const dayOfWeek = df.dt.dayOfWeek()
     * console.log(dayOfWeek.values)
     * ```
    */
    dayOfWeek(): Series;
    /**
     * Returns the year, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-01",
     * "2021-03-01",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const year = df.dt.year()
     * console.log(year.values)
     * // [2019, 2019, 2021, 2020]
     * ```
    */
    year(): Series;
    /**
     *  Returns the name of the month, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-01",
     * "2021-03-01",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const monthName = df.dt.monthName().values
     * console.log(monthName)
     * // ["January", "February", "March", "April"]
     * ```
    */
    monthName(): Series;
    /**
     * Returns the name of the day, of the week, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-01",
     * "2021-03-01",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const dayOfWeekName = df.dt.dayOfWeekName().values
     * console.log(dayOfWeekName)
     * ```
    */
    dayOfWeekName(): Series;
    /**
     * Returns the day of the month, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-05",
     * "2021-03-02",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const dayOfMonth = df.dt.dayOfMonth().values
     * console.log(dayOfMonth)
     * // [1, 5, 2, 1]
     * ```
    */
    dayOfMonth(): Series;
    /**
     * Returns the hour of the day, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-05",
     * "2021-03-02",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const hour = df.dt.hour().values
     * console.log(hour)
     * // [0, 0, 0, 0]
     * ```
    */
    hours(): Series;
    /**
     * Returns the second of the day, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-05",
     * "2021-03-02",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const second = df.dt.second().values
     * console.log(second)
     * ```
    */
    seconds(): Series;
    /**
     * Returns the minute of the day, in local time
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-05",
     * "2021-03-02",
     * "2020-04-01",
     * ]
     * const df = new Series(data)
     * const minute = df.dt.minute().values
     * console.log(minute)
     * ```
    */
    minutes(): Series;
    /**
     * Returns the Date as JavaScript standard Date object
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2019-01-01",
     * "2019-02-05",
     * "2021-03-02",
     * "2020-04-01",
     * ]
     *
     * const df = new Series(data)
     * const date = df.dt.toDate().values
     * console.log(date)
     * ```
    */
    date(): Series;
}
export declare const toDateTime: (data: Series | ArrayType1D) => TimeSeries;

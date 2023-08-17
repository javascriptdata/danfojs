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
import Utils from "../shared/utils"
import Series from "./series";

const WEEK_NAME = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const utils = new Utils();

/**
 * Format and handle all datetime operations on Series or Array of date strings
 * @param data Series or Array of date strings
 */
export default class TimeSeries implements DateTime {
    private $dateObjectArray: Array<Date>

    constructor(data: Series | ArrayType1D) {
        if (data instanceof Series) {
            this.$dateObjectArray = this.processData(data.values as ArrayType1D)
        } else {
            this.$dateObjectArray = this.processData(data)
        }
    }

    /**
     * Processed the data values into internal structure for easy access
     * @param dateArray An array of date strings
    */
    private processData(dateArray: ArrayType1D): Array<Date> {
        const values = dateArray.map(dateString => new Date(`${dateString}`))
        return values
    }

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
    month(): Series {
        const newValues = this.$dateObjectArray.map(date => date.getMonth())
        return new Series(newValues);
    }

    /**
     * Returns the week of the year
     * @example
     * ```
     * import { Series } from "danfojs-node"
     * const data = [
     * "2023-11-09", 
     * "2024-07-03", 
     * "2024-05-12", 
     * "2022-06-15", 
     * "2023-12-07", 
     * ]
     * const df = new Series(data)
     * const weekOfYear = df.dt.weekOfYear()
     * console.log(weekOfYear.values)
     * ```
     */
    weekOfYear() {
        const newValues = this.$dateObjectArray.map(utils.getWeekNumberFromDate);
        return new Series(newValues);
    }

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
    dayOfWeek() {
        const newValues = this.$dateObjectArray.map(date => date.getDay())
        return new Series(newValues);
    }

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
    year() {
        const newValues = this.$dateObjectArray.map(date => date.getFullYear())
        return new Series(newValues);
    }

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
    monthName() {
        const newValues = this.$dateObjectArray.map(date => MONTH_NAME[date.getMonth()])
        return new Series(newValues);
    }

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
    dayOfWeekName() {
        const newValues = this.$dateObjectArray.map(date => WEEK_NAME[date.getDay()])
        return new Series(newValues);
    }

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
    dayOfMonth() {
        const newValues = this.$dateObjectArray.map(date => date.getDate())
        return new Series(newValues);
    }

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
    hours() {
        const newValues = this.$dateObjectArray.map(date => date.getHours())
        return new Series(newValues);
    }

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
    seconds() {
        const newValues = this.$dateObjectArray.map(date => date.getSeconds())
        return new Series(newValues);
    }

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
    minutes() {
        const newValues = this.$dateObjectArray.map(date => date.getMinutes())
        return new Series(newValues);
    }

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
    date() {
        const newValues = this.$dateObjectArray.map(date => date.toLocaleString())
        return new Series(newValues);
    }

}

export const toDateTime = (data: Series | ArrayType1D) => {
    return new TimeSeries(data);
};

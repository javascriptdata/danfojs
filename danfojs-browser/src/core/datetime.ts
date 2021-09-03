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
import Series from "./series";
import { ArrayType1D, DateTime } from "@base/shared/types";

const MONTH_NAME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEK_NAME = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Format and handle all datetime operations on Series or Array of date strings
 * @param data Series or Array of date strings
 */
export default class TimeSeries implements DateTime{
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
     *  Returns the month, in local time
    */
    month(): Series {
        const newValues = this.$dateObjectArray.map(date => date.getMonth())
        return new Series(newValues);
    }

    /**
     * Returns the day of the week, in local time
    */
    day() {
        const newValues = this.$dateObjectArray.map(date => date.getDay())
        return new Series(newValues);
    }

    /**
     * Returns the year, in local time
    */
    year() {
        const newValues = this.$dateObjectArray.map(date => date.getFullYear())
        return new Series(newValues);
    }

    /**
     *  Returns the name of the month, in local time
    */
    monthName() {
        const newValues = this.$dateObjectArray.map(date => MONTH_NAME[date.getMonth()])
        return new Series(newValues);
    }

    /**
       * Returns the name of the day, of the week, in local time
    */
    dayOfWeekName() {
        const newValues = this.$dateObjectArray.map(date => WEEK_NAME[date.getDay()])
        return new Series(newValues);
    }

    /**
     * Returns the day of the month, in local time
    */
    dayOfMonth() {
        const newValues = this.$dateObjectArray.map(date => date.getDate())
        return new Series(newValues);
    }

    /**
     * Returns the hour of the day, in local time
    */
    hours() {
        const newValues = this.$dateObjectArray.map(date => date.getHours())
        return new Series(newValues);
    }

    /**
     * Returns the second of the day, in local time
    */
    seconds() {
        const newValues = this.$dateObjectArray.map(date => date.getSeconds())
        return new Series(newValues);
    }

    /**
     * Returns the minute of the day, in local time
    */
    minutes() {
        const newValues = this.$dateObjectArray.map(date => date.getMinutes())
        return new Series(newValues);
    }

}


export const toDateTime = (data: Series | ArrayType1D) => {
    return new TimeSeries(data);
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var utils_1 = __importDefault(require("../shared/utils"));
var utils = new utils_1.default();
var DateRange = /** @class */ (function () {
    function DateRange(_a) {
        var start = _a.start, end = _a.end, offset = _a.offset, freq = _a.freq, period = _a.period;
        this.start = start;
        this.end = end;
        this.offset = offset;
        this.freq = freq ? freq : "D";
        this.period = period;
        this.freqList = ["M", "D", "s", "H", "m", "Y"];
        if (this.freq.length == 1) {
            if (!this.freqList.includes(this.freq)) {
                throw new Error("invalid freq " + this.freq);
            }
        }
        else {
            this.offset = parseInt(this.freq.slice(0, -1));
            if (!Number.isFinite(this.offset)) {
                throw new Error("invalid freq offset " + this.freq.slice(0, -1));
            }
            this.freq = this.freq.slice(-1);
            if (!this.freqList.includes(this.freq)) {
                throw new Error("invalid freq " + this.freq);
            }
        }
    }
    DateRange.prototype.range = function () {
        var _this = this;
        var start = this.start;
        var period = this.period;
        var end = this.end;
        var offset = this.offset;
        var startDate;
        var endDate;
        var startRange;
        var endRange;
        if (start && end) {
            startDate = new Date(start);
            startRange = this.freqType(startDate, this.freq);
            endDate = new Date(end);
            endRange = this.freqType(endDate, this.freq);
            var startYear = startDate.getFullYear();
            var endYear = endDate.getFullYear();
            if ((startYear <= endYear) && (startDate.getMonth() !== endDate.getMonth())) {
                if (this.freq == "M") {
                    endRange = this.monthEnd(startDate, endDate);
                }
                else if (this.freq === "D") {
                    endRange = this.dayEnd(startDate, endDate) - startRange;
                }
            }
            var rangeArray_1 = utils.range(startRange, endRange);
            if (offset) {
                rangeArray_1 = this.offsetCount(rangeArray_1, offset);
            }
            var dateRange_1 = rangeArray_1.map(function (x) {
                return _this.setDateProps(startDate, _this.freq, x);
            });
            dateRange_1[dateRange_1.length - 1] = endDate;
            var dateString_1 = this.toLocalString(dateRange_1);
            return dateString_1;
        }
        else if (start && !(end)) {
            startDate = new Date(start);
            startRange = this.freqType(startDate, this.freq);
            period = period;
            endRange = offset ? ((period * offset) - 1) : period - 1;
            if (startRange > endRange) {
                endRange = endRange + startRange;
            }
            var rangeArray_2 = utils.range(startRange, endRange);
            if (offset) {
                rangeArray_2 = this.offsetCount(rangeArray_2, offset);
            }
            var dateRange_2 = rangeArray_2.map(function (x) {
                return _this.setDateProps(startDate, _this.freq, x);
            });
            var dateString_2 = this.toLocalString(dateRange_2);
            return dateString_2;
        }
        // if end and not start given
        endDate = new Date(end);
        endRange = this.freqType(endDate, this.freq);
        period = period;
        startRange = (endRange - period) + 1;
        var rangeArray = utils.range(startRange, endRange);
        if (offset) {
            rangeArray = this.offsetCount(rangeArray, offset);
        }
        var dateRange = rangeArray.map(function (x) {
            return _this.setDateProps(endDate, _this.freq, x);
        });
        var dateString = this.toLocalString(dateRange);
        return dateString;
    };
    /**
     * @param date Date
     * @param ftype string:  frequency type, month, Year, day etc
     * @param number
     */
    DateRange.prototype.freqType = function (date, ftype) {
        var rslt = 0;
        switch (ftype) {
            case "M":
                rslt = date.getMonth();
                break;
            case "Y":
                rslt = date.getFullYear();
                break;
            case "s":
                rslt = date.getSeconds();
                break;
            case "D":
                rslt = date.getDate();
                break;
            case "H":
                rslt = date.getHours();
                break;
            case "m":
                rslt = date.getMinutes();
                break;
        }
        return rslt;
    };
    DateRange.prototype.offsetCount = function (dArray, offset) {
        var rArray = [];
        for (var i = 0; i < dArray.length; i += offset) {
            rArray.push(dArray[i]);
        }
        return rArray;
    };
    DateRange.prototype.setDateProps = function (date, ftype, val) {
        var newDate = new Date(date.valueOf());
        switch (ftype) {
            case "M":
                if (Array.isArray(val)) {
                    newDate.setFullYear(newDate.getFullYear() + val[0]);
                    newDate.setMonth(val[1]);
                }
                else {
                    newDate.setMonth(val);
                }
                break;
            case "Y":
                newDate.setFullYear(val);
                break;
            case "s":
                newDate.setSeconds(val);
                break;
            case "D":
                newDate.setDate(val);
                break;
            case "H":
                newDate.setHours(val);
                break;
            case "m":
                newDate.setMinutes(val);
                break;
        }
        return newDate;
    };
    DateRange.prototype.toLocalString = function (dArray) {
        var r_array = dArray.map(function (x) {
            return x.toLocaleString();
        });
        return r_array;
    };
    DateRange.prototype.monthEnd = function (startDate, endDate) {
        var endMonth = endDate.getMonth();
        var diffYear = endDate.getFullYear() - startDate.getFullYear();
        var endRange = (12 * diffYear) + endMonth;
        return endRange;
    };
    DateRange.prototype.monthRange = function (range) {
        var minus;
        var yVal = 0;
        var dateRange = range.map(function (x) {
            if (x > 11) {
                if (x % 12 == 0) {
                    minus = x;
                    yVal = x / 12;
                    return [yVal, (x - minus)];
                }
                else {
                    return [yVal, (x - minus)];
                }
            }
            return [yVal, x];
        });
        return dateRange;
    };
    DateRange.prototype.dayEnd = function (startDate, endDate) {
        var monthEnd = this.monthEnd(startDate, endDate);
        var range = utils.range(startDate.getMonth(), monthEnd);
        var mRange = this.monthRange(range);
        var sum = 0;
        for (var i = 0; i < mRange.length; i++) {
            var val = mRange[i];
            var dDate = void 0;
            if (i === mRange.length - 1) {
                dDate = new Date(startDate.getUTCFullYear() + val[0], val[1], endDate.getDate()).getDate();
            }
            else {
                dDate = new Date(startDate.getUTCFullYear() + val[0], val[1], 0).getDate();
            }
            sum += dDate;
        }
        return sum;
    };
    return DateRange;
}());
/**
 * Generate sequence of Dates
 * @param start : signify the date to start with
 * @param end : signify the date to end with
 * @param period :  the total number of date to generate
 * @param offset : set the date range offset
 * @param freq: set the date range frequency and offset
 * @return string[]
 */
function dateRange(param) {
    var dateRange = new DateRange(param);
    return dateRange.range();
}
exports.default = dateRange;

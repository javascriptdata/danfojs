"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateTime = void 0;
var series_1 = __importDefault(require("./series"));
var WEEK_NAME = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MONTH_NAME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/**
 * Format and handle all datetime operations on Series or Array of date strings
 * @param data Series or Array of date strings
 */
var TimeSeries = /** @class */ (function () {
    function TimeSeries(data) {
        if (data instanceof series_1.default) {
            this.$dateObjectArray = this.processData(data.values);
        }
        else {
            this.$dateObjectArray = this.processData(data);
        }
    }
    /**
     * Processed the data values into internal structure for easy access
     * @param dateArray An array of date strings
    */
    TimeSeries.prototype.processData = function (dateArray) {
        var values = dateArray.map(function (dateString) { return new Date("" + dateString); });
        return values;
    };
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
    TimeSeries.prototype.month = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getMonth(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.dayOfWeek = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getDay(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.year = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getFullYear(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.monthName = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return MONTH_NAME[date.getMonth()]; });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.dayOfWeekName = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return WEEK_NAME[date.getDay()]; });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.dayOfMonth = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getDate(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.hours = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getHours(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.seconds = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getSeconds(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.minutes = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.getMinutes(); });
        return new series_1.default(newValues);
    };
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
    TimeSeries.prototype.date = function () {
        var newValues = this.$dateObjectArray.map(function (date) { return date.toLocaleString(); });
        return new series_1.default(newValues);
    };
    return TimeSeries;
}());
exports.default = TimeSeries;
var toDateTime = function (data) {
    return new TimeSeries(data);
};
exports.toDateTime = toDateTime;

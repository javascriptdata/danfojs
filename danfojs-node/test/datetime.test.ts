import { assert } from "chai";
import { Series } from "../build";
import { toDateTime } from '../build/core/datetime';

describe("TimeSeries", function () {

    it("Returns correct month number", function () {
        const data = ["02Sep2019", "03Aug2019", "04July2019"];
        const dateTime = toDateTime(data);
        const expected = [8, 7, 6];
        assert.deepEqual(dateTime.month().values, expected);
    });

    it("Returns correct year number", function () {
        const data = ["02Sep2019", "03Aug2029", "04July2020"];
        const dateTime = toDateTime(data);
        const expected = [2019, 2029, 2020];
        assert.deepEqual(dateTime.year().values, expected);
    });

    it("Return month name generated", function () {
        const data = ["06-30-02019", "07-29-2019", "08-28-2019"];
        const dateTime = toDateTime(data);
        const expected = ["June", "July", "August"];
        assert.deepEqual(dateTime.monthName().values, expected);
    });

    it("Return day of the week generated", function () {
        const data = ["06-30-02019", "07-29-2019", "08-28-2019"];
        const dateTime = toDateTime(data);
        const expected = ["Sunday", "Monday", "Wednesday"];
        assert.deepEqual(dateTime.dayOfWeekName().values, expected);
    });

    it("Return day of the month generated", function () {
        const data = ["06-30-02019", "07-29-2019", "08-28-2019"];
        const dateTime = toDateTime(data);
        const expected = [30, 29, 28];
        assert.deepEqual(dateTime.dayOfMonth().values, expected);
    });

    it("Return seconds generated", function () {
        const data = ["06-30-02019 00:00:12", "07-29-2019 00:30:40", "08-28-2019 00:12:04"];
        const dateTime = toDateTime(data);
        const expected = [12, 40, 4];
        assert.deepEqual(dateTime.seconds().values, expected);
    });

    it("Return minutes generated", function () {
        const data = ["06-30-02019 00:00:12", "07-29-2019 00:30:40", "08-28-2019 00:12:04"];
        const dateTime = toDateTime(data);
        const expected = [0, 30, 12];
        assert.deepEqual(dateTime.minutes().values, expected);
    });

    it("Return hours generated", function () {
        const data = ["06-30-02019 05:00:12", "07-29-2019 01:30:40", "08-28-2019 06:12:04"];
        const dateTime = toDateTime(data);
        const expected = [5, 1, 6];
        assert.deepEqual(dateTime.hours().values, expected);
    });

    it("Return correct date from Series format 1", function () {
        const data = new Series(["12/30/19 00:01", "12/29/19 07:03", "11/12/20 18:21"]);
        const dateTime = toDateTime(data);

        const expectedMonth = [11, 11, 10];
        const expectedYear = [2019, 2019, 2020];
        const expectedDayOfMonth = [30, 29, 12];
        const expectedMonthName = ["December", "December", "November"];

        assert.deepEqual(dateTime.month().values, expectedMonth);
        assert.deepEqual(dateTime.year().values, expectedYear);
        assert.deepEqual(dateTime.dayOfMonth().values, expectedDayOfMonth);
        assert.deepEqual(dateTime.monthName().values, expectedMonthName);
    });

    it("Return correct date from Series format 2", function () {
        const data = new Series(["12.30.19", "12.22.19", "11.01.20"]);
        const dateTime = toDateTime(data);

        const expectedMonth = [11, 11, 10];
        const expectedYear = [2019, 2019, 2020];
        const expectedDay = [1, 0, 0];
        const expectedMonthName = ["December", "December", "November"];

        assert.deepEqual(dateTime.month().values, expectedMonth);
        assert.deepEqual(dateTime.year().values, expectedYear);
        assert.deepEqual(dateTime.day().values, expectedDay);
        assert.deepEqual(dateTime.monthName().values, expectedMonthName);

    });
});

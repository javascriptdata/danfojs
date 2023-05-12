/* eslint-disable no-undef */

describe("TimeSeries", function () {

  it("Returns correct month number", function () {
    const data = [ "02Sep2019", "03Aug2019", "04July2019" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ 8, 7, 6 ];
    assert.deepEqual(dateTime.month().values, expected);
  });

  it("Returns correct year number", function () {
    const data = [ "02Sep2019", "03Aug2029", "04July2020" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ 2019, 2029, 2020 ];
    assert.deepEqual(dateTime.year().values, expected);
  });

  it("Return month name generated", function () {
    const data = [ "06-30-02019", "07-29-2019", "08-28-2019" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ "June", "July", "August" ];
    assert.deepEqual(dateTime.monthName().values, expected);
  });

  it("Return week of the year generated", function () {
    const data = ["12-31-02022", "01-03-2022", "02-28-2019", "2024-05-12", "2022-06-15", "2023-12-07"];
    const dateTime = toDateTime(data);
    const expected = [52, 1, 9, 19, 24, 49];
    dateTime.weekOfYear().values.forEach((value, index) => assert.closeTo(Number(value), expected[index], 1));
  })

  it("Return day of the week generated", function () {
    const data = [ "06-30-02019", "07-29-2019", "08-28-2019" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ "Sunday", "Monday", "Wednesday" ];
    assert.deepEqual(dateTime.dayOfWeekName().values, expected);
  });

  it("Return day of the month generated", function () {
    const data = [ "06-30-02019", "07-29-2019", "08-28-2019" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ 30, 29, 28 ];
    assert.deepEqual(dateTime.dayOfMonth().values, expected);
  });

  it("Return seconds generated", function () {
    const data = [ "06-30-02019 00:00:12", "07-29-2019 00:30:40", "08-28-2019 00:12:04" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ 12, 40, 4 ];
    assert.deepEqual(dateTime.seconds().values, expected);
  });

  it("Return minutes generated", function () {
    const data = [ "06-30-02019 00:00:12", "07-29-2019 00:30:40", "08-28-2019 00:12:04" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ 0, 30, 12 ];
    assert.deepEqual(dateTime.minutes().values, expected);
  });

  it("Return hours generated", function () {
    const data = [ "06-30-02019 05:00:12", "07-29-2019 01:30:40", "08-28-2019 06:12:04" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [ 5, 1, 6 ];
    assert.deepEqual(dateTime.hours().values, expected);
  });

  it("Return correct date from Series format 1", function () {
    const data = new dfd.Series([ "12/30/19 00:01", "12/29/19 07:03", "11/12/20 18:21" ]);
    const dateTime = dfd.toDateTime(data);

    const expectedMonth = [ 11, 11, 10 ];
    const expectedYear = [ 2019, 2019, 2020 ];
    const expectedDayOfMonth = [ 30, 29, 12 ];
    const expectedMonthName = [ "December", "December", "November" ];

    assert.deepEqual(dateTime.month().values, expectedMonth);
    assert.deepEqual(dateTime.year().values, expectedYear);
    assert.deepEqual(dateTime.dayOfMonth().values, expectedDayOfMonth);
    assert.deepEqual(dateTime.monthName().values, expectedMonthName);
  });

  it("Return correct date from Series format 2", function () {
    const data = new dfd.Series([ "12.30.19", "12.22.19", "11.01.20" ]);
    const dateTime = dfd.toDateTime(data);

    const expectedMonth = [ 11, 11, 10 ];
    const expectedYear = [ 2019, 2019, 2020 ];
    const expectedDay = [ 1, 0, 0 ];
    const expectedMonthName = [ "December", "December", "November" ];

    assert.deepEqual(dateTime.month().values, expectedMonth);
    assert.deepEqual(dateTime.year().values, expectedYear);
    assert.deepEqual(dateTime.dayOfWeek().values, expectedDay);
    assert.deepEqual(dateTime.monthName().values, expectedMonthName);

  });

  it("Returns date string in standard JS format", function () {
    const data = [ "02Sep2019", "03Aug2019", "04July2019" ];
    const dateTime = dfd.toDateTime(data);
    const expected = [
      '9/2/2019, 12:00:00 AM',
      '8/3/2019, 12:00:00 AM',
      '7/4/2019, 12:00:00 AM'
    ];

    const data2 = new dfd.Series([ "12.30.19", "12.22.19", "11.01.20" ]);
    const dateTime2 = dfd.toDateTime(data2);
    const expected2 = [
      '12/30/2019, 12:00:00 AM',
      '12/22/2019, 12:00:00 AM',
      '11/1/2020, 12:00:00 AM'
    ];
    assert.deepEqual(dateTime.date().values, expected);
    assert.deepEqual(dateTime2.date().values, expected2);
  });
});

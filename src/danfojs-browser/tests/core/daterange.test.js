/* eslint-disable no-undef */

describe("dfd.dateRange", function(){

  // it("Obtain date between start and end specified", function(){
  //   let d = dfd.dateRange({start:'2018-04-24',end:'2018-04-27'})
  //   let rslt = [
  //     '4/24/2018, 1:00:00 AM',
  //     '4/25/2018, 1:00:00 AM',
  //     '4/26/2018, 1:00:00 AM',
  //     '4/27/2018, 1:00:00 AM'
  //   ]
  //   assert.deepEqual(d,rslt)
  // });
  it("Obtain date between start with end not specified, but period and freq specified", function(){
    let d = dfd.dateRange({ start:'1/1/2018', period:5, freq:'M' });
    let rslt = [
      '1/1/2018, 12:00:00 AM',
      '2/1/2018, 12:00:00 AM',
      '3/1/2018, 12:00:00 AM',
      '4/1/2018, 12:00:00 AM',
      '5/1/2018, 12:00:00 AM'
    ];
    assert.deepEqual(d, rslt);
  });
  it("Obtain date between start with end not specified, but period and freq specified, plus offset", function(){
    let d = dfd.dateRange({ start:'1/1/2018', period:5, freq:'3M' });
    let rslt = [
      '1/1/2018, 12:00:00 AM',
      '4/1/2018, 12:00:00 AM',
      '7/1/2018, 12:00:00 AM',
      '10/1/2018, 12:00:00 AM',
      '1/1/2019, 12:00:00 AM'
    ];
    assert.deepEqual(d, rslt);
  });
  it("Obtain date between start with end not specified, but period and freq specified, plus offset, longer freq", function(){
    let d = dfd.dateRange({ start:'1/1/2018', period:5, freq:'35m' });
    let rslt = [
      "1/1/2018, 12:00:00 AM",
      "1/1/2018, 12:35:00 AM",
      "1/1/2018, 1:10:00 AM",
      "1/1/2018, 1:45:00 AM",
      "1/1/2018, 2:20:00 AM"
    ];
    assert.deepEqual(d, rslt);
  });
  it("Obtain date range with start not specified but end and period is given", function(){
    let d = dfd.dateRange({ end:'1/1/2018', period:8 });
    let rslt = [
      '12/25/2017, 12:00:00 AM',
      '12/26/2017, 12:00:00 AM',
      '12/27/2017, 12:00:00 AM',
      '12/28/2017, 12:00:00 AM',
      '12/29/2017, 12:00:00 AM',
      '12/30/2017, 12:00:00 AM',
      '12/31/2017, 12:00:00 AM',
      '1/1/2018, 12:00:00 AM'
    ];
    assert.deepEqual(d, rslt);
  });
  it("inputing wrong freq", function(){
    assert.throws(function () { dfd.dateRange({ end:'1/1/2018', period:8, freq:"d" }); }, Error, 'invalid freq d');
  });
  it("inputing wrong freq with offset", function(){
    assert.throws(function () { dfd.dateRange({ end:'1/1/2018', period:8, freq:"4d" }); }, Error, 'invalid freq d');
  });
  it("inputing wrong freq offset", function(){
    assert.throws(function () { dfd.dateRange({ end:'1/1/2018', period:8, freq:"abcm" }); }, Error, 'invalid freq offset abc');
  });
  // it("Obtain date between start and end specified with different month", function(){

  //   let d = dfd.dateRange({start:'2018-04-24',end:'2018-05-27'})
  //   let rslt = [
  //     '4/24/2018, 1:00:00 AM',
  //     '4/25/2018, 1:00:00 AM',
  //     '4/26/2018, 1:00:00 AM',
  //     '4/27/2018, 1:00:00 AM',
  //     '4/28/2018, 1:00:00 AM',
  //     '4/29/2018, 1:00:00 AM',
  //     '4/30/2018, 1:00:00 AM',
  //     '5/1/2018, 1:00:00 AM',
  //     '5/2/2018, 1:00:00 AM',
  //     '5/3/2018, 1:00:00 AM',
  //     '5/27/2018, 1:00:00 AM'
  //   ]
  //   assert.deepEqual(d,rslt)
  // });
});

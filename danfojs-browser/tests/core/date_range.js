
describe("date_range", function(){

  it("Obtain date between start with end not specified, but period and freq specified", function(){


    let d = new dfd.date_range({ "start":'1/1/2018', period:5, freq:'M' });
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

    let d = new dfd.date_range({ start:'1/1/2018', period:5, freq:'3M' });
    let rslt = [
      '1/1/2018, 12:00:00 AM',
      '4/1/2018, 12:00:00 AM',
      '7/1/2018, 12:00:00 AM',
      '10/1/2018, 12:00:00 AM',
      '1/1/2019, 12:00:00 AM'
    ];

    assert.deepEqual(d, rslt);


  });
  it("Obtain date range with start not specified but end and period is given", function(){

    let d = new dfd.date_range({ end:'1/1/2018', period:8 });
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
    assert.throws(function () { new dfd.date_range({ end:'1/1/2018', period:8, freq:"d" }); }, Error, 'invalid freq d');
  });
  it("inputing wrong freq with offset", function(){
    assert.throws(function () { new dfd.date_range({ end:'1/1/2018', period:8, freq:"4d" }); }, Error, 'invalid freq d');
  });
});

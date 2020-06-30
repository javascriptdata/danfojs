import { assert } from "chai"
import {TimeSeries} from '../../src/core/timeseries'

describe("TimeSeries",function(){

    it("Check date formatting",function(){

        let data = ["02Sep2019"]
        let data2= ["90"]

        let times = new TimeSeries({"data":data2,"format":"%d-m-Y%"})

        // console.log(new Date("02-09-2019"),"here")

        console.log(times.preprocessed())
    });
});
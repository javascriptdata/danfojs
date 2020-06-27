import { assert } from "chai"
import {TimeSeries} from '../../src/core/timeseries'

describe("TimeSeries",function(){

    it("Check date formatting",function(){

        let data = ["02092019-093000"]
        let times = new TimeSeries({"data":data,"format":"%d%m%Y-%H%M%S"})

        console.log(times.preprocessed())
    });
});
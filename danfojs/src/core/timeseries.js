import { Utils } from "./utils"
const utils = new Utils
/**
 * @class
 * @description Handle all datetime operations
 * @param {kwargs} Object {"data":[array of string], "format": string}
 */
class TimeSeries {
    constructor(kwargs){
        
        utils.__in_object(kwargs,"data","specify the data")

        this.kwargs = kwargs["data"]

        if(utils.__key_in_object(kwargs,"format")){
            this.format = kwargs["format"];
        }else{
            this.format = null;
        }
    }

    /**
     * @description preprocessed the data into desirable  structure
     */
    __preprocessed_time(){}

    /**
     * @description if format is given, apply the format on each element of the data
     * @return string
     */
    __apply_format(){}

    /**
     * @description obtain the month in a date.
     * @return Series
     */
    month(){}

    /**
     * @return Series 
     */
    hour(){}

    /**
     * @return Series
     */
    day(){}




}
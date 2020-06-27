import { Utils } from "./utils"
import {Series} from "./series"
const utils = new Utils
/**
 * @class
 * @description Handle all datetime operations
 * @param {kwargs} Object {"data":[array of string], "format": string}
 */
export class TimeSeries {
    constructor(kwargs){
        
        utils.__in_object(kwargs,"data","specify the data")

        if( kwargs["data"] instanceof Series){
            this.data = kwargs["data"].values
        }else{
            this.data = kwargs["data"]
        }

        this.format = kwargs["format"] || null;

        this.keys = {//key: len
            "Y": 4,
            "m": 2,
            "H": 2,
            "M": 2,
            "S": 2,
            "b": 3,
            "d": 2,
            "-": 1,
        }
        
    }

    /**
     * @description preprocessed the data into desirable  structure
     */
    preprocessed(){

        let format = this.generate_format()
        console.log(format)
        return this.__apply_format(this.data[0],format);
    }

    /**
     * @description if format is given, apply the format on each element of the data
     * @return string
     */
    __apply_format(elem,format){

        let date_string = ""

        let temp_val = 0;

        
        for(let index in format){

            let value = format[index];

            if(index == 0){ 
                date_string +=  elem.slice(0,value)

            }
            else if(index > 4){

                date_string += ":"+ elem.slice(temp_val,temp_val+value)
            }
            else if(index == 4){
                date_string += " "+ elem.slice(temp_val,temp_val+value)
            }
            else if(index > 0 && index <=2){
                date_string += "-"+ elem.slice(temp_val,temp_val+value)
            }

            temp_val += value
        }

        return date_string

    }

    generate_format(){

        let format_list = this.format.split("")
        
        let self = this;
        let format_keys = format_list.filter(function(key){
            return utils.__key_in_object(self.keys, key)
        });

        let format_value = format_keys.map(function(val){
            return self.keys[val]
        })


        return format_value
    }

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
import {Utils} from "./utils"

const utils = new Utils

/**
 * Generate date range between a specified set of date
 * @param {kwargs}  kwargs {
 *          start : string
 *          end  : string
 *          period: int
 *          freq : string
 * }
 * @returns Array
 */
export class date_range {
    constructor(kwargs){

        this.offset = null;

        if(utils.__key_in_object(kwargs,"start")){
            this.start = kwargs["start"];
        }else{
            this.start = null
        }

        if(utils.__key_in_object(kwargs,"end")){
            this.end = kwargs["end"];
        }else{
            this.end = null;
        }

        if(utils.__key_in_object(kwargs,"period")){
            this.period = kwargs["period"]
        }else{
            this.period = null
        }

        if(utils.__key_in_object(kwargs,"freq")){
            this.freq = kwargs["freq"]
        }else{
            this.freq = "D"
        }

        this.freq_list = ["M","D","s","H","m","Y"]
        
        if(this.freq.length == 1){
            if(!this.freq_list.includes(this.freq)){
                throw new Error(`invalid freq ${this.freq}`)
            }
        }else{
            let freq_split = this.freq.split("")
            this.offset = parseInt(freq_split[0])
            this.freq = freq_split[1]
            if(!this.freq_list.includes(this.freq)){
                throw new Error(`invalid freq ${this.freq}`)
            }
        }

        let rslt = this.range(this.start, this.end,this.period,this.offset)
        return rslt;

    }

    range(start, end,period, offset=null){

        let start_date = null
        let end_date = null;
        let start_range = null;
        let end_range = null
        if(start && end){
            start_date = new Date(start)
            start_range = this.freq_type(start_date,this.freq)
            end_date = new Date(end)
            end_range = this.freq_type(end_date, this.freq)

            let range_array = utils.__range(start_range, end_range)

            if(offset){
                range_array = this.offset_count(range_array, offset);
            }

            let date_range = range_array.map((x)=>{
                return this.set_dateProps(start_date,this.freq,x)
            });

            let date_string = this.toLocalString(date_range)
            return date_string
        }
        else if(start && !(end)){
            start_date = new Date(start)
            start_range = this.freq_type(start_date, this.freq)
            end_range = offset ?  ((period* offset)-1) : period -1

            let range_array = utils.__range(start_range, end_range)


            if(offset){
                range_array = this.offset_count(range_array, offset);
            }

            let date_range = range_array.map((x)=>{
                return this.set_dateProps(start_date,this.freq,x)
            });

            let date_string = this.toLocalString(date_range)
            return date_string

        }
        else if(end && !(start)){
            end_date = new Date(end)
            end_range = this.freq_type(end_date, this.freq)
            start_range  = (end_range - period) + 1

            let range_array = utils.__range(start_range, end_range)

            if(offset){
                range_array = this.offset_count(range_array, offset);
            }

            let date_range = range_array.map((x)=>{
                return this.set_dateProps(end_date,this.freq,x)
            });

            let date_string = this.toLocalString(date_range)
            return date_string
        }
    }
    
    freq_type(date, ftype){

        switch(ftype){

            case "M":
                return date.getMonth()
            break;
            case "Y":
                return date.getFullYear()
            break;
            case "s":
                return date.getSeconds()
            break;
            case "D":
                return date.getDate()
            break;
            case "H":
                return date.getHours()
            break;
            case "m":
                return date.getMinutes()
            break
        }
    }

    offset_count(d_array, offset){

        let r_array = []

        for(let i=0; i < d_array.length; i+=offset){
            r_array.push(d_array[i]);
        }
        return r_array;
    }

    set_dateProps(date, ftype, val){

        let new_date = new Date(date.valueOf())
        switch(ftype){

            case "M":
                new_date.setMonth(val)
            break;
            case "Y":
                new_date.setYear(val)
            break;
            case "s":
                new_date.setSeconds(val)
            break;
            case "D":
                new_date.setDate(val)
            break;
            case "H":
                new_date.setHours(val)
            break;
            case "m":
                new_date.setMinutes(val)
            break
        }
        return new_date
    }

    toLocalString(d_array){

        let r_array = d_array.map((x)=>{

            return x.toLocaleString()
        });

        return r_array
    }
}
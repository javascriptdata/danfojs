import { ArrayType1D, ArrayType2D } from "../shared/types"
import Utils from "../shared/utils";

const utils = new Utils();

interface Params  {
  start?: string;
  offset?: number;
  end?: string;
  freq?: string;
  period?: number
}
export default class DateRange {
  private offset: number | undefined = null
  private start: string | undefined
  private end: string | undefined
  private freq: string | undefined
  private period: number | undefined
  private freqList: string[]

  constructor(params: Params) {
    this.start = params.start
    this.end = params.end
    this.offset = params.offset
    this.freq = params.freq
    this.period = params.period
    this.freqList  = [ "M", "D", "s", "H", "m", "Y" ]

    if (this.freq.length == 1){
      if (!this.freqList.includes(this.freq)){
        throw new Error(`invalid freq ${this.freq}`);
      }
    } else {
      this.offset = parseInt(this.freq.slice(0, -1));
      if (!Number.isFinite(this.offset)){
        throw new Error(`invalid freq offset ${this.freq.slice(0, -1)}`);
      }
      this.freq = this.freq.slice(-1);
      if (!this.freqList.includes(this.freq)){
        throw new Error(`invalid freq ${this.freq}`);
      }
    }


  }

  range({start, end, period, offset}: Params) {
    let startDate: Date
    let endDate: Date
    let startRange: number
    let endRange: number
    if (start && end) {
      startDate = new Date(start)
      startRange = this.freqType(startDate, this.freq)
      endDate = new Date(end)
      endRange = this.freqType(endDate, this.freq)

      let startYear = startDate.getFullYear()
      let endYear = endDate.getFullYear()
      if ((startYear <= endYear) && (startDate.getMonth() !== endDate.getMonth())){
        if (this.freq == "M") {
          endRange = this.monthEnd(startDate, endDate)
        }
        else if (this.freq === "D") {
          endRange = this.dayEnd(startDate, endDate) - startRange
        }
      }
      let rangeArray = utils.range(startRange, endRange)
      if ( offset ) {
        rangeArray =  this.offsetCount(rangeArray, offset)
      }
      let dateRange = rangeArray.map((x) => {
        return this.setDateProps(startDate, this.freq, x)
      })
      dateRange[dateRange.length -1] = endDate
      let dateString = this.toLocalString(dateRange)
      return dateString
    }
    else if ( start && !(end) ) {
      startDate = new Date(start)
      startRange = this.freqType(startDate, this.freq)
      endRange = offset ? ((period * offset) - 1) : period -1;

      if ( startRange > endRange ) {
        endRange = endRange + startRange
      }
      let rangeArray = utils.range(startRange, endRange)

      if ( offset ) {
        rangeArray = this.offsetCount(rangeArray, offset)
      }
      let dateRange = rangeArray.map((x) => {
        return this.setDateProps(startDate, this.freq, x)
      })

      let dateString = this.toLocalString(dateRange)
      return dateString
    }
    else if (end && !(start)) {
      endDate = new Date(end)
      endRange = this.freqType(endDate, this.freq)
      startRange = (endRange - period) + 1
      let rangeArray = utils.range(startRange, endRange)

      if ( offset ) {
        rangeArray = this.offsetCount(rangeArray, offset)
      }
      let dateRange = rangeArray.map((x) => {
        return this.setDateProps(endDate, this.freq, x)
      })
      let dateString = this.toLocalString(dateRange)
      return dateString
    }
  }

  private freqType(date: Date, ftype: string): number{
    let rslt: number = null;
    switch (ftype){

    case "M":
      rslt = date.getMonth();
      break;
    case "Y":
      rslt = date.getFullYear();
      break;
    case "s":
      rslt = date.getSeconds();
      break;
    case "D":
      rslt = date.getDate();
      break;
    case "H":
      rslt = date.getHours();
      break;
    case "m":
      rslt = date.getMinutes();
      break;
    }
    return rslt;
  }


  private offsetCount(dArray: number[], offset: number) :number[] {
    let rArray: number[] = []
    for (let i = 0; i < dArray.length; i += offset){
      rArray.push(dArray[i]);
    }
    return rArray;
  }

  private setDateProps(date: Date, ftype: string, val: number[] | number): Date {
    let newDate = new Date(date.valueOf())
    switch (ftype){
      case "M":
        if (Array.isArray(val)){
  
          newDate.setYear(newDate.getFullYear() + val[0]);
          newDate.setMonth(val[1]);
        } else {
          newDate.setMonth(val);
        }
        break;
      case "Y":
        newDate.setYear(val as number);
        break;
      case "s":
        newDate.setSeconds(val as number);
        break;
      case "D":
        newDate.setDate(val as number);
        break;
      case "H":
        newDate.setHours(val as number);
        break;
      case "m":
        newDate.setMinutes(val as number);
        break;
      }
      return newDate;
  }


  private toLocalString(dArray: Date[]) {
    let r_array = dArray.map((x) => {
      return x.toLocaleString();
    });
    return r_array;
  }

  private monthEnd(startDate: Date, endDate: Date) {
    let endMonth = endDate.getMonth()
    let diffYear = endDate.getFullYear() - startDate.getFullYear()
    let endRange = (12 * diffYear) + endMonth
    return endRange
  }

  private monthRange(range: number[]): number[][] {
    let minus: number;
    let yVal = 0
    let dateRange: number[][] = range.map((x) => {
      if (x > 11) {
        if ( x % 12 == 0) {
          minus = x
          yVal = x / 12
          return [yVal, (x - minus)]
        }
        else {
          return [yVal, (x -minus)]
        }
      }
      return [yVal, x]
    })
    return dateRange
  }

  private dayEnd(startDate: Date, endDate: Date): number{
    let monthEnd = this.monthEnd(startDate, endDate)
    let range = utils.range(startDate.getMonth(), monthEnd)
    let mRange = this.monthRange(range)

    let sum = 0
    for (let i=0; i < mRange.length; i++) {
      let val = mRange[i]
      let dDate: number
      if (i === mRange.length - 1) {
        dDate = new Date(startDate.getUTCFullYear() + val[0], val[1], endDate.getDate()).getDate()
      }
      else {
        dDate = new Date(startDate.getUTCFullYear() + val[0], val[1], 0).getDate()
      }
      sum += dDate
    }
    return sum
  }
}
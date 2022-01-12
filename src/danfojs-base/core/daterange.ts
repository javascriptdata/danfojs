/**
*  @license
* Copyright 2022 JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/
import Utils from "../shared/utils";

const utils = new Utils();

interface Params  {
  start?: string;
  offset?: number;
  end?: string;
  freq?: string;
  period?: number
}
class DateRange {
  private offset?: number
  private start?: string
  private end?: string
  private freq: string
  private period?: number
  private freqList: string[]

  constructor({start, end, offset, freq, period}: Params){
    this.start = start
    this.end = end
    this.offset = offset
    this.freq = freq ? freq : "D"
    this.period = period
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

  range(): string[] {
    let start = this.start
    let period = this.period
    let end = this.end
    let offset = this.offset
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
      period = period as number
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
    // if end and not start given
    endDate = new Date(end as string)
    endRange = this.freqType(endDate, this.freq)
    period = period as number
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

  /**
   * @param date Date
   * @param ftype string:  frequency type, month, Year, day etc
   * @param number
   */
  private freqType(date: Date, ftype: string): number{
    let rslt: number = 0;
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
  
          newDate.setFullYear(newDate.getFullYear() + val[0]);
          newDate.setMonth(val[1]);
        } else {
          newDate.setMonth(val);
        }
        break;
      case "Y":
        newDate.setFullYear(val as number);
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

/**
 * Generate sequence of Dates 
 * @param start : signify the date to start with
 * @param end : signify the date to end with
 * @param period :  the total number of date to generate
 * @param offset : set the date range offset
 * @param freq: set the date range frequency and offset
 * @return string[]
 */
export default function dateRange(param: Params): string[] {
  const dateRange = new DateRange(param)
  return dateRange.range()
}
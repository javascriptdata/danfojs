/**
 * @class
 * @description Handle all datetime operations
 * @param {kwargs} Object {"data":[array of string], "format": string}
 */
export class TimeSeries {
   constructor(kwargs?: any);
   data?: any;
   format?: any;
   keys: {
      Y: number;
      m: number;
      H: number;
      M: number;
      S: number;
      b: number;
      d: number;
      "-": number;
   };
   __in_format: string[];
   __monthName: string[];
   __weekName: string[];
   /**
      * @description preprocessed the data into desirable  structure
      */
   preprocessed(): void;
   date_list?: any[];
   /**
      * @description if format is given, apply the format on each element of the data
      * @return string
      */
   __apply_format(elem?: any, format?: any): string;
   /**
      * @description convert format string to their respective value.
      */
   generate_format(): any;
   /**
      * @description check if a string is a timestamp
      * @param {date_string} date_string [string]
      */
   is_timestamp(date_string?: any): boolean;
   /**
      * @description check if a date instance returns Invalid date
      * @param {date_instance} instance of new Date()
      */
   __is_validDate(date_instance?: any): void;
   /**
      * @description abstract all date operations
      * @param {*} callback [FUNCTION]
      * @return series
      */
   __date_ops(callback?: any): Series;
   /**
      * @description obtain the month in a date.
      * @return Series
      */
   month(): Series;
   /**
      * @return Series
      */
   hour(): Series;
   /**
      * @return Series
      */
   day(): Series;
   /**
      * @description generate year frome date instance
      * @return Series
      */
   year(): Series;
   /**
      * @description generate month name
      * @return Series
      */
   month_name(): Series;
   /**
      * @description generate days of the week
      * @return Series
      */
   weekdays(): Series;
   /**
      * @description day of the month
      * @return Series
      */
   monthday(): Series;
   /**
      * @description obtain the seconds in a date
      * @return Series
      */
   seconds(): Series;
   /**
      * @description obtain the minutes in a date
      * @return Series
      */
   minutes(): Series;
}
export function to_datetime(kwargs?: any): TimeSeries;
import { Series } from "./series";

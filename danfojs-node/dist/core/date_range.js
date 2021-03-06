"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.date_range = void 0;

var _utils = require("./utils");

const utils = new _utils.Utils();

class date_range {
  constructor(kwargs) {
    this.offset = null;

    if (utils.__key_in_object(kwargs, "start")) {
      this.start = kwargs["start"];
    } else {
      this.start = null;
    }

    if (utils.__key_in_object(kwargs, "end")) {
      this.end = kwargs["end"];
    } else {
      this.end = null;
    }

    if (utils.__key_in_object(kwargs, "period")) {
      this.period = kwargs["period"];
    } else {
      this.period = null;
    }

    if (utils.__key_in_object(kwargs, "freq")) {
      this.freq = kwargs["freq"];
    } else {
      this.freq = "D";
    }

    this.freq_list = ["M", "D", "s", "H", "m", "Y"];

    if (this.freq.length == 1) {
      if (!this.freq_list.includes(this.freq)) {
        throw new Error(`invalid freq ${this.freq}`);
      }
    } else {
      let freq_split = this.freq.split("");
      this.offset = parseInt(freq_split[0]);
      this.freq = freq_split[1];

      if (!this.freq_list.includes(this.freq)) {
        throw new Error(`invalid freq ${this.freq}`);
      }
    }

    let rslt = this.range(this.start, this.end, this.period, this.offset);
    return rslt;
  }

  range(start, end, period, offset = null) {
    let start_date = null;
    let end_date = null;
    let start_range = null;
    let end_range = null;

    if (start && end) {
      start_date = new Date(start);
      start_range = this.freq_type(start_date, this.freq);
      end_date = new Date(end);
      end_range = this.freq_type(end_date, this.freq);
      let start_year = start_date.getFullYear();
      let end_year = end_date.getFullYear();

      if (start_year < end_year) {
        if (this.freq == "M") {
          end_range = this.month_end(start_date, end_date);
        } else if (this.freq == "D") {
          end_range = this.day_end(start_date, end_date) - start_range;
        }
      }

      let range_array = utils.__range(start_range, end_range);

      if (offset) {
        range_array = this.offset_count(range_array, offset);
      }

      if (this.freq == "M") {
        range_array = this.month_range(range_array);
      }

      let date_range = range_array.map(x => {
        return this.set_dateProps(start_date, this.freq, x);
      });
      date_range[date_range.length - 1] = end_date;
      let date_string = this.toLocalString(date_range);
      return date_string;
    } else if (start && !end) {
      start_date = new Date(start);
      start_range = this.freq_type(start_date, this.freq);
      end_range = offset ? period * offset - 1 : period - 1;

      if (start_range > end_range) {
        end_range = end_range + start_range;
      }

      let range_array = utils.__range(start_range, end_range);

      if (offset) {
        range_array = this.offset_count(range_array, offset);
      }

      let date_range = range_array.map(x => {
        return this.set_dateProps(start_date, this.freq, x);
      });
      let date_string = this.toLocalString(date_range);
      return date_string;
    } else if (end && !start) {
      end_date = new Date(end);
      end_range = this.freq_type(end_date, this.freq);
      start_range = end_range - period + 1;

      let range_array = utils.__range(start_range, end_range);

      if (offset) {
        range_array = this.offset_count(range_array, offset);
      }

      let date_range = range_array.map(x => {
        return this.set_dateProps(end_date, this.freq, x);
      });
      let date_string = this.toLocalString(date_range);
      return date_string;
    }
  }

  freq_type(date, ftype) {
    let rslt = null;

    switch (ftype) {
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

  offset_count(d_array, offset) {
    let r_array = [];

    for (let i = 0; i < d_array.length; i += offset) {
      r_array.push(d_array[i]);
    }

    return r_array;
  }

  set_dateProps(date, ftype, val) {
    let new_date = new Date(date.valueOf());

    switch (ftype) {
      case "M":
        if (val.length == 2) {
          new_date.setYear(new_date.getFullYear() + val[0]);
          new_date.setMonth(parseInt(val[1]));
        } else {
          new_date.setMonth(val);
        }

        break;

      case "Y":
        new_date.setYear(val);
        break;

      case "s":
        new_date.setSeconds(val);
        break;

      case "D":
        new_date.setDate(val);
        break;

      case "H":
        new_date.setHours(val);
        break;

      case "m":
        new_date.setMinutes(val);
        break;
    }

    return new_date;
  }

  toLocalString(d_array) {
    let r_array = d_array.map(x => {
      return x.toLocaleString();
    });
    return r_array;
  }

  month_end(start_date, end_date) {
    let end_month = end_date.getMonth();
    let diff_year = end_date.getFullYear() - start_date.getFullYear();
    let end_range = 12 * diff_year + end_month;
    return end_range;
  }

  month_range(range) {
    let minus = null;
    let y_val = 0;
    let d_range = range.map(x => {
      if (x > 11) {
        if (x % 12 == 0) {
          minus = x;
          y_val = x / 12;
          return [y_val, x - minus];
        } else {
          return [y_val, x - minus];
        }
      }

      return [y_val, x];
    });
    return d_range;
  }

  day_end(start_date, end_date) {
    let month_end = this.month_end(start_date, end_date);

    let range = utils.__range(start_date.getMonth(), month_end);

    let m_range = this.month_range(range);
    let sum = 0;

    for (let i = 0; i < m_range.length; i++) {
      let val = m_range[i];
      let d_date = new Date(start_date.getFullYear() + val[0], val[1], 0).getDate();
      sum += d_date;
    }

    return sum;
  }

}

exports.date_range = date_range;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.to_datetime = exports.TimeSeries = void 0;

var _utils = require("./utils");

var _series = require("./series");

const utils = new _utils.Utils();

class TimeSeries {
  constructor(kwargs) {
    utils.__in_object(kwargs, "data", "specify the data");

    if (kwargs["data"] instanceof _series.Series) {
      this.data = kwargs["data"].values;
    } else {
      this.data = kwargs["data"];
    }

    this.format = kwargs["format"] || null;
    this.keys = {
      "Y": 4,
      "m": 2,
      "H": 2,
      "M": 2,
      "S": 2,
      "b": 3,
      "d": 2,
      "-": 1
    };
    this.__in_format = ["%Y-m-d%", "%m-d-Y%", "%m-d-Y H%M%S%"];
    this.__monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.__weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }

  preprocessed() {
    let format_values = null;

    if (this.format) {
      format_values = this.generate_format();
    }

    this.date_list = [];

    for (let i = 0; i < this.data.length; i++) {
      let date_string = this.data[i];

      if (this.format && !this.__in_format.includes(this.format)) {
        let format_dateString = this.__apply_format(date_string, format_values);

        let valueDate = new Date(format_dateString);

        this.__is_validDate(valueDate);

        this.date_list.push(valueDate);
      } else if (this.is_timestamp(date_string)) {
        let string2int = parseInt(date_string);
        let valueDate = new Date(string2int);

        this.__is_validDate(valueDate);

        this.date_list.push(valueDate);
      } else {
        let valueDate = new Date(date_string);

        this.__is_validDate(valueDate);

        this.date_list.push(valueDate);
      }
    }
  }

  __apply_format(elem, format) {
    let date_string = "";
    let temp_val = 0;

    for (let index in format) {
      let value = format[index];

      if (index == 0) {
        date_string += elem.slice(0, value);
      } else if (index > 4) {
        date_string += ":" + elem.slice(temp_val, temp_val + value);
      } else if (index == 4) {
        date_string += " " + elem.slice(temp_val, temp_val + value);
      } else if (index > 0 && index <= 2) {
        date_string += "-" + elem.slice(temp_val, temp_val + value);
      }

      temp_val += value;
    }

    return date_string;
  }

  generate_format() {
    let format_list = this.format.split("");
    let self = this;
    let format_keys = format_list.filter(function (key) {
      return utils.__key_in_object(self.keys, key);
    });
    let format_value = format_keys.map(function (val) {
      return self.keys[val];
    });
    return format_value;
  }

  is_timestamp(date_string) {
    let string2int = parseInt(date_string);
    let int2string = String(string2int);

    if (isNaN(string2int) || int2string.length < date_string.length) {
      return false;
    } else {
      return true;
    }
  }

  __is_validDate(date_instance) {
    if (date_instance.toDateString() == "Invalid Date") {
      throw new Error("Invalid date, the date format not recognise");
    }
  }

  __date_ops(callback) {
    let data = this.date_list.map(function (date_instance) {
      return callback(date_instance);
    });
    let series = new _series.Series(data = data);
    return series;
  }

  month() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getMonth();
    });

    return series;
  }

  hour() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getHours();
    });

    return series;
  }

  day() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getDay();
    });

    return series;
  }

  year() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getFullYear();
    });

    return series;
  }

  month_name() {
    let self = this;

    let series = this.__date_ops(function (date_instance) {
      return self.__monthName[date_instance.getMonth()];
    });

    return series;
  }

  weekdays() {
    let self = this;

    let series = this.__date_ops(function (date_instance) {
      return self.__weekName[date_instance.getDay()];
    });

    return series;
  }

  monthday() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getDate();
    });

    return series;
  }

  seconds() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getSeconds();
    });

    return series;
  }

  minutes() {
    let series = this.__date_ops(function (date_instance) {
      return date_instance.getMinutes();
    });

    return series;
  }

}

exports.TimeSeries = TimeSeries;

const to_datetime = kwargs => {
  let timeseries = new TimeSeries(kwargs);
  timeseries.preprocessed();
  return timeseries;
};

exports.to_datetime = to_datetime;
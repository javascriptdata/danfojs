import { tensor, linspace } from "@tensorflow/tfjs";
import { Configs } from "../config/config";

const config = new Configs();

export class Utils {
  //remove an element from an array
  remove(arr, index) {
    let new_arr = arr.filter(function (val, i) {
      return i != index;
    });

    return new_arr;
  }

  //filter element present in an aray
  __remove_arr(arr, index) {
    let new_arr = arr.filter(function (val, i) {
      return !index.includes(i);
    });

    return new_arr;
  }

  // Returns if a value is a string
  __is_string(value) {
    return typeof value === "string" || value instanceof String;
  }

  // Returns if a value is really a number
  __is_number(value) {
    return typeof value === "number" && isFinite(value);
  }

  // Returns if a value is an object
  __is_object(value) {
    return value && typeof value === "object" && value.constructor === Object;
  }

  // Returns if a value is null
  __is_null(value) {
    return value === null;
  }

  // Returns if a value is undefined
  __is_undefined(value) {
    return typeof value === "undefined";
  }

  /**
     * Optimized version of random sampling from an array, as implemented in Python
     *
     *
        Chooses k unique random elements from a population sequence or set.

        Returns a new list containing elements from the population while
        leaving the original population unchanged.  The resulting list is
        in selection order so that all sub-slices will also be valid random
        samples.  This allows raffle winners (the sample) to be partitioned
        into grand prize and second place winners (the subslices).

        Members of the population need not be hashable or unique.  If the
        population contains repeats, then each occurrence is a possible
        selection in the sample.

        To choose a sample in a range of integers, use range as an argument.
        This is especially fast and space efficient for sampling from a
        large population:   sample(range(10000000), 60)

        Sampling without replacement entails tracking either potential
        selections (the array) in a list or previous selections in a set.

        When the number of selections is small compared to the
        population, then tracking selections is efficient, requiring
        only a small set and an occasional reselection.  For
        a larger number of selections, the array tracking method is
        preferred since the list takes less space than the
        set and it doesn't suffer from frequent reselections.
     *
     * @param {*} array The array to sample values from randomly
     * @param {*} num The number of elements to sample randomly
     */
  // Chooses k unique random elements from array.
  __sample_from_iter(array, k, destructive) {
    var n = array.length;

    if (k < 0 || k > n)
      throw new RangeError("Sample larger than population or is negative");

    if (
      destructive ||
      n <= (k <= 5 ? 21 : 21 + Math.pow(4, Math.ceil(Math.log(k * 3, 4))))
    ) {
      if (!destructive) array = Array.prototype.slice.call(array);
      for (var i = 0; i < k; i++) {
        // invariant: non-selected at [i,n)
        var j = (i + Math.random() * (n - i)) | 0;
        var x = array[i];
        array[i] = array[j];
        array[j] = x;
      }
      array.length = k; // truncate
      return array;
    } else {
      var selected = new Set();
      // eslint-disable-next-line no-empty
      while (selected.add((Math.random() * n) | 0).size < k) {}
      // eslint-disable-next-line no-undef
      return Array.prototype.map.call(selected, (i) => population[i]);
    }
  }

  //generate integers between two set of numbers
  __range(start, end) {
    let value = linspace(start, end, end - start + 1).arraySync();
    return value;
  }

  //check if key is in object
  __key_in_object(object, key) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      return true;
    } else {
      return false;
    }
  }

  //transpose row array into column wise array
  __get_col_values(data) {
    let row_len = data.length;
    let cols_len = data[0].length;
    var cols_arr = [];
    for (var i = 0; i <= cols_len - 1; i++) {
      let temp_col = [];
      for (let j = 0; j < row_len; j++) {
        temp_col.push(data[j][i]);
      }
      cols_arr.push(temp_col);
    }
    return cols_arr;
  }

  /**
   * retrieve row array and column names from object of the form {a: [1,2,3,4], b: [30,20, 30, 20}]
   * @param {*} data
   */
  _get_row_and_col_values(data) {
    let col_names = Object.keys(data);
    let col_data = Object.values(data);
    let first_col_len = col_data[0].length;

    col_data.forEach((data) => {
      if (data.length != first_col_len) {
        throw Error("Length Error: Length of columns must be the same!");
      }
    });
    let rows_len = col_data[0].length;
    let cols_len = col_names.length;
    var rows_arr = [];

    for (var i = 0; i <= rows_len - 1; i++) {
      var temp_row = [];
      for (let j = 0; j < cols_len; j++) {
        let _arr = col_data[j];
        temp_row.push(_arr[i]);
      }
      rows_arr.push(temp_row);
    }
    return [ rows_arr, col_names ];
  }

  //converts a 2D array of array to 1D for Series Class
  __convert_2D_to_1D(data) {
    let new_data = [];
    data.map((val) => {
      if (this.__is_object(val)) {
        new_data.push(JSON.stringify(val));
      } else {
        new_data.push(`${val}`);
      }
    });
    return new_data;
  }

  __replace_undefined_with_NaN(data, isSeries) {
    if (isSeries) {
      let temp_arr = [];
      data.forEach((val) => {
        if (typeof val === "undefined" || val == Infinity || val == null) {
          temp_arr.push(NaN);
        } else {
          temp_arr.push(val);
        }
      });
      return temp_arr;
    } else {
      let full_arr = [];
      data.forEach((val) => {
        var temp_arr = [];
        val.forEach((ele) => {
          if (typeof ele === "undefined" || ele == Infinity || ele == null) {
            temp_arr.push(NaN);
          } else {
            temp_arr.push(ele);
          }
        });
        full_arr.push(temp_arr);
      });
      return full_arr;
    }
  }

  //infer types from an array of array
  __get_t(arr_val) {
    if (this.__is_1D_array(arr_val)) {
      const dtypes = [];
      let int_tracker = [];
      let float_tracker = [];
      let string_tracker = [];
      let bool_tracker = [];
      let lim;

      //remove NaNs from array
      let arr = [];
      arr_val.map((val) => {
        if (!(isNaN(val) && typeof val != "string")) {
          arr.push(val);
        }
      });

      if (arr.length < config.get_dtype_test_lim) {
        lim = arr.length - 1;
      } else {
        lim = config.get_dtype_test_lim - 1;
      }
      arr.forEach((ele, indx) => {
        let count = indx;
        if (typeof ele == "boolean") {
          float_tracker.push(false);
          int_tracker.push(false);
          string_tracker.push(false);
          bool_tracker.push(true);
        } else if (!isNaN(Number(ele))) {
          if (ele.toString().includes(".")) {
            float_tracker.push(true);
            int_tracker.push(false);
            string_tracker.push(false);
            bool_tracker.push(false);
          } else {
            float_tracker.push(false);
            int_tracker.push(true);
            string_tracker.push(false);
            bool_tracker.push(false);
          }
        } else {
          float_tracker.push(false);
          int_tracker.push(false);
          string_tracker.push(true);
          bool_tracker.push(false);
        }

        if (count == lim) {
          //if atleast one string appears return string dtype
          const even = (element) => element == true;
          if (string_tracker.some(even)) {
            dtypes.push("string");
          } else if (float_tracker.some(even)) {
            dtypes.push("float32");
          } else if (int_tracker.some(even)) {
            dtypes.push("int32");
          } else if (bool_tracker.some(even)) {
            dtypes.push("boolean");
          } else {
            dtypes.push("undefined");
          }
        }
      });

      return dtypes;
    } else {
      const dtypes = [];
      let lim;
      if (arr_val[0].length < config.get_dtype_test_lim) {
        lim = arr_val[0].length - 1;
      } else {
        lim = config.get_dtype_test_lim - 1;
      }
      arr_val.forEach((ele) => {
        let int_tracker = [];
        let float_tracker = [];
        let string_tracker = [];
        let bool_tracker = [];

        //remove NaNs from array before checking dtype
        let arr = [];
        ele.map((val) => {
          if (!(isNaN(val) && typeof val != "string")) {
            arr.push(val);
          } else {
            arr.push("NaN"); //set NaN to string and return dtype ""string". The caller should explicitly convert the dtype
          }
        });

        arr.forEach((ele, indx) => {
          let count = indx;
          if (typeof ele == "boolean") {
            float_tracker.push(false);
            int_tracker.push(false);
            string_tracker.push(false);
            bool_tracker.push(true);
          } else if (!isNaN(Number(ele))) {
            if (ele.toString().includes(".")) {
              float_tracker.push(true);
              int_tracker.push(false);
              string_tracker.push(false);
              bool_tracker.push(false);
            } else {
              float_tracker.push(false);
              int_tracker.push(true);
              string_tracker.push(false);
              bool_tracker.push(false);
            }
          } else {
            float_tracker.push(false);
            int_tracker.push(false);
            string_tracker.push(true);
            bool_tracker.push(false);
          }

          if (count == lim) {
            //if atleast one string appears return string dtype
            const even = (element) => element == true;
            if (string_tracker.some(even)) {
              dtypes.push("string");
            } else if (float_tracker.some(even)) {
              dtypes.push("float32");
            } else if (int_tracker.some(even)) {
              dtypes.push("int32");
            } else if (bool_tracker.some(even)) {
              dtypes.push("boolean");
            } else {
              dtypes.push("undefined");
            }
          }
        });
      });

      return dtypes;
    }
  }

  __unique(data) {
    let unique = new Set();

    data.map(function (val) {
      unique.add(val[0]);
    });

    let unique_array = Array.from(unique);

    return unique_array;
  }

  //second version of In object
  __in_object(object, key, message) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      throw new Error(message);
    }
  }

  //check if a array is 1D
  __is_1D_array(arr) {
    if (
      typeof arr[0] == "number" ||
      typeof arr[0] == "string" ||
      typeof arr[0] == "boolean"
    ) {
      return true;
    } else {
      return false;
    }
  }

  //converts an array to object with index as value
  __arr_to_obj(arr) {
    let arr_map = {};
    arr.forEach((ele, i) => {
      arr_map[ele] = i;
    });
    return arr_map;
  }

  /**
   * count the NaN and non-NaN values present in an array
   * @param {Array} arr Array object
   * @param {Boolean} val whether to return the value count instead of the null count
   * @param {Boolean} isSeries Whether the Obj is of type series or not
   */
  __count_nan(arr, return_val = true, isSeries) {
    if (isSeries) {
      let null_count = 0;
      let val_count = 0;
      arr.forEach((ele) => {
        if (Number.isNaN(ele)) {
          null_count = null_count + 1;
        } else {
          val_count = val_count + 1;
        }
      });
      if (return_val) {
        return val_count;
      } else {
        return null_count;
      }
    } else {
      let result_arr = [];
      arr.forEach((ele_arr) => {
        let null_count = 0;
        let val_count = 0;
        ele_arr.forEach((ele) => {
          if (Number.isNaN(ele)) {
            null_count = null_count + 1;
          } else {
            val_count = val_count + 1;
          }
        });
        if (return_val) {
          result_arr.push(val_count);
        } else {
          result_arr.push(null_count);
        }
      });
      return result_arr;
    }
  }

  //computes the median of an array
  __median(arr, isSeries) {
    if (isSeries) {
      const sorted = arr.slice().sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);

      if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
      }

      return sorted[middle];
    } else {
      let result_arr = [];
      arr.map((ele) => {
        const sorted = ele.slice().sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
          result_arr.push((sorted[middle - 1] + sorted[middle]) / 2);
        } else {
          result_arr.push(sorted[middle]);
        }
      });
      return result_arr;
    }
  }

  //computes the mode(s) of an array
  __mode(arr) {
    var modes = [],
      count = [],
      i,
      maxIndex = 0;

    arr.forEach((val) => {
      count[val] = (count[val] || 0) + 1;
      if (count[val] > maxIndex) {
        maxIndex = count[val];
      }
    });

    for (i in count)
      if (this.__key_in_object(count, i)) {
        if (count[i] === maxIndex) {
          modes.push(Number(i));
        }
      }

    return modes;
  }

  //round elements of an array to ndp
  __round(arr, dp = 2, isSeries) {
    if (dp < 0) {
      dp = 1;
    }
    if (isSeries) {
      let new_arr = [];
      arr.map((val) => {
        new_arr.push(Number(val.toFixed(dp)));
      });

      return new_arr;
    } else {
      let result_arr = [];
      arr.map((arr_ele) => {
        let new_arr = [];
        arr_ele.map((val) => {
          new_arr.push(Number(val.toFixed(dp)));
        });
        result_arr.push(new_arr);
      });
      return result_arr;
    }
  }

  //check a variable is a function
  __is_function(variable) {
    return typeof variable == "function";
  }

  //generate a random list
  __randgen(num, start, end) {
    let gen_num = [];

    //random int
    function randi(a, b) {
      return Math.floor(Math.random() * (b - a) + a);
    }

    function recursive(val, arr) {
      if (!arr.includes(val)) {
        return val;
      }

      val = randi(start, end);

      recursive(val, arr);
    }

    for (let i = 0; i < num; i++) {
      let gen_val = randi(start, end);
      let recur_val = recursive(gen_val, gen_num);
      gen_num.push(recur_val);
    }

    return gen_num;
  }

  _throw_wrong_params_error(kwargs, params_needed) {
    let keys = Object.keys(kwargs);
    let bool = [];
    for (let i = 0; i < keys.length; i++) {
      if (params_needed.includes(keys[i])) {
        bool.push(true);
      } else {
        bool.push(false);
      }
    }
    const truthy = (element) => element == false;
    if (bool.some(truthy)) {
      throw Error(
        `Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}]`
      );
    }
  }

  //maps int values (0, 1) to bools (false, true)
  __map_int_to_bool(arr, dim) {
    let new_arr = [];
    if (dim == 2) {
      arr.map((outer_val) => {
        let temp_arr = [];
        outer_val.map((val) => {
          if (val == 1) {
            temp_arr.push(true);
          } else {
            temp_arr.push(false);
          }
        });
        new_arr.push(temp_arr);
      });
      return new_arr;
    } else {
      arr.map((val) => {
        if (val == 1) {
          new_arr.push(true);
        } else {
          new_arr.push(false);
        }
      });
      return new_arr;
    }
  }

  __std(data) {
    let tensor_data = data;

    let mean = tensor_data.mean();
    let sub_mean_pow = tensor_data.sub(mean).pow(2);
    let mean_data = sub_mean_pow.mean();
    let std = mean_data.sqrt();

    return std;
  }

  __zeros(row, column) {
    let zero_data = [];

    for (let i = 0; i < row; i++) {
      let col_data = Array(column);
      for (let j = 0; j < column; j++) {
        col_data[j] = 0;
      }
      zero_data.push(col_data);
    }
    return zero_data;
  }

  __shuffle(num, array) {
    //https://stackoverflow.com/questions/18806210/generating-non-repeating-random-numbers-in-js/18806417
    var j,
      temp;

    for (let i = 0; i < num; i++) {
      j = Math.floor(Math.random() * (array.length - i)) + i;

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array.slice(0, num);
  }

  __sort(arr, ascending = true) {
    let sorted = arr.slice();
    return sorted.sort((a, b) => {
      if (ascending) {
        if (typeof a === "string" && typeof b === "string") {
          return a.charCodeAt() - b.charCodeAt();
        } else {
          return a - b;
        }
      } else {
        if (typeof a === "string" && typeof b === "string") {
          return b.charCodeAt() - a.charCodeAt();
        } else {
          return b - a;
        }
      }
    });
  }

  __is_browser_env() {
    var isBrowser = new Function(
      "try {return this===window;}catch(e){ return false;}"
    );
    // tests if global scope is binded to window
    return isBrowser();
  }

  __is_node_env() {
    var isNode = new Function(
      "try {return this===global;}catch(e){return false;}"
    );
    // tests if global scope is binded to window
    return isNode();
  }

  _throw_str_dtype_error(obj, ops) {
    if (obj.dtypes[0] == "string") {
      throw Error(
        `dtype error: String data type does not support ${ops} operation`
      );
    }
  }

  /**
   * Remove NaN values from Array
   * @param {*} arr
   */
  _remove_nans(arr) {
    let values = arr.filter((val) => !isNaN(val) && typeof val != "string");
    return values;
  }

  __get_duplicate(arr) {
    let temp_obj = {};
    let rslt_obj = {};

    arr.forEach((val, index) => {
      if (val in temp_obj) {
        temp_obj[val]["count"] += 1;
        temp_obj[val]["index"].push(index);
      } else {
        temp_obj[val] = {};
        temp_obj[val]["count"] = 1;
        temp_obj[val]["index"] = [ index ];
      }
    });

    for (let key in temp_obj) {
      if (temp_obj[key]["count"] >= 2) {
        rslt_obj[key] = {};
        rslt_obj[key]["count"] = temp_obj[key]["count"];
        rslt_obj[key]["index"] = temp_obj[key]["index"];
      }
    }

    return rslt_obj;
  }

  /**
   * Sorts an array by index
   * @param {Array} arr1
   * @param {Array} arr2
   * @param {string} dtype
   *
   * @returns sorted index
   */
  _sort_arr_with_index(arr1, arr2, dtype) {
    let sorted_idx = arr1.map((item, index) => {
      return [ arr2[index], item ];
    });
    if (dtype == "string") {
      sorted_idx.sort();
    } else {
      sorted_idx.sort(([ arg1 ], [ arg2 ]) => arg2 - arg1);
    }

    return sorted_idx.map(([ , item ]) => item);
  }

  _validate_nonnegative_int(n) {
    if (n < 0 || Math.floor(n) !== n) {
      throw new Error(`${n} is not a nonnegative integer`);
    }
  }
}

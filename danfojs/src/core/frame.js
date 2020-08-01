import Ndframe from "./generic"
import { Series } from "./series"
import * as tf from '@tensorflow/tfjs-node'
// import * as tf from '@tensorflow/tfjs'
import { Utils } from "./utils"
import { GroupBy } from "./groupby"
// import {TimeSeries} from "./timeseries"
import { Merge } from "./merge"

const utils = new Utils
// const config = new Configs()
import { std, variance } from 'mathjs'



/**
 * DataFrame object. A 2D frame object that stores data in structured tabular format
 * @param {data} data, JSON, Array of structured data
 * @param {kwargs} Object {columns: Array of column names, dtypes: string of data types present in dataset.}
 * 
 * @returns DataFrame data structure
 */
export class DataFrame extends Ndframe {
    constructor(data, kwargs) {
        super(data, kwargs)
        this.__set_column_property() //set column property on Class
    }



    //set all columns to DataFrame Property. This ensures easy access to columns as Series
    __set_column_property() {
        let col_vals = this.col_data
        let col_names = this.column_names

        col_vals.forEach((col, i) => {
            this[col_names[i]] = new Series(col, { columns: col_names[i], index: this.index })
        });
    }

    /**
     * Drop a row or a column base on the axis specified
     * @param {val} String name of row or column to drop
     * @param {kwargs} Object (Optional configuration object
     *             {axis: row=0, columns=1
     *             inplace: specify whether to drop the row/column with/without creating a new DataFrame}
     *            
     */
    drop(val, kwargs = { axis: 0, inplace: false }) {

        if (kwargs['axis'] == 1) {
            const index = this.columns.indexOf(val);
            const values = this.values

            if (index == -1) {
                throw new Error(`column "${val}" does not exist`)
            }

            let new_data = values.map(function (element) {
                let new_arr = utils.remove(element, index);
                return new_arr;
            });

            if (!kwargs['inplace']) {
                let columns = utils.remove(this.columns, index);
                return new DataFrame(new_data, { columns: columns })
            } else {
                this.columns = utils.remove(this.columns, index);
                this.data_tensor = tf.tensor(new_data);
                this.data = new_data
            }

        } else {

            const axes = this.axes
            const isIndex = axes["index"].includes(val);
            const values = this.values

            if (isIndex) {
                var index = val;
            } else {
                throw new Error("Index does not exist")
            }

            let new_data = utils.remove(values, index);

            if (!kwargs['inplace']) {
                return new DataFrame(new_data, { columns: this.columns })
            } else {
                this.data_tensor = tf.tensor(new_data);
                this.data = new_data
            }
        }
    }

    /**
     * Obtain the defined the set of row and column index 
     * @param {*} kwargs object {rows:Array, columns:Array of column name, type: ["iloc","loc"]} 
     * @return Array
     */
    __indexLoc(kwargs) {
        let rows = null;
        let columns = null;
        let isColumnSplit = false;
        if (Object.prototype.hasOwnProperty.call(kwargs, "rows")) { //check if the object has the key
            if (Array.isArray(kwargs["rows"])) {

                if (kwargs["rows"].length == 1 && typeof kwargs["rows"][0] == "string") {
                    //console.log("here", kwargs["rows"].length)
                    if (kwargs["rows"][0].includes(":")) {

                        let row_split = kwargs["rows"][0].split(":")

                        let start = parseInt(row_split[0]) || 0;
                        let end = parseInt(row_split[1]) || (this.values.length - 1);

                        if (typeof start == "number" && typeof end == "number") {
                            rows = utils.__range(start, end);
                            // rows = this.index.slice(start, end)
                        }

                    } else {
                        throw new Error("numbers in string must be separated by ':'")
                    }
                } else {
                    rows = kwargs["rows"];
                }
            } else {
                throw new Error("rows must be a list")
            }
        } else {
            throw new Error("Kwargs keywords are {rows, columns}")
        }

        if (Object.prototype.hasOwnProperty.call(kwargs, "columns")) {
            if (Array.isArray(kwargs["columns"])) {
                if (kwargs["columns"].length == 1 && kwargs["columns"][0].includes(":")) {

                    let row_split = kwargs["columns"][0].split(":")
                    let start, end;

                    if (kwargs["type"] == "iloc" || (row_split[0] == "")) {
                        start = parseInt(row_split[0]) || 0;
                        end = parseInt(row_split[1]) || (this.values[0].length - 1);
                    } else {

                        start = parseInt(this.columns.indexOf(row_split[0]));
                        end = parseInt(this.columns.indexOf(row_split[1]));
                    }


                    if (typeof start == "number" && typeof end == "number") {

                        columns = utils.__range(start, end);
                        isColumnSplit = true;
                    }

                } else {
                    columns = kwargs["columns"];
                }

            } else {
                throw new Error("columns must be a list")
            }
        } else {
            throw new Error("Kwargs keywords are {rows, columns}")
        }

        let data_values = this.values;
        let new_data = []; // store the data from the for loop

        for (var index = 0; index < rows.length; index++) {
            let row_val = rows[index]
            let max_rowIndex = data_values.length - 1 //obtain the maximum row index

            if (row_val > max_rowIndex) { //check if the input row index is greater than the maximum row index
                throw new Error(`Specified row index ${row_val} is bigger than maximum row index of ${max_rowIndex}`);
            }

            let value = data_values[row_val]
            let row_data = []

            for (var i in columns) {
                var col_index;
                if (kwargs["type"] == "loc" && !isColumnSplit) {
                    col_index = this.columns.indexOf(columns[i]); //obtain the column index

                    if (col_index == -1) {
                        throw new Error(`Column ${columns[i]} does not exist`);
                    }
                } else {
                    col_index = columns[i];
                    let max_colIndex = this.columns.length - 1; //assign the maximum column index to a value

                    if (col_index > max_colIndex) {
                        throw new Error(`column index ${col_index} is bigger than ${max_colIndex}`);
                    }
                }

                let elem = value[col_index]; //obtain the element at the column index
                row_data.push(elem);
            }

            new_data.push(row_data); //store the data for each row in the new_data

        }

        let column_names = []
        if (kwargs["type"] == "iloc" || isColumnSplit) {
            // let axes = this.axes
            columns.map((col) => {
                column_names.push(this.columns[col]);
            })
        } else {
            column_names = columns
        }

        return [new_data, column_names, rows];
    }

    /**
     * Obtain the defined the set of row and column index 
     * @param {} kwargs object {rows: Array of index, columns: Array of column name(s)} 
     * @return DataFrame data stucture
     */
    loc(kwargs) {

        kwargs["type"] = "loc"
        let [new_data, columns, rows] = this.__indexLoc(kwargs);
        let df_columns = { "columns": columns }
        let df = new DataFrame(new_data, df_columns);
        df.index_arr = rows
        // console.log("Printing rowss");
        // console.log(rows);
        return df;

    }


    /**
     * Access a dataframe element using row and column index
     * @param {*} kwargs object {rows: Array of index, columns: Array of column index}  
     * @return DataFrame data stucture
     */
    iloc(kwargs) {

        kwargs["type"] = "iloc";

        let [new_data, columns, rows] = this.__indexLoc(kwargs);
        let df_columns = { "columns": columns }
        // console.log(new_data)
        let df = new DataFrame(new_data, df_columns);
        df.index_arr = rows
        return df;

    }


    /**
    * Prints the first n values in a dataframe
    * @param {rows}  
    */
    head(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            //Creates a new dataframe with first [rows]
            let data = this.values.slice(0, rows)
            let idx = this.index.slice(0, rows)
            let config = { columns: this.column_names, index: idx }
            return new DataFrame(data, config)
        }

    }

    /**
    * Prints the last n values in a dataframe
    * @param {rows}  
    */
    tail(rows = 5) {
        let row_len = this.values.length
        if (rows > row_len || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            //Creates a new dataframe with last [rows]
            let data = this.values.slice(row_len - rows)
            let indx = this.index.slice(row_len - rows)
            let config = { columns: this.column_names, index: indx }
            let df = new DataFrame(data, config)
            return df
        }

    }

    /**
    * Gets [num] number of random rows in a dataframe
    * @param {rows}  
    */
    sample(num = 5) {
        //TODO: Use different sampling strategy
        if (num > this.values.length || num < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            let values = this.values
            let idx = this.index
            let new_values = []
            let new_idx = []

            let counts = [...Array(idx.length).keys()]   //set index

            //get random sampled numbers
            let rand_nums = utils.__sample_from_iter(counts, num, false)
            rand_nums.map(i => {
                new_values.push(values[i])
                new_idx.push(idx[i])
            })

            let config = { columns: this.column_names, index: new_idx }
            let df = new DataFrame(new_values, config)
            return df

        }
    }

    /**
       * Return Addition of DataFrame and other, element-wise (binary operator add).
       * @param {other} DataFrame, Series, Array or Number to add  
       * @returns {DataFrame}
       */
    add(other, axis) {
        if (this.__frame_is_compactible_for_operation) { //check if all types a numeric
            let tensors = this.__get_ops_tensors([this, other], axis)
            let sum_vals = tensors[0].add(tensors[1])
            let col_names = this.columns
            return this.__get_df_from_tensor(sum_vals, col_names)

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
      * Return subtraction of DataFrame and other, element-wise (binary operator add).
      * @param {other} DataFrame, Series, Array or Number to add  
      * @returns {DataFrame}
      */
    sub(other, axis) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensors = this.__get_ops_tensors([this, other], axis)
            let result = tensors[0].sub(tensors[1])
            let col_names = this.columns
            return this.__get_df_from_tensor(result, col_names)

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
       * Return subtraction of DataFrame and other, element-wise (binary operator add).
       * @param {other} DataFrame, Series, Array or Number to add  
       * @returns {DataFrame}
       */
    mul(other, axis) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensors = this.__get_ops_tensors([this, other], axis)
            let result = tensors[0].mul(tensors[1])
            let col_names = this.columns
            return this.__get_df_from_tensor(result, col_names)

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
       * Return division of DataFrame and other, element-wise (binary operator add).
       * @param {other} DataFrame, Series, Array or Number to add  
       * @returns {DataFrame}
       */
    div(other, axis) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensors = this.__get_ops_tensors([this, other], axis)
            let result = tensors[0].div(tensors[1])
            let col_names = this.columns
            return this.__get_df_from_tensor(result, col_names)

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
      * Return division of DataFrame and other, element-wise (binary operator add).
      * @param {other} DataFrame, Series, Array or Number to add  
      * @returns {DataFrame}
      */
    pow(other, axis) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensors = this.__get_ops_tensors([this, other], axis)
            let result = tensors[0].pow(tensors[1])
            let col_names = this.columns
            return this.__get_df_from_tensor(result, col_names)

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
       * Return division of DataFrame and other, element-wise (binary operator add).
       * @param {other} DataFrame, Series, Array or Number to add  
       * @returns {DataFrame}
       */
    mod(other, axis) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensors = this.__get_ops_tensors([this, other], axis)
            let result = tensors[0].mod(tensors[1])
            let col_names = this.columns
            return this.__get_df_from_tensor(result, col_names)

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
       * Return mean of DataFrame across specified axis.
       * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
       * @returns {Series}
       */
    mean(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let operands = this.__get_tensor_and_idx(this, axis)
            let tensor_vals = operands[0]
            let idx = operands[1]
            let result = tensor_vals.mean(operands[2])
            let sf = new Series(result.arraySync(), { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
       * Return median of DataFrame across specified axis.
       * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
       * @returns {Series}
       */
    median(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensor_vals, idx;
            if (axis == 1) {
                tensor_vals = this.col_data_tensor.arraySync()
                idx = this.column_names
            } else {
                tensor_vals = this.row_data_tensor.arraySync()
                idx = this.index
            }
            let median = utils.__median(tensor_vals, false)
            let sf = new Series(median, { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
     * Return minimum element in a DataFrame across specified axis.
     * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
     * @returns {Series}
     */
    min(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let operands = this.__get_tensor_and_idx(this, axis)
            let tensor_vals = operands[0]
            let idx = operands[1]
            let result = tensor_vals.min(operands[2])
            let sf = new Series(result.arraySync(), { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
     * Return maximum element of DataFrame across specified axis.
     * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
     * @returns {Series}
     */
    max(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let operands = this.__get_tensor_and_idx(this, axis)
            let tensor_vals = operands[0]
            let idx = operands[1]
            let result = tensor_vals.max(operands[2])
            let sf = new Series(result.arraySync(), { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
       * Return standard deviation of DataFrame across specified axis.
       * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
       * @returns {Series}
       */
    std(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensor_vals = this.col_data_tensor.arraySync()
            let idx;
            if (axis == 1) {
                idx = this.column_names
            } else {
                idx = this.index
            }
            let median = std(tensor_vals, axis)
            let sf = new Series(median, { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
      * Return variance of DataFrame across specified axis.
      * @param {axis} Number {0: row, 1 : column} Axis for the function to be applied on
      * @returns {Series}
      */
    var(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensor_vals = this.col_data_tensor.arraySync()
            let idx;
            if (axis == 1) {
                idx = this.column_names
            } else {
                idx = this.index
            }
            let median = variance(tensor_vals, axis)
            let sf = new Series(median, { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }


    /**
     * Return number of non-null elements in a Series
     *  @returns {Series}, Count of non-null values
     */
    count(axis = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let tensor_vals, idx;
            if (axis == 1) {
                tensor_vals = this.col_data_tensor.arraySync()
                idx = this.column_names
            } else {
                tensor_vals = this.row_data_tensor.arraySync()
                idx = this.index
            }
            let counts = utils.__count_nan(tensor_vals, true, false)
            let sf = new Series(counts, { "index": idx })
            return sf

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }

    /**
     * Rounds values in  DataFrame to specified number of dp
     *  @returns {DataFrame}, New DataFrame with rounded values
     */
    round(dp = 1) {
        if (this.__frame_is_compactible_for_operation) { //check if all types are numeric
            let values = this.values
            let idx = this.index

            let new_vals = utils.__round(values, dp, false)
            let options = { "columns": this.column_names, "index": idx }
            let df = new DataFrame(new_vals, options)
            return df
        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }


    /**
     * Find the cummulative max
     * @param {axis} axis [int] {0 or 1} 
     */
    cum_ops(axis = 0, ops) {

        if (!(axis == 0) && !(axis == 1)) {
            throw new Error("axis must be between 0 or 1")
        }

        if (this.__frame_is_compactible_for_operation) {

            let data = []
            let df_data = null

            if (axis == 0) {
                df_data = this.col_data
            } else {
                df_data = this.values
            }

            for (let i = 0; i < df_data.length; i++) {
                let value = df_data[i]
                let temp_val = value[0]
                let temp_data = [temp_val]
                for (let j = 1; j < value.length; j++) {

                    let curr_val = value[j]
                    switch (ops) {
                        case "max":
                            if (curr_val > temp_val) {
                                temp_val = curr_val
                                temp_data.push(curr_val);
                            } else {
                                temp_data.push(temp_val)
                            }
                            break;
                        case "min":
                            if (curr_val < temp_val) {
                                temp_val = curr_val
                                temp_data.push(curr_val);
                            } else {
                                temp_data.push(temp_val)
                            }
                            break;
                        case "sum":
                            temp_val = temp_val + curr_val
                            temp_data.push(temp_val)

                            break;
                        case "prod":
                            temp_val = temp_val * curr_val
                            temp_data.push(temp_val);

                            break

                    }
                }
                data.push(temp_data)
            }

            if (axis == 0) {
                data = utils.__get_col_values(data)
            }

            return new DataFrame(data, { columns: this.columns })

        } else {
            throw Error("TypeError: Dtypes of columns must be Float of Int")
        }

    }
    /**
     * calculate the cummulative sum
     * @param {kwargs} {axis: [int]}
     */
    cumsum(kwargs = {}) {
        let axis = kwargs["axis"] || 0
        let data = this.cum_ops(axis, "sum");
        return data
    }

    /**
     * calculate the cummulative min
     * @param {kwargs} {axis: [int]}
     */
    cummin(kwargs = {}) {
        let axis = kwargs["axis"] || 0
        let data = this.cum_ops(axis, "min");
        return data
    }

    /**
     * calculate the cummulative max
     * @param {kwargs} {axis: [int]}
     */
    cummax(kwargs = {}) {
        let axis = kwargs["axis"] || 0
        let data = this.cum_ops(axis, "max");
        return data
    }

    /**
     * calculate the cummulative prod
     * @param {kwargs} {axis: [int]}
     */
    cumprod(kwargs = {}) {
        let axis = kwargs["axis"] || 0
        let data = this.cum_ops(axis, "prod");
        return data
    }

    /**
    * Makes a new copy of a DataFrame  
    * @returns {DataFrame}
    */
    copy() {
        let df = new DataFrame([...this.values],
            {
                columns: [...this.column_names],
                index: this.index, dtypes: this.dtypes
            })
        return df
    }

    /**
   * Generate a new DataFrame with the index reset.
   * This is useful when the index needs to be treated as a column, 
   * or when the index is meaningless and needs to be reset to the default before another operation.
   * @param {kwargs} {inplace: Modify the Series in place (do not create a new object,
   *                  drop: Just reset the index, without inserting it as a column in the new DataFrame.}
   */
    reset_index(kwargs = {}) {
        let options = {}
        if (utils.__key_in_object(kwargs, 'inplace')) {
            options['inplace'] = kwargs['inplace']
        } else {
            options['inplace'] = false
        }

        if (options['inplace']) {
            this.__reset_index()
        } else {
            let df = this.copy()
            df.__reset_index()
            return df
        }
    }

    /**
    * Generate a new Series with the specified index.
    * Set the Series index (row labels) using an array of the same length.
    * @param {kwargs} {index: Array of new index values}
    */
    set_index(kwargs = {}) {
        let options = {}
        if (utils.__key_in_object(kwargs, 'index')) {
            options['index'] = kwargs['index']
        } else {
            throw Error("Index ValueError: You must specify an array of index")
        }

        if (utils.__key_in_object(kwargs, 'inplace')) {
            options['inplace'] = kwargs['inplace']
        } else {
            options['inplace'] = false
        }

        if (options['index'].length != this.index.length) {
            throw Error(`Index LengthError: Lenght of new Index array ${options['index'].length} must match lenght of existing index ${this.index.length}`)
        }

        if (options['inplace']) {
            this.index_arr = options['index']
        } else {
            let df = this.copy()
            df.__set_index(options['index'])
            return df
        }
    }


    /**
    * Generate descriptive statistics for all numeric columns
    * Descriptive statistics include those that summarize the central tendency, 
    * dispersion and shape of a dataset’s distribution, excluding NaN values.
    * @returns {Series}
    */
    describe() {
        let numeric_df = this.select_dtypes(['float32', 'int32'])
        let col_names = numeric_df.columns
        let index = ['count', 'mean', 'std', 'min', 'median', 'max', 'variance']

        let stats_arr = []
        col_names.forEach(name => {
            let col_series = numeric_df.column(name)
            let count = col_series.count()
            let mean = col_series.mean()
            let std = col_series.std()
            let min = col_series.min()
            let median = col_series.median()
            let max = col_series.max()
            let variance = col_series.var()

            let _stats = [count, mean, std, min, median, max, variance]
            let col_obj = {}
            col_obj[name] = _stats
            stats_arr.push(col_obj)

        })
        let df = new DataFrame(stats_arr, { "index": index })
        return df.round(6)

    }

    /**
     * Return a subset of the DataFrame’s columns based on the column dtypes.
     * @param {include} scalar or array-like. A selection of dtypes or strings to be included. At least one of these parameters must be supplied.
     * @returns {DataFrame, Series} The subset of the frame including the dtypes.
     */
    select_dtypes(include = [""]) {
        let dtypes = this.dtypes
        // let dtype_index = [...Array(this.dtypes.length - 1).keys()]
        let col_vals = []
        let original_col_vals = this.col_data
        const __supported_dtypes = ['float32', "int32", 'string', 'datetime']

        if (include == [""] || include == []) {
            //return all
            let df = this.copy()
            return df
        } else {
            //check if the right types are included
            include.forEach(type => {
                if (!__supported_dtypes.includes(type)) {
                    throw Error(`Dtype Error: dtype ${type} not found in dtypes`)
                }
                dtypes.map((dtype, i) => {
                    if (dtype == type) {
                        let _obj = {}
                        _obj[this.column_names[i]] = original_col_vals[i]
                        col_vals.push(_obj)
                    }
                })

            });
            if (col_vals.length == 1) {
                let _key = Object.keys(col_vals[0])[0]
                let data = col_vals[0][_key]
                let column_name = [_key]
                let sf = new Series(data, { columns: column_name, index: this.index })
                return sf
            } else {
                let df = new DataFrame(col_vals, { index: this.index })
                return df
            }
        }

    }


    /**
    * Sort a Dataframe in ascending or descending order by some criterion.
    *  @param {kwargs} Object, {ascending (Bool): Whether to return sorted values in ascending order or not,
    *                           inplace (Bool): Whether to perform sorting on the original Series or not}
    * @returns {Series}
    */
    sort_values(kwargs = {}) {
        if (utils.__key_in_object(kwargs, "by")) {
            let sort_col = this.column(kwargs["by"])
            let sorted_col, sorted_index;
            let new_row_data = []

            if (utils.__key_in_object(kwargs, "inplace") && kwargs['inplace'] == true) {
                sort_col.sort_values(kwargs)
                sorted_index = sort_col.index

            } else {
                sorted_col = sort_col.sort_values(kwargs)
                sorted_index = sorted_col.index
            }

            sorted_index.map(idx => {
                new_row_data.push(this.values[idx])
            })

            if (utils.__key_in_object(kwargs, "inplace") && kwargs['inplace'] == true) {
                this.data = new_row_data
                this.index_arr = sorted_index
                return null
            } else {
                let df = new DataFrame(new_row_data, { columns: this.column_names, index: sorted_index, dtype: this.dtypes })
                return df
            }

        } else {
            throw Error("Value Error: must specify the column to sort by")
        }

    }

    __get_tensor_and_idx(df, axis) {
        let tensor_vals, idx, t_axis;
        if (axis == 1) {
            //Tensorflow uses 0 for column and 1 for rows, 
            // we use the opposite for consistency with Pandas (0 : row, 1: columns)
            tensor_vals = df.row_data_tensor
            idx = df.column_names
            t_axis = 0 //switch the axis

        } else {
            tensor_vals = df.row_data_tensor
            idx = df.index
            t_axis = 1
        }

        return [tensor_vals, idx, t_axis]
    }





    /**
     * fetch rows containing a column value
     * @param {} kwargs {column: coumn name[string], operator: string, value: string| int} 
     */
    query(kwargs) {
        //define the set of operators to be used
        let operators = [
            ">",
            "<",
            "<=",
            ">=",
            "=="
        ]

        if (Object.prototype.hasOwnProperty.call(kwargs, "column")) {


            if (this.columns.includes(kwargs["column"])) {

                var column_index = this.columns.indexOf(kwargs["column"]);
            } else {
                throw new Error(`column ${kwargs["column"]} does not exist`);
            }
        } else {
            throw new Error("specify the column");
        }

        if (Object.prototype.hasOwnProperty.call(kwargs, "operator")) {

            if (operators.includes(kwargs["operator"])) {

                var operator = kwargs["operator"];
            }
            else {
                throw new Error(` ${kwargs["operator"]} is not identified`);
            }
        } else {
            throw new Error("specify operator");
        }

        if (Object.prototype.hasOwnProperty.call(kwargs, "value")) {
            var value = kwargs["value"]

        } else {
            throw new Error("specify value");
        }

        let data = this.values

        let new_data = []

        for (var i = 0; i < data.length; i++) {
            let data_value = data[i]

            let elem = data_value[column_index]

            //use eval function for easy operation
            //eval() takes in a string expression e.g eval('2>5')
            if (eval(`${elem}${operator}${value}`)) {
                new_data.push(data_value);
            }


        }
        let columns = this.columns
        let new_df = new DataFrame(new_data, { "columns": columns })

        return new_df;
    }


    /**
     * Add a column with values to the dataframe
     * @param {kwargs} Object keys[columns [string] and value[Array]]
     * 
     */
    addColumn(kwargs) {

        let data_length = this.shape[0]

        utils.__in_object(kwargs, "column", "column name not specified");
        utils.__in_object(kwargs, "value", "column value not specified");

        let value = kwargs["value"]
        let column_name = kwargs["column"]

        if (value.length != data_length) {
            throw new Error(`Array length ${value.length} not equal to ${data_length}`);
        }


        let data = this.values
        let new_data = []

        data.map(function (val, index) {
            let new_val = val.slice()
            new_val.push(value[index])
            new_data.push(new_val);
        });

        //add new dtype
        let old_type_list = [...this.dtypes]
        old_type_list.push(utils.__get_t(value)[0])
        this.col_types = old_type_list
        this.data = new_data;
        this.col_data = utils.__get_col_values(new_data)
        this.data_tensor = tf.tensor(new_data)
        this.columns.push(column_name);
    }

    /**
     * 
     * @param {col}  col is a list of column with maximum length of two
     */
    groupby(col) {

        let len = this.shape[0] - 1

        let column_names = this.column_names
        let col_dict = {};
        let key_column = null;

        if (col.length == 2) {

            if (column_names.includes(col[0])) {
                // eslint-disable-next-line no-unused-vars
                var [data1, col_name1] = this.__indexLoc({ "rows": [`0:${len}`], "columns": [`${col[0]}`], "type": "loc" });

            }
            else {
                throw new Error(`column ${col[0]} does not exist`);
            }
            if (column_names.includes(col[1])) {
                // eslint-disable-next-line no-unused-vars
                var [data2, col_name2] = this.__indexLoc({ "rows": [`0:${len}`], "columns": [`${col[1]}`], "type": "loc" });
            }
            else {
                throw new Error(`column ${col[1]} does not exist`);
            }

            key_column = [col[0], col[1]]
            var column_1_Unique = utils.__unique(data1);
            var column_2_unique = utils.__unique(data2);

            for (var i = 0; i < column_1_Unique.length; i++) {

                let col_value = column_1_Unique[i]
                col_dict[col_value] = {}

                for (var j = 0; j < column_2_unique.length; j++) {
                    let col2_value = column_2_unique[j];
                    col_dict[col_value][col2_value] = [];
                }
            }

        } else {

            if (column_names.includes(col[0])) {
                // eslint-disable-next-line no-redeclare
                var [data1, col_name1] = this.__indexLoc({ "rows": [`0:${len}`], "columns": [`${col[0]}`], "type": "loc" });
                // console.log(data1)
            }
            else {
                throw new Error(`column ${col[0]} does not exist`);
            }
            key_column = [col[0]];

            var column_Unique = utils.__unique(data1);

            for (let i = 0; i < column_Unique.length; i++) {
                let col_value = column_Unique[i];
                col_dict[col_value] = [];
            }
        }


        let groups = new GroupBy(col_dict, key_column, this.values, column_names).group();

        return groups;
    }




    /**
     * Return a sequence of axis dimension along row and columns
     * @params col_name: the name of a column in the database.
     * @returns tensor of shape 1
     */
    column(col_name) {
        if (!this.columns.includes(col_name)) {
            throw new Error(`column ${col_name} does not exist`);
        }
        let col_indx_objs = utils.__arr_to_obj(this.columns)
        let indx = col_indx_objs[col_name]
        let data = this.col_data[indx]
        return new Series(data, { columns: [col_name] })

    }

    // /**
    //  * generate a datetime from a column of date string
    //  * @param {kwargs} kwargs object {data: [array of string], format: String} 
    //  * @return DateTime data structure
    //  */
    // static to_datetime(kwargs){

    //     let timeseries = new TimeSeries(kwargs); // parsed to date-time
    //     timeseries.preprocessed() // generate date-time list

    //     return timeseries
    // }

    /**
     * Replace all nan value with a specific value
     * @param {*} nan_val 
     */
    fillna(nan_val) {

        let data = []
        let values = this.values;
        let columns = this.columns;

        for (let i = 0; i < values.length; i++) {
            let temp_data = []
            let row_value = values[i]
            for (let j = 0; j < row_value.length; j++) {

                let val = row_value[j] == 0 ? 0 : !!row_value[j]
                if (!val) {
                    temp_data.push(nan_val)
                } else {
                    temp_data.push(row_value[j])
                }

            }
            data.push(temp_data);
        }

        return new DataFrame(data, { columns: columns })
    }

    /**
     * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values,
     *  gets mapped to True values. Everything else gets mapped to False values. 
     * @return {DataFrame}
     */
    isna() {

        let data = []
        let values = this.values;
        let columns = this.columns;

        for (let i = 0; i < values.length; i++) {
            let temp_data = []
            let row_value = values[i]
            for (let j = 0; j < row_value.length; j++) {

                let val = row_value[j] == 0 ? 0 : !!row_value[j]
                temp_data.push(val)
            }
            data.push(temp_data);
        }

        return new DataFrame(data, { columns: columns })
    }


    /**
     * Obtain index containing nan values
     * @return Array list (int)
     */
    nanIndex() {

        let df_values = this.values
        let index_data = []

        for (let i = 0; i < df_values.length; i++) {

            let row_values = df_values[i]

            if (row_values.includes(NaN)) {
                index_data.push(i)
            }
        }
        return index_data
    }

    /**
     * Drop all rows containing NaN
     * @param {kwargs} kwargs [Object] {axis: [int]{o or 1}, inplace:[boolean]}
     */
    dropna(kwargs = {}) {

        let axis = kwargs["axis"] || 0;
        let inplace = kwargs["inplace"] || false;

        if (axis != 0 && axis != 1) {
            throw new Error("axis must either be 1 or 0")
        }

        let df_values = null
        let columns = null
        if (axis == 0) {
            df_values = this.values
            columns = this.columns
        }
        else {
            df_values = this.col_data
            columns = []
        }
        let data = []

        for (let i = 0; i < df_values.length; i++) {
            let values = df_values[i]

            if (!(values.includes(NaN))) {
                if (axis == 0) {
                    data.push(values);
                } else {

                    columns.push(this.columns[i])
                    if (data.length == 0) {

                        for (let j = 0; j < values.length; j++) {
                            data.push([values[j]])
                        }
                    } else {
                        for (let j = 0; j < data.length; j++) {
                            data[j].push(values[j])
                        }
                    }
                }

            }

        }

        if (inplace == true) {
            this.data = data
            this.__reset_index()
            this.columns = columns
        } else {
            return new DataFrame(data, { columns: columns })
        }

    }


    /**
     * Join two or more dataframe together base on their
     * axis
     * @param {*} kwargs { df_list: [Array of DataFrame], axis: int} 
     * @return dataframe object
     */
    static concat(kwargs) {

        // check if keys exist in kwargs
        utils.__in_object(kwargs, "df_list", "df_list not found: specify the list of dataframe")
        utils.__in_object(kwargs, "axis", "axis not found: specify the axis")

        let df_list = null; //set the df_list to null
        let axis = null; // set axis to null

        //check if df_list is an array
        if (Array.isArray(kwargs["df_list"])) {

            df_list = kwargs["df_list"];
        } else {
            throw new Error("df_list must be an Array of dataFrame");
        }

        //check if axis is int and is either 0 or 1
        if (typeof kwargs["axis"] === "number") {

            if (kwargs["axis"] == 0 || kwargs["axis"] == 1) {

                axis = kwargs["axis"];
            } else {
                throw new Error("Invalid axis: axis must be 0 or 1")
            }

        } else {
            throw new Error("axis must be a number")
        }


        let df_object = Object.assign({}, df_list); // convert the array to object

        if (axis == 1) {

            let columns = []
            let duplicate_col_count = {}
            let max_length = 0;

            for (let key in df_object) {

                let column = df_object[key].columns
                let length = df_object[key].values.length;

                if (length > max_length) {
                    max_length = length;
                }

                for (let index in column) {

                    let col_name = column[index]
                    if (col_name in duplicate_col_count) {

                        let count = duplicate_col_count[col_name]
                        let name = `${col_name}_${count + 1}`

                        columns.push(name);

                        duplicate_col_count[col_name] = count + 1
                    } else {

                        columns.push(col_name)
                        duplicate_col_count[col_name] = 1
                    }
                }


            }

            let data = new Array(max_length)

            for (let key in df_list) {

                let values = df_list[key].values

                for (let index = 0; index < values.length; index++) {

                    let val = values[index]
                    if (typeof data[index] === "undefined") {

                        data[index] = val;
                    } else {
                        data[index].push(...val);
                    }
                }

                if (values.length < max_length) {
                    let column_length = df_list[key].columns.length
                    let null_array = Array(column_length);

                    for (let col = 0; col < column_length; col++) {
                        null_array[col] = NaN
                    }

                    if (typeof data[max_length - 1] === "undefined") {
                        data[max_length - 1] = null_array
                    } else {
                        data[max_length - 1].push(...null_array);
                    }
                }
            }

            let df = new DataFrame(data, { columns: columns }); //convert to dataframe
            return df;
        }
        else {
            //concatenate base on axis 0 
            let columns = [];

            for (let key in df_list) {
                let column = df_list[key].columns
                columns.push(...column)
            }

            let column_set = new Set(columns)

            columns = Array.from(column_set);

            let data = []

            for (let key in df_list) {

                let value = df_list[key].values

                // let col_length = value[0].length

                let df_columns = df_list[key].columns

                let not_exist = []
                for (let col_index in columns) {
                    let col_name = columns[col_index]

                    let is_index = df_columns.indexOf(col_name)

                    if (is_index == -1) {
                        not_exist.push(col_name);
                    }
                }

                if (not_exist.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        let row_value = value[i]

                        let new_arr = Array(columns.length)
                        for (let j = 0; j < columns.length; j++) {

                            let col_name = columns[j]
                            if (not_exist.includes(col_name)) {

                                new_arr[j] = NaN
                            } else {
                                let index = df_columns.indexOf(col_name)
                                new_arr[j] = row_value[index]
                            }

                        }
                        data.push(new_arr);
                    }
                } else {
                    data.push(...value);
                }

            }

            let df = new DataFrame(data, { columns: columns });
            return df;

        }

    }


    /**
     * Merge two or more dataframe base on keys
     * @param {kwargs} keys: left, right, on, how
     */
    static merge(kwargs) {

        let merge = new Merge(kwargs)

        return merge
    }

    /**
     * manipulate dataframe element with apply
     * @param {kwargs} kargs is defined as {axis: 0 or 1, callable: [FUNCTION]}
     * @return Array
     */
    apply(kwargs) {
        let is_callable = utils.__is_function(kwargs["callable"]);

        if (!is_callable) {
            throw new Error("the arguement most be a function")
        }

        let callable = kwargs["callable"]

        let data = [];

        if (!(kwargs["axis"] == 0) && !(kwargs["axis"] == 1)) {
            throw new Error("axis must either be 0 or 1")
        }

        let axis = kwargs["axis"]

        if (axis == 1) {

            let df_data = this.values
            for (let i = 0; i < df_data.length; i++) {

                let row_value = tf.tensor(df_data[i])

                let callable_data = callable(row_value).arraySync()
                data.push(callable_data)

            }
        } else {

            let df_data = this.col_data
            for (let i = 0; i < df_data.length; i++) {

                let row_value = tf.tensor(df_data[i])

                let callable_data = callable(row_value).arraySync()
                data.push(callable_data)

            }
        }

        return data
    }



    // /**
    //  * Returns Less than of DataFrame and other. Supports element wise operations
    //  * @param {other} DataFrame, Series, Scalar 
    //  * @return {DataFrame}
    //  */
    // lt(other) {
    //     //
    // }



    //slice the corresponding arrays from tensor objects
    __get_df_from_tensor(val, col_names) {
        let len = val.shape[0]
        let new_array = []
        for (let i = 0; i < len; i++) {
            let arr = val.slice([i], [1]).arraySync()[0]
            new_array.push(arr)
        }
        return new DataFrame(new_array, { columns: col_names })

    }

    //checks if DataFrame is compaticble for arithmetic operation
    //compatible Dataframe must have only numerical dtypes
    __frame_is_compactible_for_operation() {
        let dtypes = this.dtypes
        const float = (element) => element == "float32";
        const int = (element) => element == "int32";

        if (dtypes.every(float)) {
            return true
        } else if (dtypes.every(int)) {
            return true
        } else {
            return false
        }
    }


    //retreives the corresponding tensors based on specified axis
    __get_ops_tensors(tensors, axis) {
        if (utils.__is_undefined(tensors[1].series)) { //check if add operation is on a series or DataFrame
            let tensors_arr = []
            if (utils.__is_undefined(axis) || axis == 1) {
                //axis = 1 (column)
                tensors_arr.push(tensors[0].row_data_tensor)
                tensors_arr.push(tensors[1])
                return tensors_arr

            } else {
                //axis = 0 (rows)
                tensors_arr.push(tensors[0].col_data_tensor)
                tensors_arr.push(tensors[1])
                return tensors_arr
            }
        } else {
            //operation is being performed on a Dataframe or Series
            let tensors_arr = []
            if (utils.__is_undefined(axis) || axis == 1) {
                //axis = 1 (column)
                let this_tensor, other_tensor

                this_tensor = tensors[0].row_data_tensor //tensorflow uses 1 for rows axis and 0 for column axis 
                if (tensors[1].series) {
                    other_tensor = tf.tensor(tensors[1].values, [1, tensors[1].values.length])
                } else {
                    other_tensor = tensors[1].row_data_tensor

                }

                tensors_arr.push(this_tensor)
                tensors_arr.push(other_tensor)
                return tensors_arr

            } else {
                //axis = 0 (rows)
                let this_tensor, other_tensor

                this_tensor = tensors[0].row_data_tensor
                if (tensors[1].series) {
                    other_tensor = tf.tensor(tensors[1].values, [tensors[1].values.length, 1])
                } else {
                    other_tensor = tensors[1].row_data_tensor

                }

                tensors_arr.push(this_tensor)
                tensors_arr.push(other_tensor)
                return tensors_arr
            }
        }
    }




}


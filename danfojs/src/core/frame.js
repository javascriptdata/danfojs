import Ndframe from "./generic"
import { Series } from "./series"
// import * as tf from '@tensorflow/tfjs-node'
import * as tf from '@tensorflow/tfjs'
import { Utils } from "./utils"
import { GroupBy } from "./groupby"
import { Plot } from '../plotting/plot'
import { indexLoc } from '../core/indexing'

const utils = new Utils
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
            Object.defineProperty(this, col_names[i], {
                get() {
                    return new Series(this.col_data[i], { columns: col_names[i], index: this.index })
                },
                set(value) {
                    this.addColumn({ column: col_names[i], value: value });
                }
            })
        });
    }

    /**
     * Drop a list of rows or columns base on the axis specified
     * @param {kwargs} Object (Optional configuration object
     *             {columns: [Array(Columns| Index)] array of column names to drop
     *              axis: row=0, columns=1
     *             inplace: specify whether to drop the row/column with/without creating a new DataFrame}
     * @returns null | DataFrame
     *            
     */
    drop(kwargs = {}) {
        let params_needed = ["columns", "index", "inplace", "axis"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}], got ${Object.keys(kwargs)}`)
        }
        // utils.__in_object(kwargs, "columns", "value not defined")
        if (!utils.__key_in_object(kwargs, "inplace")) {
            kwargs['inplace'] = false
        }
        if (!utils.__key_in_object(kwargs, "axis")) {
            kwargs['axis'] = 0
        }
        let data;
        if (utils.__key_in_object(kwargs, "index") && kwargs['axis'] == 0) {
            data = kwargs["index"];
        } else {
            data = kwargs["columns"];
        }


        if (kwargs['axis'] == 1) {
            let self = this;
            const index = data.map((x) => {
                let col_idx = self.columns.indexOf(x)
                if (col_idx == -1) {
                    throw new Error(`column "${x}" does not exist`)
                }
                return col_idx
            });
            const values = this.values
            let new_dtype = []
            let new_data = values.map(function (element) {
                let new_arr = utils.__remove_arr(element, index);
                new_dtype = utils.__remove_arr(self.dtypes, index);
                return new_arr;
            });

            if (!kwargs['inplace']) {
                let columns = utils.__remove_arr(this.columns, index);
                return new DataFrame(new_data, { columns: columns, index: self.index, dtypes: new_dtype})
            } else {
                this.columns = utils.__remove_arr(this.columns, index);
                this.row_data_tensor = tf.tensor(new_data);
                this.data = new_data
                this.__set_col_types(new_dtype, false)
            }

        } else {
            data.map((x) => {
                if (!this.index.includes(x)) throw new Error(`${x} does not exist in index`)
            });
            const values = this.values

            let new_data = utils.__remove_arr(values, data);
            let new_index = utils.__remove_arr(this.index, data);

            if (!kwargs['inplace']) {
                return new DataFrame(new_data, { columns: this.columns, index: new_index })
            } else {
                this.row_data_tensor = tf.tensor(new_data);
                this.data = new_data
                this.__set_index(new_index)
            }
        }
    }



    /**
     * Purely label based indexing. Can accept string label names for both rows and columns 
     * @param {kwargs} kwargs object {rows: Array of index, columns: Array of column name(s)} 
     * @return DataFrame data stucture
     */
    loc(kwargs = {}) {
        let params_needed = ["columns", "rows"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}], got ${Object.keys(kwargs)}`)
        }
        kwargs["type"] = "loc"
        let [new_data, columns, rows] = indexLoc(this, kwargs);
        let df_columns = { "columns": columns }
        let df = new DataFrame(new_data, df_columns);
        df.__set_index(rows)
        return df;

    }


    /**
     * Access a dataframe element using row and column index
     * @param {*} kwargs object {rows: Array of index, columns: Array of column index}  
     * @return DataFrame data stucture
     */
    iloc(kwargs = {}) {
        let params_needed = ["columns", "rows"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}], got ${Object.keys(kwargs)}`)
        }
        kwargs["type"] = "iloc";

        let [new_data, columns, rows] = indexLoc(this, kwargs);
        let df_columns = { "columns": columns }
        let df = new DataFrame(new_data, df_columns);
        df.__set_index(rows)
        return df;

    }


    /**
    * Prints the first n values in a dataframe
    * @param {rows}  rows --> int
    * @returns DataFrame
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
    * @param {rows}  rows --> int
    * @returns DataFrame
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
    * @param {rows}  rows --> int
    * @returns DataFrame 
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
     * Perform Cummulative operations
     * @param {axis} axis [int] {0 or 1} 
     * @param {ops} ops {String} name of operation
     * @return {DataFrame}
     */
    __cum_ops(axis = 0, ops) {

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
     * calculate the cummulative sum along axis
     * @param {kwargs} {axis: [int]}
     * @returns {DataFrame}
     */
    cumsum(kwargs = {}) {
        let axis;
        if (!utils.__key_in_object(kwargs, "axis")) {
            axis = 0
        } else {
            axis = kwargs['axis']
        }
        // let axis = kwargs["axis"] || 0
        let data = this.__cum_ops(axis, "sum");
        return data
    }

    /**
     * calculate the cummulative min
     * @param {kwargs} {axis: [int]}
     * @returns {DataFrame}
     */
    cummin(kwargs = {}) {
        let axis;
        if (!utils.__key_in_object(kwargs, "axis")) {
            axis = 0
        } else {
            axis = kwargs['axis']
        } let data = this.__cum_ops(axis, "min");
        return data
    }

    /**
     * calculate the cummulative max
     * @param {kwargs} {axis: [int]}
     * @returns {DataFrame}
     */
    cummax(kwargs = {}) {
        let axis;
        if (!utils.__key_in_object(kwargs, "axis")) {
            axis = 0
        } else {
            axis = kwargs['axis']
        } let data = this.__cum_ops(axis, "max");
        return data
    }

    /**
     * calculate the cummulative prod
     * @param {kwargs} {axis: [int]}
     * @returns {DataFrame}
     */
    cumprod(kwargs = {}) {
        let axis;
        if (!utils.__key_in_object(kwargs, "axis")) {
            axis = 0
        } else {
            axis = kwargs['axis']
        } let data = this.__cum_ops(axis, "prod");
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
   * @param {kwargs} {inplace: Modify the Series in place (do not create a new object.}
   */
    reset_index(kwargs = {}) {
        if (!utils.__key_in_object(kwargs, 'inplace')) {
            kwargs['inplace'] = false
        }

        if (kwargs['inplace']) {
            this.__reset_index()
        } else {
            let df = this.copy()
            df.__reset_index()
            return df
        }
    }

    /**
    * Generate a new DataFrame with the specified index.
    * Set the DataFrame index (row labels) using an array of the same length.
    * @param {kwargs} {index: Array of new index values}
    */
    set_index(kwargs = {}) {

        let params_needed = ["key", "drop", "inplace"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}], got ${Object.keys(kwargs)}`)
        }

        if (!utils.__key_in_object(kwargs, 'key')) {
            throw Error("Index ValueError: You must specify an array of index")
        }

        if (!utils.__key_in_object(kwargs, 'inplace')) {
            kwargs['inplace'] = false
        }

        if (!utils.__key_in_object(kwargs, 'drop')) {
            kwargs['drop'] = true
        }

        if (Array.isArray(kwargs['key']) && kwargs['key'].length != this.index.length) {
            throw Error(`Index LengthError: Lenght of new Index array ${kwargs['key'].length} must match lenght of existing index ${this.index.length}`)
        }

        if ((typeof kwargs['key'] == "string" && this.column_names.includes(kwargs['key']))) {
            kwargs['key_name'] = kwargs['key']
            kwargs['key'] = this[kwargs['key']].values
        }
        if (kwargs['inplace']) {
            // this.index_arr = kwargs['key']
            this.__set_index(kwargs['key'])
            if (kwargs['drop'] && typeof kwargs['key_name'] == 'string') {
                this.drop({ columns: [kwargs['key_name']], inplace: true, axis: 1 })
            }
        } else {
            let df = this.copy()
            df.__set_index(kwargs['key'])
            if (kwargs['drop'] && typeof kwargs['key_name'] == 'string') {
                df.drop({ columns: [kwargs['key_name']], axis: 1, inplace: true })
            }
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


    /**
    * Return the sum of the values in a DataFrame across a specified axis.
    * @params {kwargs} {axis: 0 for row and 1 for column}
    * @returns {Series}, Sum of values accross axis
    */
    sum(kwargs = { axis: 1 }) {
        if (this.__frame_is_compactible_for_operation()) {
            let values;
            let val_sums = []
            if (kwargs['axis'] == 1) {
                values = this.col_data
            } else {
                values = this.values
            }

            values.map(arr => {
                let temp_sum = tf.tensor(arr).sum().arraySync()
                val_sums.push(Number(temp_sum.toFixed(5)))
            })

            let new_index;
            if (kwargs['axis'] == 1) {
                new_index = this.column_names
            } else {
                new_index = this.index
            }
            let sf = new Series(val_sums, { columns: "sum", index: new_index })
            return sf

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }
    }

    /**
    * Returns the absolute values in DataFrame
    * @return {DataFrame}
    */
    abs() {
        let data = this.values

        let tensor_data = tf.tensor(data)
        let abs_data = tensor_data.abs().arraySync()
        let df = new DataFrame(utils.__round(abs_data, 2, false), { columns: this.column_names, index: this.index })
        return df
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
     * Filter DataFrame element base on the element in a column
     * @param {kwargs} kwargs {column : coumn name[string], is: String, to: string| int} 
     * @returns {DataFrame}
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

        if (Object.prototype.hasOwnProperty.call(kwargs, "is")) {

            if (operators.includes(kwargs["is"])) {

                var operator = kwargs["is"];
            }
            else {
                throw new Error(` ${kwargs["is"]} is not a supported logical operator`);
            }
        } else {
            throw new Error("specify an operator in param [is]");
        }

        if (Object.prototype.hasOwnProperty.call(kwargs, "to")) {
            var value = kwargs["to"]

        } else {
            throw new Error("specify a value in param [to]");
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
     * @param {kwargs} Object {column :[string] , value:[Array]}
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


        if (this.columns.includes(column_name)) {

            let col_idx = this.columns.indexOf(column_name);

            let new_data = []
            this.values.map((val, index) => {
                let new_val = val.slice();
                new_val[col_idx] = value[index]
                new_data.push(new_val);
            })
            this.data = new_data;
            // console.log(this.data)
            this.col_data[col_idx] = value
            // this.col_data[col_idx] = utils.__get_t(value)[0]
            this.data_tensor = tf.tensor(new_data)


        } else {
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
            this[column_name] = new Series(value)
            // this[column_name] = new Series(value, { columns: column_name, index: this.index })
        }
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
                var [data1, col_name1] = indexLoc(this, { "rows": [`0:${len}`], "columns": [`${col[0]}`], "type": "loc" });

            }
            else {
                throw new Error(`column ${col[0]} does not exist`);
            }
            if (column_names.includes(col[1])) {
                // eslint-disable-next-line no-unused-vars
                var [data2, col_name2] = indexLoc(this, { "rows": [`0:${len}`], "columns": [`${col[1]}`], "type": "loc" });
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
                var [data1, col_name1] = indexLoc(this, { "rows": [`0:${len}`], "columns": [`${col[0]}`], "type": "loc" });
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


    /**
    * Replace NaN or undefined with a specified value"
    * @param {kwargs}, {column(s): Array of column name(s) to fill. If undefined fill all columns;
    *                   value(s): Array | Scalar of value(s) to fill with. If single value is specified, we use it to fill all
    * @return {DataFrame}
    */
    fillna(kwargs = {}) {

        let params_needed = ["columns", "values"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}], got ${Object.keys(kwargs)}`)
        }

        if (utils.__key_in_object(kwargs, "columns")) {
            //check if the column(s) exists
            kwargs['columns'].map(col => {
                if (!this.column_names.includes(col)) {
                    throw Error(`Value Error: Specified columns must be one of ${this.column_names}, got ${col}`)
                }
            })

            if (kwargs['columns'].length != kwargs['values'].length) {
                throw Error(`Lenght Error: The lenght of the columns names must be equal to the lenght of the values,
                 got column of length ${kwargs['columns'].length} but values of length ${kwargs['values'].length}`)
            }
            let new_col_data = this.col_data
            kwargs['columns'].map((col, i) => {
                let col_idx = this.column_names.indexOf(col)
                let col_data = this.col_data[col_idx]

                let __temp = []
                col_data.map(val => {     //fill the column
                    if (isNaN(val) && typeof val != "string") {
                        __temp.push(kwargs['values'][i])

                    } else {
                        __temp.push(val)
                    }
                })
                new_col_data[col_idx] = __temp

            })

            let final_data = []
            new_col_data.map((col, i) => {
                let col_obj = {}
                col_obj[this.column_names[i]] = col
                final_data.push(col_obj)
            })
            // let fil_idx = 0
            // this.column_names.map((col, idx) => {
            //     let _obj = {}
            //     if (kwargs['columns'].includes(col)) {
            //         console.log(fil_idx);
            //         console.log(col);
            //         console.log(kwargs['values'][fil_idx]);
            //         let temp_col_data = this.col_data[idx]  //retreive the column data
            //         let __temp = []
            //         temp_col_data.map(val => {     //fill the column
            //             if (isNaN(val) && typeof val != "string") {
            //                 __temp.push(kwargs['values'][fil_idx])

            //             } else {
            //                 __temp.push(val)
            //             }
            //         })
            //         fil_idx += 1
            //         _obj[col] = __temp
            //         new_col_data_obj.push(_obj)
            //     } else {
            //         _obj[col] = this.col_data[idx]
            //         new_col_data_obj.push(_obj)
            //     }

            // })
            return new DataFrame(final_data, { index: this.index })

        } else {
            //fill all columns using same value
            if (!utils.__key_in_object(kwargs, "values")) {
                throw Error("Value Error: Please specify a fill value")
            }

            let nan_val;
            if (Array.isArray(kwargs['values'])) {
                nan_val = kwargs['values'][0]
            } else {
                nan_val = kwargs["values"]

            }
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

            return new DataFrame(data, { columns: columns, index: this.index })

        }

    }

    /**
     * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values,
     *  gets mapped to True values. Everything else gets mapped to False values. 
     * @return {DataFrame}
     */
    isna() {

        let new_row_data = []
        let row_data = this.values;
        let columns = this.column_names;

        row_data.map(arr => {
            let temp_arr = []
            arr.map(val => {
                // eslint-disable-next-line use-isnan
                if (val == NaN) {
                    temp_arr.push(true)
                } else if (isNaN(val) && typeof val != "string") {
                    temp_arr.push(true)
                } else {
                    temp_arr.push(false)
                }
            })
            new_row_data.push(temp_arr)
        })

        return new DataFrame(new_row_data, { columns: columns, index: this.index })
    }



    // let new_row_data = []
    // let row_data = this.values;
    // let columns = this.column_names;

    // row_data.map(arr=>{
    //     let temp_arr = []
    //     arr.map(val=>{
    //         if (isNaN(val) && typeof val != "string" ){
    //             temp_arr.push(true)
    //         }else{
    //             temp_arr.push(false)
    //         }
    //     })
    //     new_row_data.push(temp_arr)
    // })

    // // for (let i = 0; i < values.length; i++) {
    // //     let temp_data = []
    // //     let row_value = values[i]
    // //     for (let j = 0; j < row_value.length; j++) {

    // //         let val = row_value[j] == 0 ? true : !row_value[j]
    // //         temp_data.push(val)
    // //     }
    // //     data.push(temp_data);
    // // }

    // return new DataFrame(new_row_data, { columns: columns, index: this.index })


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
     * Apply a function to each element or along a specified axis of the DataFrame. Supports JavaScipt functions
     * when axis is not specified, and accepts Tensorflow functions when axis is specified.
     * @param {kwargs} kargs is defined as {axis: undefined, 0 or 1, callable: [FUNCTION]}
     * @return Array
     */
    apply(kwargs) {
        let is_callable = utils.__is_function(kwargs["callable"]);
        if (!is_callable) {
            throw new Error("the arguement most be a function")
        }

        let callable = kwargs["callable"]
        let data = [];


        if (utils.__key_in_object(kwargs, "axis")) {
            //This accepts all tensorflow operations
            let axis = kwargs["axis"]
            let df_data;
            if (axis == 0) {
                df_data = this.values
            } else {
                df_data = this.col_data
            }

            for (let i = 0; i < df_data.length; i++) {
                let value = tf.tensor(df_data[i])
                let callable_data
                try {
                    callable_data = callable(value).arraySync()
                } catch (error) {
                    throw Error(`Callable Error: You can only apply JavaScript functions on DataFrames when axis is not specified. This operation is applied on all element, and returns a DataFrame of the same shape.`)
                }

                data.push(callable_data)
            }


        } else {
            //perform element wise operation. This accepts any JavaScript function
            let df_data = this.values
            let new_data = []
            df_data.forEach(row => {
                let new_row = []
                row.forEach(val => {
                    new_row.push(callable(val))
                })
                new_data.push(new_row)
            })
            data = new_data

        }

        if (utils.__is_1D_array(data)) {
            if (kwargs['axis'] == 0) {
                let sf = new Series(data, { index: this.index })
                return sf
            } else {
                let sf = new Series(data, { index: this.column_names })
                return sf
            }
        } else {
            let df = new DataFrame(data, { columns: this.column_names, index: this.index })
            return df

        }

    }




    /**
     * Returns Less than of DataFrame and other. Supports element wise operations
     * @param {other} DataFrame, Series, Scalar 
     * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
     * @return {DataFrame}
     */
    lt(other, axis) {
        if (this.__frame_is_compactible_for_operation()) {
            if (axis == undefined) {
                axis = 0
            }
            let df = this.__logical_ops(other, "lt", axis)
            return df

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }

    }

    /**
    * Returns Greater than of DataFrame and other. Supports element wise operations
    * @param {other} DataFrame, Series, Scalar 
    * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
    * @return {DataFrame}
    */
    gt(other, axis) {
        if (this.__frame_is_compactible_for_operation()) {
            if (axis == undefined) {
                axis = 0
            }

            let df = this.__logical_ops(other, "gt", axis)
            return df

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }

    }

    /**
    * Returns Less than or Equal to of DataFrame and other. Supports element wise operations
    * @param {other} DataFrame, Series, Scalar 
    * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
    * @return {DataFrame}
    */
    le(other, axis) {
        if (this.__frame_is_compactible_for_operation()) {
            if (axis == undefined) {
                axis = 0
            }
            let df = this.__logical_ops(other, "le", axis)
            return df

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }
    }

    /**
    * Returns Greater than or Equal to of DataFrame and other. Supports element wise operations
    * @param {other} DataFrame, Series, Scalar 
    * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
    * @return {DataFrame}
    */
    ge(other, axis) {
        if (this.__frame_is_compactible_for_operation()) {
            if (axis == undefined) {
                axis = 0
            }
            let df = this.__logical_ops(other, "ge", axis)
            return df

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }

    }

    /**
    * Returns Not Equal to of DataFrame and other. Supports element wise operations
    * @param {other} DataFrame, Series, Scalar 
    * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
    * @return {DataFrame}
    */
    ne(other, axis) {
        if (this.__frame_is_compactible_for_operation()) {
            if (axis == undefined) {
                axis = 0
            }
            let df = this.__logical_ops(other, "ne", axis)
            return df

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }

    }

    /**
    * Returns Greater than or Equal to of DataFrame and other. Supports element wise operations
    * @param {other} DataFrame, Series, Scalar 
    * @param {axis} Number {0 for row, 1 for index} Whether to compare by the index or columns
    * @return {DataFrame}
    */
    eq(other, axis) {
        if (this.__frame_is_compactible_for_operation()) {
            if (axis == undefined) {
                axis = 0
            }
            let df = this.__logical_ops(other, "eq", axis)
            return df

        } else {
            throw Error("Dtype Error: Operation can not be performed on string type")
        }

    }


    /**
    * Replace all occurence of a value with a new specified value"
    * @param {kwargs}, {"replace": the value you want to replace,
    *                   "with": the new value you want to replace the olde value with
    *                   "in": Array of column names to replace value in, If not specified, replace all columns} 
    * @return {Series}
    */
    replace(kwargs = {}) {
        let params_needed = ["replace", "with", "in"]
        if (!utils.__right_params_are_passed(kwargs, params_needed)) {
            throw Error(`Params Error: A specified parameter is not supported. Your params must be any of the following [${params_needed}], got ${Object.keys(kwargs)}`)
        }

        if (utils.__key_in_object(kwargs, "in")) {
            //fill specified columns only
            //check if the column(s) exists
            kwargs['in'].map(col => {
                if (!this.column_names.includes(col)) {
                    throw Error(`Value Error: Specified columns must be one of ${this.column_names}, got ${col}`)
                }
            })

            if (utils.__key_in_object(kwargs, "replace") && utils.__key_in_object(kwargs, "with")) {
                let new_col_data_obj = []
                this.column_names.map((col, idx) => {
                    let _obj = {}
                    if (kwargs['in'].includes(col)) {
                        let temp_col_data = this.col_data[idx]  //retreive the column data
                        let __temp = []
                        temp_col_data.map(val => {     //replace the values
                            if (val == kwargs['replace']) {
                                __temp.push(kwargs['with'])
                            } else {
                                __temp.push(val)
                            }
                        })
                        _obj[col] = __temp
                        new_col_data_obj.push(_obj)
                    } else {
                        _obj[col] = this.col_data[idx]
                        new_col_data_obj.push(_obj)
                    }
                })
                return new DataFrame(new_col_data_obj, { columns: this.column_names, index: this.index })
            } else {

                throw Error("Params Error: Must specify both 'replace' and 'with' parameters.")

            }

        } else {
            //fill every occurence in all columns and rows
            if (utils.__key_in_object(kwargs, "replace") && utils.__key_in_object(kwargs, "with")) {
                let replaced_arr = []
                let old_arr = this.values

                old_arr.map(inner_arr => {
                    let temp = []
                    inner_arr.map(val => {
                        if (val == kwargs['replace']) {
                            temp.push(kwargs['with'])
                        } else {
                            temp.push(val)
                        }
                    })
                    replaced_arr.push(temp)
                })

                let df = new DataFrame(replaced_arr, { index: this.index, columns: this.column_names })
                return df


            } else {
                throw Error("Params Error: Must specify both 'replace' and 'with' parameters.")
            }
        }
    }


    //performs logical comparisons on DataFrame using Tensorflow.js
    __logical_ops(val, logical_type, axis) {
        let int_vals, other;
        if (utils.__is_number(val)) {
            other = val
        } else {
            if (val.series) {
                //series
                if (axis == 0) {
                    if (val.values.length != this.shape[0]) {
                        throw Error(`Shape Error: Operands could not be broadcast together with shapes ${this.shape} and ${val.values.length}.`)
                    }
                    other = tf.tensor(val.values)
                } else {
                    if (val.values.length != this.shape[1]) {
                        throw Error(`Shape Error: Operands could not be broadcast together with shapes ${this.shape} and ${val.values.length}.`)
                    }
                    other = tf.tensor(val.values)
                }
            } else if (Array.isArray(val)) {
                //Array of Array
                other = tf.tensor(val)
            } else {
                //DataFrame
                other = val.row_data_tensor
            }
        }

        switch (logical_type) {

            case "lt":
                int_vals = tf.tensor(this.values).less(other).arraySync()
                break;
            case "gt":
                int_vals = tf.tensor(this.values).greater(other).arraySync()
                break;
            case "le":
                int_vals = tf.tensor(this.values).lessEqual(other).arraySync()
                break;
            case "ge":
                int_vals = tf.tensor(this.values).greaterEqual(other).arraySync()
                break;
            case "ne":
                int_vals = tf.tensor(this.values).notEqual(other).arraySync()
                break;
            case "eq":
                int_vals = tf.tensor(this.values).equal(other).arraySync()
                break;
        }
        let bool_vals = utils.__map_int_to_bool(int_vals, 2)
        let df = new DataFrame(bool_vals, { columns: this.column_names, index: this.index })
        return df

    }



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
        const str = (element) => element == "string";

        if (dtypes.some(str)) {
            return false
        } else {
            return true
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

    /**
     * Transpose index and columns.
    * Reflect the DataFrame over its main diagonal by writing rows as columns and vice-versa.
    * The property T is an accessor to the method transpose().
     */
    transpose() {
        let new_values = this.col_data
        let new_index = this.column_names
        let new_col_names = this.index

        let df = new DataFrame(new_values, { columns: new_col_names, index: new_index })
        return df
    }

    /**
     * The property T is an accessor to the method transpose().
     */
    get T() {
        return this.transpose()
    }


    /**
        * Returns the data types in the DataFrame 
        * @return {Array} list of data types for each column
        */
    get ctypes() {
        let cols = this.column_names
        let d_types = this.col_types
        let sf = new Series(d_types, { index: cols })
        return sf
    }

    /**
     * Make plots of Series or DataFrame.
     * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
     * @param {string} div Name of the div to show the plot
     * @param {Object} config configuration options for making Plots, supports Plotly parameters
     */
    plot(div, config = {}) {
        const plt = new Plot()
        plt.plot(this, div, config)
    }


    /**
     * Returns the Tensorflow tensor backing the DataFrame Object
     * @returns {2D tensor}
     */
    get tensor() {
        return this.row_data_tensor
    }


    /**
     * Sets the data types of an DataFrame 
     * @param {Object} kwargs {column: Name of the column to cast, dtype: [float32, int32, string] data type to cast to}
     * @returns {DataFrame}
     */
    astype(kwargs = {}) {
        if (!utils.__key_in_object(kwargs, "column")) {
            throw Error("Value Error: Please specify a column to cast")
        }

        if (!utils.__key_in_object(kwargs, "dtype")) {
            throw Error("Value Error: Please specify dtype to cast to")
        }


        if (!this.column_names.includes(kwargs['column'])) {
            throw Error(`'${kwargs['column']}' not found in columns`)
        }

        let col_idx = this.column_names.indexOf(kwargs['column'])
        let new_types = this.col_types
        let col_values = this.col_data

        new_types[col_idx] = kwargs['dtype']
        let new_col_values = []
        let temp_col = col_values[col_idx]


        switch (kwargs['dtype']) {
            case "float32":
                temp_col.map(val => {
                    new_col_values.push(Number(val))
                })
                col_values[col_idx] = new_col_values
                break;
            case "int32":
                temp_col.map(val => {
                    new_col_values.push(Number(Number(val).toFixed()))
                })
                col_values[col_idx] = new_col_values

                break;
            case "string":
                temp_col.map(val => {
                    new_col_values.push(String(val))
                })
                col_values[col_idx] = new_col_values
                break;
            default:
                break;
        }

        let new_col_obj = []
        this.column_names.forEach((cname, i) => {
            let _obj = {}
            _obj[cname] = col_values[i]
            new_col_obj.push(_obj)
        })

        let df = new DataFrame(new_col_obj, { dtypes: new_types, index: this.index })
        return df

    }

    /**
    * Return the unique values along an axis
    * @param {axis} Int, 0 for row, and 1 for column. Default to 1
    * @return {Object}
    */
    unique(axis = 1) {
        if (axis == undefined || axis > 1 || axis < 0) {
            throw Error(`Axis Error: Please specify a correct axis. Axis must either be '0' or '1', got ${axis}`)
        }
        let _unique = {}
        if (axis == 1) {
            //column
            let col_names = this.column_names
            col_names.forEach(cname => {
                _unique[cname] = this[cname].unique().values
            })

        } else {
            let rows = this.values
            let _index = this.index
            rows.forEach((row, i) => {
                let data_set = new Set(row)
                _unique[_index[i]] = Array.from(data_set)
            })
        }

        return _unique

    }

    /**
     * Return the number of unique value along an axis
     * @param {axis} Int, 0 for row, and 1 for column. Default to 1
     * @return {Series}
     */
    nunique(axis = 1) {
        if (axis == undefined || axis > 1 || axis < 0) {
            throw Error(`Axis Error: Please specify a correct axis. Axis must either be '0' or '1', got ${axis}`)
        }

        let _nunique = []
        if (axis == 1) {
            //column
            let col_names = this.column_names
            col_names.forEach(cname => {
                _nunique.push(this[cname].unique().values.length)
            })
            let sf = new Series(_nunique, { index: this.column_names })
            return sf

        } else {
            let rows = this.values
            rows.forEach(row => {
                let data_set = new Set(row)
                _nunique.push(Array.from(data_set).length)
            })

        } let sf = new Series(_nunique, { index: this.index })
        return sf

    }



}


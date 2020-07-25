import Ndframe from "./generic"
import {Series} from "./series"
import * as tf from '@tensorflow/tfjs-node'
import { Utils } from "./utils"
import {GroupBy} from "./groupby"
// import {TimeSeries} from "./timeseries"
import {Merge} from "./merge"

const utils = new Utils
// const config = new Configs()


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

                if(kwargs["rows"].length ==1 && typeof kwargs["rows"][0] == "string"){
                    //console.log("here", kwargs["rows"].length)
                    if(kwargs["rows"][0].includes(":")){
                        
                        let row_split = kwargs["rows"][0].split(":")

                        let start   = parseInt(row_split[0]) || 0;
                        let end     = parseInt(row_split[1]) || (this.values.length-1);

                        if(typeof start == "number" && typeof end == "number"){
                            rows = utils.__range(start,end);
                        }
                        
                    }else{
                        throw new Error("numbers in string must be separated by ':'")
                    }
                }else{
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
                if(kwargs["columns"].length ==1 && kwargs["columns"][0].includes(":")){
                        
                        let row_split = kwargs["columns"][0].split(":")
                        let start, end;

                        if(kwargs["type"] =="iloc" || (row_split[0] == "")){
                            start   = parseInt(row_split[0]) || 0;
                            end     = parseInt(row_split[1]) || (this.values[0].length -1);
                        }else{
                            
                            start = parseInt(this.columns.indexOf(row_split[0]));
                            end   = parseInt(this.columns.indexOf(row_split[1]));
                        }
                        

                        if(typeof start == "number" && typeof end == "number"){
                            
                            columns = utils.__range(start,end);
                            isColumnSplit = true;
                        }
                        
                }else{
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
                throw new Error(`row index ${row_val} is bigger than ${max_rowIndex}`);
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
        if(kwargs["type"] == "iloc" || isColumnSplit){
            // let axes = this.axes
            columns.map((col) => {
                column_names.push(this.columns[col]);
            })
        }else{
            column_names = columns
        }

        return [new_data, column_names,rows];
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
            let config = { columns: this.column_names }
            let data = this.values.slice(0, rows)
            return new DataFrame(data, config)
        }

    }

    /**
    * Prints the last n values in a dataframe
    * @param {rows}  
    */
    tail(rows = 5) {
        if (rows > this.values.length || rows < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            //Creates a new dataframe with last [rows]
            let data = this.values.slice(this.values.length - rows)
            let indx = this.index.slice(this.values.length - rows)
            let config = { columns: this.column_names }
            let df = new DataFrame(data, config)
            df.__set_index(indx)
            return df
        }

    }

    /**
    * Gets [num] number of random rows in a dataframe
    * @param {rows}  
    */
    sample(num = 1) {
        if (num > this.values.length || num < 1) {
            //return all values
            let config = { columns: this.column_names }
            return new DataFrame(this.values, config)
        } else {
            //Creates a new dataframe with last [rows]
            let config = { columns: this.column_names }
            let sampled_arr = utils.__sample_from_iter(this.values, num)
            return new DataFrame(sampled_arr, config)

        }
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

    // __inObject(object, key, message) {

    //     if (!Object.prototype.hasOwnProperty.call(object, key)) {
    //         throw new Error(message);
    //     }
    // }


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
        return new Series(data,{columns: [col_name]})

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

    // /**
    //  * check if each row,col contains NaN
    //  * @return Array list (bool)
    //  */
    // isnan() { }


    // /**
    //  * Obtain index containing nan values
    //  * @return Array list (int)
    //  */
    // nanIndex() { }


    /**
     * Join two or more dataframe together base on their
     * axis
     * @param {*} kwargs { df_list: [Array of DataFrame], axis: int} 
     * @return dataframe object
     */
    static concat(kwargs) {

        // check if keys exist in kwargs
        utils.__in_object(kwargs,"df_list","df_list not found: specify the list of dataframe")
        utils.__in_object(kwargs,"axis","axis not found: specify the axis")

        let df_list =null; //set the df_list to null
        let axis = null; // set axis to null

        //check if df_list is an array
        if(Array.isArray(kwargs["df_list"])){

            df_list = kwargs["df_list"];
        }else{
            throw new Error("df_list must be an Array of dataFrame");
        }

        //check if axis is int and is either 0 or 1
        if(typeof kwargs["axis"] === "number"){

            if(kwargs["axis"]==0 || kwargs["axis"]==1){

                axis = kwargs["axis"];
            }else{
                throw new Error("Invalid axis: axis must be 0 or 1")
            }

        }else{
            throw new Error("axis must be a number")
        }


        let df_object = Object.assign({}, df_list); // convert the array to object

        if(axis==1){

            let columns = []
            let duplicate_col_count = {}
            let max_length = 0;

            for(let key in df_object){
                
                let column = df_object[key].columns
                let length = df_object[key].values.length;

                if(length > max_length){
                    max_length = length;
                }

                for(let index in column){

                    let col_name = column[index]
                    if(col_name in duplicate_col_count){

                        let count = duplicate_col_count[col_name]
                        let name = `${col_name}_${count+1}`

                        columns.push(name);

                        duplicate_col_count[col_name]  = count +1
                    }else{

                        columns.push(col_name)
                        duplicate_col_count[col_name] = 1
                    }
                }
                

            }
            
            let data = new Array(max_length)
            
            for(let key in df_list){

                let values = df_list[key].values

                for(let index=0; index< values.length;index++){

                    let val = values[index]
                    if(typeof data[index] === "undefined"){

                        data[index] = val;
                    }else{
                        data[index].push(...val);
                    }
                }

                if(values.length < max_length){
                    let column_length = df_list[key].columns.length 
                    let null_array = Array(column_length);
                    
                    for(let col=0;col < column_length;col++){
                        null_array[col] = "NaN"
                    }
                    
                    if(typeof data[max_length-1] === "undefined"){
                        data[max_length -1] = null_array
                    }else{
                        data[max_length -1].push(...null_array);
                    }
                }
            }
            
            let df = new DataFrame(data,{columns:columns}); //convert to dataframe
            return df;
        }
        else{
            //concatenate base on axis 0 
            let columns = [];

            for(let key in df_list){
                let column = df_list[key].columns
                columns.push(...column)
            }

            let column_set = new Set(columns)

            columns = Array.from(column_set);

            let data = []

            for(let key in df_list){

                let value = df_list[key].values

                // let col_length = value[0].length

                let df_columns = df_list[key].columns
                    
                let not_exist = []
                for(let col_index in columns){
                    let col_name = columns[col_index]

                    let is_index = df_columns.indexOf(col_name)

                    if(is_index == -1){
                        not_exist.push(col_name);
                    }
                }

                if(not_exist.length > 0){
                    for(let i=0;i<value.length;i++){
                        let row_value = value[i]
                        
                        let new_arr = Array(columns.length)
                        for(let j=0; j < columns.length; j++){

                            let col_name = columns[j]
                            if(not_exist.includes(col_name)){
                                
                                new_arr[j] = "NaN"
                            }else{
                                let index = df_columns.indexOf(col_name)
                                new_arr[j] = row_value[index]
                            }
                            
                        }
                        data.push(new_arr);
                    }
                }else{
                    data.push(...value);
                }
                
            }

            let df = new DataFrame(data,{columns:columns});
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
    apply(kwargs){
        let is_callable = utils.__is_function(kwargs["callable"]);

        if (!is_callable) {
            throw new Error("the arguement most be a function")
        }

        let callable = kwargs["callable"]

        let data = [];

        if(!(kwargs["axis"]==0) && !(kwargs["axis"]==1)){
            throw new Error("axis must either be 0 or 1")
        }

        let axis = kwargs["axis"]

        if(axis==1){

            let df_data = this.values
            for(let i=0; i < df_data.length; i++ ){

                let row_value = tf.tensor(df_data[i])

                let callable_data = callable(row_value).arraySync()
                data.push(callable_data)

            }
        }else{

            let df_data = this.col_data
            for(let i=0; i < df_data.length; i++ ){

                let row_value = tf.tensor(df_data[i])

                let callable_data = callable(row_value).arraySync()
                data.push(callable_data)

            }
        }
        
        return data
    }

    // /**
    //  * create a one-hot encoder
    //  * @param {*} series a dataframe column
    //  * @return DataFrame
    //  */
    // static dummy(series) { }

}


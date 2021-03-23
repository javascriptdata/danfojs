import { DataFrame } from "./frame";
import { Utils } from "./utils";
import { Series } from "./series";
const utils = new Utils;

/**
 * The class performs all groupby operation on a dataframe
 * involveing all aggregate funciton
 * @param {col_dict} col_dict Object of unique keys in the group by column
 * @param {key_col} key_col Array contains the column names
 * @param {data} Array the dataframe data
 * @param {column_name} Array of all column name in the dataframe.
 */
export class GroupBy {
  constructor(col_dict, key_col, data, column_name) {

    this.key_col = key_col;
    this.col_dict = col_dict;
    this.data = data;
    this.column_name = column_name;
    this.data_tensors = {}; //store the tensor version of the groupby data

  }

  /**
     * Group the dataframe by the column by
     * creating an object to store the grouping
     * @returns Groupby data structure
     */
  group(){

    if (this.key_col.length == 2){ //check if the dataframe is group by two columns


      for (var i = 0; i < this.data.length; i++){

        let col1_index = this.column_name.indexOf(this.key_col[0]);
        let col2_index = this.column_name.indexOf(this.key_col[1]);

        let value = this.data[i];

        let col1_value = value[col1_index];
        let col2_value = value[col2_index];


        if (Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)){
          if (Object.prototype.hasOwnProperty.call(this.col_dict[col1_value], col2_value)){

            this.col_dict[col1_value][col2_value].push(value);
          }

        }

      }

      for (var key in this.col_dict){
        this.data_tensors[key] = {};

        for (var key2 in this.col_dict[key]){

          let data = this.col_dict[key][key2];

          if (data.length == 0){
            delete this.col_dict[key][key2]; //delete the empty key.
          } else {
            this.data_tensors[key][key2] = new DataFrame(data, { columns:this.column_name });
          }

        }
      }
    } else {
      for (let i = 0; i < this.data.length; i++){

        let col1_index = this.column_name.indexOf(this.key_col[0]);

        let value = this.data[i];

        let col1_value = value[col1_index];

        if (Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)){

          this.col_dict[col1_value].push(value);

        }
      }
      for (let key in this.col_dict){
        let data = this.col_dict[key];

        this.data_tensors[key] = new DataFrame(data, { columns:this.column_name });

      }

    }

    return this;

  }

  /**
     * obtain the column for each group
     * @param {col_name} col_name [Array]--> array of column names
     * @return Groupby data structure
     */
  col(col_names){
    this.selected_column = col_names; // store col_names for use later in .apply
    if (Array.isArray(col_names)){

      for (let i = 0; i < col_names.length; i++){

        let col_name = col_names[i];
        if (!this.column_name.includes(col_name)){
          throw new Error(`Column ${col_name} does not exist in groups`);
        }
      }
    } else {
      throw new Error(`Col_name must be an array of column`);
    }

    // let group_col_name = col_names; // store the column name
    let group_col = {};
    if (this.key_col.length == 2){

      for (var key1 in this.data_tensors){

        group_col[key1] = {};
        for (var key2 in this.data_tensors[key1]){

          group_col[key1][key2] = [];
          for (let i = 0; i < col_names.length; i++){
            let col_name = col_names[i];
            let data = this.data_tensors[key1][key2].column(col_name);
            group_col[key1][key2].push(data);
          }

        }
      }
    } else {
      for (let key1 in this.data_tensors){

        group_col[key1] = [];
        for (let i = 0; i < col_names.length; i++){
          let col_name = col_names[i];
          let data = this.data_tensors[key1].column(col_name);
          group_col[key1].push(data);
        }

      }
    }
    const gp = new GroupBy(
      null,
      this.key_col,
      null,
      col_names
    );

    gp.group_col = group_col;
    gp.group_col_name = col_names;
    // return gp;
    return gp;
  }


  /**
     * Basic root of all column arithemetic in groups
     * @param {operation} operatioin String
     */
  arithemetic(operation){

    let ops_name = [ "mean", "sum", "count", "mode", "std", "var", "cumsum", "cumprod",
      "cummax", "cummin" ];

    let ops_map = {
      "mean": "mean()",
      "sum": "sum()",
      "mode": "mode()",
      "count": "count()",
      "std" : "std()",
      "var" : "var()",
      "cumsum" : "cumsum().values",
      "cumprod": "cumprod().values",
      "cummax" : "cummax().values",
      "cummin" : "cummin().values"
    };
    let is_array = false;
    //the local variable to store variables to be used in eval
    // this seems not to be needed in Node version, since local
    //variable are easily accessed in the eval function
    let local = null;

    if (Array.isArray(operation)){
      is_array = true;
    }

    if (this.key_col.length == 2){

      let count_group = {};

      for (var key1 in this.group_col){

        count_group[key1] = {};
        for (var key2 in this.group_col[key1]){

          count_group[key1][key2] = [];
          for (let i = 0; i < this.group_col[key1][key2].length; i++ ){
            let data = null;
            if (is_array){
              let op = operation[i];
              if (!ops_name.includes(op)){
                throw new Error("operation does not exist");
              }
              local = this.group_col[key1][key2][i];
              data = eval(`local.${ops_map[op]}`);

            } else {
              local = this.group_col[key1][key2][i];
              data = eval(`local.${operation}`);
            }
            count_group[key1][key2].push(data);

          }

        }
      }
      return count_group;

    } else {
      let count_group = {};

      for (let key1 in this.group_col){

        count_group[key1] = [];
        for (let i = 0; i < this.group_col[key1].length; i++ ){
          let data = null;
          if (is_array){
            let op = operation[i];
            if (!ops_name.includes(op)){
              throw new Error("operation does not exist");
            }
            local = this.group_col[key1][i];
            data = eval(`local.${ops_map[op]}`);

          } else {
            local = this.group_col[key1][i];
            data = eval(`local.${operation}`);
          }

          count_group[key1].push(data);

        }
      }

      return count_group;
    }


  }

  operations(ops, name) {
    if (!this.group_col) {
      let column = this.column_name.filter((val) => !this.key_col.includes(val));
      let col_gp = this.col(column);
      let value = col_gp.arithemetic(ops);
      let df = col_gp.to_DataFrame(col_gp.key_col, col_gp.group_col_name, value, name);
      return df;
    } else {
      let value = this.arithemetic(ops);
      let df = this.to_DataFrame(this.key_col, this.group_col_name, value, name);
      return df;
    }
  }
  count(){
    return this.operations("count()", "count");
  }

  sum(){
    return this.operations("sum()", "sum");
  }

  std(){
    return this.operations("std()", "std");
  }

  var(){
    return this.operations("var()", "var");
  }

  mean(){
    return this.operations("mean()", "mean");
  }

  cumsum(){
    return this.operations("cumsum().values", "cumsum");
  }
  cummax(){
    return this.operations("cummax().values", "cummax");
  }

  cumprod(){
    return this.operations("cumprod().values", "cumprod");
  }

  cummin(){
    return this.operations("cummin().values", "cummin");
  }

  max(){
    return this.operations("max()", "max");
  }

  min(){
    return this.operations("min()", "min");
  }

  /**
     * returns dataframe of a group
     * @param {*} key [Array]
     */
  get_groups(key){

    if (this.key_col.length == 2){

      if (key.length == 2){
        let key1 = key[0];
        let key2 = key[1];

        utils.__is_object(this.data_tensors, key1, `Key Error: ${key1} not in object`);
        return this.data_tensors[key1][key2];
      } else { throw new Error("specify the two group by column"); }
    } else if (this.key_col.length == 1){

      if (key.length == 1){

        utils.__is_object(this.data_tensors, key[0], `Key Error: ${key[0]} not in object`);
        return this.data_tensors[key[0]];
      } else { throw new Error("specify the one group by column"); }
    }
    return this.data_tensors[key];
  }

  /**
     * Map every column to an operaton
     * @param {kwargs} kwargs {column name: math operation}
     * @example .agg({"A": "mean","B": "sum","C":"count"})
     */
  agg(kwargs = {}){

    let columns = Object.keys(kwargs);
    let operations = columns.map((x) => { return kwargs[x].toLocaleLowerCase(); });

    let col_gp = this.col(columns);

    let data = col_gp.arithemetic(operations);
    let df = this.to_DataFrame(col_gp.key_col, col_gp.group_col_name, data, operations);

    return df;
  }

  to_DataFrame(key_col, col, data, ops){

    if (key_col.length == 2){
      let df_data = [];
      for (let key_1 in data){

        let key_val = data[key_1];

        for (let key_2 in key_val){
          let k_data = key_val[key_2];
          let key_data = [];


          if (Array.isArray(k_data[0])){
            for (let i = 0; i < k_data.length; i++){
              let col_data = k_data[i];

              for (let j = 0; j < col_data.length; j++ ){

                if (typeof key_data[j] === "undefined" ){
                  key_data[j] = [];
                  key_data[j][0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
                  key_data[j][1] = isNaN(parseInt(key_2)) ? key_2 : parseInt(key_2);
                  key_data[j].push(col_data[j]);
                } else {
                  key_data[j].push(col_data[j]);
                }
              }
            }
            df_data.push(...key_data);

          } else {
            key_data[0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
            key_data[1] = isNaN(parseInt(key_2)) ? key_2 : parseInt(key_2);
            key_data.push(...k_data);
            df_data.push(key_data);
          }


        }

      }
      let column = [ ...key_col ];

      let group_col = col.slice().map((x, i) => {
        if (Array.isArray(ops)){
          return `${x}_${ops[i]}`;
        }
        return `${x}_${ops}`;
      });
      column.push(...group_col);
      return new DataFrame(df_data, { columns: column });
    } else {
      let df_data = [];
      for (let key_1 in data){

        let key_val = data[key_1];

        let key_data = [];
        if (Array.isArray(key_val[0])){
          for (let i = 0; i < key_val.length; i++){
            let col_data = key_val[i];

            for (let j = 0; j < col_data.length; j++ ){

              if (typeof key_data[j] === "undefined" ){
                key_data[j] = [];
                key_data[j][0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
                key_data[j].push(col_data[j]);
              } else {
                key_data[j].push(col_data[j]);
              }
            }
            df_data.push(...key_data);
          }

        } else {
          key_data[0] = isNaN(parseInt(key_1)) ? key_1 : parseInt(key_1);
          key_data.push(...key_val);
          df_data.push(key_data);
        }

      }
      let column = [ ...key_col ];
      let group_col = col.slice().map((x, i) => {
        if (Array.isArray(ops)){
          return `${x}_${ops[i]}`;
        }
        return `${x}_${ops}`;
      });
      column.push(...group_col);

      return new DataFrame(df_data, { columns: column });
    }
  }

  apply(callable){
    let df_data;
    let column;
    if (!this.group_col) {
      column = this.column_name.filter((val) => !this.key_col.includes(val));
      let col_gp = this.col(column);
      df_data = col_gp.group_col;
    } else {
      column = this.group_col_name;
      df_data = this.group_col;
    }
    let data = [];
    let count_group = {};
    if (this.key_col.length == 2) {

      for (let key in this.data_tensors) {
        count_group[key] = {};
        for (let key2 in this.data_tensors[key]) {
          count_group[key][key2] = [];
          for (let i = 0; i < df_data[key][key2].length; i++ ) {
            let callable_rslt = callable(df_data[key][key2][i]);
            if (callable_rslt instanceof DataFrame) {
              count_group[key][key2].push(callable_rslt.values);
            } else {
              if (callable_rslt instanceof Series) {
                count_group[key][key2].push(callable_rslt.values);
              } else {
                count_group[key][key2].push(callable_rslt);
              }
            }
          }


        }
      }
    } else {
      for (let key in df_data) {
        count_group[key] = [];
        for (let i = 0; i < df_data[key].length; i++ ){
          let callable_rslt = callable(df_data[key][i]);
          if (callable_rslt instanceof DataFrame) {
            count_group[key].push(callable_rslt.values);
          } else {
            if (callable_rslt instanceof Series) {
              count_group[key].push(callable_rslt.values);
            } else {
              count_group[key].push(callable_rslt);
            }

          }
        }

      }
    }
    return this.to_DataFrame(this.key_col, column, count_group, "apply");
  }

}

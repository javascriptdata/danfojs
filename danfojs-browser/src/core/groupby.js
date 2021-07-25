import { DataFrame } from "./frame";
import { Utils } from "./utils";
import { Series } from "./series";
import { concat } from "./concat";
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
  constructor(col_dict, key_col, data, column_name, col_dtype) {

    this.key_col = key_col;
    this.col_dict = col_dict;
    this.data = data;
    this.column_name = column_name;
    this.data_tensors = {}; //store the tensor version of the groupby data
    this.col_dtype = col_dtype;

  }

  /**
     * Group the dataframe by the column by
     * creating an object to store the grouping
     * @returns Groupby data structure
     */
  group(){
    for (const value of this.data){
      const col_indexes = this.key_col.map((key) => this.column_name.indexOf(key));
      const col_values = col_indexes.map((idx) => value[idx]);

      let sub_col_dict = this.col_dict;
      for (const col_value of col_values){
        if (!(col_value in sub_col_dict))
          break;
        if (col_value === col_values[col_values.length - 1])
          sub_col_dict[col_value].push(value);
        else
          sub_col_dict = sub_col_dict[col_value];
      }
    }

    const self = this;
    function dfs(sub_col_dict, sub_data_tensors){
      for (const [ key, value ] of Object.entries(sub_col_dict)){
        if (Array.isArray(value)) {
          if (value.length === 0)
            delete sub_col_dict[key];
          else
            sub_data_tensors[key] = new DataFrame(value, { columns:self.column_name });
        } else {
          if (!(key in sub_data_tensors))
            sub_data_tensors[key] = {};
          dfs(value, sub_data_tensors[key]);
        }
      }
    }
    dfs(this.col_dict, this.data_tensors);

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

    const group_col = {};
    function dfs(sub_data_tensors, sub_group_col) {
      for (const [ key, value ] of Object.entries(sub_data_tensors)){
        if (value instanceof DataFrame) {
          sub_group_col[key] = col_names.map((col_name) => value.column(col_name));
        } else {
          sub_group_col[key] = {};
          dfs(value, sub_group_col[key]);
        }
      }
    }
    dfs(this.data_tensors, group_col);

    const gp = new GroupBy(
      null,
      this.key_col,
      null,
      col_names,
      this.col_dtype
    );
    gp.group_col = group_col;
    gp.group_col_name = col_names;
    return gp;
  }


  /**
     * Basic root of all column arithemetic in groups
     * @param {operation} operation String
     */
  arithemetic(operation){
    const ops_name = [ "mean", "sum", "count", "mode", "std", "var", "cumsum", "cumprod",
      "cummax", "cummin" ];
    const ops_map = {
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
    const is_array_operation = Array.isArray(operation);
    const count_group = {};

    //the local variable to store variables to be used in eval
    // this seems not to be needed in Node version, since local
    //variable are easily accessed in the eval function
    let local = null;
    function dfs(sub_count_group, sub_group_col) {
      for (const [ key, value ] of Object.entries(sub_group_col)){
        if (Array.isArray(value)) {
          sub_count_group[key] = [];
          let data;
          if (is_array_operation) {
            for (let i = 0; i < value.length; i++){
              const op = operation[i];
              if (!ops_name.includes(op)){
                throw new Error("operation does not exist");
              }
              local = value[i];
              data = eval(`local.${ops_map[op]}`);
              sub_count_group[key].push(data);
            }
          } else {
            value.forEach((v) => {
              local = v;
              data = eval(`local.${operation}`);
              sub_count_group[key].push(data);
            });
          }
        } else {
          sub_count_group[key] = {};
          dfs(sub_count_group[key], value);
        }
      }
    }

    dfs(count_group, this.group_col);
    return count_group;
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
    if (this.key_col.length < 2)
      return this.data_tensors[key];

    if (key.length !== this.key_col.length)
      throw new Error("specify the group by column");

    utils.__is_object(this.data_tensors, key[0], `Key Error: ${key[0]} not in object`);
    const last_key = key[key.length - 1];
    let sub_data_tensors = this.data_tensors;
    for (const k of key) {
      if (k === last_key)
        return sub_data_tensors[k];
      else
        sub_data_tensors = sub_data_tensors[k];
    }
  }

  /**
     * Map every column to an operation
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
    const df_data = [];

    function concatPathAndNode(path, node, col_dtype) {
      if (Array.isArray(node)) {
        if (Array.isArray(node[0])) {
          if (ops != "apply" ) {
            const transposed_node = node[0].map((_, colIndex) => node.map((row) => row[colIndex]));
            for (const n_array of transposed_node)
              df_data.push(path.concat(n_array));
          } else {
            for (const n_array of node)
              df_data.push(path.concat(n_array));
          }

        } else
          df_data.push(path.concat(node));
      } else {
        for (const [ k, child ] of Object.entries(node)) {
          const sanitized_k = col_dtype[0] === "string" ? k : parseInt(k);
          concatPathAndNode(path.concat([ sanitized_k ]), child, col_dtype.slice(1));
        }
      }
    }

    concatPathAndNode([], data, this.col_dtype);

    const column = [ ...key_col ];
    const group_col = col.slice().map((x, i) => {
      if (Array.isArray(ops)){
        return `${x}_${ops[i]}`;
      }
      return `${x}_${ops}`;
    });
    column.push(...group_col);

    return new DataFrame(df_data, { columns: column });
  }

  apply(callable){
    let df_data;
    let column;
    if (!this.group_col) {
      column = this.column_name.filter((val) => !this.key_col.includes(val));
      const col_gp = this.col(column);
      df_data = col_gp.group_col;
    } else {
      column = this.group_col_name;
      df_data = this.group_col;
    }
    const count_group = {};

    function recursiveCount(sub_df_data, sub_count_group) {
      for (const [ key, value ] of Object.entries(sub_df_data)) {
        if (Array.isArray(value)) {
          let callable_value;
          if (value.length > 1) {
            callable_value = concat({ df_list: value, axis: 1 });
          } else {
            callable_value = value[0];
          }
          const callable_rslt = callable(callable_value);
          if (callable_rslt instanceof DataFrame) {
            column = callable_rslt.columns;
            sub_count_group[key] = callable_rslt.values;
          } else if (callable_rslt instanceof Series) {
            sub_count_group[key] = callable_rslt.values;
          } else
            sub_count_group = callable_rslt;
        } else {
          sub_count_group[key] = {};
          recursiveCount(value, sub_count_group[key]);
        }
      }
    }

    recursiveCount(df_data, count_group);

    return this.to_DataFrame(this.key_col, column, count_group, "apply");
  }

}

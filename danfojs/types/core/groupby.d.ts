/**
 * The class performs all groupby operation on a dataframe
 * involveing all aggregate funciton
 * @param {col_dict} col_dict Object of unique keys in the group by column
 * @param {key_col} key_col Array contains the column names
 * @param {data} Array the dataframe data
 * @param {column_name} Array of all column name in the dataframe.
 */
export class GroupBy {
   constructor(col_dict?: any, key_col?: any, data?: any, column_name?: any);
   key_col?: any;
   col_dict?: any;
   data?: any;
   column_name?: any;
   data_tensors: {};
   /**
      * Group the dataframe by the column by
      * creating an object to store the grouping
      * @returns Groupby data structure
      */
   group(): GroupBy;
   /**
      * obtain the column for each group
      * @param {col_name} col_name [Array]--> array of column names
      * @return Groupby data structure
      */
   col(col_names?: any): GroupBy;
   group_col_name?: any[];
   group_col: {};
   /**
      * Basic root of all column arithemetic in groups
      * @param {operation} operatioin String
      */
   arithemetic(operation?: any): {};
   count(): DataFrame;
   sum(): DataFrame;
   std(): DataFrame;
   var(): DataFrame;
   mean(): DataFrame;
   cumsum(): DataFrame;
   cummax(): DataFrame;
   cumprod(): DataFrame;
   cummin(): DataFrame;
   max(): DataFrame;
   min(): DataFrame;
   /**
      * returns dataframe of a group
      * @param {*} key [Array]
      */
   get_groups(key?: any): any;
   /**
      * Map every column to an operaton
      * @param {kwargs} kwargs {column name: math operation}
      * @example .agg({"A": "mean","B": "sum","C":"count"})
      */
   agg(kwargs?: any): DataFrame;
   to_DataFrame(key_col?: any, col?: any, data?: any, ops?: any): DataFrame;
}
import { DataFrame } from "./frame";

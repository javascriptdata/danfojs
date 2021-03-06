export class Merge {
    constructor(kwargs?: any);
    how?: any;
    left: DataFrame;
    right: DataFrame;
    on?: any[];
    left_col_index?: any[];
    right_col_index?: any[];
    left_key_dict: {};
    right_key_dict: {};
    __create_columns(): void;
    outer(): any[];
    inner(): any[];
    left_merge(): any[];
    right_merge(): any[];
    basic(keys?: any): any[];
}
export function merge(kwargs?: any): DataFrame;
import { DataFrame } from "./frame";

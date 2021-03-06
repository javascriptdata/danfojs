/**
 * Package wide configuration class
 */
export class Configs {
    table_width: number;
    table_truncate: number;
    dtype_test_lim: number;
    table_max_row: number;
    table_max_col_in_console: number;
    set_width(val?: any): void;
    get get_width(): number;
    set_max_col_in_console(val?: any): void;
    get get_max_col_in_console(): number;
    set_row_num(val?: any): void;
    get get_max_row(): number;
    get get_truncate(): number;
    set_truncate(val?: any): void;
    get get_dtype_test_lim(): number;
    set_dtype_test_lim(val?: any): void;
}

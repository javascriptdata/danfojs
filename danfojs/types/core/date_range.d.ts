/**
 * Generate date range between a specified set of date
 * @param {kwargs}  kwargs {
 *          start : string
 *          end  : string
 *          period: int
 *          freq : string
 * }
 * @returns Array
 */
export class date_range {
    constructor(kwargs?: any);
    offset: number;
    start?: any;
    end?: any;
    period?: any;
    freq?: any;
    freq_list: string[];
    range(start?: any, end?: any, period?: any, offset?: any): any;
    freq_type(date?: any, ftype?: any): any;
    offset_count(d_array?: any, offset?: any): any[];
    set_dateProps(date?: any, ftype?: any, val?: any): Date;
    toLocalString(d_array?: any): any;
    month_end(start_date?: any, end_date?: any): any;
    month_range(range?: any): any;
    day_end(start_date?: any, end_date?: any): number;
}

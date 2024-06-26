interface Params {
    start?: string;
    offset?: number;
    end?: string;
    freq?: string;
    period?: number;
}
/**
 * Generate sequence of Dates
 * @param start : signify the date to start with
 * @param end : signify the date to end with
 * @param period :  the total number of date to generate
 * @param offset : set the date range offset
 * @param freq: set the date range frequency and offset
 * @return string[]
 */
export default function dateRange(param: Params): string[];
export {};

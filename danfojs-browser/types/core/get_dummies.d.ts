/**
 * Generate one hot encoding for categorical variable in arrays |Serie | and Dataframe
 * @param {kwargs} kwargs { data : Array | Series | DataFrame,
 *                          prefix_sep: String e.g "_",
 *                          prefix: String | Array of String,
 *                          columns: [Array] columns to be encoded in DataFrame.
 * }
 */
export function get_dummies(kwargs?: any): DataFrame;
import { DataFrame } from "./frame";

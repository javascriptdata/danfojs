export default class NDframe {
  /**
     * N-Dimensiona data structure. Stores multi-dimensional
     * data in a size-mutable, labeled data structure. Analogous to the Python Pandas DataFrame.
     *
     * @param {data} Array JSON, Tensor. Block of data.
     * @param {kwargs} Object Optional Configuration Object
     *                 {columns: Array of column names. If not specified and data is an array of array, use range index.
     *                  dtypes: Data types of the columns,
     *                  index: row index for subseting array }
     *
     * @returns NDframe
     */
  constructor(data?: any, kwargs?: {});
  kwargs: {};
  series: boolean;
  /**
     *
     * @param {Array} data
     * Read array of data into NDFrame
     */
  _read_array(data?: any[]): void;
  data?: any[];
  row_data_tensor?: any;
  col_data?: any[][];
  col_data_tensor?: any;
  index_arr?: any[];
  columns?: any;
  /**
     *  Convert Javascript Object of arrays into NDFrame
     * @param {*} data Object of Arrays
     * @param {*} type type 1 object are of JSON form [{a: 1, b: 2}, {a: 30, b: 20}],
     *                 type 2 object are of the form {a: [1,2,3,4], b: [30,20, 30, 20}]
     */
  _read_object(data?: any, type?: any): void;
  /**
     * Sets the data type of the NDFrame. Supported types are ['float32', "int32", 'string', 'boolean']
     * @param {Array<String>} dtypes Array of data types.
     * @param {Boolean} infer Whether to automatically infer the dtypes from the Object
     */
  _set_col_types(dtypes: Array<string>, infer: boolean): void;
  col_types?: any[];
  /**
    * Returns the data types in the DataFrame
    * @return {Array} list of data types for each column
    */
  get dtypes(): any[];
  /**
     * Gets dimension of the NDFrame
     * @returns {Integer} dimension of NDFrame
     */
  get ndim(): any;
  /**
    * Gets values for index and columns
    * @return {Object} axes configuration for index and columns of NDFrame
    */
  get axes(): any;
  /**
    * Gets index of the NDframe
    * @return {Array} array of index from series
    */
  get index(): any[];
  /**
    * Sets index of the NDFrame
    */
  __set_index(labels?: any): void;
  /**
    * Generate a new index for NDFrame.
    */
  __reset_index(): void;
  /**
     * Gets a sequence of axis dimension along row and columns
     * @returns {Array} the shape of the NDFrame
     */
  get shape(): any[];
  /**
     * Gets the values in the NDFrame in JS array
     * @returns {Array} Arrays of arrays of data instances
     */
  get values(): any[];
  /**
     * Gets the column names of the data
     * @returns {Array} strings of column names
     */
  get column_names(): any[];
  /**
    * Return a boolean same-sized object indicating if the values are NaN. NaN and undefined values
    *  gets mapped to True values. Everything else gets mapped to False values.
    * @return {Array}
    */
  __isna(): any[];
  get size(): any;
  /**
    * Return object data as comma-separated values (csv).
     * @returns {Promise<String>} CSV representation of Object data
     */
  to_csv(): Promise<string>;
  /**
    * Return object as JSON string.
    * @returns {Promise <JSON>} JSON representation of Object data
    */
  to_json(): Promise<JSON>;
  /**
    * Prints the data in a Series as a grid of row and columns
    */
  toString(): any;
  /**
    * Pretty prints n number of rows in a DataFrame or Series in the console
    * @param {rows} Number of rows to print
    */
  print(): void;
}

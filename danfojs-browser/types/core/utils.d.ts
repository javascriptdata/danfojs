export class Utils {
   remove(arr?: any, index?: any): any;
   __remove_arr(arr?: any, index?: any): any;
   __is_string(value?: any): boolean;
   __is_number(value?: any): boolean;
   __is_object(value?: any): boolean;
   __is_null(value?: any): boolean;
   __is_undefined(value?: any): boolean;
   /**
      * Optimized version of random sampling from an array, as implemented in Python
      *
      *
         Chooses k unique random elements from a population sequence or set.
 
         Returns a new list containing elements from the population while
         leaving the original population unchanged.  The resulting list is
         in selection order so that all sub-slices will also be valid random
         samples.  This allows raffle winners (the sample) to be partitioned
         into grand prize and second place winners (the subslices).
 
         Members of the population need not be hashable or unique.  If the
         population contains repeats, then each occurrence is a possible
         selection in the sample.
 
         To choose a sample in a range of integers, use range as an argument.
         This is especially fast and space efficient for sampling from a
         large population:   sample(range(10000000), 60)
 
         Sampling without replacement entails tracking either potential
         selections (the array) in a list or previous selections in a set.
 
         When the number of selections is small compared to the
         population, then tracking selections is efficient, requiring
         only a small set and an occasional reselection.  For
         a larger number of selections, the array tracking method is
         preferred since the list takes less space than the
         set and it doesn't suffer from frequent reselections.
      *
      * @param {*} array The array to sample values from randomly
      * @param {*} num The number of elements to sample randomly
      */
   __sample_from_iter(array?: any, k?: any, destructive?: any): any;
   __range(start?: any, end?: any): any;
   __key_in_object(object?: any, key?: any): boolean;
   __get_col_values(data?: any): any[][];
   /**
      * retrieve row array and column names from object of the form {a: [1,2,3,4], b: [30,20, 30, 20}]
      * @param {*} data
      */
   _get_row_and_col_values(data?: any): (string[] | any[][])[];
   __convert_2D_to_1D(data?: any): any[];
   __replace_undefined_with_NaN(data?: any, isSeries?: any): any[];
   __get_t(arr_val?: any): any[];
   __unique(data?: any): any;
   __in_object(object?: any, key?: any, message?: any): void;
   __is_1D_array(arr?: any): boolean;
   __arr_to_obj(arr?: any): {};
   /**
      * count the NaN and non-NaN values present in an array
      * @param {Array} arr Array object
      * @param {Boolean} val whether to return the value count instead of the null count
      * @param {Boolean} isSeries Whether the Obj is of type series or not
      */
   __count_nan(arr?: any[], return_val: boolean, isSeries: boolean): number | any[];
   __median(arr?: any, isSeries?: any): any;
   __mode(arr?: any): number[];
   __round(arr?: any, dp: number, isSeries?: any): any[];
   __is_function(variable?: any): boolean;
   __randgen(num?: any, start?: any, end?: any): any[];
   _throw_wrong_params_error(kwargs?: any, params_needed?: any): void;
   __map_int_to_bool(arr?: any, dim?: any): any[];
   __std(data?: any): any;
   __zeros(row?: any, column?: any): any[][];
   __shuffle(num?: any, array?: any): any;
   __sort(arr?: any, ascending?: boolean): any;
   __is_browser_env(): any;
   __is_node_env(): any;
   _throw_str_dtype_error(obj?: any, ops?: any): void;
   /**
      * Remove NaN values from Array
      * @param {*} arr
      */
   _remove_nans(arr?: any): any;
   __get_duplicate(arr?: any): {};
   /**
      * Sorts an array by index
      * @param {Array} arr1
      * @param {Array} arr2
      * @param {string} dtype
      *
      * @returns sorted index
      */
   _sort_arr_with_index(arr1?: any[], arr2?: any[], dtype: string): any[];
}

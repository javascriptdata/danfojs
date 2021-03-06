export class LabelEncoder {
    /**
       *
       * @param {data} data [Array|Series]
       * @returns Array.
       */
    fit(data?: any): Series;
    label?: any;
    /**
       * Transform data using the label generated from fitting
       * @param {data} data [Array|Series]
       * @returns Array
       */
    transform(data?: any): Series;
}
export class OneHotEncoder {
    fit(data?: any): DataFrame;
    label?: any;
    transform(data?: any): DataFrame;
}
import { Series } from "../core/series";
import { DataFrame } from "../core/frame";

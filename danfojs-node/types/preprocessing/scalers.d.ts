import Series from "../core/series";
import { DataFrame } from "../core/frame";
export class MinMaxScaler {
    /**
    * Fit minmax scaler on data, to obtain their min and max value
    * @param {data} data [DataRame | Series | Array]
    * @returns Array
   */
    fit(data?: any): Series | DataFrame;
    max?: any;
    min?: any;
    /**
       * Transform an array using the min and max generated from the fitting on data
       * @param {data} data [Array]
       * @returns array
       */
    transform(data?: any): Series | DataFrame;

    /**
     * Restore a transformed array to their original values,
     * using the min and max generated from the fitting on data
     * @param {Series|Array|DataFrame} data
     * @returns Series|DataFrame
     */
    inverse_transform(data?: any): Series | DataFrame;
}
export class StandardScaler {
    /**
       *
       * @param {data} data [DataRame | Series | Array]
       * @returns Array
       */
    fit(data?: any): Series | DataFrame;
    std?: any;
    mean?: any;
    transform(data?: any): Series | DataFrame;
    inverse_transform(data?: any): Series | DataFrame;
}


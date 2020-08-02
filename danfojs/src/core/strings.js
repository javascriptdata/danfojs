//handled string columns in Series and DataFrame




/**
 * String methods applied on Series and DataFrames
 */
export class Str {
    constructor(series) {
        this.series = series
        if (!series.series || series.dtypes[0] != "string"){
            throw Error("Type Error: String class accepts String Series only")
        }
    }

    /**
     * Capitalize strings in Series.
     * @return {series}
     */
    capitalize(){
        
    }




}
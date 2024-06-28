import DataFrame from "../core/frame";
import Series from "../core/series";
export default class Rolling {
    data: Series;
    rollingDf: DataFrame;
    windowSize: number;
    constructor(data: Series, windowSize: number);
    private rolling;
    print(): void;
    sum(): Series;
    mean(): Series;
    max(): Series;
    min(): Series;
    prod(): Series;
    any(): Series;
    all(): Series;
}

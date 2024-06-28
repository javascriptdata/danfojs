import DataFrame from "../core/frame"
import Series from "../core/series";

export default class Rolling {
    data: Series
    rollingDf: DataFrame
    windowSize: number

    constructor(data: Series, windowSize:number) {
        this.data = data
        this.windowSize = windowSize
        this.rollingDf = this.rolling()
    }

    private rolling(): DataFrame{
        let dfData:Array<any> = []
        for (let i = 0; i<this.windowSize; i++){
            if(i == 0){
                dfData.push(this.data.values)
            }else{
                dfData.push(this.data.shift(i).values)
            }
        }
        return new DataFrame(dfData)
    }

    print(){
        this.rollingDf.print()
    }

    sum(){
        return new Series(this.rollingDf.tensor.sum(0))
    }

    mean(){
        return new Series(this.rollingDf.tensor.mean(0))
    }

    max(){
        return new Series(this.rollingDf.tensor.max(0))
    }

    min(){
        return new Series(this.rollingDf.tensor.min(0))
    }

    prod(){
        //multi
        return new Series(this.rollingDf.tensor.prod(0))
    }

    any(){
        // one of data true
        return new Series(this.rollingDf.tensor.any(0))
    }

    all(){
        // all of data true
        return new Series(this.rollingDf.tensor.all(0))
    }

}
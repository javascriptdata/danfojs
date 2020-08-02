import * as tf from '@tensorflow/tfjs-node'
import { Series } from "../core/series"

export class LabelEncoder{

    fit(data){
        let in_data = null;
        if(Array.isArray(data)){
            in_data = data;
        }
        else if(in_data instanceof Series){
            in_data = in_data.values;
        }else{
            throw new Error("data must be an array")
        }

        let data_set = new Set(in_data);
        this.label = Array.from(data_set);

        let self = this;
        let output_data = in_data.map((x)=>{
            return self.label.indexOf(x)
        });

        return output_data
    }

    /**
     * Transform data using the label generated from fitting
     * @param {data} data [Array|Series]
     * @returns Array
     */
    transform(data){
        let in_data = null;
        if(Array.isArray(data)){
            in_data = data;
        }
        else if(in_data instanceof Series){
            in_data = in_data.values;
        }else{
            throw new Error("data must be an array")
        }

        let self = this;
        let output_data = in_data.map((x)=>{
            return self.label.indexOf(x)
        });

        return output_data
    }
}
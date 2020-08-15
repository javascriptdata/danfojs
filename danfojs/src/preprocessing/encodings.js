// import * as tf from '@tensorflow/tfjs-node'
import { Series } from "../core/series"
import { Utils } from "../core/utils"
import { DataFrame } from "../core/frame"

const utils = new Utils

export class LabelEncoder {

    /**
     * 
     * @param {data} data [Array|Series]
     * @returns Array. 
     */
    fit(data) {
        let in_data = null;
        if (Array.isArray(data)) {
            in_data = data;
        } else if (data instanceof Series) {
            in_data = data.values;
        } else {
            throw new Error("data must be an array or a Series")
        }

        let data_set = new Set(in_data);
        this.label = Array.from(data_set);

        let self = this;
        let output_data = in_data.map((x) => {
            return self.label.indexOf(x)
        });

        return new Series(output_data)
    }

    /**
     * Transform data using the label generated from fitting
     * @param {data} data [Array|Series]
     * @returns Array
     */
    transform(data) {
        let in_data = null;
        if (Array.isArray(data)) {
            in_data = data;
        } else if (data instanceof Series) {
            in_data = data.values;
        } else {
            throw new Error("data must be an array or a Series")
        }

        let self = this;
        let output_data = in_data.map((x) => {
            return self.label.indexOf(x)
        });
        return new Series(output_data)
    }
}

export class OneHotEncoder {

    fit(data) {
        let in_data = null;
        if (Array.isArray(data)) {
            in_data = data;
        } else if (data instanceof Series) {
            in_data = data.values;
        } else {
            throw new Error("data must be an array")
        }

        let data_set = new Set(in_data);
        this.label = Array.from(data_set);

        let onehot_data = utils.__zeros(in_data.length, this.label.length)

        for (let i = 0; i < in_data.length; i++) {

            let elem = in_data[i]
            let elem_index = this.label.indexOf(elem)
            onehot_data[i][elem_index] = 1
        }

        return new DataFrame(onehot_data, { columns: this.label });

    }

    transform(data) {
        let in_data = null;

        if (Array.isArray(data)) {
            in_data = data;
        } else if (data instanceof Series) {
            in_data = data.values;
        } else {
            throw new Error("data must be an array")
        }

        let onehot_data = utils.__zeros(in_data.length, this.label.length)

        for (let i = 0; i < in_data.length; i++) {
            let elem = in_data[i]
            let elem_index = this.label.indexOf(elem)
            onehot_data[i][elem_index] = 1
        }

        return new DataFrame(onehot_data, { columns: this.label });

    }
}
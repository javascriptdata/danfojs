// import * as tf from '@tensorflow/tfjs-node'
import * as tf from '@tensorflow/tfjs'
import { Series } from "../core/series"
import { DataFrame } from "../core/frame"
import { Utils } from "../core/utils"
import { std } from 'mathjs'

const utils = new Utils

export class MinMaxScaler {

    /**
     * Fit minmax scaler on data, to obtain their min and max value
     * @param {data} data [DataRame | Series | Array]
     * @returns Array
     */
    fit(data) {

        let tensor_data = null
        if (Array.isArray(data)) {
            tensor_data = tf.tensor(data)
        }
        else if ((data instanceof DataFrame) || (data instanceof Series)) {
            if (data.dtypes.includes("string")) {
                throw Error("Dtype Error: Cannot perform operation on string dtypes")
            }
            tensor_data = tf.tensor(data.values)
        }
        else {
            throw new Error("data must either be an Array, DataFrame or Series")
        }

        this.max = tensor_data.max(0)
        this.min = tensor_data.min(0)

        let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync()

        if (data instanceof Series || Array.isArray(data)) {
            return new Series(output_data)
        } else {
            return new DataFrame(output_data)
        }

    }



    /**
     * Transform an array using the min and max generated from the fitting on data
     * @param {data} data [Array]
     * @returns array
     */
    transform(data) {

        if (data instanceof Series) {
            if (data.dtypes.includes("string")) {
                throw Error("Dtype Error: Cannot perform operation on string dtypes")
            }
            let tensor_data = tf.tensor(data.values)
            let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync()
            return new Series(output_data)
        } else if (Array.isArray(data)) {
            let tensor_data = tf.tensor(data)
            let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync()
            if (utils.__is_1D_array(data)) {
                return new Series(output_data)
            } else {
                return new DataFrame(output_data)
            }

        } else if (data instanceof DataFrame) {
            if (data.dtypes.includes("string")) {
                throw Error("Dtype Error: Cannot perform operation on string dtypes")
            }
            let tensor_data = tf.tensor(data.values);
            let output_data = tensor_data.sub(this.min).div(this.max.sub(this.min)).arraySync()
            return new DataFrame(output_data)
        } else {
            throw Error("Value Error: Data type not supoorted")
        }

    }
}

export class StandardScaler {
    /**
     * 
     * @param {data} data [DataRame | Series | Array]
     * @returns Array
     */
    fit(data) {
        let tensor_data = null
        if (Array.isArray(data)) {
            tensor_data = tf.tensor(data)

        }else if ((data instanceof DataFrame) || (data instanceof Series)) {
            if (data.dtypes.includes("string")) {
                throw Error("Dtype Error: Cannot perform operation on string dtypes")
            }
            tensor_data = tf.tensor(data.values)
        }
        else {
            throw new Error("data must either be an Array, DataFrame or Series")
        }

        this.std = std(tensor_data.arraySync())
        this.mean = tensor_data.mean()

        let output_data = tensor_data.sub(this.mean).div(this.std).arraySync()

        if (data instanceof Series || Array.isArray(data)) {
            return new Series(data = output_data)
        } else {
            return new DataFrame(data = output_data)
        }
    }

    transform(data) {
        // if(!Array.isArray(data)){
        //     throw new Error(data)
        // }

        if (data instanceof Series) {
            if (data.dtypes.includes("string")) {
                throw Error("Dtype Error: Cannot perform operation on string dtypes")
            }
            let tensor_data = tf.tensor(data.values)
            let output_data = tensor_data.sub(this.mean).div(this.std).arraySync()
            return new Series(output_data)
        } else if (Array.isArray(data)) {
            let tensor_data = tf.tensor(data)
            let output_data = tensor_data.sub(this.mean).div(this.std).arraySync()
            if (utils.__is_1D_array(data)) {
                return new Series(output_data)
            } else {
                return new DataFrame(output_data)
            }
        } else if (data instanceof DataFrame) {
            if (data.dtypes.includes("string")) {
                throw Error("Dtype Error: Cannot perform operation on string dtypes")
            }
            let tensor_data = tf.tensor(data.values);
            let output_data = tensor_data.sub(this.mean).div(this.std).arraySync()
            return new DataFrame(output_data)
        } else {
            throw Error("Value Error: Data type not supoorted")
        }

    }
}

// export class RobustScaler{

//     __median(arr, isTensor,return_index) {
//         if (!isTensor) {
//             const sorted = arr.slice().sort((a, b) => a - b);
//             const middle = Math.floor(sorted.length / 2);

//             if (sorted.length % 2 === 0) {

//                 return return_index ? [(middle - 1) , middle] : (sorted[middle - 1] + sorted[middle]) / 2;
//             }

//             return return_index ? middle : sorted[middle] ;
//         } else {
//             let result_arr = []
//             arr.map(ele => {
//                 const sorted = ele.slice().sort((a, b) => a - b);
//                 const middle = Math.floor(sorted.length / 2);

//                 if (sorted.length % 2 === 0) {
//                     result_arr.push(return_index ? [(middle - 1) , middle] :(sorted[middle - 1] + sorted[middle]) / 2 )
//                 } else {
//                     result_arr.push(return_index ? middle : sorted[middle])
//                 }

//             })
//             return result_arr
//         }

//     }

//     quantile(data,isTensor){

//         if(isTensor){
//             data = utils.__get_col_values(data);
//         }


//         let median = this.__median(data,isTensor,true)
//         let med = this.__median(data,isTensor,false)

//         let q1 = []
//         let q2 = []

//         if(!isTensor){
//             let sorted = data.slice().sort((a, b) => a - b);

//             if(Array.isArray(median)){
//                 let lower = median[0]
//                 let lower_data = sorted.slice(0,lower+1)
//                 let upper_data = sorted.slice(lower+1,)



//                 q1.push(this.__median(lower_data,isTensor,false));
//                 q2.push(this.__median(upper_data,isTensor,false));

//             }else{
//                 let lower_data = sorted.slice(0,median)
//                 let upper_data = sorted.slice(median+1,)

//                 q1.push(this.__median(lower_data,isTensor,false));
//                 q2.push(this.__median(upper_data,isTensor,false));
//             }

//         }else{

//             data.map((x,i)=>{
//                 let sorted = x.slice().sort((a, b) => a - b);

//                 if(Array.isArray(median[i])){
//                     let lower = median[i][0]
//                     let lower_data = sorted.slice(0,lower+1)
//                     let upper_data = sorted.slice(lower+1,)

//                     q1.push(this.__median(lower_data,!isTensor,false));
//                     q2.push(this.__median(upper_data,!isTensor,false));

//                 }else{
//                     let lower_data = sorted.slice(0,median[i])
//                     let upper_data = sorted.slice(median[i]+1,)

//                     q1.push(this.__median(lower_data,!isTensor,false));
//                     q2.push(this.__median(upper_data,!isTensor,false));
//                 }

//             })
//         }

//         return [q1,q2, med]

//     }

//     /**
//      * Fit robust scalar on data to obtain the first quantile and third quantile
//      * @param {data} data [DataRame | Series | Array]
//      * @returns Array
//      */
//     fit(data){

//         let tensor_data = null
//         let isTensor = false;
//         if(Array.isArray(data)){
//             tensor_data = tf.tensor(data)
//         }
//         else if((data instanceof DataFrame)){
//             tensor_data = tf.tensor(data.values)
//             isTensor = true;
//         }
//         else if((data instanceof Series)){
//             tensor_data = tf.tensor(data.values)
//         }
//         else{
//             throw new Error("data must either be an Array, DataFrame or Series")
//         }

//         let [q1, q3, median] = this.quantile(data,isTensor)
//         let q3_tensor = tf.tensor(q3)
//         let output_data =  tensor_data.sub(median).div(q3_tensor.sub(q1)).arraySync()

//         return output_data;
//     }
// }

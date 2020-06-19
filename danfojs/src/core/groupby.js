import {DataFrame} from "./frame"
import { Utils } from "./utils"

const utils = new Utils
module.exports = class GroupBy {

    constructor(col_dict,key_col, data, column_name) {
        
        this.key_col = key_col;
        this.col_dict = col_dict;
        this.data  = data;
        this.column_name = column_name;
        this.data_tensors = {}

    }

    group(){

        if(this.key_col.length ==2){

            
            for(var i=0; i < this.data.length; i++){
                
                let col1_index = this.column_name.indexOf(this.key_col[0]);
                let col2_index = this.column_name.indexOf(this.key_col[1]);

                let value = this.data[i];
                
                let col1_value = value[col1_index];
                let col2_value = value[col2_index];


                if(Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)){
                    if(Object.prototype.hasOwnProperty.call(this.col_dict[col1_value], col2_value)){

                        this.col_dict[col1_value][col2_value].push(value);
                    }

                }

            }

            for(var key in this.col_dict){
                this.data_tensors[key] = {}

                for(var key2 in this.col_dict[key]){
                    
                    let data = this.col_dict[key][key2]; 
                    
                    if(data.length ==0){
                        let length = this.data[0].length
                        let filled_data = new Array(length).fill(null)
                        this.data_tensors[key][key2] = new DataFrame(data=[filled_data],{ columns:this.column_name})
                    }
                    else{
                        this.data_tensors[key][key2] = new DataFrame(data=data,{ columns:this.column_name})
                    }
                    
                }
            }
        }else{
            for(var i=0; i < this.data.length; i++){

                let col1_index = this.column_name.indexOf(this.key_col[0]);
        
                let value = this.data[i];

                let col1_value = value[col1_index];

                if(Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)){
                    
                    this.col_dict[col1_value].push(value);

                }
            }
            for(var key in this.col_dict){
                let data = this.col_dict[key]
                
                this.data_tensors[key] = new DataFrame(data=data,{ columns:this.column_name})
                
            }
        
        }
        
        return this;

    }

    col(){}

    /**
     * returns dataframe of a group
     * @param {*} key [Array] 
     */
    get_groups(key){

        if(this.key_col.length ==2){

            if(key.length == 2){
                let key1 = key[0]
                let key2 = key[1];

                utils.inObject(this.data_tensors,key1, `Key Error: ${key1} not in object`)
                return this.data_tensors[key1][key2];
            }
            else{ throw new Error("specify the two group by column") }
        }
        else if(this.key_col.length ==1){ 

            if(key.length ==1){

                utils.inObject(this.data_tensors,key[0], `Key Error: ${key[0]} not in object`)
                return this.data_tensors[key[0]];
            }
            else{ throw new Error("specify the one group by column") }
        }
        return this.data_tensors[key]
    }


}
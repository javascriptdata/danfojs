import {DataFrame} from "./frame"

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
                
                console.log(this.key_col)
                let col1_index = this.column_name.indexOf(this.key_col[0]);
                let col2_index = this.column_name.indexOf(this.key_col[1]);

                let value = this.data[i];
                
                let col1_value = value[col1_index];
                let col2_value = value[col2_index];

                // console.log(col1_index,col2_index);

                if(Object.prototype.hasOwnProperty.call(this.col_dict, col1_value)){
                    if(Object.prototype.hasOwnProperty.call(this.col_dict[col1_value], col2_value)){

                        // console.log(value)
                        this.col_dict[col1_value][col2_value].push(value);
                    }

                }

            }

            for(var key in this.col_dict){
                this.data_tensors[key] = {}

                for(var key2 in this.col_dict){
                    let data = this.col_dict[key][key2]; 
                    console.log(this.column_name);
                    this.data_tensors[key][key2] = new DataFrame(data=data)
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
        // console.log(this.data_tensors);
        return this.col_dict;

    }

    col(){}

    get_groups(){}


}
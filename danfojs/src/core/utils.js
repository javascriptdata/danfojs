export function remove(arr,index){

    let new_arr = arr.filter(function(val,i){
         return i != index;
    });

    return new_arr;
}

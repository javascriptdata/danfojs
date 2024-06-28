import * as dfd from '../src'
import { tensorflow } from '../src';
// let data = [[1, 1, 2, 2], [1, 5, 6, 8], [20, 30, 40, 60], [20, 89, 78, 70]];
// let cols = ["A", "B", "C", "D"];
// let df:any = new dfd.DataFrame(data, { columns: cols });

// // df.addColumn("E", 5, {inplace: true})
// // df.print()

// // df.addColumn("F", df['A'].shift(2), {inplace: true})
// // df.print()

// // df.addColumn("K", df['A'].rolling(3).sum(), {inplace: true})
// // df.print()

// // let grouped = df.groupby('A').agg({
// //     B: 'last',
// //     C: 'first',
// //     D: 'mean',
// //     E: 'sum'
// // })
// // grouped.print()

// df.addColumn("E", df['A'].add(df['B']), {inplace: true})
// df.print()

// Tạo hai mảng ví dụ
const array1 = Array.from({ length: 100000000 }, (_, i) => i);
const array2 = Array.from({ length: 100000000 }, (_, i) => i);

// Đo thời gian thực hiện
console.time('Array addition with for loop');

const resultArray:any = [];
for (let i = 0; i < array1.length; i++) {
  resultArray[i] = array1[i] + array2[i];
}

console.timeEnd('Array addition with for loop');



// Đo thời gian thực hiện
console.time('Tensor addition with TensorFlow.js');

// Tạo hai tensor từ mảng
const tensor1 = tensorflow.tensor1d(array1);
const tensor2 = tensorflow.tensor1d(array2);

const resultTensor = tensor1.add(tensor2);
// Chuyển tensor kết quả thành mảng nếu cần
const resultArrayFromTensor = resultTensor.arraySync();

console.timeEnd('Tensor addition with TensorFlow.js');




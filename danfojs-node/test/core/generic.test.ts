import { assert } from "chai";
import { NDframe } from '../../build';
import * as tf from '@tensorflow/tfjs-node';


describe("Generic (NDFrame)", function () {
    describe("NDframe Created from Array", function () {
        it("prints the shape of a 1D array", function () {
            let data = [1, 2, 3, "Boy", "Girl"];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.shape, [5, 1]);
        });
        it("prints the default assigned column name in a series", function () {
            let data = ["Boy", 20, 25];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.columnNames, ["0"]);
        });
        it("prints the assigned column name in a series", function () {
            let data = ["Boy", 20, 25];
            let ndframe = new NDframe({ data, columnNames: ["Records"] });
            assert.deepEqual(ndframe.columnNames, ["Records"]);
        });
        it("prints the shape of a 2D array", function () {
            let data = [["Boy", 20], ["Girl", 25]];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.shape, [2, 2]);
        });
        it("prints the default assigned column names in 2D frame", function () {
            let data = [["Boy", 20], ["Girl", 25]];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.columnNames, ["0", "1"]);
        });
        it("prints the assigned column names", function () {
            let data = [["Boy", 20], ["Girl", 25]];
            let options = { "columnNames": ["Gender", "Age"] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.columnNames, ["Gender", "Age"]);
        });
        it("prints the size of a frame", function () {
            let data = [["Boy", 20, 1], ["Girl", 25, 3]];
            let options = { "columnNames": ["Gender", "Age", "count"] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.size, 6);
        });
        it("prints the dimension of a frame", function () {
            let data = [["Boy", 20, 1], ["Girl", 25, 3]];
            let options = { "columnNames": ["Gender", "Age", "count"] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.ndim, 2);
        });
        it("prints the values of a frame", function () {
            let data = [[21, 20, 1], [20, 25, 3]];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.values, data);
        });
        it("prints the values of a frame", function () {
            let data = [[21, 20, 1], [20, 25, 3]];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.values, data);
        });
    });

    describe("NDframe Created from JavaScript Object", function () {

        it("prints the shape of a 2D frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.shape, [3, 2]);
        });
        it("prints the column names of frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.columnNames, ["alpha", "count"]);
        });
        it("prints the shape of a 1D frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.shape, [1, 2]);
        });

        it("prints the size of a frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.size, 6);
        });
        it("prints the dimension of a frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.ndim, 2);
        });
        it("prints the values of a frame created from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.values, [["A", 1], ["B", 2]]);
        });
        it("prints the values of a frame created from an Object with null values", function () {
            let data = [{ alpha: "A", count: null }, { alpha: null, count: 2 }];
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.values, [["A", NaN], [NaN, 2]]);
        });
    });

    describe("NDframe column data", function () {
        it("retrieves the col data created from an Ndframe with two columns", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4] };
            let ndframe = new NDframe({ data });
            // @ts-ignore 
            // Ignoring ts error here because the propertiesm are dynamic
            // and as such won't be available at compile time            
            assert.deepEqual(ndframe["alpha"], ["A", "B", "C", "D"]);
            // @ts-ignore
            assert.deepEqual(ndframe["count"], [1, 2, 3, 4]);
        });
        it("retrieves the column data from an ndframe with threee columns", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data });
            /* @ts-ignore */
            assert.deepEqual(ndframe["alpha"], ["A", "B", "C", "D"]);
            // @ts-ignore
            assert.deepEqual(ndframe["count"], [1, 2, 3, 4]);
            // @ts-ignore
            assert.deepEqual(ndframe["sum"], [20.3, 30.456, 40.90, 90.1]);
        });

        it("Set column count by subseting", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data });
            /* @ts-ignore */
            ndframe["alpha"] = ["E", "F", "G", "H"]
            /* @ts-ignore */
            assert.deepEqual(ndframe["alpha"], ["E", "F", "G", "H"]);
            assert.deepEqual(ndframe.values[0], ['E', 1, 20.3]);
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32",]);
            // @ts-ignore
            assert.deepEqual(ndframe["count"], [1, 2, 3, 4]);
            // @ts-ignore
            assert.deepEqual(ndframe["sum"], [20.3, 30.456, 40.90, 90.1]);
        });

        it("Correct dtype is set after setting a column by subseting", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data });
            /* @ts-ignore */
            ndframe["alpha"] = [2.4, 5.6, 32.5, 1]
            /* @ts-ignore */
            assert.deepEqual(ndframe["alpha"], [2.4, 5.6, 32.5, 1]);
            assert.deepEqual(ndframe.values[0], [2.4, 1, 20.3]);
            assert.deepEqual(ndframe.values[1], [5.6, 2, 30.456]);
            assert.deepEqual(ndframe.values[2], [32.5, 3, 40.90]);
            assert.deepEqual(ndframe.values[3], [1, 4, 90.1]);
            assert.deepEqual(ndframe.dtypes, ["float32", "int32", "float32",]);
        });

        it("retrieves the col data created from an Ndframe with two columns in low memory mode", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4] };
            let ndframe = new NDframe({ data, config: { lowMemoryMode: true } });
            // @ts-ignore
            assert.deepEqual(ndframe["alpha"], ["A", "B", "C", "D"]);
            // @ts-ignore
            assert.deepEqual(ndframe["count"], [1, 2, 3, 4]);
        });
        it("retrieves the column data from an ndframe with threee columns in low memory mode", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data, config: { lowMemoryMode: true } });
            /* @ts-ignore */
            assert.deepEqual(ndframe["alpha"], ["A", "B", "C", "D"]);
            // @ts-ignore
            assert.deepEqual(ndframe["count"], [1, 2, 3, 4]);
            // @ts-ignore
            assert.deepEqual(ndframe["sum"], [20.3, 30.456, 40.90, 90.1]);
        });

        it("Set column count by subseting (low memory mode) ", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data, config: { lowMemoryMode: true } });
            /* @ts-ignore */
            ndframe["alpha"] = ["E", "F", "G", "H"]
            /* @ts-ignore */
            assert.deepEqual(ndframe["alpha"], ["E", "F", "G", "H"]);
            assert.deepEqual(ndframe.values[0], ['E', 1, 20.3]);
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32",]);
            // @ts-ignore
            assert.deepEqual(ndframe["count"], [1, 2, 3, 4]);
            // @ts-ignore
            assert.deepEqual(ndframe["sum"], [20.3, 30.456, 40.90, 90.1]);
        });

        it("Correct dtype is set after setting a column by subseting (low memory mode) ", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data, config: { lowMemoryMode: true } });
            /* @ts-ignore */
            ndframe["alpha"] = [2.4, 5.6, 32.5, 1]
            /* @ts-ignore */
            assert.deepEqual(ndframe["alpha"], [2.4, 5.6, 32.5, 1]);
            assert.deepEqual(ndframe.values[0], [2.4, 1, 20.3]);
            assert.deepEqual(ndframe.values[1], [5.6, 2, 30.456]);
            assert.deepEqual(ndframe.values[2], [32.5, 3, 40.90]);
            assert.deepEqual(ndframe.values[3], [1, 4, 90.1]);
            assert.deepEqual(ndframe.dtypes, ["float32", "int32", "float32",]);
        });
    })

    describe("NDframe Created from a Tensor", function () {

        it("prints the shape of a 2D frame created from a 2D tensor", function () {
            let data = tf.tensor([1, 2, 3, 4]);
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.ndim, 1);
            assert.deepEqual(ndframe.values, [1, 2, 3, 4]);

        });
        it("prints the shape of a 2D frame created from a 1D tensor", function () {
            let data = tf.tensor([[2, 3, 4], [4, 5, 6]]);
            let ndframe = new NDframe({ data, columnNames: ["alpha", "count", "sum"] });
            assert.deepEqual(ndframe.columnNames, ["alpha", "count", "sum"]);
        });

    });

    describe("index", function () {
        it("Returns the index of an NDframe", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
            let df = new NDframe({ data });
            assert.deepEqual(df.index, [0, 1, 2]);
        });
        it("Returns the index of an NDframe created from an Array", function () {
            let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70], [9, 10, 19]];
            let df = new NDframe({ data });
            assert.deepEqual(df.index, [0, 1, 2, 3]);
        });
    });

    describe("NDframe Created from JavaScript Object of Arrays", function () {

        it("retrieves the col data created from OA ", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4] };
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.values, [['A', 1], ['B', 2], ['C', 3], ['D', 4]]);
        });
        it("retrieves the data 2", function () {
            let data = { alpha: ["A", "B", "C", "D"], count: [1, 2, 3, 4], sum: [20.3, 30.456, 40.90, 90.1] };
            let ndframe = new NDframe({ data });
            let res = [
                ['A', 1, 20.3],
                ['B', 2, 30.456],
                ['C', 3, 40.9],
                ['D', 4, 90.1]
            ]
            assert.deepEqual(ndframe.values, res);
        });
        it("retrieves the row data created from OA ", function () {
            let data = { alpha: ["A", "B"], count: [1, 2] };
            let ndframe = new NDframe({ data });
            assert.deepEqual(ndframe.values, [["A", 1], ["B", 2]]);
        });
    });

    describe("setIndex", function () {
        it("sets the index of an NDframe", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
            let df = new NDframe({ data });
            df.setIndex(["A", "B", "C"]);
            assert.deepEqual(df.index, ["A", "B", "C"]);
        });
        it("Returns the index of an NDframe created from an Array", function () {
            let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70], [9, 10, 19]];
            let df = new NDframe({ data });
            df.setIndex([10, 20, 30, 40]);
            assert.deepEqual(df.index, [10, 20, 30, 40]);
        });
    });


    describe("dtype", function () {
        it("Returns int dtype set during creation of 1DFrame (Series) from an Object", function () {
            let data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let options = { dtypes: ['int32'] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ['int32']);
        });

        it("Returns string dtype set during creation of 1DFrame (Series) from an Array", function () {
            let data = ["Alice", "Yemi", "Rising", "Mark"];
            let options = { dtypes: ['string'] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ["string"]);
        });

        it("Returns string dtype automatically inferred from 1DFrame (Series)", function () {
            let data = ["Alice", "Yemi", "Rising", "Mark"];
            let options = { columns: 'Names' };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ["string"]);
        });

        it("Returns int dtype automatically inferred from 1DFrame (Series)", function () {
            let data = [20, 30, 20, 20];
            let options = { columns: 'Size' };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ["int32"]);
        });
        it("Returns float dtype automatically inferred from 1DFrame (Series)", function () {
            let data = [20.1, 30.4, 20.2, 4.23, 20.1];
            let options = { columns: 'Size' };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ["float32"]);
        });


        it("Returns dtype set during creation of 2DFrame from an Object", function () {
            let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }];
            let options = { dtypes: ['string', 'int32'] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ['string', 'int32']);
        });
        it("Returns dtype set during creation of 2DFrame from an Array", function () {
            let data = [["Alice", 2, 3.0], ["Boy", 5, 6.1], ["Girl", 30, 40], [39, 89, 78.2]];
            let cols = ["Name", "Count", "Score"];
            let options = { columns: cols, dtypes: ['string', 'int32', 'float32'] };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32"]);
        });

        it("Returns dtype automatically inferred from 2DFrame", function () {
            let data = [["Alice", 2, 3.1], ["Boy", 5, 6.1], ["Girl", 30, 40.2], [39, 89, 78.2]];
            let cols = ["Name", "Count", "Score"];
            let options = { columns: cols };
            let ndframe = new NDframe({ data, ...options });
            assert.deepEqual(ndframe.dtypes, ["string", "int32", "float32"]);
        });

    });


    // describe("to_csv", async function () {
    //     it("Converts DataFrame to csv format and return string", async function () {
    //         let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //         let df = new NDframe({ data });
    //         let result = `alpha,count\nA,1\nB,2\nC,3\n`;
    //         df.to_csv().then((csv) => {
    //             assert.deepEqual(csv, result);
    //         });
    //     });
    //     it("Converts DataFrame of Series to csv format and return string when path is not specified", async function () {
    //         let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70], [9, 10, 19]];
    //         let df = new NDframe(data, { columns: ["A", "B", "C"] });
    //         let result = `A,B,C\n12,2,20\n90,5,23\n45,56,70\n9,10,19\n`;
    //         assert.deepEqual(await df.to_csv(), result);
    //     });
    // });

    // describe("to_json", async function () {
    //     it("Converts DataFrame to json format and return string", async function () {
    //         let data = [{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }];
    //         let result = JSON.stringify([{ alpha: "A", count: 1 }, { alpha: "B", count: 2 }, { alpha: "C", count: 3 }]);

    //         let df = new NDframe({ data });
    //         df.to_json().then((json) => {
    //             assert.deepEqual(json, result);
    //         });
    //     });
    //     it("Converts DataFrame to json format", async function () {
    //         let data = [[12, 2, 20], [90, 5, 23], [45, 56, 70]];
    //         let df = new NDframe(data, { columns: ["A", "B", "C"] });
    //         let result = JSON.stringify([{ A: 12, B: 2, C: 20 }, { A: 90, B: 5, C: 23 }, { A: 45, B: 56, C: 70 }]);
    //         df.to_json().then((json) => {
    //             assert.deepEqual(json, result);
    //         });
    //     });
    // });


});

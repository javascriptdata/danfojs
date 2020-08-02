import { assert } from "chai"
import { LabelEncoder } from "../../src/preprocessing/encodings"

describe("Encodings", function(){

    describe("LabelEncoder", function(){

        it("basic test", function(){
            let data = ["dog","cat","man","dog","cat","man","man","cat"]
            let encode = new LabelEncoder()
            let fit_data = [
                0, 1, 2, 0,
                1, 2, 2, 1
              ]
            assert.deepEqual(encode.fit(data),fit_data)
            assert.deepEqual(encode.transform(["dog","man"]),[0,2])
        });
    })


});
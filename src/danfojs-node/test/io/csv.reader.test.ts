import path from "path";
import chai, { assert, expect } from "chai";
import { describe, it } from "mocha";
import chaiAsPromised from "chai-as-promised";
import { DataFrame, readCSV, Series, streamCSV, toCSV, toJSON } from "../../dist/danfojs-node/src";
import fs from 'fs';
import process from 'process';

chai.use(chaiAsPromised);

describe("readCSV", function () {
  this.timeout(10000);

  const testSamplesDir = path.join(process.cwd(), "test", "samples");

  it("Read local csv file works", async function () {
    const filePath = path.join(testSamplesDir, "titanic.csv");
    let df = await readCSV(filePath, { header: true, preview: 5 });
    assert.deepEqual(df.shape, [5, 8]);
    assert.deepEqual(df.columns, [
      'Survived',
      'Pclass',
      'Name',
      'Sex',
      'Age',
      'Siblings/Spouses Aboard',
      'Parents/Children Aboard',
      'Fare'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'int32',
      'string', 'string',
      'int32', 'int32',
      'int32', 'float32'
    ]);
  });

  it("Read local CSV file with config works", async function () {
    const filePath = path.join(testSamplesDir, "titanic.csv");
    const frameConfig = {
      columns: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H'
      ]
    };
    let df = await readCSV(filePath, { frameConfig, header: true, preview: 5 });
    assert.deepEqual(df.shape, [5, 8]);
    assert.deepEqual(df.columns, [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H'
    ]);
    assert.deepEqual(df.dtypes, [
      'int32', 'int32',
      'string', 'string',
      'int32', 'int32',
      'int32', 'float32'
    ]);
  });

  it("Read local csv with correct types and format works", async function () {
    const filePath = path.join(testSamplesDir, "iris.csv");
    let df = await readCSV(filePath, { header: true, preview: 5 });
    const values = [
      [5.1, 3.5, 1.4, 0.2, 0.0],
      [4.9, 3.0, 1.4, 0.2, 0.0],
      [4.7, 3.2, 1.3, 0.2, 0.0],
      [4.6, 3.1, 1.5, 0.2, 0.0],
      [5.0, 3.6, 1.4, 0.2, 0.0]
    ];
    assert.deepEqual(df.values, values);
  });

  it("Throws error if file not found", async function () {
    const filePath = "notfound.csv";
    await expect(readCSV(filePath)).to.be.rejectedWith("ENOENT: no such file or directory");
  });

  it("Throws error if file not found over http", async function () {
    const filePath = "https://getdata.com/notfound.csv";
    await expect(readCSV(filePath)).to.be.rejectedWith(/HTTP \d+:/);
  });

  it("Throws error when reading empty CSV file", async function () {
    const filePath = path.join(testSamplesDir, "empty.csv");
    // Create empty file
    fs.writeFileSync(filePath, "");
    await expect(readCSV(filePath)).to.be.rejectedWith("No data found in CSV file");
    fs.unlinkSync(filePath); // Clean up
  });

  it("Throws error when reading malformed CSV", async function () {
    const filePath = path.join(testSamplesDir, "malformed.csv");
    // Create malformed CSV file
    fs.writeFileSync(filePath, "a,b,c\n1,2\n3,4,5,6");
    await expect(readCSV(filePath)).to.be.rejectedWith("CSV parsing errors");
    fs.unlinkSync(filePath); // Clean up
  });

  it("Throws error when DataFrame creation fails", async function () {
    const filePath = path.join(testSamplesDir, "invalid.csv");
    await expect(readCSV(filePath)).to.be.rejectedWith("ENOENT: no such file or directory");
  });

  it("Preserves leading zeros when dtype is string", async function () {
    const filePath = path.join(testSamplesDir, "leading_zeros.csv");
    // Create test CSV file
    fs.writeFileSync(filePath, "codes\n012345\n001234");

    try {
      const df = await readCSV(filePath, {
        frameConfig: {
          dtypes: ["string"]
        }
      });

      assert.deepEqual(df.values, [["012345"], ["001234"]]);
      assert.deepEqual(df.dtypes, ["string"]);

      // Verify the values are actually strings
      const jsonData = toJSON(df);
      assert.deepEqual(jsonData, [{ codes: "012345" }, { codes: "001234" }]);

      // Clean up
      fs.unlinkSync(filePath);
    } catch (error) {
      // Clean up even if test fails
      fs.unlinkSync(filePath);
      throw error;
    }
  });

  it("Converts to numbers when dtype is not string", async function () {
    const filePath = path.join(testSamplesDir, "leading_zeros.csv");
    // Create test CSV file
    fs.writeFileSync(filePath, "codes\n012345\n001234");

    try {
      const df = await readCSV(filePath); // default behavior without string dtype

      // Values should be converted to numbers
      assert.deepEqual(df.values, [[12345], [1234]]);
      assert.deepEqual(df.dtypes, ["int32"]);

      // Verify JSON output
      const jsonData = toJSON(df);
      assert.deepEqual(jsonData, [{ codes: 12345 }, { codes: 1234 }]);

      // Clean up
      fs.unlinkSync(filePath);
    } catch (error) {
      // Clean up even if test fails
      fs.unlinkSync(filePath);
      throw error;
    }
  });
});

describe("streamCSV", function () {
  this.timeout(100000);

  const testSamplesDir = path.join(process.cwd(), "test", "samples");

  it("Streaming local csv file with callback works", async function () {
    const filePath = path.join(testSamplesDir, "titanic.csv");
    await streamCSV(filePath, (df) => {
      if (df) {
        assert.deepEqual(df.shape, [1, 8]);
        assert.deepEqual(df.columns, [
          'Survived',
          'Pclass',
          'Name',
          'Sex',
          'Age',
          'Siblings/Spouses Aboard',
          'Parents/Children Aboard',
          'Fare'
        ]);
      } else {
        assert.deepEqual(df, null);
      }
    }, { header: true });
  });

  it("Throws error when streaming non-existent file", async function () {
    const filePath = "notfound.csv";
    await expect(streamCSV(filePath, () => {})).to.be.rejectedWith("ENOENT: no such file or directory");
  });

  it("Throws error when streaming malformed CSV", async function () {
    const filePath = path.join(testSamplesDir, "malformed_stream.csv");
    // Create malformed CSV file
    fs.writeFileSync(filePath, "a,b,c\n1,2\n3,4,5,6");
    await expect(streamCSV(filePath, () => {})).to.be.rejectedWith("CSV parsing errors");
    fs.unlinkSync(filePath); // Clean up
  });
});

describe("toCSV", function () {
  const testSamplesDir = path.join(process.cwd(), "test", "samples");

  it("toCSV works", async function () {
    const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    assert.deepEqual(toCSV(df, {}), `a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
  });

  it("toCSV works for specified separator", async function () {
    const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    assert.deepEqual(toCSV(df, { sep: "+" }), `a+b+c+d\n1+2+3+4\n5+6+7+8\n9+10+11+12\n`);
  });

  it("toCSV write to local file works", async function () {
    const data = [[1, 2, 3, "4"], [5, 6, 7, "8"], [9, 10, 11, "12"]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    const filePath = path.join(testSamplesDir, "test_write.csv");
    toCSV(df, { sep: ",", filePath });
    // Clean up
    fs.unlinkSync(filePath);
  });

  it("toCSV works for series", async function () {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let df = new Series(data);
    assert.deepEqual(toCSV(df, { sep: "+" }), `1+2+3+4+5+6+7+8+9+10+11+12`);
  });

  it("calling df.toCSV works", async function () {
    const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    assert.deepEqual(df.toCSV(), `a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
  });
});

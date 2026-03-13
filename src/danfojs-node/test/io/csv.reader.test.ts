import path from "path";
import { DataFrame, readCSV, Series, streamCSV, toCSV, toJSON } from "../../dist/danfojs-node/src";
import fs from 'fs';
import process from 'process';

// Add Jest types for TypeScript support
import { describe, expect, it } from '@jest/globals';

describe("readCSV", () => {
  const testSamplesDir = path.join(process.cwd(), "test", "samples");

  it("Read local csv file works", async () => {
    const filePath = path.join(testSamplesDir, "titanic.csv");
    let df = await readCSV(filePath, { header: true, preview: 5 });
    expect(df.shape).toEqual([5, 8]);
    expect(df.columns).toEqual([
      'Survived',
      'Pclass',
      'Name',
      'Sex',
      'Age',
      'Siblings/Spouses Aboard',
      'Parents/Children Aboard',
      'Fare'
    ]);
    expect(df.dtypes).toEqual([
      'int32', 'int32',
      'string', 'string',
      'int32', 'int32',
      'int32', 'float32'
    ]);
  });

  it("Read local CSV file with config works", async () => {
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
    expect(df.shape).toEqual([5, 8]);
    expect(df.columns).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H'
    ]);
    expect(df.dtypes).toEqual([
      'int32', 'int32',
      'string', 'string',
      'int32', 'int32',
      'int32', 'float32'
    ]);
  });

  it("Read local csv with correct types and format works", async () => {
    const filePath = path.join(testSamplesDir, "iris.csv");
    let df = await readCSV(filePath, { header: true, preview: 5 });
    const values = [
      [5.1, 3.5, 1.4, 0.2, 0.0],
      [4.9, 3.0, 1.4, 0.2, 0.0],
      [4.7, 3.2, 1.3, 0.2, 0.0],
      [4.6, 3.1, 1.5, 0.2, 0.0],
      [5.0, 3.6, 1.4, 0.2, 0.0]
    ];
    expect(df.values).toEqual(values);
  });

  it("Throws error if file not found", async () => {
    const filePath = "notfound.csv";
    await expect(readCSV(filePath)).rejects.toThrow("ENOENT: no such file or directory");
  });

  it("Throws error if file not found over http", async () => {
    const filePath = "https://getdata.com/notfound.csv";
    await expect(readCSV(filePath)).rejects.toThrow(/HTTP \d+:/);
  });

  it("Throws error when reading empty CSV file", async () => {
    const filePath = path.join(testSamplesDir, "empty.csv");
    // Create empty file
    fs.writeFileSync(filePath, "");
    await expect(readCSV(filePath)).rejects.toThrow("No data found in CSV file");
    fs.unlinkSync(filePath); // Clean up
  });

  it("Throws error when reading malformed CSV", async () => {
    const filePath = path.join(testSamplesDir, "malformed.csv");
    // Create malformed CSV file
    fs.writeFileSync(filePath, "a,b,c\n1,2\n3,4,5,6");
    await expect(readCSV(filePath)).rejects.toThrow("CSV parsing errors");
    fs.unlinkSync(filePath); // Clean up
  });

  it("Throws error when DataFrame creation fails", async () => {
    const filePath = path.join(testSamplesDir, "invalid.csv");
    await expect(readCSV(filePath)).rejects.toThrow("ENOENT: no such file or directory");
  });
});

describe("streamCSV", () => {
  const testSamplesDir = path.join(process.cwd(), "test", "samples");

  it("Streaming local csv file with callback works", async () => {
    const filePath = path.join(testSamplesDir, "titanic.csv");
    await streamCSV(filePath, (df) => {
      if (df) {
        expect(df.shape).toEqual([1, 8]);
        expect(df.columns).toEqual([
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
        expect(df).toBeNull();
      }
    }, { header: true });
  });

  it("Throws error when streaming non-existent file", async () => {
    const filePath = "notfound.csv";
    await expect(streamCSV(filePath, () => {})).rejects.toThrow("ENOENT: no such file or directory");
  });

  it("Throws error when streaming malformed CSV", async () => {
    const filePath = path.join(testSamplesDir, "malformed_stream.csv");
    // Create malformed CSV file
    fs.writeFileSync(filePath, "a,b,c\n1,2\n3,4,5,6");
    await expect(streamCSV(filePath, () => {})).rejects.toThrow("CSV parsing errors");
    fs.unlinkSync(filePath); // Clean up
  });
});

describe("toCSV", () => {
  const testSamplesDir = path.join(process.cwd(), "test", "samples");

  it("toCSV works", async () => {
    const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    expect(toCSV(df, {})).toBe(`a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
  });

  it("toCSV works for specified separator", async () => {
    const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    expect(toCSV(df, { sep: "+" })).toBe(`a+b+c+d\n1+2+3+4\n5+6+7+8\n9+10+11+12\n`);
  });

  it("toCSV write to local file works", async () => {
    const data = [[1, 2, 3, "4"], [5, 6, 7, "8"], [9, 10, 11, "12"]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    const filePath = path.join(testSamplesDir, "test_write.csv");

    // Write file
    toCSV(df, { sep: ",", filePath });

    // Verify file was written
    expect(fs.existsSync(filePath)).toBe(true);

    // Read and verify contents
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    expect(fileContent).toBe(`a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);

    // Clean up
    fs.unlinkSync(filePath);
  });

  it("toCSV works for series", async () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let df = new Series(data);
    expect(toCSV(df, { sep: "+" })).toBe(`1+2+3+4+5+6+7+8+9+10+11+12`);
  });

  it("calling df.toCSV works", async () => {
    const data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    let df = new DataFrame(data, { columns: ["a", "b", "c", "d"] });
    expect(df.toCSV()).toBe(`a,b,c,d\n1,2,3,4\n5,6,7,8\n9,10,11,12\n`);
  });
});

import fs from 'fs'
import Papa from 'papaparse'
import { DataFrame } from '../index'
import request from "request"
import { CsvParserConfig } from "../shared/types"


/**
 * Reads a CSV file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param config Configuration object. Supports all Papaparse configuration options.
 */
const $readCSV = async (filePath: string, config: CsvParserConfig): Promise<DataFrame> => {
  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      const dataStream = request.get(filePath);
      const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, config);
      dataStream.pipe(parseStream);

      const data: any = [];
      parseStream.on("data", (chunk: any) => {
        data.push(chunk);
      });

      parseStream.on("finish", () => {
        resolve(new DataFrame(data));
      });
    });

  } else {
    return new Promise(resolve => {
      const fileStream = fs.createReadStream(filePath)
      Papa.parse(fileStream, {
        ...config,
        complete: results => {
          const df = new DataFrame(results.data);
          resolve(df);
        }
      });
    });
  }
};

/**
 * Streams a CSV file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param config Configuration object. Supports all Papaparse configuration options. The following functions are
 * peculiar to Danfo.js:
 *  - `nRows`: The number of rows to read and pass to the `callback` function at any given time. Default is `10`.
 *  NB: This is will be returned as a DataFrame object.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 */
const $streamCSV = async (filePath: string, config: CsvParserConfig, callback: (df: DataFrame) => void): Promise<null> => {
  const { nRows } = { nRows: 10, ...config }

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      const dataStream = request.get(filePath);
      const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, config);
      dataStream.pipe(parseStream);

      let rowData: any = []

      parseStream.on("data", (chunk: any) => {
        rowData.push(chunk);
        if (rowData.length === nRows) {
          const df = new DataFrame(rowData);
          callback(df);
          rowData = [];
        }
      });

      parseStream.on("finish", () => {
        resolve(null);
      });

    });
  } else {
    const fileStream = fs.createReadStream(filePath)
    let rowData: any = []

    return new Promise(resolve => {
      Papa.parse(fileStream, {
        ...config,
        step: results => {
          rowData.push(results.data);
          if (rowData.length === nRows) {
            const df = new DataFrame(rowData);
            callback(df);
            rowData = [];
          }

        },
        complete: () => resolve(null)
      });
    });
  }
};

export {
  $readCSV,
  $streamCSV
}
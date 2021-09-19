import fs from 'fs'
import Papa from 'papaparse'
import request from "request"
import stream from "stream"
import { DataFrame, Series } from '../index'
import { ArrayType2D, ConfigsType, CsvParserConfig, PipeTransformerConfig } from "../shared/types"


/**
 * Reads a CSV file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param options optionsuration object. Supports all Papaparse optionsuration options.
 */
const $readCSV = async (filePath: string, options: CsvParserConfig): Promise<DataFrame> => {
  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      const dataStream = request.get(filePath);
      const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, options);
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
        ...options,
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
 * @param options optionsuration object. Supports all Papaparse optionsuration options. The following functions are
 * peculiar to Danfo.js:
 *  - `nRows`: The number of rows to read and pass to the `callback` function at any given time. Default is `10`.
 *  NB: This is will be returned as a DataFrame object.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 */
const $streamCSV = async (filePath: string, options: CsvParserConfig, callback: (df: DataFrame) => void): Promise<null> => {

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      const dataStream = request.get(filePath);
      const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, options);
      dataStream.pipe(parseStream);

      parseStream.on("data", (chunk: any) => {
        const df = new DataFrame([chunk]);
        callback(df);
      });

      parseStream.on("finish", () => {
        resolve(null);
      });

    });
  } else {
    const fileStream = fs.createReadStream(filePath)

    return new Promise(resolve => {
      Papa.parse(fileStream, {
        ...options,
        step: results => {
          const df = new DataFrame([results.data]);
          callback(df);
        },
        complete: () => resolve(null)
      });
    });
  }
};

/**
 * Converts a DataFrame or Series to CSV. 
 * @param df DataFrame or Series to be converted to CSV.
 * @param options.sep Separator character. Default is `,`.
 */
const $toCSV = (df: DataFrame | Series, options?: { sep?: string, header?: boolean }): string => {
  const { sep, header } = { sep: ",", header: true, ...options }

  if (df.$isSeries) {
    const csv = df.values.join(sep);
    return csv;
  } else {
    const rows = df.values as ArrayType2D
    let csvStr = header === true ? `${df.columns.join(sep)}\n` : ""

    for (let i = 0; i < rows.length; i++) {
      const row = `${rows[i].join(sep)}\n`;
      csvStr += row;
    }
    return csvStr;
  }
};


/**
 * Opens a CSV file from local or remote location as a Stream. Intermediate row is returned as a DataFrame object.
 * @param filePath URL or local file path to CSV file.
 * @param options Configuration object. Supports all Papaparse config options.
 */
const $openCsvInputStream = (filePath: string, options: PipeTransformerConfig) => {
  const { header } = { header: true, ...options }
  let isFirstChunk = true
  let ndFrameColumnNames: Array<string> = []
  let ndFrameIndex: Array<string | number> = []
  let ndFrameDtypes: Array<string> = []
  let ndFrameConfig: ConfigsType

  const csvInputStream = new stream.Readable({ objectMode: true });
  csvInputStream._read = () => { };

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    const dataStream = request.get(filePath);
    const parseStream: any = Papa.parse(Papa.NODE_STREAM_INPUT, { header, ...options });
    dataStream.pipe(parseStream);

    parseStream.on("data", (chunk: any) => {
      csvInputStream.push(new DataFrame(chunk));
    });

    parseStream.on("finish", () => {
      csvInputStream.push(null);
      return (null);
    });

    return csvInputStream;
  } else {
    const fileStream = fs.createReadStream(filePath)

    Papa.parse(fileStream, {
      ...{ header, ...options },
      step: results => {
        if (isFirstChunk) {
          const df = new DataFrame([results.data]);
          isFirstChunk = false
          ndFrameColumnNames = results.meta.fields || df.columns
          ndFrameIndex = df.index
          ndFrameDtypes = df.dtypes
          ndFrameConfig = df.config
        } else {
          const df = new DataFrame([results.data], {
            columns: ndFrameColumnNames,
            index: ndFrameIndex,
            dtypes: ndFrameDtypes,
            config: ndFrameConfig
          })
          csvInputStream.push(df);
        }

      },
      complete: (result: any) => {
        csvInputStream.push(null);
        return null
      },
      error: (err) => {
        csvInputStream.emit("error", err);
      }
    });

    return csvInputStream;
  }
};


/**
 * Writes a file stream to local storage. Stream objects must be a Series or DataFrame.
 * @param filePath URL or local file path to write to.
 * @param options Configuration object. Supports all `toCSV` options.
 */
const $writeCsvOutputStream = (filePath: string, options: PipeTransformerConfig) => {
  let isFirstRow = true
  const fileOutputStream = fs.createWriteStream(filePath)
  const csvOutputStream = new stream.Writable({ objectMode: true })

  csvOutputStream._write = (chunk: DataFrame | Series, encoding, callback) => {

    if (chunk instanceof DataFrame) {

      if (isFirstRow) {
        isFirstRow = false
        fileOutputStream.write($toCSV(chunk, { header: true, ...options }));
        callback();
      } else {
        fileOutputStream.write($toCSV(chunk, { header: false, ...options }));
        callback();
      }

    } else if (chunk instanceof Series) {

      fileOutputStream.write($toCSV(chunk));
      callback();

    } else {
      csvOutputStream.emit("error", new Error("ValueError: Intermediate chunk must be either a Series or DataFrame"))
    }

  }

  csvOutputStream.on("finish", () => {
    fileOutputStream.end()
  })

  return csvOutputStream
}




export {
  $readCSV,
  $streamCSV,
  $toCSV,
  $writeCsvOutputStream,
  $openCsvInputStream,
}
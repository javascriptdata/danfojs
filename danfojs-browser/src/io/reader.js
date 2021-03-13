import { data } from "@tensorflow/tfjs";
import XLSX from "xlsx";
import { DataFrame } from "../core/frame";


/**
 * Reads a CSV file from local or remote storage
 * @param {string} source URL to CSV file
 * @param {object} config (Optional). A CSV Config object that contains configurations
 *     for reading and decoding from CSV file(s).
 *                { start: The index position to start from when reading the CSV file.
 *
 *                end: The end position to stop at when reading the CSV file.
 *
 *                ...csvConfigs: other supported Tensorflow csvConfig parameters. See https://js.tensorflow.org/api/latest/#data.csv 
 *                }
 *
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_csv = async (source, configs = {}) => {
  let { start, end } = configs;
  if (!(source.startsWith("https") || source.startsWith("http"))) {
    throw new Error("Cannot read local file in browser environment");
  }
  let tfdata = [];
  await data.csv(source, configs)
    .skip(start)
    .take(end)
    .forEachAsync((row) => {
      return tfdata.push(row);
    });
  const df = new DataFrame(tfdata);
  return df;
};

/**
 * Reads a JSON file from local or remote address
 * @param {string} source URL or local file path to retreive JSON file.
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_json = async (source) => {
  let res = await fetch(source, { method: "Get" });
  let json = await res.json();
  let df = new DataFrame(json);
  return df;

};

/**
 * Reads an Excel file from local or remote address
 * @param {string} source URL to Excel file
 * @param {object} configs {
 *
 *                        sheet : string, (Optional) Name of the sheet which u want to parse. Default will be the first sheet.
 *
 *                        header_index : int, (Optional) Index of the row which represents the header(columns) of the data. Default will be the first non empty row.
 *
 *                        data_index   : int, (Optional) Index of the row from which actual data(content) starts. Default will be the next row of `header_index`.
 *
 *                    }
 * @returns {Promise} DataFrame structure of parsed Excel data
 */
export const read_excel = async (source, configs = {}) => {
  let { sheet, header_index, data_index } = configs;
  let workbook;
  if (!header_index) {
    //default header_index
    header_index = 1;
  }
  if (!data_index) {
    //default data_index
    data_index = header_index + 1;
  }
  try {
    let res = await fetch(source, { method: "Get" });
    res = await res.arrayBuffer();
    res = new Uint8Array(res);
    workbook = XLSX.read(res, { type: "array" });


    // Parse worksheet from workbook
    const worksheet = workbook.Sheets[sheet || workbook.SheetNames[0]];
    let range = XLSX.utils.decode_range(worksheet["!ref"]);
    let column_names = [],
      data = [];
    for (let R = header_index - 1; R <= range.e.r; ++R) {
      let row_data = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cell_ref;

        //Populate column_names
        if (R == header_index - 1) {
          cell_ref = XLSX.utils.encode_cell({ c: C, r: header_index - 1 });
          if (worksheet[cell_ref]) {
            column_names.push(worksheet[cell_ref].v);
          }
        }

        //Populate corresponding data row
        if (R >= data_index - 1) {
          cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
          if (worksheet[cell_ref]) {
            row_data.push(worksheet[cell_ref].v);
          }
        }
      }
      if (R >= data_index - 1) {
        data.push(row_data);
      }
    }
    let df = new DataFrame(data, { columns: column_names });
    return df;
  } catch (err) {
    throw new Error(err);
  }
};

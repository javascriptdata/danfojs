import { data } from "@tensorflow/tfjs";
import XLSX from "xlsx";
import { Utils } from "../core/utils";
import { DataFrame } from "../core/frame";

const utils = new Utils();

/**
 * Reads a CSV file from local or remote storage
 *
 * @param {source} URL or local file path to retreive CSV file. If it's a local path, it
 * must have prefix `file://` and it only works in node environment.
 * @param {config} (Optional). A CSV Config object that contains configurations
 *     for reading and decoding from CSV file(s).
 *
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_csv = async (source, chunk) => {
  if (
    !(
      utils.__is_browser_env() ||
      source.startsWith("file://") ||
      source.startsWith("http")
    )
  ) {
    //probabily a relative path, append file:// to it
    // eslint-disable-next-line no-undef
    source = `file://${process.cwd()}/${source}`;
  }

  let tfdata = [];
  const csvDataset = data.csv(source);
  const column_names = await csvDataset.columnNames();
  const sample = csvDataset.take(chunk);
  await sample.forEachAsync((row) => tfdata.push(Object.values(row)));
  let df = new DataFrame(tfdata, { columns: column_names });
  return df;
};

/**
 * Reads a JSON file from local or remote address
 *
 * @param {source} URL or local file path to retreive JSON file.
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
 *
 *  * @param {kwargs} kwargs --> {
 *                        source       : string, URL or local file path to retreive Excel file.
 *                        sheet_name   : string, (Optional) Name of the sheet which u want to parse. Default will be the first sheet.
 *                        header_index : int, (Optional) Index of the row which represents the header(columns) of the data. Default will be the first non empty row.
 *                        data_index   : int, (Optional)Index of the row from which actual data(content) starts. Default will be the next row of `header_index`
 *                    }
 * @returns {Promise} DataFrame structure of parsed Excel data
 */
export const read_excel = async (kwargs) => {
  let { source, sheet_name, header_index, data_index } = kwargs;
  let is_a_url = source.match(/(http(s?)):\/\//g);
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
    const worksheet = workbook.Sheets[sheet_name || workbook.SheetNames[0]];
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

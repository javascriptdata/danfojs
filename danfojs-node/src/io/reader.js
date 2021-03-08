import fetch from "node-fetch";
import { open, Dataset, isDataset } from "frictionless.js";
import toArray from "stream-to-array";
import { DataFrame } from "../core/frame";


/**
 * Reads a CSV file from local or remote storage
 *
 * @param {source} URL or local file path to retreive CSV file.
* @param {config} (Optional). A CSV Config object that contains configurations
*     for reading and decoding from CSV file(s).
*      configs = { size: chunk size of the data to read. This will read from 0 to size of data,
*                  data_num (Defaults => 0): The specific dataset to load, when reading data from a datapackage.json,
*                  header (Defaults => true): Whether the dataset contains header or not
*                }
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_csv = async (source, configs) => {
  let df = await read(source, configs);
  return df;
};

/**
 * Reads an Excel file from local or remote address
 * @param {source} URL or local file path to retreive excel file.
 * @param {config} (Optional). A Config object that contains configurations
 *     for reading and decoding from file(s).
 *     configs = { sheet: Excel sheet number when reading from excel files
 *                 size: chunk size of the data to read. This will read from 0 to size of data,
 *                 data_num (Defaults => 0): The specific dataset to load, when reading data from a datapackage.json,
 *                 header (Defaults => true): Whether the dataset contains header or not
 *        }
 *
 * @returns {Promise} DataFrame structure of parsed Excel data
 */
export const read_excel = async (source, configs) => {
  let df = await read(source, configs);
  return df;
};


/**
 * Reads a JSON file from local or remote address
 *
 * @param {source} URL or local file path to retreive JSON file.
 * @returns {Promise} DataFrame structure of parsed CSV data
 */
export const read_json = async (source) => {
  if (
    source.startsWith("https://") ||
    source.startsWith("http://") ||
    source.startsWith("file://")
  ) {
    //read from URL
    let res = await fetch(source, { method: "Get" });
    let json = await res.json();
    let df = new DataFrame(json);
    return df;
  } else {
    //Try reading file from local env
    let fs = await import("fs");
    return new Promise((resolve, reject) => {
      fs.readFile(source, (err, data) => {
        if (err) reject(err);
        let df = new DataFrame(JSON.parse(data));
        resolve(df);
      });
    });
  }
};


/**
 * Opens a file using frictionless.js specification.
 * @param {string} pathOrDescriptor A path to the file/resources. It can be a local file,
 * a URL to a tabular data (CSV, EXCEL) or Datahub.io Data Resource.
 * Data comes with extra properties and specification conforming to the Frictionless Data standards.
 * @param {object} configs { data_num (Defaults => 0): The specific dataset to load, when reading data from a datapackage.json,
 *                          header (Defaults => true): Whether the dataset contains header or not.
 *                          }
 * @returns {DataFrame} Danfo DataFrame/Series
 */
export const read = async (
  path_or_descriptor,
  configs = {}
) => {
  let { data_num, header, sheet, size } = configs;
  data_num = data_num ? data_num : 0;
  header = header ? header : true;
  let rows, file;

  if (isDataset(path_or_descriptor)) {
    console.log(
      "datapackage.json found. Loading Dataset package from Datahub.io"
    );
    const dataset = await Dataset.load(path_or_descriptor);
    file = dataset.resources[data_num];
    rows = await toArray(await file.rows({ sheet, size }));
  } else {
    try {
      file = open(path_or_descriptor, {});
      rows = await toArray(await file.rows({ sheet, size }));
    } catch (error) {
      console.log(error);
    }
  }

  if ([ "csv", "xls", "xlsx" ].includes(await file.descriptor.format)) {
    if (header) {
      let df = new DataFrame(rows.slice(1), { columns: rows[0] });
      return df;
    } else {
      let df = new DataFrame(rows);
      return df;
    }
  } else {
    let df = new DataFrame(rows);
    return df;
  }
};

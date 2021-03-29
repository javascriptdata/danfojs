import { data } from "@tensorflow/tfjs-node";
import fetch from "node-fetch";
import { open, Dataset, isDataset } from "frictionless.js";
import toArray from "stream-to-array";
import { DataFrame } from "../core/frame";


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
export const read_csv = async (source, configs = {}) => {
  let { start, end } = configs;
  if (!(source.startsWith("file://") || source.startsWith("http"))) {
    //probabily a relative path, append file:// to it
    source = source.startsWith("/") ? `file://${source}` : `file://${process.cwd()}/${source}`;
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
 * Reads an Excel file from local or remote address
 * @param {string} source URL or local file path to retreive Excel file.
 * @param {object} configs (Optional) Configuration options when reading excel files
 *
 *                          {
 *                            sheet  : string, (Optional) number of the sheet to parse. Default will be the first sheet.
 *                          }
 * @returns {Promise} DataFrame structure of parsed Excel data
 */
export const read_excel = async (source, configs) => {
  const df = await read(source, configs);
  return df;
};

/**
 * Opens a file using frictionless.js specification.
 * @param {string} source A path to the file/resources. It can be a local file,
 * a URL to a tabular data (CSV, EXCEL) or Datahub.io Data Resource.
 * Data comes with extra properties and specification conforming to the Frictionless Data standards.
 * @param {object} configs {
 *
 *                  data_num (Defaults => 0): The specific dataset to load, when reading data from a datapackage.json
 *
 *                  header (Defaults => true): Whether the dataset contains header or not.
 *
 *                  sheet (Defaults => 0): Number of the excel sheet which u want to load.
 *                 }
 * @returns {DataFrame} Danfo DataFrame/Series
 */
export const read = async (
  source,
  configs = {}
) => {
  let { data_num, header, sheet } = configs;
  data_num = data_num === undefined ? 0 : data_num;
  header = header === undefined ? true : header;
  let rows, file;

  if (isDataset(source)) {
    console.log(
      "datapackage.json found. Loading Dataset package from Datahub.io"
    );
    const dataset = await Dataset.load(source);
    file = dataset.resources[data_num];
    rows = await toArray(await file.rows());
  } else {
    try {
      file = open(source);
      if (sheet) {
        rows = await toArray(await file.rows({ sheet }));
      } else {
        rows = await toArray(await file.rows());
      }
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


import { DataFrame, NDframe, Series } from '../index';

/**
 * Reads a JSON file from local or remote location into a DataFrame.
 * @param fileName URL or local file path to JSON file.
 * @param options Configuration object. Supported options:
 * - `method`: The HTTP method to use. Defaults to `'GET'`.
 * - `headers`: Additional headers to send with the request. Supports the `node-fetch` [HeadersInit]
 * @example
 * ```
 * import { readJSON } from "danfojs-node"
 * const df = await readJSON("https://raw.githubusercontent.com/test.json")
 * ```
 * @example
 * ```
 * import { readJSON } from "danfojs-node"
 * const df = await readJSON("https://raw.githubusercontent.com/test.json", {
 *    headers: {
 *      Accept: "text/json",
 *      Authorization: "Bearer YWRtaW46YWRtaW4="
 *    }
 * })
 * ```
 * @example
 * ```
 * import { readJSON } from "danfojs-node"
 * const df = await readJSON("./data/sample.json")
 * ```
 */
const $readJSON = async (file, options) => {
  const { method, headers } = { method: "GET", headers: {}, ...options };

  if (typeof file === "string" && file.startsWith("http")) {

    return new Promise((resolve) => {
      fetch(file, { method, headers }).then((response) => {
        if (response.status !== 200) {
          throw new Error(`Failed to load ${file}`);
        }
        response.json().then((json) => {
          resolve(new DataFrame(json));
        });
      }).catch((err) => {
        throw new Error(err);
      });
    });

  } else if (file instanceof File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        const jsonObj = JSON.parse(event.target.result);
        resolve(new DataFrame(jsonObj));
      };
    });
  } else {
    throw new Error("ParamError: File not supported. file must be a url or an input File object");
  }
};


/**
 * Converts a DataFrame or Series to JSON.
 * @param df DataFrame or Series to be converted to JSON.
 * @param options Configuration object. Supported options:
 * - `fileName`: The file path to write the JSON to. If not specified, the JSON object is returned.
 * - `format`: The format of the JSON. Defaults to `'column'`. E.g for using `column` format:
 * ```
 * [{ "a": 1, "b": 2, "c": 3, "d": 4 },
 *  { "a": 5, "b": 6, "c": 7, "d": 8 }]
 * ```
 * and `row` format:
 * ```
 * { "a": [1, 5, 9],
 *  "b": [2, 6, 10]
 * }
 * ```
 * @example
 * ```
 * import { toJSON } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * const json = toJSON(df)
 * ```
 * @example
 * ```
 * import { toJSON } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * toJSON(df, {
 *     fileName: "./data/sample.json",
 *     format: "row"
 *   })
 * ```
 */
const $toJSON = (df, options) => {
  let { fileName, format, download } = { fileName: "output.json", download: true, format: "column", ...options };

  if (df.$isSeries) {
    const obj = {};
    obj[df.columns[0]] = df.values;

    if (download) {
      if (!fileName.endsWith(".json")) {
        fileName = fileName + ".json";
      }
      $downloadFileInBrowser(obj, fileName);
    } else {
      return obj;
    }

  } else {
    if (format === "row") {
      const obj = {};
      for (let i = 0; i < df.columns.length; i++) {
        obj[df.columns[i]] = (df).column(df.columns[i]).values;
      }
      if (download) {
        if (!(fileName.endsWith(".json"))) {
          fileName = fileName + ".json";
        }

        $downloadFileInBrowser(obj, fileName);
      } else {
        return obj;
      }
    } else {
      const values = df.values;
      const header = df.columns;
      const jsonArr = [];

      values.forEach((val) => {
        const obj = {};
        header.forEach((h, i) => {
          obj[h] = val[i];
        });
        jsonArr.push(obj);
      });
      if (download) {
        if (!fileName.endsWith(".json")) {
          fileName = fileName + ".json";
        }
        $downloadFileInBrowser(jsonArr, fileName);
      } else {
        return jsonArr;
      }
    }
  }
};

/**
 * Function to download a CSV file in the browser.
 * @param content A string of CSV file contents
 * @param fileName  The name of the file to be downloaded
 */
const $downloadFileInBrowser = (content, fileName) => {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(JSON.stringify(content));
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName;
  hiddenElement.click();
};


export {
  $readJSON,
  $toJSON
};

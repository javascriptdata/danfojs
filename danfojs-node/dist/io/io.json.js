"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$toJSON = exports.$readJSON = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _index = require("../index");

const $readJSON = async (filePath, options) => {
  const {
    method,
    headers
  } = {
    method: "GET",
    headers: {},
    ...options
  };

  if (filePath.startsWith("http") || filePath.startsWith("https")) {
    return new Promise(resolve => {
      (0, _nodeFetch.default)(filePath, {
        method,
        headers
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(`Failed to load ${filePath}`);
        }

        response.json().then(json => {
          resolve(new _index.DataFrame(json));
        });
      }).catch(err => {
        throw new Error(err);
      });
    });
  } else {
    return new Promise(resolve => {
      const file = _fs.default.readFileSync(filePath, "utf8");

      const df = new _index.DataFrame(JSON.parse(file));
      resolve(df);
    });
  }
};

exports.$readJSON = $readJSON;

const $toJSON = (df, options) => {
  let {
    filePath,
    format
  } = {
    filePath: undefined,
    format: "column",
    ...options
  };

  if (df.$isSeries) {
    const obj = {};
    obj[df.columns[0]] = df.values;

    if (filePath) {
      if (!filePath.endsWith(".json")) {
        filePath = filePath + ".json";
      }

      _fs.default.writeFileSync(filePath, JSON.stringify(obj));
    } else {
      return obj;
    }
  } else {
    const values = df.values;
    const header = df.columns;
    const jsonArr = [];

    if (format === "row") {
      const obj = {};

      for (let i = 0; i < df.columns.length; i++) {
        obj[df.columns[i]] = df.column(df.columns[i]).values;
      }

      if (filePath !== undefined) {
        if (!filePath.endsWith(".json")) {
          filePath = filePath + ".json";
        }

        _fs.default.writeFileSync(filePath, JSON.stringify(obj), "utf8");
      } else {
        return obj;
      }
    } else {
      values.forEach(val => {
        const obj = {};
        header.forEach((h, i) => {
          obj[h] = val[i];
        });
        jsonArr.push(obj);
      });

      if (filePath) {
        if (!filePath.endsWith(".json")) {
          filePath = filePath + ".json";
        }

        _fs.default.writeFileSync(filePath, JSON.stringify(jsonArr));
      } else {
        return jsonArr;
      }
    }
  }
};

exports.$toJSON = $toJSON;
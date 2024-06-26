"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$toJSON = exports.$readJSON = void 0;
var __1 = require("../../");
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
var $readJSON = function (file, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, method, headers, frameConfig;
    return __generator(this, function (_b) {
        _a = __assign({ method: "GET", headers: {}, frameConfig: {} }, options), method = _a.method, headers = _a.headers, frameConfig = _a.frameConfig;
        if (typeof file === "string" && file.startsWith("http")) {
            return [2 /*return*/, new Promise(function (resolve) {
                    fetch(file, { method: method, headers: headers }).then(function (response) {
                        if (response.status !== 200) {
                            throw new Error("Failed to load " + file);
                        }
                        response.json().then(function (json) {
                            resolve(new __1.DataFrame(json, frameConfig));
                        });
                    }).catch(function (err) {
                        throw new Error(err);
                    });
                })];
        }
        else if (file instanceof File) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function (event) {
                        var _a;
                        var jsonObj = JSON.parse((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.result);
                        resolve(new __1.DataFrame(jsonObj, frameConfig));
                    };
                })];
        }
        else {
            throw new Error("ParamError: File not supported. file must be a url or an input File object");
        }
        return [2 /*return*/];
    });
}); };
exports.$readJSON = $readJSON;
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
var $toJSON = function (df, options) {
    var _a = __assign({ fileName: "output.json", download: false, format: "column" }, options), fileName = _a.fileName, format = _a.format, download = _a.download;
    if (df.$isSeries) {
        var obj = {};
        obj[df.columns[0]] = df.values;
        if (download) {
            if (!fileName.endsWith(".json")) {
                fileName = fileName + ".json";
            }
            $downloadFileInBrowser(obj, fileName);
        }
        else {
            return obj;
        }
    }
    else {
        if (format === "row") {
            var obj = {};
            for (var i = 0; i < df.columns.length; i++) {
                obj[df.columns[i]] = df.column(df.columns[i]).values;
            }
            if (download) {
                if (!(fileName.endsWith(".json"))) {
                    fileName = fileName + ".json";
                }
                $downloadFileInBrowser(obj, fileName);
            }
            else {
                return obj;
            }
        }
        else {
            var values = df.values;
            var header_1 = df.columns;
            var jsonArr_1 = [];
            values.forEach(function (val) {
                var obj = {};
                header_1.forEach(function (h, i) {
                    obj[h] = val[i];
                });
                jsonArr_1.push(obj);
            });
            if (download) {
                if (!fileName.endsWith(".json")) {
                    fileName = fileName + ".json";
                }
                $downloadFileInBrowser(jsonArr_1, fileName);
            }
            else {
                return jsonArr_1;
            }
        }
    }
};
exports.$toJSON = $toJSON;
/**
 * Internal function to download a JSON file in the browser.
 * @param content A string of JSON file contents
 * @param fileName  The name of the file to be downloaded
 */
var $downloadFileInBrowser = function (content, fileName) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content));
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName;
    hiddenElement.click();
};

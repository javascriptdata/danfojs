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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$openCsvInputStream = exports.$writeCsvOutputStream = exports.$toCSV = exports.$streamCSV = exports.$readCSV = void 0;
var __1 = require("../../");
var request_1 = __importDefault(require("request"));
var papaparse_1 = __importDefault(require("papaparse"));
var stream_1 = __importDefault(require("stream"));
var fs_1 = __importDefault(require("fs"));
/**
 * Reads a CSV file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param options Configuration object. Supports all Papaparse parse config options.
 * @returns DataFrame containing the parsed CSV file.
 * @example
 * ```
 * import { readCSV } from "danfojs-node"
 * const df = await readCSV("https://raw.githubusercontent.com/test.csv")
 * ```
 * @example
 * ```
 * import { readCSV } from "danfojs-node"
 * const df = await readCSV("https://raw.githubusercontent.com/test.csv", {
 *    delimiter: ",",
 *    headers: {
 *      Accept: "text/csv",
 *      Authorization: "Bearer YWRtaW46YWRtaW4="
 *    }
 * })
 * ```
 * @example
 * ```
 * import { readCSV } from "danfojs-node"
 * const df = await readCSV("./data/sample.csv")
 * ```
 */
var $readCSV = function (filePath, options) { return __awaiter(void 0, void 0, void 0, function () {
    var frameConfig;
    return __generator(this, function (_a) {
        frameConfig = (options === null || options === void 0 ? void 0 : options.frameConfig) || {};
        if (filePath.startsWith("http") || filePath.startsWith("https")) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var optionsWithDefaults = __assign({ header: true, dynamicTyping: true, skipEmptyLines: 'greedy' }, options);
                    var dataStream = request_1.default.get(filePath);
                    // reject any non-2xx status codes
                    dataStream.on('response', function (response) {
                        if (response.statusCode < 200 || response.statusCode >= 300) {
                            reject(new Error("HTTP " + response.statusCode + ": " + response.statusMessage));
                        }
                    });
                    var parseStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, optionsWithDefaults);
                    dataStream.pipe(parseStream);
                    var data = [];
                    parseStream.on("data", function (chunk) {
                        data.push(chunk);
                    });
                    parseStream.on("finish", function () {
                        resolve(new __1.DataFrame(data, frameConfig));
                    });
                })];
        }
        else {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, function (err) {
                        if (err) {
                            reject("ENOENT: no such file or directory");
                        }
                        var fileStream = fs_1.default.createReadStream(filePath);
                        papaparse_1.default.parse(fileStream, __assign(__assign({ header: true, dynamicTyping: true }, options), { complete: function (results) {
                                var df = new __1.DataFrame(results.data, frameConfig);
                                resolve(df);
                            } }));
                    });
                })];
        }
        return [2 /*return*/];
    });
}); };
exports.$readCSV = $readCSV;
/**
 * Streams a CSV file from local or remote location in chunks. Intermediate chunks is passed as a DataFrame to the callback function.
 * @param filePath URL or local file path to CSV file. `readCSV` uses PapaParse to parse the CSV file,
 * hence all PapaParse options are supported.
 * @param callback Callback function to be called once the specifed rows are parsed into DataFrame.
 * @param options Configuration object. Supports all Papaparse parse config options.
 * @example
 * ```
 * import { streamCSV } from "danfojs-node"
 * streamCSV("https://raw.githubusercontent.com/test.csv", (dfRow) => {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * })
 * ```
 */
var $streamCSV = function (filePath, callback, options) { return __awaiter(void 0, void 0, void 0, function () {
    var frameConfig, optionsWithDefaults_1;
    return __generator(this, function (_a) {
        frameConfig = (options === null || options === void 0 ? void 0 : options.frameConfig) || {};
        if (filePath.startsWith("http") || filePath.startsWith("https")) {
            optionsWithDefaults_1 = __assign({ header: true, dynamicTyping: true }, options);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var count = 0;
                    var dataStream = request_1.default.get(filePath);
                    // reject any non-2xx status codes
                    dataStream.on('response', function (response) {
                        if (response.statusCode < 200 || response.statusCode >= 300) {
                            reject(new Error("HTTP " + response.statusCode + ": " + response.statusMessage));
                        }
                    });
                    var parseStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, optionsWithDefaults_1);
                    dataStream.pipe(parseStream);
                    parseStream.on("data", function (chunk) {
                        var df = new __1.DataFrame([chunk], __assign(__assign({}, frameConfig), { index: [count++] }));
                        callback(df);
                    });
                    parseStream.on("finish", function () {
                        resolve(null);
                    });
                })];
        }
        else {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, function (err) {
                        if (err) {
                            reject("ENOENT: no such file or directory");
                        }
                        var fileStream = fs_1.default.createReadStream(filePath);
                        var count = 0;
                        papaparse_1.default.parse(fileStream, __assign(__assign({ header: true, dynamicTyping: true }, options), { step: function (results) {
                                var df = new __1.DataFrame([results.data], __assign(__assign({}, frameConfig), { index: [count++] }));
                                callback(df);
                            }, complete: function () { return resolve(null); } }));
                    });
                })];
        }
        return [2 /*return*/];
    });
}); };
exports.$streamCSV = $streamCSV;
/**
 * Converts a DataFrame or Series to CSV.
 * @param df DataFrame or Series to be converted to CSV.
 * @param options Configuration object. Supports the following options:
 * - `filePath`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string.
 * - `header`: Boolean indicating whether to include a header row in the CSV file.
 * - `sep`: Character to be used as a separator in the CSV file.
 * @example
 * ```
 * import { toCSV } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * const csv = toCSV(df)
 * ```
 * @example
 * ```
 * import { toCSV } from "danfojs-node"
 * const df = new DataFrame([[1, 2, 3], [4, 5, 6]])
 * toCSV(df, {
 *     filePath: "./data/sample.csv",
 *     header: true,
 *     sep: "+"
 *   })
 * ```
 */
var $toCSV = function (df, options) {
    var _a = __assign({ sep: ",", header: true, filePath: undefined }, options), filePath = _a.filePath, sep = _a.sep, header = _a.header;
    if (df.$isSeries) {
        var csv = df.values.join(sep);
        if (filePath !== undefined) {
            if (!(filePath.endsWith(".csv"))) {
                filePath = filePath + ".csv";
            }
            fs_1.default.writeFileSync(filePath, csv, "utf8");
        }
        else {
            return csv;
        }
    }
    else {
        var rows = df.values;
        var csvStr = header === true ? df.columns.join(sep) + "\n" : "";
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].join(sep) + "\n";
            csvStr += row;
        }
        if (filePath !== undefined) {
            if (!(filePath.endsWith(".csv"))) {
                filePath = filePath + ".csv";
            }
            fs_1.default.writeFileSync(filePath, csvStr, "utf8");
        }
        else {
            return csvStr;
        }
    }
};
exports.$toCSV = $toCSV;
/**
 * Opens a CSV file from local or remote location as a Stream. Intermediate row is returned as a DataFrame object.
 * @param filePath URL or local file path to CSV file.
 * @param options Configuration object. Supports all Papaparse config options.
 * @example
 * ```
 * import { openCsvInputStream } from "danfojs-node"
 * const csvStream = openCsvInputStream("./data/sample.csv")
 * ```
 */
var $openCsvInputStream = function (filePath, options) {
    var header = __assign({ header: true }, options).header;
    var isFirstChunk = true;
    var ndFrameColumnNames = [];
    var csvInputStream = new stream_1.default.Readable({ objectMode: true });
    csvInputStream._read = function () { };
    if (filePath.startsWith("http") || filePath.startsWith("https")) {
        var dataStream = request_1.default.get(filePath);
        // reject any non-2xx status codes
        dataStream.on('response', function (response) {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                throw new Error("HTTP " + response.statusCode + ": " + response.statusMessage);
            }
        });
        var parseStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, __assign({ header: header, dynamicTyping: true }, options));
        dataStream.pipe(parseStream);
        var count_1 = 0;
        parseStream.on("data", function (chunk) {
            if (isFirstChunk) {
                if (header === true) {
                    ndFrameColumnNames = Object.keys(chunk);
                }
                else {
                    ndFrameColumnNames = chunk;
                }
                isFirstChunk = false;
                return;
            }
            var df = new __1.DataFrame([Object.values(chunk)], {
                columns: ndFrameColumnNames,
                index: [count_1++]
            });
            csvInputStream.push(df);
        });
        parseStream.on("finish", function () {
            csvInputStream.push(null);
            return (null);
        });
        return csvInputStream;
    }
    else {
        var fileStream_1 = fs_1.default.createReadStream(filePath);
        fs_1.default.access(filePath, fs_1.default.constants.F_OK, function (err) {
            if (err) {
                throw new Error("ENOENT: no such file or directory");
            }
            var count = 0;
            papaparse_1.default.parse(fileStream_1, __assign(__assign({}, __assign({ header: header, dynamicTyping: true }, options)), { step: function (results) {
                    if (isFirstChunk) {
                        if (header === true) {
                            ndFrameColumnNames = results.meta.fields || [];
                        }
                        else {
                            ndFrameColumnNames = results.data;
                        }
                        isFirstChunk = false;
                        return;
                    }
                    var df = new __1.DataFrame([results.data], {
                        columns: ndFrameColumnNames,
                        index: [count++]
                    });
                    csvInputStream.push(df);
                }, complete: function (result) {
                    csvInputStream.push(null);
                    return null;
                }, error: function (err) {
                    csvInputStream.emit("error", err);
                } }));
            return csvInputStream;
        });
    }
};
exports.$openCsvInputStream = $openCsvInputStream;
/**
 * Writes a file stream to local storage. Stream objects must be a Series or DataFrame.
 * @param filePath URL or local file path to write to.
 * @param options Configuration object. Supports all `toCSV` options.
 * @example
 * ```
 * import { openCsvInputStream,
 *         writeCsvOutputStream,
 *         convertFunctionTotransformer } from "danfojs-node"
 *
 * const csvStream = openCsvInputStream("./data/sample.csv")
 * const outStream = writeCsvOutputStream("./data/sampleOut.csv")
 *
 * const transformer = (dfRow) =>  {
 *     const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *     return dfModified
 * }
 * csvStream.pipe(convertFunctionTotransformer(transformer)).pipe(outStream)
 * ```
 */
var $writeCsvOutputStream = function (filePath, options) {
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, function (err) {
        if (err) {
            throw new Error("ENOENT: no such file or directory");
        }
        var isFirstRow = true;
        var fileOutputStream = fs_1.default.createWriteStream(filePath);
        var csvOutputStream = new stream_1.default.Writable({ objectMode: true });
        csvOutputStream._write = function (chunk, encoding, callback) {
            if (chunk instanceof __1.DataFrame) {
                if (isFirstRow) {
                    isFirstRow = false;
                    fileOutputStream.write($toCSV(chunk, __assign({ header: true }, options)));
                    callback();
                }
                else {
                    fileOutputStream.write($toCSV(chunk, __assign({ header: false }, options)));
                    callback();
                }
            }
            else if (chunk instanceof __1.Series) {
                fileOutputStream.write($toCSV(chunk));
                callback();
            }
            else {
                csvOutputStream.emit("error", new Error("ValueError: Intermediate chunk must be either a Series or DataFrame"));
            }
        };
        csvOutputStream.on("finish", function () {
            fileOutputStream.end();
        });
        return csvOutputStream;
    });
};
exports.$writeCsvOutputStream = $writeCsvOutputStream;

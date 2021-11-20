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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFunctionTotransformer = exports.streamCsvTransformer = void 0;
var stream_1 = __importDefault(require("stream"));
var io_1 = require("../../io");
/**
 * Converts a function to a pipe transformer.
 * @param func The function to convert to a pipe transformer.
 * @returns A pipe transformer that applies the function to each row of object.
 * @example
 * ```
 * import { convertFunctionTotransformer } from "danfojs-node"
 *
 * const renamer = (dfRow) => {
 *    const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *    return dfModified
 * }
 * const transformer = convertFunctionTotransformer(renamer)
 * ```
 *
*/
var convertFunctionTotransformer = function (func) {
    var transformStream = new stream_1.default.Transform({ objectMode: true });
    transformStream._transform = function (chunk, encoding, callback) {
        var outputChunk = func(chunk);
        transformStream.push(outputChunk);
        callback();
    };
    return transformStream;
};
exports.convertFunctionTotransformer = convertFunctionTotransformer;
/**
 * A pipeline transformer to stream a CSV file from local storage,
 *  transform it with custom transformer, and write to the output stream.
 * @param inputFilePath The path to the CSV file to stream from.
 * @param transformer The transformer function to apply to each row. Note that each row
 * of the CSV file is passed as a DataFrame with a single row to the transformer function, and
 * the transformer function is expected to return a transformed DataFrame.
 * @param options Configuration options for the pipeline. Includes:
 * - `outputFilePath` The local file path to write the transformed CSV file to.
 * - `customCSVStreamWriter` A custom CSV stream writer function. This is applied at the end of each transform.
 * If not provided, the default CSV stream writer is used, and this writes to local storage.
 * - `inputStreamOptions` Configuration options for the input stream. Supports all Papaparse csv reader config options.
 * - `outputStreamOptions` Configuration options for the output stream. This only applies when
 * using the default CSV stream writer. Supports all `toCSV` options.
 * @returns A promise that resolves when the pipeline is complete.
 * @example
 * ```
 * import { streamCsvTransformer } from "danfojs-node"
 *
 * const transformer = (dfRow) => {
 *   const dfModified = dfRow["Names"].map((name) => name.split(",")[0])
 *  return dfModified
 * }
 * const inputFilePath = "./data/input.csv"
 * const outputFilePath = "./data/output.csv"
 *
 * streamCsvTransformer(inputFilePath, transformer, { outputFilePath })
 * ```
*/
var streamCsvTransformer = function (inputFilePath, transformer, options) {
    var _a = __assign({ outputFilePath: "./", inputStreamOptions: {}, outputStreamOptions: {} }, options), outputFilePath = _a.outputFilePath, customCSVStreamWriter = _a.customCSVStreamWriter, inputStreamOptions = _a.inputStreamOptions, outputStreamOptions = _a.outputStreamOptions;
    if (customCSVStreamWriter) {
        (0, io_1.openCsvInputStream)(inputFilePath, inputStreamOptions)
            .pipe(convertFunctionTotransformer(transformer))
            .pipe(customCSVStreamWriter())
            .on("error", function (err) {
            console.error("An error occurred while transforming the CSV file");
            console.error(err);
        });
    }
    else {
        (0, io_1.openCsvInputStream)(inputFilePath, inputStreamOptions)
            .pipe(convertFunctionTotransformer(transformer))
            .pipe((0, io_1.writeCsvOutputStream)(outputFilePath, outputStreamOptions))
            .on("error", function (err) {
            console.error("An error occurred while transforming the CSV file");
            console.error(err);
        });
    }
};
exports.streamCsvTransformer = streamCsvTransformer;

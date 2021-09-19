import { CsvInputOptions, CsvOutputOptions } from "../shared/types"
import DataFrame from "../core/frame"
import Series from "../core/series"
import stream from "stream"
import { writeCsvOutputStream, openCsvInputStream } from "../io"

/**
 * Converts a function to a pipe transformer.
*/
const transformerToStream = (func: (df: DataFrame | Series) => DataFrame | Series) => {
    const transformStream = new stream.Transform({ objectMode: true })
    transformStream._transform = (chunk: any, encoding, callback) => {
        const outputChunk = func(chunk)
        transformStream.push(outputChunk)
        callback()
    }
    return transformStream
}


const streamCsvTransformer = (
    inputFilePath: string,
    transformer: (df: DataFrame | Series) => DataFrame | Series,
    options: {
        outputFilePath?: string,
        customCSVStreamWriter?: any,
        inputStreamOptions?: CsvInputOptions,
        outputStreamOptions?: CsvOutputOptions
    }) => {
    const { outputFilePath, customCSVStreamWriter, inputStreamOptions, outputStreamOptions } = {
        outputFilePath: "./",
        inputStreamOptions: {},
        outputStreamOptions: {},
        ...options
    }

    if (customCSVStreamWriter) {
        openCsvInputStream(inputFilePath, inputStreamOptions)
            .pipe(transformerToStream(transformer))
            .pipe(customCSVStreamWriter())
            .on("error", (err: any) => {
                console.error("An error occurred while transforming the CSV file")
                console.error(err)
            })
    } else {
        openCsvInputStream(inputFilePath, inputStreamOptions)
            .pipe(transformerToStream(transformer))
            .pipe(writeCsvOutputStream(outputFilePath, outputStreamOptions))
            .on("error", (err: any) => {
                console.error("An error occurred while transforming the CSV file")
                console.error(err)
            })
    }
}

export {
    streamCsvTransformer,
    transformerToStream
}
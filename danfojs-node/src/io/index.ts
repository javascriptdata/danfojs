import {
    $readCSV,
    $streamCSV,
    $toCSV,
    $openCsvInputStream,
    $writeCsvOutputStream,
} from "./io.csv"
import {
    $readJSON,
    $toJSON,
    $streamJSON
} from "./io.json"

const toCSV = $toCSV
const readCSV = $readCSV
const streamCSV = $streamCSV
const openCsvInputStream = $openCsvInputStream
const writeCsvOutputStream = $writeCsvOutputStream

const toJSON = $toJSON
const readJSON = $readJSON
const streamJSON = $streamJSON

export {
    readCSV,
    streamCSV,
    toCSV,
    openCsvInputStream,
    writeCsvOutputStream,
    readJSON,
    toJSON,
    streamJSON
}
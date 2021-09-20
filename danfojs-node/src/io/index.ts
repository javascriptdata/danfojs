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
import { $readExcel,$toExcel } from "./io.excel"

const toCSV = $toCSV
const readCSV = $readCSV
const streamCSV = $streamCSV
const openCsvInputStream = $openCsvInputStream
const writeCsvOutputStream = $writeCsvOutputStream

const toJSON = $toJSON
const readJSON = $readJSON
const streamJSON = $streamJSON

const readExcel = $readExcel
const toExcel = $toExcel


export {
    readCSV,
    streamCSV,
    toCSV,
    openCsvInputStream,
    writeCsvOutputStream,
    readJSON,
    toJSON,
    streamJSON,
    readExcel,
    toExcel,
}
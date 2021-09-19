import {
    $readCSV,
    $streamCSV,
    $toCSV,
    $openCsvInputStream,
    $writeCsvOutputStream,
} from "./io.csv"
import { $readJSON } from "./io.json"

const readCSV = $readCSV
const streamCSV = $streamCSV
const toCSV = $toCSV
const openCsvInputStream = $openCsvInputStream
const writeCsvOutputStream = $writeCsvOutputStream
const readJSON = $readJSON

export {
    readCSV,
    streamCSV,
    toCSV,
    openCsvInputStream,
    writeCsvOutputStream,
    readJSON
}
import NDframe from "../core/generic"
import { DATA_TYPES } from "./defaults"

/**
 * Package wide error throwing class
 */
class ErrorThrower {

    throwColumnNamesLengthError = (ndframe: NDframe, columnNames: Array<string>): void => {
        const msg = `Column names length mismatch. You provided a column of length ${columnNames.length} but Ndframe columns has lenght of ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwIndexLengthError = (ndframe: NDframe, index: Array<string | number>): void => {
        const msg = `Index length mismatch. You provided an index of length ${index.length} but Ndframe rows has lenght of ${ndframe.shape[0]}`
        throw new Error(msg)
    }

    throwDtypesLengthError = (ndframe: NDframe, dtypes: Array<string>): void => {
        const msg = `Dtypes length mismatch. You provided a dtype array of length ${dtypes.length} but Ndframe columns has lenght of ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwDtypeNotSupportedError = (dtype: string): void => {
        const msg = `Dtype "${dtype}" not supported. dtype must be one of "${DATA_TYPES}"`
        throw new Error(msg)
    }

    throwColumnLengthError = (ndframe: NDframe, arrLen: number): void => {
        const msg = `Column data length mismatch. You provided data with length ${arrLen} but Ndframe has column of lenght ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwColumnNotFoundError = (ndframe: NDframe): void => {
        const msg = `Column not found!. Column name must be one of ${ndframe.columnNames}`
        throw new Error(msg)
    }

    throwNotImplementedError = (): void => {
        const msg = `Method not implemented`
        throw new Error(msg)
    }

    throwIlocRowIndexError = (): void => {
        const msg = `rows parameter must be a Array. For example: rows: [1,2] or rows: ["0:10"]`
        throw new Error(msg)
    }

    throwIlocColumnsIndexError = (): void => {
        const msg = `columns parameter must be a Array. For example: columns: [1,2] or columns: ["0:10"]`
        throw new Error(msg)
    }
}

export default new ErrorThrower()
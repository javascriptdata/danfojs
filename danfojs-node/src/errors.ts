import { DATA_TYPES } from "./defaults"

/**
 * Package wide error throwing class
 */
class ErrorThrower {

    throwColumnNamesLengthError = (ndframe: any, columnNames: Array<string | number>): void => {
        const msg = `Column names length mismatch. You provided a column of length ${columnNames.length} but Ndframe columns has lenght of ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwIndexLengthError = (ndframe: any, index: Array<string | number>): void => {
        const msg = `Index length mismatch. You provided an index of length ${index.length} but Ndframe rows has lenght of ${ndframe.shape[0]}`
        throw new Error(msg)
    }

    throwDtypesLengthError = (ndframe: any, dtypes: Array<string | number>): void => {
        const msg = `Dtypes length mismatch. You provided a dtype array of length ${dtypes.length} but Ndframe columns has lenght of ${ndframe.shape[1]}`
        throw new Error(msg)
    }

    throwDtypeNotSupportedError = (dtype: string): void => {
        const msg = `Dtype "${dtype}" not supported. dtype must be one of "${DATA_TYPES}"`
        throw new Error(msg)
    }
}

export default new ErrorThrower()
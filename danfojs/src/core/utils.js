export class Utils {
    //remove an element from an array
    remove(arr, index) {

        let new_arr = arr.filter(function (val, i) {
            return i != index;
        });

        return new_arr;
    }

    // Returns if a value is a string
    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    // Returns if a value is really a number
    isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    // Returns if a value is an array
    isArray(value) {
        return value && typeof value === 'object' && value.constructor === Array;
    }

    // Returns if a value is an object
    isObject(value) {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    // Returns if a value is null
    isNull(value) {
        return value === null;
    }

    // Returns if a value is undefined
    isUndefined(value) {
        return typeof value === 'undefined';
    }

    // Returns if a value is a boolean
    isBoolean(value) {
        return typeof value === 'boolean';
    }
}

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

    // // Returns if a value is a boolean
    // isBoolean(value) {
    //     return typeof value === 'boolean';
    // }

    /**
     * Optimized version of random sampling from an array, as implemented in Python
     * 
     *
        Chooses k unique random elements from a population sequence or set.

        Returns a new list containing elements from the population while
        leaving the original population unchanged.  The resulting list is
        in selection order so that all sub-slices will also be valid random
        samples.  This allows raffle winners (the sample) to be partitioned
        into grand prize and second place winners (the subslices).

        Members of the population need not be hashable or unique.  If the
        population contains repeats, then each occurrence is a possible
        selection in the sample.

        To choose a sample in a range of integers, use range as an argument.
        This is especially fast and space efficient for sampling from a
        large population:   sample(range(10000000), 60)

        Sampling without replacement entails tracking either potential
        selections (the array) in a list or previous selections in a set.

        When the number of selections is small compared to the
        population, then tracking selections is efficient, requiring
        only a small set and an occasional reselection.  For
        a larger number of selections, the array tracking method is
        preferred since the list takes less space than the
        set and it doesn't suffer from frequent reselections.
     * 
     * @param {*} array The array to sample values from randomly
     * @param {*} num The number of elements to sample randomly
     */
    // Chooses k unique random elements from array.
    sample_from_iter(array, k, destructive) {
        var n = array.length;

        if (k < 0 || k > n)
            throw new RangeError("Sample larger than population or is negative");

        if (destructive || n <= (k <= 5 ? 21 : 21 + Math.pow(4, Math.ceil(Math.log(k * 3, 4))))) {
            if (!destructive)
                array = Array.prototype.slice.call(array);
            for (var i = 0; i < k; i++) { // invariant: non-selected at [i,n)
                var j = i + Math.random() * (n - i) | 0;
                var x = array[i];
                array[i] = array[j];
                array[j] = x;
            }
            array.length = k; // truncate
            return array;
        } else {
            var selected = new Set();
            // eslint-disable-next-line no-empty
            while (selected.add(Math.random() * n | 0).size < k) { }
            // eslint-disable-next-line no-undef
            return Array.prototype.map.call(selected, i => population[i]);
        }
    }
}



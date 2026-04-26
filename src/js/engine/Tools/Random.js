class Random {

    fromArray(array, count = 1, canRepeat = false) {
        if (!Array.isArray(array) || array.length === 0) {
            throw new Error('Input must be a non-empty array');
        }

        if (count === 1) {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        }

        if (!canRepeat && count > array.length) {
            throw new Error('Cannot select more items than array length when canRepeat is false');
        }

        const result = [];
        const availableIndices = canRepeat ? null : [...Array(array.length).keys()];

        for (let i = 0; i < count; i++) {
            if (canRepeat) {
                const randomIndex = Math.floor(Math.random() * array.length);
                result.push(array[randomIndex]);
            } else {
                const randomIndex = Math.floor(Math.random() * availableIndices.length);
                const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
                result.push(array[selectedIndex]);
            }
        }

        return count === 1 ? result[0] : result;
    }

    /**
     * 
     * @param {Number} min included number 
     * @param {Number} max excluded number
     * @returns 
     */
    range(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

export default new Random();
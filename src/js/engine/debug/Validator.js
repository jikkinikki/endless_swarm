class Validator {
    // Removed _allowedTypes since string-based validation is not needed
    constructor() { }

    isNumber(value) {
        return typeof value == 'number' && Number.isFinite(value) && !isNaN(value);
    }

    isString(value) {
        return typeof value == 'string';
    }

    isBoolean(value) {
        return typeof value == 'boolean';
    }

    isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    isArray(value) {
        return Array.isArray(value);
    }

    isFunction(value) {
        return typeof value === 'function';
    }

    isInstanceOf(value, classRef) {
        return value instanceof classRef;
    }

    /** 
     * * Validates an array of values against an array of expected types.
     * 
     * @param {Array} values - The array of values to validate.
     * @param {Array} expectedTypes - The array of expected types. Each type can be a constructor function or an array of types.
     * @returns {Object} - An object containing a boolean `valid` property and an `errors` object with error messages.
     * @throws {Error} - Throws an error if the input is not valid.
     * 
    */
    validateAll(values, expectedTypes) {
        const errors = {};
        let isValid = true;

        if (!Array.isArray(values) || !Array.isArray(expectedTypes)) {
            throw new Error("Both values and expectedTypes must be arrays.");
        }

        if (values.length !== expectedTypes.length) {
            throw new Error("The length of values and expectedTypes must match.");
        }

        for (let i = 0; i < values.length; i++) {

            const value = values[i];
            const expected = expectedTypes[i];

            const passed = this._checkType(value, expected);

            if (!passed) {
                errors[i] = `Invalid type at index ${i}: ${value}. Got ${typeof value}, expected ${this._describeType(expected)}.`;
                isValid = false;
            }
        }

        for (const key in errors) {
                console.error(errors[key]);
        }

        return isValid;
    }

    validate(value, expected) {
        return this.validateAll([value], [expected]);
    }

    _checkType(value, expected) {

        if (Array.isArray(value) || Array.isArray(expected)) {
            throw new Error("_check type validate single values.");
        }

        try {
            switch (expected) {
                case Number: return this.isNumber(value);
                case String: return this.isString(value);
                case Boolean: return this.isBoolean(value);
                case Object: return this.isObject(value);
                case Array: return this.isArray(value);
                case Function: return this.isFunction(value);
                default: return value instanceof expected || expected(value) === true;
            }
        } catch {
            return false;
        }
    }

    _describeType(expected) {
        if (Array.isArray(expected)) return expected.map(this._describeType.bind(this)).join(" | ");
        if (typeof expected === 'function') return expected.name || "custom validator";
        return "unknown";
    }

    addAllowedType(name, fn) {
        throw new Error("Custom named types not implemented.");
    }
}

export default new Validator();

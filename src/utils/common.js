/**
 * Determines whether a value is a function.
 *
 * @param   {*} val
 * @returns {Boolean}
 */
export function isFunction(val) {
    return typeof val === "function";
}

/**
 * Determines whether a value is a symbol.
 *
 * @param   {*} val
 * @returns {Boolean}
 */
export function isSymbol(val) {
    return typeof val === "symbol";
}

/**
 * Determines whether a value is defined.
 *
 * @param   {*} val
 * @returns {Boolean}
 */
export function isDefined(val) {
    return val !== undefined;
}

/**
 * Returns whether a value is an object.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isObject(val) {
    return typeof val === "object" && val !== null;
}

/**
 * Determines whether a value is even.
 *
 * @param   {Number} val
 * @returns {Boolean}
 */
export function isEven(val) {
    return val % 2 === 0;
}

/**
 * Clamps a value between a minimum and maximum.
 *
 * @param   {Number} val
 * @param   {Number} min
 * @param   {Number} max
 * @returns {Number}
 */
export function clamp(val, min, max) {
    if (min < max) {
        return val < min ? min : val > max ? max : val;
    }
    return val < max ? max : val > min ? min : val;
}

/**
 * Wraps a value between a minimum and maximum.
 *
 * @param   {Number} val
 * @param   {Number} min
 * @param   {Number} max
 * @returns {Number}
 */
export function wrap(val, min, max) {
    if (min < max) {
        return ((((val - min) % (max + 1 - min)) + (max + 1 - min)) % (max + 1 - min)) + min;
    }
    return ((((val - max) % (min + 1 - max)) + (min + 1 - max)) % (min + 1 - max)) + max;
}

/**
 * Returns an array of entries for objects with two levels of keys.
 *
 * @param   {Object} obj
 * @returns {Array}
 */
export function deepEntries(obj) {
    const entries = [];
    Object.entries(obj).forEach(([x, dim]) => {
        Object.entries(dim).forEach(([y, value]) => {
            entries.push([x, y, value]);
        });
    });
    return entries;
}

/**
 * Deep assigns a target object by copying the values of all enumerable own properties from
 * one or more source objects to the target object.
 *
 * @param   {Object}    target
 * @param   {...Object} [sources]
 * @returns {Object}
 */
export function deepAssign(target, ...sources) {
    const output = target || {};
    sources.forEach((obj) => {
        const source = obj || {};
        Object.keys(source).forEach((key) => {
            const value = source[key];
            if (isObject(value) && isDefined(output[key])) {
                const existingValue = isObject(output[key]) ? output[key] : {};
                output[key] = deepAssign({}, existingValue, value);
            } else {
                output[key] = value;
            }
        });
    });
    return output;
}

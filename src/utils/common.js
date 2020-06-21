
/**
 * Determines whether a value is a function.
 *
 * @param   {*} val
 * @returns {Boolean}
 */
export function isFunction(val) {
	return typeof val === 'function';
}

/**
 * Determines whether a value is a symbol.
 *
 * @param   {*} val
 * @returns {Boolean}
 */
export function isSymbol(val) {
	return typeof val === 'symbol';
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
	return typeof val === 'object' && val !== null;
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
	return min < max
		? (val < min ? min : val > max ? max : val)
		: (val < max ? max : val > min ? min : val);
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
	return min < max
		? (((val - min) % (max + 1 - min)) + (max + 1 - min)) % (max + 1 - min) + min
		: (((val - max) % (min + 1 - max)) + (min + 1 - max)) % (min + 1 - max) + max;
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

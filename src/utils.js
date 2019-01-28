
/**
 * Creates a promise to wrap a function. Any synchronous exceptions turn into rejections.
 *
 * @param   {Function} fn
 * @returns {Promise}
 */
export function attempt(fn) {
	return new Promise(resolve => {
		resolve(fn());
	});
}

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
 * Determines whether a value is defined.
 *
 * @param   {*} val
 * @returns {Boolean}
 */
export function isDefined(val) {
	return val !== undefined;
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


/**
 * Creates a promise to wrap a function. Any synchronous exceptions turn into rejections.
 *
 * @param   {Function} fn
 * @returns {Promise}
 */
export function attempt(fn) {
	return new Promise((resolve) => {
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


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

/**
 * Creates a function that returns random values from a weighted distribution.
 *
 * @param   {Array}    entries
 * @param   {Function} random
 * @returns {Function}
 */
export function randomFrom(entries, random) {

	let values = entries.map(el => isDefined(el.value) ? el.value : el);
	let weights = entries.map(el => isDefined(el.weight) ? el.weight : 1);
	let intervals = weights.reduce((array, val, i) => {
		let prev = array[ i - 1 ] || 0;
		array.push(val + prev);
		return array;
	}, []);
	let sum = intervals[ intervals.length - 1 ];

	return () => {
		let r = random() * sum | 0;
		let index = intervals.findIndex(int => r < int);
		return values[ index ];
	};
}


import { isFunction, wrap } from './utils/common';
import { randomFrom } from './utils/random';

export const DataSegment = {

	/**
	 * Creates a new data segment object.
	 *
	 * @param   {Number}   size
	 * @param   {Function} random
	 * @param   {Array}    [regions]
	 * @param   {Object}   [position]
	 * @param   {Object}   [bounds]
	 * @param   {Object}   [mutations]
	 * @returns {Object}
	 */
	create({ size, random, regions, position, bounds, mutations }) {

		let data = dataWithSize(size);
		let muta = mutations || {};

		return {

			get(x, y) {

				if (x >= 0 && x < size && y >= 0 && y < size) {
					return data[ x ][ y ];
				} else if (regions) {
					let local = localize(bounds, regions, position, x, y);

					if (local) {
						return local.region.data.get(local.x, local.y);
					}
				}
			},

			set(x, y, val) {

				if (x >= 0 && x < size && y >= 0 && y < size) {
					data[ x ][ y ] = val;
				} else if (regions) {
					let local = localize(bounds, regions, position, x, y);

					if (local) {
						local.region.data.set(local.x, local.y, val);
					}
				}
			},

			mutate(x, y, val) {

				if (x >= 0 && x < size && y >= 0 && y < size) {
					muta[ `${ x }.${ y }` ] = val;
					data[ x ][ y ] = val;
				} else if (regions) {
					let local = localize(bounds, regions, position, x, y);

					if (local) {
						local.region.data.mutate(local.x, local.y, val);
					}
				}
			},

			each(fn) {

				for (let x = 0; x < size; x++) {
					for (let y = 0; y < size; y++) {
						fn(data[ x ][ y ], x, y);
					}
				}
			},

			map(fn) {

				return data.map((dim, x) => (
					dim.map((el, y) => (
						isFunction(fn) ? fn(el, x, y) : fn
					))
				));
			},

			fill(val) {

				for (let x = 0; x < size; x++) {
					for (let y = 0; y < size; y++) {
						data[ x ][ y ] = isFunction(val)
							? val(data[ x ][ y ], x, y)
							: val;
					}
				}
			},

			randomize(entries) {

				let fn = randomFrom(entries, random);

				for (let x = 0; x < size; x++) {
					for (let y = 0; y < size; y++) {
						data[ x ][ y ] = fn();
					}
				}
			},

			match(entries) {

				let results = [];

				for (let x = 0; x < size; x++) {
					for (let y = 0; y < size; y++) {
						for (let entry of entries) {
							if (entry.matcher(x, y, this)) {
								results.push({ x, y, key: entry.key });
								break;
							}
						}
					}
				}

				return results;
			},

			fromArray(array) {

				for (let x = 0; x < size; x++) {
					for (let y = 0; y < size; y++) {
						data[ x ][ y ] = array[ x ][ y ];
					}
				}
			},

			toArray() {
				return this.map(el => el);
			},

			hasElementAt(x, y) {
				return x >= 0 && x < size && y >= 0 && y < size;
			},

			size() {
				return size;
			},

			mutations() {
				return muta;
			}
		};
	}
};

function dataWithSize(size, val) {

	let data = [];
	for (let x = 0; x < size; x++) {
		data[ x ] = [];
		for (let y = 0; y < size; y++) {
			data[ x ][ y ] = val;
		}
	}
	return data;
}

function localize(bounds, regions, position, x, y) {

	let region = regions[ position.x ][ position.y ];
	let local = { x: position.x, y: position.y };
	let check = compareIndex(region.data, x);

	while (check !== 0) {
		local.x += check;
		x -= check * region.data.size();
		check = compareIndex(region.data, x);
	}

	if (bounds.x.wrap) {
		local.x = wrap(local.x, bounds.x.min, bounds.x.max);
	}

	check = compareIndex(region.data, y);

	while (check !== 0) {
		local.y += check;
		y -= check * region.data.size();
		check = compareIndex(region.data, y);
	}

	if (bounds.y.wrap) {
		local.y = wrap(local.y, bounds.y.min, bounds.y.max);
	}

	let localRegion = regions[ local.x ] && regions[ local.x ][ local.y ];

	if (localRegion) {
		return { region: localRegion, x, y };
	}

	return null;
}

function compareIndex(data, index) {
	return index < 0 ? -1 : index >= data.size() ? 1 : 0;
}

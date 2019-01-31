
import merge from 'merge';
import seedrandom from 'seedrandom/seedrandom';

import * as vec2 from './math/vec2';
import * as effects from './effects';
import { attempt, clamp, wrap, isFunction, isDefined } from './utils';
import Direction from './direction';
import Region from './region';
import RegionGenerator from './region-generator';

/**
 * @type {Object} The default world config.
 */
const DEFAULT_CONFIG = {

	bounds: {
		x: { min: -Infinity, max: Infinity, wrap: false },
		y: { min: -Infinity, max: Infinity, wrap: false }
	},

	seed: null,

	regions: {},

	regionSize: 32,

	chooseRegion: ({ regionTypes }) => regionTypes,

	generate: () => {}
};

/**
 * Creates a new world object.
 *
 * @param   {Object} config
 * @returns {Object}
 */
function createWorld(config) {

	config = merge.recursive(true, DEFAULT_CONFIG, config);

	seedrandom(config.seed, {
		pass(random, seed) {
			config.random = random;
			config.seed = seed;
		}
	});

	let position = { x: 0, y: 0 };
	let data = {};

	sanitize(config);
	initialize(data, position, config);

	return {

		get data() {
			return data;
		},

		get seed() {
			return config.seed;
		},

		get position() {
			return vec2.clone(position);
		},

		get regionTypes() {
			return Object.keys(config.regions);
		},

		get regionSize() {
			return config.regionSize;
		},

		region(pos) {

			let { bounds } = config;

			if (bounds.x.wrap) {
				pos.x = wrap(pos.x, bounds.x.min, bounds.x.max);
			}

			if (bounds.y.wrap) {
				pos.y = wrap(pos.y, bounds.y.min, bounds.y.max);
			}

			return data[ pos.x ] && data[ pos.x ][ pos.y ];
		},

		generate() {

			let regions = Object.values(Direction.NEIGHBORS)
				.map(dir => {
					let pos = vec2.add(position, dir);
					return this.region(pos);
				})
				.filter(Boolean);

			let { seed } = config;
			let regionGenerator = RegionGenerator.create({ regions, seed });

			config.generate({ regions: regionGenerator, effects });
		},

		move(dir) {
			return attempt(() => {

				let { bounds } = config;
				let current = vec2.clone(position);
				position.x = (bounds.x.wrap ? wrap : clamp)(position.x + dir.x, bounds.x.min, bounds.x.max);
				position.y = (bounds.y.wrap ? wrap : clamp)(position.y + dir.y, bounds.y.min, bounds.y.max);
				initialize(data, position, config);

				if (vec2.equals(position, current)) {
					throw Error('World position out of bounds');
				}
			});
		},

		moveNorth() {
			return this.move(Direction.CARDINALS.N);
		},

		moveEast() {
			return this.move(Direction.CARDINALS.E);
		},

		moveSouth() {
			return this.move(Direction.CARDINALS.S);
		},

		moveWest() {
			return this.move(Direction.CARDINALS.W);
		}
	};
}

function sanitize({ bounds, regions }) {

	if (bounds.x.min > 0 || bounds.y.min > 0) {
		throw Error('Invalid minimum bounds must not be greater than zero');
	}

	if (bounds.x.max < 0 || bounds.y.max < 0) {
		throw Error('Invalid maximum bounds must not be less than zero');
	}

	if (bounds.x.wrap && (!isFinite(bounds.x.min) || !isFinite(bounds.x.max))) {
		throw Error('Wrapped bounds must define a minimum and maximum');
	}

	if (bounds.y.wrap && (!isFinite(bounds.y.min) || !isFinite(bounds.y.max))) {
		throw Error('Wrapped bounds must define a minimum and maximum');
	}

	if (Object.keys(regions).length === 0) {
		throw Error('No regions defined');
	}
}

function initialize(data, position, { bounds, regions, chooseRegion, regionSize, seed }) {

	Object.values(Direction.NEIGHBORS).forEach(dir => {

		let regionTypes = Object.keys(regions);
		let min = { x: bounds.x.min, y: bounds.y.min };
		let max = { x: bounds.x.max, y: bounds.y.max };
		let pos = vec2.add(position, dir);

		if (bounds.x.wrap) {
			pos.x = wrap(pos.x, bounds.x.min, bounds.x.max);
		}

		if (bounds.y.wrap) {
			pos.y = wrap(pos.y, bounds.y.min, bounds.y.max);
		}

		if (vec2.intersects(pos, min, max)) {

			data[ pos.x ] = data[ pos.x ] || {};

			if (!data[ pos.x ][ pos.y ]) {

				let random = seedrandom([ seed, pos ]);
				let type = chooseRegion({
					position: pos,
					regionTypes: regionTypes,
					random: random
				});

				if (Array.isArray(type)) {
					type = randomFrom(type, random)();
				}

				if (!regionTypes.includes(type)) {
					throw Error(`Invalid region type "${ type }" has not been defined`);
				}

				data[ pos.x ][ pos.y ] = Region.create({
					type: type,
					position: pos
				});
			}

			let region = data[ pos.x ][ pos.y ];
			region.data = createData({
				size: regionSize,
				random: seedrandom([ seed, pos ]),
				regions: data,
				position: pos,
				bounds: bounds
			});

			if (isFunction(regions[ region.type ].init)) {
				regions[ region.type ].init({
					data: region.data,
					random: seedrandom([ seed, pos ])
				});
			}

			if (region.data.length !== regionSize) {
				throw Error(`Invalid region data must have length of ${ regionSize }`);
			}
		}
	});
}

function createData({ size, random, regions, position, bounds }) {

	let data = Array(size).fill().map(() => Array(size).fill(0));

	data.fill = val => {

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				data[ x ][ y ] = isFunction(val) ? val(x, y) : val;
			}
		}
	};

	data.randomize = entries => {

		data.fill(randomFrom(entries, random));
	};

	data.get = (x, y) => {

		return localize(bounds, regions, position, x, y);
	};

	data.set = (x, y, val) => {

		localize(bounds, regions, position, x, y, val);
	};

	data.duplicate = val => {

		let nextData = [];

		for (let x = 0; x < size; x++) {
			nextData[ x ] = [];
			for (let y = 0; y < size; y++) {
				nextData[ x ][ y ] = isFunction(val) ? val(x, y) : val;
			}
		}

		return nextData;
	};

	return data;
}

function localize(bounds, regions, position, x, y, val) {

	let region = regions[ position.x ][ position.y ];
	let local = { x: position.x, y: position.y };
	let check = compareIndex(region.data, x);

	while (check !== 0) {
		local.x += check;
		x -= check * region.data.length;
		check = compareIndex(region.data, x);
	}

	if (bounds.x.wrap) {
		local.x = wrap(local.x, bounds.x.min, bounds.x.max);
	}

	check = compareIndex(region.data, y);

	while (check !== 0) {
		local.y += check;
		y -= check * region.data.length;
		check = compareIndex(region.data, y);
	}

	if (bounds.y.wrap) {
		local.y = wrap(local.y, bounds.y.min, bounds.y.max);
	}

	let localRegion = regions[ local.x ] && regions[ local.x ][ local.y ];

	if (isDefined(val)) {

		if (localRegion && localRegion.data[ x ] && isDefined(localRegion.data[ x ][ y ])) {
			localRegion.data[ x ][ y ] = val;
		}

	} else {

		return localRegion && localRegion.data[ x ] && localRegion.data[ x ][ y ];
	}
}

function compareIndex(data, index) {
	return index < 0 ? -1 : index >= data.length ? 1 : 0;
}

function randomFrom(entries, random) {

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

export default { create: createWorld };

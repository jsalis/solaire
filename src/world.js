
import merge from 'merge';
import clamp from 'clamp';
import seedrandom from 'seedrandom/seedrandom';

import * as vec2 from './math/vec2';
import { attempt, isFunction, isDefined } from './utils';
import Direction from './direction';
import Region from './region';
import RegionGenerator from './region-generator';

/**
 * @type {Object} The default world config.
 */
const DEFAULT_CONFIG = {

	bounds: {
		min: { x: -Infinity, y: -Infinity },
		max: { x: Infinity, y: Infinity }
	},

	seed: '',

	regions: {},

	regionSize: 32,

	chooseRegion({ regionTypes }) {
		return regionTypes;
	},

	generate() {}
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

			config.generate({ regions: regionGenerator });
		},

		move(dir) {
			return attempt(() => {

				let { bounds } = config;
				let current = vec2.clone(position);
				position.x = clamp(position.x + dir.x, bounds.min.x, bounds.max.x);
				position.y = clamp(position.y + dir.y, bounds.min.y, bounds.max.y);
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

function sanitize({ bounds: { min, max }, regions }) {

	if (min.x > 0 || min.y > 0) {
		throw Error('Invalid minimum bounds must not be greater than zero');
	}

	if (max.x < 0 || max.y < 0) {
		throw Error('Invalid maximum bounds must not be less than zero');
	}

	if (Object.keys(regions).length === 0) {
		throw Error('No regions defined');
	}
}

function initialize(data, position, { bounds, regions, chooseRegion, regionSize, seed }) {

	Object.values(Direction.NEIGHBORS).forEach(dir => {

		let pos = vec2.add(position, dir);
		let regionTypes = Object.keys(regions);

		if (vec2.intersects(pos, bounds.min, bounds.max)) {

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
				position: pos
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

function createData({ size, random, regions, position }) {

	let data = Array(size).fill().map(() => Array(size).fill(0));

	data.fill = fn => {

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				data[ x ][ y ] = fn(x, y);
			}
		}
	};

	data.randomize = entries => {

		data.fill(randomFrom(entries, random));
	};

	data.get = (x, y) => {

		return localize(regions, position, x, y);
	};

	data.set = (x, y, val) => {

		localize(regions, position, x, y, val);
	};

	data.duplicate = fn => {

		let nextData = [];

		for (let x = 0; x < size; x++) {
			nextData[ x ] = [];
			for (let y = 0; y < size; y++) {
				nextData[ x ][ y ] = fn(x, y);
			}
		}

		return nextData;
	};

	return data;
}

function localize(regions, position, x, y, val) {

	let region = regions[ position.x ][ position.y ];
	let local = { x: position.x, y: position.y };
	let check = compareIndex(region.data, x);

	while (check !== 0) {
		local.x += check;
		x -= check * region.data.length;
		check = compareIndex(region.data, x);
	}

	check = compareIndex(region.data, y);

	while (check !== 0) {
		local.y += check;
		y -= check * region.data.length;
		check = compareIndex(region.data, y);
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

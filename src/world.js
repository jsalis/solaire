
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

			let random = seedrandom([ config.seed, position ]);
			let regions = Object.values(Direction.NEIGHBORS)
				.map((dir) => {
					let pos = vec2.add(position, dir);
					return this.region(pos);
				})
				.filter(Boolean);
			let regionGenerator = RegionGenerator.create({ regions });

			config.generate({ regions: regionGenerator, random });
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

	Object.values(Direction.NEIGHBORS).forEach((dir) => {

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
				random: seedrandom([ seed, pos ])
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

function createData({ size, random }) {

	let data = Array(size).fill().map(() => Array(size).fill(0));

	data.fill = (fn) => {

		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[ i ].length; j++) {
				data[ i ][ j ] = fn();
			}
		}
	};

	data.randomize = (entries) => {

		data.fill(randomFrom(entries, random));
	};

	return data;
}

function randomFrom(entries, random) {

	let values = entries.map((el) => isDefined(el.value) ? el.value : el);
	let weights = entries.map((el) => isDefined(el.weight) ? el.weight : 1);
	let intervals = weights.reduce((array, val, i) => {
		let prev = array[ i - 1 ] || 0;
		array.push(val + prev);
		return array;
	}, []);
	let sum = intervals[ intervals.length - 1 ];

	return () => {
		let r = random() * sum | 0;
		let index = intervals.findIndex((int) => r < int);
		return values[ index ];
	};
}

export default { create: createWorld };

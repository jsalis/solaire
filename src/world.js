
import merge from 'merge';
import clamp from 'clamp';
import seedrandom from 'seedrandom/seedrandom';

import * as vec2 from './math/vec2';
import Direction from './direction';
import Region from './region';

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

	chooseRegion({ regionTypes, random }) {

		return regionTypes[ regionTypes.length * random() | 0 ];
	}
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

	let { bounds, seed, regions } = config;
	let position = { x: 0, y: 0 };
	let data = {};

	sanitize(config);
	initialize(data, position, config);

	return {

		get data() {

			return data;
		},

		get seed() {

			return seed;
		},

		get position() {

			return vec2.clone(position);
		},

		get regionTypes() {

			return Object.keys(regions);
		},

		region(pos) {

			return data[ pos.x ] && data[ pos.x ][ pos.y ];
		},

		generate() {

			// TODO
		},

		move(dir) {

			return new Promise((resolve, reject) => {

				let current = vec2.clone(position);

				position.x = clamp(position.x + dir.x, bounds.min.x, bounds.max.x);
				position.y = clamp(position.y + dir.y, bounds.min.y, bounds.max.y);
				initialize(data, position, config);

				if (vec2.equals(position, current)) {

					reject(new Error('World position out of bounds'));

				} else {

					resolve();
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

		throw new Error('Invalid minimum bounds must not be greater than zero');
	}

	if (max.x < 0 || max.y < 0) {

		throw new Error('Invalid maximum bounds must not be less than zero');
	}

	if (Object.keys(regions).length === 0) {

		throw new Error('No regions defined');
	}
}

function initialize(data, position, { bounds, regions, chooseRegion, seed }) {

	Object.values(Direction.NEIGHBORS).forEach((dir) => {

		let pos = vec2.add(position, dir);
		let types = Object.keys(regions);

		if (vec2.intersects(pos, bounds.min, bounds.max)) {

			data[ pos.x ] = data[ pos.x ] || {};

			if (!data[ pos.x ][ pos.y ]) {

				data[ pos.x ][ pos.y ] = Region.create({
					type: chooseRegion({
						position:    pos,
						regionTypes: types,
						random:      seedrandom([ seed, pos ])
					})
				});
			}

			let region = data[ pos.x ][ pos.y ];
			region.data = regions[ region.type ].init({
				random: seedrandom([ seed, pos ])
			});
		}
	});
}

export default { create: createWorld };

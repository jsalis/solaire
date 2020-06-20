
import merge from 'merge';

import * as vec2 from './utils/vec2';
import * as effects from './effects';
import { clamp, wrap, isFunction, deepEntries } from './utils/common';
import { randomWithSeed, randomFrom } from './utils/random';
import { Direction } from './direction';
import { DataSegment } from './data-segment';
import { Region } from './region';
import { RegionGenerator } from './region-generator';

/**
 * @type {Object} The default world config.
 */
const DEFAULT_CONFIG = {
	bounds: {
		x: { min: -Infinity, max: Infinity, wrap: false },
		y: { min: -Infinity, max: Infinity, wrap: false }
	},
	position: {
		x: 0,
		y: 0
	},
	seed: null,
	initialData: {},
	regions: {},
	regionSize: 32,
	chooseRegion: ({ regionTypes }) => regionTypes,
	generate: () => {}
};

export const World = {

	/**
	 * Creates a new world object.
	 *
	 * @param   {Object} config
	 * @returns {Object}
	 */
	create(config) {
		config = merge.recursive(true, DEFAULT_CONFIG, config);
		sanitize(config);

		let { seed } = randomWithSeed(config.seed);
		let position = vec2.clone(config.position);
		let data = createDataObject(config);

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
				return Object.keys(config.regions);
			},

			get regionSize() {
				return config.regionSize;
			},

			region(...args) {
				let pos = args.length === 2 ? { x: args[0], y: args[1] } : args[0];
				let { bounds } = config;

				if (bounds.x.wrap) {
					pos.x = wrap(pos.x, bounds.x.min, bounds.x.max);
				}

				if (bounds.y.wrap) {
					pos.y = wrap(pos.y, bounds.y.min, bounds.y.max);
				}

				return data[ pos.x ] && data[ pos.x ][ pos.y ];
			},

			init(arg) {
				let area = merge.recursive(true, {
					x: { min: -1, max: 1 },
					y: { min: -1, max: 1 }
				}, arg);

				for (let x = area.x.min; x <= area.x.max; x++) { // TODO to number
					for (let y = area.y.min; y <= area.y.max; y++) {
						let pos = vec2.add(position, { x, y });
						initialize(data, pos, config);
					}
				}
			},

			remove(arg) {
				let area = merge.recursive(true, {
					x: { min: -1, max: 1 },
					y: { min: -1, max: 1 }
				}, arg);

				for (let x = area.x.min; x <= area.x.max; x++) { // TODO to number
					for (let y = area.y.min; y <= area.y.max; y++) {
						let pos = vec2.add(position, { x, y });
						data[pos.x][pos.y] = undefined;
					}
				}
			},

			generate(arg) {
				let area = merge.recursive(true, {
					x: { min: -1, max: 1 },
					y: { min: -1, max: 1 }
				}, arg);

				let regionTypes = Object.keys(config.regions);
				let regions = [];

				for (let x = area.x.min; x <= area.x.max; x++) { // TODO to number
					for (let y = area.y.min; y <= area.y.max; y++) {
						let pos = vec2.add(position, { x, y });
						let reg = this.region(pos);

						if (reg) {
							regions.push(reg);
						}
					}
				}

				let regionGenerator = RegionGenerator.create({ regionTypes, regions, seed });
				config.generate({ regions: regionGenerator, effects });
				mutate(data, position, config);
			},

			move(...args) {
				let dir = args.length === 2 ? { x: args[0], y: args[1] } : args[0];

				if (dir.x === 0 && dir.y === 0) {
					return;
				}

				let { bounds } = config;
				let current = vec2.clone(position);
				position.x = (bounds.x.wrap ? wrap : clamp)(position.x + dir.x, bounds.x.min, bounds.x.max);
				position.y = (bounds.y.wrap ? wrap : clamp)(position.y + dir.y, bounds.y.min, bounds.y.max);

				if (vec2.equals(position, current)) {
					throw Error('World position out of bounds');
				}
			},

			serialize() {
				let { bounds, regionSize } = config;
				let initialData = deepEntries(data).reduce((result, [x, y, region]) => {
					result[ x ] = result[ x ] || {};
					result[ x ][ y ] = {
						type: region.type,
						mutations: region.mutations
					};
					return result;
				}, {});

				return {
					seed,
					position,
					bounds,
					regionSize,
					initialData
				};
			}
		};
	}
};

function createDataObject({ initialData, bounds, regions, regionSize, seed }) {
	return deepEntries(initialData).reduce((result, [x, y, config]) => {
		const region = Region.create({
			position: { x, y },
			type: config.type,
			mutations: config.mutations
		});

		region.data = DataSegment.create({
			size: regionSize,
			random: randomWithSeed([ seed, config.position ]), // TODO use config.region seed if exists
			regions: result,
			position: config.position,
			bounds: bounds,
			mutations: config.mutations
		});

		if (isFunction(regions[ region.type ].init)) { // TODO delay init?
			regions[ region.type ].init({
				data: region.data,
				random: randomWithSeed([ seed, config.position ])
			});
		}

		result[ x ] = result[ x ] || {};
		result[ x ][ y ] = region;
		return result;
	}, {});
}

function sanitize({ bounds, regions }) {
	if (bounds.x.min > 0 || bounds.y.min > 0) {
		throw Error('Minimum bounds must not be greater than zero');
	}

	if (bounds.x.max < 0 || bounds.y.max < 0) {
		throw Error('Maximum bounds must not be less than zero');
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
	let regionTypes = Object.keys(regions);
	let min = { x: bounds.x.min, y: bounds.y.min };
	let max = { x: bounds.x.max, y: bounds.y.max };
	let pos = vec2.clone(position);

	if (bounds.x.wrap) {
		pos.x = wrap(pos.x, bounds.x.min, bounds.x.max);
	}

	if (bounds.y.wrap) {
		pos.y = wrap(pos.y, bounds.y.min, bounds.y.max);
	}

	if (vec2.intersects(pos, min, max)) {
		data[ pos.x ] = data[ pos.x ] || {};

		if (!data[ pos.x ][ pos.y ]) {
			let random = randomWithSeed([ seed, pos ]);
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

		region.data = DataSegment.create({
			size: regionSize,
			random: randomWithSeed([ seed, pos ]),
			regions: data,
			position: pos,
			bounds: bounds,
			mutations: region.mutations
		});

		if (isFunction(regions[ region.type ].init)) {
			regions[ region.type ].init({
				data: region.data,
				random: randomWithSeed([ seed, pos ])
			});
		}
	}
}

function mutate(data, position, { bounds }) {
	Object.values(Direction.NEIGHBORS).forEach(dir => { // TODO use generate area
		let pos = vec2.add(position, dir);

		if (bounds.x.wrap) {
			pos.x = wrap(pos.x, bounds.x.min, bounds.x.max);
		}

		if (bounds.y.wrap) {
			pos.y = wrap(pos.y, bounds.y.min, bounds.y.max);
		}

		let region = data[ pos.x ] && data[ pos.x ][ pos.y ];

		if (region) {
			Object.entries(region.mutations).forEach(([ key, val ]) => {
				let [ x, y ] = key.split('.');
				region.data.set(x, y, val);
			});
		}
	});
}

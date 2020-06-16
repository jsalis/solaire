
import { World } from '../src/world';
import { Direction } from '../src/direction';

describe('World', () => {

	let config;

	beforeEach(() => {
		config = {
			regionSize: 3,
			regions: {
				example: {}
			}
		};
	});

	it('must not initialize neighbor regions', () => {
		let world = World.create(config);
		Object.values(Direction.NEIGHBORS).forEach(dir => {
			expect(world.region(dir)).toEqual(undefined);
		});
	});

	describe('config.bounds', () => {

		it('must bound the north movement', () => {
			config.bounds = {
				y: { min: -1 }
			};
			let world = World.create(config);
			world.move(Direction.CARDINALS.N);
			expect(() => world.move(Direction.CARDINALS.N)).toThrow('World position out of bounds');
			expect(world.position).toEqual({ x: 0, y: -1 });
		});

		it('must bound the east movement', () => {
			config.bounds = {
				x: { max: 1 }
			};
			let world = World.create(config);
			world.move(Direction.CARDINALS.E);
			expect(() => world.move(Direction.CARDINALS.E)).toThrow('World position out of bounds');
			expect(world.position).toEqual({ x: 1, y: 0 });
		});

		it('must bound the south movement', () => {
			config.bounds = {
				y: { max: 1 }
			};
			let world = World.create(config);
			world.move(Direction.CARDINALS.S);
			expect(() => world.move(Direction.CARDINALS.S)).toThrow('World position out of bounds');
			expect(world.position).toEqual({ x: 0, y: 1 });
		});

		it('must bound the west movement', () => {
			config.bounds = {
				x: { min: -1 }
			};
			let world = World.create(config);
			world.move(Direction.CARDINALS.W);
			expect(() => world.move(Direction.CARDINALS.W)).toThrow('World position out of bounds');
			expect(world.position).toEqual({ x: -1, y: 0 });
		});

		it('must initialize only one region with minimum bounds', () => {
			config.bounds = {
				x: { min: 0, max: 0 },
				y: { min: 0, max: 0 }
			};
			let world = World.create(config);
			world.init();
			expect(world.region({ x: 0, y: 0 })).toEqual(expect.any(Object));
			Object.values(Direction.CARDINALS).forEach(dir => {
				expect(world.region(dir)).toBe(undefined);
			});
			Object.values(Direction.ORDINALS).forEach(dir => {
				expect(world.region(dir)).toBe(undefined);
			});
		});

		it('must only initialize regions within the bounds', () => {
			config.bounds = {
				x: { min: -1, max: 1 },
				y: { min: -1, max: 1 }
			};
			let world = World.create(config);
			world.move(Direction.CARDINALS.S);
			world.init();
			let position = world.position;
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				let x = position.x + dir.x;
				let y = position.y + dir.y;
				let value = y > 1 ? undefined : expect.any(Object);
				expect(world.region({ x, y })).toEqual(value);
			});
		});

		it('must throw if the minimum bounds are invalid', () => {
			config.bounds = {
				x: { min: 1 },
				y: { min: 2 }
			};
			let fn = () => World.create(config);
			expect(fn).toThrow('Minimum bounds must not be greater than zero');
		});

		it('must throw if the maximum bounds are invalid', () => {
			config.bounds = {
				x: { max: -1 },
				y: { max: -2 }
			};
			let fn = () => World.create(config);
			expect(fn).toThrow('Maximum bounds must not be less than zero');
		});

		it('must throw if the "x" minimum bound is undefined with wrap enabled', () => {
			config.bounds = {
				x: { max: 1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrow('Wrapped bounds must define a minimum and maximum');
		});

		it('must throw if the "x" maximum bound is undefined with wrap enabled', () => {
			config.bounds = {
				x: { min: -1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrow('Wrapped bounds must define a minimum and maximum');
		});

		it('must throw if the "y" minimum bound is undefined with wrap enabled', () => {
			config.bounds = {
				y: { max: 1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrow('Wrapped bounds must define a minimum and maximum');
		});

		it('must throw if the "y" maximum bound is undefined with wrap enabled', () => {
			config.bounds = {
				y: { min: -1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrow('Wrapped bounds must define a minimum and maximum');
		});
	});

	describe('config.seed', () => {

		it('must set world seed', () => {
			config.seed = 'abc123';
			let world = World.create(config);
			expect(world.seed).toBe(config.seed);
		});
	});

	describe('config.regions', () => {

		it('must set the list of possible region types', () => {
			let world = World.create({
				regions: {
					cave: {},
					dungeon: {}
				}
			});
			expect(world.regionTypes).toEqual([
				'cave',
				'dungeon'
			]);
		});

		it('must throw if no regions are given', () => {
			config.regions = {};
			let fn = () => World.create(config);
			expect(fn).toThrow('No regions defined');
		});

		it('must initialize each region using the given function', () => {
			let init = jest.fn();
			let world = World.create({
				regions: {
					cave: {
						init
					}
				}
			});
			world.init();
			expect(init).toHaveBeenCalledTimes(9);
		});

		it('must pass a random number generator to each region initializer', () => {
			let init = jest.fn(
				({ data, random }) => {
					data.fill(random);
				}
			);
			let world = World.create({
				regionSize: 3,
				regions: {
					cave: {
						init
					}
				}
			});
			world.init();
			let region = world.region({ x: 0, y: 0 });
			let uniques = {};
			region.data.each(el => {
				uniques[ el ] = true;
			});
			expect(Object.keys(uniques).length).toBe(9);
		});
	});

	describe('config.regionSize', () => {

		it('must set world region size', () => {
			let regionSize = 3;
			let world = World.create({
				regionSize,
				regions: {
					cave: {}
				}
			});
			expect(world.regionSize).toBe(regionSize);
		});

		it('must initialize region data to the given size', () => {
			let regionSize = 3;
			let world = World.create({
				regionSize,
				regions: {
					cave: {}
				}
			});
			world.init();
			let region = world.region({ x: 0, y: 0 });
			expect(region.data.size()).toEqual(regionSize);
		});
	});

	describe('config.chooseRegion', () => {

		it('must determine the type of region for a given position', () => {
			let regions = {
				cave: {},
				dungeon: {}
			};
			let chooseRegion = jest.fn(
				({ position, regionTypes }) => (position.x + position.y === 0) ? regionTypes[0] : regionTypes[1]
			);
			let world = World.create({
				regions,
				chooseRegion
			});
			world.init();
			expect(chooseRegion).toHaveBeenCalledTimes(9);
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				let type = chooseRegion({
					position: dir,
					regionTypes: Object.keys(regions)
				});
				expect(world.region(dir)).toEqual(
					expect.objectContaining({ type })
				);
			});
		});

		it('must choose from an array of weighted types', () => {
			let regions = {
				first: {},
				second: {},
				third: {}
			};
			let chooseRegion = jest.fn(
				() => [
					{ value: 'first', weight: 1 },
					{ value: 'second', weight: 1 },
					{ value: 'third', weight: 0 }
				]
			);
			let world = World.create({
				regions,
				chooseRegion
			});
			world.init();
			expect(chooseRegion).toHaveBeenCalledTimes(9);
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				expect(world.region(dir)).not.toEqual(
					expect.objectContaining({ type: 'third' })
				);
			});
		});

		it('must throw if a valid region type is not returned', () => {
			let regions = {
				cave: {},
				dungeon: {}
			};
			let chooseRegion = jest.fn(() => 'mountains');
			let world = World.create({ regions, chooseRegion });
			let fn = () => world.init();
			expect(fn).toThrow('Invalid region type "mountains" has not been defined');
		});
	});

	describe('region', () => {

		it('must return the region at the given position', () => {
			let world = World.create(config);
			world.init();
			expect(world.region({ x: 0, y: 0 })).toBe(world.data[ 0 ][ 0 ]);
		});

		it('must support position as two arguments', () => {
			let world = World.create(config);
			world.init();
			expect(world.region(1, -1)).toBe(world.data[ 1 ][ -1 ]);
		});

		it('must return undefined if the region does not exist', () => {
			let world = World.create(config);
			world.init();
			expect(world.region({ x: 8, y: 8 })).toBe(undefined);
		});

		it('must wrap an out-of-bounds "x" position when enabled', () => {
			config.bounds = {
				x: { min: -1, max: 1, wrap: true }
			};
			let world = World.create(config);
			world.init();
			expect(world.region({ x: -2, y: 0 })).toBe(world.data[ 1 ][ 0 ]);
		});

		it('must wrap an out-of-bounds "y" position when enabled', () => {
			config.bounds = {
				y: { min: -1, max: 1, wrap: true }
			};
			let world = World.create(config);
			world.init();
			expect(world.region({ x: 0, y: -2 })).toBe(world.data[ 0 ][ 1 ]);
		});
	});

	describe('position', () => {

		it('must not be mutable', () => {
			let world = World.create(config);
			world.position.x = 1;
			world.position.y = 2;
			expect(world.position).toEqual({ x: 0, y: 0 });
		});
	});

	describe('init', () => {

		it('must initialize neighbor regions at the current position', () => {
			let world = World.create(config);
			world.init();
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				expect(world.region(dir)).toEqual(expect.any(Object));
			});
		});

		it('must set the position of all neighbor regions', () => {
			let world = World.create(config);
			world.init();
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				expect(world.region(dir).position).toEqual({ x: dir.x, y: dir.y });
			});
		});
	});

	describe('generate', () => {

		it('must pass a list of regions that are the neighbors to the current position', () => {
			config.generate = jest.fn();
			let world = World.create(config);
			world.init();
			world.generate();
			expect(config.generate).toHaveBeenCalledWith(
				expect.objectContaining({
					regions: expect.any(Object)
				})
			);
			let { regions } = config.generate.mock.calls[config.generate.mock.calls.length - 1][0];
			expect(regions.get()).toEqual([
				world.region({ x: -1, y: -1 }),
				world.region({ x: -1, y: 0 }),
				world.region({ x: -1, y: 1 }),
				world.region({ x: 0, y: -1 }),
				world.region({ x: 0, y: 0 }),
				world.region({ x: 0, y: 1 }),
				world.region({ x: 1, y: -1 }),
				world.region({ x: 1, y: 0 }),
				world.region({ x: 1, y: 1 })
			]);
		});
	});

	describe('move', () => {

		it('must handle a direction of zero length', () => {
			let world = World.create(config);
			world.move(Direction.ORIGIN.C);
			expect(world.position).toEqual({ x: 0, y: 0 });
		});

		it('must support direction as two arguments', () => {
			let world = World.create(config);
			world.move(1, -1);
			expect(world.position).toEqual({ x: 1, y: -1 });
		});
	});
});

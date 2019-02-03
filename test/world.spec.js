
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

	it('must initialize regions at the origin', () => {
		let world = World.create(config);
		Object.values(Direction.NEIGHBORS).forEach(dir => {
			expect(world.region(dir)).toEqual(jasmine.any(Object));
		});
	});

	it('must set the position of all regions', () => {
		let world = World.create(config);
		Object.values(Direction.NEIGHBORS).forEach(dir => {
			expect(world.region(dir).position).toEqual({ x: dir.x, y: dir.y });
		});
	});

	describe('config.bounds', () => {

		it('must bound the north movement', done => {
			config.bounds = {
				y: { min: -1 }
			};
			let world = World.create(config);
			world.moveNorth()
				.catch(done.fail);
			world.moveNorth()
				.then(done.fail)
				.catch(error => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: 0, y: -1 });
		});

		it('must bound the east movement', done => {
			config.bounds = {
				x: { max: 1 }
			};
			let world = World.create(config);
			world.moveEast()
				.catch(done.fail);
			world.moveEast()
				.then(done.fail)
				.catch(error => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: 1, y: 0 });
		});

		it('must bound the south movement', done => {
			config.bounds = {
				y: { max: 1 }
			};
			let world = World.create(config);
			world.moveSouth()
				.catch(done.fail);
			world.moveSouth()
				.then(done.fail)
				.catch(error => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: 0, y: 1 });
		});

		it('must bound the west movement', done => {
			config.bounds = {
				x: { min: -1 }
			};
			let world = World.create(config);
			world.moveWest()
				.catch(done.fail);
			world.moveWest()
				.then(done.fail)
				.catch(error => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: -1, y: 0 });
		});

		it('must initialize only one region with minimum bounds', () => {
			config.bounds = {
				x: { min: 0, max: 0 },
				y: { min: 0, max: 0 }
			};
			let world = World.create(config);
			expect(world.region({ x: 0, y: 0 })).toEqual(jasmine.any(Object));
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
			world.moveSouth();
			let position = world.position;
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				let x = position.x + dir.x;
				let y = position.y + dir.y;
				let value = y > 1 ? undefined : jasmine.any(Object);
				expect(world.region({ x, y })).toEqual(value);
			});
		});

		it('must throw if the minimum bounds are invalid', () => {
			config.bounds = {
				x: { min: 1 },
				y: { min: 2 }
			};
			let fn = () => World.create(config);
			expect(fn).toThrowError('Minimum bounds must not be greater than zero');
		});

		it('must throw if the maximum bounds are invalid', () => {
			config.bounds = {
				x: { max: -1 },
				y: { max: -2 }
			};
			let fn = () => World.create(config);
			expect(fn).toThrowError('Maximum bounds must not be less than zero');
		});

		it('must throw if the "x" minimum bound is undefined with wrap enabled', () => {
			config.bounds = {
				x: { max: 1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrowError('Wrapped bounds must define a minimum and maximum');
		});

		it('must throw if the "x" maximum bound is undefined with wrap enabled', () => {
			config.bounds = {
				x: { min: -1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrowError('Wrapped bounds must define a minimum and maximum');
		});

		it('must throw if the "y" minimum bound is undefined with wrap enabled', () => {
			config.bounds = {
				y: { max: 1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrowError('Wrapped bounds must define a minimum and maximum');
		});

		it('must throw if the "y" maximum bound is undefined with wrap enabled', () => {
			config.bounds = {
				y: { min: -1, wrap: true }
			};
			let fn = () => World.create(config);
			expect(fn).toThrowError('Wrapped bounds must define a minimum and maximum');
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
			expect(fn).toThrowError('No regions defined');
		});

		it('must initialize each region using the given function', () => {
			let init = jasmine.createSpy('init');
			World.create({
				regions: {
					cave: {
						init
					}
				}
			});
			expect(init).toHaveBeenCalledTimes(9);
		});

		it('must pass a random number generator to each region initializer', () => {
			let init = jasmine.createSpy('init').and.callFake(({ data, random }) => {
				data.fill(random);
			});
			let world = World.create({
				regionSize: 3,
				regions: {
					cave: {
						init
					}
				}
			});
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
			let chooseRegion = jasmine.createSpy('chooseRegion').and.callFake(
				({ position, regionTypes }) => (position.x + position.y === 0) ? regionTypes[0] : regionTypes[1]
			);
			let world = World.create({
				regions,
				chooseRegion
			});
			expect(chooseRegion).toHaveBeenCalledTimes(9);
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				let type = chooseRegion({
					position: dir,
					regionTypes: Object.keys(regions)
				});
				expect(world.region(dir)).toEqual(
					jasmine.objectContaining({ type })
				);
			});
		});

		it('must choose from an array of weighted types', () => {
			let regions = {
				first: {},
				second: {},
				third: {}
			};
			let chooseRegion = jasmine.createSpy('chooseRegion').and.callFake(
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
			expect(chooseRegion).toHaveBeenCalledTimes(9);
			Object.values(Direction.NEIGHBORS).forEach(dir => {
				expect(world.region(dir)).not.toEqual(
					jasmine.objectContaining({ type: 'third' })
				);
			});
		});

		it('must throw if a valid region type is not returned', () => {
			let regions = {
				cave: {},
				dungeon: {}
			};
			let chooseRegion = jasmine.createSpy('chooseRegion').and.callFake(
				() => 'mountains'
			);
			let fn = () => World.create({ regions, chooseRegion });
			expect(fn).toThrowError('Invalid region type "mountains" has not been defined');
		});
	});

	describe('region', () => {

		it('must return the region at the given position', () => {
			let world = World.create(config);
			expect(world.region({ x: 0, y: 0 })).toBe(world.data[ 0 ][ 0 ]);
		});

		it('must return undefined if the region does not exist', () => {
			let world = World.create(config);
			expect(world.region({ x: 8, y: 8 })).toBe(undefined);
		});

		it('must wrap an out-of-bounds "x" position when enabled', () => {
			config.bounds = {
				x: { min: -1, max: 1, wrap: true }
			};
			let world = World.create(config);
			expect(world.region({ x: -2, y: 0 })).toBe(world.data[ 1 ][ 0 ]);
		});

		it('must wrap an out-of-bounds "y" position when enabled', () => {
			config.bounds = {
				y: { min: -1, max: 1, wrap: true }
			};
			let world = World.create(config);
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

	describe('generate', () => {

		it('must pass a list of regions that are the neighbors to the current position', () => {
			config.generate = jasmine.createSpy('generate');
			let world = World.create(config);
			world.generate();
			expect(config.generate).toHaveBeenCalledWith(
				jasmine.objectContaining({
					regions: jasmine.any(Object)
				})
			);
			let { regions } = config.generate.calls.mostRecent().args[0];
			expect(regions.get()).toEqual([
				world.region({ x: 0, y: 0 }),
				world.region({ x: 0, y: -1 }),
				world.region({ x: 1, y: 0 }),
				world.region({ x: 0, y: 1 }),
				world.region({ x: -1, y: 0 }),
				world.region({ x: 1, y: -1 }),
				world.region({ x: 1, y: 1 }),
				world.region({ x: -1, y: 1 }),
				world.region({ x: -1, y: -1 })
			]);
		});
	});

	describe('move', () => {

		it('must handle a direction of zero length');
	});

	describe('moveNorth', () => {

		it('must move the current position north by one unit', done => {
			let world = World.create(config);
			world.moveNorth()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: 0, y: -1 });
		});
	});

	describe('moveEast', () => {

		it('must move the current position east by one unit', done => {
			let world = World.create(config);
			world.moveEast()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: 1, y: 0 });
		});
	});

	describe('moveSouth', () => {

		it('must move the current position south by one unit', done => {
			let world = World.create(config);
			world.moveSouth()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: 0, y: 1 });
		});
	});

	describe('moveWest', () => {

		it('must move the current position west by one unit', done => {
			let world = World.create(config);
			world.moveWest()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: -1, y: 0 });
		});
	});
});


import World from '../src/world';
import Direction from '../src/direction';

describe('World', () => {

	it('must initialize regions at the origin', () => {
		let world = World.create();
		Object.values(Direction.NEIGHBORS).forEach((dir) => {
			expect(world.region(dir)).toEqual(jasmine.any(Object));
		});
	});

	describe('config.bounds', () => {

		it('must bound the north movement', (done) => {
			let world = World.create({
				bounds: {
					min: { y: -1 }
				}
			});
			world.moveNorth()
				.catch(done.fail);
			world.moveNorth()
				.then(done.fail)
				.catch((error) => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: 0, y: -1 });
		});

		it('must bound the east movement', (done) => {
			let world = World.create({
				bounds: {
					max: { x: 1 }
				}
			});
			world.moveEast()
				.catch(done.fail);
			world.moveEast()
				.then(done.fail)
				.catch((error) => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: 1, y: 0 });
		});

		it('must bound the south movement', (done) => {
			let world = World.create({
				bounds: {
					max: { y: 1 }
				}
			});
			world.moveSouth()
				.catch(done.fail);
			world.moveSouth()
				.then(done.fail)
				.catch((error) => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: 0, y: 1 });
		});

		it('must bound the west movement', (done) => {
			let world = World.create({
				bounds: {
					min: { x: -1 }
				}
			});
			world.moveWest()
				.catch(done.fail);
			world.moveWest()
				.then(done.fail)
				.catch((error) => {
					expect(error).toEqual(jasmine.any(Error));
					expect(error.message).toBe('World position out of bounds');
					done();
				});
			expect(world.position).toEqual({ x: -1, y: 0 });
		});

		it('must initialize only one region with minimum bounds', () => {
			let world = World.create({
				bounds: {
					min: { x: 0, y: 0 },
					max: { x: 0, y: 0 }
				}
			});
			expect(world.region({ x: 0, y: 0 })).toEqual(jasmine.any(Object));
			Object.values(Direction.CARDINALS).forEach((dir) => {
				expect(world.region(dir)).toBe(undefined);
			});
			Object.values(Direction.ORDINALS).forEach((dir) => {
				expect(world.region(dir)).toBe(undefined);
			});
		});

		it('must only initialize regions within the bounds', () => {
			let world = World.create({
				bounds: {
					min: { x: -1, y: -1 },
					max: { x: 1, y: 1 }
				}
			});
			world.moveSouth();
			let position = world.position;
			Object.values(Direction.NEIGHBORS).forEach((dir) => {
				let x = position.x + dir.x;
				let y = position.y + dir.y;
				let value = y > 1 ? undefined : jasmine.any(Object);
				expect(world.region({ x, y })).toEqual(value);
			});
		});

		it('must throw if the minimum bounds are invalid', () => {
			let fn = () => World.create({
				bounds: {
					min: { x: 1, y: 2 }
				}
			});
			expect(fn).toThrowError('Invalid minimum bounds must not be greater than zero');
		});

		it('must throw if the maximum bounds are invalid', () => {
			let fn = () => World.create({
				bounds: {
					max: { x: -1, y: -2 }
				}
			});
			expect(fn).toThrowError('Invalid maximum bounds must not be less than zero');
		});
	});

	describe('region', () => {

		it('must return the region at the given point', () => {
			let world = World.create();
			expect(world.region({ x: 0, y: 0 })).toBe(world.data[ 0 ][ 0 ]);
		});

		it('must return undefined if the region does not exist', () => {
			let world = World.create();
			expect(world.region({ x: 8, y: 8 })).toBe(undefined);
		});
	});

	describe('position', () => {

		it('must not be mutable', () => {
			let world = World.create();
			world.position.x = 1;
			world.position.y = 2;
			expect(world.position).toEqual({ x: 0, y: 0 });
		});
	});

	describe('move', () => {

		it('must handle a direction of zero length');
	});

	describe('moveNorth', () => {

		it('must move the current position north by one unit', (done) => {
			let world = World.create();
			world.moveNorth()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: 0, y: -1 });
		});
	});

	describe('moveEast', () => {

		it('must move the current position east by one unit', (done) => {
			let world = World.create();
			world.moveEast()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: 1, y: 0 });
		});
	});

	describe('moveSouth', () => {

		it('must move the current position south by one unit', (done) => {
			let world = World.create();
			world.moveSouth()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: 0, y: 1 });
		});
	});

	describe('moveWest', () => {

		it('must move the current position west by one unit', (done) => {
			let world = World.create();
			world.moveWest()
				.then(done)
				.catch(done.fail);
			expect(world.position).toEqual({ x: -1, y: 0 });
		});
	});
});

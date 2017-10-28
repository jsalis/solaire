
import World from '../src/world';
import Direction from '../src/direction';

describe('World', () => {

	it('must initialize neighbors at the origin', () => {
		let world = World.create();
		Object.values(Direction.NEIGHBORS).forEach((dir) => {
			expect(world.data[ dir.row ][ dir.col ]).toEqual(jasmine.any(Object));
		});
	});

	describe('moveNorth', () => {

		it('must move the current position north by one unit', () => {
			let world = World.create();
			world.moveNorth();
			expect(world.position).toEqual({ row: -1, col: 0 });
		});
	});

	describe('moveEast', () => {

		it('must move the current position east by one unit', () => {
			let world = World.create();
			world.moveEast();
			expect(world.position).toEqual({ row: 0, col: 1 });
		});
	});

	describe('moveSouth', () => {

		it('must move the current position south by one unit', () => {
			let world = World.create();
			world.moveSouth();
			expect(world.position).toEqual({ row: 1, col: 0 });
		});
	});

	describe('moveWest', () => {

		it('must move the current position west by one unit', () => {
			let world = World.create();
			world.moveWest();
			expect(world.position).toEqual({ row: 0, col: -1 });
		});
	});
});


import Direction from './direction';
import Region from './region';

export default { create: createWorld };

function createWorld() {

	let data = {};
	let current = { row: 0, col: 0 };

	initialize(data, current);

	return {

		get data() {

			return data;
		},

		get position() {

			return {
				row: current.row,
				col: current.col
			};
		},

		generate() {

			// TODO
		},

		move(dir) {

			current.row += dir.row;
			current.col += dir.col;
			initialize(data, current);
		},

		moveNorth() {

			this.move(Direction.CARDINALS.N);
		},

		moveEast() {

			this.move(Direction.CARDINALS.E);
		},

		moveSouth() {

			this.move(Direction.CARDINALS.S);
		},

		moveWest() {

			this.move(Direction.CARDINALS.W);
		}
	};
}

function initialize(data, pos) {

	Object.values(Direction.NEIGHBORS).forEach((dir) => {

		let row = pos.row + dir.row;
		let col = pos.col + dir.col;

		data[ row ] = data[ row ] || {};
		data[ row ][ col ] = data[ row ][ col ] || Region.create();
	});
}

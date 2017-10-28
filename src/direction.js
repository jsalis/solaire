
/**
 * @class Direction
 */
export default class Direction {

	/**
	 * @constructor
	 * @param {Number} row  The row direction.
	 * @param {Number} col  The column direction.
	 */
	constructor(row, col) {

		this.row = row;
		this.col = col;
	}

	get y() {

		return this.row;
	}

	get x() {

		return this.col;
	}
}

Direction.ORIGIN = {
	C: new Direction(0, 0)
};

Direction.CARDINALS = {
	N: new Direction(-1, 0),
	E: new Direction(0, 1),
	S: new Direction(1, 0),
	W: new Direction(0, -1),
};

Direction.ORDINALS = {
	NE: new Direction(-1, 1),
	SE: new Direction(1, 1),
	SW: new Direction(1, -1),
	NW: new Direction(-1, -1)
};

Direction.NEIGHBORS = Object.assign(
	{},
	Direction.ORIGIN,
	Direction.CARDINALS,
	Direction.ORDINALS
);

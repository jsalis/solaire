
/**
 * @class Direction
 */
export default class Direction {

	/**
	 * @constructor
	 * @param {Number} x    The x direction.
	 * @param {Number} y    The y direction.
	 */
	constructor(x, y) {

		this.x = x;
		this.y = y;
	}

	get col() {

		return this.x;
	}

	get row() {

		return this.y;
	}
}

Direction.ORIGIN = {
	C: new Direction(0, 0)
};

Direction.CARDINALS = {
	N: new Direction(0, -1),
	E: new Direction(1, 0),
	S: new Direction(0, 1),
	W: new Direction(-1, 0),
};

Direction.ORDINALS = {
	NE: new Direction(1, -1),
	SE: new Direction(1, 1),
	SW: new Direction(-1, 1),
	NW: new Direction(-1, -1)
};

Direction.NEIGHBORS = Object.assign(
	{},
	Direction.ORIGIN,
	Direction.CARDINALS,
	Direction.ORDINALS
);

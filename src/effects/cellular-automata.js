
import { Direction } from '../direction';

export const cellularAutomata = ({ born, survive, live, dead }) => ({ data }) => {

	return data.map((el, x, y) => {

		let neighborCount = 0;

		Object.values(Direction.NEIGHBORS).forEach(dir => {

			if (dir.x === 0 && dir.y === 0) {
				return;
			}

			if (data.get(x + dir.x, y + dir.y) === live) {
				neighborCount++;
			}
		});

		if (neighborCount >= born) {
			return live;
		}

		if (neighborCount >= survive && el === live) {
			return live;
		}

		return dead;
	});
};

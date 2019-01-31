
import Direction from '../direction';

export const floodFill = ({ start, target, replace, spread = 1, decay = 1 }) => ({ data, random }) => {

	let nodes = [{ x: start.x, y: start.y, spread }];

	while (nodes.length > 0) {

		let el = nodes.pop();

		if (data.get(el.x, el.y) === target) {

			data.set(el.x, el.y, replace);
			Object.values(Direction.CARDINALS).forEach(dir => {
				if ((dir.x !== 0 || dir.y !== 0) && random() < el.spread) {
					nodes.push({
						x: el.x + dir.x,
						y: el.y + dir.y,
						spread: el.spread * decay
					});
				}
			});
		}
	}
};

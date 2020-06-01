
import { Direction } from '../direction';

export const mazeGrowth = ({ start, replace, runFactor = 0.5, walkable = [] }) => ({ data, random }) => {
	let nodes = [{ x: start.x, y: start.y }];
	let walkables = Array.isArray(walkable) ? walkable : [ walkable ];
	let lastDir = null;

	data.set(start.x, start.y, replace);

	while (nodes.length > 0) {
		let node = nodes[ nodes.length - 1 ];
		let validDirs = Object.values(Direction.CARDINALS).filter(dir => {
			let x = node.x + (dir.x * 2); // TODO step
			let y = node.y + (dir.y * 2);

			if (!data.hasElementAt(x, y)) {
				return false;
			}

			let el = data.get(x, y);
			return el !== replace && (walkables.length === 0 || walkables.includes(el));
		});

		if (validDirs.length > 0) {
			let dir = (validDirs.includes(lastDir) && random() < runFactor)
				? lastDir
				: validDirs[ random() * validDirs.length | 0 ];

			let x = node.x + (dir.x * 2);
			let y = node.y + (dir.y * 2);

			data.set(x, y, replace);
			data.set(x - dir.x, y - dir.y, replace);

			nodes.push({ x, y });
			lastDir = dir;
		} else {
			nodes.pop();
			lastDir = null;
		}
	}
};

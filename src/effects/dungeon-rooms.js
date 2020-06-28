
import { areaStamp } from './area-stamp';
import { mazeGrowth } from './maze-growth';
import { floodFill } from './flood-fill';

import { PatternMatcher, $ } from '../pattern-matcher';

const Connector = {
	NONE: 0,
	X: 1,
	Y: 2
};

export const dungeonRooms = ({ wall, floor, minRoomSize = 5, maxRoomSize = 13, roomAttempts = 8, connectivity = 0, runFactor }) => ({ data, random }) => {
	// TODO : Assert that min and max room size are odd.
	// TODO : Assert that roomAttempts is positive.

	let tempWall = 0;
	let regionIndex = 1;
	// let evenSize = data.size() % 2 === 0;
	let size = data.size(); // evenSize ? data.size() - 1 : data.size();
	let nextData = data; // TODO data.map(() => tempWall);

	let matcherEntries = [ // TODO flip pattern matcher x y
		{
			key: 'westEnd',
			matcher: PatternMatcher.create(() => [
				[ $, floor, $ ],
				[ wall, floor, wall ],
				[ $, wall, $ ]
			])
		},
		{
			key: 'eastEnd',
			matcher: PatternMatcher.create(() => [
				[ $, wall, $ ],
				[ wall, floor, wall ],
				[ $, floor, $ ]
			])
		},
		{
			key: 'northEnd',
			matcher: PatternMatcher.create(() => [
				[ $, wall, $ ],
				[ wall, floor, floor ],
				[ $, wall, $ ]
			])
		},
		{
			key: 'southEnd',
			matcher: PatternMatcher.create(() => [
				[ $, wall, $ ],
				[ floor, floor, wall ],
				[ $, wall, $ ]
			])
		}
	];

	let effect = areaStamp({
		target: tempWall,
		replace: () => regionIndex++,
		area: { min: minRoomSize, max: maxRoomSize },
		step: 2,
		attempts: roomAttempts
	});

	effect({ data, random });

	for (let x = 1; x < size; x += 2) {
		for (let y = 1; y < size; y += 2) {
			if (nextData.get(x, y) === tempWall) {
				let effect = mazeGrowth({
					start: { x, y },
					replace: regionIndex,
					walkable: tempWall,
					runFactor
				});
				effect({ data, random });
				regionIndex++;
			}
		}
	}

	connectRegions(findConnectorNodes());
	prepareData();
	trimEnds(data.match(matcherEntries), matcherEntries);

	function connectRegions(nodes) {
		let regionCount = regionIndex - 1;

		while (regionCount > 1) {
			let index = random() * nodes.length | 0;
			let node = nodes.splice(index, 1)[0];
			let north = nextData.get(node.row - 1, node.col);
			let south = nextData.get(node.row + 1, node.col);
			let east = nextData.get(node.row, node.col + 1);
			let west = nextData.get(node.row, node.col - 1);

			if (isConnectorNode(node.row, node.col) !== Connector.NONE) {
				if (node.type === Connector.Y) {
					nextData.set(node.row, node.col, south);
					let effect = floodFill({ // TODO stay in bounds
						start: { x: node.row, y: node.col },
						target: south,
						replace: north
					});
					effect({ data, random });
					regionCount--;
				} else if (node.type === Connector.X) {
					nextData.set(node.row, node.col, east);
					let effect = floodFill({ // TODO stay in bounds
						start: { x: node.row, y: node.col },
						target: east,
						replace: west
					});
					effect({ data, random });
					regionCount--;
				}
			} else if (north === south && east === west && random() < connectivity) { // TODO Check for connectors on both sides.
				nextData.set(node.row, node.col, floor);
			}
		}
	}

	function findConnectorNodes() {
		let nodes = [];
		for (let i = 1; i < size - 1; i++) {
			for (let j = 1; j < size - 1; j++) {
				let type = isConnectorNode(i, j);
				if (type !== Connector.NONE) {
					nodes.push({ row: i, col: j, type: type });
				}
			}
		}
		return nodes;
	}

	function isConnectorNode(x, y) {
		if (nextData.get(x, y) !== tempWall) {
			return Connector.NONE;
		}

		let north = nextData.get(x - 1, y);
		let south = nextData.get(x + 1, y);
		let east = nextData.get(x, y + 1);
		let west = nextData.get(x, y - 1);

		if (north !== south && north !== tempWall && south !== tempWall) {
			return Connector.Y;
		}

		if (east !== west && east !== tempWall && west !== tempWall) {
			return Connector.X;
		}

		return Connector.NONE;
	}

	function prepareData() {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				nextData.set(i, j, nextData.get(i, j) === tempWall ? wall : floor);
			}
		}

		// if (evenSize) {
		// 	for (let i = 0; i < size + 1; i++) {
		// 		nextData[size][i] = nextData[i][size] = wall;
		// 	}
		// }
	}

	function getExitNode({ key, x, y }) {
		let dx = key === 'eastEnd' ? 1 : key === 'westEnd' ? -1 : 0;
		let dy = key === 'northEnd' ? 1 : key === 'southEnd' ? -1 : 0;
		return { key, x: x + dx, y: y + dy };
	}

	function trimEnds(nodes, matcherEntries) {
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			let exit = getExitNode(node);
			nextData.set(node.x, node.y, wall);

			while (exit) {
				node = exit;
				exit = null;
				for (let { key, matcher } of matcherEntries) {
					if (matcher(node.x, node.y, nextData)) {
						exit = getExitNode({ key, x: node.x, y: node.y });
						nextData.set(node.x, node.y, wall);
						break;
					}
				}
			}
		}
	}
};

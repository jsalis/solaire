
import { cellularAutomata } from '../../src/effects/cellular-automata';

describe('cellularAutomata', () => {

	it('must apply the effect to the data', () => {
		let data = [
			[0, 1, 0, 0],
			[0, 1, 1, 1],
			[1, 0, 0, 0],
			[0, 0, 1, 0]
		];
		data.get = (x, y) => data[ x ] && data[ x ][ y ];
		data.duplicate = fn => {
			let nextData = [];
			for (let x = 0; x < data.length; x++) {
				nextData[ x ] = [];
				for (let y = 0; y < data[ x ].length; y++) {
					nextData[ x ][ y ] = fn(x, y);
				}
			}
			return nextData;
		};
		let effect = cellularAutomata({
			live: 1,
			dead: 0,
			born: 4,
			survive: 3
		});
		let result = effect({ data });
		expect(result).toEqual([
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0]
		]);
	});
});

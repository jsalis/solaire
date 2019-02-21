
import { cellularAutomata } from '../../src/effects/cellular-automata';
import { randomWithSeed } from '../../src/utils/random';
import { DataSegment } from '../../src/data-segment';

describe('cellularAutomata', () => {

	it('must apply the effect to the data segment', () => {
		let size = 4;
		let random = randomWithSeed('If only I could be so grossly incandescent!');
		let data = DataSegment.create({ size, random });
		data.fromArray([
			[0, 1, 0, 0],
			[0, 1, 1, 1],
			[1, 0, 0, 0],
			[0, 0, 1, 0]
		]);
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

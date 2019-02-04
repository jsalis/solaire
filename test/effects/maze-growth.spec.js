
import { mazeGrowth } from '../../src/effects/maze-growth';
import { randomWithSeed } from '../../src/utils/random';
import { DataSegment } from '../../src/data-segment';

describe('mazeGrowth', () => {

	it('must apply the effect to the data', () => {
		let size = 7;
		let random = randomWithSeed('If only I could be so grossly incandescent!');
		let data = DataSegment.create({ size, random });
		data.fill(0);
		let effect = mazeGrowth({
			start: { x: 0, y: 0 },
			replace: 1,
			runFactor: 0
		});
		effect({ data, random });
		expect(data.toArray()).toEqual([
			[1, 0, 1, 1, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1, 1, 1],
			[1, 0, 1, 0, 0, 0, 1],
			[1, 1, 1, 0, 1, 1, 1],
			[0, 0, 0, 0, 1, 0, 0],
			[1, 1, 1, 1, 1, 1, 1]
		]);
	});
});

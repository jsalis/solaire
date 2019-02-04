
import { majorityRules } from '../../src/effects/majority-rules';
import { randomWithSeed } from '../../src/utils/random';
import { DataSegment } from '../../src/data-segment';

describe('majorityRules', () => {

	it('must apply the effect to the data', () => {
		let size = 4;
		let random = randomWithSeed('If only I could be so grossly incandescent!');
		let data = DataSegment.create({ size, random });
		data.fromArray([
			[0, 2, 0, 0],
			[2, 1, 2, 1],
			[1, 0, 2, 1],
			[0, 2, 1, 0]
		]);
		let effect = majorityRules();
		let result = effect({ data });
		expect(result).toEqual([
			[2, 2, 0, 0],
			[0, 2, 0, 0],
			[0, 2, 1, 1],
			[0, 0, 0, 1]
		]);
	});
});

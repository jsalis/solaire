
import { areaStamp } from '../../src/effects/area-stamp';
import { randomWithSeed } from '../../src/utils/random';
import { DataSegment } from '../../src/data-segment';

describe('areaStamp', () => {

	it('must apply the effect to the data', () => {
		let size = 10;
		let random = randomWithSeed('If only I could be so grossly incandescent!');
		let data = DataSegment.create({ size, random });
		data.fill(0);
		let effect = areaStamp({
			target: 0,
			replace: 1,
			area: { min: 1, max: 4 },
			attempts: 12
		});
		effect({ data, random });
		expect(data.toArray()).toEqual([
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 0, 1, 0],
			[0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
			[0, 1, 1, 1, 1, 0, 0, 1, 1, 0],
			[0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 1, 1, 0, 0]
		]);
	});
});


import seedrandom from 'seedrandom/seedrandom';

import { floodFill } from '../../src/effects/flood-fill';
import { DataSegment } from '../../src/data-segment';

describe('floodFill', () => {

	it('must apply the effect to the data', () => {
		let size = 7;
		let random = seedrandom('If only I could be so grossly incandescent!');
		let data = DataSegment.create({ size, random });
		data.fromArray([
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1],
			[0, 1, 0, 0, 0, 1, 0],
			[0, 0, 0, 1, 1, 1, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0]
		]);
		let effect = floodFill({
			start: { x: 0, y: 0 },
			target: 0,
			replace: 2
		});
		effect({ data, random });
		expect(data.toArray()).toEqual([
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 1, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 1],
			[2, 1, 2, 2, 2, 1, 0],
			[2, 2, 2, 1, 1, 1, 0],
			[2, 2, 2, 1, 0, 0, 0],
			[2, 2, 1, 0, 0, 0, 0]
		]);
	});
});

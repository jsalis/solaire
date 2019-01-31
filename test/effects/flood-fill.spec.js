
import seedrandom from 'seedrandom/seedrandom';

import { floodFill } from '../../src/effects/flood-fill';
import { isDefined } from '../../src/utils';

describe('floodFill', () => {

	it('must apply the effect to the data', () => {
		let data = [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1],
			[0, 1, 0, 0, 0, 1, 0],
			[0, 0, 0, 1, 1, 1, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0]
		];
		data.get = (x, y) => {
			return data[ x ] && data[ x ][ y ];
		};
		data.set = (x, y, val) => {
			if (isDefined(data[ x ]) && isDefined(data[ x ][ y ])) {
				data[ x ][ y ] = val;
			}
		};
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
		let effect = floodFill({
			start: { x: 0, y: 0 },
			target: 0,
			replace: 2
		});
		let random = seedrandom('If only I could be so grossly incandescent!');
		effect({ data, random });
		let result = data.duplicate((x, y) => data[ x ][ y ]);
		expect(result).toEqual([
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


import { majorityRules } from '../../src/effects/majority-rules';

describe('majorityRules', () => {

	it('must apply the effect to the data', () => {
		let data = [
			[0, 2, 0, 0],
			[2, 1, 2, 1],
			[1, 0, 2, 1],
			[0, 2, 1, 0]
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

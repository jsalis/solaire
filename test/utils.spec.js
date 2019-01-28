
import * as utils from '../src/utils';

describe('utils', () => {

	describe('wrap', () => {

		it('must wrap a number between a minimum and maximum', () => {
			expect(utils.wrap(-2, -1, 3)).toBe(3);
			expect(utils.wrap(-2, 3, -1)).toBe(3);
			expect(utils.wrap(3, -1, 2)).toBe(-1);
			expect(utils.wrap(3, 2, -1)).toBe(-1);
			expect(utils.wrap(-16, -10, 10)).toBe(5);
			expect(utils.wrap(-16, 10, -10)).toBe(5);
		});
	});
});


import { DataSegment } from '../src/data-segment';
import { randomWithSeed } from '../src/utils/random';

describe('DataSegment', () => {

	describe('fill', () => {

		it('must set each element to the given value', () => {
			let size = 3;
			let data = DataSegment.create({ size });
			data.fill(6);
			expect(data.toArray()).toEqual([
				[6, 6, 6],
				[6, 6, 6],
				[6, 6, 6]
			]);
		});
	});

	describe('randomize', () => {

		it('must set each element to a random value', () => {
			let size = 4;
			let random = randomWithSeed('If only I could be so grossly incandescent!');
			let data = DataSegment.create({ size, random });
			data.randomize([1, 2, 3, 4]);
			expect(data.toArray()).toEqual([
				[2, 2, 1, 2],
				[4, 2, 3, 1],
				[4, 3, 3, 2],
				[2, 4, 2, 2]
			]);
		});
	});

	describe('size', () => {

		it('must return the size of the data segment', () => {
			let size = 8;
			let data = DataSegment.create({ size });
			expect(data.size()).toBe(size);
		});
	});
});

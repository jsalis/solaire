
import { PatternMatcher, $ } from '../src/pattern-matcher';
import { DataSegment } from '../src/data-segment';

describe('PatternMatcher', () => {

	describe('create', () => {

		it('must create a matcher for an exact pattern', () => {
			let matcher = PatternMatcher.create(() => [
				[1, 1, 0],
				[1, 0, 2],
				[0, 2, 1]
			]);
			let size = 4;
			let data = DataSegment.create({ size });
			data.fromArray([
				[1, 1, 0, 1],
				[1, 0, 2, 3],
				[0, 2, 1, 0],
				[1, 2, 2, 3]
			]);
			expect(matcher(1, 1, data)).toBe(true);
			expect(matcher(2, 2, data)).toBe(false);
		});

		it('must create a matcher for a pattern with variables', () => {
			let matcher = PatternMatcher.create((a, b) => [
				[$, a, $],
				[b, 0, b],
				[$, a, $]
			]);
			let size = 4;
			let data = DataSegment.create({ size });
			data.fromArray([
				[3, 1, 2, 1],
				[2, 0, 2, 3],
				[1, 1, 0, 0],
				[2, 1, 0, 3]
			]);
			expect(matcher(1, 1, data)).toBe(true);
			expect(matcher(2, 2, data)).toBe(false);
		});

		it('must throw if the pattern height is even', () => {
			let fn = () => PatternMatcher.create(() => [
				[$, $, $],
				[$, $, $]
			]);
			expect(fn).toThrow('Pattern dimensions must be odd');
		});

		it('must throw if the pattern width is even', () => {
			let fn = () => PatternMatcher.create(() => [
				[$, $],
				[$, $],
				[$, $]
			]);
			expect(fn).toThrow('Pattern dimensions must be odd');
		});
	});
});

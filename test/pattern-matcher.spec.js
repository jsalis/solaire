
import { PatternMatcher, $ } from '../src/pattern-matcher';

describe('PatternMatcher', () => {

	describe('create', () => {

		it('must create a matcher for the specified pattern', () => {
			let matcher = PatternMatcher.create((a, b) => [
				[$, a, $],
				[b, 0, b],
				[$, a, $]
			]);
			let data = [
				[3, 1, 2, 1],
				[2, 0, 2, 3],
				[1, 1, 0, 0],
				[2, 1, 0, 3]
			];
			expect(matcher(1, 1, data)).toBe(true);
			expect(matcher(2, 2, data)).toBe(false);
		});

		it('must throw if the pattern height is even', () => {
			let fn = () => PatternMatcher.create(() => [
				[$, $, $],
				[$, $, $]
			]);
			expect(fn).toThrowError('Pattern dimensions must be odd');
		});

		it('must throw if the pattern width is even', () => {
			let fn = () => PatternMatcher.create(() => [
				[$, $],
				[$, $],
				[$, $]
			]);
			expect(fn).toThrowError('Pattern dimensions must be odd');
		});
	});
});

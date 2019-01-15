
import RegionGenerator from '../src/region-generator';
import Region from '../src/region';

describe('RegionGenerator', () => {

	describe('get', () => {

		it('must return the list of regions', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			expect(generator.get()).toBe(regions);
		});
	});

	describe('mapTimes', () => {

		it('must invoke the callback for each region', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let callback = jasmine.createSpy('callback');
			generator.mapTimes(1, callback);
			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback.calls.argsFor(0)[0]).toBe(regions[0]);
			expect(callback.calls.argsFor(1)[0]).toBe(regions[1]);
		});
	});
});

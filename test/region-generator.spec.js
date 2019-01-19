
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
			expect(generator.get()).toEqual(regions);
		});
	});

	describe('select', () => {

		it('must select regions that match a given type', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' }),
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			generator.select('first');
			expect(generator.get()).toEqual([
				regions[0],
				regions[2]
			]);
		});

		it('must select regions that match given list of types', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' }),
				Region.create({ type: 'third' }),
				Region.create({ type: 'first' })
			];
			let generator = RegionGenerator.create({ regions });
			generator.select(['first', 'third']);
			expect(generator.get()).toEqual([
				regions[0],
				regions[2],
				regions[3]
			]);
		});

		it('must return the context to allow method chaining', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let context = generator.select('first');
			expect(context).toBe(generator);
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

		it('must apply only to the selected regions', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let callback = jasmine.createSpy('callback');
			generator.select('second');
			generator.mapTimes(1, callback);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback.calls.argsFor(0)[0]).toBe(regions[1]);
		});

		it('must return the context to allow method chaining', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let callback = jasmine.createSpy('callback');
			let context = generator.mapTimes(1, callback);
			expect(context).toBe(generator);
		});
	});
});


import { RegionGenerator } from '../src/region-generator';
import { Region } from '../src/region';

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

	describe('apply', () => {

		it('must invoke the callback for each region', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			generator.apply(callback);
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
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			generator.select('second');
			generator.apply(callback);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback.calls.argsFor(0)[0]).toBe(regions[1]);
		});

		it('must pass region data to the effect function', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			generator.apply(callback);
			expect(effect).toHaveBeenCalledWith(
				jasmine.objectContaining({
					data: regions[0].data
				})
			);
			expect(effect).toHaveBeenCalledWith(
				jasmine.objectContaining({
					data: regions[1].data
				})
			);
		});

		it('must pass a random number generator to the effect function', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			generator.apply(callback);
			expect(effect).toHaveBeenCalledWith(
				jasmine.objectContaining({
					random: jasmine.any(Function)
				})
			);
			let { random } = effect.calls.mostRecent().args[0];
			expect(random()).not.toBe(random());
		});

		it('must return the context to allow method chaining', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			let context = generator.apply(callback);
			expect(context).toBe(generator);
		});
	});

	describe('applyTimes', () => {

		it('must invoke the callback multiple times for each region', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			generator.applyTimes(2, callback);
			expect(callback).toHaveBeenCalledTimes(4);
			expect(callback.calls.argsFor(0)[0]).toBe(regions[0]);
			expect(callback.calls.argsFor(1)[0]).toBe(regions[1]);
			expect(callback.calls.argsFor(2)[0]).toBe(regions[0]);
			expect(callback.calls.argsFor(3)[0]).toBe(regions[1]);
		});

		it('must return the context to allow method chaining', () => {
			let regions = [
				Region.create({ type: 'first' }),
				Region.create({ type: 'second' })
			];
			let generator = RegionGenerator.create({ regions });
			let effect = jasmine.createSpy('effect');
			let callback = jasmine.createSpy('callback').and.returnValue(effect);
			let context = generator.applyTimes(2, callback);
			expect(context).toBe(generator);
		});
	});
});


import seedrandom from 'seedrandom/seedrandom';

/**
 * Creates a new region generator object.
 *
 * @param   {Array}  regions
 * @param   {String} seed
 * @returns {Object}
 */
function createRegionGenerator({ regions, seed }) {

	let selection = regions;

	return {

		get() {
			return [ ...selection ];
		},

		select(types) {

			types = Array.isArray(types) ? types : [ types ];
			selection = regions.filter((region) => types.includes(region.type));

			return this;
		},

		apply(callback) {

			let nextData = selection.map((region) => {
				let effect = callback(region);
				return effect({
					data: region.data,
					position: region.position,
					random: seedrandom([ seed, region.position ])
				});
			});

			selection.forEach((region, index) => {
				region.data = nextData[ index ];
			});

			return this;
		},

		applyTimes(count, callback) {

			for (let i = 0; i < count; i++) {
				this.apply(callback);
			}

			return this;
		}
	};
}

export default { create: createRegionGenerator };

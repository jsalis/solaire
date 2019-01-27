
import seedrandom from 'seedrandom/seedrandom';

/**
 * Creates a new region generator object.
 *
 * @param   {Array} regions
 * @param   {*}     seed
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
			selection = regions.filter(region => types.includes(region.type));

			return this;
		},

		apply(callback) {

			let nextData = selection.map(region => {
				let effect = callback(region);
				return effect({
					data: region.data,
					random: seedrandom([ seed, region.position ])
				});
			});

			selection.forEach((region, index) => {
				let data = nextData[ index ];
				if (data) {
					for (let i = 0; i < data.length; i++) {
						for (let j = 0; j < data[i].length; j++) {
							region.data[ i ][ j ] = data[ i ][ j ];
						}
					}
				}
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

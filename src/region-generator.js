
import seedrandom from 'seedrandom/seedrandom';

export const RegionGenerator = {

	/**
	 * Creates a new region generator object.
	 *
	 * @param   {Array} regions
	 * @param   {*}     seed
	 * @returns {Object}
	 */
	create({ regions, seed }) {

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
						for (let x = 0; x < data.length; x++) {
							for (let y = 0; y < data[x].length; y++) {
								region.data.set(x, y, data[ x ][ y ]);
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
};

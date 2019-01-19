
/**
 * Creates a new region generator object.
 *
 * @param   {Array} regions
 * @returns {Object}
 */
function createRegionGenerator({ regions }) {

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

		mapTimes(count, callback) {

			for (let i = 0; i < count; i++) {
				let nextData = selection.map(callback);
				selection.forEach((region, index) => {
					region.data = nextData[ index ];
				});
			}

			return this;
		}
	};
}

export default { create: createRegionGenerator };

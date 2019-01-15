
/**
 * Creates a new region generator object.
 *
 * @param   {Array} regions
 * @returns {Object}
 */
function createRegionGenerator({ regions }) {

	return {

		get() {
			return regions;
		},

		mapTimes(count, callback) {

			for (let i = 0; i < count; i++) {
				let nextData = regions.map(callback);
				regions.forEach((region, index) => {
					region.data = nextData[ index ];
				});
			}
		}
	};
}

export default { create: createRegionGenerator };


/**
 * Creates a new region object.
 *
 * @param   {Object} config
 * @returns {Object}
 */
function createRegion(config) {

	return {

		type: config.type,
		seed: '',
		data: []
	};
}

export default { create: createRegion };

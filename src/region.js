
/**
 * Creates a new region object.
 *
 * @param   {Object} config
 * @returns {Object}
 */
function createRegion(config) {

	return {
		type: config.type,
		position: config.position,
		seed: '',
		data: []
	};
}

export default { create: createRegion };

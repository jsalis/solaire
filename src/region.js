
export const Region = {

	/**
	 * Creates a new region object.
	 *
	 * @param   {Object} config
	 * @returns {Object}
	 */
	create(config) {
		return {
			type: config.type,
			position: config.position,
			mutations: config.mutations || {},
			data: []
		};
	}
};

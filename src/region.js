export const Region = {
    /**
     * Creates a new region object.
     *
     * @param   {Object} config
     * @returns {Object}
     */
    create(config) {
        return {
            position: config.position,
            type: config.type,
            seed: config.seed ?? JSON.stringify(config.position),
            mutations: config.mutations ?? {},
            data: [],
        };
    },
};

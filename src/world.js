import * as vec2 from "./utils/vec2";
import * as effects from "./effects";
import { clamp, wrap, isFunction, isObjectLike, merge, deepEntries } from "./utils/common";
import { randomWithSeed, randomFrom } from "./utils/random";
import { DataSegment } from "./data-segment";
import { Region } from "./region";
import { RegionGenerator } from "./region-generator";

/**
 * @type {Object} The default world config.
 */
const DEFAULT_CONFIG = {
    bounds: {
        x: { min: -Infinity, max: Infinity, wrap: false },
        y: { min: -Infinity, max: Infinity, wrap: false },
    },
    position: {
        x: 0,
        y: 0,
    },
    seed: null,
    initialData: {},
    regions: {},
    regionSize: 32,
    chooseRegion: ({ regionTypes }) => regionTypes,
    generate: () => {},
};

export const World = {
    /**
     * Creates a new world object.
     *
     * @param   {Object} config
     * @returns {Object}
     */
    create(config) {
        config = merge({}, DEFAULT_CONFIG, config);
        sanitize(config);

        let { seed } = randomWithSeed(config.seed);
        let position = vec2.clone(config.position);
        let data = createDataObject(config);

        return {
            get data() {
                return data;
            },

            get seed() {
                return seed;
            },

            get position() {
                return vec2.clone(position);
            },

            get regionTypes() {
                return Object.keys(config.regions);
            },

            get regionSize() {
                return config.regionSize;
            },

            getRegion(...args) {
                let pos = applyBounds(
                    args.length === 2 ? { x: args[0], y: args[1] } : args[0],
                    config.bounds
                );
                return pos && data[pos.x]?.[pos.y];
            },

            init(arg) {
                let opt = parseOptions(arg, position);

                for (let x = opt.x.min; x <= opt.x.max; x++) {
                    for (let y = opt.y.min; y <= opt.y.max; y++) {
                        setRegion(data, { x, y }, opt, config);
                    }
                }
            },

            remove(arg) {
                let opt = parseOptions(arg, position);

                for (let x = opt.x.min; x <= opt.x.max; x++) {
                    for (let y = opt.y.min; y <= opt.y.max; y++) {
                        data[x][y] = undefined;
                    }
                }
            },

            generate(arg) {
                let opt = parseOptions(arg, position);
                let regionTypes = Object.keys(config.regions);
                let regions = [];

                for (let x = opt.x.min; x <= opt.x.max; x++) {
                    for (let y = opt.y.min; y <= opt.y.max; y++) {
                        let pos = { x, y };
                        let reg = this.getRegion(pos);

                        if (reg) {
                            regions.push(reg);
                            initialize(data, pos, config);
                        }
                    }
                }

                config.generate({
                    regions: RegionGenerator.create({ regionTypes, regions, seed }),
                    effects,
                });

                for (let x = opt.x.min; x <= opt.x.max; x++) {
                    for (let y = opt.y.min; y <= opt.y.max; y++) {
                        mutate(data, { x, y }, config);
                    }
                }
            },

            move(...args) {
                let dir = args.length === 2 ? { x: args[0], y: args[1] } : args[0];

                if (dir.x === 0 && dir.y === 0) {
                    return;
                }

                let { bounds } = config;
                let current = vec2.clone(position);
                position.x = (bounds.x.wrap ? wrap : clamp)(
                    position.x + dir.x,
                    bounds.x.min,
                    bounds.x.max
                );
                position.y = (bounds.y.wrap ? wrap : clamp)(
                    position.y + dir.y,
                    bounds.y.min,
                    bounds.y.max
                );

                if (vec2.equals(position, current)) {
                    throw Error("World position out of bounds");
                }
            },

            serialize() {
                let { bounds, regionSize } = config;
                let initialData = deepEntries(data).reduce((result, [x, y, region]) => {
                    result[x] = result[x] ?? {};
                    result[x][y] = {
                        type: region.type,
                        seed: region.seed,
                        mutations: region.mutations,
                    };
                    return result;
                }, {});

                return {
                    seed,
                    position,
                    bounds,
                    regionSize,
                    initialData,
                };
            },
        };
    },
};

function sanitize({ bounds, regions }) {
    if (bounds.x.min > 0 || bounds.y.min > 0) {
        throw Error("Minimum bounds must not be greater than zero");
    }

    if (bounds.x.max < 0 || bounds.y.max < 0) {
        throw Error("Maximum bounds must not be less than zero");
    }

    if (bounds.x.wrap && (!isFinite(bounds.x.min) || !isFinite(bounds.x.max))) {
        throw Error("Wrapped bounds must define a minimum and maximum");
    }

    if (bounds.y.wrap && (!isFinite(bounds.y.min) || !isFinite(bounds.y.max))) {
        throw Error("Wrapped bounds must define a minimum and maximum");
    }

    if (Object.keys(regions).length === 0) {
        throw Error("No regions defined");
    }
}

function createDataObject({ initialData }) {
    return deepEntries(initialData).reduce((result, [x, y, state]) => {
        const region = Region.create({
            position: { x, y },
            type: state.type,
            seed: state.seed,
            mutations: state.mutations,
        });

        result[x] = result[x] ?? {};
        result[x][y] = region;
        return result;
    }, {});
}

function applyBounds(position, bounds) {
    let min = { x: bounds.x.min, y: bounds.y.min };
    let max = { x: bounds.x.max, y: bounds.y.max };
    let pos = vec2.clone(position);

    if (bounds.x.wrap) {
        pos.x = wrap(pos.x, bounds.x.min, bounds.x.max);
    }

    if (bounds.y.wrap) {
        pos.y = wrap(pos.y, bounds.y.min, bounds.y.max);
    }

    if (vec2.intersects(pos, min, max)) {
        return pos;
    }

    return undefined;
}

function parseOptions(opt = {}, position) {
    let def = {
        x: { min: position.x - 1, max: position.x + 1 },
        y: { min: position.y - 1, max: position.y + 1 },
    };
    return {
        ...opt,
        x: {
            min: isObjectLike(opt.x) ? Number(opt.x?.min ?? def.x.min) : Number(opt.x ?? def.x.min),
            max: isObjectLike(opt.x) ? Number(opt.x?.max ?? def.x.max) : Number(opt.x ?? def.x.max),
        },
        y: {
            min: isObjectLike(opt.y) ? Number(opt.y?.min ?? def.y.min) : Number(opt.y ?? def.y.min),
            max: isObjectLike(opt.y) ? Number(opt.y?.max ?? def.y.max) : Number(opt.y ?? def.y.max),
        },
    };
}

function setRegion(data, position, options, { bounds, regions, chooseRegion, seed }) {
    let pos = applyBounds(position, bounds);

    if (pos) {
        data[pos.x] = data[pos.x] ?? {};

        if (!data[pos.x][pos.y]) {
            let regionTypes = Object.keys(regions);
            let random = randomWithSeed([seed, pos]);
            let type =
                options.type ??
                chooseRegion({
                    position: pos,
                    regionTypes: regionTypes,
                    random: random,
                });

            if (Array.isArray(type)) {
                type = randomFrom(type, random)();
            }

            if (!regionTypes.includes(type)) {
                throw Error(`Invalid region type "${type}" has not been defined`);
            }

            data[pos.x][pos.y] = Region.create({
                position: pos,
                type: type,
                seed: options.seed,
                mutations: options.mutations,
            });
        }
    }
}

function initialize(data, position, { bounds, regions, regionSize, seed }) {
    let pos = applyBounds(position, bounds);

    if (pos) {
        let region = data[pos.x][pos.y];

        region.data = DataSegment.create({
            size: regionSize,
            random: randomWithSeed([seed, region.seed]),
            regions: data,
            position: pos,
            bounds: bounds,
            mutations: region.mutations,
        });

        if (isFunction(regions[region.type].init)) {
            regions[region.type].init({
                data: region.data,
                random: randomWithSeed([seed, region.seed]),
            });
        }
    }
}

function mutate(data, position, { bounds }) {
    let pos = applyBounds(position, bounds);
    let region = pos && data[pos.x]?.[pos.y];

    if (pos && region) {
        Object.entries(region.mutations).forEach(([key, val]) => {
            let [x, y] = key.split(",");
            region.data.set(x, y, val);
        });
    }
}

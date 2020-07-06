import seedRandom from "seedrandom/seedrandom";

import { isDefined } from "./common";

/**
 * Creates a pseudo-random number generator with a given seed.
 *
 * @param   {*} [seed]
 * @returns {Function}
 */
export function randomWithSeed(seed) {
    return seedRandom(seed, {
        pass(random, seed) {
            random.seed = seed;
            return random;
        },
    });
}

/**
 * Generates a new seed with a given length.
 *
 * @param   {Number} [length]
 * @returns {String}
 */
export function generateSeed(length = 32) {
    let random = seedRandom(null);
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(random() * chars.length)];
    }

    return result;
}

/**
 * Creates a function that returns random values from a weighted distribution.
 *
 * @param   {Array}    entries
 * @param   {Function} random
 * @returns {Function}
 */
export function randomFrom(entries, random) {
    let values = entries.map((el) => (isDefined(el.value) ? el.value : el));
    let weights = entries.map((el) => (isDefined(el.weight) ? el.weight : 1));
    let intervals = weights.reduce((array, val, i) => {
        let prev = array[i - 1] ?? 0;
        array.push(val + prev);
        return array;
    }, []);
    let sum = intervals[intervals.length - 1];

    return () => {
        let r = (random() * sum) | 0;
        let index = intervals.findIndex((int) => r < int);
        return values[index];
    };
}

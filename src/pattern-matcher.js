import { isSymbol, isEven } from "./utils/common";

/**
 * @type {Symbol} The value used to signal a wildcard value in the pattern.
 */
export const $ = Symbol("wildcard");

export const PatternMatcher = {
    /**
     * Creates a new pattern matcher.
     *
     * @param   {Function} factory
     * @returns {Function}
     */
    create(factory) {
        let symbols = [];

        for (let i = 0; i < factory.length; i++) {
            symbols.push(Symbol(i));
        }

        let pattern = factory(...symbols);
        sanitize(pattern);

        let width = pattern.length;
        let height = pattern[0].length;
        let xOffset = (width / -2) | 0;
        let yOffset = (height / -2) | 0;
        let nodesBySymbol = {};
        let nodesExact = [];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let el = pattern[x][y];

                if (el === $) {
                    continue;
                }

                if (isSymbol(el)) {
                    nodesBySymbol[el] = nodesBySymbol[el] ?? [];
                    nodesBySymbol[el].push({ x: x + xOffset, y: y + yOffset });
                } else {
                    nodesExact.push({ x: x + xOffset, y: y + yOffset, value: el });
                }
            }
        }

        return matcherWith({ nodesExact, nodesBySymbol });
    },
};

function matcherWith({ nodesExact, nodesBySymbol }) {
    return (x, y, data) => {
        for (let node of nodesExact) {
            if (data.get(x + node.x, y + node.y) !== node.value) {
                return false;
            }
        }

        for (let symbol of Object.getOwnPropertySymbols(nodesBySymbol)) {
            let nodes = nodesBySymbol[symbol];
            let val = data.get(x + nodes[0].x, y + nodes[0].y);

            for (let i = 1; i < nodes.length; i++) {
                if (data.get(x + nodes[i].x, y + nodes[i].y) !== val) {
                    return false;
                }
            }
        }

        return true;
    };
}

function sanitize(pattern) {
    if (isEven(pattern.length)) {
        throw Error("Pattern dimensions must be odd");
    }

    for (let row of pattern) {
        if (isEven(row.length)) {
            throw Error("Pattern dimensions must be odd");
        }
    }
}

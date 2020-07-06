import { DataSegment } from "../src/data-segment";
import { randomWithSeed } from "../src/utils/random";

describe("DataSegment", () => {
    describe("mutate", () => {
        it("must mutate and set the element to the given value", () => {
            let size = 2;
            let data = DataSegment.create({ size });
            data.mutate(0, 0, 4);
            data.mutate(0, 1, 3);
            data.mutate(1, 0, 2);
            data.mutate(1, 1, 1);
            expect(data.toArray()).toEqual([
                [4, 3],
                [2, 1],
            ]);
            expect(data.mutations()).toEqual({
                "0,0": 4,
                "0,1": 3,
                "1,0": 2,
                "1,1": 1,
            });
        });
    });

    describe("fill", () => {
        it("must set each element to the given value", () => {
            let size = 3;
            let data = DataSegment.create({ size });
            data.fill(6);
            expect(data.toArray()).toEqual([
                [6, 6, 6],
                [6, 6, 6],
                [6, 6, 6],
            ]);
        });
    });

    describe("randomize", () => {
        it("must set each element to a random value", () => {
            let size = 4;
            let random = randomWithSeed("If only I could be so grossly incandescent!");
            let data = DataSegment.create({ size, random });
            data.randomize([1, 2, 3, 4]);
            expect(data.toArray()).toEqual([
                [2, 2, 1, 2],
                [4, 2, 3, 1],
                [4, 3, 3, 2],
                [2, 4, 2, 2],
            ]);
        });
    });

    describe("match", () => {
        it("must invoke each matcher for each data element", () => {
            let size = 4;
            let data = DataSegment.create({ size });
            let firstMatcher = jest.fn(() => false);
            let secondMatcher = jest.fn(() => false);
            data.match([
                {
                    key: "first",
                    matcher: firstMatcher,
                },
                {
                    key: "second",
                    matcher: secondMatcher,
                },
            ]);
            expect(firstMatcher).toHaveBeenCalledTimes(size * size);
            expect(secondMatcher).toHaveBeenCalledTimes(size * size);
        });

        it("must invoke each matcher with the element position and data segment", () => {
            let size = 2;
            let data = DataSegment.create({ size });
            let matcher = jest.fn(() => false);
            data.match([
                {
                    key: "first",
                    matcher,
                },
            ]);
            expect(matcher).toHaveBeenCalledWith(0, 0, data);
            expect(matcher).toHaveBeenCalledWith(0, 1, data);
            expect(matcher).toHaveBeenCalledWith(1, 0, data);
            expect(matcher).toHaveBeenCalledWith(1, 1, data);
        });

        it("must return results containing the matched elements", () => {
            let size = 4;
            let data = DataSegment.create({ size });
            data.fromArray([
                [0, 0, 0, 2],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 2, 0],
            ]);
            let results = data.match([
                {
                    key: "one",
                    matcher: (x, y) => data.get(x, y) === 1,
                },
                {
                    key: "two",
                    matcher: (x, y) => data.get(x, y) === 2,
                },
            ]);
            expect(results).toEqual([
                { x: 0, y: 3, key: "two" },
                { x: 1, y: 1, key: "one" },
                { x: 2, y: 1, key: "one" },
                { x: 3, y: 2, key: "two" },
            ]);
        });
    });

    describe("size", () => {
        it("must return the size of the data segment", () => {
            let size = 8;
            let data = DataSegment.create({ size });
            expect(data.size()).toBe(size);
        });
    });

    describe("mutations", () => {
        it("must return a reference to the mutations object", () => {
            let size = 3;
            let mutations = {};
            let data = DataSegment.create({ size, mutations });
            expect(data.mutations()).toBe(mutations);
        });
    });
});

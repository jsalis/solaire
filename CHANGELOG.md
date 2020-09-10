# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.7.0](https://github.com/jsalis/solaire/compare/v0.6.0...v0.7.0) (2020-07-06)

### Bug Fixes

-   mutate regions in given area ([d37d047](https://github.com/jsalis/solaire/commit/d37d047))

### Features

-   allow initial mutations to be passed on init ([479b835](https://github.com/jsalis/solaire/commit/479b835))

## [0.6.0](https://github.com/jsalis/solaire/compare/v0.5.0...v0.6.0) (2020-06-28)

### Features

-   add wip effect for dungeon rooms ([b42ee7e](https://github.com/jsalis/solaire/commit/b42ee7e))

## [0.5.0](https://github.com/jsalis/solaire/compare/v0.4.0...v0.5.0) (2020-06-21)

### Build System

-   update dependencies ([4d89912](https://github.com/jsalis/solaire/commit/4d89912))

### Features

-   always init regions before generating and add more flexible area options ([f1e0a7d](https://github.com/jsalis/solaire/commit/f1e0a7d))
-   use region position as default seed ([4184ba8](https://github.com/jsalis/solaire/commit/4184ba8))

## [0.4.0](https://github.com/jsalis/solaire/compare/v0.3.0...v0.4.0) (2020-06-20)

### Features

-   add function to generate seeds ([a5c1706](https://github.com/jsalis/solaire/commit/a5c1706))
-   add remove method to world ([e778026](https://github.com/jsalis/solaire/commit/e778026))
-   add seed to regions ([5959324](https://github.com/jsalis/solaire/commit/5959324))

## [0.3.0](https://github.com/jsalis/solaire/compare/v0.2.0...v0.3.0) (2020-06-16)

### Features

-   add separate init method to run generation on custom region areas ([e34c36f](https://github.com/jsalis/solaire/commit/e34c36f))
-   add world serialize function and option to set initial data ([28f0927](https://github.com/jsalis/solaire/commit/28f0927))

## [0.2.0](https://github.com/jsalis/solaire/compare/v0.1.0...v0.2.0) (2020-04-27)

### Bug Fixes

-   do not throw when moving in a direction of zero length ([b4ecb5e](https://github.com/jsalis/solaire/commit/b4ecb5e))

### Build System

-   **deps-dev:** bump acorn from 6.2.0 to 6.4.1 ([#4](https://github.com/jsalis/solaire/issues/4)) ([89f32d9](https://github.com/jsalis/solaire/commit/89f32d9))
-   **deps-dev:** bump codecov from 3.5.0 to 3.6.5 ([#3](https://github.com/jsalis/solaire/issues/3)) ([e54ffcb](https://github.com/jsalis/solaire/commit/e54ffcb))
-   run linter on commit ([b7524c6](https://github.com/jsalis/solaire/commit/b7524c6))
-   **deps:** bump eslint-utils from 1.4.0 to 1.4.3 ([17b537e](https://github.com/jsalis/solaire/commit/17b537e))
-   **deps:** bump handlebars from 4.1.2 to 4.5.3 ([6a667a4](https://github.com/jsalis/solaire/commit/6a667a4))

### Features

-   region generator must throw if an invalid region type is selected ([6b183e0](https://github.com/jsalis/solaire/commit/6b183e0))
-   support persistent mutations to data segment ([ab430d1](https://github.com/jsalis/solaire/commit/ab430d1))

## 0.1.0 (2019-07-15)

### Build System

-   update seedrandom dependency ([7589f34](https://github.com/jsalis/solaire/commit/7589f34))
-   **karma:** replace phantomjs with headless chrome ([4fc905a](https://github.com/jsalis/solaire/commit/4fc905a))
-   migrate to jest and babel 7 ([7e1ee17](https://github.com/jsalis/solaire/commit/7e1ee17))
-   more security fixes ugh ([c21ee82](https://github.com/jsalis/solaire/commit/c21ee82))
-   **package:** audit and update dependencies ([918ecd4](https://github.com/jsalis/solaire/commit/918ecd4))
-   **package:** update dependencies ([fe483ad](https://github.com/jsalis/solaire/commit/fe483ad))
-   **package:** update dependencies ([f3da1a4](https://github.com/jsalis/solaire/commit/f3da1a4))
-   **package:** update dependencies ([a3ea611](https://github.com/jsalis/solaire/commit/a3ea611))
-   **package:** update dependencies ([09b9bac](https://github.com/jsalis/solaire/commit/09b9bac))
-   update standard-version to fix security warning ([22bfdf4](https://github.com/jsalis/solaire/commit/22bfdf4))
-   use commitlint ([9b56d1f](https://github.com/jsalis/solaire/commit/9b56d1f))

### Features

-   add `areaStamp` effect ([ef05782](https://github.com/jsalis/solaire/commit/ef05782))
-   add `cellularAutomata` effect ([40aa8a2](https://github.com/jsalis/solaire/commit/40aa8a2))
-   add `floodFill` effect ([a9496ac](https://github.com/jsalis/solaire/commit/a9496ac))
-   add `majorityRules` effect ([6c3e9c9](https://github.com/jsalis/solaire/commit/6c3e9c9))
-   add `mazeGrowth` effect ([0887d4f](https://github.com/jsalis/solaire/commit/0887d4f))
-   add data segment method `hasElementAt` ([742ef6f](https://github.com/jsalis/solaire/commit/742ef6f))
-   add data segment method `match` ([0ccab0f](https://github.com/jsalis/solaire/commit/0ccab0f))
-   add default region chooser ([dd856d9](https://github.com/jsalis/solaire/commit/dd856d9))
-   add method to randomize data with a weighted distribution ([3c561e1](https://github.com/jsalis/solaire/commit/3c561e1))
-   add method to select regions by type ([fcb4f48](https://github.com/jsalis/solaire/commit/fcb4f48))
-   add methods to the data accessor ([3ed595f](https://github.com/jsalis/solaire/commit/3ed595f))
-   add option to choose region type with a weighted distribution ([6ae80cf](https://github.com/jsalis/solaire/commit/6ae80cf))
-   add options to wrap x and y bounds ([37a5d5e](https://github.com/jsalis/solaire/commit/37a5d5e))
-   add pattern matcher ([f35069e](https://github.com/jsalis/solaire/commit/f35069e))
-   add random number generator for region initializer ([369d239](https://github.com/jsalis/solaire/commit/369d239))
-   add region generator object ([c99240e](https://github.com/jsalis/solaire/commit/c99240e))
-   add region init function ([503ab45](https://github.com/jsalis/solaire/commit/503ab45))
-   add region size ([28dc29c](https://github.com/jsalis/solaire/commit/28dc29c))
-   add region types ([d159aa4](https://github.com/jsalis/solaire/commit/d159aa4))
-   add sanity check for world bounds ([ea8fa4d](https://github.com/jsalis/solaire/commit/ea8fa4d))
-   add support for passing x and y values as two arguments ([23e8b10](https://github.com/jsalis/solaire/commit/23e8b10))
-   add world bounds ([bfbab8a](https://github.com/jsalis/solaire/commit/bfbab8a))
-   add world generate function ([d152bf9](https://github.com/jsalis/solaire/commit/d152bf9))
-   add world movement ([a2ac949](https://github.com/jsalis/solaire/commit/a2ac949))
-   add world renderer ([46ceb28](https://github.com/jsalis/solaire/commit/46ceb28))
-   add world seed and random number generator for region chooser ([511a894](https://github.com/jsalis/solaire/commit/511a894))
-   allow a value to be passed to `fill` and `duplicate` ([74476b9](https://github.com/jsalis/solaire/commit/74476b9))
-   create empty data set and pass to region initializer ([811b5de](https://github.com/jsalis/solaire/commit/811b5de))
-   pass random number generator to region effects instead of the world generate function ([f3dd9cd](https://github.com/jsalis/solaire/commit/f3dd9cd))
-   remove methods to move in cardinal directions ([60c0522](https://github.com/jsalis/solaire/commit/60c0522))
-   use random seed by default ([a229ce1](https://github.com/jsalis/solaire/commit/a229ce1))

### Tests

-   add data segment test cases ([46fa3b6](https://github.com/jsalis/solaire/commit/46fa3b6))
-   add test case for `areaStamp` effect ([6854e40](https://github.com/jsalis/solaire/commit/6854e40))
-   add test case for world seed ([ac96c07](https://github.com/jsalis/solaire/commit/ac96c07))

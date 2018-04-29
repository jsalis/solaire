
const istanbul = require('rollup-plugin-istanbul');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = function (karma) {

	karma.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			'ChromeHeadless',
			'Firefox',
			'Safari'
		],

		// list of files / patterns to load in the browser
		files: [
			'test/**/*.spec.js'
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'test/**/*.spec.js': ['rollup']
		},

		rollupPreprocessor: {
			output: {
				format: 'iife'
			},
			plugins: [
				istanbul({
					exclude: [
						'./node_modules/**',
						'test/**/*.js'
					]
				}),
				nodeResolve({
					jsnext: true,
					browser: true
				}),
				commonjs(),
				babel({
					presets: [['es2015', { 'modules': false }]],
					plugins: ['external-helpers']
				})
			]
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['spec', 'coverage'],

		coverageReporter: {
			dir: './build/coverage/',
			reporters: [
				{ type: 'html' },
				{ type: 'lcovonly', subdir: '.', file: 'lcov.info' }
			]
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
		logLevel: karma.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};

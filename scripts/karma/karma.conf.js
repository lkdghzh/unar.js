var webpack = require('./webpack.conf')
module.exports = function (config) {
	config.set({
		basePath: '../../',
		frameworks: ['jasmine'],
		files: [
			'test/**/**/*.spec.js'
		],
		webpack,
		exclude: [],
		//https://github.com/webpack-contrib/karma-webpack
		preprocessors: {
			'test/**/**/*.spec.js': ['webpack', 'sourcemap']
		},
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome', 'Firefox', 'Safari'], //
		singleRun: false, //true
		concurrency: Infinity
	})
}

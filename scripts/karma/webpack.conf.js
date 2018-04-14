var path = require('path')
var alias = {
	test: path.resolve(__dirname, '../../packages/test'),
	unar: path.resolve(__dirname, '../../packages/instance/index')
}
module.exports = {
	resolve: {
		alias
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}]
	},
	devtool: 'inline-source-map',
	mode: 'development'
}

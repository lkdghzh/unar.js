var path = require('path')
var alias = {
	test: path.resolve(__dirname, '../../packages/test')
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

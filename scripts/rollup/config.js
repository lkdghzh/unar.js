//config-> build unar.js

const path = require('path')
const node = require('rollup-plugin-node-resolve') //resolve suffix eg.. index.js  
const babel = require('rollup-plugin-babel') 

const name = 'Unar'
const env = process.env.TARGET
const version = require('../../package.json').version
const resolve = p => path.resolve(__dirname, p)
const input = resolve('../../src/Instance/index.js')

const banner = `
/**
*   Unar.js v${version}
*   (c) 2017-${new Date().getFullYear()} author:like
*   Released under the MIT License.
*/ 
`
const opts = {
	'development': {
		input,
		output: {
			file: resolve(`../../unar.${version}.js`),
			name
		},
		banner,
		env: 'development',
		format: 'umd',//es
        plugins: [node()]
        // , babel({
		// 	exclude: 'node_modules/**'
		// })
	},
	'product': {
		input,
		output: {
			file: resolve(`../../unar.${version}.min.js`),
			name
		},
		banner,
		env: 'production',
		format: 'umd',
		plugins: [node()   , babel({
			exclude: 'node_modules/**'
		})]
	}
}
const generatorConfig = name => opts[name]

module.exports = generatorConfig(env)

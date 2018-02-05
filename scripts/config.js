//config-> build unar.js

const path = require('path')
const node = require('rollup-plugin-node-resolve')//resolve suffix eg.. index.js  

const name = 'Unar'
const env = process.env.TARGET
const version = require('../package.json').version
const resolve = p => path.resolve(__dirname, p)
const input = resolve('../src/Instance/index.js')

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
            file: resolve('dist/unar.js'),
            name
        },
        banner,
        env: 'development',
        format: 'es',
        plugins: [node()]
    },
    'product': {
        input,
        output: {
            file: resolve('dist/unar.min.js'),
            name
        },
        banner,
        env: 'production',
        format: 'umd',
        plugins: [node()]
    }
}
const generatorConfig = name => opts[name]

module.exports = generatorConfig(env)

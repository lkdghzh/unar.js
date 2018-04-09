var currentVersion = require('../package.json').version
var nextMajorVersion = Number(currentVersion.split(/\./)[0]) + '.0.0'
var nextSubVersion = currentVersion.replace(/\.(\d)/g, (match, p1, inx) => inx === 3 ? "." + (Number(p1) + 1) : match)
var version = null
console.log(process.env.argv)
//var parameter = process.env.argv[2]

// if (parameter === '-major') {
// 	version = nextMajorVersion
// } else if (parameter === '-current') {
// 	version = currentVersion
// } else if (parameter === '-next') {
// 	version = nextSubVersion
// }
module.exports = version

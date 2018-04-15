export default class Attr {
	static isExpression(txt) {
		return /\{\{.*\}\}/.test(txt)
	}
	static expressionKey(txt) {
		return txt.match(/(.*)\{\{(.*)\}\}(.*)/)
	}
	static checkDirective(attrName, configs) {
		var detec = {
			prefix: '',
			directive: ''
		}
		for (var key in configs) {
			var prefix = configs[key]
			if (attrName.startsWith(prefix)) {
				detec.prefix = attrName.substring(0, prefix.length)
				detec.directive = attrName.substring(prefix.length)
				break
			}
		}
		return detec
	}
}

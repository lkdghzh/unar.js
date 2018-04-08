export default class Attr {
	static isExpression(txt) {
		return /\{\{.*\}\}/.test(txt)
	}
	static expressionKey(txt) {
		return txt.match(/(.*)\{\{(.*)\}\}(.*)/)
	}
	static isRightDetec(detective, configs) {
		var detec
		for (let prefix in configs) {
			if (detective.startsWith(configs[prefix])) {
				detec = {
					detectype: detective.substring(0, configs[prefix].length),
					detec: detective.substring(configs[prefix].length)
				}
				break
			}
		}
		return detec
	}
}

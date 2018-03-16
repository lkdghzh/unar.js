export default class Attr {
	static isExpression(txt) {
		return /\{\{.*\}\}/.test(txt)
	}
	static expressionKey(txt) {
		return txt.match(/(.*)\{\{(.*)\}\}(.*)/)
	}
	static isdetec(name, prefix) {
		return name.startsWith(prefix)
	}
	static isRightDetec(preDetec, configs) {
		var detec
		for (let prefix in configs) {
			if (preDetec.startsWith(configs[prefix])) {
                console.log(preDetec.substring(0, configs[prefix].length),preDetec.substring(configs[prefix].length))
                debugger
				detec = {
					detectype: preDetec.substring(0, configs[prefix].length),
					detec: preDetec.substring(configs[prefix].length)
				}
				break
			}
		}
		return detec
	}
}

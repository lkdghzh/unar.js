/**
 * DomEvent
 */
export default class DomEvent {
	static model(node, val) {
		node.value = val
	}
	static text(node, text) {
		node.textContent = text
	}
	static html(node, html) {
		node.innerHTML = html
	}
	static bind(node, attrName, attrVal) {
		node[attrName.substr(config.attrPrefix.length, attrName.length)] = attrVal
	}
	static addEvt(node, evtName, fn) {
		node.addEventListener(evtName, fn, false)
	}
}

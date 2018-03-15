/**
 * DomEvent
 */
export default class DomEvent {
	static bind(node, prop, val, oldValue) {
		if (val !== oldValue) {
			node[prop] = val
		}
	}
	static addEvt(node, name, fn) {
		node.addEventListener(name, fn, false)
	}
}

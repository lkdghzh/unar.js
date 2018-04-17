/**
 * DomEvent
 */
export default class DomEvent {
	static bind(node, prop, val, oldValue) {
		if (prop === 'if') {
				
		} else {
			if (val !== oldValue) {
				node[prop] = val
			}
		}
	}
	static addEvt(node, evt, fn) {
		node.addEventListener(evt, fn, false)
	}
}

/**
 * DomEvent
 */
export default class DomEvent {
	static bind(node, prop, val) {//, oldValue
		node[prop] = val
	}
	static lasyCompile(node, prop, val, oldValue, holderNode) {
		if (prop === 'if') {
			if (val) {
				holderNode.parentNode.insertBefore(node, holderNode)
			} else {
				holderNode.parentNode.removeChild(node)
			}
		} else {
			//for
		}
	}
	static addEvt(node, evt, fn) {
		node.addEventListener(evt, fn, false)
	}
}

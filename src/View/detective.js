/**
 * Detictive
 */
import Register from "../Bll/register"
import Dom from "./domEvent"
export default class Detictive {
	static["model"](node, key, vm) {
		Register.registDomListener4Hubs(node, 'value', key, vm)
		node.addEventListener('input', e => {
			vm[key] = e.target.value
		}, false)
	}
	// {{}}&&text
	static["text"](node, key, vm) {
		Register.registDomListener4Hubs(node, 'textContent', key, vm)
	}
	// , vm
	static["html"](node, html, vm) {
		Register.registDomListener4Hubs(node, 'innerHTML', html, vm)
	}
	//:
	static bind(node, prop, key, vm) {
		Register.registDomListener4Hubs(node, prop, key, vm)
	}
	//@
	static addEvt(node, name, fn, vm) {
		var fn = vm.methods[fn].bind(vm)
		Dom.addEvt(node, name, fn)
	}
}

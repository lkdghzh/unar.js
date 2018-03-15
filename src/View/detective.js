/**
 * Detictive
 */
import Register from "../Bll/register"
import Dom from "./domEvent"
export default class Detictive {
	static["model"](node, key, vm) {
		Register.registDomListener4Hubs("model", node, key, vm)
		node.addEventListener('input', e => {
			vm[key] = e.target.value
		}, false)
	}
	// {{}}&&text
	static["text"](node, key, vm) {

		Register.registDomListener4Hubs("text", node, key, vm)
	}
	// , vm
	static["html"](node, html) {
		Register.registDomListener4Hubs("html", node, html)
	}
	//:
	// static bind(node, attrName, attrVal) {
	// 	Dom.bind(node, attrName, attrVal)
	// }
	//@
	static addEvt(node, name, fn, vm) {
		var fn = vm.methods[fn].bind(vm)
		Dom.addEvt(node, name, fn)
	}
}

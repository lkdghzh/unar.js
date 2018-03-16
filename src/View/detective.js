/**
 * Detictive
 */
import Register from "../Bll/register"
import Dom from "./domEvent"
export default class Detictive {
	static bind(node, prop, key, vm) {
		// model  html
		// {{}} text
		// :id
		Register.registDomListener4Hubs(node, prop, key, vm)
		if (prop === 'value') {
			const fn = e => vm[key] = e.target.value
			this.addEvt(node, 'input', fn, vm)
		}
	}
	
	static addEvt(node, evtName, key, vm) {
		//dom ,user input event ,default implement
		//@
		var fn = typeof (key) === "function" ? key : vm.methods[key].bind(vm)
		Dom.addEvt(node, evtName, fn)
	}
}

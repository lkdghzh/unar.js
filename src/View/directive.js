/**
 * Detictive
 */
import Register from "../Bll/register"
import Dom from "./domEvent"
import {
	pathVal
} from '../Utils'
export default class Detictive {
	static bind(node, prop, exp, vm, preTxt = '', nxtTxt = '') {
		// model  html
		// {{}}
		// :id
		Register.registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt)
		if (prop === 'value') {
			const fn = e => pathVal(vm, exp, e.target.value)
			this.addEvt(node, 'input', fn, vm)
		}
	}

	static addEvt(node, evt, exp, vm) {
		//dom ,user input event ,default implement
		//@
		var fn = typeof (exp) === "function" ? exp : vm.methods[exp].bind(vm)
		Dom.addEvt(node, evt, fn)
	}
}

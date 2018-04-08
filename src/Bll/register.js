import DomFn from "../View/domEvent"
import temp from "./temp"
import Listener from "../Hub/listener"

import {
	run
} from '../Utils'
export default class Register {
	static registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt) {
		const cb = (val, oldVal) => {
			DomFn.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt)
		}
		// console.log(`初始化页面get：${exp}`)
		temp.listener = new Listener(vm, exp, cb)
		var newVal = run(exp, vm)
		cb(newVal)
		temp.listener = null
	}
}

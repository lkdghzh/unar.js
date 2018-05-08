import temp from "./temp"
import Listener from "../hub/listener"
import { run } from '../Utils'

export default class Register {
	static registDomListener4Hubs(cb, exp, vm) {
		// console.log(`初始化页面get：${exp}`)
		temp.listener = new Listener(vm, exp, cb)
		var newVal = run(exp, vm)
		temp.listener = null
		/*
		 * During callback process, the template may be recompiled ,for directive eg.
		 * this's time temp.listener is not null, it will be registered to recompiled dom ,hub's listener
		 * need fine-grained limit callback function execution time (after temp listener is null)
		 */
		cb(newVal)
	}
}

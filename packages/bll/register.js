import temp from "./temp"
import Listener from "../hub/listener"
import { run } from '../Utils'

export default class Register {
	static registDomListener4Hubs(cb, exp, vm) {
		// console.log(`初始化页面get：${exp}`)
		temp.listener = new Listener(vm, exp, cb)
		var newVal = run(exp, vm)
		debugger
		cb(newVal)
		temp.listener = null
	}
}

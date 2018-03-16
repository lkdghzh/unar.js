import DomFn from "../View/domEvent"
import propType from "./propType"

import {
	hubs,
	Hub
} from "../Hub"
let count = 0
export default class Register {
	static registDomListener4Hubs(node, prop, key, vm, preTxt, nxtTxt) {
		if (vm.computeds[key]) {
			//count several nodes ->same computed prop
			propType.switch = key + '$' + ++count
			const ccb = () => {
				DomFn.bind(node, prop, preTxt + vm[key] + nxtTxt)
			}
			propType[key + '$' + count] = ccb
			ccb()
			propType.switch = undefined
		} else {
			const cb = (val, oldVal) => {
				DomFn.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt)
			}
			console.log(`初始化页面，${key}`)
			cb(vm[key])
			this.registListener4Hubs(key, cb, vm)
		}
	}
	static registListener4Hubs(key, cb, vm) {
		hubs[key] ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm))
	}
}

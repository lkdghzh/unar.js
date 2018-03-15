import DomFn from "../View/domEvent"
import propType from "./propType"

import {
	hubs,
	Hub
} from "../Hub"
var count = 0
export default class Register {
	static registDomListener4Hubs(node, prop,key, vm) {
		if (vm.computeds[key]) {
			//count several nodes ->samecomputed prop
			propType.switch = key + '_-_' + ++count
			var ccb = () => {
				DomFn.bind(node,prop, vm[key])
			}
			propType[key + '_-_' + count] = ccb
			ccb()
			propType.switch = undefined
		} else {
			var cb = (val, oldVal) => {
				DomFn.bind(node,prop, val, oldVal)
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

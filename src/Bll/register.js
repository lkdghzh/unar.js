import DomFn from "../View/domEvent"
import propType from "./propType"

import {
	hubs,
	Hub
} from "../Hub"
var count = 0
export default class Register {
	static registDomListener4Hubs(detictive, node, key, vm) {
		if (vm.computeds[key]) {
			//count several nodes ->samecomputed prop
			propType.switch = key + ++count
			var ccb = () => {
				DomFn[detictive](node, vm[key])
			}
			propType[key + count] = ccb
			ccb()
		} else {
			var cb = (val, oldVal) => {
				DomFn[detictive](node, val, oldVal)
			}
			cb(vm[key])
			this.registListener4Hubs(key, cb, vm)
		}
	}
	static registListener4Hubs(key, cb, vm) {
		hubs[key] ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm))
	}
}

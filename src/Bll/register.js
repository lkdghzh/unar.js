import DomFn from "../View/domEvent"
import propType from "./propType"

import {
	hubs,
	Hub
} from "../Hub"
export default class Register {
	static registDomListener4Hubs(detictive, node, key, vm) {
		if (vm.computeds[key]) {
			propType.switch = key
			var cpd = ()=>{
				DomFn[detictive](node, vm[key])
			}
			propType[key]=cpd
			cpd()
			propType.switch = undefined
		} else {
			var cb = (val, oldVal) => {
				DomFn[detictive](node, val, oldVal)
			}
			cb(vm[key])
			this.registListener4Hubs(key, cb, vm)
		}
	}
	static registListener4Hubs(key, cb, vm) {
		if (hubs[key]) {
			//computed
			if (propType.switch) {
				var containComputed = hubs[key].listeners.some(fn =>  fn.name === 'cfn')
				if (!containComputed) {
					hubs[key].listeners.push(cb)
				}
			}
			//data
			else if (!propType.switch) {
				hubs[key].listeners.push(cb)
			}
		} else {
			hubs[key] = new Hub(key, cb, vm)
		}
	}
}

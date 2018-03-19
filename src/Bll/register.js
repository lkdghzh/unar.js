import DomFn from "../View/domEvent"
import propType from "./propType"

import {
	hubs,
	Hub
} from "../Hub"
import {
	run
} from '../Utils'
let count = 0
export default class Register {
	static registDomListener4Hubs(node, prop, key, vm, preTxt, nxtTxt) {
		if (vm.computeds[key]) {
			//count several nodes ->same computed prop
			propType.switch = key + '$' + ++count
			const ccb = () => {
				DomFn.bind(node, prop, preTxt + run(key,vm) + nxtTxt)
			}
			propType[key + '$' + count] = ccb
			ccb()
			propType.switch = undefined
		} else {
			const cb = (val, oldVal) => {
				DomFn.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt)
			}
			//'a +"b" === ? "sth" :b'.replace(/[\"]?(\w+)[\"]?/g,(e)=>{console.log(e);return e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e:'scope.'+e})
			console.log(`初始化页面，${key}?????${run(key,vm)}`)
			cb(run(key,vm))
			this.registListener4Hubs(key, cb, vm)
		}
	}
	static registListener4Hubs(key, cb, vm) {
		hubs[key] ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm))
	}
}

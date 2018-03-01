import DomFn from "../View/domEvent"
import {
	hubs,
	Hub
} from "../Hub"
export default class Register {
	static registDomListener4Hubs(detictive, node, key, vm) {
		const cb = (val, oldVal) => {
			DomFn[detictive](node, val, oldVal)
		}
		cb(vm[key])
		this.registListener4Hubs(key, cb, vm)
	}
	static registListener4Hubs(key, cb, vm) {
		hubs[key] ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm))
	}
}

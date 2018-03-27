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
				DomFn.bind(node, prop, preTxt + run(key, vm) + nxtTxt)
			}
			propType[key + '$' + count] = ccb
			ccb()
			propType.switch = undefined
		} else {
			const cb = (val, oldVal) => {
				DomFn.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt)
			}
			// console.log(`初始化页面，${key}?????${run(key,vm)}`)
			cb(run(key, vm))
			this.registListener4Hubs(key, cb, vm)
		}
	}
	static registListener4Hubs(key, cb, vm) {
		//a.b.c
		//a['b']['c']
		//a["b"]["c"]
		//a[`b`][`c`]
		var pathReg = /\./g
		// key.match(pathReg).length
		var levels = key.split(pathReg)
		for (var i = 0, len = levels.length; i < len; i++) {
			var name = levels[i]
			var t
			//检测这个path是否有这个path的hub
			//没有的话，依次为中间的path对应key的注册hub
			//hubs.a=new Hub
			//hubs.a.children.b=new Hub
			//hubs.a.children.b.children.c=new Hub

			//最后，new这个键的hub，赋值给这个hub
			//有对应a.b.c，hubs.a.children.b.children.c对应hub
			//往这个path对应的hub的listeners，push对应的cb
			if (!i) {
				name in hubs ? hubs[name].listeners.push(cb) :
					(hubs[name] = new Hub(name, cb, vm))
				t = len > 1 && hubs[name]
			} else {
				name in t.children ? t.children.listeners.push(cb) :
					(t.children[name] = new Hub(name, cb, vm))
				t = t.children[name]
			}
		}
		//key in hubs ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm))
	}
}

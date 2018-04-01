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
	static registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt) {
		if (vm.computeds[exp]) {
			const ccb = (val = run(exp, vm)) => {
				DomFn.bind(node, prop, preTxt + val + nxtTxt)
			}
			//count several nodes ->same computed prop
			propType.switch = exp + '$' + ++count
			propType[exp + '$' + count] = ccb
			ccb()
			propType.switch = undefined
		} else {
			const cb = (val = run(exp, vm), oldVal) => {
				DomFn.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt)
			}
			console.log(`初始化页面get：${exp}`)
			cb()
			this.registListener4Hubs(exp, cb, vm)
		}
	}
	static registListener4Hubs(exp, cb, vm) {
		//a.b.c
		//TODO
		//a['b']['c']
		//a["b"]["c"]
		//a[`b`][`c`]
		var pathReg = /\./g
		// exp.match(pathReg).length
		var levels = exp.split(pathReg)
		if (levels.length === 1) {
			if (exp in hubs) {
				hubs[exp].addListener(cb)
			} else {
				hubs[exp] = new Hub(exp, vm)
				hubs[exp].addListener(cb)
			}
		} else {
			for (var i = 0, len = levels.length; i < len; i++) {
				var path = levels.filter((_, pathInx) => pathInx <= i).toString().replace(/,/g, '.')
				var name = levels[i]
				var t
				//console.log(path)
				//检测这个path是否有这个path的hub
				//没有的话，依次为中间的path对应exp的注册hub
				//hubs.a=new Hub
				//hubs.a.children.b=new Hub
				//hubs.a.children.b.children.c=new Hub

				//最后，new这个键的hub，赋值给这个hub
				//有对应a.b.c，hubs.a.children.b.children.c对应hub
				//往这个path对应的hub的listeners，push对应的cb
				if (i === 0) {
					if (!(name in hubs)) {
						hubs[name] = new Hub(path, vm)
					}
					t = hubs[name]
				} else if (i < len - 1) {
					if (!(name in t.children)) {
						t.children[name] = new Hub(path, vm)
					}
					t = t.children[name]
				} else if (i === len - 1) {
					if (name in t.children) {
						t.children[name].addListener(cb)
					} else {
						t.children[name] = new Hub(path, vm)
						t.children[name].addListener(cb)
					}
				}

			}
		}

		//exp in hubs ? hubs[exp].listeners.push(cb) : (hubs[exp] = new Hub(exp, cb, vm))
	}
}

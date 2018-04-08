import {
	run
} from '../utils'
import temp from "../bll/temp"
import defaultConfigs from "../configs"
import Listener from "../hub/listener"
import {
	typeOf
} from "../Utils"

import {
	Hub,
	hubs
} from "../hub"
export const config = (configs, vm) => {
	vm.configs = Object.assign(defaultConfigs, configs)
}
const hijack = (data, vm) => {
	Object.keys(data).forEach(key => {
		Object.defineProperty(vm, key, {
			get() {
				//it can replaced by this._data[key],this.$options.data[key] ,o.data[key]
				//not allow valCache
				//this will call `accessor get fn` 
				console.log(`hijack->get:${key}`)
				return data[key]
			},
			set(newVal) {
				data[key] = newVal
			}
		})
	})
}

const accessor = (data, vm) => {
	Object.keys(data).forEach(key => {
		var hub = new Hub(key)
		hubs.push(hub)
		//Data properties->data[key]
		var valCache = data[key]
		//Accessor properties
		Object.defineProperty(data, key, {
			get() {
				if (temp.listener) {
					hub.addListener(temp.listener)
				}
				console.log(`accessor->get:${key}`)
				return valCache
			},
			set(newVal) {
				valCache = newVal
				// object 
				if (typeOf(newVal) === 'object') {
					accessor(newVal, vm, path)
				}
				// array
				// if () {
				// 	// TODO observe array
				// }
				//set value first,then notify dom update with newVal
				hub.notify()
			}
		})
		if (typeOf(valCache) === 'object') {
			accessor(valCache, vm, path)
		}
	})
}
export const proxy = (data, vm) => {
	accessor(data, vm)
	hijack(data, vm)
}
export const watch = (watchers, vm) => {
	//Object.entries({a:1,b:2})-->[["a", 1],["b", 2]]
	for (let [exp, cb] of Object.entries(watchers)) {
		// console.log('watching...')
		temp.listener = new Listener(vm, exp, cb)
		run(exp, vm)
		temp.listener = null
	}
}

export const compute = (computeds, vm) => {
	/**
	 * 	var o={}
		Object.defineProperty(o, 'a', {
			get: function () {return 1 },
			set: function () { }
		})
		Object.getOwnPropertyDescriptor(o,'a')
		{get: ƒ, set: ƒ, enumerable: false, configurable: false}
	 */
	for (let [key, target] of Object.entries(computeds)) {
		Object.defineProperty(vm, key, {
			configurable: false,
			enumerable: true,
			get: typeOf(target) === "function" ? target : typeOf(target) === "object" ? target.get : function () {},
			set: typeOf(target) === "object" ? target.set : function () {}
		})
	}
}

import {
	run
} from '../Utils'
import propType from "../Bll/propType"
import defaultConfigs from "../Config"
import Listener from "../Hub/listener"
import {
	typeOf,
	pathVal
} from "../Utils"

import {
	Hub,
	hubs
} from "../Hub"
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
	// , parentKey = ''
	Object.keys(data).forEach(key => {
		// var path = parentKey ? parentKey + '.' + key : key
		// var hubsPath = path.replace(/(\.)/g, it => it + 'children.')
		//console.log(`currentPath->${path},${hubsPath}`)
		var hub = new Hub(key)
		hubs.push(hub)
		//Data properties->data[key]
		//it's cached,data[key] can replaced by vm._data[key],vm.$options.data,o.data 
		var valCache = pathVal(data, key)
		//Accessor properties
		//data reference->At the same time, vm._data ,vm.$options.data, o.data become three accessor properties
		Object.defineProperty(data, key, {
			get() {
				//vm._data[key],vm.$options.data[key],data[key]
				//maximum call stack size exceeded
				//computeds
				if (propType.switch) {
					//var currentComputedType = propType.switch
					//console.log(`↑  computed->ccb run,${propType.switch}用到了${key}，向${key}注册${propType.switch}函数`)
					// var cfn = function () {
					// 	//node fn
					// 	propType[currentComputedType]()

					// 	var ckey = currentComputedType.split('$')[0]
					// 	//console.log(`----------${currentComputedType},${ckey}-----------`)
					// 	//pure computed fn
					// 	typeOf(vm.computeds[ckey]) === "function" ? vm.computeds[ckey].call(vm) :
					// 		typeOf(vm.computeds[ckey]) === "object" ? vm.computeds[ckey].get.call(vm) :
					// 		""
					// }
					debugger
					hub.addListener(propType.switch)
					//Register.registListener4Hubs(hubs, key, hub)
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
				// var currentHub = pathVal(hubs, hubsPath)
				// console.log(`setCurrentPath->${path},${hubsPath},${currentHub}`)
				hub.notify()
				//hubs[key].notify()
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
	//Object.entries({a:1})-->[["a", 1]]
	for (let [exp, cb] of Object.entries(watchers)) {
		// Register.registListener4Hubs(exp, cb, vm)
		propType.switch = new Listener(vm, exp, cb)
		run(exp, vm)
		propType.switch = null

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

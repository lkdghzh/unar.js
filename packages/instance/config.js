import { run } from '../utils'
import temp from "../bll/temp"
import defaultConfigs from "../configs"
import Listener from "../hub/listener"
import { typeOf } from "../Utils"
import { Hub, hubs } from "../hub"

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

// 仅仅修改在data内初始化时的数组类型和在data内新赋值的数组类型两者的原型，
// 在其他地方，并没有修改
const getVariantProtoType = (fn) => {
	//新建对象（inheritedPrototype）继承数组的原型，让这个对象拥有数组原型上的所有方法
	var t = function () { }
	t.prototype = Array.prototype
	var inheritedPrototype = t

	//重写这个对象（inheritedPrototype）的，修改本身的方法
	['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method) => {
		inheritedPrototype[method] = () => { fn(), inheritedPrototype[method]() }
	})
	return inheritedPrototype
}
const accessorArray = (arr, expHub) => {
	var fn = () => { expHub.notify() }
	arr.prototype = getVariantProtoType(fn)

	arr.forEach((item) => {
		accessor(item)
	})
}
const accessor = (data) => {
	if (typeOf(data) !== 'object') {
		return
	}
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
				accessor(newVal)
				// array
				if (typeOf(valCache) === 'array') {
					accessorArray(valCache, hub)
				}
				//set value first,then notify dom update with newVal
				hub.notify()
			}
		})
		// object 
		accessor(valCache)
		// array
		if (typeOf(valCache) === 'array') {
			accessorArray(valCache, hub)
		}
	})
}
export const proxy = (data, vm) => {
	accessor(data)
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
			get: typeOf(target) === "function" ? target : typeOf(target) === "object" ? target.get : function () { },
			set: typeOf(target) === "object" ? target.set : function () { }
		})
	}
}

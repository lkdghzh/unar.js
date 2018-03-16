import Register from "../Bll/register"
import propType from "../Bll/propType"
import defaultConfigs from "../Config"
import {
	typeOf
} from "../Utils"

import {
	hubs
} from "../Hub"
export const config = (configs, vm) => {
	vm.configs = Object.assign(defaultConfigs, configs)
}
export const proxy = (data, vm) => {
	Object.keys(data).forEach(key => {
		//Data properties->data[key]
		//it's cached,data[key] can replaced by vm._data[key],vm.$options.data,o.data 
		var valCache = data[key]

		//Accessor properties
		//data reference->At the same time, vm._data ,vm.$options.data, o.data become three accessor properties
		Object.defineProperty(data, key, {
			configurable: false,
			enumerable: true,
			get() {
				//vm._data[key],vm.$options.data[key],data[key]
				//maximum call stack size exceeded

				//computeds
				console.log(key)

				if (propType.switch) {
					var currentComputedType = propType.switch
					console.log(`↑  computed->ccb run,${propType.switch}用到了${key}，向${key}注册${propType.switch}函数`)
					var cfn = function () {
						//node fn
						propType[currentComputedType]()
						var ckey = currentComputedType.split('$')[0]
						console.log(`----------${currentComputedType},${ckey}-----------`)
						//pure computed fn
						typeOf(vm.computeds[ckey]) === "function" ?
							vm.computeds[ckey].call(vm) : typeOf(vm.computeds[ckey]) === "object" ?
							vm.computeds[ckey].get.call(vm) : ""
					}
					Register.registListener4Hubs(key, cfn, vm)
				}
				return valCache
			},
			set(newVal) {
				valCache = newVal
				//set value first,then notify dom update with newVal
				hubs[key].notify()
			}
		})

		Object.defineProperty(vm, key, {
			configurable: false,
			enumerable: true,
			get() {
				//it can replaced by this._data[key],this.$options.data[key] ,o.data[key]
				//not allow valCache
				//this will call get above
				return data[key]
			},
			set(newVal) {
				data[key] = newVal
			}
		})
	})
}
export const watch = (watchers, vm) => {
	//Object.entries({a:1})-->[["a", 1]]
	for (let [key, cb] of Object.entries(watchers)) {
		Register.registListener4Hubs(key, cb, vm)
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

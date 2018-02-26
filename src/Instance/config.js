import Register from "../Bll/register"
export const proxy = (data, vm) => {
	Object.keys(data).forEach(key => {
		Object.defineProperty(vm, key, {
			configurable: false,
			enumerable: true,
			get() {
				return data[key]
			},
			set(newVal) {
				data[key] = newVal
			}
		})
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
				return valCache
			},
			set(newVal) {
				//console.log(key)
				valCache = newVal
				//set value first,then notify dom update with newVal
				hubs[key].notify()
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

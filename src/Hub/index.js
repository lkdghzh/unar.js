/**
 * one vm prop <---> one Hub
 */

// a:{id: 1, prop: "a", listeners: [cb1,cb2]
// b:{id: 2, prop: "b", listeners: [cb3,cb4]
var hubs = {}

window.hubs = hubs
var id = 0
class Hub {
	constructor(prop, cb, vm) {
		this.id = ++id
		this.prop = prop
		this.val = vm[prop]
		this.vm = vm
		this.listeners = []
		// debugger
		// for(let [,c] of Object.entries(vm.computeds)){
		// 	this.addListener(c.bind(vm))
		// }
		this.addListener(cb)
	}
	addListener(cb) {
		this.listeners.push(cb)
	}
	deleteListener() {}
	notify() {
		this.listeners.forEach((fn) => {
			//oldVal->this.val
			//val->this.vm[this.prop]
			fn(this.vm[this.prop], this.val)
		})
		//update val to oldVal
		this.val=this.vm[this.prop]
	}
}
//使用Object 比array在取值赋值时候，节省代码遍历。
export {
	hubs,
	Hub
}

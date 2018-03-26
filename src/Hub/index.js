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
		console.log(`↓  get -->${prop},new hub`)
		this.val = vm[prop]
		this.vm = vm
		this.children={}
		this.listeners = []
		this.addListener(cb)
	}
	addListener(cb) {
		this.listeners.push(cb)
	}
	deleteListener(inx) {
		this.listeners.splice(inx, 1)
	}
	notify() {
		this.listeners.forEach((fn) => {
			//oldVal->this.val
			//val->this.vm[this.prop]
			fn.call(this.vm, this.vm[this.prop], this.val)
		})
		//update val to oldVal
		this.val = this.vm[this.prop]
	}
}
//Object is more convenient than array when retrievalling and assigning value。
export {
	hubs,
	Hub
}

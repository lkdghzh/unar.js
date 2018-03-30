/**
 * one vm prop(path) <--> one Hub <--> one singlylist(only allow append ,delete)
 * multiple singlylist <--> hubs <--> singlylists
 * 
 * no no no! it's a tree
 */
import {
	pathVal
} from "../Utils"
// a:{id: 1, prop: "a", listeners: [cb1,cb2]
// b:{id: 2, prop: "b", listeners: [cb3,cb4]
var hubs = {}

window.hubs = hubs
var id = 0
class Hub {
	constructor(path, vm) {
		this.id = ++id
		this.path = path
		this.prop = path.slice(path.lastIndexOf('.') + 1, path.length)
		console.log(`new Hub :get -->${path}`)//,new hub -->one singlylist
		this.val = pathVal(vm, path)
		this.vm = vm
		this.children = {}
		this.listeners = []
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
			fn.call(this.vm, pathVal(this.vm, this.path), this.val)
		})
		//update val to oldVal
		this.val = pathVal(this.vm, this.path)
	}
}
//Object is more convenient than array when retrievalling and assigning value。
export {
	hubs,
	Hub
}

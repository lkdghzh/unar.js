/**
 * one vm prop <---> one Hub
 */

// a:{id: 1, prop: "a", listeners: [cb1,cb2]
// b:{id: 2, prop: "b", listeners: [cb1,cb2]
var hubs = {}
window.hubs=hubs
var id = 0
class Hub {
	constructor(prop, cb) {
		this.id = ++id
		this.prop = prop
		this.listeners = []
		this.addListener(cb)
	}
	addListener(cb) {
		this.listeners.push(cb)
	}
	deleteListener() {
	}
	notify() {
		this.listeners.forEach((fn) => {
			fn()
		})
	}
}
//使用Object 比array在取值赋值时候，节省代码遍历。
export {
	hubs,
	Hub
}

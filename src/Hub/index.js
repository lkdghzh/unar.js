/**
 * one vm prop(path) <--> one Hub <--> one singlylist(only allow append ,delete)
 * multiple singlylist <--> hubs <--> singlylists
 * 
 * no no no! it's a tree
 */
// a:{id: 1, prop: "a", listeners: [cb1,cb2]
// b:{id: 2, prop: "b", listeners: [cb3,cb4]
var hubs = []

window.hubs = hubs
// var id = 0
class Hub {
	constructor(key) {
		this.key = key
		//Object is more convenient than array when retrievalling and assigning value。
		this.listeners = {}
	}
	addListener(listener) {
		var id = listener.id
		if (!(id in this.listeners)) {
			this.listeners[id] = listener
		}
	}
	notify() {
		for (var id in this.listeners) {
			//oldVal->this.val
			//val->this.vm[this.prop]
			this.listeners[id].update()
		}
	}
}
export {
	hubs,
	Hub
}

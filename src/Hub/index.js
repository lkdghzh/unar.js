var hubs = []
window.hubs = hubs
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

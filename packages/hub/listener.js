import {
	run
} from "../utils"
var id = 0
class Listener {
	constructor(vm, exp, cb) {
		this.id = ++id
		this.exp = exp
		this.vm = vm
		this.oldVal = run(this.exp, this.vm)
		this.cb = cb
	}
	update() {
		var newVal = run(this.exp, this.vm)
		//maybe (object) complex type or simple type
		if (newVal !== this.oldVal) {
			this.cb.call(this.vm, newVal, this.oldVal)
			//update val to oldVal
			this.oldVal = newVal
		}
	}
}
export default Listener

import {
	run
} from "../Utils"
var id = 0
class Listener {
	constructor(vm, exp, cb) {
		this.id = ++id
		this.exp = exp
        this.vm = vm
		this.oldVal = run(this.exp, this.vm)
		this.cb = cb //one detective  --> one cb-->dom action
	}
	update() {
		var newVal = run(this.exp, this.vm)
		this.cb.call(this.vm, newVal, this.oldVal)
		//update val to oldVal
		this.oldVal = newVal
	}
}
export default Listener

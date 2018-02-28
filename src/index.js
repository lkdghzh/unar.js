import Unar from "../src/Instance"
window.Unar = Unar
window.app = new Unar({
	el: "#root",
	data: {
		a: 1,
		b: 2,
		id: 'input1'
	},
	methods: {
		fn() {
			console.log(this.a)
		}
	},
	computeds:{
		c(){
			return this.a+this.b
		}
	},
	watchers: {
		a: function (val, old) {
			debugger
			console.log(`a->haschanged,${old}-->${val}`)
		}
	}
})

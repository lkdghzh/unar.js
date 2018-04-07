import Unar from "../src/Instance"
window.Unar = Unar
window.instance = new Unar({
	el: "#root",
	data: {
		a: 1,
		b: 2
	},
	computeds: {
		c() {
			debugger
			return this.a + this.b
		}
	},
	watchers: {
		a: function (val, old) {
			debugger
			console.log(`a->haschanged,${old}-->${val}`)
		}
	}
})

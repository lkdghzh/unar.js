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
			return this.a + this.b
		}
	},
	watchers: {
		// a: function (val, old) {
		// 	console.log(`a->haschanged,${old}-->${val}`)
		// }
	}
})

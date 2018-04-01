import Unar from "../src/Instance"
window.Unar = Unar
window.instance = new Unar({
	el: "#root",
	data: {
		a: {
			b:{
				c:1
			},
			m:1
		}
	},
	methods: {
		fn() {
			console.log(this.a)
		}
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

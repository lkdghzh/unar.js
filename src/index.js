import Unar from "../src/Instance"
window.Unar = Unar
window.app = new Unar({
	el: "#root",
	data: {
		a: {
			b:{
				c:{
					d:1
				}
			}
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

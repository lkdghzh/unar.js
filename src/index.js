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
	computeds: {
		c() {
			debugger
			return this.a + this.b
		},
		d() {
			debugger
			return this.a + this.b
		},
		e() {
			debugger
			return this.b
		},
		f: {
			get() {
				return this.a + this.b
			},
			set() {
				console.log('f')
			}
		}
	},
	watchers: {
		a: function (val, old) {
			console.log(`a->haschanged,${old}-->${val}`)
		}
	},
	configs: {
		actionPrefix: "u-",
		attrPrefix: ":",
		evtPrefix: "@"
	}
})

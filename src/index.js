import Unar from "../src/Instance"
window.Unar = Unar
window.app = new Unar({
	el: "#root",
	data: {
		a: 1,
		b: 2,
		id: 'input1',
		g:'r'
	},
	methods: {
		fn() {
			console.log(this.a)
		},
		fn2: function () {
			console.log(this.b)
		},
		over() {
			console.log('enter')
			this.g='g'
		},
		out() {
			console.log('out')
			this.g='r'
		}
	},
	computeds: {
		c() {
			return this.a + this.b
		},
		d() {
			return this.a + this.b
		},
		e() {
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

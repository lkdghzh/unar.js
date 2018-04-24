import Unar from "../../packages/instance"
window.Unar = Unar
window.app = new Unar({
	el: "#root",
	data: {
		a: 1,
		b: 2,
		id: 'name',
		i: true,
		e:{a:'e.a'}
	},
	computeds: {
		c() {
			return this.a + this.b
		},
		d: {
			get() {
				return this.a + this.b
			},
			set(val) {
				console.log(val, 11)
			}
		}
	},
	watchers:{
		a(val,oldVal){
			console.log(`${oldVal}-->${val}`)
		}
	},
	methods: {
		fn() {
			console.log(this.a)
		}
	}
})

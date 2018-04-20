import Unar from "../../packages/instance"
window.Unar = Unar
window.app = new Unar({
	el: "#root",
	data: {
		a: 1,
		b: 2,
		id: 'name',
		i: true
	},
	methods: {
		fn() {
			console.log(this.a)
		}
	}
})

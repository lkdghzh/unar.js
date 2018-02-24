import Unar from "../src/Instance"
window.Unar=Unar
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
	}
})

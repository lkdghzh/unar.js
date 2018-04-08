import Unar from "../../packages/instance"
window.Unar = Unar
const app = new Unar({
	el: "#root",
	data: {
		a: 1,
		b: 2,
		id: 'name'
	},
	methods: {
		fn() {
			console.log(this.a)
		}
	}
})

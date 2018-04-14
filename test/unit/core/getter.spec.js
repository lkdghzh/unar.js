import Unar from 'Unar'
describe("getter", function () {
	var instance = new Unar({
		el: "#root",
		data: {
			a: 1
		}
	})
	it("count", function () {
		expect(instance.a).toEqual('hello');
	})
})

import fn from 'test'
describe("hub", function () {
	var a = 'hello'
	it("test1", function () {
		expect(a).toEqual('hello');
	})
	it("test2", function () {
		expect("first unit test").toEqual(fn());
	})
})

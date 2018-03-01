// import 
export default class Util {
	constructor() {

	}
	static set(obj, key, val) {

	}
	static extend() {

	}
	// var o = { a: { b: { c: 1 } } }
	// getPathVal(o, 'a.b.c')
	static getPathVal(obj, path) {
		var pathArr = path.split('.')
		var t;
		for (let [inx, key] of pathArr.entries()) {
			if (!inx) {
				t = obj[key]
			} else {
				t = t[key]
			}
		}
		return t
	}
	defDataProp(o, key, val, state) {
		var states = {
			'': [1, 1, 1],
			'': [1, 1, 0],
			'': [1, 0, 1],
			'': [1, 0, 0],
			'': [0, 1, 1],
			'': [0, 1, 0],
			'': [0, 0, 1],
			'': [0, 0, 0]
		}
		
		var [configurable, enumerable, writable]=states[state]
		Object.defineProperty(o, key, {
			configurable: !!configurable,
			enumerable: !!enumerable,
			writable: !!writable,
			value: val
		})
	}
	defAccessProp(o, key, val, state) {
		var states = ['', '', '', '']
		Object.defineProperty(o, key, {
			configurable: !!writable,
			enumerable: !!enumerable,
			get() {},
			set(newVal) {}
		})
	}
}

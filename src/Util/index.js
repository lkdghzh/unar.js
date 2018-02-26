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
	
}

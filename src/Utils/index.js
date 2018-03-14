// import 
// export const set = (o) => {

// }
// export const extend = (o) => {

// }
// export const defDataProp = (o, key, val, state) => {
// 	var states = {
// 		'': [1, 1, 1],
// 		'': [1, 1, 0],
// 		'': [1, 0, 1],
// 		'': [1, 0, 0],
// 		'': [0, 1, 1],
// 		'': [0, 1, 0],
// 		'': [0, 0, 1],
// 		'': [0, 0, 0]
// 	}

// 	var [configurable, enumerable, writable] = states[state]
// 	Object.defineProperty(o, key, {
// 		configurable: !!configurable,
// 		enumerable: !!enumerable,
// 		writable: !!writable,
// 		value: val
// 	})
// }
// export const defAccessProp = (o, key, val, state) => {
// 	var states = ['', '', '', '']
// 	Object.defineProperty(o, key, {
// 		configurable: !!writable,
// 		enumerable: !!enumerable,
// 		get() {},
// 		set(newVal) {}
// 	})
// }
export const getPathVal = (obj, path) => {
	// var o = { a: { b: { c: 1 } } }
	// getPathVal(o, 'a.b.c')
	var pathArr = path.split('.')
	var t
	for (let [inx, key] of pathArr.entries()) {
		if (!inx) {
			t = obj[key]
		} else {
			t = t[key]
		}
	}
	return t
}
export const typeOf = (o) => {
	var _target
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
}

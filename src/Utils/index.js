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

export const pathVal = (obj, path, val) => {
	// var o = { a: { b: { c: 1 } } }
	// pathVal(o, 'a.b.c')
	// pathVal(o, 'a.b.c',2)
	var pathArray = path.split('.')
	var length = pathArray.length
	var t
	var count = 0
	for (var inx in pathArray) {
		var key = pathArray[inx]
		if (!count) {
			if (typeof val === 'undefined') {
				t = obj[key]
			}else{
				obj[key]=val
				t=val
			}
		} else {
			if (typeof val === 'undefined') {
				t = t[key]
			} else {
				if (count < length - 1) {
					t = t[key]
				} else if (count === length - 1) {
					t[key] = val
					t = val
				}
			}
		}
		count++
	}
	return t
}
export const typeOf = (o) => {
	var _target
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
}
export const run = (exp, scope) => {
	try {
		var fn
		fn = new Function('vm', 'with(vm){return ' + exp + '}')
		return fn(scope)
	} catch (e) {
		console.error('')
	}
}

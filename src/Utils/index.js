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


//'{{a+"b"}} c {{d+f}}e'
// -> scope.a + "b" + " c " + scope.d + scope.f
// const bind=(exp,scope)=>{
// 	var result=''
// 	var parts=exp.split(/\{\{(.+?)\}\}/g)
// 	return 
// }
// a +"b" === ? "sth" :b
// scope.a +"b" === ? "sth" :scope.b
// export const computeExp = (exp, scope) => {
// 	exp = addScope(scope);
// 	var fn = new Function('scope', 'return ' + exp);
// 	return fn(scope);
// }

export const pathVal = (obj, path) => {
	// var o = { a: { b: { c: 1 } } }
	// PathVal(o, 'a.b.c')
	// PathVal(o, 'a.b.c',2)
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
/**
 * 
 * @param {Object} obj literal
 * @param {String} path '.',then resolve [''][``][""] or  rewrite [''][``][""] this to '.'
 * @param {any} val 
 */
export const setPathVal=(obj, path,val)=>{
	// var o = { a: { b: { c: 1 } } }
	// setPathVal(o, 'a.b.c',2)
	
}
export const typeOf = (o) => {
	var _target
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
}


// export const run = (exp, scope) => {
// 	try {
// 		with(scope) {
// 			return eval(exp)
// 		}
// 	} catch (e) {
// 		console.error('translate exp abnormal')
// 	}
// }

// a +"b" === ? "sth" :b
// scope.a +"b" === ? "sth" :scope.b
//"a +'b' === ? 'sth' :b".replace(/[\"\']?(\w+)[\"\']?/g,(e)=>{console.log(e);return e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e:'scope.'+e})
//'a +"b" === ? "sth" :b'.replace(/[\"\']?(\w+)[\"\']?/g,(e)=>{console.log(e);return e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e:'scope.'+e})
// const scopeExp = (exp, vm) =>
// 	exp.replace(/[\"\']?(\w+)[\"\']?/g, (e) =>
// 		e.startsWith('"') && e.endsWith('"') ||
// 		e.startsWith("'") && e.endsWith("'") ? e : (vm + '.' + e)
// 	)

export const run = (exp, scope) => {
	try {
		var fn
		fn = new Function('vm', 'with(vm){return ' + exp + '}')
		return fn(scope)
	} catch (e) {
		console.error('')
	}
}

export const typeOf = (o) => {
	var _target
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
}
var keywords = RegExp([
	'^break$',
	'^case$',
	'^catch$',
	'^continue$',
	'^default$',
	'^delete$',
	'^do$',
	'^else$',
	'^finally$',
	'^for$',
	'^function$',
	'^if$',
	'^in$',
	'^instanceof$',
	'^new$',
	'^return$',
	'^switch$',
	'^this$',
	'^throw$',
	'^try$',
	'^typeof$',
	'^var$',
	'^void$',
	'^while$',
	'^with$'].join('|'), 'g')
export const run = (exp, scope) => {
	if (keywords.test(exp)) {
		console.error(`when getting value of "${exp}",there's a unresolved error. "${exp}" is keyword,it shouldn't used as key in data`)
		return 
	} else {
		try {
			var fn
			fn = new Function('vm', `with(vm){return ${exp}}`)
			return fn(scope)
		} catch (e) {
			console.error(`when getting value of "${exp}",there's a unresolved error`)
		}
	}
}
export const runSet = (exp, val, scope) => {
	try {
		var fn
		fn = new Function('vm', `with(vm){${exp} = '${val}'}`)
		return fn(scope)
	} catch (e) {
		console.error(`when setting value for ${exp},there's a unresolved error`)
	}
}

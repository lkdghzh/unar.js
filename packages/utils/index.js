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
		console.error(`${exp} has a unresolved error`)
	}
}

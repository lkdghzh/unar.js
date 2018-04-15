/**
 * Detictive
 */
import Register from "../bll/register"
import Dom from "./dom-event"
import props from "./props"
export default class Detictive {
	constructor(opts) {
		this.name = opts.name//model click
		this.expOrFn = opts.expOrFn//a fn1

		this.domPropOrEvt = props[opts.name] ? props[opts.name] : opts.name////u-model ->value //@click  ->click
		this.vm = opts.vm
		this.node = opts.node
		this.preTxt = opts.preTxt
		this.nxtTxt = opts.nxtTxt
	}
	bind() {
		// model  html
		// {{}}
		// :id
		Register.registDomListener4Hubs(this.node, this.domPropOrEvt, this.expOrFn, this.vm, this.preTxt, this.nxtTxt)
		if (this.domPropOrEvt === 'value') {
			//when set by user,the exp is must be a variable.
			// not allow expression
			const fn = e => this.vm[this.expOrFn] = e.target.value
			this.addEvt(fn, 'input')
		}
	}
	addEvt(fn = this.expOrFn, evt = this.name) {
		//dom ,user input event ,default implement
		//@
		var fn = typeof (fn) === "function" ? fn : this.vm.methods[fn].bind(this.vm)
		Dom.addEvt(this.node, evt, fn)
	}
}

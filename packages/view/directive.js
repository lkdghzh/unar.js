/**
 * Detictive
 */
import Register from "../bll/register"
import Dom from "./dom"
import props from "./props"
export default class Detictive {
	constructor(opts) {
		this.name = opts.name//model click
		this.expOrFn = opts.expOrFn//a fn1

		this.domPropOrEvt = props[opts.name] ? props[opts.name] : opts.name////u-model ->value //@click  ->click
		this.vm = opts.vm
		this.compiler = opts.compiler
		this.node = opts.node
		this.preTxt = opts.preTxt || ''
		this.nxtTxt = opts.nxtTxt || ''
	}
	bind() {
		// model  html
		// {{}}
		// :id
		const cb = (val, oldVal) => {
			Dom.bind(this.node, this.domPropOrEvt, this.preTxt + val + this.nxtTxt, this.preTxt + oldVal + this.nxtTxt)
		}
		Register.registDomListener4Hubs(cb, this.expOrFn, this.vm)
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
	lasyCompile() {
		this.compiler.compileChild(this.node)
		var holderNode = document.createTextNode('')
		this.node.parentNode.insertBefore(holderNode, this.node)
		this.node.parentNode.removeChild(this.node)
		const cb = (val, oldVal) => {
			Dom.lasyCompile(this.node, this.domPropOrEvt, val, oldVal, holderNode)
		}
		Register.registDomListener4Hubs(cb, this.expOrFn, this.vm)
	}
}

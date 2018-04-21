// import Directive from '../directive'
import Register from "../../bll/register"
import Dom from "../dom"
import props from "../props"
export default class Model {
    constructor(opts) {
        // super(...args)
        this.name = opts.name//model click
        //not expOrfn -->exp
        this.exp = opts.expOrFn//a fn1
        //not domPropOrEvt -->prop
        this.prop = 'value'//props[opts.name] ? props[opts.name] : opts.name////u-model ->value //@click  ->click

        this.vm = opts.vm
        this.compiler = opts.compiler
        this.node = opts.node
        //remove pre next
    }
    bind() {
        // model  html
        // {{}}
        // :id
        const cb = (val, oldVal) => {
            Dom.bind(this.node, this.prop, val, oldVal)
        }
        Register.registDomListener4Hubs(cb, this.exp, this.vm)
        
        //when set by user,the exp is must be a variable.
        // not allow expression
        const fn = e => this.vm[this.exp] = e.target.value
        this.addEvt(fn, 'input')
       
    }
    addEvt(fn, evt) {
		//dom ,user input event ,default implement
		Dom.addEvt(this.node, evt, fn)
	}
}
import Base from './base'
export default class Model extends Base {
    constructor(opts) {
        super(opts)
        this.exp = opts.expOrFn
        this.prop = 'value'
    }
    bind() {
        const cb = (val) => {
            this.node[this.prop] = val
        }
        super.bind(cb)
        this.addEvt()
    }
    addEvt() {
        //default implement  duplex-->true
        //when set by user,the exp is must be a variable,not allow expression
        const fn = e => this.vm[this.exp] = e.target.value
        this.node.addEventListener('input', fn, false)
    }
    // destroy() {
    //     super.destroy()
    //     nullify(this.exp, this.prop)
    // }
}
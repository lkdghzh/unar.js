import Base from './base'
export default class On extends Base {
    constructor(opts) {
        super(opts)
        this.evtName = this.directive
        this.evt = this.exp
    }
    bind() {
        this.node.addEventListener(this.evtName, this.vm.methods[this.evt].bind(this.vm), false)
    }
}
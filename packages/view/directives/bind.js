import Base from './base'
export default class Bind extends Base {
    constructor(opts) {
        super(opts)
        this.prop = this.directive
    }
    bind() {
        const cb = (val) => {
            this.node[this.prop] = val
        }
        super.bind(cb)
    }
}
import Base from './base'

export default class Html extends Base{
    constructor(opts) {
        super(opts)
        this.prop = 'innerHTML'
    }
    bind() {
        const cb = (val) => {//, oldVal
            this.node[this.prop] = val
        }
        super.bind(cb)
    }
}
import Base from './base'

export default class If extends Base {
    constructor(opts) {
        super(opts)
        this.exp = opts.expOrFn
        this.compiler = opts.compiler
    }
    bind() {
        this.lasyCompile()
    }
    lasyCompile() {
        this.compiler.compileChild(this.node)
        var holderNode = document.createTextNode('')
        this.node.parentNode.insertBefore(holderNode, this.node)
        this.node.parentNode.removeChild(this.node)
        const cb = (val) => {//, oldVal
            if (val) {
                debugger
                holderNode.parentNode.insertBefore(this.node, holderNode)
                debugger
            } else {
                debugger
                holderNode.parentNode.removeChild(this.node)
                debugger
            }
        }
        super.bind(cb)
    }
}
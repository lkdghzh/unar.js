import Base from './base'
export default class For extends Base {
    constructor(opts) {
        super(opts)
        this.compiler = opts.compiler
        debugger
        this.exp=this.exp.split('of')[1].replace(/\s/g, '').split('.')
    }
    bind() {
        var itemName = this.exp.split('of')[0].replace(/\s/g, '')
        // var arrNames = exp.split('of')[1].replace(/\s/g, '').split('.')
        var parentNode = this.node.parentNode
        var startNode = document.createTextNode('')
        var endNode = document.createTextNode('')
        var range = document.createRange()
        parentNode.replaceChild(endNode, this.node)
        parentNode.insertBefore(startNode, endNode)
        const cb = (val) => {
            range.setStart(startNode, 0)
            range.setEnd(endNode, 0)
            range.deleteContents()
            if (val) {
                val.forEach((it, inx) => {
                    var cloneNode = this.node.cloneNode(true)
                    parentNode.insertBefore(cloneNode, endNode)
                    /**
                     * we have a goal:can use it ,arr,$index in child-nodes eg.
                     * 
                     * <div u-for="it of arr">
                     *  <span u-html='it.id' :id='$index' :parent='arr[$index].id'></span>
                     * </div>
                     */
                    var childVM = Object.create(scope)
                    childVM.$index = inx
                    childVM[itemName] = it
                    debugger
                    var compiler = new this.compiler(cloneNode, childVM)
                    compiler.compile()
                })
            } else {
                parentNode.removeChild(this.node)
            }
        }
        debugger
        super.bind(cb)
    }
}
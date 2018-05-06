import Base from './base'
export default class For extends Base {
    constructor(opts) {
        super(opts)
        this.templater = opts.templater
        this.arr=this.exp.split('of')[1].replace(/\s/g, '').split('.')
    }
    bind() {
        var itemName = this.exp.split('of')[0].replace(/\s/g, '')
        // var arrNames = exp.split('of')[1].replace(/\s/g, '').split('.')
        var parentNode = this.node.parentNode
        var holderNode = document.createTextNode('')
        parentNode.insertBefore(holderNode, this.node)
        parentNode.removeChild(this.node)
        const cb = (val) => {
            if (val) {
                val.forEach((it, inx) => {
                    var cloneNode = this.node.cloneNode(true)
                    parentNode.insertBefore(cloneNode, holderNode)
                    /**
                     * we have a goal:can use it ,arr,$index in child-nodes eg.
                     * 
                     * <div u-for="it of arr">
                     *  <span u-html='it.id' :id='$index' :sth='arr[$index].id'></span>
                     * </div>
                     */
                    var childVM = Object.create(this.vm)
                    childVM.index = inx
                    childVM[itemName] = it
                    this.templater.compile(cloneNode,childVM)
                })
            } else {
                parentNode.removeChild(this.node)
            }
        }
        debugger
        super.bind(cb)
    }
}
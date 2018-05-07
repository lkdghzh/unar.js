import Base from './base'
export default class For extends Base {
    constructor(opts) {
        super(opts)
        this.templater = opts.templater
        this.arr=this.exp.split('of')[1].replace(/\s/g, '')
    }
    bind() {
        var item = this.exp.split('of')[0].replace(/\s/g, '')
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
                    this.vm[this.arr].index=inx
                    var childVM = Object.create(this.vm)
                    childVM.index = inx
                    childVM[item] = it
                    this.templater.compile(cloneNode,childVM)
                })
            } else {
                parentNode.removeChild(this.node)
            }
        }
        super.bind(cb)
    }
}
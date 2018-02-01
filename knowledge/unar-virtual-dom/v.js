/**
 * create virtual dom with js object
 */
class VNode {
    constructor(name, props = {}, children = []) {
        this.name = name
        this.props = props
        this.children = children
    }
}
export const v = (name, props, ...children) => {
    let vnode = new VNode(name, props, children)
    return vnode
}
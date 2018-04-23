import Register from "../../bll/register"

export default class Base {
    constructor({ prefix, directive, exp, node, vm }) {
        this.prefix = prefix
        this.directive = directive
        this.exp = exp
        this.vm = vm
        this.node = node
    }
    bind(cb) {
        // model  html
        // {{}}
        // :id
        Register.registDomListener4Hubs(cb, this.exp, this.vm)
    }
    // destroy() {
    //     nullify(this.name, this.vm, this.node)
    // }
}

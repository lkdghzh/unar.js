/**
 * Detictive
 */
import Register from "../../bll/register"

// const nullify = (...args) => {
//     args.map(arg => null)
// }
export default class Base {
    constructor(opts) {
        this.name = opts.name
        this.vm = opts.vm
        this.node = opts.node
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

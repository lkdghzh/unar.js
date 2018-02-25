
import DomFn from "../DomEvent"
import {
    hubs,
    Hub
} from "../../Hub"
export default class Register {
    static registListener(detictive, node, key, vm) {
        var cb = (val, oldVal) => {
            DomFn[detictive](node, val, oldVal)
        }
        cb(vm[key])
        hubs[key] ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm))
    }
}

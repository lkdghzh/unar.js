/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
import config from "../../Config"
import DomFn from "../DomEvent"
import Hub from "../../Hub"
var hubs = []
window.hubs = hubs
export default class Detictive {
    static [config.actionPrefix + "-model"](node, key, vm) {
        debugger
        this._update("model", node, key, vm)
    }
    static [config.actionPrefix + "-text"](node, text, vm) {
        this._update("text", node, text)
    }
    static [config.actionPrefix + "-html"](node, html, vm) {
        this._update("html", node, html)
    }
    //:
    static bind(node, attrName, attrVal) {
        DomFn.bind(node, attrName, attrVal)
    }
    //@
    static addEvt(node, attrName, fn) {
        var evtName = attrName.substr(config.evtPrefix.length, attrName.length)
        var fn = this.methods[fn].bind(this)
        DomFn.addEvt(node, evtName, fn)
    }
    static _update(detictive, node, key, vm) {
        var cb = DomFn[detictive]
        cb(node, vm[key])
        //检测hubs 是否具备此prop（value）hub，有的添加cb回调，没有创建便hub
        var has = false
        for (let hub of hubs) {
            if (hub.prop === key) {
                hub.listeners.push(cb)
                has = true
                break
            }
        }
        !has && hubs.push(new Hub(key, cb))
    }
}
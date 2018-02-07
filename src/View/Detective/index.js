/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
import config from "../../Config"
import DomFn from "../DomEvent"
import Hub from "../../Hub"
var hubs = [];
export default class Detictive {
    static[config.actionPrefix + "-model"](node, val) {
        this._update("model", node, val)
    }
    static[config.actionPrefix + "-text"](node, text) {
        this._update("text", node, text)
    }
    static[config.actionPrefix + "-html"](node, html) {
        this._update("html", node, html)
    }
    //:
    static bind(node, attrName, attrVal) {
        DomFn.bind(node, attrName, attrVal)
    }
    //@
    static addEvt(node, attrName, fn) {
        var evtName = attrName.substr(config.evtPrefix.length, attrName.length)
        var fn=this.methods[fn].bind(this)
        debugger
        DomFn.addEvt(node, evtName, fn)
    }
    static _update(detictive, node, val) {
        var cb = DomFn[detictive];
        cb(node, val);
        //检测hubs 是否具备此prop（value）hub，有的添加cb回调，没有创建便hub

        hubs.push(new Hub(val, cb))
    }
}
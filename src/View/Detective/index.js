/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
import config from "../../Config"
import DomFn from "../DomEvent"
import Hub from "../../Hub"
var hubs=[];
export default class Detictive {
    static [config.actionPrefix + "-model"](node, val) {
        debugger
        this._update("model", node, val)
    }
    static [config.actionPrefix + "-text"](node, text) {
        this._update("text", node, text)
    }
    static [config.actionPrefix + "-html"](node, html) {
        this._update("html", node, html)
    }
    //:
    static bind(node, attrName, attrVal) {
        DomFn.bind(node, attrName, attrVal)
    }
    //@
    static addEvt(node, attrName, fn) {
        debugger
        DomFn.addEvt(node, attrName, attrVal)
    }
    static _update(detictive, node, val) {
        var cb = DomFn[detictive];
        cb(node, val);
        hubs.push(new Hub(cb))
    }
}
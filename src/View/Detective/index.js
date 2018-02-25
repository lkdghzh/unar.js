/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
import config from "../../Config"
import DomFn from "../DomEvent"
import {
	hubs,
	Hub
} from "../../Hub"
// debugger
export default class Detictive {
	static[config.actionPrefix + "-model"](node, key, vm) {
		// debugger
		this._update("model", node, key, vm)
		node.addEventListener('input', e => {
			vm[key] = e.target.value
		}, false)
	}
	// {{}}&&text
	static["text"](node, key, vm) {
		this._update("text", node, key, vm)
	}
	// , vm
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
		var fn = this.methods[fn].bind(this)
		DomFn.addEvt(node, evtName, fn)
	}
	static _update(detictive, node, key, vm) {
		var cb = (val, oldVal)=> {
			DomFn[detictive](node, val, oldVal)
		}
		cb(vm[key])
		hubs[key] ? hubs[key].listeners.push(cb) :( hubs[key] = new Hub(key, cb,vm) )
	}
}

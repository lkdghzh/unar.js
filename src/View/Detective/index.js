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
	}
	static[config.actionPrefix + "-text"](node, text, vm) {
		this._update("text", node, text)
	}
	static[config.actionPrefix + "-html"](node, html, vm) {
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
		// debugger
		if (detictive === 'model') {
			console.log(`model`)
			node.addEventListener('input', e => {
				debugger
				vm[key] = e.target.value
			}, false)
		}
		cb(node, vm[key])
		// ----------------------------------------------------???
		//检测hubs 是否具备此key，有的添加cb回调，没有创建便hub
		if (hubs[key]) {
			hubs[key].listeners.push(cb.bind(undefined, node))
		} else {
			hubs[key] = new Hub(key, cb.bind(undefined, node))
		}
	}
}

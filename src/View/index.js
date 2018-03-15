/**
 * Templater
 */
import Attr from "./attr"
import Detective from "./detective"

export default class Templater {
	constructor(selector, vm) {
		this.vm = vm
		this.el = document.querySelector(selector)
		if (this.el) {
			this.el.appendChild(this.init())
		}
	}
	init() {
		const fragment = document.createDocumentFragment()
		this.filterNode2fragment(fragment)
		//init view
		fragment.childNodes.forEach((node) => {
			this.initAttrEvt(node)
		})
		return fragment
	}
	filterNode2fragment(fragment) {
		//all nodes
		for (let i = 0; i < this.el.childNodes.length; i++) {
			const node = this.el.childNodes[i]
			const nodeType = node.nodeType
			//for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
			if (nodeType === 1 || nodeType === 8 || (nodeType === 3) && !this._isPureBlankNode(node)) {
				fragment.appendChild(node)
					--i
			}
		}
	}
	initAttrEvt(node) {
		if (node.nodeType === 1) {
			//node.attributes
			for (let attr of node.attributes) {
				const preProp = attr.nodeName
				const key = attr.nodeValue
				//u-html u-model
				if (Attr.isdetec(preProp, this.vm.configs.actionPrefix)) {
					const prop = preProp.substring(this.vm.configs.actionPrefix.length)
					Detective[prop](node, key, this.vm)
					continue
				}
				//:id
				if (Attr.isdetec(preProp,this.vm.configs.attrPrefix)) {
					const prop = preProp.substring(this.vm.configs.attrPrefix.length)
				    Detective.bind(node, prop, key, this.vm)
				    continue
				}
				//@click
				if (Attr.isdetec(preProp,this.vm.configs.evtPrefix)) {
					const prop = preProp.substring(this.vm.configs.evtPrefix.length)
				    Detective.addEvt(node, prop, key,this.vm)
				    continue
				}
			}
			node.childNodes.forEach((childNode) => {
				this.initAttrEvt(childNode)
			})
		}
		//text with {{}}
		if (node.nodeType === 3) {
			if (Attr.isExpression(node.data)) {
				// preText,nextText
				const [, , keyText, ] = Attr.expressionKey(node.data)
				Detective['text'](node, keyText, this.vm)
				//continue
			}
		}

	}
	//https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM
	_isPureBlankNode(node) {
		// Use ECMA-262 Edition 3 String and RegExp features
		return !(/[^\t\n\r ]/.test(node.data))
	}
}

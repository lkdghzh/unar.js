/**
 * Templater
 */
import Attr from "./attr"
import Directive from "./directive"

export default class Templater {
	constructor(selector, vm) {
		this.vm = vm
		this.el = document.querySelector(selector)
		this.el.appendChild(this.init())
	}
	init() {
		const docFrag = document.createDocumentFragment()
		//translat dom to fragment
		this.translate(docFrag).childNodes.forEach((node) => {
			//init view
			this.initAttr(node)
		})
		return docFrag
	}
	translate(docFrag) {
		for (let i = 0; i < this.el.childNodes.length; i++) {
			const node = this.el.childNodes[i]
			if (this.isValidType(node)) {
				docFrag.appendChild(node)
				--i
			}
		}
		return docFrag
	}
	initAttr(node) {
		const props = {
			model: 'value', //v-model
			html: 'innerHTML', //v-html
			text: 'textContent', //{{}}
			class: 'className' //:class
		}
		if (node.nodeType === 1) {
			//for (let attr of node.attributes) {
			new Array().slice.call(node.attributes).forEach(attr => {
				const attrName = attr.nodeName
				const exp = attr.nodeValue
				const {
					prefix,
					directive
				} = Attr.checkDirective(attrName, this.vm.configs)

				if (directive) {
					node.removeAttribute(attrName)
					const prop = props[directive] ? props[directive] : directive
					if (prefix === this.vm.configs.evtPrefix) {
						//@click
						Directive.addEvt(node, prop, exp, this.vm)
					} else {
						//u-html u-model
						//:id
						Directive.bind(node, prop, exp, this.vm)
					}
				}
			})
			node.childNodes.forEach((childNode) => {
				this.initAttr(childNode)
			})
			return
		}
		if (node.nodeType === 3) {
			if (Attr.isExpression(node.data)) {
				//text with {{}}
				const [, preTxt, key, nxtTxt] = Attr.expressionKey(node.data)
				Directive.bind(node, props.text, key, this.vm, preTxt, nxtTxt)
			}
		}
	}
	isValidType(node) {
		//for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
		return node.nodeType === 1 || node.nodeType === 8 || (node.nodeType === 3) && !this.isPureBlankNode(node)
	}
	//https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM
	isPureBlankNode(node) {
		// Use ECMA-262 Edition 3 String and RegExp features
		return !(/[^\t\n\r ]/.test(node.data))
	}
}

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
		var filledFrag = this.fillFrag(docFrag)
		this.compile(filledFrag)
		return docFrag
	}
	fillFrag(docFrag) {
		for (let i = 0; i < this.el.childNodes.length; i++) {
			const node = this.el.childNodes[i]
			if (this.isValidType(node)) {
				docFrag.appendChild(node)
					--i
			}
		}
		return docFrag
	}
	compile(node) {
		//translat dom to fragment
		node.childNodes.forEach((node) => {
			//init view
			this.compileNode(node)
		})
	}
	compileNode(node) {
		if (node.nodeType === 1) {
			//for (let attr of node.attributes) {
			this.compileElement(node)
		} else if (node.nodeType === 3) {
			this.compileText(node)
		}
	}
	compileElement(node) {
		new Array().slice.call(node.attributes).forEach(attr => {
			const attrName = attr.nodeName
			const {
				prefix,
				directive
			} = Attr.checkDirective(attrName, this.vm.configs)
			const expOrFn = attr.nodeValue

			if (directive) {
				node.removeAttribute(attrName)
				//@click  ->click
				//u-model ->value
				var currentDirective = new Directive({
					name: directive,
					expOrFn: expOrFn,
					node: node,
					vm: this.vm
				})

				if (prefix === this.vm.configs.evtPrefix) {
					//@click
					currentDirective.addEvt()
				} else {
					if (directive === 'if' || directive === 'for') {
						currentDirective.control()
					} else {
						//u-html u-model
						//:id
						currentDirective.bind()
					}
				}
			}
		})
		node.childNodes.forEach((childNode) => {
			this.compileNode(childNode)
		})
	}
	compileText(node) {
		if (Attr.isExpression(node.data)) {
			//text with {{}}
			const [, preTxt, expOrFn, nxtTxt] = Attr.expressionKey(node.data)
			var currentDirective = new Directive({
				name: 'text',
				expOrFn: expOrFn,

				node: node,
				preTxt: preTxt,
				nxtTxt: nxtTxt,
				vm: this.vm
			})
			currentDirective.bind()
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

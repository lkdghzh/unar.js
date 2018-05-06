/**
 * Templater
 */
import Attr from "./attr"
import directivesFactory from "./directives/index"


export default class Templater {
	constructor(selector, vm) {
		this.vm = vm
		this.el = typeof selector === 'string' ? document.querySelector(selector) : selector
	}
	init() {
		let frag = this.fillFrag()
		this.compile(frag)
		this.el.appendChild(frag)
	}
	fillFrag() {
		let frag = document.createDocumentFragment()
		for (let i = 0; i < this.el.childNodes.length; i++) {
			const node = this.el.childNodes[i]
			if (this.isValidType(node)) {
				frag.appendChild(node)
				--i
			}
		}
		return frag
	}
	compile(node = this.el, vm = this.vm) {
		node.childNodes.forEach((child) => {
			if (child.nodeType === 1) {
				this.compileElement(child, vm)
			} else if (child.nodeType === 3) {
				this.compileText(child, vm)
			}
		})
	}
	compileElement(node, vm) {
		let lasyDirective = null
		let directiveDescriptor = { isLasy: false, type: '', exp: '' }
		Array.from(node.attributes).forEach(attr => {
			let attrName = attr.nodeName
			let { prefix, directive } = Attr.checkDirective(attrName, this.vm.configs)
			let exp = attr.nodeValue//expOrfn
			if (directive) {
				node.removeAttribute(attrName)
				//@click  ->click
				//u-model ->value
				let currentDirective = directivesFactory({
					prefix,
					directive: directive,
					exp: exp,
					node: node,
					vm: vm,
					templater: this
				})
				//first detect if for directive
				if (directive === 'if' || directive === 'for') {
					directiveDescriptor = { isLasy: true, type: directive, exp: exp }
					lasyDirective = currentDirective
				} else {
					//@click
					//u-html u-model
					//:id
					currentDirective.bind()
				}
			}
		})
		if (directiveDescriptor.isLasy) {
			lasyDirective.bind()
		}else{
			this.compile(node, vm)
		}
	}
	compileText(node, vm) {
		if (Attr.isExpression(node.data)) {
			//text with {{}}
			const [, preTxt, exp, nxtTxt] = Attr.expressionKey(node.data)
			let currentDirective = new Directive({
				name: 'text',
				exp: exp,

				node: node,
				preTxt: preTxt,
				nxtTxt: nxtTxt,
				vm: vm
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

/**
 * Templater
 */
import compile from "./compile"

export default class Templater {
	constructor(selector, vm) {
		this.vm = vm
		this.el = typeof selector === 'string' ? document.querySelector(selector) : selector
	}
	init() {
		let frag = this.fillFrag()
		compile(frag, this.vm)
		this.el.appendChild(frag)
	}
	fillFrag() {
		//return document.createRange().createContextualFragment(this.el.innerHTML)
		let frag = document.createDocumentFragment()
		var first
		while((first=this.el.firstChild)){
			frag.appendChild(first)
		}
		// for (let i = 0; i < this.el.childNodes.length; i++) {
		// 	const node = this.el.childNodes[i]
		// 	if (this.isValidType(node)) {
		// 		frag.appendChild(node)
		// 		--i
		// 	}
		// }
		return frag
	}
	// isValidType(node) {
	// 	//for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
	// 	return node.nodeType === 1 || node.nodeType === 8 || (node.nodeType === 3) && !this.isPureBlankNode(node)
	// }
	// //https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM
	// isPureBlankNode(node) {
	// 	// Use ECMA-262 Edition 3 String and RegExp features
	// 	return !(/[^\t\n\r ]/.test(node.data))
	// }
}

import Base from './base'

export default class For extends Base{
    constructor(opts) {
        super(opts)
    }
    bind() {
        // var itemName = exp.split('of')[0].replace(/\s/g, '')
        // var arrNames = exp.split('of')[1].replace(/\s/g, '').split('.')
        // var parentNode = node.parentNode
		// var startNode = document.createTextNode('')
		// var endNode = document.createTextNode('')
		// var range = document.createRange()
		// parentNode.replaceChild(endNode, node) 
		// parentNode.insertBefore(startNode, endNode)
        super.bind(cb)
    }
}
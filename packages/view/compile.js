export default function compile(node) {
    //translat dom to fragment
    node.childNodes.forEach((node) => {
        //init view
        this.compileNode(node)
    })
}
function compileNode(node) {
    if (node.nodeType === 1) {
        //for (let attr of node.attributes) {
        this.compileElement(node)
    } else if (node.nodeType === 3) {
        this.compileText(node)
    }
}
function compileElement(node) {
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
    this.compile(node)
}
function compileText(node) {
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
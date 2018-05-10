import Attr from "./attr"
import directivesFactory from "./directives/index"

function compile(node, vm){
    node.childNodes.forEach((child) => {
        if (child.nodeType === 1) {
            compileElement(child, vm)
        } else if (child.nodeType === 3) {
            compileText(child, vm)
        }
    })
}
function compileElement(node, vm) {
    let lasyDirective = null
    let directiveDescriptor = { isLasy: false, type: '', exp: '' }
    Array.from(node.attributes).forEach(attr => {
        let attrName = attr.nodeName
        let { prefix, directive } = Attr.checkDirective(attrName, vm.configs)
        let exp = attr.nodeValue//expOrfn
        if (directive) {
            console.log(node.nodeName,attrName)
            node.removeAttribute(attrName)
            //@click  ->click
            //u-model ->value
            let currentDirective = directivesFactory({
                prefix,
                directive,
                exp,
                node,
                vm
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
    } else {
        compile(node, vm)
    }
}
function compileText(node, vm) {
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
export default compile
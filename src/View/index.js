import Attr from "./attr"
import Detective from "./Detective"

class Templater {
    constructor(selector,vm) {
        this.vm=vm;
        this.el = document.querySelector(selector);
        if (this.el) {
            this.ele.appendChild(this.init());
        }
    }
    init() {
        const fragment = document.createDocumentFragment();
        //所有节点node
        for (let node of this.el.childNodes) {
            fragment.appendChild(node);
        }
        //fragment.innerHTML=this.el.innerHTML;
        for (let node of fragment.childNodes) {
            this._initFragment(node)
        }
    }
    _initFragment(parentNode) {
        for (let node of parentNode.childNodes) {
            //排除元素、文本以外的节点
            if (node.nodeType === 1) {
                //node.attributes
                for (let attr of node.attributes) {
                    //过滤掉非unar的动作、属性、事件
                    const attrName=attr.name;
                    const attrVal=attr.value;
                    //u-html u-model
                    if (Attr.isAction(attrName)) {
                        Detective[attrName](node,attrVal)
                    }
                    //:id
                    if (Attr.isProp(attrName)) {
                        Detective.bind(node,attrName,attrVal)
                    }
                    //@click
                    if (Attr.isEvt(attrName)) {
                        Detective.addEvt(node,attrName,attrVal)
                    }
                }
                if (node.childNodes.length) {
                    this._initFrag(node)
                }
            }
            if (node.nodeType === 3 && Attr.isExpression(attr)) {
                
            }
        }
    }
}
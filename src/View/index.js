import Attr from "./attr"
import Detective from "./Detective"
debugger
export default class Templater {
    constructor(selector, vm) {
        debugger
        this.vm = vm;
        this.el = document.querySelector(selector);
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }
    init() {
        const fragment = document.createDocumentFragment();
        var waitDeletedNode;
        //所有节点node
        //node appendChild之前会被删除，影响原始数据
        //   for (let [inx,node] of this.el.childNodes.entries()) {
        //     const nodeType = node.nodeType;
        //     if (nodeType === 1 || nodeType === 8) {
        //         fragment.appendChild(node);
        //         inx=inx-1;
        //     }
        // }
        for (let i = 0; i < this.el.childNodes.length; i++) {
            const node = this.el.childNodes[i];
            const nodeType = node.nodeType;
            //for reduce the loop count ,filt nodes to Element Comment Text(not contain pure whitespace)
            if (nodeType === 1 || nodeType === 8 || (nodeType === 3) && !this._isPureBlankNode(node)) {
                fragment.appendChild(node);
                i = i - 1;
            }
        }
        // while (waitDeletedNode = this.el.firstChild) {
        //     fragment.appendChild(waitDeletedNode); //隐式删除waitDeletedNode节点
        // }
        for (let node of fragment.childNodes) {
            this._initFragment(node)
        }
        return fragment
    }
    _initFragment(parentNode) {
        for (let node of parentNode.childNodes) {
            //排除元素、文本以外的节点
            if (node.nodeType === 1) {
                //node.attributes
                for (let attr of node.attributes) {
                    //过滤掉非unar的动作、属性、事件
                    const attrName = attr.name;
                    const attrVal = attr.value;
                    //u-html u-model
                    if (Attr.isAction(attrName)) {
                        Detective[attrName](node, attrVal)
                    }
                    //:id
                    if (Attr.isProp(attrName)) {
                        Detective.bind(node, attrName, attrVal)
                    }
                    //@click
                    if (Attr.isEvt(attrName)) {
                        Detective.addEvt(node, attrName, attrVal)
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
    /**
     * https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM
     * 以下所谓的“空白符”代表：
     *  "\t" TAB \u0009 （制表符）
     *  "\n" LF  \u000A （换行符）
     *  "\r" CR  \u000D （回车符）
     *  " "  SPC \u0020 （真正的空格符）
     *
     * 不包括 JavaScript 的“\s”，因为那代表如不断行字符等其他字符。
     */
    /**
     * 测知某节点的文字内容是否全为空白。
     *
     * @参数   nod  |CharacterData| 类的节点（如  |Text|、|Comment| 或 |CDATASection|）。
     * @传回值      若 |nod| 的文字内容全为空白则传回 true，否则传回 false。
     */
    _isPureBlankNode(node) {
        // Use ECMA-262 Edition 3 String and RegExp features
        return !(/[^\t\n\r ]/.test(node.data));
    }
}
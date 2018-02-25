/**
 * Templater
 */
import Attr from "./Attr"
import Detective from "./Detective"

export default class Templater {
    constructor(selector, vm) {
        this.vm = vm;
        this.el = document.querySelector(selector);
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }
    init() {
        const fragment = document.createDocumentFragment();
        this.filterNode2fragment(fragment)
        //初始化view
        fragment.childNodes.forEach((node) => {
            this.initAttrEvt(node)
        })
        console.log(fragment)
        // for (let node of fragment.childNodes) {
        //     this.initAttrEvt(node)
        // }
        return fragment
    }
    filterNode2fragment(fragment) {
        //所有节点node
        for (let i = 0; i < this.el.childNodes.length; i++) {
            const node = this.el.childNodes[i];
            const nodeType = node.nodeType;
            //for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
            if (nodeType === 1 || nodeType === 8 || (nodeType === 3) && !this._isPureBlankNode(node)) {
                fragment.appendChild(node);
                --i;
            }
        }
    }
    initAttrEvt(node) {
        //排除元素、文本以外的节点
        if (node.nodeType === 1) {
            //node.attributes
            for (let attr of node.attributes) {
                //过滤掉非unar的动作、属性、事件
                const detec = attr.nodeName;
                const key = attr.nodeValue;
                //u-html u-model
                if (Attr.isAction(detec)) {
                    Detective[detec](node, key, this.vm)
                    continue
                }
                //:id
                if (Attr.isProp(detec)) {
                    Detective.bind(node, detec, key, this.vm)
                    continue
                }
                //@click
                if (Attr.isEvt(detec)) {
                    Detective.addEvt.call(this.vm, node, detec, key)
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
                var [, , keyText,] = Attr.expressionKey(node.data)
                debugger
                Detective['text'](node, keyText, this.vm)
                //continue
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
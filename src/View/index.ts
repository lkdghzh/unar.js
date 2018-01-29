/**
 * Templater
 */
import Attr from "./Attr"
import Detective from "./Detective"

export default class Templater {
    vm:any;
    el:Element;
    constructor(selector:string, vm:any) {
        this.vm = vm;
        this.el = document.querySelector(selector);
        console.log(Detective,1)
        
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }
    init() {
        const fragment = document.createDocumentFragment();
        this.filterNode2fragment(fragment)
        //初始化view
        var nodes=fragment.childNodes as NodeListOf<HTMLElement>
        for(let node of nodes){
            this.initAttrEvt(node)
        }
        // nodes.forEach((node)=>{
        //     this.initAttrEvt(node)
        // })
        console.log(fragment)
        // for (let node of fragment.childNodes) {
        //     this.initAttrEvt(node)
        // }
        return fragment
    }
    filterNode2fragment(fragment){
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
                const attrName = attr.nodeValue;
                const attrVal = attr.nodeValue;
                //u-html u-model
                if (Attr.isAction(attrName)) {
                    console.log(Detective)
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
            node.childNodes.forEach((childNode)=>{
                this.initAttrEvt(childNode)
            })
        }
        //text {{}}
        if (node.nodeType === 3 && Attr.isExpression(node.data)) {
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
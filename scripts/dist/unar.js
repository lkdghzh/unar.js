
/**
*   Unar.js v0.0.1
*   (c) 2017-2018 author:like
*   Released under the MIT License.
*/ 

//Unar.global={
//     actionPrefix:"u",
//     attrPrefix:":",
//     evtPrefix:"@",
// }

//merge
var config$1 = {
    actionPrefix: "u",
    attrPrefix: ":",
    evtPrefix: "@",
};

class Attr {
    static isExpression(txt) {
        return /\{\{.*\}\}/.test(txt);
    }
    static isAction(attr) {
        //u
        return attr.indexOf(config$1.actionPrefix) === 0;
    }
    static isProp(attr) {
        //: v-bind:a="a"
        return attr.indexOf(config$1.PropPrefix) === 0;
    }
    static isEvt(attr) {
        //: v-bind:a="a"
        return attr.indexOf(config$1.evtPrefix) === 0;
    }
}

/**
 * DomEvent
 */
class DomEvent {
    static model(node, val) {
        node.value = val;
    }
    static text(node, text) {
        node.textContent = text;
    }
    static html(node, html) {
        node.innerHTML = html;
    }
    static bind(node, attrName, attrVal) {
        node[attrName.substr(config.attrPrefix.length, attrName.length)] = attrVal;
    }
    static addEvt(node, attrName, fn) {
        node.addEventListener(attrName.substr(config.evtPrefix.length, attrName.length), fn.bind(this), false);
    }
}

/**
 * one vm prop <---> one Hub
 */
var id = 0;
class Hub{
    constructor(prop,cb){
        this.id=++id;
        this.prop=prop;
        this.listeners=[];
        this.addListener(cb);
    }
    addListener(cb){
        this.listeners.push(cb);
    }
    deleteListener(){
        
    }
    notify(){
        this.listeners.forEach((fn)=>{
            fn();
        });
    }
}

/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
var hubs=[];
class Detictive {
    static [config$1.actionPrefix + "-model"](node, val) {
        this._update("model", node, val);
    }
    static [config$1.actionPrefix + "-text"](node, text) {
        this._update("text", node, text);
    }
    static [config$1.actionPrefix + "-html"](node, html) {
        this._update("html", node, html);
    }
    //:
    static bind(node, attrName, attrVal) {
        DomEvent.bind(node, attrName, attrVal);
    }
    //@
    static addEvt(node, attrName, fn) {
        DomEvent.addEvt(node, attrName, attrVal);
    }
    static _update(detictive, node, val) {
        var cb = DomEvent[detictive];
        cb(node, val);
        //检测hubs 是否具备此prop（value）hub，有的添加cb回调，没有创建便hub
        
        hubs.push(new Hub(val,cb));
    }
}

/**
 * Templater
 */
class Templater {
    constructor(selector, vm) {
        this.vm = vm;
        this.el = document.querySelector(selector);
        console.log(Detictive,1);
        
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }
    init() {
        const fragment = document.createDocumentFragment();
        this.filterNode2fragment(fragment);
        //初始化view
        fragment.childNodes.forEach((node)=>{
            this.initAttrEvt(node);
        });
        console.log(fragment);
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
                const attrName = attr.nodeName;
                const attrVal = attr.nodeValue;
                //u-html u-model
                if (Attr.isAction(attrName)) {
                    console.log(Detictive);
                    Detictive[attrName](node, attrVal);
                }
                //:id
                if (Attr.isProp(attrName)) {
                    Detictive.bind(node, attrName, attrVal);
                }
                //@click
                if (Attr.isEvt(attrName)) {
                    Detictive.addEvt(node, attrName, attrVal);
                }
            }
            node.childNodes.forEach((childNode)=>{
                this.initAttrEvt(childNode);
            });
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

/**
 * Unar
 */

 
// import util from "../Util"
// import detective from "./Detective"
// import model from "./Model"
class Unar {
    /*options
    methods{
        fn1,
        fn2
    }
    data{a:1,b:2}

    a:1
    b:2
    fn1,
    fn2
    */
    constructor(o) {
        new Templater(o.el, this);
        this.$options = {};
        //在vm新建_data、$options属性
        var data = this._data = this.$options.data = o.data;

        //创建代理（存取）属性，代理_data、$options对象下的存取属性
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                get: function () {
                    //data[key]、this._data[key]、this.$options.data 、o.data都可以
                    //实现代理对象（读写都要通过这个代理），然后访问this._data[key]、this.$options.data的存取器属性
                    //此getter会调用下面getter
                    return data[key];
                },
                set: function (newVal) {
                    data[key] = newVal;
                }
            });
            //使用闭包，存储这个值。（data[key],运行到此还是数据属性）
            //data[key]、this._data[key]、this.$options.data 、o.data都可以
            var valCache = data[key];

            //data相当于同时，把this_data和this.$options.data,o.data三个都变成了存取器属性
            Object.defineProperty(data, key, {
                configurable: false,
                enumerable: true,
                get: function () {
                    //可以尝试这个
                    //this._data[key]，this.$options.data[key]和data[key]都会爆栈
                    return valCache;
                },
                set: function (newVal) {
                    valCache = newVal;
                }
            });
        });
        // return new Proxy(this, {
        //     get: function (obj, prop) {
        //         if (prop in options.data) {
        //             //属性
        //             return options.data[prop]
        //         } else if (prop in options.methods) {
        //             //方法
        //             return options.methods[prop]
        //         } else {
        //             console.error(`this scope havn't "${prop}" attribute or method`)
        //         }
        //     },
        //     set: function (obj, prop, value) {
        //         if (prop in options.data) {
        //             //属性
        //             options.data[prop] = value
        //         } else if (prop in options.methods) {
        //             //方法
        //             options.methods[prop] = value
        //         } else {
        //             console.error(`this scope havn't "${prop}" attribute or method`)
        //         }
        //     }
        // })
    }
    // static use() {}
    // static extend() {}
    // static nextTick() {}
    // $get() {
    //     //utils.get(this, key, val)
    // }
    // $set() {
    //     utils.set(this, key, val)
    // }
    // $created() {}
    // $mounted() {}
    // $watch() {}
    // $computed() {}
    // $remove() {}
    // $destroy() {}
    // $before() {}
    // $after() {}
    // 'emit', 'on', 'off', 'once'
}

export default Unar;

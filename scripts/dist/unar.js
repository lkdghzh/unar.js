
/**
*   Unar.js v0.0.1
*   (c) 2017-2018 author:like
*   Released under the MIT License.
*/ 

/**
 * one vm prop <---> one Hub
 */

// a:{id: 1, prop: "a", listeners: [cb1,cb2]
// b:{id: 2, prop: "b", listeners: [cb3,cb4]
var hubs = {};

window.hubs = hubs;
var id = 0;
class Hub {
	constructor(prop, cb, vm) {
		this.id = ++id;
		this.prop = prop;
		this.val = vm[prop];
		this.vm = vm;
		this.listeners = [];
		this.addListener(cb);
	}
	addListener(cb) {
		this.listeners.push(cb);
	}
	deleteListener() {}
	notify(newVal) {
		this.listeners.forEach((fn) => {
			//oldVal->this.val
			//val->this.vm[this.prop]
			fn(this.vm[this.prop], this.val);
		});
	}
}

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
	static model(node, val,oldValue) {
		// return function () {
			node.value = val;
		// }()
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
	static addEvt(node, evtName, fn) {
		node.addEventListener(evtName, fn, false);
	}
}

/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
// debugger
class Detictive {
	static[config$1.actionPrefix + "-model"](node, key, vm) {
		// debugger
		this._update("model", node, key, vm);
		node.addEventListener('input', e => {
			vm[key] = e.target.value;
		}, false);
	}
	static[config$1.actionPrefix + "-text"](node, text, vm) {
		this._update("text", node, text);
	}
	static[config$1.actionPrefix + "-html"](node, html, vm) {
		this._update("html", node, html);
	}
	//:
	static bind(node, attrName, attrVal) {
		DomEvent.bind(node, attrName, attrVal);
	}
	//@
	static addEvt(node, attrName, fn) {
		var evtName = attrName.substr(config$1.evtPrefix.length, attrName.length);
		var fn = this.methods[fn].bind(this);
		DomEvent.addEvt(node, evtName, fn);
	}
	static _update(detictive, node, key, vm) {
		var cb = (val, oldVal)=> {
			DomEvent[detictive](node, val, oldVal);
		};
		cb(vm[key]);
		//检测hubs 是否具备此key，有的添加cb回调，没有创建便hub
		hubs[key] ? hubs[key].listeners.push(cb) :( hubs[key] = new Hub(key, cb,vm) );
	}
}

/**
 * Templater
 */

class Templater {
    constructor(selector, vm) {
        this.vm = vm;
        this.el = document.querySelector(selector);
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }
    init() {
        const fragment = document.createDocumentFragment();
        this.filterNode2fragment(fragment);
        //初始化view
        fragment.childNodes.forEach((node) => {
            this.initAttrEvt(node);
        });
        console.log(fragment);
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
                    Detictive[detec](node, key,this.vm);
                }
                //:id
                if (Attr.isProp(detec)) {
                    Detictive.bind(node, detec, key,this.vm);
                }
                //@click
                if (Attr.isEvt(detec)) {
                    Detictive.addEvt.call(this.vm, node, detec, key);
                }
            }
            node.childNodes.forEach((childNode) => {
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
	// static hubs = []
	constructor(o) {
		this.methods = o.methods;
		this.$options = {};
		//在vm新建_data、$options属性
		var data = this._data = this.$options.data = o.data;

		//创建代理（存取）属性，代理_data、$options对象下的存取属性
		Object.keys(data).forEach(key => {
			Object.defineProperty(this, key, {
				configurable: false,
				enumerable: true,
				get() {
					//data[key]、this._data[key]、this.$options.data 、o.data都可以
					//实现代理对象（读写都要通过这个代理），然后访问this._data[key]、this.$options.data的存取器属性
					//此getter会调用下面getter
					return data[key]
				},
				set(newVal) {
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
				get() {
					//可以尝试这个
					//this._data[key]，this.$options.data[key]和data[key]都会爆栈
					return valCache
				},
				set(newVal) {
					console.log(key);
					valCache = newVal;
					//set value first ，then notify dom update with newVal
					hubs[key].notify();
				}
			});
		});
		new Templater(o.el, this);
	}
	
	// static use() {}
	// static extend() {}
	// static $nextTick() {}
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

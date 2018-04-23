
/**
*   Unar.js v0.0.3
*   (c) 2017-2018 author:like
*   Released under the MIT License.
*/ 

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Unar = factory());
}(this, (function () { 'use strict';

const run = (exp, scope) => {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){return ' + exp + '}');
		return fn(scope)
	} catch (e) {
		console.error(`${exp} has a unresolved error`);
	}
};

var temp={
    listener:null
};
window.listener=temp;

let defaultConfigs = {
    actionPrefix: "u-",
    attrPrefix: ":",
    evtPrefix: "@",
};

var id = 0;
class Listener {
	constructor(vm, exp, cb) {
		this.id = ++id;
		this.exp = exp;
		this.vm = vm;
		this.oldVal = run(this.exp, this.vm);
		this.cb = cb;
	}
	update() {
		var newVal = run(this.exp, this.vm);
		//maybe (object) complex type or simple type
		if (newVal !== this.oldVal) {
			this.cb.call(this.vm, newVal, this.oldVal);
			//update val to oldVal
			this.oldVal = newVal;
		}
	}
}

const typeOf$1 = (o) => {
	var _target;
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
};
const run$1 = (exp, scope) => {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){return ' + exp + '}');
		return fn(scope)
	} catch (e) {
		console.error(`${exp} has a unresolved error`);
	}
};

var hubs = [];
window.hubs = hubs;
class Hub {
	constructor(key) {
		this.key = key;
		//Object is more convenient than array when retrievalling and assigning value。
		this.listeners = {};
	}
	addListener(listener) {
		var id = listener.id;
		if (!(id in this.listeners)) {
			this.listeners[id] = listener;
		}
	}
	notify() {
		for (var id in this.listeners) {
			//oldVal->this.val
			//val->this.vm[this.prop]
			this.listeners[id].update();
		}
	}
}

const config = (configs, vm) => {
	vm.configs = Object.assign(defaultConfigs, configs);
};
const hijack = (data, vm) => {
	Object.keys(data).forEach(key => {
		Object.defineProperty(vm, key, {
			get() {
				//it can replaced by this._data[key],this.$options.data[key] ,o.data[key]
				//not allow valCache
				//this will call `accessor get fn` 
				console.log(`hijack->get:${key}`);
				return data[key]
			},
			set(newVal) {
				data[key] = newVal;
			}
		});
	});
};

const accessor = (data, vm) => {
	Object.keys(data).forEach(key => {
		var hub = new Hub(key);
		hubs.push(hub);
		//Data properties->data[key]
		var valCache = data[key];
		//Accessor properties
		Object.defineProperty(data, key, {
			get() {
				if (temp.listener) {
					hub.addListener(temp.listener);
				}
				console.log(`accessor->get:${key}`);
				return valCache
			},
			set(newVal) {
				valCache = newVal;
				// object 
				if (typeOf$1(newVal) === 'object') {
					accessor(newVal, vm, path);
				}
				// array
				// if () {
				// 	// TODO observe array
				// }
				//set value first,then notify dom update with newVal
				hub.notify();
			}
		});
		if (typeOf$1(valCache) === 'object') {
			accessor(valCache, vm, path);
		}
	});
};
const proxy = (data, vm) => {
	accessor(data, vm);
	hijack(data, vm);
};
const watch = (watchers, vm) => {
	//Object.entries({a:1,b:2})-->[["a", 1],["b", 2]]
	for (let [exp, cb] of Object.entries(watchers)) {
		// console.log('watching...')
		temp.listener = new Listener(vm, exp, cb);
		run(exp, vm);
		temp.listener = null;
	}
};

const compute = (computeds, vm) => {
	/**
	 * 	var o={}
		Object.defineProperty(o, 'a', {
			get: function () {return 1 },
			set: function () { }
		})
		Object.getOwnPropertyDescriptor(o,'a')
		{get: ƒ, set: ƒ, enumerable: false, configurable: false}
	 */
	for (let [key, target] of Object.entries(computeds)) {
		Object.defineProperty(vm, key, {
			configurable: false,
			enumerable: true,
			get: typeOf$1(target) === "function" ? target : typeOf$1(target) === "object" ? target.get : function () { },
			set: typeOf$1(target) === "object" ? target.set : function () { }
		});
	}
};

class Attr {
	static isExpression(txt) {
		return /\{\{.*\}\}/.test(txt)
	}
	static expressionKey(txt) {
		return txt.match(/(.*)\{\{(.*)\}\}(.*)/)
	}
	static checkDirective(attrName, configs) {
		var detec = {
			prefix: '',
			directive: ''
		};
		for (var key in configs) {
			var prefix = configs[key];
			if (attrName.startsWith(prefix)) {
				detec.prefix = attrName.substring(0, prefix.length);
				detec.directive = attrName.substring(prefix.length);
				break
			}
		}
		return detec
	}
}

class Register {
	static registDomListener4Hubs(cb, exp, vm) {
		// console.log(`初始化页面get：${exp}`)
		temp.listener = new Listener(vm, exp, cb);
		var newVal = run$1(exp, vm);
		cb(newVal);
		temp.listener = null;
	}
}

class Base {
    constructor({ prefix, directive, exp, node, vm }) {
        this.prefix = prefix;
        this.directive = directive;
        this.exp = exp;
        this.vm = vm;
        this.node = node;
    }
    bind(cb) {
        // model  html
        // {{}}
        // :id
        Register.registDomListener4Hubs(cb, this.exp, this.vm);
    }
    // destroy() {
    //     nullify(this.name, this.vm, this.node)
    // }
}

class Bind extends Base {
    constructor(opts) {
        super(opts);
        this.prop = this.directive;
    }
    bind() {
        const cb = (val) => {
            this.node[this.prop] = val;
        };
        super.bind(cb);
    }
}

class On extends Base {
    constructor(opts) {
        super(opts);
        this.evtName = this.directive;
        this.evt = this.exp;
    }
    bind() {
        this.node.addEventListener(this.evtName, this.vm.methods[this.evt].bind(this.vm), false);
    }
}

class Model extends Base {
    constructor(opts) {
        super(opts);
        this.prop = 'value';
    }
    bind() {
        const cb = (val) => {
            this.node[this.prop] = val;
        };
        super.bind(cb);
        this.addEvt();
    }
    addEvt() {
        //default implement  duplex-->true
        //when set by user,the exp is must be a variable,not allow expression
        const fn = e => this.vm[this.exp] = e.target.value;
        this.node.addEventListener('input', fn, false);
    }
    // destroy() {
    //     super.destroy()
    //     nullify(this.exp, this.prop)
    // }
}

class If extends Base {
    constructor(opts) {
        super(opts);
    }
    bind() {
        var holderNode = document.createTextNode('');
        var parentNode = this.node.parentNode;
        parentNode.insertBefore(holderNode, this.node);
        parentNode.removeChild(this.node);
        const cb = (val) => {
            if (val) {
                parentNode.insertBefore(this.node, holderNode);
            } else {
                parentNode.removeChild(this.node);
            }
        };
        super.bind(cb);
    }
}

class For extends Base{
    constructor(opts) {
        super(opts);
    }
    bind() {

        super.bind(cb);
    }
}

/**
 * DomEvent
 */
class DomEvent {
	static bind(node, prop, val) {//, oldValue
		node[prop] = val;
	}
	static lasyCompile(node, prop, val, oldValue, holderNode) {
		if (prop === 'if') {
			if (val) {
				holderNode.parentNode.insertBefore(node, holderNode);
			} else {
				holderNode.parentNode.removeChild(node);
			}
		} else {
			//for
		}
	}
	static addEvt(node, evt, fn) {
		node.addEventListener(evt, fn, false);
	}
}

var props = {
    model: 'value', //v-model
    html: 'innerHTML', //v-html
    text: 'textContent', //{{}}
    class: 'className' //:class
};

/**
 * Detictive
 */
class Detictive {
	constructor(opts) {
		this.name = opts.name;//model click
		this.expOrFn = opts.expOrFn;//a fn1

		this.domPropOrEvt = props[opts.name] ? props[opts.name] : opts.name;////u-model ->value //@click  ->click
		this.vm = opts.vm;
		this.compiler = opts.compiler;
		this.node = opts.node;
		this.preTxt = opts.preTxt || '';
		this.nxtTxt = opts.nxtTxt || '';
	}
	bind() {
		// model  html
		// {{}}
		// :id
		const cb = (val, oldVal) => {
			DomEvent.bind(this.node, this.domPropOrEvt, this.preTxt + val + this.nxtTxt, this.preTxt + oldVal + this.nxtTxt);
		};
		Register.registDomListener4Hubs(cb, this.expOrFn, this.vm);
		if (this.domPropOrEvt === 'value') {
			//when set by user,the exp is must be a variable.
			// not allow expression
			const fn = e => this.vm[this.expOrFn] = e.target.value;
			this.addEvt(fn, 'input');
		}
	}
	addEvt(fn = this.expOrFn, evt = this.name) {
		//dom ,user input event ,default implement
		//@
		var fn = typeof (fn) === "function" ? fn : this.vm.methods[fn].bind(this.vm);
		DomEvent.addEvt(this.node, evt, fn);
	}
	lasyCompile() {
		this.compiler.compileChild(this.node);
		var holderNode = document.createTextNode('');
		this.node.parentNode.insertBefore(holderNode, this.node);
		this.node.parentNode.removeChild(this.node);
		const cb = (val, oldVal) => {
			DomEvent.lasyCompile(this.node, this.domPropOrEvt, val, oldVal, holderNode);
		};
		Register.registDomListener4Hubs(cb, this.expOrFn, this.vm);
	}
}

class Text extends Detictive{
    constructor() {
        super();
    }
}

class Html extends Base{
    constructor(opts) {
        super(opts);
        this.prop = 'innerHTML';
    }
    bind() {
        const cb = (val) => {//, oldVal
            this.node[this.prop] = val;
        };
        super.bind(cb);
    }
}

class Show extends Detictive{
    constructor() {
        super();
    }
}

function directiveFactory(opts) {
    var instance;
    if (opts.prefix == opts.vm.configs.attrPrefix) {
        instance = new Bind(opts);
    } else if (opts.prefix == opts.vm.configs.evtPrefix) {
        instance = new On(opts);
    } else {
        switch (opts.directive) {
            case 'model':
                instance = new Model(opts);
                break
            case 'if':
                instance = new If(opts);
                break
            case 'for':
                instance = new For(opts);
                break
            case 'text':
                instance = new Text(opts);
                break
            case 'html':
                instance = new Html(opts);
                break
            case 'show':
                instance = new Show(opts);
                break
            default:
                break
        }
    }
    return instance
}

/**
 * Templater
 */


class Templater {
	constructor(selector, vm) {
		this.vm = vm;
		this.el = document.querySelector(selector);
		this.el.appendChild(this.init());
	}
	init() {
		const docFrag = document.createDocumentFragment();
		var filledFrag = this.fillFrag(docFrag);
		this.compileChild(filledFrag);
		return docFrag
	}
	fillFrag(docFrag) {
		for (let i = 0; i < this.el.childNodes.length; i++) {
			const node = this.el.childNodes[i];
			if (this.isValidType(node)) {
				docFrag.appendChild(node);
				--i;
			}
		}
		return docFrag
	}
	compileChild(node) {
		//translat dom to fragment
		node.childNodes.forEach((node) => {
			//init view
			this.compileNode(node);
		});
	}
	compileNode(node) {
		if (node.nodeType === 1) {
			//for (let attr of node.attributes) {
			this.compileElement(node);
		} else if (node.nodeType === 3) {
			this.compileText(node);
		}
	}
	compileElement(node) {
		let lasy = { isLasy: false, type: '', exp: '' };
		var lasyDirective;
		Array.from(node.attributes).forEach(attr => {
			const attrName = attr.nodeName;
			const { prefix, directive } = Attr.checkDirective(attrName, this.vm.configs);
			const exp = attr.nodeValue;//expOrfn
			if (directive) {
				node.removeAttribute(attrName);
				//@click  ->click
				//u-model ->value
				var currentDirective = directiveFactory({
					prefix,
					directive: directive,
					exp: exp,
					node: node,
					vm: this.vm
				});
				//first detect if for directive
				if (directive === 'if' || directive === 'for') {
					lasy = { isLasy: true, type: directive, exp: exp };
					lasyDirective = currentDirective;
				} else {
					//@click
					//u-html u-model
					//:id
					currentDirective.bind();
				}
			}
		});
		this.compileChild(node);
		if (lasy.isLasy) {
			lasyDirective.bind();
		}
	}
	compileText(node) {
		if (Attr.isExpression(node.data)) {
			//text with {{}}
			const [, preTxt, exp, nxtTxt] = Attr.expressionKey(node.data);
			var currentDirective = new Directive({
				name: 'text',
				exp: exp,

				node: node,
				preTxt: preTxt,
				nxtTxt: nxtTxt,
				vm: this.vm
			});
			currentDirective.bind();
		}
	}
	isValidType(node) {
		//for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
		return node.nodeType === 1 || node.nodeType === 8 || (node.nodeType === 3) && !this.isPureBlankNode(node)
	}
	//https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM
	isPureBlankNode(node) {
		// Use ECMA-262 Edition 3 String and RegExp features
		return !(/[^\t\n\r ]/.test(node.data))
	}
}

/**
 * Unar
 */
class Unar {
	// static hubs = []
	constructor({
		el = '',
		data = {},
		computeds = {},
		methods = {},
		watchers = {},
		configs
	}) {
		this.methods = methods;

		//we can config the dom detective about actions props event
		config(configs,this);

		//hijack properties
		//change data properties to accessor properties
		proxy(data, this);

		//add computed properties to this
		this.computeds = computeds;
		compute(computeds, this);

		//console.log(this)
		//add watchers properties to this
		this.watchers = watchers;
		watch(watchers, this);

		// if the template does not define the properties of the data,
		// it will not subscribe to the hubs inside the event

		//compile fragment
		new Templater(el, this);
	}
	// $watch() {}
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
	// $computed() {}
	// $remove() {}
	// $destroy() {}
	// $before() {}
	// $after() {}
	// 'emit', 'on', 'off', 'once'
}

return Unar;

})));

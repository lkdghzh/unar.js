
/**
*   Unar.js v0.0.3
*   (c) 2017-2018 author:like
*   Released under the MIT License.
*/ 

// import 
// export const set = (o) => {

// }
// export const extend = (o) => {

// }
// export const defDataProp = (o, key, val, state) => {
// 	var states = {
// 		'': [1, 1, 1],
// 		'': [1, 1, 0],
// 		'': [1, 0, 1],
// 		'': [1, 0, 0],
// 		'': [0, 1, 1],
// 		'': [0, 1, 0],
// 		'': [0, 0, 1],
// 		'': [0, 0, 0]
// 	}

// 	var [configurable, enumerable, writable] = states[state]
// 	Object.defineProperty(o, key, {
// 		configurable: !!configurable,
// 		enumerable: !!enumerable,
// 		writable: !!writable,
// 		value: val
// 	})
// }
// export const defAccessProp = (o, key, val, state) => {
// 	var states = ['', '', '', '']
// 	Object.defineProperty(o, key, {
// 		configurable: !!writable,
// 		enumerable: !!enumerable,
// 		get() {},
// 		set(newVal) {}
// 	})
// }

const pathVal = (obj, path, val) => {
	// var o = { a: { b: { c: 1 } } }
	// pathVal(o, 'a.b.c')
	// pathVal(o, 'a.b.c',2)
	var pathArray = path.split('.');
	var length = pathArray.length;
	var t;
	var count = 0;
	for (var inx in pathArray) {
		var key = pathArray[inx];
		if (!count) {
			if (typeof val === 'undefined') {
				t = obj[key];
			}else{
				obj[key]=val;
				t=val;
			}
		} else {
			if (typeof val === 'undefined') {
				t = t[key];
			} else {
				if (count < length - 1) {
					t = t[key];
				} else if (count === length - 1) {
					t[key] = val;
					t = val;
				}
			}
		}
		count++;
	}
	return t
};
const typeOf = (o) => {
	var _target;
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
};
const run = (exp, scope) => {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){return ' + exp + '}');
		return fn(scope)
	} catch (e) {
		console.error('');
	}
};

var  propType={
    switch:undefined
};
window.propType=propType;

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
		this.cb.call(this.vm, newVal, this.oldVal);
		//update val to oldVal
		this.oldVal = newVal;
	}
}

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
		//it's cached,data[key] can replaced by vm._data[key],vm.$options.data,o.data 
		var valCache = pathVal(data, key);
		//Accessor properties
		Object.defineProperty(data, key, {
			get() {
				if (propType.switch) {
					hub.addListener(propType.switch);
				}
				console.log(`accessor->get:${key}`);
				return valCache
			},
			set(newVal) {
				valCache = newVal;
				// object 
				if (typeOf(newVal) === 'object') {
					accessor(newVal, vm, path);
				}
				// array
				// if () {
				// 	// TODO observe array
				// }
				//set value first,then notify dom update with newVal
				// var currentHub = pathVal(hubs, hubsPath)
				// console.log(`setCurrentPath->${path},${hubsPath},${currentHub}`)
				hub.notify();
				//hubs[key].notify()
			}
		});
		if (typeOf(valCache) === 'object') {
			accessor(valCache, vm, path);
		}
	});

};
const proxy = (data, vm) => {
	accessor(data, vm);
	hijack(data, vm);
};
const watch = (watchers, vm) => {
	//Object.entries({a:1})-->[["a", 1]]
	for (let [exp, cb] of Object.entries(watchers)) {
		// Register.registListener4Hubs(exp, cb, vm)
		propType.switch = new Listener(vm, exp, cb);
		run(exp, vm);
		propType.switch = null;

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
			get: typeOf(target) === "function" ? target : typeOf(target) === "object" ? target.get : function () {},
			set: typeOf(target) === "object" ? target.set : function () {}
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
	static isRightDetec(detective, configs) {
		var detec;
		for (let prefix in configs) {
			if (detective.startsWith(configs[prefix])) {
				detec = {
					detectype: detective.substring(0, configs[prefix].length),
					detec: detective.substring(configs[prefix].length)
				};
				break
			}
		}
		return detec
	}
}

/**
 * DomEvent
 */
class DomEvent {
	static bind(node, prop, val, oldValue) {
		if (val !== oldValue) {
			node[prop] = val;
		}
	}
	static addEvt(node, evt, fn) {
		node.addEventListener(evt, fn, false);
	}
}

class Register {
	static registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt) {
		const cb = (val, oldVal) => {
			DomEvent.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt);
		};
		// console.log(`初始化页面get：${exp}`)
		propType.switch = new Listener(vm, exp, cb);
		var newVal = run(exp, vm);
		cb(newVal);
		propType.switch = null;
	}
}

/**
 * Detictive
 */
class Detictive {
	static bind(node, prop, exp, vm, preTxt = '', nxtTxt = '') {
		// model  html
		// {{}}
		// :id
		Register.registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt);
		if (prop === 'value') {
			const fn = e => pathVal(vm, exp, e.target.value);
			this.addEvt(node, 'input', fn, vm);
		}
	}

	static addEvt(node, evt, exp, vm) {
		//dom ,user input event ,default implement
		//@
		var fn = typeof (exp) === "function" ? exp : vm.methods[exp].bind(vm);
		DomEvent.addEvt(node, evt, fn);
	}
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
		//translat dom to fragment
		this.translate(docFrag).childNodes.forEach((node) => {
			//init view
			this.initAttr(node);
		});
		return docFrag
	}
	translate(docFrag) {
		for (let i = 0; i < this.el.childNodes.length; i++) {
			const node = this.el.childNodes[i];
			if (this.isValidType(node)) {
				docFrag.appendChild(node);
					--i;
			}
		}
		return docFrag
	}
	initAttr(node) {
		const props = {
			model: 'value', //v-model
			html: 'innerHTML', //v-html
			text: 'textContent', //{{}}
			class: 'className' //:class
		};
		if (node.nodeType === 1) {
			//for (let attr of node.attributes) {
			new Array().slice.call(node.attributes).forEach(attr => {
				const detective = attr.nodeName;
				const exp = attr.nodeValue;
				const detecInfo = Attr.isRightDetec(detective, this.vm.configs);
				const {
					detectype,
					detec
				} = detecInfo ? detecInfo : {
					detectype: undefined,
					detec: undefined
				};
				if (detec) {
					node.removeAttribute(detective);
					const prop = props[detec] ? props[detec] : detec;
					if (detectype === this.vm.configs.evtPrefix) {
						//@click
						Detictive.addEvt(node, prop, exp, this.vm);
					} else {
						//u-html u-model
						//:id
						Detictive.bind(node, prop, exp, this.vm);
					}
				}
			});
			node.childNodes.forEach((childNode) => {
				this.initAttr(childNode);
			});
			return
		}
		// if (node.nodeType === 3) {
		// 	if (Attr.isExpression(node.data)) {
		// 		//text with {{}}
		// 		const [, preTxt, key, nxtTxt] = Attr.expressionKey(node.data)
		// 		Directive.bind(node, props.text, key, this.vm, preTxt, nxtTxt)
		// 	}
		// }
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

export default Unar;

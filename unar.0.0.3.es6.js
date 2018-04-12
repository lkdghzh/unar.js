
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
			this.cb.call(this.vm, newVal, this.oldVal);
			//update val to oldVal
			this.oldVal = newVal;
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
				get: typeOf$1(target) === "function" ? target : typeOf$1(target) === "object" ? target.get : function () {},
				set: typeOf$1(target) === "object" ? target.set : function () {}
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
			temp.listener = new Listener(vm, exp, cb);
			var newVal = run$1(exp, vm);
			cb(newVal);
			temp.listener = null;
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
				//when set by user,the exp is must be a variable.
				// not allow expression
				const fn = e => vm[exp] = e.target.value;
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
			if (node.nodeType === 3) {
				if (Attr.isExpression(node.data)) {
					//text with {{}}
					const [, preTxt, key, nxtTxt] = Attr.expressionKey(node.data);
					Detictive.bind(node, props.text, key, this.vm, preTxt, nxtTxt);
				}
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


/**
*   Unar.js v0.0.1
*   (c) 2017-2018 author:like
*   Released under the MIT License.
*/ 

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

var  propType={
    switch:undefined
};
//console 
window.propType=propType;

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
		console.log(`↓  get -->${prop},new hub`);
		this.val = vm[prop];
		this.vm = vm;
		this.listeners = [];
		this.addListener(cb);
	}
	addListener(cb) {
		this.listeners.push(cb);
	}
	deleteListener(inx) {
		this.listeners.splice(inx, 1);
	}
	notify() {
		this.listeners.forEach((fn) => {
			//oldVal->this.val
			//val->this.vm[this.prop]
			fn.call(this.vm, this.vm[this.prop], this.val);
		});
		//update val to oldVal
		this.val = this.vm[this.prop];
	}
}

// import 
const typeOf = (o) => {
	var _target;
	return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase()
};


// export const run = (exp, scope) => {
// 	try {
// 		with(scope) {
// 			return eval(exp)
// 		}
// 	} catch (e) {
// 		console.error('translate exp abnormal')
// 	}
// }

// a +"b" === ? "sth" :b
// scope.a +"b" === ? "sth" :scope.b
//"a +'b' === ? 'sth' :b".replace(/[\"\']?(\w+)[\"\']?/g,(e)=>{console.log(e);return e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e:'scope.'+e})
//'a +"b" === ? "sth" :b'.replace(/[\"\']?(\w+)[\"\']?/g,(e)=>{console.log(e);return e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e:'scope.'+e})
// const scopeExp = (exp, vm) =>
// 	exp.replace(/[\"\']?(\w+)[\"\']?/g, (e) =>
// 		e.startsWith('"') && e.endsWith('"') ||
// 		e.startsWith("'") && e.endsWith("'") ? e : (vm + '.' + e)
// 	)

const run = (exp, scope) => {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){return ' + exp + '}');
		return fn(scope)
	} catch (e) {
		console.error('');
	}
};

let count = 0;
class Register {
	static registDomListener4Hubs(node, prop, key, vm, preTxt, nxtTxt) {
		if (vm.computeds[key]) {
			//count several nodes ->same computed prop
			propType.switch = key + '$' + ++count;
			const ccb = () => {
				DomEvent.bind(node, prop, preTxt + run(key,vm) + nxtTxt);
			};
			propType[key + '$' + count] = ccb;
			ccb();
			propType.switch = undefined;
		} else {
			const cb = (val, oldVal) => {
				DomEvent.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt);
			};
			console.log(`初始化页面，${key}?????${run(key,vm)}`);
			cb(run(key,vm));
			this.registListener4Hubs(key, cb, vm);
		}
	}
	static registListener4Hubs(key, cb, vm) {
		hubs[key] ? hubs[key].listeners.push(cb) : (hubs[key] = new Hub(key, cb, vm));
	}
}

let defaultConfigs = {
    actionPrefix: "u",
    attrPrefix: ":",
    evtPrefix: "@",
};

const config = (configs, vm) => {
	vm.configs = Object.assign(defaultConfigs, configs);
};
const hijack = (data, key, vm) => {
	Object.defineProperty(vm, key, {
		get() {
			//it can replaced by this._data[key],this.$options.data[key] ,o.data[key]
			//not allow valCache
			//this will call `accessor get fn` 
			return data[key]
		},
		set(newVal) {
			data[key] = newVal;
		}
	});
};
const accessor = (data, key, vm) => {
	//Data properties->data[key]
	//it's cached,data[key] can replaced by vm._data[key],vm.$options.data,o.data 
	var valCache = data[key];
	//Accessor properties
	//data reference->At the same time, vm._data ,vm.$options.data, o.data become three accessor properties
	Object.defineProperty(data, key, {
		get() {
			//vm._data[key],vm.$options.data[key],data[key]
			//maximum call stack size exceeded

			//computeds
			if (propType.switch) {
				var currentComputedType = propType.switch;
				console.log(`↑  computed->ccb run,${propType.switch}用到了${key}，向${key}注册${propType.switch}函数`);
				var cfn = function () {
					//node fn
					propType[currentComputedType]();
					var ckey = currentComputedType.split('$')[0];
					console.log(`----------${currentComputedType},${ckey}-----------`);
					//pure computed fn
					typeOf(vm.computeds[ckey]) === "function" ? vm.computeds[ckey].call(vm) :
						typeOf(vm.computeds[ckey]) === "object" ? vm.computeds[ckey].get.call(vm) :
						"";
				};
				Register.registListener4Hubs(key, cfn, vm);
			}
			return valCache
		},
		set(newVal) {
			valCache = newVal;
			//object 
			// if (typeOf(newVal) === 'object') {
			// 	proxy(newVal, vm)
			// }
			//array
			// if (typeOf(newVal) === 'array') {
			// 	// TODO observe array
			// }
			//set value first,then notify dom update with newVal
			hubs[key].notify();
		}
	});
};
const proxy = (data, vm) => {
	Object.keys(data).forEach(key => {
		accessor(data, key, vm);
		hijack(data, key, vm);
	});
};
const watch = (watchers, vm) => {
	//Object.entries({a:1})-->[["a", 1]]
	for (let [key, cb] of Object.entries(watchers)) {
		Register.registListener4Hubs(key, cb, vm);
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
 * Detictive
 */
class Detictive {
	static bind(node, prop, key, vm, preTxt = '', nxtTxt = '') {
		// model  html
		// {{}}
		// :id
		Register.registDomListener4Hubs(node, prop, key, vm, preTxt, nxtTxt);
		if (prop === 'value') {
			const fn = e => vm[key] = e.target.value;
			this.addEvt(node, 'input', fn, vm);
		}
	}

	static addEvt(node, evt, key, vm) {
		//dom ,user input event ,default implement
		//@
		var fn = typeof (key) === "function" ? key : vm.methods[key].bind(vm);
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
				const key = attr.nodeValue;
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
						Detictive.addEvt(node, prop, key, this.vm);
					} else {
						//u-html u-model
						//:id
						Detictive.bind(node, prop, key, this.vm);
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

		//this.$options = {}
		//this add keys(_data、$options )
		//var data = this._data = this.$options.data = data

		//hijack properties
		//change data properties to accessor properties
		proxy(data, this);

		//add computed properties to this
		this.computeds = computeds;
		compute(this.computeds, this);

		//console.log(this)
		//add watchers properties to this
		this.watchers = watchers;
		watch(this.watchers, this);

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

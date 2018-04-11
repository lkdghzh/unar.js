
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var run = function run(exp, scope) {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){return ' + exp + '}');
		return fn(scope);
	} catch (e) {
		console.error(exp + ' has a unresolved error');
	}
};

var temp = {
    listener: null
};
window.listener = temp;

var defaultConfigs = {
    actionPrefix: "u-",
    attrPrefix: ":",
    evtPrefix: "@"
};

var id = 0;

var Listener = function () {
	function Listener(vm, exp, cb) {
		classCallCheck(this, Listener);

		this.id = ++id;
		this.exp = exp;
		this.vm = vm;
		this.oldVal = run(this.exp, this.vm);
		this.cb = cb;
	}

	createClass(Listener, [{
		key: "update",
		value: function update() {
			var newVal = run(this.exp, this.vm);
			this.cb.call(this.vm, newVal, this.oldVal);
			//update val to oldVal
			this.oldVal = newVal;
		}
	}]);
	return Listener;
}();

var typeOf$1 = function typeOf(o) {
	var _target;
	return ((_target = typeof o === 'undefined' ? 'undefined' : _typeof(o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase();
};
var run$1 = function run(exp, scope) {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){return ' + exp + '}');
		return fn(scope);
	} catch (e) {
		console.error(exp + ' has a unresolved error');
	}
};

var hubs = [];
window.hubs = hubs;

var Hub = function () {
	function Hub(key) {
		classCallCheck(this, Hub);

		this.key = key;
		//Object is more convenient than array when retrievalling and assigning value。
		this.listeners = {};
	}

	createClass(Hub, [{
		key: "addListener",
		value: function addListener(listener) {
			var id = listener.id;
			if (!(id in this.listeners)) {
				this.listeners[id] = listener;
			}
		}
	}, {
		key: "notify",
		value: function notify() {
			for (var id in this.listeners) {
				//oldVal->this.val
				//val->this.vm[this.prop]
				this.listeners[id].update();
			}
		}
	}]);
	return Hub;
}();

var config = function config(configs, vm) {
	vm.configs = Object.assign(defaultConfigs, configs);
};
var hijack = function hijack(data, vm) {
	Object.keys(data).forEach(function (key) {
		Object.defineProperty(vm, key, {
			get: function get$$1() {
				//it can replaced by this._data[key],this.$options.data[key] ,o.data[key]
				//not allow valCache
				//this will call `accessor get fn` 
				console.log("hijack->get:" + key);
				return data[key];
			},
			set: function set$$1(newVal) {
				data[key] = newVal;
			}
		});
	});
};

var accessor = function accessor(data, vm) {
	Object.keys(data).forEach(function (key) {
		var hub = new Hub(key);
		hubs.push(hub);
		//Data properties->data[key]
		var valCache = data[key];
		//Accessor properties
		Object.defineProperty(data, key, {
			get: function get$$1() {
				if (temp.listener) {
					hub.addListener(temp.listener);
				}
				console.log("accessor->get:" + key);
				return valCache;
			},
			set: function set$$1(newVal) {
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
var proxy = function proxy(data, vm) {
	accessor(data, vm);
	hijack(data, vm);
};
var watch = function watch(watchers, vm) {
	//Object.entries({a:1,b:2})-->[["a", 1],["b", 2]]
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.entries(watchers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ref = _step.value;

			var _ref2 = slicedToArray(_ref, 2);

			var exp = _ref2[0];
			var cb = _ref2[1];

			// console.log('watching...')
			temp.listener = new Listener(vm, exp, cb);
			run(exp, vm);
			temp.listener = null;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
};

var compute = function compute(computeds, vm) {
	/**
  * 	var o={}
 	Object.defineProperty(o, 'a', {
 		get: function () {return 1 },
 		set: function () { }
 	})
 	Object.getOwnPropertyDescriptor(o,'a')
 	{get: ƒ, set: ƒ, enumerable: false, configurable: false}
  */
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Object.entries(computeds)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _ref3 = _step2.value;

			var _ref4 = slicedToArray(_ref3, 2);

			var key = _ref4[0];
			var target = _ref4[1];

			Object.defineProperty(vm, key, {
				configurable: false,
				enumerable: true,
				get: typeOf$1(target) === "function" ? target : typeOf$1(target) === "object" ? target.get : function () {},
				set: typeOf$1(target) === "object" ? target.set : function () {}
			});
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}
};

var Attr = function () {
	function Attr() {
		classCallCheck(this, Attr);
	}

	createClass(Attr, null, [{
		key: "isExpression",
		value: function isExpression(txt) {
			return (/\{\{.*\}\}/.test(txt)
			);
		}
	}, {
		key: "expressionKey",
		value: function expressionKey(txt) {
			return txt.match(/(.*)\{\{(.*)\}\}(.*)/);
		}
	}, {
		key: "isRightDetec",
		value: function isRightDetec(detective, configs) {
			var detec;
			for (var prefix in configs) {
				if (detective.startsWith(configs[prefix])) {
					detec = {
						detectype: detective.substring(0, configs[prefix].length),
						detec: detective.substring(configs[prefix].length)
					};
					break;
				}
			}
			return detec;
		}
	}]);
	return Attr;
}();

/**
 * DomEvent
 */
var DomEvent = function () {
	function DomEvent() {
		classCallCheck(this, DomEvent);
	}

	createClass(DomEvent, null, [{
		key: "bind",
		value: function bind(node, prop, val, oldValue) {
			if (val !== oldValue) {
				node[prop] = val;
			}
		}
	}, {
		key: "addEvt",
		value: function addEvt(node, evt, fn) {
			node.addEventListener(evt, fn, false);
		}
	}]);
	return DomEvent;
}();

var Register = function () {
	function Register() {
		classCallCheck(this, Register);
	}

	createClass(Register, null, [{
		key: "registDomListener4Hubs",
		value: function registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt) {
			var cb = function cb(val, oldVal) {
				DomEvent.bind(node, prop, preTxt + val + nxtTxt, preTxt + oldVal + nxtTxt);
			};
			// console.log(`初始化页面get：${exp}`)
			temp.listener = new Listener(vm, exp, cb);
			var newVal = run$1(exp, vm);
			cb(newVal);
			temp.listener = null;
		}
	}]);
	return Register;
}();

/**
 * Detictive
 */

var Detictive = function () {
	function Detictive() {
		classCallCheck(this, Detictive);
	}

	createClass(Detictive, null, [{
		key: "bind",
		value: function bind(node, prop, exp, vm) {
			var preTxt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
			var nxtTxt = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

			// model  html
			// {{}}
			// :id
			Register.registDomListener4Hubs(node, prop, exp, vm, preTxt, nxtTxt);
			if (prop === 'value') {
				//when set by user,the exp is must be a variable.
				// not allow expression
				var fn = function fn(e) {
					return vm[exp] = e.target.value;
				};
				this.addEvt(node, 'input', fn, vm);
			}
		}
	}, {
		key: "addEvt",
		value: function addEvt(node, evt, exp, vm) {
			//dom ,user input event ,default implement
			//@
			var fn = typeof exp === "function" ? exp : vm.methods[exp].bind(vm);
			DomEvent.addEvt(node, evt, fn);
		}
	}]);
	return Detictive;
}();

/**
 * Templater
 */

var Templater = function () {
	function Templater(selector, vm) {
		classCallCheck(this, Templater);

		this.vm = vm;
		this.el = document.querySelector(selector);
		this.el.appendChild(this.init());
	}

	createClass(Templater, [{
		key: "init",
		value: function init() {
			var _this = this;

			var docFrag = document.createDocumentFragment();
			//translat dom to fragment
			this.translate(docFrag).childNodes.forEach(function (node) {
				//init view
				_this.initAttr(node);
			});
			return docFrag;
		}
	}, {
		key: "translate",
		value: function translate(docFrag) {
			for (var i = 0; i < this.el.childNodes.length; i++) {
				var node = this.el.childNodes[i];
				if (this.isValidType(node)) {
					docFrag.appendChild(node);
					--i;
				}
			}
			return docFrag;
		}
	}, {
		key: "initAttr",
		value: function initAttr(node) {
			var _this2 = this;

			var props = {
				model: 'value', //v-model
				html: 'innerHTML', //v-html
				text: 'textContent', //{{}}
				class: 'className' //:class
			};
			if (node.nodeType === 1) {
				//for (let attr of node.attributes) {
				new Array().slice.call(node.attributes).forEach(function (attr) {
					var detective = attr.nodeName;
					var exp = attr.nodeValue;
					var detecInfo = Attr.isRightDetec(detective, _this2.vm.configs);

					var _ref = detecInfo ? detecInfo : {
						detectype: undefined,
						detec: undefined
					},
					    detectype = _ref.detectype,
					    detec = _ref.detec;

					if (detec) {
						node.removeAttribute(detective);
						var prop = props[detec] ? props[detec] : detec;
						if (detectype === _this2.vm.configs.evtPrefix) {
							//@click
							Detictive.addEvt(node, prop, exp, _this2.vm);
						} else {
							//u-html u-model
							//:id
							Detictive.bind(node, prop, exp, _this2.vm);
						}
					}
				});
				node.childNodes.forEach(function (childNode) {
					_this2.initAttr(childNode);
				});
				return;
			}
			if (node.nodeType === 3) {
				if (Attr.isExpression(node.data)) {
					//text with {{}}
					var _Attr$expressionKey = Attr.expressionKey(node.data),
					    _Attr$expressionKey2 = slicedToArray(_Attr$expressionKey, 4),
					    preTxt = _Attr$expressionKey2[1],
					    key = _Attr$expressionKey2[2],
					    nxtTxt = _Attr$expressionKey2[3];

					Detictive.bind(node, props.text, key, this.vm, preTxt, nxtTxt);
				}
			}
		}
	}, {
		key: "isValidType",
		value: function isValidType(node) {
			//for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
			return node.nodeType === 1 || node.nodeType === 8 || node.nodeType === 3 && !this.isPureBlankNode(node);
		}
		//https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM

	}, {
		key: "isPureBlankNode",
		value: function isPureBlankNode(node) {
			// Use ECMA-262 Edition 3 String and RegExp features
			return !/[^\t\n\r ]/.test(node.data);
		}
	}]);
	return Templater;
}();

/**
 * Unar
 */

var Unar =
// static hubs = []
function Unar(_ref) {
		var _ref$el = _ref.el,
		    el = _ref$el === undefined ? '' : _ref$el,
		    _ref$data = _ref.data,
		    data = _ref$data === undefined ? {} : _ref$data,
		    _ref$computeds = _ref.computeds,
		    computeds = _ref$computeds === undefined ? {} : _ref$computeds,
		    _ref$methods = _ref.methods,
		    methods = _ref$methods === undefined ? {} : _ref$methods,
		    _ref$watchers = _ref.watchers,
		    watchers = _ref$watchers === undefined ? {} : _ref$watchers,
		    configs = _ref.configs;
		classCallCheck(this, Unar);

		this.methods = methods;

		//we can config the dom detective about actions props event
		config(configs, this);

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
;

return Unar;

})));

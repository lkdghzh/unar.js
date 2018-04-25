
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

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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

var keywords = RegExp(['^break$', '^case$', '^catch$', '^continue$', '^default$', '^delete$', '^do$', '^else$', '^finally$', '^for$', '^function$', '^if$', '^in$', '^instanceof$', '^new$', '^return$', '^switch$', '^this$', '^throw$', '^try$', '^typeof$', '^var$', '^void$', '^while$', '^with$'].join('|'), 'g');
var run = function run(exp, scope) {
	if (keywords.test(exp)) {
		console.error('when getting value of "' + exp + '",there\'s a unresolved error. "' + exp + '" is keyword,it shouldn\'t used as key in data');
		return;
	} else {
		try {
			var fn;
			fn = new Function('vm', 'with(vm){return ' + exp + '}');
			return fn(scope);
		} catch (e) {
			console.error('when getting value of "' + exp + '",there\'s a unresolved error');
		}
	}
};
var runSet = function runSet(exp, val, scope) {
	try {
		var fn;
		fn = new Function('vm', 'with(vm){' + exp + ' = \'' + val + '\'}');
		return fn(scope);
	} catch (e) {
		console.error('when setting value for ' + exp + ',there\'s a unresolved error');
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
			//maybe (object) complex type or simple type
			if (newVal !== this.oldVal) {
				this.cb.call(this.vm, newVal, this.oldVal);
				//update val to oldVal
				this.oldVal = newVal;
			}
		}
	}]);
	return Listener;
}();

var typeOf$1 = function typeOf(o) {
	var _target;
	return ((_target = typeof o === 'undefined' ? 'undefined' : _typeof(o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase();
};
var keywords$1 = RegExp(['^break$', '^case$', '^catch$', '^continue$', '^default$', '^delete$', '^do$', '^else$', '^finally$', '^for$', '^function$', '^if$', '^in$', '^instanceof$', '^new$', '^return$', '^switch$', '^this$', '^throw$', '^try$', '^typeof$', '^var$', '^void$', '^while$', '^with$'].join('|'), 'g');
var run$1 = function run(exp, scope) {
	if (keywords$1.test(exp)) {
		console.error('when getting value of "' + exp + '",there\'s a unresolved error. "' + exp + '" is keyword,it shouldn\'t used as key in data');
		return;
	} else {
		try {
			var fn;
			fn = new Function('vm', 'with(vm){return ' + exp + '}');
			return fn(scope);
		} catch (e) {
			console.error('when getting value of "' + exp + '",there\'s a unresolved error');
		}
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

var accessor = function accessor(data) {
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
					accessor(newVal);
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
			accessor(valCache);
		}
	});
};
var proxy = function proxy(data, vm) {
	accessor(data);
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
		key: 'isExpression',
		value: function isExpression(txt) {
			return (/\{\{.*\}\}/.test(txt)
			);
		}
	}, {
		key: 'expressionKey',
		value: function expressionKey(txt) {
			return txt.match(/(.*)\{\{(.*)\}\}(.*)/);
		}
	}, {
		key: 'checkDirective',
		value: function checkDirective(attrName, configs) {
			var detec = {
				prefix: '',
				directive: ''
			};
			for (var key in configs) {
				var prefix = configs[key];
				if (attrName.startsWith(prefix)) {
					detec.prefix = attrName.substring(0, prefix.length);
					detec.directive = attrName.substring(prefix.length);
					break;
				}
			}
			return detec;
		}
	}]);
	return Attr;
}();

var Register = function () {
	function Register() {
		classCallCheck(this, Register);
	}

	createClass(Register, null, [{
		key: "registDomListener4Hubs",
		value: function registDomListener4Hubs(cb, exp, vm) {
			// console.log(`初始化页面get：${exp}`)
			temp.listener = new Listener(vm, exp, cb);
			var newVal = run$1(exp, vm);
			cb(newVal);
			temp.listener = null;
		}
	}]);
	return Register;
}();

var Base = function () {
    function Base(_ref) {
        var prefix = _ref.prefix,
            directive = _ref.directive,
            exp = _ref.exp,
            node = _ref.node,
            vm = _ref.vm;
        classCallCheck(this, Base);

        this.prefix = prefix;
        this.directive = directive;
        this.exp = exp;
        this.vm = vm;
        this.node = node;
    }

    createClass(Base, [{
        key: "bind",
        value: function bind(cb) {
            // model  html
            // {{}}
            // :id
            Register.registDomListener4Hubs(cb, this.exp, this.vm);
        }
        // destroy() {
        //     nullify(this.name, this.vm, this.node)
        // }

    }]);
    return Base;
}();

var Bind = function (_Base) {
    inherits(Bind, _Base);

    function Bind(opts) {
        classCallCheck(this, Bind);

        var _this = possibleConstructorReturn(this, (Bind.__proto__ || Object.getPrototypeOf(Bind)).call(this, opts));

        _this.prop = _this.directive;
        return _this;
    }

    createClass(Bind, [{
        key: 'bind',
        value: function bind() {
            var _this2 = this;

            var cb = function cb(val) {
                _this2.node[_this2.prop] = val;
            };
            get(Bind.prototype.__proto__ || Object.getPrototypeOf(Bind.prototype), 'bind', this).call(this, cb);
        }
    }]);
    return Bind;
}(Base);

var On = function (_Base) {
    inherits(On, _Base);

    function On(opts) {
        classCallCheck(this, On);

        var _this = possibleConstructorReturn(this, (On.__proto__ || Object.getPrototypeOf(On)).call(this, opts));

        _this.evtName = _this.directive;
        _this.evt = _this.exp;
        return _this;
    }

    createClass(On, [{
        key: 'bind',
        value: function bind() {
            this.node.addEventListener(this.evtName, this.vm.methods[this.evt].bind(this.vm), false);
        }
    }]);
    return On;
}(Base);

var Model = function (_Base) {
    inherits(Model, _Base);

    function Model(opts) {
        classCallCheck(this, Model);

        var _this = possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, opts));

        _this.prop = 'value';
        return _this;
    }

    createClass(Model, [{
        key: 'bind',
        value: function bind() {
            var _this2 = this;

            var cb = function cb(val) {
                _this2.node[_this2.prop] = val;
            };
            get(Model.prototype.__proto__ || Object.getPrototypeOf(Model.prototype), 'bind', this).call(this, cb);
            this.addEvt();
        }
    }, {
        key: 'addEvt',
        value: function addEvt() {
            var _this3 = this;

            //default implement  duplex-->true
            //when set by user,the exp is must be a variable,not allow expression
            var fn = function fn(e) {
                return runSet(_this3.exp, e.target.value, _this3.vm);
            };
            this.node.addEventListener('input', fn, false);
        }
        // destroy() {
        //     super.destroy()
        //     nullify(this.exp, this.prop)
        // }

    }]);
    return Model;
}(Base);

var If = function (_Base) {
    inherits(If, _Base);

    function If(opts) {
        classCallCheck(this, If);
        return possibleConstructorReturn(this, (If.__proto__ || Object.getPrototypeOf(If)).call(this, opts));
    }

    createClass(If, [{
        key: 'bind',
        value: function bind() {
            var _this2 = this;

            var holderNode = document.createTextNode('');
            var parentNode = this.node.parentNode;
            parentNode.insertBefore(holderNode, this.node);
            parentNode.removeChild(this.node);
            var cb = function cb(val) {
                if (val) {
                    parentNode.insertBefore(_this2.node, holderNode);
                } else {
                    parentNode.removeChild(_this2.node);
                }
            };
            get(If.prototype.__proto__ || Object.getPrototypeOf(If.prototype), 'bind', this).call(this, cb);
        }
    }]);
    return If;
}(Base);

var For = function (_Base) {
    inherits(For, _Base);

    function For(opts) {
        classCallCheck(this, For);
        return possibleConstructorReturn(this, (For.__proto__ || Object.getPrototypeOf(For)).call(this, opts));
    }

    createClass(For, [{
        key: 'bind',
        value: function bind() {

            get(For.prototype.__proto__ || Object.getPrototypeOf(For.prototype), 'bind', this).call(this, cb);
        }
    }]);
    return For;
}(Base);

var Text = function (_Base) {
    inherits(Text, _Base);

    function Text() {
        classCallCheck(this, Text);
        return possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));
    }

    return Text;
}(Base);

var Html = function (_Base) {
    inherits(Html, _Base);

    function Html(opts) {
        classCallCheck(this, Html);

        var _this = possibleConstructorReturn(this, (Html.__proto__ || Object.getPrototypeOf(Html)).call(this, opts));

        _this.prop = 'innerHTML';
        return _this;
    }

    createClass(Html, [{
        key: 'bind',
        value: function bind() {
            var _this2 = this;

            var cb = function cb(val) {
                //, oldVal
                _this2.node[_this2.prop] = val;
            };
            get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), 'bind', this).call(this, cb);
        }
    }]);
    return Html;
}(Base);

var Show = function (_Base) {
    inherits(Show, _Base);

    function Show() {
        classCallCheck(this, Show);
        return possibleConstructorReturn(this, (Show.__proto__ || Object.getPrototypeOf(Show)).call(this));
    }

    return Show;
}(Base);

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
                break;
            case 'if':
                instance = new If(opts);
                break;
            case 'for':
                instance = new For(opts);
                break;
            case 'text':
                instance = new Text(opts);
                break;
            case 'html':
                instance = new Html(opts);
                break;
            case 'show':
                instance = new Show(opts);
                break;
            default:
                break;
        }
    }
    return instance;
}

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
			var docFrag = document.createDocumentFragment();
			var filledFrag = this.fillFrag(docFrag);
			this.compileChild(filledFrag);
			return docFrag;
		}
	}, {
		key: "fillFrag",
		value: function fillFrag(docFrag) {
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
		key: "compileChild",
		value: function compileChild(node) {
			var _this = this;

			//translat dom to fragment
			node.childNodes.forEach(function (node) {
				//init view
				_this.compileNode(node);
			});
		}
	}, {
		key: "compileNode",
		value: function compileNode(node) {
			if (node.nodeType === 1) {
				//for (let attr of node.attributes) {
				this.compileElement(node);
			} else if (node.nodeType === 3) {
				this.compileText(node);
			}
		}
	}, {
		key: "compileElement",
		value: function compileElement(node) {
			var _this2 = this;

			var lasy = { isLasy: false, type: '', exp: '' };
			var lasyDirective;
			Array.from(node.attributes).forEach(function (attr) {
				var attrName = attr.nodeName;

				var _Attr$checkDirective = Attr.checkDirective(attrName, _this2.vm.configs),
				    prefix = _Attr$checkDirective.prefix,
				    directive = _Attr$checkDirective.directive;

				var exp = attr.nodeValue; //expOrfn
				if (directive) {
					node.removeAttribute(attrName);
					//@click  ->click
					//u-model ->value
					var currentDirective = directiveFactory({
						prefix: prefix,
						directive: directive,
						exp: exp,
						node: node,
						vm: _this2.vm
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
	}, {
		key: "compileText",
		value: function compileText(node) {
			if (Attr.isExpression(node.data)) {
				//text with {{}}
				var _Attr$expressionKey = Attr.expressionKey(node.data),
				    _Attr$expressionKey2 = slicedToArray(_Attr$expressionKey, 4),
				    preTxt = _Attr$expressionKey2[1],
				    exp = _Attr$expressionKey2[2],
				    nxtTxt = _Attr$expressionKey2[3];

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

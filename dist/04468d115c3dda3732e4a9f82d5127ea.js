// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({12:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//Unar.global={
//     actionPrefix:"u",
//     attrPrefix:":",
//     evtPrefix:"@",
// }

//merge
var config = {
    actionPrefix: "u",
    attrPrefix: ":",
    evtPrefix: "@"
};
exports.default = config;
},{}],8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require("../../Config");

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attr = function () {
    function Attr() {
        _classCallCheck(this, Attr);
    }

    _createClass(Attr, null, [{
        key: "isExpression",
        value: function isExpression(txt) {
            return (/\{\{.*\}\}/.test(txt)
            );
        }
    }, {
        key: "isAction",
        value: function isAction(attr) {
            //u
            return attr.indexOf(_Config2.default.actionPrefix) === 0;
        }
    }, {
        key: "isProp",
        value: function isProp(attr) {
            //: v-bind:a="a"
            return attr.indexOf(_Config2.default.PropPrefix) === 0;
        }
    }, {
        key: "isEvt",
        value: function isEvt(attr) {
            //: v-bind:a="a"
            return attr.indexOf(_Config2.default.evtPrefix) === 0;
        }
    }]);

    return Attr;
}();

exports.default = Attr;
},{"../../Config":12}],14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DomEvent
 */
var DomEvent = function () {
    function DomEvent() {
        _classCallCheck(this, DomEvent);
    }

    _createClass(DomEvent, null, [{
        key: "model",
        value: function model(node, val) {
            node.value = val;
        }
    }, {
        key: "text",
        value: function text(node, _text) {
            node.textContent = _text;
        }
    }, {
        key: "html",
        value: function html(node, _html) {
            node.innerHTML = _html;
        }
    }, {
        key: "bind",
        value: function bind(node, attrName, attrVal) {
            node[attrName.substr(config.attrPrefix.length, attrName.length)] = attrVal;
        }
    }, {
        key: "addEvt",
        value: function addEvt(node, evtName, fn) {
            node.addEventListener(evtName, fn, false);
        }
    }]);

    return DomEvent;
}();

exports.default = DomEvent;
},{}],13:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * one vm prop <---> one Hub
 */
var id = 0;

var Hub = function () {
    function Hub(prop, cb) {
        _classCallCheck(this, Hub);

        this.id = ++id;
        this.prop = prop;
        this.listeners = [];
        this.addListener(cb);
    }

    _createClass(Hub, [{
        key: "addListener",
        value: function addListener(cb) {
            this.listeners.push(cb);
        }
    }, {
        key: "deleteListener",
        value: function deleteListener() {}
    }, {
        key: "notify",
        value: function notify() {
            this.listeners.forEach(function (fn) {
                fn();
            });
        }
    }]);

    return Hub;
}();

exports.default = Hub;
},{}],9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Detictive
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 静态方法包含this关键字，这个this指的是类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Config = require("../../Config");

var _Config2 = _interopRequireDefault(_Config);

var _DomEvent = require("../DomEvent");

var _DomEvent2 = _interopRequireDefault(_DomEvent);

var _Hub = require("../../Hub");

var _Hub2 = _interopRequireDefault(_Hub);

var _Instance = require("../../../src/Instance");

var _Instance2 = _interopRequireDefault(_Instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// debugger
var Detictive = function () {
    function Detictive() {
        _classCallCheck(this, Detictive);
    }

    _createClass(Detictive, null, [{
        key: _Config2.default.actionPrefix + "-model",
        value: function value(node, key, vm) {
            // debugger
            this._update("model", node, key, vm);
        }
    }, {
        key: _Config2.default.actionPrefix + "-text",
        value: function value(node, text, vm) {
            this._update("text", node, text);
        }
    }, {
        key: _Config2.default.actionPrefix + "-html",
        value: function value(node, html, vm) {
            this._update("html", node, html);
        }
        //:

    }, {
        key: "bind",
        value: function bind(node, attrName, attrVal) {
            _DomEvent2.default.bind(node, attrName, attrVal);
        }
        //@

    }, {
        key: "addEvt",
        value: function addEvt(node, attrName, fn) {
            var evtName = attrName.substr(_Config2.default.evtPrefix.length, attrName.length);
            var fn = this.methods[fn].bind(this);
            _DomEvent2.default.addEvt(node, evtName, fn);
        }
    }, {
        key: "_update",
        value: function _update(detictive, node, key, vm) {
            var cb = _DomEvent2.default[detictive];
            // debugger
            if (detictive === 'model') {
                console.log("model");
                node.addEventListener('input', function (e) {
                    debugger;
                    vm[key] = e.target.value;
                }, false);
            }
            cb(node, vm[key]);
            //检测hubs 是否具备此prop（value）hub，有的添加cb回调，没有创建便hub
            var has = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _Instance2.default.hubs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hub = _step.value;

                    if (hub.prop === key) {
                        hub.listeners.push(cb);
                        has = true;
                        break;
                    }
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

            !has && _Instance2.default.hubs.push(new _Hub2.default(key, cb));
        }
    }]);

    return Detictive;
}();

exports.default = Detictive;
},{"../../Config":12,"../DomEvent":14,"../../Hub":13,"../../../src/Instance":4}],6:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Templater
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Attr = require("./Attr");

var _Attr2 = _interopRequireDefault(_Attr);

var _Detective = require("./Detective");

var _Detective2 = _interopRequireDefault(_Detective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Templater = function () {
    function Templater(selector, vm) {
        _classCallCheck(this, Templater);

        this.vm = vm;
        this.el = document.querySelector(selector);
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }

    _createClass(Templater, [{
        key: "init",
        value: function init() {
            var _this = this;

            var fragment = document.createDocumentFragment();
            this.filterNode2fragment(fragment);
            //初始化view
            fragment.childNodes.forEach(function (node) {
                _this.initAttrEvt(node);
            });
            console.log(fragment);
            // for (let node of fragment.childNodes) {
            //     this.initAttrEvt(node)
            // }
            return fragment;
        }
    }, {
        key: "filterNode2fragment",
        value: function filterNode2fragment(fragment) {
            //所有节点node
            for (var i = 0; i < this.el.childNodes.length; i++) {
                var node = this.el.childNodes[i];
                var nodeType = node.nodeType;
                //for reduce the loop count ,filter nodes to Element Comment Text(not contain pure whitespace)
                if (nodeType === 1 || nodeType === 8 || nodeType === 3 && !this._isPureBlankNode(node)) {
                    fragment.appendChild(node);
                    --i;
                }
            }
        }
    }, {
        key: "initAttrEvt",
        value: function initAttrEvt(node) {
            var _this2 = this;

            //排除元素、文本以外的节点
            if (node.nodeType === 1) {
                //node.attributes
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = node.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var attr = _step.value;

                        //过滤掉非unar的动作、属性、事件
                        var detec = attr.nodeName;
                        var key = attr.nodeValue;
                        //u-html u-model
                        if (_Attr2.default.isAction(detec)) {
                            _Detective2.default[detec](node, key, this.vm);
                        }
                        //:id
                        if (_Attr2.default.isProp(detec)) {
                            _Detective2.default.bind(node, detec, key, this.vm);
                        }
                        //@click
                        if (_Attr2.default.isEvt(detec)) {
                            _Detective2.default.addEvt.call(this.vm, node, detec, key);
                        }
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

                node.childNodes.forEach(function (childNode) {
                    _this2.initAttrEvt(childNode);
                });
            }
            //text {{}}
            if (node.nodeType === 3 && _Attr2.default.isExpression(node.data)) {}
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

    }, {
        key: "_isPureBlankNode",
        value: function _isPureBlankNode(node) {
            // Use ECMA-262 Edition 3 String and RegExp features
            return !/[^\t\n\r ]/.test(node.data);
        }
    }]);

    return Templater;
}();

exports.default = Templater;
},{"./Attr":8,"./Detective":9}],4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = require("../View/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Unar
                                                                                                                                                           */

// import util from "../Util"
// import detective from "./Detective"
// import model from "./Model"


var Unar = function Unar(o) {
	var _this = this;

	_classCallCheck(this, Unar);

	this.methods = o.methods;
	this.$options = {};
	//在vm新建_data、$options属性
	var data = this._data = this.$options.data = o.data;

	//创建代理（存取）属性，代理_data、$options对象下的存取属性
	Object.keys(data).forEach(function (key) {
		Object.defineProperty(_this, key, {
			configurable: false,
			enumerable: true,
			get: function get() {
				//data[key]、this._data[key]、this.$options.data 、o.data都可以
				//实现代理对象（读写都要通过这个代理），然后访问this._data[key]、this.$options.data的存取器属性
				//此getter会调用下面getter
				return data[key];
			},
			set: function set(newVal) {
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
			get: function get() {
				//可以尝试这个
				//this._data[key]，this.$options.data[key]和data[key]都会爆栈
				return valCache;
			},
			set: function set(newVal) {
				debugger;
				valCache = newVal;
			}
		});
	});
	new _index2.default(o.el, this);
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
;
// Unar.

Unar.hubs = [];
exports.default = Unar;
},{"../View/index.js":6}],2:[function(require,module,exports) {
"use strict";

var _index = require("../src/Instance/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Unar = _index2.default;
var app = new _index2.default({
    el: "#root",
    data: {
        a: 1,
        id: 'input1'
    },
    methods: {
        fn: function fn() {
            console.log(this.a);
        }
    }
});
// import {p} from "./parcel.js"
// p.es6fn('like')
},{"../src/Instance/index.js":4}],18:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '4682' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[18,2])
//# sourceMappingURL=/dist/04468d115c3dda3732e4a9f82d5127ea.map
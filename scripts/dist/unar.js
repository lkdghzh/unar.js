
/**
*   Unar.js v0.0.1
*   (c) 2017-2018 author:like
*   Released under the MIT License.
*/ 

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

/**
 * one vm prop <---> one Hub
 */

// a:{id: 1, prop: "a", listeners: [cb1,cb2]
// b:{id: 2, prop: "b", listeners: [cb3,cb4]
var hubs = {};

window.hubs = hubs;
var id = 0;

var Hub = function () {
	function Hub(prop, cb, vm) {
		classCallCheck(this, Hub);

		this.id = ++id;
		this.prop = prop;
		this.val = vm[prop];
		this.vm = vm;
		this.listeners = [];
		this.addListener(cb);
	}

	createClass(Hub, [{
		key: "addListener",
		value: function addListener(cb) {
			this.listeners.push(cb);
		}
	}, {
		key: "deleteListener",
		value: function deleteListener() {}
	}, {
		key: "notify",
		value: function notify(newVal) {
			var _this = this;

			this.listeners.forEach(function (fn) {
				//oldVal->this.val
				//val->this.vm[this.prop]
				fn(_this.vm[_this.prop], _this.val);
			});
		}
	}]);
	return Hub;
}();

//Unar.global={
//     actionPrefix:"u",
//     attrPrefix:":",
//     evtPrefix:"@",
// }

//merge
var config$1 = {
    actionPrefix: "u",
    attrPrefix: ":",
    evtPrefix: "@"
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
        key: "isAction",
        value: function isAction(attr) {
            //u
            return attr.indexOf(config$1.actionPrefix) === 0;
        }
    }, {
        key: "isProp",
        value: function isProp(attr) {
            //: v-bind:a="a"
            return attr.indexOf(config$1.PropPrefix) === 0;
        }
    }, {
        key: "isEvt",
        value: function isEvt(attr) {
            //: v-bind:a="a"
            return attr.indexOf(config$1.evtPrefix) === 0;
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
		key: "model",
		value: function model(node, val, oldValue) {
			// return function () {
			node.value = val;
			// }()
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

/**
 * Detictive
 * 静态方法包含this关键字，这个this指的是类
 */
// debugger

var Detictive = function () {
	function Detictive() {
		classCallCheck(this, Detictive);
	}

	createClass(Detictive, null, [{
		key: config$1.actionPrefix + "-model",
		value: function value(node, key, vm) {
			// debugger
			this._update("model", node, key, vm);
			node.addEventListener('input', function (e) {
				vm[key] = e.target.value;
			}, false);
		}
	}, {
		key: config$1.actionPrefix + "-text",
		value: function value(node, text, vm) {
			this._update("text", node, text);
		}
	}, {
		key: config$1.actionPrefix + "-html",
		value: function value(node, html, vm) {
			this._update("html", node, html);
		}
		//:

	}, {
		key: "bind",
		value: function bind(node, attrName, attrVal) {
			DomEvent.bind(node, attrName, attrVal);
		}
		//@

	}, {
		key: "addEvt",
		value: function addEvt(node, attrName, fn) {
			var evtName = attrName.substr(config$1.evtPrefix.length, attrName.length);
			var fn = this.methods[fn].bind(this);
			DomEvent.addEvt(node, evtName, fn);
		}
	}, {
		key: "_update",
		value: function _update(detictive, node, key, vm) {
			var cb = function cb(val, oldVal) {
				DomEvent[detictive](node, val, oldVal);
			};
			cb(vm[key]);
			//检测hubs 是否具备此key，有的添加cb回调，没有创建便hub
			hubs[key] ? hubs[key].listeners.push(cb) : hubs[key] = new Hub(key, cb, vm);
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
        if (this.el) {
            this.el.appendChild(this.init());
        }
    }

    createClass(Templater, [{
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
                        if (Attr.isAction(detec)) {
                            Detictive[detec](node, key, this.vm);
                        }
                        //:id
                        if (Attr.isProp(detec)) {
                            Detictive.bind(node, detec, key, this.vm);
                        }
                        //@click
                        if (Attr.isEvt(detec)) {
                            Detictive.addEvt.call(this.vm, node, detec, key);
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
            if (node.nodeType === 3 && Attr.isExpression(node.data)) {}
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

/**
 * Unar
 */

var Unar =
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
function Unar(o) {
	var _this = this;

	classCallCheck(this, Unar);

	this.methods = o.methods;
	this.$options = {};
	//在vm新建_data、$options属性
	var data = this._data = this.$options.data = o.data;

	//创建代理（存取）属性，代理_data、$options对象下的存取属性
	Object.keys(data).forEach(function (key) {
		Object.defineProperty(_this, key, {
			configurable: false,
			enumerable: true,
			get: function get$$1() {
				//data[key]、this._data[key]、this.$options.data 、o.data都可以
				//实现代理对象（读写都要通过这个代理），然后访问this._data[key]、this.$options.data的存取器属性
				//此getter会调用下面getter
				return data[key];
			},
			set: function set$$1(newVal) {
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
			get: function get$$1() {
				//可以尝试这个
				//this._data[key]，this.$options.data[key]和data[key]都会爆栈
				return valCache;
			},
			set: function set$$1(newVal) {
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
;

export default Unar;

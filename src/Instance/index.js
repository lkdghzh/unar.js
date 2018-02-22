/**
 * Unar
 */


// import util from "../Util"
// import detective from "./Detective"
// import model from "./Model"
import Templater from "../View/index.js"
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
					debugger
					valCache = newVal;
				}
			});
		})
		new Templater(o.el, this)
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

export default Unar
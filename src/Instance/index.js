/**
 * Unar
 */

import {proxy,watch} from "./config";
import Templater from "../View/index.js"
class Unar {
	// static hubs = []
	constructor({
		el = '',
		data = {},
		methods = {},
		watchers = {}
	}) {
		this.methods = methods
		this.$options = {}

		//this add keys(_data、$options )
		var data = this._data = this.$options.data = data

		//hijack properties
		proxy(data,this)

		//add watchers
		this.watchers = watchers
		watch(this.watchers,this)

		//compile fragment
		new Templater(el, this)
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

export default Unar

/**
 * Unar
 */

import {proxy,watch,compute} from "./config"
import Templater from "../View/index.js"
class Unar {
	// static hubs = []
	constructor({
		el = '',
		data = {},
		computeds={},
		methods = {},
		watchers = {}
	}) {
		this.methods = methods
		//this.$options = {}

		//this add keys(_data、$options )
		//var data = this._data = this.$options.data = data

		//hijack properties
		//change data properties to accessor properties
		proxy(data,this)

		//add computed properties to this
		this.computeds=computeds
		compute(this.computeds,this)
		
		console.log(this)
		debugger
		//add watchers properties to this
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

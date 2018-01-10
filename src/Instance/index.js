// import util from "../Util"
// import detective from "./Detective"
// import model from "./Model"
import Templater from "../View"

debugger
export default class Unar {
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
    constructor(options) {
        debugger
        new Templater(options.el, this)
        //数据代理
        return new Proxy(this, {
            get: function (obj, prop) {
                if (prop in options.data) {
                    //属性
                    return options.data[prop]
                } else if (prop in options.methods) {
                    //方法
                    return options.methods[prop]
                } else {
                    console.error(`this scope havn't "${prop}" attribute or method`)
                }
            },
            set: function (obj, prop, value) {
                if (prop in options.data) {
                    //属性
                    options.data[prop] = value
                } else if (prop in options.methods) {
                    //方法
                    options.methods[prop] = value
                } else {
                    console.error(`this scope havn't "${prop}" attribute or method`)
                }
            }
        })
    }
    static use() {}
    static extend() {}
    static nextTick() {}
    $get() {
        //utils.get(this, key, val)
    }
    $set() {
        utils.set(this, key, val)
    }
    $created() {}
    $mounted() {}
    $watch() {}
    $computed() {}
    $remove() {}
    $destroy() {}
    $before() {}
    $after() {}
    // 'emit', 'on', 'off', 'once'
}
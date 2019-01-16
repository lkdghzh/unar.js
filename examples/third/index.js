import Unar from "../../packages/instance"
window.Unar = Unar
window.app = new Unar({
    el: "#root",
    data: {
        a: [1,2],
        b: [{b1:'b11',b2:'b21'}],
    },

    methods: {
        fn() {
            console.log(this.a)
        }
    }
})
console.log('q1:属性劫持', app)
console.warn(`①hubs的个数由示例中的劫持属性的个数决定（注意当存在嵌套对象时）,②每一个hub的listen属性（p）个数由模板中用到（p）指令的个数决定（注意当存在嵌套对象时）`)
console.log('q2:集线器数组', hubs)

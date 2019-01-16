import Unar from "../../packages/instance"
window.Unar = Unar
window.app = new Unar({
    el: "#root",
    data: {
        a: 1,
        b: 2,
    },
    
    methods: {
        fn() {
            console.log(this.a)
        }
    }
})
console.log('q1:属性劫持',app)
console.log('q2:集线器数组',hubs)

import Unar from "../src/Instance"
const app = new Unar({
    el: "#root",
    data: {
        a: 1,
        id: 'input1'
    },
    methods: {
        fn() {
            console.log(this.a)
        }
    }
})
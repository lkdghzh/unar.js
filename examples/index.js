import Unar from "../src/Instance/index.js"
window.Unar=Unar
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
// import {p} from "./parcel.js"
// p.es6fn('like')

var propType = {}
var state 
Object.defineProperty(propType, 'current', {
    configurable: false,
    enumerable: true,
    get() {
        return state
    },
    set(val) {
        state = val
    }
})
export default propType
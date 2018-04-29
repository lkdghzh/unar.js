export const nullify = (...args) => {
	args.map(arg => null)
}
const createPlaceHolder = () => {
	return document.createTextNode('')
}
const removeChild = (parent, node) => {
	return parent.removeChild(node)
}

let Dom = Object.create(null)
Dom.createPlaceHolder = createPlaceHolder
Dom.removeChild = removeChild
export default Dom
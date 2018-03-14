export default class Attr {
    static isExpression(txt) {
        return /\{\{.*\}\}/.test(txt)
    }
    static expressionKey(txt) {
        return txt.match(/(.*)\{\{(.*)\}\}(.*)/)
    }
    static isdetec(attr,prefix){
        return attr.startsWith(prefix)
    }
}
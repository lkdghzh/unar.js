export default class Attr {
    static isExpression(txt) {
        return /\{\{.*\}\}/.test(txt)
    }
    static expressionKey(txt) {
        return txt.match(/(.*)\{\{(.*)\}\}(.*)/)
    }
    static isdetec(name,prefix){
        return name.startsWith(prefix)
    }
}
import config from "../../Config"
export default class Attr {
    static isExpression(txt) {
        return /\{\{.*\}\}/.test(txt);
    }
    static expressionKey(txt) {
        return txt.match(/(.*)\{\{(.*)\}\}(.*)/);
    }
    static isAction(attr) {
        //u
        return attr.indexOf(config.actionPrefix) === 0;
    }
    static isProp(attr) {
        //: v-bind:a="a"
        return attr.indexOf(config.PropPrefix) === 0;
    }
    static isEvt(attr) {
        //: v-bind:a="a"
        return attr.indexOf(config.evtPrefix) === 0;
    }
}
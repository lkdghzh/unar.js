var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

//创建vdom
const createOldVirtualDomTree = (data) => {
    return h('ul', {
        style: {
            color: 'red'
        }
    }, [
        h('li', {
            style: {
                color: 'red'
            }
        }, [
            String('aaa1')
        ])
    ])
}
//创建真实dom
const realDom = createElement(createOldVirtualDomTree())

//将真实dom添加上去
document.body.appendChild(realDom);


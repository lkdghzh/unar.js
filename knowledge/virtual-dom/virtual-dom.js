let h = require('virtual-dom/h')
let createElement = require('virtual-dom/create-element')

let diff = require('virtual-dom/diff')
let patch = require('virtual-dom/patch')

let VNode = require('virtual-dom/vnode/vnode')
let VText = require('virtual-dom/vnode/vtext')

//创建vdom
/**
 * createOldVirtualDomTree
 * render
 */
const render = (count) => {
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
            String("当前值"+count)
        ])
    ])
}
//创建真实dom
let vtree = render(0)
const realDom = createElement(vtree)

//将真实dom添加上去
document.body.appendChild(realDom)


/**更新dom（diff两个 得到补丁patch）
 * 
 */


function update(count) {
    const newVTree = render(count)
    const patchs = diff(vtree, newVTree)
    console.log(patchs)
    patch(realDom, patchs)
    vtree=newVTree
}
let i=0
setInterval(() => {
    update(++i)
}, 1000)
# 顶层设计
## 核心
### when unar getter call ？
```
<input u-model="a" />
```
```
get() {
    if (propType.switch) {
        hub.addListener(propType.switch)
    }
    console.log(`accessor->get:${key}`)
    return valCache
}
```
+ 页面初始化时候，通过hijack数据劫持。 只有在new Listener()的时候调用。watchers里的属性也是new Listener()
+ notify时候，通过hijack数据劫持。 只有在hub.notify===listeners.notify的时候调用。如果watchers里的属性的注册的cb，也会调用
## Knowledge
+ babel "babel-plugin-external-helpers" create Class function 
+ babel "preset-stage-2" only transform static prop
## virtual dom
- fragment
- create-virtual-dom
- dom-diff
- real-dom-patch
- life-cycle

# 高级
## feature
1. [劫持、代理](https://github.com/lkdghzh/unar.js/blob/master/packages/instance/config.js#L11)
1. [数据属性->存取器属性->收集依赖->实现mvvm双向绑定](https://github.com/lkdghzh/unar.js/blob/master/packages/instance/config.js#L59)
1. [fragment编译模板](https://github.com/lkdghzh/unar.js/blob/master/packages/view/compile.js#L4)
1. [指令工厂创建指令实例](https://github.com/lkdghzh/unar.js/blob/master/packages/view/compile.js#L25)
1. [指令继承（oop思想）逻辑指令（if for）,操作指令（html value text）,属性指令（：class ：self）](https://github.com/lkdghzh/unar.js/tree/master/packages/view/directives)

## todolist
+ 解析json path的问题-->取值、赋值、检测。 /是否删除？
    + 自己写的问题
    + 参考 https://github.com/chaijs/pathval
    + 参考 勾股的状态机 http://jiongks.name/blog/vue-code-review/
+ 面向组件化（ocp）
    + 先做好一个组件的oop面向对象处理，然后才能粗粒化ocp面向组件
+ 是否转ts
+ 虚拟dom
    + 自己研究 ，需要实测性能差距。https://github.com/lkdghzh/blog/tree/master/unar/knowledge
    + 研究的virtual-dom库的使用 https://github.com/Matt-Esch/virtual-dom
    + 研究的snabbdom库的使用 https://github.com/snabbdom/snabbdom
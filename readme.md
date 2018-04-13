 
 
# PLAN
> :heavy_exclamation_mark: 45天,中间可能牵涉大变革 vdom ,life, ts 尽量不要插入

order | task | status
----  |----  | ---- 
2017-2018-03 | mvvm<->two-ways | :heavy_check_mark:
2017-2018-03 | watchers | :heavy_check_mark:
2017-2018-03 | computeds | :heavy_check_mark:
2018-03-13  | configs | :heavy_check_mark:
2018-03-14  | computeds ->set-hook  | :heavy_check_mark:
2018-03-17  | model, :(style class selfattr) ,html {{}}, @  | :heavy_check_mark: 
2018-03-22  | 发现漏洞。对key的词法分析。需要转化ast。这块开发周期长，尚不能估计。  | :bangbang:
2018-03-25  | show  | :hearts: 
2018/04/16  | for of ,if else elseif | :hearts: 
2018/04/23  | observe Object  | :hearts: 
2018/04/30 | observe Array  | :hearts: 
# options
## when unar getter call ？
```
<input u-model="a" />
...
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
# Knowledge
+ babel "babel-plugin-external-helpers" create Class function 
+ babel "preset-stage-2" only transform static prop
# virtual dom
- fragment
- create-virtual-dom
- dom-diff
- real-dom-patch
- life-cycle
# own configuration
    new Unar({
        ...
        config:{
            actionPrefix: "u-",
            attrPrefix: ":",
            evtPrefix: "@"
        }
    })
    file-suffix:'uar'

# parcel dev
+ npm install -g parcel-bundler
+ npm run dev:parcel

```
"plugins": ["external-helpers"] //need deleted manually in .babelrc
```

# package unar
> scripts -rollup -config.js

```
"plugins": ["external-helpers"]//need added manually in .babelrc
npm run dev:r   --->es6 umd
npm run stage:r --->es5 umd 
npm run prod:r  --->es5 umd min
```
# unit test
```
# Install Karma:
npm install karma --save-dev

# Install plugins that your project needs:
npm install karma-jasmine karma-chrome-launcher karma-firefox-launcher jasmine-core --save-dev

# Run Karma:
./node_modules/karma/bin/karma start
# Run Karma if installed global
npm install karma -g
karma start

cd scripts/karma/unit/
karma init
# enter ... it will touch karma.conf.js
touch test.js
vim test.js
i
function fn(){
	return 'first unit test'
}
esc
:wq
touch firstjasmineTest.js
vim firstjasmineTest.js
i
describe("A suite of basic functions", function () {
    it("test", function () {
        expect("first unit test").toEqual(fn());
    });
});
esc
:wq
# config karma.conf.js


# write scripts in package.json
"test:unit":"karma start scripts/karma/unit/karma.conf.js"
npm run test:unit
```

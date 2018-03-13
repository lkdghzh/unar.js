 
 
# PLAN
+ 2018/03/26之前，实现指令可配置参数
+ 2018/04/02之前，computeds 增加 set-hook
+ 2018/04/09之前，html css show杂项绑定
+ 2018/04/16之前，for if 杂项绑定
+ 2018/04/23之前，监测对象
+ 2018/04/30之前，监测对象检测数组
+ 45天,中间可能牵涉大变革 vdom life 尽量不要插入


babel "preset-stage-2" only transform static prop
# 1,virtual dom
- fragment
- create-virtual-dom
- dom-diff
- real-dom-patch
- life-cycle
# 2,your own configuration(config)
    Unar.global={
        actionPrefix:"u",
        attrPrefix:":",
        evtPrefix:"@",
    }
    file-suffix:'uar'

# 3,parcel
+ npm install -g parcel-bundler
+ npm run dev:parcel
# 4,webpack
## 1,run dev example
+ npm i
+ npm run dev
+ http://localhost:1234 
+ http://localhost:1234/start
+ http://localhost:1234/dist/index.html
## 2,run dev test-package
> there will be has some error information about `webpack-hmr`,it doesn't matter.because this command is just test package  in dev-enviroment,for we can see the packaged files
+ npm run dev:testpkg
+ open /dist/index.html in broswer

## 3,run product
> there will be `Unar.js` library in `/dist` Path .
+ npm run publish

# 5,ts
# 6,rollup打包
    1,scripts--config.js
# 7,数据代理、层级代理

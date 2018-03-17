 
 
# PLAN
> :heavy_exclamation_mark: 45天,中间可能牵涉大变革 vdom ,life, ts 尽量不要插入

order | task | status
----  |----  | ---- 
2017-2018-03 | mvvm<->two-ways | :heavy_check_mark:
2017-2018-03 | watchers | :heavy_check_mark:
2017-2018-03 | computeds | :heavy_check_mark:
2018-03-13  | configs | :heavy_check_mark:
2018-03-14  | computeds ->set-hook  | :heavy_check_mark:
2018-03-17  | model, : ,html {{}}, @  | :heavy_check_mark: 
2018-03-25  | style class show  | :hearts: 
2018/04/16  | for of ,if else  | :hearts: 
2018/04/23  | observe Object  | :hearts: 
2018/04/30 | observe Array  | :hearts: 
# Knowledge
+ babel "preset-stage-2" only transform static prop
# virtual dom
- fragment
- create-virtual-dom
- dom-diff
- real-dom-patch
- life-cycle
# your own configuration(config)
    new Unar({
        ...
        config:{
            actionPrefix: "u-",
            attrPrefix: ":",
            evtPrefix: "@"
        }
    })
    file-suffix:'uar'

# parcel
+ npm install -g parcel-bundler
+ npm run dev:parcel
# webpack
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


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

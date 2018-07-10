# 提交

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
# 测试
## 单元测试
```
# Install Karma:
npm install karma --save-dev

# Install plugins that your project needs:
npm install karma-jasmine karma-chrome-launcher karma-firefox-launcher jasmine-core --save-dev

# Run Karma:
./node_modules/karma/bin/karma start
# Run Karma if installed global there is no instance
npm install karma -g
karma start

#Build instance
cd scripts/karma/unit/
karma init
# enter ... it will touch karma.conf.js
touch test.js
vim test.js
i
....
esc
:wq
it includes spec.js  test instance and src eg(packages)
# config karma.conf.js

# write scripts in package.json
"test:unit":"karma start scripts/karma/unit/karma.conf.js"
npm run test:unit
```
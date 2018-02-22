module.exports = {
    // 开启推荐配置信息
    //extends: "eslint:recommended",

    // 默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。
    // 如果你想要你所有项目都遵循一个特定的约定时，这将会很有用，但有时候会导致意想不到的结果。
    // 为了将 ESLint 限制到一个特定的项目，在你项目根目录下的 package.json 文件或者 .eslintrc.* 文件里的 eslintConfig 字段下设置 "root": true。
    // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
    root: true,
    // 脚本在执行期间访问的额外的全局变量
    // 当访问未定义的变量时，no-undef 规则将发出警告。如果你想在一个文件里使用全局变量，推荐你定义这些全局变量，这样 ESLint 就不会发出警告了。你可以使用注释或在配置文件中定义全局变量。
    globals: {
        "requirejs": true,
        "require": true,
        "define": true,
        "$": true,
        "window": true
    },
    // 设置解析器选项
    parserOptions: {
        sourceType: "module"
    },
    //设置插件
    // plugins: [
    //     "html"
    // ],

    /**
     * 启用的规则及各自的错误级别
     * 名称在报错信息的最后
     * "off" 或 0 - 关闭规则
     * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
     * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     *  例如："no-debugger": 2,  2级别（error）  红色   23:1  error  Unexpected "debugger" statement  no-debugger
     *       "no-console": 1,  1级别（warning） 黄色   24:1  warning  Unexpected console statement     no-console
     */
    rules: {
        // 警告用console
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // 警告用debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // 警告定义但未使用
        "no-unused-vars": "off",
        // 关闭要求箭头函数的参数使用圆括号(可以不带括号)
        "arrow-parens": "off",
        // "semi": ["error", "always"]
    },
    // 指定想启用的环境
    env: {
        browser: true,
        commonjs: true,
        es6: true
    }
}
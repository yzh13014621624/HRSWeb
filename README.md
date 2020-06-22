#  HRS 后台管理系统

## 一、简介
```
      后台管理的一个系统
```

***

## 二、环境规范

#### 开发环境：
所用技术|版本|
---|:--:|
nodeJs           | 6 +
typeScript       | 3.2.1
react            | 16.8.4
react-router-dom | 4.4.0
webpack          | 4.29.6
axios            | 0.18.0
antd             | 3.15.1
mobx             | 5.9.0
react-mobx       | 5.4.3

#### 开发工具：
> WebStorm   或  Visual studio code

## 三、构建方法

#### 克隆项目
> git clone git@code.aliyun.com:SJ56/thematrix.git  或者 配置 ssh key 密匙
#### 进入项目
> cd TheMatrix
#### 安装依赖项
> npm install
#### 以开发者方式运行 http://127.0.0.1:9000
> npm run dev
#### 打包构建
> npm run build

## 四、项目结构
```
*
├--config                                   # config系统配置文件
|  ├--index.ejs                               # ejs html 模板
|  ├--theme.js                                # antd 重置样式
|  ├--webapck.dev.js                          # webpack 开发环境配置
|  ├--webapck.prod.js                         # webpack 正式环境配置
|  └--webapck.web.js                          # webpack 公共环境配置
├--dist                                     # 存放webpack打包后的文件
├--src                                      # src 主目录
|  ├--assets                                  # 样式 图片 字体 存放
|  ├--components                              # 公共组件存放
|  ├--containers                              # 业务组件存放
|  |  ├--pages                                  # 不可复用组件
|  |  └--shared                                 # 可复用组件
|  ├--interface                               # 接口声明文件
|  ├--mock                                    # 模拟数据文件 MockJs
|  ├--server                                  # 后台接口 管理
|  ├--store                                   # 状态管理
|  ├--utils                                   # 存放工具
|  ├--index.tsx                               #入口文件
├--.editorconfig                            # eslint 配置
├--.commitlintrc.js                         # commitlint 配置文件
├--.eslintignore                            # eslint 忽略文件设置
├--.eslintrc.js                             # eslint 代码检查配置
├--.gitignore                               # git 不提交的界面
├--.huskyrc.js                              # husky 配置文件
├--.lintstagedrc.js                         # lint-staged 配置文件
├--package-lock.json
├--package.json                             # webpack 配置文件
├--README.md                                # 文档规范
└--tsconfig.json                            # typeScript 文件配置

```

## 五、命名规则

1. 文件夹名： 文件名全小写
2. 文件名： 采用驼峰式命名，例如：UserPage
3. 方法名： 采用驼峰式命名但是首字母小写，例如： userPage
4. 变量名:  变量名，尽量采用 方法名 命名的方式
5. 样式名称：防止对于不同界面上，取的名称不同，样式冲突，所以对应的名称为 改模块的名称开头，例如：登录模块，.login-xxxx
6. 文件命名： 界面名主界面 以Page 结尾，修改 Edit 新增 Add 详细 Detail 全局管理文件命名： mbox 开头 驼峰式的

## 六、注释规范
```

  文件注释：
  /**
    * @author minjie(作者)
    * @createTime 2019/04/03(创建时间)
    * @description (页面的内容介绍 主要是做什么的)
    * @copyright (所属的公司) Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
    */

  方法注释
  /**
   * 方法的介绍
   * @param url 参数
   */

  代码注释： 代码注释用 //  或者 /* (注释) */

```

## 七、接口请求

1. 接口使用 Axios 封装，对应位置：src\components\axios\Axios.ts
2. 对请求和返回进行了处理，请求头进行了设置
3. 使用方式： 在基础父组件中进行了引用  src\components\root\RootComponent.tsx
   this.$axios.request(URL类，参数等。。。。)

## 八、设计概要

1. 保存基本的token 状态，
对应的 axios 拦截， 路由拦截，全局的状态管理

## 九、用户代码片段

1. 编辑器按照下面条件调出 `User Snippets`，`File > perferences > User Snippets > typescriptreact.json`，双击打开
2. 将下面的内容复制黏贴到上述打开的 `json` 文件内
3. 在任意的 `.tsx` 后缀文件中，通过 `` 命令即可快速生成一个模板

## 十、GIT 提交规范

- 规范提交参考来自于 [@commitlint/cli](https://commitlint.js.org/#/) 及 [@commitlint/config-conventional](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/#%E7%BA%A6%E5%AE%9A%E5%BC%8F%E6%8F%90%E4%BA%A4%E8%A7%84%E8%8C%83)，关于 `git message` 提交的格式要求，参考[@commitlint/config-angular](https://www.npmjs.com/package/@commitlint/config-angular)；`commit message` 由 `Header、Body、Footer` 三部分组成，其中 `Header` 为每次 `commit` 必须；
  ```javascript
    <Header>: [<type>(<scope>): <subject>]
    // 空一行
    <Body>: [<body>]
    // 空一行
    <Footer>: [<Footer>]
  ```
- `Header` 由 `type(必需)`、 `scope(可选)`、 `subject(必需)` 三部分构成
  1. `type` 用来说明当前次 `commit` 的类型，一来便于在团队成员快速知晓每次提交的用途，二来可以通过 `git log/reflog [branch] [HEAD] --grep type` 来快速过滤出指定的 `commit type` 或者 `git log/reflog [branch] [HEAD] --format="自定义提交信息格式"` 来快速生成自定义的 `message` 格式，参考来源： [git log/format 指令的占位符写法](https://www.cnblogs.com/ayseeing/p/5029245.html)
    ```javascript
      // 基于 commitlint-angular 的 type 类型如下
      [
        'build',        // 改变构建流程，新增依赖库、工具等(例如 rollup，webpack 修改)
        'ci',           // 自动化流程(continuous integration)配置修改
        'chore',        // 构建过程或辅助工具的变动，一般指的非 src/test 内容的修改
        'docs',         // 文档变动，如 README, CHANGELOG, CONTRIBUTE 等内容的修改
        'feat',         // 新功能(feature)增加
        'fix',          // 修复 bug
        'perf',         // 优化相关，比如提升性能、体验
        'refactor',     // 代码重构，未新增任何功能和修复任何 bug
        'revert',       // 代码回滚
        'style',        // 修改了空格、格式缩进、逗号，不改变代码逻辑
                        // 不可理解为修改为(.css, .less, .sass, .styl, .stylus)文件
        'test'          // 新增或者修改测试文件，包括单元测试、集成测试
      ]
      // 示例新增一个表单校验功能的提交规范: (type: feat)
      git add -a && git commit -m 'feat: add form validator'
      // 示例修复 bug 规范: (type: fix)
      git add -a && git commit -m 'fix: fix some bugs'
    ```
  2. 如果 `commit type` 为 `revert`，表示代码回滚，必须要以 `revert:` 开头，后面跟着被撤销 Commit 的 Header，且 `Body` 的内容格式为固定的 `This reverts commit hash.`
    ```javascript
      // 回退到表单校验功能次提交
      git add -a && git commit -m 'revert: feat: add form validator
      
        This reverts commit 461f3s1fsd1fs1.'
      /**
      * 注意事项
      * 1. revert 需要的是目标 commit 的整个 Header
      * 2. Body 格式内容固定为 This reverts commit hash(目标 commit 的 hash 值)
      * / 
    ```
  3. `scope` 字段表示本次 `commit type` 影响的范围有多大，非必需，且被 `.commitlintrc.js > rules > scope-case` 字段约束，默认只支持小写
    ```javascript
      rules: {
        'type-case': [2, 'always', 'lower-case']
      }
      // 示例修复 get 请求功能: (type: fix(scope))
      git add -a && git commit -m 'fix(runtime): fix get request method'
    ```
  4. `subject` 指的是当前 `commit messag` 摘要信息，一般 <font color=red>50-70</font> 个字符，需注意开头小写，收尾不加任何符号
- `Body` 是对 `commit` 信息的详细描述，可以分为多行，在 `git bash` 或者 `VScode > Terminal` 中多行提交 `body` 的操作为下方所释，<font color=red>**IMPORTANT**</font> 在 `VScode > Terminal` 提交 `message` 通常会产生 <font color=#FF8C00>`body must have leading blank line [body-leading-blank]`</font> 的警告，因为终端会将空行过滤掉，请使用 `git bash` 来提交
    ```javascript
      1. git add -a
      2. git commit -m "fix(runtime): fix get request method

        Further paragraphs come after blank lines
        - Bullet points are okay, too
        - Use a hanging indent "
      /**
      * 注意事项
      * 1. 所有提交信息均需要在单引号('')或者双引号("")里面包裹，换行前不要带上结束引号
      * 2. Header 和 Body 之间需要空一行，为了使空行生效，
      *    即在 git log 查看的时候有效果，请使用 git bash 来提交 message
      * 3. 提交时应该详细描述代码提交的动机，以及变动
      * / 
    ```
- `Footer` 出现的情况只适用于下面两种，其他均不考虑
  1. <font color=red>不兼容的代码迭代</font>, 如果当前代码与上一个版本不兼容，则 `Footer` 部分以 `BREAKING CHANGE` 开头，后面是对变动的描述、以及变动理由和迁移方法
  2. <font color=red>关闭 issues</font>
    ```javascript
      // 如果当前 commit 针对某个 issue，那么可以在 Footer 部分关闭这个 issue
      git add . && git commit -m 'fix: fix some bugs

      Body messages

      Closes #123 '

      // 也可以一次关闭多个 issue
      git add . && git commit -m 'fix: fix some bugs

      Body messages

      Closes #123, #234, #345 '
    ```
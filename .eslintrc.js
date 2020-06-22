module.exports = {
  "root": true,
  "extends": "standard",
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "globals": {
    "__static": true,
    "document": true,
    "navigator": true,
    "window":true,
    "node":true
  },
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "@typescript-eslint",
    "typescript",
    "react"
  ],
  "rules":{
    "arrow-parens": "off",
    "no-useless-return":"off",
    "generator-star-spacing": "off",
    "no-debugger": "off",
    "no-extra-semi": "error",
    "no-unreachable": "error",
    "no-useless-return": "error",
    "no-dupe-class-members": "off",
    "no-useless-constructor": "off",
    "no-unused-vars": "off",
    "camelcase": [
      2,
      {"allow": ["UNSAFE_componentWillMount", "UNSAFE_componentWillReceiveProps", "UNSAFE_componentWillUpdate"]}
    ],
    // @fixable 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
    "eqeqeq": [
      'error',
      'always',
      {
        null: 'ignore'
      }
    ],
    // 类和接口的命名必须遵守帕斯卡命名法，比如 PersianCat
    'typescript/class-name-casing': 'error'
  }
}

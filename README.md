# 小鹤音形Mac练习

> 基于 electron-vue 开发

![](./static/product.png)

> 输入框中修改完成后，回车提交或点击提交

#### Build Setup

``` bash
# install dependencies
yarn
nvm exec 14.5.0 npm i
nvm exec 14.5.0 npm run build

# Mac M1
PYTHON_PATH=/usr/bin/python3 nvm exec 14.5.0 npm run build

# hotfix
# node_modules/dmg-builder/vendor/dmgbuild/core.py
```py
# +++
try:
    reload
except NameError:
    from importlib import reload
# ---

reload(sys)  # Reload is a hack
-sys.setdefaultencoding('UTF8')
+# sys.setdefaultencoding('UTF8')
```


# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build


# lint all JS/Vue component files in `src/`
yarn run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[45a3e22](https://github.com/SimulatedGREG/electron-vue/tree/45a3e224e7bb8fc71909021ccfdcfec0f461f634) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

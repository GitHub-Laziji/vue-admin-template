# Vue Admin Template


vue管理端模板


使用`element-ui`

封装了`无限多级菜单`, `通用增删改查页面模板` 等组件


## 使用
```
npm install -g @vue/cli
npm install -g @vue/cli-init
vue init GitHub-Laziji/vue-admin-template admin
```

## 组件
组件参数

### 通用增删改查页面模板
通过简单的配置生成增删改查页面的功能
#### 使用示例
```html
<template>
  <div>
    <general-table :list="list" :columns="columns"></general-table>
  </div>
</template>
```

```js
{
  data(){
    return {
      columns: [
        {
          title: "ID",
          name: "id",
          table: {
            width: 100,
            render: record =>
              function(h) {
                return h("h1", record.id);
              }
          }
        },
        {
          title: "COL1",
          name: "col1",
          table: true
        },
        {
          title: "COL2",
          name: "col2",
          query: true,
          table: {
            textLengthLimit: true
            width: 100,
          }
        }
      ]
    }
  },
  methods: {
    list(params, page, limit) {
      return new Promise((resolve, reject) => {
        let list = [];
        for (let i = 1; i <= 10; i++) {
          list.push({
            id: i,
            col1: "col1-"+i,
            col2: "colcolcolcolcol2-"+i
          });
        }
        resolve({
          total: list.length,
          list: list
        });
      });
    }
  }
}
```
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
    <general-table :list="list" :save="save" :columns="columns"></general-table>
  </div>
</template>
```

```js
{
  data(){
    return {
      columns: [
        {
          title: "ID", //标题
          name: "id", //字段名(key) 不可重复
          table: { //显示在表格中的配置, 使用默认配置可以简单地使用 table: true
            width: 100, //表格宽度, 类似的属性有 maxWidth, minWidth
            render: record => //高度自定义表格内容, 详细使用查看Vue官方文档 https://cn.vuejs.org/v2/guide/render-function.html
              function(h) {
                return h("h1", record.id);
              }
          }
        },
        {
          title: "COL1",
          name: "col1",
          table: true,
          form: {
            type: "textarea",
            save: true,
            update: false
          }
        },
        {
          title: "自定义列",
          name: "customize",
          table: {
            render:(record)=>
              function(h){
                return h("div",record.col1+" "+record.col2);
              }
          }
        },
        {
          title: "COL2",
          name: "col2",
          query: {  //是否允许查询, 使用默认配置可以简单地使用 query: true
            type: "input", //可选select, input, 选择select需配置valueMapping
            name: "col2" //自定义查询参数名, 在list()回调中接收, 例如字段允许模糊查询可设name为'col2.like'然后在list()中自行处理
          },
          table: {
            textLengthLimit: true //表格内容过长自动隐藏
            width: 100,
          },
          //valueMapping: () => { ... }
          //form: { save:..., update:... }
        },
        {
          title: "操作", //name为空的列为最后一行操作栏
          table: {
            width: 120
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
    },
    save(form) {
      return new Promise((resolve, reject) => {
        //this.$ttp.post(...)
        resolve();
      }
    }
  }
}
```
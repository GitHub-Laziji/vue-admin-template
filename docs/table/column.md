# 表格字段配置

```js
columns:[...Column]
```

# Column

|  属性   | 类型  |    描述|
|  :----:   | :----:   | :----:  |
| title  | `string` |  字段标题  |
| name  | `string` |  字段key, 唯一不可重复 |
| query | `QueryConfig,boolean` | 查询配置, 可只填`true`, 则在查询栏显示默认`key`为`name`的`input`类型查询框 |  
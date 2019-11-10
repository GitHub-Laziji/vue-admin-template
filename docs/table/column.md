# 表格字段配置

```js
columns:[...Column]
```

# Column

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
| :----: | :----: | :----: | :----: | :----: |
| title | 字段标题 | `string` | — | — |
| name  | 字段key, 唯一不可重复 | `string`  | — | — |
| query | 查询配置, 可只填`true`, 则在查询栏显示默认`key`为`name`的`input`类型查询框  | `QueryConfig, boolean` | — | `false` |
| table | 表格字段配置, 可只填`true`, 则在表格中显示`row[name]`的值 | `TableConfig, boolean` | — | `false` |
| form  | 表单配置, 配置添加或修改表单中的显隐, 输入框类型等  | `FormConfig` | — | `false` |
| valueMapping | 关系映射, 用于其他属性的显示或选择 | `Function()/Promise`  | — | — |


# QueryConfig

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
| :----: | :----: | :----: | :----: | :----: |
| type | 查询输入框类型, 选择`select`需要给出关系映射`valueMapping` | `string` | `input / select` | `input` |
| name | 查询关联的键 | `string` | — | `Column.name` |


# TableConfig

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
| :----: | :----: | :----: | :----: | :----: |
| width | 固定宽度 | `number` | — | — |
| maxWidth | 最大宽度 | `number` | — | — |
| minWidth | 最小宽度, 剩余宽度会在没设置宽度属性或设置了最小宽度的列中按比例分配 | `number` | — | — |
| type | 表格字段显示类型 | `string` | `text / tag / datetime` | `text` |
| typeExtend | 类型扩展参数, 对每个类型的参数扩展,`tag`时可以设置`{type: { success: 'success', error: 'danger'}, effect: 'plain'}` | `object` | — | — |
| filter | 值过滤器, 作用在`valueMapping`之后 | `Function({value, row})/object` | — | — |
| textLengthLimit | 信息过长隐藏 | `boolean` | — | — |
| render | 自定义单元格显示, 设置后`type, filter`等属性失效 | `Function({row})/Element` | — | — |


# FormConfig

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
| :----: | :----: | :----: | :----: | :----: |
| type | 表单输入框类型, 选择`select`需要给出关系映射`valueMapping` | `string` | `input / select / textarea / password` | `input` |
<template>
  <div>
    <div :class="$style.toolbar">
      <div :class="$style.d_flex">
        <el-button :class="$style.tool_button_left" @click="openSave" size="medium" v-if="save">
          <i class="el-icon-plus"></i>&nbsp;添加
        </el-button>
        <slot name="toolbar"></slot>
      </div>
      <div :class="$style.d_flex">
        <template v-if="hasSearchItem">
          <template v-for="item of columns">
            <template v-if="item.query&&item.name">
              <el-select
                :class="$style.tool_input"
                v-model="query.params[item.query.name || item.name]"
                :placeholder="`${item.title}`"
                :key="item.name"
                v-if="item.query.type=='select'&&mapping[item.name]"
                clearable
                filterable
                @clear="() => query.params[item.query.name || item.name] = null"
                size="medium"
              >
                <el-option
                  v-for="opt in mapping[item.name].records"
                  :key="opt.key"
                  :label="opt.value"
                  :value="opt.key"
                ></el-option>
              </el-select>
              <el-input
                :class="$style.tool_input"
                v-model="query.params[item.query.name || item.name]"
                :placeholder="`${item.title}`"
                :key="item.name"
                size="medium"
                v-else
              ></el-input>
            </template>
          </template>
          <el-tooltip content="查询" placement="top">
            <el-button
              :class="$style.tool_button_right"
              icon="el-icon-search"
              @click="search"
              size="medium"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="刷新" placement="top">
            <el-button
              :class="$style.tool_button_right"
              icon="el-icon-refresh"
              @click="refresh"
              size="medium"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="清空查询参数" placement="top">
            <el-button
              :class="$style.tool_button_right"
              icon="el-icon-refresh-left"
              @click="reset"
              size="medium"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </div>
    </div>
    <el-table 
      :class="$style.table" 
      :data="data.records"
      :span-method="settings&&settings.tableSpanMethod"
      :summary-method="settings&&settings.tableSummaryMethod"
      v-loading="dataLoading" 
      border stripe>
      <template v-for="item of columns">
        <el-table-column
          :label="item.title"
          :min-width="item.table.minWidth"
          :width="item.table.width"
          :key="item.name"
          v-if="item.name&&item.table"
          :show-overflow-tooltip="item.table.textLengthLimit"
          :align="item.table.align"
        >
          <template slot-scope="scope">
            <component v-if="item.table.render" :is="{name:item.name,render:item.table.render(scope.row)}"></component>
            <span
              v-else-if="isNull(rowFilter(scope.row,item))&&isNull(scope.row[item.name])"
              style="color:#909399"
            >
              <i>NULL</i>
            </span>
            <template v-else-if="item.table.type==='tag'">
              <el-tag
                v-if="item.table.typeExtend"
                :type="item.table.typeExtend.type&&item.table.typeExtend.type[rowFilter(scope.row,item)]"
                :effect="item.table.typeExtend.effect"
              >\{{ rowFilter(scope.row,item) }}</el-tag>
              <el-tag v-else>\{{ rowFilter(scope.row,item) }}</el-tag>
            </template>
            <span v-else-if="item.table.type==='datetime'">
              <i class="el-icon-time"></i>
              \{{ rowFilter(scope.row,item) | datetime}}
            </span>
            <span v-else>\{{ rowFilter(scope.row,item) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="operatorColumn.table"
        :label="operatorColumn.title || '操作'"
        :min-width="operatorColumn.table.minWidth"
        :width="operatorColumn.table.width"
        :align="operatorColumn.table.align"
      >
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top" v-if="update">
            <el-button icon="el-icon-edit" @click="openUpdate(scope.row)" size="medium" circle></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" v-if="remove">
            <el-button
              icon="el-icon-delete"
              @click="removeRecord(scope.row)"
              circle
              size="medium"
              :loading="scope.row.REMOVE_LOADING"
            ></el-button>
          </el-tooltip>
          <slot name="tableAction" v-bind:row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div :class="$style.pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[5,10,20]"
        :page-size="query.limit"
      ></el-pagination>
    </div>

    <el-dialog title="添加信息" :visible.sync="saveForm.visible" width="550px">
      <el-form :model="saveForm.form" ref="saveForm" label-width="100px">
        <template v-for="item of columns">
          <template v-if="item.form&&item.form.save&&item.name">
            <el-form-item
              :label="item.title"
              :key="item.name"
              :prop="item.name"
              :rules="item.form.rules || item.form.required && [{ required: item.form.required, message: `请${item.form.type==='select'?'选择':'输入'}${item.title}`, trigger: 'change' }]"
            >
              <el-select
                v-model="saveForm.form[item.name]"
                :placeholder="`请选择${item.title}`"
                v-if="item.form.type==='select'&&mapping[item.name]"
                clearable
                filterable
              >
                <el-option
                  v-for="opt in mapping[item.name].records"
                  :key="opt.key"
                  :label="opt.value"
                  :value="opt.key"
                ></el-option>
              </el-select>
              <el-input
                type="textarea"
                v-model="saveForm.form[item.name]"
                :placeholder="`请输入${item.title}`"
                v-else-if="item.form.type==='textarea'"
              ></el-input>
              <el-input
                type="password"
                v-model="saveForm.form[item.name]"
                :placeholder="`请输入${item.title}`"
                v-else-if="item.form.type==='password'"
              ></el-input>
              <el-input v-model="saveForm.form[item.name]" :placeholder="`请输入${item.title}`" v-else></el-input>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <span slot="footer">
        <div style="display:flex;justify-content: flex-end;">
          <slot name="saveFormAction" v-bind:form="saveForm.form"></slot>
          <slot name="formAction" v-bind:form="saveForm.form"></slot>
          <el-button @click="saveForm.visible = false">取消</el-button>
          <el-button type="primary" @click="submitSave" :loading="saveForm.loading">保存</el-button>
        </div>
      </span>
    </el-dialog>

    <el-dialog title="更新信息" :visible.sync="updateForm.visible" width="550px">
      <el-form :model="updateForm.form" ref="updateForm" label-width="100px">
        <template v-for="item of columns">
          <template v-if="item.form&&item.form.update&&item.name">
            <el-form-item
              :label="item.title"
              :key="item.name"
              :prop="item.name"
              :rules="item.form.rules || item.form.required && [{ required: item.form.required, message: `请${item.form.type==='select'?'选择':'输入'}${item.title}`, trigger: 'change' }]"
            >
              <el-select
                v-model="updateForm.form[item.name]"
                :placeholder="`请选择${item.title}`"
                :disabled="item.form.update.disabled"
                v-if="item.form.type==='select'&&mapping[item.name]"
                clearable
                filterable
              >
                <el-option
                  v-for="opt in mapping[item.name].records"
                  :key="opt.key"
                  :label="opt.value"
                  :value="opt.key"
                ></el-option>
              </el-select>
              <el-input
                type="textarea"
                :disabled="item.form.update.disabled"
                v-model="updateForm.form[item.name]"
                :placeholder="`请输入${item.title}`"
                v-else-if="item.form.type==='textarea'"
              ></el-input>
              <el-input
                type="password"
                :disabled="item.form.update.disabled"
                v-model="updateForm.form[item.name]"
                :placeholder="`请输入${item.title}`"
                v-else-if="item.form.type==='password'"
              ></el-input>
              <el-input
                :disabled="item.form.update.disabled"
                v-model="updateForm.form[item.name]"
                :placeholder="`请输入${item.title}`"
                v-else
              ></el-input>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <span slot="footer">
        <div style="display:flex;justify-content: flex-end;">
          <slot name="updateFormAction" v-bind:form="updateForm.form"></slot>
          <slot name="formAction" v-bind:form="updateForm.form"></slot>
          <el-button @click="updateForm.visible = false">取消</el-button>
          <el-button type="primary" @click="submitUpdate" :loading="updateForm.loading">更新</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    settings: {
      type: Object
    },
    list: {
      type: Function,
      required: true
    },
    save: {
      type: Function
    },
    update: {
      type: Function
    },
    remove: {
      type: Function
    },
    initQueryParams: {
      type: Object
    }
  },
  data() {
    return {
      dataLoading: false,
      hasSearchItem: false,
      operatorColumn: {},
      mapping: {},
      data: {
        total: 0,
        records: []
      },
      query: {
        limit: 10,
        page: 1,
        params: {}
      },
      detail: {
        visible: false,
        data: {}
      },
      saveForm: {
        visible: false,
        loading: false,
        form: {}
      },
      updateForm: {
        visible: false,
        loading: false,
        form: {}
      }
    };
  },
  mounted() {
    if (this.initQueryParams) {
      for (let k in this.initQueryParams) {
        this.query.params[k] = this.initQueryParams[k];
      }
    }
    let methods = [];
    let names = [];
    for (let col of this.columns) {
      if (typeof col.valueMapping === "function") {
        methods.push(col.valueMapping());
        names.push(col.name);
      }
      if (col.query) {
        this.hasSearchItem = true;
      }
      if (!col.name) {
        this.operatorColumn = col;
      }
    }
    this.dataLoading = true;
    this.$set(this, "dataLoading", true);
    Promise.all([
      Promise.all(methods),
      this.list(this.query.params, this.query.page, this.query.limit)
    ])
      .then(results => {
        let mappingResults = results[0];
        for (let i in mappingResults) {
          let map = {};
          for (let item of mappingResults[i]) {
            map[item.key] = item.value;
          }
          this.$set(this.mapping, names[i], {
            records: mappingResults[i],
            map: map
          });
        }

        this.data.total = results[1].total || 0;
        this.data.records = results[1].records || [];
      })
      .finally(() => (this.dataLoading = false));
  },
  methods: {
    isNull(value) {
      return value === null || value === undefined;
    },
    rowFilter(record, column) {
      let value = record[column.name];
      if (column.valueMapping) {
        value = this.mapping[column.name].map[record[column.name]];
      }
      if (typeof column.table.filter === "function") {
        value = column.table.filter(value, record);
      }
      return value;
    },
    search() {
      this.dataLoading = true;
      this.query.page = 1;
      this.list(this.query.params, this.query.page, this.query.limit)
        .then(result => {
          this.data.total = result.total || 0;
          this.data.records = result.records || [];
        })
        .finally(() => (this.dataLoading = false));
    },
    refresh() {
      this.dataLoading = true;
      this.list(this.query.params, this.query.page, this.query.limit)
        .then(result => {
          this.data.total = result.total || 0;
          this.data.records = result.records || [];
        })
        .finally(() => (this.dataLoading = false));
    },
    reset() {
      this.dataLoading = true;
      this.query.page = 1;
      this.query.params = {};
      this.list(this.query.params, this.query.page, this.query.limit)
        .then(result => {
          this.data.total = result.total || 0;
          this.data.records = result.records || [];
        })
        .finally(() => (this.dataLoading = false));
    },
    handleSizeChange(value) {
      this.query.limit = value;
      this.refresh();
    },
    handleCurrentChange(value) {
      this.query.page = value;
      this.refresh();
    },
    openSave() {
      this.$nextTick(() => {
        this.$refs["saveForm"] && this.$refs["saveForm"].resetFields();
      });
      this.saveForm.form = {};
      this.saveForm.visible = true;
    },
    submitSave() {
      this.$refs["saveForm"].validate(valid => {
        if (valid) {
          this.saveForm.loading = true;
          this.save(this.saveForm.form)
            .then(() => {
              this.$message.success("添加成功");
              this.saveForm.visible = false;
              this.refresh();
            })
            .finally(() => (this.saveForm.loading = false));
        }
      });
    },
    openUpdate(record) {
      this.updateForm.form = JSON.parse(JSON.stringify(record));
      this.updateForm.visible = true;
    },
    submitUpdate() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          this.updateForm.loading = true;
          this.update(this.updateForm.form)
            .then(() => {
              this.$message.success("更新成功");
              this.updateForm.visible = false;
              this.refresh();
            })
            .finally(() => (this.updateForm.loading = false));
        }
      });
    },
    removeRecord(record) {
      this.$confirm("确认删除这条数据?").then(() => {
        this.$set(record, "REMOVE_LOADING", true);
        this.remove(record)
          .then(() => {
            this.$message.success("删除成功");
            this.refresh();
          })
          .finally(() => this.$set(record, "REMOVE_LOADING", false));
      });
    }
  }
};
</script>

<style module>
.tool_input {
  width: 150px !important;
  margin-left: 8px !important;
}
.tool_button_right {
  margin-left: 8px !important;
}
.tool_button_left {
  margin-right: 8px !important;
}
.d_flex {
  display: flex;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table {
  width: 100%;
  margin-top: 16px;
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

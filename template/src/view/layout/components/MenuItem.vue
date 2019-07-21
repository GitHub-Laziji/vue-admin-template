<template>
  <el-submenu :index="path" v-if="data.children">
    <template slot="title">
      <i :class="`el-icon-${data.meta&&data.meta.icon || 'setting'}`"></i>
      <span slot="title">\{{data.meta&&data.meta.title || data.path}}</span>
    </template>
    <menu-item v-for="item of data.children" :key="item.path" :data="item" :prefix-path="path"></menu-item>
  </el-submenu>
  <el-menu-item :index="path" v-else>
    <i :class="`el-icon-${data.meta&&data.meta.icon || 'setting'}`"></i>
    <span slot="title">\{{data.meta&&data.meta.title || data.path}}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "menu-item",
  props: {
    prefixPath: {
      type: String,
      default: ""
    },
    data: Object
  },
  data() {
    return {
      path: this.prefixPath + "/" + this.data.path
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style>
</style>

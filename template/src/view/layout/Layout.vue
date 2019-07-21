<template>
  <div id="app-layout">
    <el-container style="height:100vh">
      <el-aside width="auto">
        <el-menu
          style="height:100%"
          :collapse="collapse"
          class="el-menu-vertical"
          :router="true"
          :default-active="activePath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <div :class="$style.logo">
            <i class="el-icon-s-management" style="font-size:1.2rem"></i>
            <span
              v-show="!collapse"
              style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden;margin-left:4px"
            >VUE ADMIN</span>
          </div>
          <menu-item v-for="item of menuRoutes" :key="item.path" :data="item"></menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header :class="$style.header">
          <i
            :class="{
              [$style.trigger]:true,
              'el-icon-s-fold':!collapse,
              'el-icon-s-unfold':collapse
            }"
            @click="collapse = !collapse"
          ></i>

          <el-dropdown @command="handleDropdownCommand">
            <span :class="$style.avatar">
              <el-avatar icon="el-icon-user-solid"></el-avatar>
              <span style="padding: 8px">Admin</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout" icon="el-icon-top-right">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main style="background:#f8f8f8">
          <div style="height:32px">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                :to="index<breadcrumb.length?{ path: item.path }:null"
                v-for="(item,index) of breadcrumb"
                :key="index"
              >
                <i :class="`el-icon-${item.icon}`" v-if="item.icon"></i>
                \{{item.title}}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div :class="$style.main">
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { menuRoutes } from "../../router";
import MenuItem from "./components/MenuItem";
import { Http } from "../../common/http";
export default {
  components: {
    MenuItem
  },
  data() {
    return {
      menuRoutes,
      collapse: false,
      activePath: this.$route.path,
      breadcrumb: []
    };
  },
  mounted() {
    this.setBreadcrumb();
  },
  watch: {
    $route() {
      this.activePath = this.$route.path;
      this.setBreadcrumb();
    }
  },
  methods: {
    setBreadcrumb() {
      this.breadcrumb = [];
      this.findBreadcrumb(this.menuRoutes, this.$route.path.split("/"), 1);
    },
    findBreadcrumb(routes, paths, i) {
      if (!routes) {
        return;
      }
      for (let item of routes) {
        if (item.path == paths[i]) {
          this.breadcrumb.push({
            path: paths.slice(0, i + 1).join("/"),
            title: (item.meta && item.meta.title) || item.path,
            icon: (item.meta && item.meta.icon) || "setting"
          });
          this.findBreadcrumb(item.children, paths, i + 1);
          break;
        }
      }
    },
    handleDropdownCommand(command) {
      switch (command) {
        case "logout":
          this.logout();
          return;
      }
    },
    logout() {
      Http.post("/logout").then(() => {
        this.$toLogin();
      });
    }
  }
};
</script>

<style module>
.logo {
  background: rgba(255, 255, 255, 0.2);
  margin: 10px;
  border-radius: 5px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: #fff;
}
.header {
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trigger {
  font-size: 24px;
  padding: 0 8px;
  cursor: pointer;
  transition: color 0.3s;
}
.main {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow-y: auto;
  background: #fff;
  padding: 16px;
  box-sizing: border-box;
  height: calc(100% - 32px);
}
.main::-webkit-scrollbar {
  width: 0 !important;
}
.avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.scroll {
  height: 100%;
  width: 100%;
}
</style>

<style>
#app-layout .el-menu-vertical:not(.el-menu--collapse) {
  width: 250px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

li.el-menu-item.is-active {
  background-color: rgba(67, 74, 80, 0.6) !important;
}
</style>
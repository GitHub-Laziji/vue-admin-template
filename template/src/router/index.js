import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


export const menuRoutes = [{
  path: 'system',
  redirect: "/system/user",
  component: () => import('../view/layout/components/EmptyRouterView'),
  meta: {
    title: "系统管理",
    icon: "setting"
  },
  children: [{
    path: 'user',
    meta: {
      title: "用户管理",
      icon: "user"
    },
    component: () => import('../view/User')
  }]
}]

export const routes = [{
  path: '/',
  redirect: "/system",
  component: () => import('../view/layout/Layout'),
  children: menuRoutes
}, {
  path: "/404",
  component: () => import('../view/error/Error404')
}, {
  path: "*",
  redirect: '/404'
}]

export default new VueRouter({
  routes
})
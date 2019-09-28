import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FormatUtils from './common/format_utils'
import ApiUtils from './common/api_utils'
import GeneralTable from "./view/components/GeneralTable"
import './plugins/element.js'{{#vcharts}}
import './plugins/vcharts'{{/vcharts}}

Vue.config.productionTip = false

Vue.component('general-table', GeneralTable);

try {
  Vue.prototype.$env = require(`./config/env.${process.env.NODE_ENV}`);
} catch{

}

Vue.prototype.$toLogin = () => {
  location.href = Vue.prototype.$env.loginUrl;
}

Vue.prototype.$http = require("./common/http").Http;

Vue.prototype.$utils = {
  format: FormatUtils,
  api: ApiUtils
}

for (let methodName in FormatUtils) {
  let method = FormatUtils[methodName];
  if (typeof method === 'function') {
    Vue.filter(methodName, method);
  }
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

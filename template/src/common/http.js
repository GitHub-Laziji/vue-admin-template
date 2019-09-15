import axios from 'axios'
import Vue from 'vue'

const service = axios.create({
  baseURL: Vue.prototype.$env.baseRequestUrl,
  timeout: 15000
});

service.interceptors.response.use(
  response => {
    let data = response.data;
    switch (data.code) {
      case 200:
        return data.data;
      case 501:
        Vue.prototype.$toLogin();
        break;
      case 502:
        Vue.prototype.$message.error('权限不足');
        break;
      case 503:
        Vue.prototype.$message.error('服务器响应失败');
        break;
      case 510:
        Vue.prototype.$message.error('添加数据失败');
        break;
      case 511:
        Vue.prototype.$message.error('删除数据失败');
        break;
      case 512:
        Vue.prototype.$message.error('修改数据失败');
        break;
      case 513:
        Vue.prototype.$message.error('查询数据失败');
        break;
      case 514:
        Vue.prototype.$message.error('参数错误');
        break;
      case 515:
        Vue.prototype.$message.error('用户名或密码错误');
        break;
      case 516:
        Vue.prototype.$message.error('验证码错误');
        break;
      default:
        Vue.prototype.$message.error(data.message || "请求失败");
        break;
    }
    return Promise.reject('error')
  },
  error => {
    if (/timeout of \d+ms exceeded/.test(error.message)) {
      Vue.prototype.$message.error("请求超时");
    } else {
      Vue.prototype.$message.error("请求异常");
    }
    return Promise.reject('error')
  }
);
export class Http {

  static get(url, param) {
    return service({
      url: url,
      data: param,
      method: "get"
    });
  }

  static post(url, param) {
    return service({
      url: url,
      data: param || {},
      method: "post"
    });
  }
}
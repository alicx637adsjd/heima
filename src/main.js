import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import "./assets/base.css"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios';
import JSONbig from "json-bigint";

Vue.prototype.$axios = axios;
axios.defaults.baseURL = "http://ttapi.research.itcast.cn/";

axios.defaults.transformResponse = [
  function(data){
    try{
      return JSONbig.parse(data);
    }catch(error){
      return data;
    }
  }
];

import router from './router/'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

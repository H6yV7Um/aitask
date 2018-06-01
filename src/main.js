import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'

import './assets/styles/global.css'

Vue.config.debug = true;//开启错误提示
Vue.config.productionTip = false


export const app = new Vue({
    el: "#app",
    router: router,
    render: h => h(App),
});
  
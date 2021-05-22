import Vue from 'vue'
import App from './App.vue'
import "@/plugins/mixins";

import store from './store'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
const opts = {}

export default new Vuetify(opts)

export const eventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  vuetify : new Vuetify(),
  store,
  render: h => h(App),
}).$mount('#app')

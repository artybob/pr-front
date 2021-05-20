import Vue from 'vue'
import App from './App.vue'
import "@/plugins/mixins";

import store from './store'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
const opts = {}

export default new Vuetify(opts)

Vue.config.productionTip = false
Vue.use(VueLodash, { lodash: lodash })

new Vue({
  vuetify : new Vuetify(),
  store,
  render: h => h(App),
}).$mount('#app')

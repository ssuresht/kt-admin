import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import '@/plugins/observe-visibility'
import '@/plugins/vee-validate'
import '@/mixins/index'
import PageTitle from '@/components/ui/PageTitle'
const moment = require('moment')
require('moment/locale/ja')
import VueMask from 'v-mask'
import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)
Vue.use(VueMask)

require('@/services/api')
Vue.use(require('vue-moment'), {
  moment
})

Vue.component('PageTitle', PageTitle)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')

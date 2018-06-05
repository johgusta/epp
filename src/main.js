import Vue from 'vue';
import VueMDCButton from 'vue-mdc-adapter/dist/button';
import VueMDCDialog from 'vue-mdc-adapter/dist/dialog';
import VueMDCFAB from 'vue-mdc-adapter/dist/fab';
import VueMDCList from 'vue-mdc-adapter/dist/list';
import VueMDCTextfield from 'vue-mdc-adapter/dist/textfield';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VueMDCButton);
Vue.use(VueMDCDialog);
Vue.use(VueMDCFAB);
Vue.use(VueMDCList);
Vue.use(VueMDCTextfield);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

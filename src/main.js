import Vue from 'vue';

// import VueFirestore from 'vue-firestore';

import VueMDCButton from 'vue-mdc-adapter/dist/button';
import VueMDCDialog from 'vue-mdc-adapter/dist/dialog';
import VueMDCFAB from 'vue-mdc-adapter/dist/fab';
import VueMDCList from 'vue-mdc-adapter/dist/list';
import VueMDCTextfield from 'vue-mdc-adapter/dist/textfield';

import FirebaseHelper from '@/js/firebaseHelper';

import App from './App.vue';
import router from './router';
import store, { types } from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

// Vue.use(VueFirestore);

Vue.use(VueMDCButton);
Vue.use(VueMDCDialog);
Vue.use(VueMDCFAB);
Vue.use(VueMDCList);
Vue.use(VueMDCTextfield);

new Vue({
  router,
  store,
  // firestore() {
  //   return {};
  // },
  render: h => h(App),
}).$mount('#app');

FirebaseHelper.onAuthStateChanged((user) => {
  if (user) {
    console.log('user is logged in');
    store.commit(types.LOGIN_USER, user.displayName);
  } else {
    console.log('log out user and updated state');
    store.commit(types.LOGOUT_USER);
    router.push({ name: 'home' });
  }
});

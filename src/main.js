import Vue from 'vue';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

import VueFirestore from 'vue-firestore';

import VueMDCButton from 'vue-mdc-adapter/dist/button';
import VueMDCDialog from 'vue-mdc-adapter/dist/dialog';
import VueMDCFAB from 'vue-mdc-adapter/dist/fab';
import VueMDCList from 'vue-mdc-adapter/dist/list';
import VueMDCTextfield from 'vue-mdc-adapter/dist/textfield';

import ApiService from '@/js/apiService';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: 'AIzaSyDbDHT11Hha_paOSzu35XcejJ-31qlo8jc',
  authDomain: 'english-paper-piecing.firebaseapp.com',
  databaseURL: 'https://english-paper-piecing.firebaseio.com',
  projectId: 'english-paper-piecing',
  storageBucket: 'english-paper-piecing.appspot.com',
  messagingSenderId: '36350522881',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firestore = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

ApiService.setFirestoreDb(firestore);

const CLIENT_ID =
  '36350522881-c9nukpad4d36fqvrsklm1e7kup7uqm6m.apps.googleusercontent.com';
const uiConfig = {
  signInFlow: 'redirect',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: 'https://accounts.google.com',
      clientId: CLIENT_ID,
    },
  ],
  callbacks: {
    // Called when the user has been successfully signed in.
    // Avoid redirect after sign in
    signInSuccessWithAuthResult() {
      return false;
    },
  },
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

Vue.use(VueFirestore);

Vue.prototype.$firebase = firebase;
Vue.prototype.$authUi = ui;
Vue.prototype.$authUiConfig = uiConfig;


Vue.use(VueMDCButton);
Vue.use(VueMDCDialog);
Vue.use(VueMDCFAB);
Vue.use(VueMDCList);
Vue.use(VueMDCTextfield);

let app;
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    new Vue({
      router,
      store,
      firestore() {
        return {
          patterns: firestore.collection('patterns'),
        };
      },
      render: h => h(App),
    }).$mount('#app');
  }

  if (user) {
    store.commit('loginUser', user.displayName);
  } else {
    store.commit('logoutUser');
    router.push({ name: 'library' });
  }
});

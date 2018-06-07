import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import LoginCallback from './views/LoginCallback.vue';
import Library from './views/Library.vue';
import Pattern from './views/Pattern.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login/callback',
      name: 'login-callback',
      component: LoginCallback,
    },
    {
      path: '/library',
      name: 'library',
      component: Library,
    },
    {
      path: '/pattern/:id',
      name: 'pattern',
      component: Pattern,
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'home' && !firebase.auth().currentUser) {
//     next({ name: 'home' });
//   } else {
//     next();
//   }
// });

export default router;

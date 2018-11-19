import Vue from 'vue';
import Router from 'vue-router';
import Start from './views/Start.vue';
import Login from './views/Login.vue';
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
      component: Start
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
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
    {
      path: '*',
      redirect: '/'
    }
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

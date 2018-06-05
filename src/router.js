import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Library from './views/Library.vue';
import Pattern from './views/Pattern.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: About,
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

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userFullName: localStorage.getItem('currentUserFullName'),
  },
  mutations: {
    loginUser(state, userFullName) {
      state.userFullName = userFullName;
      localStorage.setItem('currentUserFullName', userFullName);
    },
  },
  actions: {

  },
});

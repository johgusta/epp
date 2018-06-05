import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const USERNAME_KEY = 'currentUserFullName';

export default new Vuex.Store({
  state: {
    userFullName: localStorage.getItem(USERNAME_KEY),
  },
  mutations: {
    loginUser(state, userFullName) {
      state.userFullName = userFullName;
      localStorage.setItem(USERNAME_KEY, userFullName);
    },
    logoutUser(state) {
      state.userFullName = undefined;
      localStorage.removeItem(USERNAME_KEY);
    },
  },
  actions: {

  },
});

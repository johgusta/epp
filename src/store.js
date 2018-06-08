import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

import PatternHandler from '@/js/patternHandler';

Vue.use(Vuex);

const USERNAME_KEY = 'currentUserFullName';

const types = {
  LOGIN_USER: 'loginUser',
  LOGOUT_USER: 'logoutUser',
  LOAD_PATTERNS: 'loadPatterns',
};

export { types };
export default new Vuex.Store({
  state: {
    userFullName: localStorage.getItem(USERNAME_KEY),
    patterns: null,
  },
  getters: {
    userDisplayName: (state) => {
      return state.userFullName;
    },
    patterns: (state) => {
      return state.patterns;
    },
  },
  mutations: {
    [types.LOGIN_USER](state, userFullName) {
      state.userFullName = userFullName;
      localStorage.setItem(USERNAME_KEY, userFullName);
    },
    [types.LOGOUT_USER](state) {
      state.userFullName = undefined;
      localStorage.removeItem(USERNAME_KEY);
    },
    [types.LOAD_PATTERNS](state, patterns) {
      state.patterns = patterns
        .sort((patternA, patternB) => {
          return patternB.updated - patternA.updated;
        })
        .map((pattern) => {
          return { ...pattern, updated: moment(pattern.updated).fromNow() };
        });
    },
  },
  actions: {
    loadPatterns(context) {
      PatternHandler.getPatterns().then((patterns) => {
        context.commit(types.LOAD_PATTERNS, patterns);
      });
    },
  },
});

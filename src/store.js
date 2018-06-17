import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

import PatternHandler from '@/js/patternHandler';
import router from '@/router';

Vue.use(Vuex);

const USERNAME_KEY = 'currentUserFullName';

const types = {
  LOGIN_USER: 'loginUser',
  LOGOUT_USER: 'logoutUser',
  LOAD_PATTERNS: 'loadPatterns',
  LOAD_PATTERN: 'loadPattern',
};

export { types };
export default new Vuex.Store({
  state: {
    userFullName: localStorage.getItem(USERNAME_KEY),
    patterns: null,
    pattern: null,
  },
  getters: {
    userDisplayName: (state) => {
      return state.userFullName;
    },
    patterns: (state) => {
      return state.patterns;
    },
    pattern: (state) => {
      return state.pattern;
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
    [types.LOAD_PATTERN](state, pattern) {
      state.pattern = pattern;
    },
  },
  actions: {
    [types.LOAD_PATTERNS](context) {
      PatternHandler.getPatterns().then((patterns) => {
        context.commit(types.LOAD_PATTERNS, patterns);
      }, (error) => {
        console.error('Error loading patterns', error);
        if (!context.getters.userDisplayName) {
          router.push({ name: 'home' });
        }
      });
    },
    [types.LOAD_PATTERN](context, patternId) {
      PatternHandler.loadPattern(patternId).then((pattern) => {
        context.commit(types.LOAD_PATTERN, pattern);
      }, (error) => {
        console.error('Error loading single pattern', error);
        if (!context.getters.userDisplayName) {
          router.push({ name: 'home' });
        }
      });
    },
  },
});

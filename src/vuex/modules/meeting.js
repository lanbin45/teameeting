import '../localStorage/class';

const moduleMeet = {
  state: {
    forceRefresh: localStorage.getItem('forceRefresh') ? JSON.parse(localStorage.getItem('forceRefresh')) : false
  },
  actions: {
    setForceRefrech ({ commit }, bForce) {
      commit('setForceRefrech', bForce);
    },
    clearUserInfo({ commit }) {
      commit('clearUserInfo');
    },
  },
  mutations: {
    setForceRefrech (state, bForce) {
      state.forceRefresh = bForce;
      localStorage.setItem('forceRefresh', bForce);
    },
    clearUserInfo (state) {
      state.forceRefresh = false;
      localStorage.setItem('forceRefresh', false);
    }
  },
  getters: {
    getForceRefresh: state => {
      return state.forceRefresh;
    }
  }
}

export default moduleMeet;


// WEBPACK FOOTER //
// ./src/vuex/modules/meeting.js
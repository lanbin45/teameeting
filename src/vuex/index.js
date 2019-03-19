import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import moduleLogiin from './modules/login'
import moduleMeet from './modules/meeting'

const store = new Vuex.Store({
  modules: {
    lg: moduleLogiin,
    meet: moduleMeet
  },
})

export default store;



// WEBPACK FOOTER //
// ./src/vuex/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  postIds: [],
  authenticate: {},
  message: ''
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
  }
})

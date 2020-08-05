import axios from 'axios'

export default {
  async authenticate ({ commit }, { username, password }) {
    try {
      const authenticated = await axios.post('/api/authenticate', {
        username, password
      })
      commit('SET_AUTH', authenticated)
    } catch (err) {
      console.warn('鉴权接口调用失败')
      throw Error(err)
    }
  },
  TEST_ACTION ({ commit }, logger) {
    commit('TEST_MUTATION', logger)
  }
}

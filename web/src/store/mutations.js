export default {
  SET_POST (state, post) {
    state.postIds.push(post.id)
  },
  SET_AUTH (state, authenticate) {
    Object.assign(state.authenticate, authenticate)
  },
  TEST_MUTATION (state, message) {
    state.message = message || ''
  }
}

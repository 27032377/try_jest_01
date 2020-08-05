import mutations from '@/store/mutations'

describe('SET_POST', () => {
  it('add a post to the state', () => {
    const post = { id: 1 }
    const state = {
      postIds: []
    }
    mutations.SET_POST(state, post)
    expect(state).toEqual({
      postIds: [1]
    })
  })
})

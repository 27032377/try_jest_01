import actions from '@/store/actions.js'

let url, body

jest.mock('axios', () => {
  return {
    post (_url, _data) {
      url = _url
      body = _data
      return Promise.resolve(true)
    }
  }
})

describe('authenticate', () => {
  const commit = jest.fn()
  const username = 'a'
  const password = 'b'

  it('test actions', async () => {
    await actions.authenticate({ commit }, { username, password })
    expect.assertions(3)
    expect(url).toBe('/api/authenticate')
    expect(body).toEqual({ username, password })
    expect(commit).toHaveBeenCalledWith('SET_AUTH', true)
  })
})
